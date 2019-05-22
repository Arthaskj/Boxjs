//定义组件基类
Box.define('Box.Component', {

    statics: {

        ON_RENDER_ATTR_PREFIX: '_onChangeFor',

        GENERATE_ID_PREFIX: 'HY_ELEMENT_',

        GENERATE_INDEX: +new Date,

        getGenerateID: function () {
            return this.GENERATE_ID_PREFIX + ++this.GENERATE_INDEX
        }

    },

    extend: Box.Base,

    mixins: {
        event: Box.util.Event
    },

    requires: [
        Box.dom.Helper,
        Box.dom.Element,
        Box.tpl.Base,
        Box.tpl.Template,
        Box.ComponentTplFactory
    ],

    elements: {},

    events: {},

    delegates: {},

    templates: {},

    listeners: {},

    target: null,

    renderTo: null,

    autoRender: true,

    isComponent: true,

    setElementId: function (element) {
        var statics = this.statics(),
            me = this;

        if (Box.isEmpty(element)) {
            return;
        }

        if (element.jquery) {
            element.each(function () {
                me.setElementId(this);
            })
        } else if (Box.isArray(element)) {
            Box.Array.forEach(element, function (ele) {
                this.setElementId(ele);
            }, this)
        } else if (Box.isElement(element)) {
            if (Box.isEmpty(element.id)) {
                element.id = statics.getGenerateID();
            }
        }
    },

    //类的初始化
    constructor: function (config) {

        var thisClassName = this.$className;


        if (Box.app.Application.name == "HY" && HY.Context && HY.Context.userMenu && HY.Context.userMenu.length > 0) {

            //根据菜单配置实现不同的页面展示
            for (var i = 0; i < HY.Context.userMenu.length; i++) {
                if ((Box.app.Application.name + '.' + HY.Context.userMenu[i].ClassName) == thisClassName && HY.Context.userMenu[i].MapUrlClass != null && HY.Context.userMenu[i].MapUrlClass != "" && HY.Context.userMenu[i].MapUrlClass != thisClassName) {
                    return Box.apply(this, Box.create(HY.Context.userMenu[i].MapUrlClass, config));
                }
            }


            //根据当前创建的class,在menu里面查找,如果有对应的menu,那就把相应的FunctionUID记录下来,传给后台做权限控制
            //var hasFoundUID = false;
            for (var i = 0; i < HY.Context.userMenu.length; i++) {
                if ((Box.app.Application.name + '.' + HY.Context.userMenu[i].ClassName) == thisClassName) {
                    $('#currentFunctionUID').val(HY.Context.userMenu[i].UID);
                    $('#currentFunctionUID').attr('data-operationtype', HY.Context.userMenu[i].OperationType);
                    // hasFoundUID = true;
                    break;
                }
            }

            //如果上面那种方法取不到,再用下面的方法试一下,取className的前面几个点来比较,如果相同则认为是同一个功能,注意:这种方法存在问题
            if (!$('#currentFunctionUID').val()) {
                for (var i = 0; i < HY.Context.userMenu.length; i++) {
                    if (HY.Context.userMenu[i].ClassName) {
                        var thisClassNameList = thisClassName.split('.');
                        var menuClassNameList = HY.Context.userMenu[i].ClassName.split('.');

                        thisClassNameList.splice(thisClassNameList.length - 1, 1);
                        menuClassNameList.splice(menuClassNameList.length - 1, 1);

                        if (thisClassNameList.join('.') == Box.app.Application.name + '.' + menuClassNameList.join('.')) {
                            $('#currentFunctionUID').val(HY.Context.userMenu[i].UID);
                            $('#currentFunctionUID').attr('data-operationtype', HY.Context.userMenu[i].OperationType)
                            break;
                        }
                    }
                }
            }
        }


        var statics = this.statics();

        if (Box.isEmpty(config)) {
            config = {};
        }

        Box.apply(this, config);

        this.initialConfig = config;

        this.__$name = statics.getGenerateID();

        this.mixins.event.constructor.call(this, config);

        this.setting();

        this.initTemplates();

        if (this.autoRender) {
            this.render();
        }

        return this;
    },

    setting: Box.emptyFn,

    reRender: function () {
        if (this.rendered) {
            this.destroy(true);
            this.destroyed = false;
            this.rendered = false;

            var statics = this.statics();

            this.__$name = statics.getGenerateID();

            this.setting();

            this.initTemplates();

            this.render();
        }
    },

    beforeRender: function () {
        var target = this.target;
        this.el = this.el || {};
        if (target) {
            this.el.target = Box.get(target);
        } else if (this.tpl.main) {
            this.el.target = this.applyTemplate('main');
        }
        if (Box.isEmpty(this.el.target)) {
            Box.Error('the.el.target is undefined');
        }

        this.setElementId(this.el.target);
    },

    render: function (renderTo) {
        if (this.rendered) {
            this.destroy(false);
            this.destroyed = false;
            this.rendered = false;
            this.render();
            return;
        }

        if (!this.rendered && (this.trigger('beforerender', this) !== false)) {
            this.beforeRender();
            this.onRender(renderTo);
            this.afterRender();
        }
    },

    onRender: function (renderTo) {
        renderTo = Box.get(renderTo || this.renderTo);
        if (renderTo && renderTo.length > 0) {
            if (Box.isFunction(this.renderToFn)) {
                this.renderToFn(this.el.target, renderTo);
            } else {
                renderTo.append(this.el.target);
            }
        }

        this.applyElements();
        this.initEvents();
        this.initDelegates();
        this.initAttrsForRender();
        this.trigger('render', this);
    },

    afterRender: function () {
        this.trigger('afterrender', this);
        this.beforeSetup();
        this.setup();
        this.rendered = true;
        this.afterSetup();
        this.__setPermission();
    },
    //权限控制现在一共分为三类按钮,grid的列和里面的链接
    //这儿处理的是按钮和grid的列, grid里面的链接放到HYGrid里面的绑定事件处理了  可以搜索  var aEl = this.wrapper.find('a[data-operationtype="1"]');  找到

    //对页面上的按钮,指定列 进行权限控制
    __setPermission: function () {
        //判断当前页面的权限如果是只读的话,就把页面上的设置为编辑权限的按钮隐藏
        if ((this.$params && this.$params.OperationType == 0) || ($('#currentFunctionUID').attr('data-operationtype') == 0)) {
            //对按钮进行处理
            this.el.target.find('.k-button[data-operationtype="1"]').hide();

            //对grid里面的列进行处理
            this.el.target.find('.k-grid').each(function (index, element) {
                var grid = $(element).data('kendoGrid');
                if (grid) {
                    for (var i = 0; i < grid.columns.length; i++) {
                        if (grid.columns[i].operationType == 1) {
                            grid.hideColumn(i);
                        }
                    }
                }
            });
        }
    },

    beforeSetup: Box.emptyFn,

    afterSetup: Box.emptyFn,

    //提供给子类覆盖的初始化方法
    setup: Box.emptyFn,

    renderToFn: null,

    initAttrsForRender: function () {
        var me = this,
            statics = this.statics();
        Box.Object.each(this.attrs, function (attr) {
            var name = statics.ON_RENDER_ATTR_PREFIX + Box.String.firstUpperCase(attr);

            if (this[name]) {
                var value = this.get(attr);
                if (!Box.isEmpty(value)) {
                    this[name](value, undefined, attr);
                }
                (function (name) {
                    me.on('change:' + attr, function (val, prev, key) {
                        this[name](val, prev, key);
                    })
                })(name);
            }
        }, this)
    },

    initTemplates: function () {

        var tpls = this.templates, applyFn;
        if (typeof tpls === 'string') {
            tpls = {
                main: {name: 'main', path: tpls}
            };
        } else if (Box.isObject(tpls)) {
            tpls = Box.apply({}, this.templates, {});
        }

        Box.Object.each(tpls, function (name, tpl) {
            if (Box.isString(tpl)) {
                tpls[name] = Box.String.has(tpl, '.') ?
                    {name: name, path: tpl} :
                    {name: name, id: tpl};
            } else if (Box.isArray(tpl) || Box.isFunction(tpl)) {
                tpls[name] = {name: name, content: tpl};
            }
            applyFn = 'apply' + Box.String.firstUpperCase(name) + 'Template';
            this[applyFn] = function (data, isHtml) {
                return this.applyTemplate(name, data, isHtml);
            }
        }, this);
        this.tpl = {};
        Box.ComponentTplFactory.register(this, tpls);
    },

    __$setCompileTemplate: function (name, compile) {
        return this.tpl[name] = compile;
    },

    applyTemplate: function (name, data, isHtml) {
        var template = this.tpl[name];
        if (name == 'main') {
            data = Box.apply({}, this.getMainTplData());
        }
        var html = template.isTemplate ? template.apply(data) : template.call(this, data);
        return isHtml ? html : Box.get(html);
    },

    // type 的类型为：append、prepend、after、before、overwrite
    applyTemplateTo: function (name, data, el, type, isHtml) {
        var template = this.tpl[name];
        if (!template.isTemplate) {
            var html = template.call(this, data);
            var ret = isHtml ? html : Box.get(html);
            if (type == 'overwrite') {
                type = 'html';
            }
            el[type](html);
            return ret;
        }
        return template[type](el, data, isHtml);
    },

    getMainTplData: function () {
        return {};
    },

    applyElements: function (elements) {
        Box.Object.each(elements || this.elements || {}, function (name, selector) {
            this.element(name, selector, true);
        }, this);
    },

    element: function (name, selector, ignoreEvents) {
        var elements, index = -1, content = this.el;

        if (Box.isEmpty(selector)) {
            return;
        }

        if (Box.isString(selector)) {
            index = selector.indexOf('@');
            elements = index < 0 ? content.target.find(selector) :
                content[selector.substr(0, index)].find(selector.substr(index + 1));
        } else {
            if (selector.jquery) {
                elements = selector;
            } else {
                elements = Box.get(selector);
            }
        }

        this.__event_cache = this.__event_cache || {};

        var cache = this.__event_cache[name] || {};

        if (Box.isEmpty(content[name])) {
            content[name] = elements;
        } else {
            content[name] = content[name].add(elements);
        }

        if (!ignoreEvents) {
            Box.Object.each(cache, function (type, handlers) {
                Box.Array.forEach(handlers || [], function (handler) {
                    this.mon(elements, type, handler);
                }, this);
            }, this);
        }

        return elements;
    },

    __$eventReg: /([a-z]+)\s+([a-zA-Z0-9_-]+)(\s+\{([^\{\}]+)\})?/,

    initEvents: function (events) {
        events = events || Box.apply({}, this.events);
        if (Box.isEmpty(events)) {
            return;
        }

        Box.Object.each(events, function (name, handler) {
            var regObj = name.match(this.__$eventReg);

            var name = regObj[2];
            var type = regObj[1];
            var selector = regObj[4];
            var target;

            if (!Box.isEmpty(selector)) {
                this.applyElements((function () {
                    var selector_option = {};
                    selector_option[name] = selector;
                    return selector_option;
                })())
            }
            if (!Box.isEmpty(target = this.el[name])) {
                var cache = this.__event_cache[name] = this.__event_cache[name] || {};
                cache[type] = cache[type] || [];
                cache[type].push(handler);
                this.mon(target, type, handler);
            }
        }, this);
    },

    mon: function (target, type, handler, scope) {
        var me = this;

        if (Box.isString(handler)) {
            handler = this[handler];
        }

        if (!Box.isFunction(handler) || Box.isEmpty(target)) {
            return;
        }

        if (Box.isString(target)) {
            target = this.el[target];
        }

        target.bind(type || Box.EventType.CLICK, function (e) {
            return handler.call(scope || me, e, Box.get(this), me);
        });

        return this;
    },

    unmon: function (target, type) {
        target = Box.isString(target) ? this.el[target] : target;
        if (Box.isEmpty(target)) {
            return;
        }
        if (Box.isEmpty(type)) {
            target.unbind();
        } else {
            target.unbind(type);
        }
        return this;
    },

    initDelegates: function () {
        var delegates = Box.apply({}, this.delegates);
        Box.Object.each(delegates, function (selector, handler) {
            this.don(selector, handler);
        }, this);
    },

    __$delegateReg: /([a-z]+)\s+\{([^\{\}]+)\}/,

    don: function (name, handler, scope) {
        var me = this;
        handler = this[handler];
        if (!Box.isFunction(handler)) {
            return;
        }

        var regObj = name.match(this.__$delegateReg);
        var type = Box.EventType.CLICK, selector;

        if (Box.isEmpty(regObj)) {
            selector = name;
        } else {
            type = regObj[1];
            selector = regObj[2];
        }

        this.el.target.delegate(selector, type, function (e) {
            var target = Box.get(e.target);
            if (!target.is(selector)) {
                target = target.closest(selector).eq(0);
            }
            if (handler.call(scope || me, e, target, me) === false) {
                e.stopPropagation();
                return false;
            }
            return true;
        })
    },

    undon: function (selector, type) {
        this.el.target.undelegate(selector, type || Box.EventType.CLICK);
    },

    _bindBtnHandler: function (target, type, handler, button, scope) {
        var me = this;

        if (Box.isString(handler)) {
            handler = this[handler];
        }

        if (!Box.isFunction(handler) || Box.isEmpty(target)) {
            return this;
        }

        if (Box.isString(target)) {
            target = this.el[target];
        }

        target.bind(type || Box.EventType.CLICK, function (e) {
            if (!target.attr("disabled")) {
                me.trigger('click' + Box.String.firstUpperCase(button.name) + 'Btn', me, target);
                return handler.call(scope || me, e, Box.get(this), me);
            }
        });

        return this;
    },

    beforeDestroy: function () {
        Box.Object.each(this.__event_cache, function (name, events) {
            var elements = this.el[name];
            elements && elements.jquery && elements.unbind();
            delete this.__event_cache[name];
        }, this);
        this.el.target.undelegate();
        Box.Object.each(this.tpl, function (name) {
            delete this.tpl[name];
        }, this);
        this.tpl = null;
    },

    destroy: function (retain) {
        if (this.destroyed || this.trigger('beforedestroy', this) === false) {
            return;
        }
        this.beforeDestroy();
        this.onDestroy();
        this.afterDestroy(retain);
    },

    onDestroy: function () {
        Box.Object.each(this.el || {}, function (name, el) {
            if (name == 'target') {
                return;
            }
            if (el.jquery) {
                el.remove();
            } else if (Box.isArray(el)) {
                Box.Array.forEach(el, function (e) {
                    e.remove();
                }, this);
            } else if (Box.isObject(el)) {
                Box.Object.each(el, function (n, e) {
                    e.remove();
                }, this);
            }
            delete this.el[name];
        }, this);
        this.trigger('destroy', this);
    },

    afterDestroy: function (retain) {
        this.trigger('afterdestroy', this);
        if (this.rendered && this.el.target && !this.target) {
            this.el.target.remove();
            this.el.target = null;
        }
        this.off();
        this.destroyed = true;
        if (!retain) {
            for (var pro in this) {
                if (this.hasOwnProperty(pro)) {
                    delete this[pro];
                }
            }
        }
    }

});