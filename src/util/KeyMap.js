Box.define('Box.util.KeyMap', {

    alternateClassName: 'Box.KeyMap',

    eventName: 'keydown',

    binding: null,

    target: null,

    processEventScope: null,

    //是否忽略对input等标签的处理
    ignoreInputFields: false,

    constructor: function (config) {
        if ((arguments.length !== 1) || (typeof config === 'string') || config.dom || config.tagName || config === document || config.isComponent) {
            this.legacyConstructor.apply(this, arguments);
            return;
        }
        Box.apply(this, config);
        this.bindings = [];

        if (!this.target.isComponent) {
            this.target = Box.get(this.target);
        }

        if (this.binding) {
            this.addBinding(this.binding);
        } else if (config.key) {
            this.addBinding(config);
        }
        this.enable();
    },

    legacyConstructor: function (el, binding, eventName) {
        Box.apply(this, {
            target: Box.get(el),
            eventName: eventName || this.eventName,
            bindings: []
        });
        if (binding) {
            this.addBinding(binding);
        }
        this.enable();
    },

    addBinding: function (binding) {
        var keyCode = binding.key,
            bindings = this.bindings,
            i, len;

        if (this.processing) {
            this.bindings = bindings.slice(0);
        }

        if (Box.isArray(binding)) {
            for (i = 0, len = binding.length; i < len; i++) {
                this.addBinding(binding[i]);
            }
            return;
        }

        this.bindings.push(Box.apply({
            keyCode: this.processKeys(keyCode)
        }, binding));
    },

    removeBinding: function (binding) {
        var bindings = this.bindings,
            len = bindings.length,
            keys, item, i;

        if (this.processing) {
            this.bindings = bindings.slice(0);
        }

        keys = this.processKeys(binding.key);
        for (i = 0; i < len; ++i) {
            item = bindings[i];
            if ((item.fn || item.handler) === (binding.fn || binding.handler) && item.scope === binding.scope) {
                if (binding.alt === item.alt && binding.crtl === item.crtl && binding.shift === item.shift) {
                    if (Box.Array.equals(item.keyCode, keys)) {
                        Box.Array.erase(this.bindings, i, 1);
                        return;
                    }
                }
            }
        }
    },

    processKeys: function (keyCode) {
        var processed = false,
            keys, key, keyString, len, i;

        if (Box.isString(keyCode)) {
            keys = [];
            keyString = keyCode.toUpperCase();

            for (i = 0, len = keyString.length; i < len; ++i) {
                keys.push(keyString.charCodeAt(i));
            }
            keyCode = keys;
            processed = true;
        }

        if (!Box.isArray(keyCode)) {
            keyCode = [keyCode];
        }

        if (!processed) {
            for (i = 0, len = keyCode.length; i < len; ++i) {
                key = keyCode[i];
                if (Box.isString(key)) {
                    keyCode[i] = key.toUpperCase().charCodeAt(0);
                }
            }
        }
        return keyCode;
    },

    handleTargetEvent: (function () {
        var tagRe = /input|textarea/i;
        return function (event) {
            var me = this,
                bindings, i, len,
                target, contentEditable;

            if (me.enabled) {
                bindings = me.bindings;
                i = 0;
                len = bindings.length;

                event = me.processEvent.apply(me || me.processEventScope, arguments);

                if (me.ignoreInputFields) {
                    target = event.target;
                    contentEditable = target.contentEditable;
                    if (tagRe.test(target.tagName) || (contentEditable === '' || contentEditable === 'true')) {
                        return;
                    }
                }

                if (Box.isEmpty(event.which)) {
                    return event;
                }
                me.processing = true;
                for (; i < len; ++i) {
                    me.processBinding(bindings[i], event);
                }
                me.processing = false;
            }
        }
    }()),

    processEvent: Box.identityFn,

    processBinding: function (binding, evnet) {
        if (this.checkModifiers(binding, event)) {
            var key = event.which,
                handler = binding.fn || binding.handler,
                scope = binding.scope || this,
                keyCode = binding.keyCode,
                defaultEventAction = binding.defaultEventAction,
                i,
                len;


            for (i = 0, len = keyCode.length; i < len; ++i) {
                if (key === keyCode[i]) {
                    if (handler.call(scope, key, event) !== true && defaultEventAction) {
                        if (defaultEventAction == 'stopEvent') {
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            event[defaultEventAction]();
                        }
                    }
                    break;
                }
            }
        }
    },

    checkModifiers: function (binding, event) {
        var keys = ['shift', 'ctrl', 'alt'],
            len = keys.length,
            i = 0, key, val;

        for (; i < len; ++i) {
            key = keys[i];
            val = binding[key];
            if (!(val === undefined || (val === event[key + 'Key']))) {
                return false;
            }
        }
        return true;
    },

    on: function (key, fn, scope) {
        var keyCode, shift, ctrl, alt;
        if (Box.isObject(key) && !Box.isArray(key)) {
            keyCode = key.key;
            shift = key.shift;
            ctrl = key.ctrl;
            alt = key.alt;
        } else {
            keyCode = key;
        }
        this.addBinding({
            key: keyCode,
            shift: shift,
            ctrl: ctrl,
            alt: alt,
            fn: fn,
            scope: scope
        });
    },

    un: function (key, fn, scope) {
        var keyCode, shift, ctrl, alt;
        if (Box.isObject(key) && !Box.isArray(key)) {
            keyCode = key.key;
            shift = key.shift;
            ctrl = key.ctrl;
            alt = key.alt;
        } else {
            keyCode = key;
        }
        this.removeBinding({
            key: keyCode,
            shift: shift,
            ctrl: ctrl,
            alt: alt,
            fn: fn,
            scope: scope
        });
    },

    isEnabled: function () {
        return this.enabled;
    },

    enable: function () {
        if (!this.enabled) {
            this.__$handleTargetEvent = Box.Function.bind(this.handleTargetEvent, this);
            this.target.on(this.eventName, this.__$handleTargetEvent);
            this.enabled = true;
        }
    },

    disable: function () {
        if (this.enabled && this.__$handleTargetEvent) {
            this.target.off(this.eventName, this.__$handleTargetEvent);
            this.enabled = false;
        }
    },

    setDisabled: function (disabled) {
        if (disabled) {
            this.disable();
        } else {
            this.enable();
        }
    },

    destroy: function () {
        var target = this.target;
        this.bindings = [];
        this.disable();
        delete this.target;
    }

});