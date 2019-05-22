Box.define('API.BodyView', {

	extend: 'Box.Component',

	config: {

		name: null,

        dir: null,

        path: null,

        childrens: []

    },

	elements: {

		children_body: '#children_body',

		content_body: '#doc-content',

		children_items: 'children_body@li'

	},

	delegates: {
		'h1 a.source': 'showClassSource'
	},

	templates: {

		main: 'template_body_main',

		childrens: 'template_body_childrens'

	},

	isHeader: function (record) {
		return Box.isString(record);

	},

	formatHref: function (name) {
		return '#/' + this.getDir() + '/' + name;
	},

	hasChild: function () {
		return !Box.isEmpty(this.getChildrens());
	},

	setup: function () {
		var path = this.getPath();
		this.initChildrenItems();

		if (!Box.isEmpty(path)) {
			this.setPath(path);
		} else if (this.hasChild()) {
			var first = this.childrens_hash.eq(0);
			this.setPath(first.path);
		}
	},

	initChildrenItems: function () {
		if (!this.hasChild()) {
			return;
		}
		var childrens = this.getChildrens();
		var children_els = this.applyTemplate('childrens', childrens);
		this.element('children_items', children_els);
		this.el.children_body.html(children_els);

		this.childrens_hash = new Box.util.HashMap({
			getKey: function (item) {
				return item.name;
			}
		});
		this.childrens_hash.push(Box.Array.filter(childrens, function (item) {
			return !Box.isString(item);
		}));
	},

	activeChildrenItem: function (name) {
		if (!this.childrens_hash) {
			this.initChildrenItems();
		}
		this.trigger('active', this, name);
		var config = this.childrens_hash.get(name);
		this.setName(name);
		this.setPath(config.path);
		this.el.children_items.filter('#nav_' + name)
			.addClass('am-active').siblings().removeClass('am-active');
	},

	showClassSource: function () {
        var config = this.childrens_hash.get(this.getName());
        var files = Box.Array.clone(Box.Array.from(config.files));
        if (Box.isEmpty(files)) {
            return;
        }
        window.open('source.html#' + files.join(','));
    },

	updatePath: function (path) {
		var me = this;
		if (Box.isEmpty(path)) {
			return
		}
		Box.require('text!src/' + path + '.md?t=' + +new Date, function (text) {
			var converter = new Showdown.converter();
			text = converter.makeHtml(text);
			text = text.replace(/<pre([^>\n]*)>/g, '<pre$1 class="prettyprint linenums">');
		    text = text.replace(/<table([^>\n]*)>/g, '<table$1 class="table table-striped table-bordered">');
			me.el.content_body.html(text);
	        window.prettyPrint && prettyPrint(me.el.content_body);
		});
	}

});