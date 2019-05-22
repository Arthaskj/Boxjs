Box.define('Box.app.History', {

    mixins: {
        event: Box.util.Event
    },

    singleton: true,

    routeStripper: /^[#\/]|\s+$/g,

    rootStripper: /^\/+|\/+$/g,

    pathStripper: /#.*$/,

    started: false,

    handlers: [],

    constructor: function () {
        if (typeof window !== 'undefined') {
            this.location = window.location;
            this.history = window.history;
        }
        this.mixins.event.constructor.call(this);
    },

    interval: 50,

    atRoot: function () {
        var path = this.location.pathname.replace(/[^\/]$/, '$&/');
        return path === this.root && !this.getSearch();
    },

    getSearch: function () {
        var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
        return match ? match[0] : '';
    },

    getHash: function (window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
    },

    getPath: function () {
        var path = decodeURI(this.location.pathname + this.getSearch());
        var root = this.root.slice(0, -1);
        if (!path.indexOf(root)) path = path.slice(root.length);
        return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    getFragment: function (fragment) {
        if (fragment == null) {
            if (this._hasPushState || !this._wantsHashChange) {
                fragment = this.getPath();
            } else {
                fragment = this.getHash();
            }
        }
        return fragment.replace(this.routeStripper, '');
    },

    start: function (options) {
        if (this.started) {
            Box.Error('Box.app.Router has already been started');
        }
        this.started = true;

        this.options = Box.apply({
            root: '/'
        }, this.options, options);
        this.root = this.options.root;

        this._wantsHashChange = this.options.hashChange !== false;
        this._hasHashChange = 'onhashchange' in window;
        this._wantsPushState = !!this.options.pushState;
        this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

        this.fragment = this.getFragment();

        this.root = ('/' + this.root + '/').replace(this.rootStripper, '/');

        if (this._wantsHashChange && this._wantsPushState) {
            if (!this._hasPushState && !this.atRoot()) {
                var root = this.root.slice(0, -1) || '/';
                this.location.replace(root + '#' + this.getPath());
                return true;
            } else if (this._hasPushState && this.atRoot()) {
                this.navigate(this.getHash(), {
                    replace: true
                });
            }
        }

        if (!this._hasHashChange && this._wantsHashChange && (!this._wantsPushState || !this._hasPushState)) {
            var iframe = document.createElement('iframe');
            iframe.src = 'javascript:0';
            iframe.style.display = 'none';
            iframe.tabIndex = -1;
            var body = document.body;
            this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
            this.iframe.document.open().close();
            this.iframe.location.hash = '#' + this.fragment;
        }

        var addEventListener = window.addEventListener || function (eventName, listener) {
            return attachEvent('on' + eventName, listener);
        };

        var checkUrl = Box.Function.bind(this.checkUrl, this);

        if (this._hasPushState) {
            addEventListener('popstate', checkUrl, false);
        } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
            addEventListener('hashchange', checkUrl, false);
        } else if (this._wantsHashChange) {
            this._checkUrlInterval = setInterval(checkUrl, this.interval);
        }

        if (!this.options.silent) {
            return this.loadUrl();
        }
    },

    stop: function () {
        var removeEventListener = window.removeEventListener || function (eventName, listener) {
            return detachEvent('on' + eventName, listener);
        };

        if (this._hasPushState) {
            removeEventListener('popstate', this.checkUrl, false);
        } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
            removeEventListener('hashchange', this.checkUrl, false);
        }
        if (this.iframe) {
            document.body.removeChild(this.iframe.frameElement);
            this.iframe = null;
        }
        if (this._checkUrlInterval) {
            clearInterval(this._checkUrlInterval);
        }
        this.started = false;
    },

    route: function (route, callback) {
        this.handlers.unshift({
            route: route,
            callback: callback
        });
    },

    checkUrl: function (e) {
        var current = this.getFragment();

        if (current === this.fragment && this.iframe) {
            current = this.getHash(this.iframe);
        }
        if (current === this.fragment) {
            return false;
        }
        if (this.iframe) {
            this.navigate(current);
        }
        this.loadUrl();
    },

    loadUrl: function (fragment) {
        fragment = this.fragment = this.getFragment(fragment);
        Box.Array.each(this.handlers, function (handler) {
            if (handler.route.test(fragment)) {
                handler.callback(fragment);
                return false;
            }
        })
    },

    navigate: function (fragment, options) {
        if (!this.started) {
            return false;
        }
        if (!options || options === true) {
            options = {
                trigger: !!options
            };
        }

        fragment = this.getFragment(fragment || '');

        var root = this.root;
        if (fragment === '' || fragment.charAt(0) === '?') {
            root = root.slice(0, -1) || '/';
        }
        var url = root + fragment;

        fragment = decodeURI(fragment.replace(this.pathStripper, ''));

        if (this.fragment === fragment) {
            return;
        }
        this.fragment = fragment;

        if (this._hasPushState) {
            this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            if (this.iframe && (fragment !== this.getHash(this.iframe))) {
                if (!options.replace) {
                    this.iframe.document.open().close();
                }
                this._updateHash(this.iframe.location, fragment, options.replace);
            }
        } else {
            return this.location.assign(url);
        }
        if (options.trigger) {
            return this.loadUrl(fragment);
        }
    },

    _updateHash: function (location, fragment, replace) {
        if (replace) {
            var href = location.href.replace(/(javascript:|#).*$/, '');
            location.replace(href + '#' + fragment);
        } else {
            location.hash = '#' + fragment;
        }
    }

});