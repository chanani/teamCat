if (typeof Object.create !== "function") {
    Object.create = function(b) {
        function a() {}
        a.prototype = b;
        return new a()
    }
}
var ua = {
    toString: function() {
        return navigator.userAgent
    },
    test: function(a) {
        return this.toString().toLowerCase().indexOf(a.toLowerCase()) > -1
    }
};
ua.version = (ua.toString().toLowerCase().match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
ua.webkit = ua.test("webkit");
ua.gecko = ua.test("gecko") && !ua.webkit;
ua.opera = ua.test("opera");
ua.ie = ua.test("msie") && !ua.opera;
ua.ie6 = ua.ie && document.compatMode && typeof document.documentElement.style.maxHeight === "undefined";
ua.ie7 = ua.ie && document.documentElement && typeof document.documentElement.style.maxHeight !== "undefined" && typeof XDomainRequest === "undefined";
ua.ie8 = ua.ie && typeof XDomainRequest !== "undefined";
var domReady = function() {
    var a = [];
    var b = function() {
        if (!arguments.callee.done) {
            arguments.callee.done = true;
            for (var c = 0; c < a.length; c++) {
                a[c]()
            }
        }
    };
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", b, false)
    }
    if (ua.ie) {
        (function() {
            try {
                document.documentElement.doScroll("left")
            } catch (c) {
                setTimeout(arguments.callee, 50);
                return
            }
            b()
        }
        )();
        document.onreadystatechange = function() {
            if (document.readyState === "complete") {
                document.onreadystatechange = null;
                b()
            }
        }
    }
    if (ua.webkit && document.readyState) {
        (function() {
            if (document.readyState !== "loading") {
                b()
            } else {
                setTimeout(arguments.callee, 10)
            }
        }
        )()
    }
    window.onload = b;
    return function(c) {
        if (typeof c === "function") {
            a[a.length] = c
        }
        return c
    }
}();
var cssHelper = function() {
    var g = {
        BLOCKS: /[^\s{][^{]*\{(?:[^{}]*\{[^{}]*\}[^{}]*|[^{}]*)*\}/g,
        BLOCKS_INSIDE: /[^\s{][^{]*\{[^{}]*\}/g,
        DECLARATIONS: /[a-zA-Z\-]+[^;]*:[^;]+;/g,
        RELATIVE_URLS: /url\(['"]?([^\/\)'"][^:\)'"]+)['"]?\)/g,
        REDUNDANT_COMPONENTS: /(?:\/\*([^*\\\\]|\*(?!\/))+\*\/|@import[^;]+;)/g,
        REDUNDANT_WHITESPACE: /\s*(,|:|;|\{|\})\s*/g,
        MORE_WHITESPACE: /\s{2,}/g,
        FINAL_SEMICOLONS: /;\}/g,
        NOT_WHITESPACE: /\S+/g
    };
    var k, j = false;
    var b = [];
    var t = function(u) {
        if (typeof u === "function") {
            b[b.length] = u
        }
    };
    var m = function() {
        for (var u = 0; u < b.length; u++) {
            b[u](k)
        }
    };
    var c = {};
    var n = function(y, u) {
        if (c[y]) {
            var x = c[y].listeners;
            if (x) {
                for (var w = 0; w < x.length; w++) {
                    x[w](u)
                }
            }
        }
    };
    var h = function(v, w, z) {
        if (ua.ie && !window.XMLHttpRequest) {
            window.XMLHttpRequest = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        if (!XMLHttpRequest) {
            return ""
        }
        var x = new XMLHttpRequest();
        try {
            x.open("get", v, true);
            x.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest")
        } catch (y) {
            z();
            return
        }
        var u = false;
        setTimeout(function() {
            u = true
        }, 5000);
        document.documentElement.style.cursor = "progress";
        x.onreadystatechange = function() {
            if (x.readyState === 4 && !u) {
                if (!x.status && location.protocol === "file:" || (x.status >= 200 && x.status < 300) || x.status === 304 || navigator.userAgent.indexOf("Safari") > -1 && typeof x.status === "undefined") {
                    w(x.responseText)
                } else {
                    z()
                }
                document.documentElement.style.cursor = "";
                x = null
            }
        }
        ;
        x.send("")
    };
    var f = function(u) {
        u = u.replace(g.REDUNDANT_COMPONENTS, "");
        u = u.replace(g.REDUNDANT_WHITESPACE, "$1");
        u = u.replace(g.MORE_WHITESPACE, " ");
        u = u.replace(g.FINAL_SEMICOLONS, "}");
        return u
    };
    var a = {
        mediaQueryList: function(C) {
            var u = {};
            var B = C.indexOf("{");
            var y = C.substring(0, B);
            C = C.substring(B + 1, C.length - 1);
            var x = []
              , w = [];
            var v = y.toLowerCase().substring(7).split(",");
            for (var A = 0; A < v.length; A++) {
                x[x.length] = a.mediaQuery(v[A], u)
            }
            var z = C.match(g.BLOCKS_INSIDE);
            if (z !== null) {
                for (A = 0; A < z.length; A++) {
                    w[w.length] = a.rule(z[A], u)
                }
            }
            u.getMediaQueries = function() {
                return x
            }
            ;
            u.getRules = function() {
                return w
            }
            ;
            u.getListText = function() {
                return y
            }
            ;
            u.getCssText = function() {
                return C
            }
            ;
            return u
        },
        mediaQuery: function(D, C) {
            D = D || "";
            var v = false, B;
            var x = [];
            var u = true;
            var A = D.match(g.NOT_WHITESPACE);
            for (var z = 0; z < A.length; z++) {
                var w = A[z];
                if (!B && (w === "not" || w === "only")) {
                    if (w === "not") {
                        v = true
                    }
                } else {
                    if (!B) {
                        B = w
                    } else {
                        if (w.charAt(0) === "(") {
                            var y = w.substring(1, w.length - 1).split(":");
                            x[x.length] = {
                                mediaFeature: y[0],
                                value: y[1] || null
                            }
                        }
                    }
                }
            }
            return {
                getList: function() {
                    return C || null
                },
                getValid: function() {
                    return u
                },
                getNot: function() {
                    return v
                },
                getMediaType: function() {
                    return B
                },
                getExpressions: function() {
                    return x
                }
            }
        },
        rule: function(B, y) {
            var u = {};
            var z = B.indexOf("{");
            var A = B.substring(0, z);
            var C = A.split(",");
            var v = [];
            var w = B.substring(z + 1, B.length - 1).split(";");
            for (var x = 0; x < w.length; x++) {
                v[v.length] = a.declaration(w[x], u)
            }
            u.getMediaQueryList = function() {
                return y || null
            }
            ;
            u.getSelectors = function() {
                return C
            }
            ;
            u.getSelectorText = function() {
                return A
            }
            ;
            u.getDeclarations = function() {
                return v
            }
            ;
            u.getPropertyValue = function(E) {
                for (var D = 0; D < v.length; D++) {
                    if (v[D].getProperty() === E) {
                        return v[D].getValue()
                    }
                }
                return null
            }
            ;
            return u
        },
        declaration: function(x, y) {
            var u = x.indexOf(":");
            var z = x.substring(0, u);
            var w = x.substring(u + 1);
            return {
                getRule: function() {
                    return y || null
                },
                getProperty: function() {
                    return z
                },
                getValue: function() {
                    return w
                }
            }
        }
    };
    var s = function(z) {
        if (typeof z.cssHelperText !== "string") {
            return
        }
        var y = {
            mediaQueryLists: [],
            rules: [],
            selectors: {},
            declarations: [],
            properties: {}
        };
        var E = y.mediaQueryLists;
        var D = y.rules;
        var u = z.cssHelperText.match(g.BLOCKS);
        if (u !== null) {
            for (var C = 0; C < u.length; C++) {
                if (u[C].substring(0, 7) === "@media ") {
                    E[E.length] = a.mediaQueryList(u[C]);
                    D = y.rules = D.concat(E[E.length - 1].getRules())
                } else {
                    D[D.length] = a.rule(u[C])
                }
            }
        }
        var w = y.selectors;
        var v = function(H) {
            var G = H.getSelectors();
            for (var F = 0; F < G.length; F++) {
                var I = G[F];
                if (!w[I]) {
                    w[I] = []
                }
                w[I][w[I].length] = H
            }
        };
        for (C = 0; C < D.length; C++) {
            v(D[C])
        }
        var B = y.declarations;
        for (C = 0; C < D.length; C++) {
            B = y.declarations = B.concat(D[C].getDeclarations())
        }
        var x = y.properties;
        for (C = 0; C < B.length; C++) {
            var A = B[C].getProperty();
            if (!x[A]) {
                x[A] = []
            }
            x[A][x[A].length] = B[C]
        }
        z.cssHelperParsed = y;
        k[k.length] = z;
        return y
    };
    var d = function(v, u) {
        v.cssHelperText = f(u || v.innerHTML);
        return s(v)
    };
    var r = function() {
        j = true;
        k = [];
        var v = [];
        var B = function() {
            for (var D = 0; D < v.length; D++) {
                s(v[D])
            }
            var E = document.getElementsByTagName("style");
            for (D = 0; D < E.length; D++) {
                d(E[D])
            }
            j = false;
            m()
        };
        var C = document.getElementsByTagName("link");
        for (var x = 0; x < C.length; x++) {
            var A = C[x];
            try {
                if (A.getAttribute("rel").indexOf("style") > -1 && A.href && A.href.length !== 0 && !A.disabled) {
                    v[v.length] = A
                }
            } catch (y) {}
        }
        if (v.length > 0) {
            var z = 0;
            var w = function() {
                z++;
                if (z === v.length) {
                    B()
                }
            };
            var u = function(E) {
                var D = E.href;
                h(D, function(F) {
                    F = f(F).replace(g.RELATIVE_URLS, "url(" + D.substring(0, D.lastIndexOf("/")) + "/$1)");
                    E.cssHelperText = F;
                    w()
                }, w)
            };
            for (x = 0; x < v.length; x++) {
                u(v[x])
            }
        } else {
            B()
        }
    };
    var l = {
        mediaQueryLists: "array",
        rules: "array",
        selectors: "object",
        declarations: "array",
        properties: "object"
    };
    var q = {
        mediaQueryLists: null,
        rules: null,
        selectors: null,
        declarations: null,
        properties: null
    };
    var i = function(w, u) {
        if (q[w] !== null) {
            if (l[w] === "array") {
                return (q[w] = q[w].concat(u))
            } else {
                var y = q[w];
                for (var x in u) {
                    if (u.hasOwnProperty(x)) {
                        if (!y[x]) {
                            y[x] = u[x]
                        } else {
                            y[x] = y[x].concat(u[x])
                        }
                    }
                }
                return y
            }
        }
    };
    var o = function(u) {
        q[u] = (l[u] === "array") ? [] : {};
        for (var v = 0; v < k.length; v++) {
            i(u, k[v].cssHelperParsed[u])
        }
        return q[u]
    };
    domReady(function() {
        var v = document.body.getElementsByTagName("*");
        for (var u = 0; u < v.length; u++) {
            v[u].checkedByCssHelper = true
        }
        if (document.implementation.hasFeature("MutationEvents", "2.0") || window.MutationEvent) {
            document.body.addEventListener("DOMNodeInserted", function(x) {
                var w = x.target;
                if (w.nodeType === 1) {
                    n("DOMElementInserted", w);
                    w.checkedByCssHelper = true
                }
            }, false)
        } else {
            setInterval(function() {
                var x = document.body.getElementsByTagName("*");
                for (var w = 0; w < x.length; w++) {
                    if (!x[w].checkedByCssHelper) {
                        n("DOMElementInserted", x[w]);
                        x[w].checkedByCssHelper = true
                    }
                }
            }, 1000)
        }
    });
    var p = function(u) {
        if (typeof window.innerWidth != "undefined") {
            return window["inner" + u]
        } else {
            if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != "undefined" && document.documentElement.clientWidth != 0) {
                return document.documentElement["client" + u]
            }
        }
    };
    return {
        addStyle: function(v, w) {
            var u = document.createElement("style");
            u.setAttribute("type", "text/css");
            document.getElementsByTagName("head")[0].appendChild(u);
            if (u.styleSheet) {
                u.styleSheet.cssText = v
            } else {
                u.appendChild(document.createTextNode(v))
            }
            u.addedWithCssHelper = true;
            if (typeof w === "undefined" || w === true) {
                cssHelper.parsed(function(x) {
                    var y = d(u, v);
                    for (var z in y) {
                        if (y.hasOwnProperty(z)) {
                            i(z, y[z])
                        }
                    }
                    n("newStyleParsed", u)
                })
            } else {
                u.parsingDisallowed = true
            }
            return u
        },
        removeStyle: function(u) {
            return u.parentNode.removeChild(u)
        },
        parsed: function(u) {
            if (j) {
                t(u)
            } else {
                if (typeof k !== "undefined") {
                    if (typeof u === "function") {
                        u(k)
                    }
                } else {
                    t(u);
                    r()
                }
            }
        },
        mediaQueryLists: function(u) {
            cssHelper.parsed(function(v) {
                u(q.mediaQueryLists || o("mediaQueryLists"))
            })
        },
        rules: function(u) {
            cssHelper.parsed(function(v) {
                u(q.rules || o("rules"))
            })
        },
        selectors: function(u) {
            cssHelper.parsed(function(v) {
                u(q.selectors || o("selectors"))
            })
        },
        declarations: function(u) {
            cssHelper.parsed(function(v) {
                u(q.declarations || o("declarations"))
            })
        },
        properties: function(u) {
            cssHelper.parsed(function(v) {
                u(q.properties || o("properties"))
            })
        },
        broadcast: n,
        addListener: function(v, u) {
            if (typeof u === "function") {
                if (!c[v]) {
                    c[v] = {
                        listeners: []
                    }
                }
                c[v].listeners[c[v].listeners.length] = u
            }
        },
        removeListener: function(x, w) {
            if (typeof w === "function" && c[x]) {
                var u = c[x].listeners;
                for (var v = 0; v < u.length; v++) {
                    if (u[v] === w) {
                        u.splice(v, 1);
                        v -= 1
                    }
                }
            }
        },
        getViewportWidth: function() {
            return p("Width")
        },
        getViewportHeight: function() {
            return p("Height")
        }
    }
}();
domReady(function enableCssMediaQueries() {
    var f;
    var l = {
        LENGTH_UNIT: /[0-9]+(em|ex|px|in|cm|mm|pt|pc)$/,
        RESOLUTION_UNIT: /[0-9]+(dpi|dpcm)$/,
        ASPECT_RATIO: /^[0-9]+\/[0-9]+$/,
        ABSOLUTE_VALUE: /^[0-9]*(\.[0-9]+)*$/
    };
    var o = [];
    var j = function() {
        var s = "css3-mediaqueries-test";
        var r = document.createElement("div");
        r.id = s;
        var q = cssHelper.addStyle("@media all and (width) { #" + s + " { width: 1px !important; } }", false);
        document.body.appendChild(r);
        var p = r.offsetWidth === 1;
        q.parentNode.removeChild(q);
        r.parentNode.removeChild(r);
        j = function() {
            return p
        }
        ;
        return p
    };
    var b = function() {
        f = document.createElement("div");
        f.style.cssText = "position:absolute;top:-9999em;left:-9999em;margin:0;border:none;padding:0;width:1em;font-size:1em;";
        document.body.appendChild(f);
        if (f.offsetWidth !== 16) {
            f.style.fontSize = 16 / f.offsetWidth + "em"
        }
        f.style.width = ""
    };
    var a = function(q) {
        f.style.width = q;
        var p = f.offsetWidth;
        f.style.width = "";
        return p
    };
    var n = function(B, y) {
        var r = B.length;
        var u = (B.substring(0, 4) === "min-");
        var x = (!u && B.substring(0, 4) === "max-");
        if (y !== null) {
            var t;
            var v;
            if (l.LENGTH_UNIT.exec(y)) {
                t = "length";
                v = a(y)
            } else {
                if (l.RESOLUTION_UNIT.exec(y)) {
                    t = "resolution";
                    v = parseInt(y, 10);
                    var z = y.substring((v + "").length)
                } else {
                    if (l.ASPECT_RATIO.exec(y)) {
                        t = "aspect-ratio";
                        v = y.split("/")
                    } else {
                        if (l.ABSOLUTE_VALUE) {
                            t = "absolute";
                            v = y
                        } else {
                            t = "unknown"
                        }
                    }
                }
            }
        }
        var q, A;
        if ("device-width" === B.substring(r - 12, r)) {
            q = screen.width;
            if (y !== null) {
                if (t === "length") {
                    return ((u && q >= v) || (x && q < v) || (!u && !x && q === v))
                } else {
                    return false
                }
            } else {
                return q > 0
            }
        } else {
            if ("device-height" === B.substring(r - 13, r)) {
                A = screen.height;
                if (y !== null) {
                    if (t === "length") {
                        return ((u && A >= v) || (x && A < v) || (!u && !x && A === v))
                    } else {
                        return false
                    }
                } else {
                    return A > 0
                }
            } else {
                if ("width" === B.substring(r - 5, r)) {
                    q = document.documentElement.clientWidth || document.body.clientWidth;
                    if (y !== null) {
                        if (t === "length") {
                            return ((u && q >= v) || (x && q < v) || (!u && !x && q === v))
                        } else {
                            return false
                        }
                    } else {
                        return q > 0
                    }
                } else {
                    if ("height" === B.substring(r - 6, r)) {
                        A = document.documentElement.clientHeight || document.body.clientHeight;
                        if (y !== null) {
                            if (t === "length") {
                                return ((u && A >= v) || (x && A < v) || (!u && !x && A === v))
                            } else {
                                return false
                            }
                        } else {
                            return A > 0
                        }
                    } else {
                        if ("device-aspect-ratio" === B.substring(r - 19, r)) {
                            return t === "aspect-ratio" && screen.width * v[1] === screen.height * v[0]
                        } else {
                            if ("color-index" === B.substring(r - 11, r)) {
                                var p = Math.pow(2, screen.colorDepth);
                                if (y !== null) {
                                    if (t === "absolute") {
                                        return ((u && p >= v) || (x && p < v) || (!u && !x && p === v))
                                    } else {
                                        return false
                                    }
                                } else {
                                    return p > 0
                                }
                            } else {
                                if ("color" === B.substring(r - 5, r)) {
                                    var s = screen.colorDepth;
                                    if (y !== null) {
                                        if (t === "absolute") {
                                            return ((u && s >= v) || (x && s < v) || (!u && !x && s === v))
                                        } else {
                                            return false
                                        }
                                    } else {
                                        return s > 0
                                    }
                                } else {
                                    if ("resolution" === B.substring(r - 10, r)) {
                                        var w;
                                        if (z === "dpcm") {
                                            w = a("1cm")
                                        } else {
                                            w = a("1in")
                                        }
                                        if (y !== null) {
                                            if (t === "resolution") {
                                                return ((u && w >= v) || (x && w < v) || (!u && !x && w === v))
                                            } else {
                                                return false
                                            }
                                        } else {
                                            return w > 0
                                        }
                                    } else {
                                        return false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    var g = function(r) {
        var u = r.getValid();
        var t = r.getExpressions();
        var p = t.length;
        if (p > 0) {
            for (var q = 0; q < p && u; q++) {
                u = n(t[q].mediaFeature, t[q].value)
            }
            var s = r.getNot();
            return (u && !s || s && !u)
        }
    };
    var m = function(p) {
        var u = p.getMediaQueries();
        var r = {};
        for (var q = 0; q < u.length; q++) {
            if (g(u[q])) {
                r[u[q].getMediaType()] = true
            }
        }
        var v = []
          , x = 0;
        for (var w in r) {
            if (r.hasOwnProperty(w)) {
                if (x > 0) {
                    v[x++] = ","
                }
                v[x++] = w
            }
        }
        if (v.length > 0) {
            o[o.length] = cssHelper.addStyle("@media " + v.join("") + "{" + p.getCssText() + "}", false)
        }
    };
    var d = function(p) {
        for (var q = 0; q < p.length; q++) {
            m(p[q])
        }
        if (ua.ie) {
            document.documentElement.style.display = "block";
            setTimeout(function() {
                document.documentElement.style.display = ""
            }, 0);
            setTimeout(function() {
                cssHelper.broadcast("cssMediaQueriesTested")
            }, 100)
        } else {
            cssHelper.broadcast("cssMediaQueriesTested")
        }
    };
    var k = function() {
        for (var p = 0; p < o.length; p++) {
            cssHelper.removeStyle(o[p])
        }
        o = [];
        cssHelper.mediaQueryLists(d)
    };
    var i = 0;
    var h = function() {
        var r = cssHelper.getViewportWidth();
        var t = cssHelper.getViewportHeight();
        if (ua.ie) {
            var q = document.createElement("div");
            q.style.position = "absolute";
            q.style.top = "-9999em";
            q.style.overflow = "scroll";
            document.body.appendChild(q);
            i = q.offsetWidth - q.clientWidth;
            document.body.removeChild(q)
        }
        var s;
        var p = function() {
            var u = cssHelper.getViewportWidth();
            var v = cssHelper.getViewportHeight();
            if (Math.abs(u - r) > i || Math.abs(v - t) > i) {
                r = u;
                t = v;
                clearTimeout(s);
                s = setTimeout(function() {
                    if (!j()) {
                        k()
                    } else {
                        cssHelper.broadcast("cssMediaQueriesTested")
                    }
                }, 500)
            }
        };
        window.onresize = function() {
            var u = window.onresize || function() {}
            ;
            return function() {
                u();
                p()
            }
        }()
    };
    var c = document.documentElement;
    c.style.marginLeft = "-32767px";
    setTimeout(function() {
        c.style.marginTop = ""
    }, 20000);
    return function() {
        if (!j()) {
            cssHelper.addListener("newStyleParsed", function(p) {
                d(p.cssHelperParsed.mediaQueryLists)
            });
            cssHelper.addListener("cssMediaQueriesTested", function() {
                if (ua.ie) {
                    c.style.width = "1px"
                }
                setTimeout(function() {
                    c.style.width = "";
                    c.style.marginLeft = ""
                }, 0);
                cssHelper.removeListener("cssMediaQueriesTested", arguments.callee)
            });
            b();
            k()
        } else {
            c.style.marginLeft = ""
        }
        h()
    }
}());
try {
    document.execCommand("BackgroundImageCache", false, true)
} catch (e) {}
;