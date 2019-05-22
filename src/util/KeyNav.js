Box.define('Box.util.KeyNav', {

    alternateClassName: 'Box.KeyNav',

    requires: [Box.util.KeyMap],

    disabled: false,

    //stopPropagation preventDefault stopEvent
    defaultEventAction: 'stopEvent',

    forceKeyDown: false,

    eventName: 'keypress',

    processEventScope: null,

    ignoreInputFields: false,

    statics: {

        keyOptions: {
            left: 37,
            right: 39,
            up: 38,
            down: 40,
            space: 32,
            pageUp: 33,
            pageDown: 34,
            del: 46,
            backspace: 8,
            home: 36,
            end: 35,
            enter: 13,
            esc: 27,
            tab: 9
        }

    },

    constructor: function (config) {
        if (arguments.length === 2) {
            this.legacyConstructor.apply(this, arguments);
            return;
        }
        this.doConstruction(config);
    },

    legacyConstructor: function (el, config) {
        this.doConstruction(Box.apply({
            target: el
        }, config));
    },

    doConstruction: function (config) {
        var me = this,
            keymapCfg = {
                target: config.target,
                ignoreInputFields: config.ignoreInputFields,
                eventName: me.getKeyEvent('forceKeyDown' in config ? config.forceKeyDown : me.forceKeyDown, config.eventName),
                capture: config.capture
            },
            map;

        if (me.map) {
            me.map.destroy();
        }

        if (config.processEvent) {
            keymapCfg.processEvent = config.processEvent;
            keymapCfg.processEventScope = config.processEventScope || me;
        }

        if (config.keyMap) {
            map = me.map = config.keyMap;
        } else {
            map = me.map = new Box.util.KeyMap(keymapCfg);
            me.destroyKeyMap = true;
        }

        this.addBindings(config);

        map.disable();
        if (!config.disabled) {
            map.enable();
        }
    },

    addBindings: function (bindings) {
        var me = this,
            map = me.map,
            keyCodes = Box.util.KeyNav.keyOptions,
            defaultScope = bindings.scope || me;

        Box.Object.each(bindings, function (keyName, binding) {
            if (binding && (keyName.length === 1 || (keyName = keyCodes[keyName]) || (!isNaN(keyName = parseInt(keyName, 10))))) {
                if (typeof binding === 'function') {
                    binding = {
                        handler: binding,
                        defaultEventAction: (bindings.defaultEventAction !== undefined) ? bindings.defaultEventAction : me.defaultEventAction
                    };
                }
                map.addBinding({
                    key: keyName,
                    ctrl: binding.ctrl,
                    shift: binding.shift,
                    alt: binding.alt,
                    handler: Box.Function.bind(me.handleEvent, binding.scope || defaultScope, [binding.handler || binding.fn, me], true),
                    defaultEventAction: (binding.defaultEventAction !== undefined) ? binding.defaultEventAction : me.defaultEventAction
                });
            }
        }, this);
    },

    handleEvent: function (keyCode, event, handler, keyNav) {
        keyNav.lastKeyEvent = event;
        return handler.call(this, event);
    },

    destroy: function (removeEl) {
        if (this.destroyKeyMap) {
            this.map.destroy(removeEl);
        }
        delete this.map;
    },

    enable: function () {
        if (this.map) {
            this.map.enable();
            this.disabled = false;
        }
    },

    disable: function () {
        if (this.map) {
            this.map.disable();
        }
        this.disabled = true;
    },

    setDisabled: function (disabled) {
        this.map.setDisabled(disabled);
        this.disabled = disabled;
    },

    useKeyDown: Box.browser.is.WebKit ?
        parseInt(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1], 10) >= 525 :
        !((Box.browser.is.Gecko && !window) || Box.browser.is.Opera),

    getKeyEvent: function (forceKeyDown, configuredEventName) {
        if (forceKeyDown || (this.useKeyDown && !configuredEventName)) {
            return 'keydown';
        } else {
            return configuredEventName || this.eventName;
        }
    }


});