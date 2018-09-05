var tool = {
    generateSignedURL(channel_id, chapter_id, access_token, qingting_id) {
        if (channel_id && chapter_id && access_token && qingting_id) {
            var device_id = "WWW",
                timestamp = (new Date).getTime(),
                base_path = "/audiostream/redirect/" + channel_id + "/" + chapter_id + ".m4a",
                raw_query = "?access_token=" + access_token + "&device_id=" + device_id + "&qingting_id=" + qingting_id + "&t=" + timestamp,
                signature = this.sign("" + base_path + raw_query),
                query = "?access_token=" + encodeURIComponent(access_token) + "&device_id=" + device_id + "&qingting_id=" + encodeURIComponent(qingting_id) + "&t=" + timestamp;
            return "https://audio.qingting.fm" + base_path + query + "&sign=" + signature
        }
    },

    sign(t) {
        const l = [52, 62, 27, 60, 99, 0, 1, 6, 52, 0, 51];
        if ("string" === typeof t) {
            var e = l.slice(0, 6)
                , r = l.slice(6, 9)
                , n = l.slice(9);
            e = e.map(function (t) {
                return t += 50,
                t > 112 && (t -= 100),
                    t
            }),
                r = r.map(function (t) {
                    return t + 50
                }),
                n = n.map(function (t) {
                    return t + 50
                });
            var o = this.cc(e)
                , i = this.hh(r)
                , s = this.ff(n)
                , u = (o + "-0-" + i + "-0-" + s).replace(/-\d-/g, "");
            return this.aa(t, u.substr(0, 6) + "&" + u.substr(6, 3) + "_" + u.substr(9, 2))
        }
    },

    cc(t) {
        var e = "-1-";
        return t.map(function (t) {
            return String.fromCharCode(t)
        }).join(e)
    }
    ,
    hh(t) {
        var e = "-2-";
        return t.map(function (t) {
            return String.fromCharCode(t)
        }).join(e)
    }

    , ff(t) {
        var e = "-3-";
        return t.map(function (t) {
            return String.fromCharCode(t)
        }).join(e)
    }

    , aa(t, e) {
        return this.x(e, t)
    }

    , x(t, e) {
        return this.m(this.b(t, e))
    }

    , m(t) {
        var e, r, n = "0123456789abcdef", o = "";
        for (r = 0; r < t.length; r += 1)
            e = t.charCodeAt(r),
                o += n.charAt(e >>> 4 & 15) + n.charAt(15 & e);
        return o
    }

    , b(t, e) {
        return this.g(this._(t), this._(e))
    }


    , _(t) {
        return unescape(encodeURIComponent(t))
    }

    , g(t, e) {
        var r, n, o = this.f(t), i = [], a = [];
        for (i[15] = a[15] = void 0,
             o.length > 16 && (o = this.h(o, 8 * t.length)),
                 r = 0; r < 16; r += 1)
            i[r] = 909522486 ^ o[r],
                a[r] = 1549556828 ^ o[r];
        return n = this.h(i.concat(this.f(e)), 512 + 8 * e.length),
            this.d(this.h(a.concat(n), 640))
    }

    , d(t) {
        var e, r = "", n = 32 * t.length;
        for (e = 0; e < n; e += 8)
            r += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
        return r
    }

    , f(t) {
        var e, r = [];
        for (r[(t.length >> 2) - 1] = void 0,
                 e = 0; e < r.length; e += 1)
            r[e] = 0;
        var n = 8 * t.length;
        for (e = 0; e < n; e += 8)
            r[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
        return r
    }

    , h(t, e) {
        t[e >> 5] |= 128 << e % 32,
            t[(e + 64 >>> 9 << 4) + 14] = e;
        var r, n, o, a, s, h = 1732584193, d = -271733879, f = -1732584194, y = 271733878;
        for (r = 0; r < t.length; r += 16)
            n = h,
                o = d,
                a = f,
                s = y,
                h = this.l(h, d, f, y, t[r], 7, -680876936),
                y = this.l(y, h, d, f, t[r + 1], 12, -389564586),
                f = this.l(f, y, h, d, t[r + 2], 17, 606105819),
                d = this.l(d, f, y, h, t[r + 3], 22, -1044525330),
                h = this.l(h, d, f, y, t[r + 4], 7, -176418897),
                y = this.l(y, h, d, f, t[r + 5], 12, 1200080426),
                f = this.l(f, y, h, d, t[r + 6], 17, -1473231341),
                d = this.l(d, f, y, h, t[r + 7], 22, -45705983),
                h = this.l(h, d, f, y, t[r + 8], 7, 1770035416),
                y = this.l(y, h, d, f, t[r + 9], 12, -1958414417),
                f = this.l(f, y, h, d, t[r + 10], 17, -42063),
                d = this.l(d, f, y, h, t[r + 11], 22, -1990404162),
                h = this.l(h, d, f, y, t[r + 12], 7, 1804603682),
                y = this.l(y, h, d, f, t[r + 13], 12, -40341101),
                f = this.l(f, y, h, d, t[r + 14], 17, -1502002290),
                d = this.l(d, f, y, h, t[r + 15], 22, 1236535329),
                h = this.u(h, d, f, y, t[r + 1], 5, -165796510),
                y = this.u(y, h, d, f, t[r + 6], 9, -1069501632),
                f = this.u(f, y, h, d, t[r + 11], 14, 643717713),
                d = this.u(d, f, y, h, t[r], 20, -373897302),
                h = this.u(h, d, f, y, t[r + 5], 5, -701558691),
                y = this.u(y, h, d, f, t[r + 10], 9, 38016083),
                f = this.u(f, y, h, d, t[r + 15], 14, -660478335),
                d = this.u(d, f, y, h, t[r + 4], 20, -405537848),
                h = this.u(h, d, f, y, t[r + 9], 5, 568446438),
                y = this.u(y, h, d, f, t[r + 14], 9, -1019803690),
                f = this.u(f, y, h, d, t[r + 3], 14, -187363961),
                d = this.u(d, f, y, h, t[r + 8], 20, 1163531501),
                h = this.u(h, d, f, y, t[r + 13], 5, -1444681467),
                y = this.u(y, h, d, f, t[r + 2], 9, -51403784),
                f = this.u(f, y, h, d, t[r + 7], 14, 1735328473),
                d = this.u(d, f, y, h, t[r + 12], 20, -1926607734),
                h = this.c(h, d, f, y, t[r + 5], 4, -378558),
                y = this.c(y, h, d, f, t[r + 8], 11, -2022574463),
                f = this.c(f, y, h, d, t[r + 11], 16, 1839030562),
                d = this.c(d, f, y, h, t[r + 14], 23, -35309556),
                h = this.c(h, d, f, y, t[r + 1], 4, -1530992060),
                y = this.c(y, h, d, f, t[r + 4], 11, 1272893353),
                f = this.c(f, y, h, d, t[r + 7], 16, -155497632),
                d = this.c(d, f, y, h, t[r + 10], 23, -1094730640),
                h = this.c(h, d, f, y, t[r + 13], 4, 681279174),
                y = this.c(y, h, d, f, t[r], 11, -358537222),
                f = this.c(f, y, h, d, t[r + 3], 16, -722521979),
                d = this.c(d, f, y, h, t[r + 6], 23, 76029189),
                h = this.c(h, d, f, y, t[r + 9], 4, -640364487),
                y = this.c(y, h, d, f, t[r + 12], 11, -421815835),
                f = this.c(f, y, h, d, t[r + 15], 16, 530742520),
                d = this.c(d, f, y, h, t[r + 2], 23, -995338651),
                h = this.p(h, d, f, y, t[r], 6, -198630844),
                y = this.p(y, h, d, f, t[r + 7], 10, 1126891415),
                f = this.p(f, y, h, d, t[r + 14], 15, -1416354905),
                d = this.p(d, f, y, h, t[r + 5], 21, -57434055),
                h = this.p(h, d, f, y, t[r + 12], 6, 1700485571),
                y = this.p(y, h, d, f, t[r + 3], 10, -1894986606),
                f = this.p(f, y, h, d, t[r + 10], 15, -1051523),
                d = this.p(d, f, y, h, t[r + 1], 21, -2054922799),
                h = this.p(h, d, f, y, t[r + 8], 6, 1873313359),
                y = this.p(y, h, d, f, t[r + 15], 10, -30611744),
                f = this.p(f, y, h, d, t[r + 6], 15, -1560198380),
                d = this.p(d, f, y, h, t[r + 13], 21, 1309151649),
                h = this.p(h, d, f, y, t[r + 4], 6, -145523070),
                y = this.p(y, h, d, f, t[r + 11], 10, -1120210379),
                f = this.p(f, y, h, d, t[r + 2], 15, 718787259),
                d = this.p(d, f, y, h, t[r + 9], 21, -343485551),
                h = this.i(h, n),
                d = this.i(d, o),
                f = this.i(f, a),
                y = this.i(y, s);
        return [h, d, f, y]
    }

    , l(t, e, r, n, o, i, a) {
        return this.s(e & r | ~e & n, t, e, o, i, a)
    }

    , s(t, e, r, n, o, s) {
        return this.i(this.a(this.i(this.i(e, t), this.i(n, s)), o), r)
    }

    , i(t, e) {
        var r = (65535 & t) + (65535 & e)
            , n = (t >> 16) + (e >> 16) + (r >> 16);
        return n << 16 | 65535 & r
    }

    , a(t, e) {
        return t << e | t >>> 32 - e
    }

    , u(t, e, r, n, o, i, a) {
        return this.s(e & n | r & ~n, t, e, o, i, a)
    }

    , c(t, e, r, n, o, i, a) {
        return this.s(e ^ r ^ n, t, e, o, i, a)
    }

    , p(t, e, r, n, o, i, a) {
        return this.s(r ^ (e | ~n), t, e, o, i, a)
    }

};

export default tool;