// class
(function () {

    var BoxClass,
        Base = Box.Base,
        baseStaticMembers = [],
        baseStaticMember, baseStaticMemberLength;

    for (baseStaticMember in Base) {
        if (Base.hasOwnProperty(baseStaticMember)) {
            baseStaticMembers.push(baseStaticMember);
        }
    }

    baseStaticMemberLength = baseStaticMembers.length;

    function Ctor(className) {
        function constructor() {
            return this.constructor.apply(this, arguments) || null;
        }

        if (className) {
            constructor.displayName = className;
        }
        return constructor;
    }

    Box.Class = BoxClass = function (Class, properties, fn) {
        if (typeof Class != 'function') {
            fn = properties;
            properties = Class;
            Class = null;
        }
        properties = properties || {};
        Class = BoxClass.create(Class, properties);
        BoxClass.process(Class, properties, fn);
        return Class;
    };

    Box.apply(BoxClass, {

        onBeforeCreated: function (Class, properties, hooks) {
            properties.$configs = {};
            Class.addMembers(properties);
            hooks.onCreated.call(Class, Class);
        },

        process: function (Class, data, onCreated) {
            var preprocessorStack = data.preprocessors || BoxClass.defaultPreprocessors,
                registeredPreprocessors = this.preprocessors,
                hooks = {
                    onBeforeCreated: this.onBeforeCreated
                },
                preprocessors = [],
                preprocessor, preprocessorsProperties,
                i, ln, j, subLn, preprocessorProperty;

            delete data.preprocessors;

            for (i = 0, ln = preprocessorStack.length; i < ln; i++) {
                preprocessor = preprocessorStack[i];

                if (typeof preprocessor == 'string') {
                    preprocessor = registeredPreprocessors[preprocessor];
                    preprocessorsProperties = preprocessor.properties;

                    if (preprocessorsProperties === true) {
                        preprocessors.push(preprocessor.fn);
                    } else if (preprocessorsProperties) {
                        for (j = 0, subLn = preprocessorsProperties.length; j < subLn; j++) {
                            preprocessorProperty = preprocessorsProperties[j];

                            if (data.hasOwnProperty(preprocessorProperty)) {
                                preprocessors.push(preprocessor.fn);
                                break;
                            }
                        }
                    }
                }
                else {
                    preprocessors.push(preprocessor);
                }
            }

            hooks.onCreated = onCreated ? onCreated : Box.emptyFn;
            hooks.preprocessors = preprocessors;

            this.doProcess(Class, data, hooks);
        },

        doProcess: function (Class, data, hooks) {
            var me = this,
                preprocessors = hooks.preprocessors,
                preprocessor = preprocessors.shift(),
                doProcess = me.doProcess;

            for (; preprocessor; preprocessor = preprocessors.shift()) {
                if (preprocessor.call(me, Class, data, hooks, doProcess) === false) {
                    return;
                }
            }
            hooks.onBeforeCreated.apply(me, arguments);
        },

        create: function (Class, properties) {
            var name, i;
            Class = Class || Ctor(properties.$className);
            for (i = 0; i < baseStaticMemberLength; i++) {
                name = baseStaticMembers[i];
                Class[name] = Base[name];
            }
            return Class;
        },

        preprocessors: {},

        registerPreprocessor: function (name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }
            if (!properties) {
                properties = [name];
            }
            this.preprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };
            this.setDefaultPreprocessorPosition(name, position, relativeTo);
            return this;
        },

        getPreprocessor: function (name) {
            return this.preprocessors[name];
        },

        getPreprocessors: function () {
            return this.preprocessors;
        },

        defaultPreprocessors: [],

        getDefaultPreprocessors: function () {
            return this.defaultPreprocessors;
        },

        setDefaultPreprocessors: function (preprocessors) {
            this.defaultPreprocessors = Box.Array.from(preprocessors);
            return this;
        },

        setDefaultPreprocessorPosition: function (name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);
                    return this;
                } else if (offset === 'last') {
                    defaultPreprocessors.push(name);
                    return this;
                }
                offset = (offset === 'after') ? 1 : -1;
            }

            index = Box.Array.indexOf(defaultPreprocessors, relativeName);
            if (index !== -1) {
                Box.Array.splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }
            return this;
        },

        configNameCache: {},

        getConfigNameMap: function (name) {
            var cache = this.configNameCache,
                map = cache[name],
                capitalizedName;

            if (!map) {
                capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);
                map = cache[name] = {
                    internal: name,
                    initialized: '_is' + capitalizedName + 'Initialized',
                    apply: 'apply' + capitalizedName,
                    update: 'update' + capitalizedName,
                    set: 'set' + capitalizedName,
                    get: 'get' + capitalizedName
                };
            }
            return map;
        }

    });

    Box.Class.registerPreprocessor('extend', function (Class, properties, hooks) {
        var Base = Box.Base,
            basePrototype = Base.prototype,
            extend = properties.extend,
            Parent, parentPrototype, i;

        delete properties.extend;

        if (extend && extend !== Object) {
            Parent = extend;
        } else {
            Parent = Base;
        }
        parentPrototype = Parent.prototype;

        if (!Parent.$isClass) {
            for (i in basePrototype) {
                if (!parentPrototype[i]) {
                    parentPrototype[i] = basePrototype[i];
                }
            }
        }

        Class.extend(Parent);
        Class.triggerExtended.apply(Class, arguments);

        if (properties.onClassExtended) {
            Class.onExtended(properties.onClassExtended, Class);
            delete properties.onClassExtended;
        }

    }, true);

    Box.Class.registerPreprocessor('statics', function (Class, properties, hooks) {
        Class.addStatics(properties.statics);
        delete properties.statics;
    });
    //指定的某个类的分支,会自动在后缀加上机构代码
    Box.Class.registerPreprocessor('branch', function (Class, properties, hooks) {
        var branch = properties.branch;
        var branchClass;
        var branchName;
        var appcode = window.TempAppCode || HY.Context.ClientCode;//TempAppCode在menumap用到
        //alert(window.TempAppCode);
        if (appcode == 'Main') {//代表主干版本,menumap用到
            return;
        }

        //现在branch支持多种类型,是为了兼容之前的代码,后面会逐步去掉,只需要支持branch.constructor == Object
        if (branch.constructor == Object) {
            for (var prop in branch) {
                if (prop == appcode) {
                    // branchName = properties.$className + '_' + (appcode);
                    branchName = Box.String.insert(properties.$className, '.' + appcode, Box.app.Application.name.length)
                    try {
                        branchClass = Box.requireSync(branchName);
                    } catch (e) {
                        return;
                    }
                    break;
                }
            }
        } else if (branch instanceof Array) {//如果是配置的数组,

            if (Box.Array.contains(branch, appcode)) {
                branchName = properties.$className + '_' + (appcode);
                try {
                    branchClass = Box.requireSync(branchName);
                } catch (e) {
                    return;
                }
            } else {
                return;
            }
        } else if (branch === true) { //如果branch设置为true,就默认使用类本身的名字,并且加入机构代码后缀
            branchName = properties.$className + '_' + (appcode);//TempAppCode 菜单管理临时预览页面用(慎用,不完善)
            try {
                branchClass = Box.requireSync(branchName);
            } catch (e) {
                return;
            }

        } else if (typeof branch == 'function') { //如果branch设置为string,会自动获取到相应的类
            branchClass = branch;
        } else {
            return;
        }

        if (!branchClass) {
            return;
        }

        //只有分支上面不一样的方法、属性，才覆盖
        Box.Function.before(hooks, 'onCreated', function () {
            for (var branchPrototype in branchClass.prototype) {
                if (branchPrototype != 'self' && branchPrototype != 'superclass' && branchPrototype != '$className'
                    && branchPrototype != '$configs' && branchPrototype != 'isInstance' && branchPrototype != 'statics'
                    && branchPrototype != 'callParent' && branchPrototype != 'callSuper' && branchPrototype != 'destroy'
                    && branchPrototype != 'callOverridden') {
                    Class.prototype[branchPrototype] = branchClass.prototype[branchPrototype];
                }

            }
        });

    });

    Box.Class.registerPreprocessor('inheritableStatics', function (Class, properties, hooks) {
        Class.addInheritableStatics(properties.inheritableStatics);
        delete properties.inheritableStatics;
    });

    Box.Class.registerPreprocessor('config', function (Class, properties) {
        var config = properties.config,
            prototype = Class.prototype;

        delete properties.config;

        Box.Object.each(config, function (name, value) {
            var nameMap = Box.Class.getConfigNameMap(name),
                internalName = nameMap.internal,
                initializedName = nameMap.initialized,
                applyName = nameMap.apply,
                updateName = nameMap.update,
                setName = nameMap.set,
                getName = nameMap.get;

            var hasOwnSetter = (setName in prototype) || properties.hasOwnProperty(setName),
                hasOwnApplier = (applyName in prototype) || properties.hasOwnProperty(applyName),
                hasOwnUpdater = (updateName in prototype) || properties.hasOwnProperty(updateName);

            var optimizedGetter, customGetter;

            if (value === null || (!hasOwnSetter && !hasOwnApplier && !hasOwnUpdater)) {
                prototype[internalName] = value;
                prototype[initializedName] = true;
            } else {
                prototype[initializedName] = false;
            }

            if (!hasOwnSetter) {
                properties[setName] = function (value, unupdate) {
                    var oldValue = this[internalName],
                        applier = this[applyName],
                        updater = this[updateName];

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                    }
                    if (applier) {
                        value = applier.call(this, value, oldValue);
                    }
                    if (typeof value != 'undefined' && !unupdate) {
                        this[internalName] = value;
                        if (updater && value !== oldValue) {
                            updater.call(this, value, oldValue);
                        }
                    }

                    return this;
                }
            }

            if (!(getName in prototype) || properties.hasOwnProperty(getName)) {
                customGetter = properties[getName] || false;

                if (customGetter) {
                    optimizedGetter = function () {
                        return customGetter.apply(this, arguments);
                    };
                } else {
                    optimizedGetter = function () {
                        return this[internalName];
                    };
                }

                properties[getName] = function () {
                    var currentGetter;

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                        this[setName](this.config[name], true);
                    }

                    currentGetter = this[getName];

                    if ('$previous' in currentGetter) {
                        currentGetter.$previous = optimizedGetter;
                    } else {
                        this[getName] = optimizedGetter;
                    }

                    return optimizedGetter.apply(this, arguments);
                };
            }

        });

    });

    Box.Class.registerPreprocessor('mixins', function (Class, properties, hooks) {
        var mixins = properties.mixins,
            name, mixin, i, len;

        delete properties.mixins;

        Box.Function.before(hooks, 'onCreated', function () {
            if (mixins instanceof Array) {
                for (i = 0, len = mixins.length; i < len; i++) {
                    mixin = mixins[i];
                    name = mixin.prototype.mixinId || mixin.$className;
                    Class.mixin(name, mixin);
                }
            } else {
                for (var mixinName in mixins) {
                    if (mixins.hasOwnProperty(mixinName)) {
                        Class.mixin(mixinName, mixins[mixinName]);
                    }
                }
            }
        });
    });

    Box.extend = function (Class, Parent, members) {
        if (arguments.length === 2 && Box.isObject(Parent)) {
            members = Parent;
            Parent = Class;
            Class = null;
        }
        var cls;
        if (!Parent) {
            throw new Error("[Box.extend] Attempting to extend from a class which has not been loaded on the page.");
        }

        members.extend = Parent;
        members.preprocessors = ['extend', 'statics', 'inheritableStatics', 'mixins'];

        if (Class) {
            cls = new BoxClass(Class, members);
            cls.prototype.constructor = Class;
        } else {
            cls = new BoxClass(members);
        }

        cls.prototype.override = function (o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };
        return cls;
    };

})();