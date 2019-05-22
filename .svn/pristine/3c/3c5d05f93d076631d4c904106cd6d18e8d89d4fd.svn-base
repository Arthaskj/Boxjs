Box.define('Box.env.FeatureDetector', {

    statics: {

        tests: {

            Canvas: function () {
                var element = this.getTestElement('canvas');
                return !!(element && element.getContext && element.getContext('2d'));
            },

            SVG: function () {
                var doc = Box.global.document;

                return !!(doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect);
            },

            VML: function () {
                var element = this.getTestElement(),
                    ret = false;

                element.innerHTML = "<!--[if vml]><br/><br/><![endif]-->";
                ret = (element.childNodes.length === 2);
                element.innerHTML = "";

                return ret;
            },

            Touch: function () {
                return ('ontouchstart' in Box.global) && !(Box.platform && Box.platform.name.match(/Windows|MacOSX|Linux/));
            },

            Orientation: function () {
                return ('orientation' in Box.global);
            },

            Geolocation: function () {
                return !!Box.global.navigator.geolocation;
            },

            SqlDatabase: function () {
                return !!Box.global.openDatabase;
            },

            Websockets: function () {
                return 'WebSocket' in Box.global;
            },

            History: function () {
                return !!(Box.global.history && Box.global.history.pushState);
            },

            CSSTransforms: function () {
                return this.isStyleSupported('transform');
            },

            CSS3DTransforms: function () {
                return this.has('csstransforms') && this.isStyleSupported('perspective');
            },

            CSSAnimations: function () {
                return this.isStyleSupported('animationName');
            },

            CSSTransitions: function () {
                return this.isStyleSupported('transitionProperty');
            },

            Audio: function () {
                return !!this.getTestElement('audio').canPlayType;
            },

            Video: function () {
                return !!this.getTestElement('video').canPlayType;
            }

        },

        stylePrefixes: ['Webkit', 'Moz', 'O', 'ms']

    },

    tests: {},

    testElements: {},

    constructor: function () {
        this.registerTests(this.statics().tests, true);
        return this;
    },

    has: function (name) {
        if (!this.hasTest(name)) {
            return false;
        }
        else if (this.has.hasOwnProperty(name)) {
            return this.has[name];
        }
        else {
            return this.getTestResult(name);
        }
    },

    getTestResult: function (name) {
        return !!this.getTest(name).call(this);
    },

    getTestElement: function (tag) {
        if (!tag) {
            tag = 'div';
        }

        if (!this.testElements[tag]) {
            this.testElements[tag] = Box.global.document.createElement(tag);
        }

        return this.testElements[tag];
    },

    registerTest: function (name, fn, isDefault) {
        if (this.hasTest(name)) {
            Box.Error({
                className: "Box.env.FeatureDetector",
                methodName: "registerTest",
                error: "Test name " + name + " has already been registered"
            });
        }
        this.tests[name] = fn;
        if (isDefault) {
            this.has[name] = this.getTestResult(name);
        }
        return this;
    },

    registerTests: function (tests, isDefault) {
        var key;
        for (key in tests) {
            if (tests.hasOwnProperty(key)) {
                this.registerTest(key, tests[key], isDefault);
            }
        }
        return this;
    },

    hasTest: function (name) {
        return this.tests.hasOwnProperty(name);
    },

    getTest: function (name) {
        if (!this.hasTest(name)) {
            Box.Error({
                className: "Box.env.FeatureDetector",
                methodName: "getTest",
                error: "Test name " + name + " does not exist"
            });
        }
        return this.tests[name];
    },

    getTests: function () {
        return this.tests;
    },

    isStyleSupported: function (name, tag) {
        var elementStyle = this.getTestElement(tag).style,
            cName = Box.String.capitalize(name),
            i = this.statics().stylePrefixes.length;

        if (elementStyle[name] !== undefined) {
            return true;
        }

        while (i--) {
            if (elementStyle[this.statics().stylePrefixes[i] + cName] !== undefined) {
                return true;
            }
        }
        return false;
    },

    isEventSupported: function (name, tag) {
        var element = this.getTestElement(tag),
            eventName = 'on' + name,
            isSupported = false;

        isSupported = (eventName in element);

        if (!isSupported) {
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, '');
                isSupported = typeof element[eventName] === 'function';
                if (typeof element[eventName] !== 'undefined') {
                    element[eventName] = undefined;
                }
                element.removeAttribute(eventName);
            }
        }

        return isSupported;
    }


}, function () {

    Box.features = new Box.env.FeatureDetector();

});
