(function (Class, alias, arraySlice, arrayFrom, global) {

    function makeCtor() {
        function constructor() {
            return this.constructor.apply(this, arguments) || null;
        }
        return constructor;
    }

    var Manager = Box.ClassManager = {

        classes: {},

        existCache: {},

        fileCache: {},

        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {},
            nameToAlternates: {}
        },

        namespaceRewrites: [{
            from: 'Box.',
            to: Box
        }],

        enableNamespaceParseCache: true,

        namespaceParseCache: {},

        instantiators: [],

        isCreated: function (className) {
            var existCache = this.existCache,
                i, ln, part, root, parts;

            if (typeof className != 'string' || className.length < 1) {
                throw new Error("[Box.ClassManager] Invalid classname, must be a string and must not be empty");
            }

            if (Box.String.has(className, '!')) {
                return this.fileCache[className] !== undefined;
            }

            if (this.classes[className] || existCache[className]) {
                return true;
            }
            root = global;
            parts = this.parseNamespace(className);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];
                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }
                    root = root[part];
                }
            }
            existCache[className] = true;
            this.triggerCreated(className);
            return true;
        },

        createdListeners: [],

        nameCreatedListeners: {},

        triggerCreated: function (className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                alternateNames = this.maps.nameToAlternates[className],
                names = [className],
                i, ln, j, subLn, listener, name;

            for (i = 0, ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope, className);
            }

            if (alternateNames) {
                names.push.apply(names, alternateNames);
            }

            for (i = 0, ln = names.length; i < ln; i++) {
                name = names[i];
                listeners = nameListeners[name];

                if (listeners) {
                    for (j = 0, subLn = listeners.length; j < subLn; j++) {
                        listener = listeners[j];
                        listener.fn.call(listener.scope, name);
                    }
                    delete nameListeners[name];
                }
            }
        },

        onCreated: function (fn, scope, className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                listener = {
                    fn: fn,
                    scope: scope
                };

            if (className) {
                if (this.isCreated(className)) {
                    fn.call(scope, className);
                    return;
                }

                if (!nameListeners[className]) {
                    nameListeners[className] = [];
                }

                nameListeners[className].push(listener);
            }
            else {
                listeners.push(listener);
            }
        },

        parseNamespace: function (namespace) {
            if (typeof namespace != 'string') {
                throw new Error("[Box.ClassManager] Invalid namespace, must be a string");
            }

            var cache = this.namespaceParseCache,
                parts,
                rewrites,
                root,
                name,
                rewrite, from, to, i, ln;

            if (this.enableNamespaceParseCache) {
                if (cache.hasOwnProperty(namespace)) {
                    return cache[namespace];
                }
            }

            parts = [];
            rewrites = this.namespaceRewrites;
            root = global;
            name = namespace;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (name === from || name.substring(0, from.length) === from) {
                    name = name.substring(from.length);

                    if (typeof to != 'string') {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(name.split('.'));

            if (this.enableNamespaceParseCache) {
                cache[namespace] = parts;
            }

            return parts;
        },

        setNamespace: function (name, value) {
            var root = global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;

            for (i = 0; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },

        createNamespaces: function () {
            var root = global,
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (typeof part != 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        set: function (name, value) {
            if (Box.String.has(name, '!')) {
                this.fileCache[name] = value;
                return this;
            }
            var me = this,
                maps = me.maps,
                nameToAlternates = maps.nameToAlternates,
                targetName = me.getName(value),
                alternates;

            me.classes[name] = me.setNamespace(name, value);

            if (targetName && targetName !== name) {
                maps.alternateToName[name] = targetName;
                alternates = nameToAlternates[targetName] || (nameToAlternates[targetName] = []);
                alternates.push(name);
            }

            return this;
        },

        get: function (name) {
            var classes = this.classes,
                root,
                parts,
                part, i, ln;

            if (Box.String.has(name, '!')) {
                return this.fileCache[name];
            }
            if (classes[name]) {
                return classes[name];
            }

            root = global;
            parts = this.parseNamespace(name);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return null;
                    }

                    root = root[part];
                }
            }

            return root;
        },

        setAlias: function (cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className;

            if (typeof cls == 'string') {
                className = cls;
            } else {
                className = this.getName(cls);
            }

            if (alias && aliasToNameMap[alias] !== className) {
                if (aliasToNameMap[alias] && Box.isDefined(global.console)) {
                    global.console.log("[Box.ClassManager] Overriding existing alias: '" + alias + "' " +
                    "of: '" + aliasToNameMap[alias] + "' with: '" + className + "'. Be sure it's intentional.");
                }

                aliasToNameMap[alias] = className;
            }

            if (!nameToAliasesMap[className]) {
                nameToAliasesMap[className] = [];
            }

            if (alias) {
                Box.Array.include(nameToAliasesMap[className], alias);
            }

            return this;
        },

        addNameAliasMappings: function (aliases) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className, aliasList, alias, i;

            for (className in aliases) {
                aliasList = nameToAliasesMap[className] ||
                (nameToAliasesMap[className] = []);

                for (i = 0; i < aliases[className].length; i++) {
                    alias = aliases[className][i];
                    if (!aliasToNameMap[alias]) {
                        aliasToNameMap[alias] = className;
                        aliasList.push(alias);
                    }
                }

            }
            return this;
        },

        addNameAlternateMappings: function (alternates) {
            var alternateToName = this.maps.alternateToName,
                nameToAlternates = this.maps.nameToAlternates,
                className, aliasList, alternate, i;

            for (className in alternates) {
                aliasList = nameToAlternates[className] ||
                (nameToAlternates[className] = []);

                for (i = 0; i < alternates[className].length; i++) {
                    alternate = alternates[className][i];
                    if (!alternateToName[alternate]) {
                        alternateToName[alternate] = className;
                        aliasList.push(alternate);
                    }
                }

            }
            return this;
        },

        getByAlias: function (alias) {
            return this.get(this.getNameByAlias(alias));
        },

        getNameByAlias: function (alias) {
            return this.maps.aliasToName[alias] || '';
        },

        getNameByAlternate: function (alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        getAliasesByName: function (name) {
            return this.maps.nameToAliases[name] || [];
        },

        getName: function (object) {
            return object && object.$className || '';
        },

        getClass: function (object) {
            return object && object.self || null;
        },

        create: function (className, data, createdFn) {
            if (className != null && typeof className != 'string') {
                throw new Error("[Box.define] Invalid class name '" + className + "' specified, must be a non-empty string");
            }

            var ctor = makeCtor();
            if (typeof data == 'function') {
                data = data(ctor);
            }

            if (className) {
                ctor.displayName = className;
            }

            data.$className = className;

            return new Class(ctor, data, function () {
                var postprocessorStack = data.postprocessors || Manager.defaultPostprocessors,
                    registeredPostprocessors = Manager.postprocessors,
                    postprocessors = [],
                    postprocessor, i, ln, j, subLn, postprocessorProperties, postprocessorProperty;

                delete data.postprocessors;

                for (i = 0, ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];

                    if (typeof postprocessor == 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        postprocessorProperties = postprocessor.properties;

                        if (postprocessorProperties === true) {
                            postprocessors.push(postprocessor.fn);
                        }
                        else if (postprocessorProperties) {
                            for (j = 0, subLn = postprocessorProperties.length; j < subLn; j++) {
                                postprocessorProperty = postprocessorProperties[j];

                                if (data.hasOwnProperty(postprocessorProperty)) {
                                    postprocessors.push(postprocessor.fn);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        postprocessors.push(postprocessor);
                    }
                }

                data.postprocessors = postprocessors;
                data.createdFn = createdFn;
                Manager.processCreate(className, this, data);
            });
        },

        processCreate: function (className, cls, clsData) {
            var me = this,
                postprocessor = clsData.postprocessors.shift(),
                createdFn = clsData.createdFn;

            if (!postprocessor) {

                if (className) {
                    me.set(className, cls);
                }

                if (createdFn) {
                    createdFn.call(cls, cls);
                }

                if (className) {
                    me.triggerCreated(className);
                }
                return;
            }

            if (postprocessor.call(me, className, cls, clsData, me.processCreate) !== false) {
                me.processCreate(className, cls, clsData);
            }
        },

        createOverride: function (className, data, createdFn) {
            var me = this,
                overriddenClassName = data.override,
                requires = data.requires,
                uses = data.uses,
                classReady = function () {
                    var cls, temp;

                    if (requires) {
                        temp = requires;
                        requires = null;
                        Box.Loader.require(temp, classReady);
                    } else {

                        cls = me.get(overriddenClassName);

                        delete data.override;
                        delete data.requires;
                        delete data.uses;

                        Box.override(cls, data);

                        me.triggerCreated(className);

                        if (uses) {
                            Box.Loader.addUsedClasses(uses);
                        }

                        if (createdFn) {
                            createdFn.call(cls);
                        }
                    }
                };

            me.existCache[className] = true;

            me.onCreated(classReady, me, overriddenClassName);

            return me;
        },

        instantiateByAlias: function () {
            var alias = arguments[0],
                args = arraySlice.call(arguments),
                className = this.getNameByAlias(alias);

            if (!className) {
                className = this.maps.aliasToName[alias];

                if (!className) {
                    throw new Error("[Box.createByAlias] Cannot create an instance of unrecognized alias: " + alias);
                }
                if (global.console) {
                    /*global.console.warn("[Box.Loader] Synchronously loading '" + className + "'; consider adding " +
                    "Box.require('" + alias + "') above Box.onReady");*/
                }
                Box.requireSync(className);
            }

            args[0] = className;

            return this.instantiate.apply(this, args);
        },

        instantiate: function () {
            var name = arguments[0],
                nameType = typeof name,
                args = arraySlice.call(arguments, 1),
                alias = name,
                possibleName, cls;

            if (nameType != 'function') {
                if (nameType != 'string' && args.length === 0) {
                    args = [name];
                    name = name.xclass;
                }
                if (typeof name != 'string' || name.length < 1) {
                    throw new Error("[Box.create] Invalid class name or alias '" + name + "' specified, must be a non-empty string");
                }
                cls = this.get(name);
            }
            else {
                cls = name;
            }

            if (!cls) {
                possibleName = this.getNameByAlias(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            if (!cls) {
                possibleName = this.getNameByAlternate(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            if (!cls) {
                if (global.console) {
                    /*global.console.warn("[Box.Loader] Synchronously loading '" + name + "'; consider adding " +
                    "Box.require('" + ((possibleName) ? alias : name) + "') above Box.onReady");*/
                }
                Box.requireSync(name);

                cls = this.get(name);
            }

            if (!cls) {
                throw new Error("[Box.create] Cannot create an instance of unrecognized class name / alias: " + alias);
            }

            if (typeof cls != 'function') {
                throw new Error("[Box.create] '" + name + "' is a singleton and cannot be instantiated");
            }

            return this.getInstantiator(args.length)(cls, args);
        },

        dynInstantiate: function (name, args) {
            args = arrayFrom(args, true);
            args.unshift(name);

            return this.instantiate.apply(this, args);
        },

        getInstantiator: function (length) {
            var instantiators = this.instantiators,
                instantiator,
                i,
                args;

            instantiator = instantiators[length];

            if (!instantiator) {
                i = length;
                args = [];

                for (i = 0; i < length; i++) {
                    args.push('a[' + i + ']');
                }

                instantiator = instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ')');
                instantiator.displayName = "Box.ClassManager.instantiate" + length;
            }

            return instantiator;
        },

        postprocessors: {},

        defaultPostprocessors: [],

        registerPostprocessor: function (name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }
            if (!properties) {
                properties = [name];
            }
            this.postprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };
            this.setDefaultPostprocessorPosition(name, position, relativeTo);
            return this;
        },

        setDefaultPostprocessors: function (postprocessors) {
            this.defaultPostprocessors = arrayFrom(postprocessors);
            return this;
        },

        setDefaultPostprocessorPosition: function (name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);
                    return this;
                } else if (offset === 'last') {
                    defaultPostprocessors.push(name);
                    return this;
                }
                offset = (offset === 'after') ? 1 : -1;
            }

            index = Box.Array.indexOf(defaultPostprocessors, relativeName);
            if (index !== -1) {
                Box.Array.splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }
            return this;
        },

        getNamesByExpression: function (expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;

            if (typeof expression != 'string' || expression.length < 1) {
                throw new Error("[Box.ClassManager.getNamesByExpression] Expression " + expression + " is invalid, must be a non-empty string");
            }

            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');

                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];

                        if (name.search(regex) !== -1) {
                            names.push(name);
                        } else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];
                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                possibleName = this.getNameByAlias(expression);

                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);

                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }

            return names;
        }

    };

    Manager.registerPostprocessor('alias', function (name, cls, properties) {
        var aliases = properties.alias,
            i, len;

        for (i = 0, len = aliases.length; i < len; i++) {
            alias = aliases[i];
            this.setAlias(cls, alias);
        }
    }, ['xtype', 'alias']);

    Manager.registerPostprocessor('singleton', function (name, cls, properties, fn) {
        if (properties.singleton) {
            fn.call(this, name, (cls = new cls()), properties);
        } else {
            return true;
        }
        return false;
    });

    Manager.registerPostprocessor('alternateClassName', function (name, cls, properties) {
        var alternates = properties.alternateClassName, i, len, alternate;

        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }
        for (i = 0, len = alternates.length; i < len; i++) {
            alternate = alternates[i];
            if (typeof alternate != 'string') {
                throw new Error("[Box.define] Invalid alternate of: '" + alternate + "' for class: '" + name + "'; must be a valid string");
            }
            this.set(alternate, cls);
        }
    });

    Box.apply(Box, {

        create: alias(Manager, 'instantiate'),

        createByAlias: alias(Manager, 'instantiateByAlias'),

        define: function (className, data, createdFn) {
            if (!Box.String.startsWith(className, 'Box.')) {
                var appName = Box.app.Application.name + ".";
                if (!Box.String.startsWith(className, appName)) {
                    Box.Error('the module name [' + className + '] is error, ' +
                        'module name must start with [' + appName + ']');
                }
            }
            if (data.override) {
                return Manager.createOverride.apply(Manager, arguments);
            }
            return Manager.create.apply(Manager, arguments);
        },

        getClassName: alias(Manager, 'getName'),

        getDisplayName: function(object) {
            if (object) {
                if (object.displayName) {
                    return object.displayName;
                }

                if (object.$name && object.$class) {
                    return Box.getClassName(object.$class) + '#' + object.$name;
                }

                if (object.$className) {
                    return object.$className;
                }
            }

            return 'Anonymous';
        },

        getClass: alias(Manager, 'getClass')
    });

    Class.registerPreprocessor('className', function (cls, properties) {
        if (properties.$className) {
            cls.$className = properties.$className;
            cls.displayName = cls.$className;
        }
    }, true, 'first');

})(Box.Class, Box.Function.alias, Array.prototype.slice, Box.Array.from, Box.global);