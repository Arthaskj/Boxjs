(function (flexSetter) {

    var noArgs = [],
        Base = function () {
        },
        hookFunctionFactory = function (hookFunction, underriddenFunction, methodName, owningClass) {
            var result = function () {
                var result = this.callParent(arguments);
                hookFunction.apply(this, arguments);
                return result;
            };
            result.$name = methodName;
            result.$owner = owningClass;
            if (underriddenFunction) {
                result.$previous = underriddenFunction.$previous;
                underriddenFunction.$previous = result;
            }
            return result;
        };

    Box.apply(Base, {

        $className: 'Box.Base',

        $isClass: true,

        create: function () {
            return Box.create.apply(Box, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        extend: function (parent) {
            var parentPrototype = parent.prototype,
                basePrototype, prototype, i, ln, name, statics;

            prototype = this.prototype = Box.Object.chain(parentPrototype);
            prototype.self = this;

            this.superclass = prototype.superclass = parentPrototype;

            if (!parent.$isClass) {
                basePrototype = Box.Base.prototype;

                for (i in basePrototype) {
                    if (i in prototype) {
                        prototype[i] = basePrototype[i];
                    }
                }
            }

            statics = parentPrototype.$inheritableStatics;

            if (statics) {
                for (i = 0, ln = statics.length; i < ln; i++) {
                    name = statics[i];

                    if (!this.hasOwnProperty(name)) {
                        this[name] = parent[name];
                    }
                }
            }

            if (parent.$onExtended) {
                this.$onExtended = parent.$onExtended.slice();
            }
        },

        $onExtended: [],

        triggerExtended: function () {
            var callbacks = this.$onExtended,
                ln = callbacks.length,
                i, callback;

            if (ln > 0) {
                for (i = 0; i < ln; i++) {
                    callback = callbacks[i];
                    callback.fn.apply(callback.scope || this, arguments);
                }
            }
        },

        onExtended: function (fn, scope) {
            this.$onExtended.push({
                fn: fn,
                scope: scope
            });

            return this;
        },

        addStatics: function (members) {
            var member, name;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function' && !member.$isClass && member !== Box.emptyFn && member !== Box.identityFn) {
                        member.$owner = this;
                        member.$name = name;

                        member.displayName = Box.getClassName(this) + '.' + name;
                    }
                    this[name] = member;
                }
            }

            return this;
        },

        addInheritableStatics: function (members) {
            var inheritableStatics,
                hasInheritableStatics,
                prototype = this.prototype,
                name, member;

            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;

            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function') {
                        member.displayName = Box.getClassName(this) + '.' + name;
                    }
                    this[name] = member;

                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }

            return this;
        },

        addMembers: function (members) {
            var prototype = this.prototype,
                enumerables = Box.enumerables,
                names = [],
                i, ln, name, member;

            for (name in members) {
                names.push(name);
            }

            if (enumerables) {
                names.push.apply(names, enumerables);
            }

            for (i = 0, ln = names.length; i < ln; i++) {
                name = names[i];

//                if (members.hasOwnProperty(name)) {
//                    member = members[name];
//
//                    if (typeof member == 'function' && !member.$isClass && member !== Box.emptyFn && member !== Box.identityFn) {
//                        member.$owner = this;
//                        member.$name = name;
//                        member.displayName = (this.$className || '') + '#' + name;
//                    }
//
//                    prototype[name] = member;
//                }
                //修改继承类的时候覆盖属性的问题
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    this.addMember.call(this, name, member);
                }
            }

            return this;
        },

        addMember: function (name, member) {
            var prototype = this.prototype;
            if (typeof member == 'function' && !member.$isClass && member !== Box.emptyFn && member !== Box.identityFn) {
                member.$owner = this;
                member.$name = name;
                member.displayName = (this.$className || '') + '#' + name;
            }

//            this.prototype[name] = member;
            //修改继承类的时候覆盖属性的问题
            if (Box.isObject(member) && Box.isObject(prototype[name])) {
                prototype[name] = Box.apply(Box.clone(prototype[name]), member);
            } else {
                prototype[name] = member;
            }
            return this;
        },

        implement: function () {
            this.addMembers.apply(this, arguments);
        },

        borrow: function (fromClass, members) {
            var prototype = this.prototype,
                fromPrototype = fromClass.prototype,
                className = Box.getClassName(this),
                i, ln, name, fn, toBorrow;

            members = Box.Array.from(members);

            for (i = 0, ln = members.length; i < ln; i++) {
                name = members[i];

                toBorrow = fromPrototype[name];

                if (typeof toBorrow == 'function') {
                    fn = Box.Function.clone(toBorrow);

                    if (className) {
                        fn.displayName = className + '#' + name;
                    }

                    fn.$owner = this;
                    fn.$name = name;

                    prototype[name] = fn;
                }
                else {
                    prototype[name] = toBorrow;
                }
            }

            return this;
        },

        override: function (members) {
            var me = this,
                enumerables = Box.enumerables,
                target = me.prototype,
                cloneFunction = Box.Function.clone,
                name, index, member, statics, names, previous;

            if (arguments.length === 2) {
                name = members;
                members = {};
                members[name] = arguments[1];
                enumerables = null;
            }

            do {
                names = [];
                statics = null;

                for (name in members) {
                    if (name == 'statics') {
                        statics = members[name];
                    } else if (name == 'inheritableStatics') {
                        me.addInheritableStatics(members[name]);
                    } else {
                        names.push(name);
                    }
                }

                if (enumerables) {
                    names.push.apply(names, enumerables);
                }

                for (index = names.length; index--;) {
                    name = names[index];

                    if (members.hasOwnProperty(name)) {
                        member = members[name];

                        if (typeof member == 'function' && !member.$className && member !== Box.emptyFn && member !== Box.identityFn) {
                            if (typeof member.$owner != 'undefined') {
                                member = cloneFunction(member);
                            }

                            if (me.$className) {
                                member.displayName = me.$className + '#' + name;
                            }

                            member.$owner = me;
                            member.$name = name;

                            previous = target[name];
                            if (previous) {
                                member.$previous = previous;
                            }
                        }

                        target[name] = member;
                    }
                }

                target = me;
                members = statics;
            } while (members);

            return this;
        },

        callParent: function (args) {
            var method;
            return (method = this.callParent.caller) && (method.$previous ||
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass.self[method.$name])).apply(this, args || noArgs);
        },

        callSuper: function (args) {
            var method;
            return (method = this.callSuper.caller) &&
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass.self[method.$name]).apply(this, args || noArgs);
        },

        mixin: function (name, mixinClass) {
            var me = this,
                mixin = mixinClass.prototype,
                prototype = me.prototype,
                key, statics, i, ln, staticName,
                mixinValue, hookKey, hookFunction;

            if (typeof mixin.onClassMixedIn != 'undefined') {
                mixin.onClassMixedIn.call(mixinClass, me);
            }

            if (!prototype.hasOwnProperty('mixins')) {
                if ('mixins' in prototype) {
                    prototype.mixins = Box.Object.chain(prototype.mixins);
                }
                else {
                    prototype.mixins = {};
                }
            }

            for (key in mixin) {
                mixinValue = mixin[key];
                if (key === 'mixins') {
                    Box.merge(prototype.mixins, mixinValue);
                } else if (key === 'xhooks') {
                    for (hookKey in mixinValue) {
                        hookFunction = mixinValue[hookKey];
                        hookFunction.$previous = Box.emptyFn;

                        if (prototype.hasOwnProperty(hookKey)) {
                            hookFunctionFactory(hookFunction, prototype[hookKey], hookKey, me);
                        } else {
                            prototype[hookKey] = hookFunctionFactory(hookFunction, null, hookKey, me);
                        }
                    }
                } else if (!(key === 'mixinId' || key === 'config') && (prototype[key] === undefined)) {
                    prototype[key] = mixinValue;
                }
            }

            statics = mixin.$inheritableStatics;

            if (statics) {
                for (i = 0, ln = statics.length; i < ln; i++) {
                    staticName = statics[i];

                    if (!me.hasOwnProperty(staticName)) {
                        me[staticName] = mixinClass[staticName];
                    }
                }
            }

            prototype.mixins[name] = mixin;
            return me;
        },

        getName: function () {
            return Box.getClassName(this);
        },

        createAlias: flexSetter(function (alias, origin) {
            this.override(alias, function () {
                return this[origin].apply(this, arguments);
            });
        }),

        addXtype: function (xtype) {
            var prototype = this.prototype,
                xtypesMap = prototype.xtypesMap,
                xtypes = prototype.xtypes,
                xtypesChain = prototype.xtypesChain;

            if (!prototype.hasOwnProperty('xtypesMap')) {
                xtypesMap = prototype.xtypesMap = Box.merge({}, prototype.xtypesMap || {});
                xtypes = prototype.xtypes = prototype.xtypes ? [].concat(prototype.xtypes) : [];
                xtypesChain = prototype.xtypesChain = prototype.xtypesChain ? [].concat(prototype.xtypesChain) : [];
                prototype.xtype = xtype;
            }

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypes.push(xtype);
                xtypesChain.push(xtype);
                Box.ClassManager.setAlias(this, 'widget.' + xtype);
            }

            return this;
        }
    });

    Base.implement({

        isInstance: true,

        $className: 'Box.Base',

        statics: function () {
            var method = this.statics.caller,
                self = this.self;

            if (!method) {
                return self;
            }

            return method.$owner;
        },

        callParent: function (args) {

            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass[method.$name]));

            if (!superMethod) {
                method = this.callParent.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callParent() was called but there's no such method (" + methodName +
                        ") found in the parent class (" + (Box.getClassName(parentClass) || 'Object') + ")");
                }
            }

            return superMethod.apply(this, args || noArgs);
        },

        callSuper: function (args) {

            var method,
                superMethod = (method = this.callSuper.caller) &&
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass[method.$name]);

            if (!superMethod) {
                method = this.callSuper.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callSuper() was called but there's no such method (" + methodName +
                        ") found in the parent class (" + (Box.getClassName(parentClass) || 'Object') + ")");
                }
            }

            return superMethod.apply(this, args || noArgs);
        },

        self: Base,

        constructor: function () {
            return this;
        },

        destroy: function () {
            this.destroy = Box.emptyFn;
        }
    });

    Base.prototype.callOverridden = Base.prototype.callParent;

    Box.Base = Base;

}(Box.Function.flexSetter));
