Box.define('Box.env.Browser', {

    statics: {

        browserNames: {
            ie: 'IE',
            firefox: 'Firefox',
            safari: 'Safari',
            chrome: 'Chrome',
            opera: 'Opera',
            other: 'Other'
        },

        engineNames: {
            webkit: 'WebKit',
            gecko: 'Gecko',
            presto: 'Presto',
            trident: 'Trident',
            other: 'Other'
        },

        enginePrefixes: {
            webkit: 'AppleWebKit/',
            gecko: 'Gecko/',
            presto: 'Presto/',
            trident: 'Trident/'
        },

        browserPrefixes: {
            ie: 'MSIE ',
            firefox: 'Firefox/',
            chrome: 'Chrome/',
            safari: 'Version/',
            opera: 'Opera/'
        }

    },

    isSecure: /^https/i.test(Box.global.location.protocol),

    isStrict: Box.global.document.compatMode === "CSS1Compat",

    name: null,

    engineName: null,

    is: Box.emptyFn,

    constructor: function () {

        var userAgent = this.userAgent = Box.global.navigator.userAgent,
            selfClass = this.statics(),
            browserMatch = userAgent.match(new RegExp('((?:' + Box.Object.getValues(selfClass.browserPrefixes).join(')|(?:') + '))([\\d\\._]+)')),
            engineMatch = userAgent.match(new RegExp('((?:' + Box.Object.getValues(selfClass.enginePrefixes).join(')|(?:') + '))([\\d\\._]+)')),
            browserName = selfClass.browserNames.other,
            browserVersion = '',
            engineName = selfClass.engineNames.other,
            engineVersion = '',
            key, value;

        this.is = function (name) {
            return this.is[name] === true;
        };

        if (browserMatch) {
            browserName = selfClass.browserNames[Box.Object.getKey(selfClass.browserPrefixes, browserMatch[1])];
            browserVersion = browserMatch[2];
        }

        if (engineMatch) {
            engineName = selfClass.engineNames[Box.Object.getKey(selfClass.enginePrefixes, engineMatch[1])];
            engineVersion = engineMatch[2];
        }

        Box.apply(this, {
            name: browserName,
            engineVersion: Box.String.parseVersion(engineVersion),
            engineName: engineName,
            version: Box.String.parseVersion(browserVersion)
        });

        this.is[this.name] = true;
        this.is[this.name + (this.version.major || '')] = true;
        this.is[this.name + this.version.shortVersion] = true;

        for (key in selfClass.browserNames) {
            if (selfClass.browserNames.hasOwnProperty(key)) {
                value = selfClass.browserNames[key];
                this.is[value] = (this.name === value);
            }
        }

        this.is[this.name] = true;
        this.is[this.engineName + (this.engineVersion.major || '')] = true;
        this.is[this.engineName + this.engineVersion.shortVersion] = true;

        for (key in selfClass.engineNames) {
            if (selfClass.engineNames.hasOwnProperty(key)) {
                value = selfClass.engineNames[key];
                this.is[value] = (this.engineName === value);
            }
        }

        return this;
    }

}, function () {

    Box.browser = new Box.env.Browser();

    Box.isStrict = Box.browser.isStrict;

});
