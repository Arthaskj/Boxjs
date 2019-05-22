Box.define('Box.util.LocalStorage', {

    statics: {

        ID: +new Date,

        cache: {},

        get: function (id) {
            var cache = this.cache;
            var config = {_users: 1}, instance;
            if (Box.isString(id)) {
                config.id = id;
            } else {
                Box.apply(config, id);
            }
            if (!(instance = cache[config.id])) {
                instance = new this(config);
            } else {
                if (instance === true) {
                    Box.Error('Creating a shared instance of private local store "' + this.id + '".');
                }
                ++instance._users;
            }
            return instance;
        },

        supported: true

    },

    id: null,

    destroyed: false,

    lazyKeys: true,

    prefix: '',

    session: false,

    _keys: null,

    _store: null,

    _users: 0,

    constructor: function (config) {
        var statics = this.statics();
        Box.apply(this, config);
        this.id = this.id || statics.ID++;
        if (this._users) {
            statics.cache[this.id] = this
        } else {
            if (statics.cache[this.id]) {
                Box.Error('Cannot create duplicate instance of local store "' +
                    this.id + '". Use Box.util.LocalStorage.get() to share instances.');
            }
            statics.cache[this.id] = true;
        }
        this.initStore();
    },

    initStore: function () {
        if (!this.prefix && this.id) {
            this.prefix = this.id + '-';
        }
        this._store = (this.session ? Box.global.sessionStorage : Box.global.localStorage);
    },

    getKeys: function () {
        var store = this._store,
            prefix = this.prefix,
            keys = this._keys,
            prefixLen = prefix.length,
            key, i;

        if (!keys) {
            this._keys = keys = [];
            for (i = store.length; i--;) {
                key = store.key(i);
                if (key.length > prefixLen) {
                    if (prefix === key.substring(0, prefixLen)) {
                        keys.push(key.substring(prefixLen));
                    }
                }
            }
        }
        return keys
    },

    key: function (index) {
        var keys = this._keys || this.getKeys();
        return (0 <= index && index < keys.length) ? keys[index] : null;
    },

    release: function () {
        if (!--this._users) {
            this.destroy();
        }
    },

    set: function (key, value) {
        var iKey = this.prefix + key,
            store = this._store,
            keys = this._keys,
            length = store.length;

        store.setItem(iKey, value);
        if (keys && length !== store.length) {
            keys.push(key)
        }
    },

    get: function (key) {
        return this._store.getItem(this.prefix + key)
    },

    remove: function (key) {
        var iKey = this.prefix + key,
            store = this._store,
            keys = this._keys,
            length = store.length;

        store.removeItem(iKey);
        if (keys && length !== store.length) {
            if (this.lazyKeys) {
                this._keys = null;
            } else {
                Box.Array.remove(keys, key);
            }
        }
    },

    clear: function () {
        var store = this._store,
            prefix = this.prefix,
            keys = this._keys || this.getKeys(),
            i;

        for (i = keys.length; i--;) {
            store.removeItem(prefix + keys[i]);
        }
        keys.length = 0;
    }

}, function () {

    var LocalStorage = this;

    if ('LocalStorage' in window) {
        return;
    }

    if (!Box.browser.is('IE')) {
        LocalStorage.supported = false;
        LocalStorage.prototype.init = function () {
            Box.Error("Local storage is not supported on this browser");
        };
        return;
    }

    Box.apply(this.prototype, {})

});