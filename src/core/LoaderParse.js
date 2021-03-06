(function () {

    var Loader = Box.Loader;
    var pass = Box.Function.pass;
    var isClassFileLoaded = Loader.isClassFileLoaded;
    var classNameToFilePathMap = Loader.classNameToFilePathMap;

    function httpRequest(url, callback) {
        var xhr = Box.global.XMLHttpRequest ?
            new Box.global.XMLHttpRequest() :
            new Box.global.ActiveXObject("Microsoft.XMLHTTP");

        Loader.numPendingFiles++;

        var argname = "_v";
        while (Box.String.has(url, "?" + argname + "=") || Box.String.has(url, "&" + argname + "=")) {
            argname = argname + "_";
        }
        url += (Box.String.has(url, "?") ? "&" : "?") + argname + "=" + Box.AppVersion.Version();


        xhr.open("GET", url, false);
        xhr.send(null);

        var status = (xhr.status === 1223) ? 204 : xhr.status === 0 ? 200 : xhr.status;
        callback(xhr.responseText);
        Loader.numLoadedFiles++;
        Loader.numPendingFiles--;
        if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
            Loader.refreshQueue();
        }
    }

    function jsEscape(content) {
        return content.replace(/(["\\])/g, "\\$1")
            .replace(/[\f]/g, "\\f")
            .replace(/[\b]/g, "\\b")
            .replace(/[\n]/g, "\\n")
            .replace(/[\t]/g, "\\t")
            .replace(/[\r]/g, "\\r")
            .replace(/[\u2028]/g, "\\u2028")
            .replace(/[\u2029]/g, "\\u2029");
    }

    function loadFileToSet(className, callback) {
        if (!Box.String.has(className, '!')) {
            return;
        }
        var filePath = className.split('!')[1];
        httpRequest(filePath, function (content) {
            Box.ClassManager.set(className, (function () {
                return callback.call(Loader, content);
            })());
        });
    }

    Loader.registerRequireTypeParse('js', function (className) {
        var filePath = Loader.getPath(className);
        var syncModeEnabled = Loader.syncModeEnabled;
        if (syncModeEnabled && isClassFileLoaded.hasOwnProperty(className)) {
            if (!isClassFileLoaded[className]) {
                Loader.numPendingFiles--;
                Loader.removeScriptElement(filePath);
                delete isClassFileLoaded[className];
            }
        }
        if (!isClassFileLoaded.hasOwnProperty(className)) {
            isClassFileLoaded[className] = false;
            classNameToFilePathMap[className] = filePath;

            Loader.numPendingFiles++;
            Loader.loadScriptFile(
                filePath,
                pass(Loader.onFileLoaded, [className, filePath], Loader),
                pass(Loader.onFileLoadError, [className, filePath], Loader),
                Loader,
                syncModeEnabled
            );
        }
    });

    Loader.registerRequireTypeParse('text', function (className) {
        loadFileToSet(className, function (content) {
            return content;
        });
    });

    Loader.registerRequireTypeParse('json', function (className) {
        loadFileToSet(className, function (content) {
            return Box.globalEval('(' + content + ')');
        });
    });

    Loader.registerRequireTypeParse('handlebars', function (className) {
        loadFileToSet(className, function (content) {
            return Handlebars.compile(content);
        });
    });

})();