Box.define('Box.ComponentTplFactory', {

    statics: {

        TEMPLATE_SCOPE_END_PREFIX: 'TemplateHelpers'

    },

    requires: [
        Box.util.JSON,
        Box.util.HashMap,
        Box.dom.Helper,
        Box.ComponentTplCompile
    ],

    singleton: true,

    pools: {},

    register: function (pro, templates) {
        var unloaded = [];
        Box.Object.each(templates, function (key, item) {
            item.name = key;
            this.push2Pools(pro, [item]);
            if (item.id) {
                item.content = this.parseElementTemplateContent(item.id);
            }
            if (item.content) {
                this.setContent(pro, item.name, item.content);
            } else if (!Box.isEmpty(item.path)) {
                if (!this.isLoaded(pro, item.name)) {//如果没有加载模板,就需要加载一下
                    unloaded.push(item);
                }
                else {//已经加载过了,就关联一下
                    this.setContent(pro, item.name, Box.requireSync('text!' + item.path))
                }
            }
        }, this);
        this.proxy(pro, unloaded);
    },

    parseElementTemplateContent: function (id) {
        var element = Box.get('#' + id).hide();
        if (Box.isEmpty(element)) {
            return Box.dom.Helper.parse({tag: 'div'});
        }
        return element.html();
    },

    push2Pools: function (pro, templates) {
        var name = pro.$className,
            manager;

        if (!(manager = this.pools[name])) {
            manager = this.pools[name] = new Box.util.HashMap({
                getKey: function (item) {
                    return item.name;
                }
            });
        }
        Box.Array.forEach(templates, function (template, i) {
            if (Box.isEmpty(manager.get(template.name))) {
                manager.push(template.name, template);
            }
        }, this);
    },

    proxy: function (pro, templates, params, callback) {
        templates = Box.isArray(templates) ? templates : [templates];
        if (Box.isEmpty(templates)) {
            return;
        }
        if (Box.isEmpty(Box.TEMPLATE_SERVER_URL)) {
            Box.Array.forEach(templates, function (tpl) {
                this.setContent(pro, tpl.name, Box.requireSync('text!' + tpl.path));
            }, this);
        } else {
            var proxyConfig = {
                async: false,
                type: Box.TEMPLATE_SERVER_METHOD || "GET",
                url: Box.TEMPLATE_SERVER_URL
            }, me = this;
            proxyConfig.data = Box.apply({
                templates: Box.util.JSON.encode(templates)
            }, params || {});
            var call_fn = function (data) {
                if (Box.isFunction(callback)) {
                    data = callback.call(pro, data);
                }
                Box.Object.each(data, function (name, content) {
                    this.setContent(pro, name, content);
                }, me);
            };
            Box.DOM_QUERY.ajax(proxyConfig).done(call_fn);
        }
    },

    compile: function (pro, name, content) {
        var scope_end_prefix = this.statics().TEMPLATE_SCOPE_END_PREFIX;
        var compiler = Box.ComponentTplCompile[Box.TEMPLATE_TYPE];
        var compile;

        if (Box.isString(content) || Box.isArray(content)) {
            var scope = pro[name + scope_end_prefix] || pro;
            content = Box.isArray(content) ? content.join('') : content;
            compile = compiler(content, scope);
        } else if (Box.isFunction(content)) {
            compile = content;
        }
        if (Box.isEmpty(compile)) {
            compile = function () {
                return Box.dom.Helper.parse({tag: 'div'});
            }
        }
        pro.__$setCompileTemplate(name, compile);
    },

    setContent: function (pro, name, content) {
        var template = this.get(pro, name);
        this.compile(pro, name, content);
        return template.content = content;
    },

    isLoaded: function (pro, name) {
        var template = this.get(pro, name);
        return !Box.isEmpty(template.content);
    },

    get: function (pro, name) {
        var manager = this.pools[pro.$className];
        if (Box.isEmpty(manager)) {
            return null;
        }
        return manager.get(name);
    }

});
