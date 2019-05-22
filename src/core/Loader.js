Box.Loader = new function () {

    var Loader = this,
        Manager = Box.ClassManager,
        Class = Box.Class,
        flexSetter = Box.Function.flexSetter,
        alias = Box.Function.alias,
        pass = Box.Function.pass,
        defer = Box.Function.defer,
        arrayErase = Box.Array.erase,

        isNonBrowser = typeof window == 'undefined',
        isNodeJS = isNonBrowser && (typeof require == 'function'),
        isJsdb = isNonBrowser && typeof system != 'undefined' && system.program.search(/jsdb/) !== -1,
        isPhantomJS = (typeof phantom != 'undefined' && phantom.fs),

        dependencyProperties = ['extend', 'mixins', 'requires', 'branch'],
        isInHistory = {},
        history = [],
        slashDotSlashRe = /\/\.\//g,
        dotRe = /\./g,
        setPathCount = 0;

    Box.apply(Loader, {

        isInHistory: isInHistory,

        history: history,

        namespaces: {},

        collectNamespaces: function (paths) {
            var namespaces = Loader.namespaces,
                path;

            for (path in paths) {
                if (paths.hasOwnProperty(path)) {
                    namespaces[path] = true;
                }
            }
        },

        addNamespaces: function (ns) {
            var namespaces = Loader.namespaces,
                i, l;

            if (!Box.isArray(ns)) {
                ns = [ns];
            }

            for (i = 0, l = ns.length; i < l; i++) {
                namespaces[ns[i]] = true;
            }
        },

        clearNamespaces: function () {
            Loader.namespaces = {};
        },

        getNamespace: function (className) {
            var namespaces = Loader.namespaces,
                deepestPrefix = '',
                prefix;

            for (prefix in namespaces) {
                if (namespaces.hasOwnProperty(prefix) &&
                    prefix.length > deepestPrefix.length &&
                    (prefix + '.' === className.substring(0, prefix.length + 1))) {
                    deepestPrefix = prefix;
                }
            }

            return deepestPrefix === '' ? undefined : deepestPrefix;
        },

        config: {

            enabled: false,

            scriptChainDelay: false,

            disableCaching: true,

            disableCachingParam: '_v',

            garbageCollect: false,

            paths: {
                'Box': '.'
            },

            preserveScripts: true,

            scriptCharset: undefined

        },

        setConfig: function (name, value) {
            if (Box.isObject(name) && arguments.length === 1) {
                Box.merge(Loader.config, name);
                if ('paths' in name) {
                    Loader.collectNamespaces(name.paths);
                }
            } else {
                Loader.config[name] = (Box.isObject(value)) ? Box.merge(Loader.config[name], value) : value;
                if (name === 'paths') {
                    Loader.collectNamespaces(value);
                }
            }
            return Loader;
        },

        getConfig: function (name) {
            if (name) {
                return Loader.config[name];
            }
            return Loader.config;
        },

        addClassPathMappings: function (paths) {
            var name;
            if (setPathCount == 0) {
                Loader.config.paths = paths;
            } else {
                for (name in paths) {
                    Loader.config.paths[name] = paths[name];
                }
            }
            setPathCount++;
            return Loader;
        },

        setPath: flexSetter(function (name, path) {
            Loader.config.paths[name] = path;
            Loader.namespaces[name] = true;
            setPathCount++;
            return Loader;
        }),

        getPath: function (className) {
            var path = '',
                paths = Loader.config.paths,
                prefix = Loader.getPrefix(className);

            if (prefix.length > 0) {
                if (prefix === className) {
                    return paths[prefix];
                }
                path = paths[prefix];
                className = className.substring(prefix.length + 1);
            }
            if (path.length > 0) {
                path += '/';
            }

            return path.replace(slashDotSlashRe, '/') + className.replace(dotRe, '/') + '.js';
        },

        getPrefix: function (className) {
            var paths = Loader.config.paths,
                prefix, deepestPrefix = '';

            if (paths.hasOwnProperty(className)) {
                return className;
            }
            for (prefix in paths) {
                if (paths.hasOwnProperty(prefix) && prefix + '.' === className.substring(0, prefix.length + 1)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }
            return deepestPrefix;
        },

        isAClassNameWithAKnownPrefix: function (className) {
            var prefix = Loader.getPrefix(className);
            return prefix !== '' && prefix !== className;
        },

        require: function (expressions, fn, scope, excludes) {
            fn && fn.call(scope);
        },

        requireSync: function () {
        },

        exclude: function (excludes) {
            return {
                require: function (expressions, fn, scope, excludes) {
                    return Loader.require(expressions, fn, scope, excludes);
                },
                requireSync: function (expressions, fn, scope, excludes) {
                    return Loader.requireSync(expressions, fn, scope, excludes);
                }
            }
        },

        onReady: function (fn, scope, withDomReady) {
            var oldFn;
            if (withDomReady !== false && Box.DOM_QUERY) {
                oldFn = fn;
                fn = function () {
                    Box.DOM_QUERY(document).ready(Box.bind(oldFn, scope))
                }
            }
            fn.call(scope);
        }
    });

    var queue = [],
        isClassFileLoaded = {},
        isFileLoaded = {},
        classNameToFilePathMap = {},
        scriptElements = {},
        readyListeners = [],
        usedClasses = [],
        requiresMap = {},
        requireTypeParses = {},
        comparePriority = function (listenerA, listenerB) {
            return listenerB.priority - listenerA.priority;
        };

    Box.apply(Loader, {

        documentHead: typeof document != 'undefined' && (document.head || document.getElementsByTagName('head')[0]),

        isLoading: false,

        queue: queue,

        isClassFileLoaded: isClassFileLoaded,

        readyListeners: readyListeners,

        optionalRequires: usedClasses,

        requiresMap: requiresMap,

        numPendingFiles: 0,

        numLoadedFiles: 0,

        hasFileLoadError: false,

        classNameToFilePathMap: classNameToFilePathMap,

        scriptsLoading: 0,

        syncModeEnabled: false,

        scriptElements: scriptElements,

        refreshQueue: function () {
            var ln = queue.length,
                i, item, j, requires;

            if (!ln && !Loader.scriptsLoading) {
                return Loader.triggerReady();
            }

            for (i = 0; i < ln; i++) {
                item = queue[i];

                if (item) {
                    requires = item.requires;
                    if (requires.length > Loader.numLoadedFiles) {
                        continue;
                    }

                    for (j = 0; j < requires.length;) {
                        if (Manager.isCreated(requires[j])) {
                            item.objects = item.objects || [];
                            item.objects.push(Manager.get(requires[j]));
                            arrayErase(requires, j, 1);
                        } else {
                            j++;
                        }
                    }

                    if (item.requires.length === 0) {
                        arrayErase(queue, i, 1);
                        item.callback.apply(item.scope, item.objects || []);
                        Loader.refreshQueue();
                        break;
                    }
                }
            }

            return Loader;
        },

        injectScriptElement: function (url, onLoad, onError, scope, charset) {
            var script = document.createElement('script'),
                dispatched = false,
                config = Loader.config,
                onLoadFn = function () {
                    if (!dispatched) {
                        dispatched = true;
                        script.onload = script.onreadystatechange = script.onerror = null;
                        if (typeof config.scriptChainDelay == 'number') {
                            defer(onLoad, config.scriptChainDelay, scope);
                        } else {
                            onLoad.call(scope);
                        }
                        Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                    }

                },
                onErrorFn = function (arg) {
                    defer(onError, 1, scope);
                    Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                };

            script.type = 'text/javascript';
            script.onerror = onErrorFn;
            charset = charset || config.scriptCharset;
            if (charset) {
                script.charset = charset;
            }

            if ('addEventListener' in script) {
                script.onload = onLoadFn;
            } else if ('readyState' in script) {
                script.onreadystatechange = function () {
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        onLoadFn();
                    }
                };
            } else {
                script.onload = onLoadFn;
            }

            script.src = url;
            (Loader.documentHead || document.getElementsByTagName('head')[0]).appendChild(script);
            return script;
        },

        removeScriptElement: function (url) {
            if (scriptElements[url]) {
                Loader.cleanupScriptElement(scriptElements[url], true, !!Loader.getConfig('garbageCollect'));
                delete scriptElements[url];
            }

            return Loader;
        },

        cleanupScriptElement: function (script, remove, collect) {
            var prop;
            script.onload = script.onreadystatechange = script.onerror = null;
            if (remove) {
                Box.DOM_QUERY(script).remove();
                if (collect) {
                    for (prop in script) {
                        try {
                            if (prop != 'src') {
                                script[prop] = null;
                            }
                            delete script[prop];
                        } catch (cleanEx) {
                        }
                    }
                }
            }
            return Loader;
        },

        loadScript: function (options) {
            var config = Loader.getConfig(),
                isString = typeof options == 'string',
                url = isString ? options : options.url,
                onError = !isString && options.onError,
                onLoad = !isString && options.onLoad,
                scope = !isString && options.scope,
                src;

            var onScriptError = function () {
                Loader.numPendingFiles--;
                Loader.scriptsLoading--;

                if (onError) {
                    onError.call(scope, "Failed loading '" + url + "', please verify that the file exists");
                }

                if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
                    Loader.refreshQueue();
                }
            };
            var onScriptLoad = function () {
                Loader.numPendingFiles--;
                Loader.scriptsLoading--;

                if (onLoad) {
                    onLoad.call(scope);
                }

                if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
                    Loader.refreshQueue();
                }
            };

            Loader.isLoading = true;
            Loader.numPendingFiles++;
            Loader.scriptsLoading++;

            src = config.disableCaching ?
                (url + '?' + config.disableCachingParam + '=' + Box.AppVersion.Version()) : url;

            scriptElements[url] = Loader.injectScriptElement(src, onScriptLoad, onScriptError);
        },

        //参考资料:http://blog.csdn.net/szwandcj/article/details/50212209
        loadScriptFile: function (url, onLoad, onError, scope, synchronous) {
            if (isFileLoaded[url]) {
                return Loader;
            }

            var config = Loader.getConfig(),
                noCacheUrl = url + (config.disableCaching ? ('?' + config.disableCachingParam + '=' + Box.AppVersion.Version()) : ''),
                isCrossOriginRestricted = false,
                xhr, status, onScriptError,
                debugSourceURL = "";

            scope = scope || Loader;

            Loader.isLoading = true;

            if (!synchronous) {
                onScriptError = function () {
                    onError.call(scope, "Failed loading '" + url + "', please verify that the file exists", synchronous);
                };

                scriptElements[url] = Loader.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
            } else {
                if (typeof XMLHttpRequest != 'undefined') {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                try {
                    xhr.open('GET', noCacheUrl, false);
                    xhr.send(null);
                } catch (e) {
                    isCrossOriginRestricted = true;
                }

                status = (xhr.status === 1223) ? 204 :
                    (xhr.status === 0 && ((self.location || {}).protocol == 'file:' || (self.location || {}).protocol == 'ionp:')) ? 200 : xhr.status;

                isCrossOriginRestricted = isCrossOriginRestricted || (status === 0);

                if (isCrossOriginRestricted && !isPhantomJS) {
                    onError.call(Loader, "Failed loading synchronously via XHR: '" + url + "'; It's likely that the file is either " +
                        "being loaded from a different domain or from the local file system whereby cross origin " +
                        "requests are not allowed due to security reasons. Use asynchronous loading with " +
                        "Box.require instead.", synchronous);
                }
                else if ((status >= 200 && status < 300) || (status === 304) || isPhantomJS) {
                    if (!Box.browser.is.IE) {
                        debugSourceURL = "\n//@ sourceURL=" + url;
                    }
                    Box.globalEval(xhr.responseText + debugSourceURL);
                    onLoad.call(scope);
                }
                else {
                    onError.call(Loader, "Failed loading synchronously via XHR: '" + url + "'; please " +
                        "verify that the file exists. " +
                        "XHR status code: " + status, synchronous);
                }

                xhr = null;
            }
        },

        requireSync: function () {
            var syncModeEnabled = Loader.syncModeEnabled;
            if (!syncModeEnabled) {
                Loader.syncModeEnabled = true;
            }
            var ret = Loader.require.apply(Loader, arguments);
            if (!syncModeEnabled) {
                Loader.syncModeEnabled = false;
            }
            Loader.refreshQueue();
            return ret;
        },

        require: function (expressions, fn, scope, excludes) {
            var excluded = {},
                included = {},
                excludedClassNames = [],
                possibleClassNames = [],
                classNames = [],
                references = [],
                existClassNames = [],
                callback,
                syncModeEnabled,
                filePath, expression, exclude, className,
                possibleClassName, i, j, ln, subLn;

            if (excludes) {
                excludes = (typeof excludes === 'string') ? [excludes] : excludes;
                for (i = 0, ln = excludes.length; i < ln; i++) {
                    exclude = excludes[i];
                    if (typeof exclude == 'string' && exclude.length > 0) {
                        excludedClassNames = Manager.getNamesByExpression(exclude);
                        for (j = 0, subLn = excludedClassNames.length; j < subLn; j++) {
                            excluded[excludedClassNames[j]] = true;
                        }
                    }
                }
            }

            expressions = (typeof expressions === 'string') ? [expressions] : (expressions ? expressions : []);

            if (fn) {
                callback = function () {
                    var classes = [], i, ln;
                    for (i = 0, ln = references.length; i < ln; i++) {
                        classes.push(Manager.get(references[i]));
                    }
                    return fn.apply(this, classes);
                };
            } else {
                callback = Box.emptyFn;
            }

            scope = scope || Box.global;

            for (i = 0, ln = expressions.length; i < ln; i++) {
                expression = expressions[i];

                if (typeof expression == 'string' && expression.length > 0) {
                    possibleClassNames = Manager.getNamesByExpression(expression);
                    subLn = possibleClassNames.length;

                    for (j = 0; j < subLn; j++) {
                        possibleClassName = possibleClassNames[j];

                        if (excluded[possibleClassName] !== true) {
                            references.push(possibleClassName);

                            if (!Manager.isCreated(possibleClassName) && !included[possibleClassName]) {
                                included[possibleClassName] = true;
                                classNames.push(possibleClassName);
                            }
                        }
                    }
                }
            }

            if (classNames.length > 0) {
                if (!Loader.config.enabled) {
                    throw new Error("Box.Loader is not enabled, so dependencies cannot be resolved dynamically. " +
                        "Missing required class" + ((classNames.length > 1) ? "es" : "") + ": " + classNames.join(', '));
                }
            } else {
                callback.call(scope);
                if (references.length == 1) {
                    return Manager.get(references[0]);
                }
                return Loader;
            }

            syncModeEnabled = Loader.syncModeEnabled;

            if (!syncModeEnabled) {
                queue.push({
                    requires: classNames.slice(),
                    callback: callback,
                    scope: scope
                });
            }

            ln = classNames.length;

            for (i = 0; i < ln; i++) {
                className = classNames[i];
                var loader = Loader.resolve(className);
                loader.exec(className);
            }

            if (syncModeEnabled) {
                callback.call(scope);
                if (ln === 1) {
                    return Manager.get(className);
                }
            }
            return Loader;
        },

        resolve: function (className) {
            var type = 'js';
            if (Box.String.has(className, '!')) {
                type = className.split('!')[0];
            }
            return {
                type: type,
                exec: requireTypeParses[type]
            };
        },

        onFileLoaded: function (className, filePath) {
            var loaded = isClassFileLoaded[className];
            Loader.numLoadedFiles++;

            isClassFileLoaded[className] = true;
            isFileLoaded[filePath] = true;

            if (!loaded) {
                Loader.numPendingFiles--;
            }

            if (Loader.numPendingFiles === 0) {
                Loader.refreshQueue();
            }

            if (!Loader.syncModeEnabled && Loader.numPendingFiles === 0 && Loader.isLoading && !Loader.hasFileLoadError) {
                var missingClasses = [],
                    missingPaths = [],
                    requires,
                    i, ln, j, subLn;

                for (i = 0, ln = queue.length; i < ln; i++) {
                    requires = queue[i].requires;

                    for (j = 0, subLn = requires.length; j < subLn; j++) {
                        if (isClassFileLoaded[requires[j]]) {
                            missingClasses.push(requires[j]);
                        }
                    }
                }

                if (missingClasses.length < 1) {
                    return;
                }

                missingClasses = Box.Array.filter(Box.Array.unique(missingClasses), function (item) {
                    return !requiresMap.hasOwnProperty(item);
                }, Loader);

                if (missingClasses.length < 1) {
                    return;
                }

                for (i = 0, ln = missingClasses.length; i < ln; i++) {
                    missingPaths.push(classNameToFilePathMap[missingClasses[i]]);
                }

                throw new Error("The following classes are not declared even if their files have been " +
                    "loaded: '" + missingClasses.join("', '") + "'. Please check the source code of their " +
                    "corresponding files for possible typos: '" + missingPaths.join("', '"));
            }
        },

        onFileLoadError: function (className, filePath, errorMessage, isSynchronous) {
            Loader.numPendingFiles--;
            Loader.hasFileLoadError = true;
            throw new Error("[Box.Loader] " + errorMessage);
        },

        addUsedClasses: function (classes) {
            var cls, i, ln;
            if (classes) {
                classes = (typeof classes == 'string') ? [classes] : classes;
                for (i = 0, ln = classes.length; i < ln; i++) {
                    cls = classes[i];
                    if (typeof cls == 'string' && !Box.Array.contains(usedClasses, cls)) {
                        usedClasses.push(cls);
                    }
                }
            }
            return Loader;
        },

        registerRequireTypeParse: function (type, exec) {
            requireTypeParses[type] = exec;
        },

        triggerReady: function () {
            var listener,
                refClasses = usedClasses;

            if (Loader.isLoading) {
                Loader.isLoading = false;

                if (refClasses.length !== 0) {
                    refClasses = refClasses.slice();
                    usedClasses.length = 0;
                    Loader.require(refClasses, Loader.triggerReady, Loader);
                    return Loader;
                }
            }

            Box.Array.sort(readyListeners, comparePriority);

            while (readyListeners.length && !Loader.isLoading) {
                listener = readyListeners.shift();
                listener.fn.call(listener.scope);
            }

            return Loader;
        },

        onReady: function (fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Box.DOM_QUERY) {
                oldFn = fn;
                fn = function () {
                    Box.DOM_QUERY(document).ready(Box.bind(oldFn, scope))
                }
            }

            if (!Loader.isLoading) {
                fn.call(scope);
            } else {
                readyListeners.push({
                    fn: fn,
                    scope: scope,
                    priority: (options && options.priority) || 0
                });
            }
        },

        historyPush: function (className) {
            if (className && isClassFileLoaded.hasOwnProperty(className) && !isInHistory[className]) {
                isInHistory[className] = true;
                history.push(className);
            }
            return Loader;
        }

    });

    Box.require = alias(Loader, 'require');

    Box.requireSync = alias(Loader, 'requireSync');

    Box.exclude = alias(Loader, 'exclude');

    Box.onReady = function (fn, scope, options) {
        Loader.onReady(fn, scope, true, options);
    };

    Class.registerPreprocessor('loader', function (cls, data, hooks, continueFn) {
        var me = this,
            dependencies = [],
            dependency,
            className = Manager.getName(cls),
            i, j, ln, subLn, value, propertyName, propertyValue,
            requiredMap, requiredDep;

        for (i = 0, ln = dependencyProperties.length; i < ln; i++) {
            propertyName = dependencyProperties[i];

            if (data.hasOwnProperty(propertyName)) {
                propertyValue = data[propertyName];

                if (typeof propertyValue == 'string') {
                    dependencies.push(propertyValue);
                } else if (propertyValue instanceof Array) {
                    for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                        value = propertyValue[j];

                        if (typeof value == 'string') {
                            dependencies.push(value);
                        }
                    }
                } else if (typeof propertyValue != 'function') {
                    for (j in propertyValue) {
                        if (propertyValue.hasOwnProperty(j)) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                dependencies.push(value);
                            }
                        }
                    }
                }
            }
        }

        if (dependencies.length === 0) {
            return;
        }

        var deadlockPath = [],
            detectDeadlock;

        if (className) {
            requiresMap[className] = dependencies;
            requiredMap = Loader.requiredByMap || (Loader.requiredByMap = {});

            for (i = 0, ln = dependencies.length; i < ln; i++) {
                dependency = dependencies[i];
                (requiredMap[dependency] || (requiredMap[dependency] = [])).push(className);
            }
            detectDeadlock = function (cls) {
                deadlockPath.push(cls);

                if (requiresMap[cls]) {
                    if (Box.Array.contains(requiresMap[cls], className)) {
                        throw new Error("Deadlock detected while loading dependencies! '" + className + "' and '" +
                            deadlockPath[1] + "' " + "mutually require each other. Path: " +
                            deadlockPath.join(' -> ') + " -> " + deadlockPath[0]);
                    }

                    for (i = 0, ln = requiresMap[cls].length; i < ln; i++) {
                        detectDeadlock(requiresMap[cls][i]);
                    }
                }
            };

            detectDeadlock(className);
        }

        Loader.require(dependencies, function () {
            for (i = 0, ln = dependencyProperties.length; i < ln; i++) {
                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {
                    propertyValue = data[propertyName];

                    if (typeof propertyValue == 'string') {
                        data[propertyName] = Manager.get(propertyValue);
                    }
                    else if (propertyValue instanceof Array) {
                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                data[propertyName][j] = Manager.get(value);
                            }
                        }
                    }
                    else if (typeof propertyValue != 'function') {
                        for (var k in propertyValue) {
                            if (propertyValue.hasOwnProperty(k)) {
                                value = propertyValue[k];

                                if (typeof value == 'string') {
                                    data[propertyName][k] = Manager.get(value);
                                }
                            }
                        }
                    }
                }
            }
            continueFn.call(me, cls, data, hooks);
        });
        return false;
    }, true, 'after', 'className');

    Manager.registerPostprocessor('uses', function (name, cls, data) {
        var uses = data.uses;
        if (uses) {
            Loader.addUsedClasses(uses);
        }
    });

    Manager.onCreated(Loader.historyPush);
};

Box.Loader.setConfig({
    enabled: true,
    disableCaching: (/[?&](?:cache|disableCacheBuster)\b/i.test(location.search) || /(^|[ ;])ext-cache=1/.test(document.cookie)) ? false : true,
    paths: {
        'Box': 'src'
    }
});
