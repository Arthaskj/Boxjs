Box.define('Box.util.Cookie', {

    singleton: true,

    set: function (name, value) {
        var argv = arguments;
        var argc = arguments.length;

        var expires = (argc > 2) ? argv[2] : null;
        var path = (argc > 3) ? argv[3] : '/';
        var domain = (argc > 4) ? argv[4] : null;
        var secure = (argc > 5) ? argv[5] : false;

        var expressions = name + "=" + escape(value);

        if (expires !== null) {
            expressions += "; expires=" + expires.toGMTString();
        }
        if (path !== null) {
            expressions += "; path=" + path;
        }
        if (domain !== null) {
            expressions += "; domain=" + domain;
        }
        if (secure === true) {
            expressions += "; secure";
        }

        document.cookie = expressions;
    },

    get: function (name) {
        var arg = name + "=",
            alen = arg.length,
            clen = document.cookie.length,
            i = 0,
            j = 0;

        while (i < clen) {
            j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return this.getCookieVal(j);
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i === 0) {
                break;
            }
        }
        return null;
    },

    clear: function (name, path) {
        if (this.get(name)) {
            path = path || '/';
            document.cookie = name + '=' + '; expires=Thu, 01-Jan-70 00:00:01 GMT; path=' + path;
        }
    },

    getCookieVal: function (offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    }

});
