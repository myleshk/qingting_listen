function generateSignedURL(channel_id, chapter_id, access_token, qingting_id) {
    if (channel_id && chapter_id) {
        var device_id = "WWW",
            timestamp = (new Date).getTime(),
            base_path = "/audiostream/redirect/" + channel_id + "/" + chapter_id + ".m4a",
            raw_query = "?access_token=" + access_token + "&device_id=" + device_id + "&qingting_id=" + qingting_id + "&t=" + timestamp,
            signature = sign("" + base_path + raw_query),
            query = "?access_token=" + encodeURIComponent(access_token) + "&device_id=" + device_id + "&qingting_id=" + encodeURIComponent(qingting_id) + "&t=" + timestamp;
        return "https://audio.qingting.fm" + base_path + query + "&sign=" + signature
    }
}

function sign(t) {
    const l = [52, 62, 27, 60, 99, 0, 1, 6, 52, 0, 51];
    if ("string" == typeof t) {
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
        var o = cc(e)
            , i = hh(r)
            , s = ff(n)
            , u = (o + "-0-" + i + "-0-" + s).replace(/-\d-/g, "");
        return aa(t, u.substr(0, 6) + "&" + u.substr(6, 3) + "_" + u.substr(9, 2))
    }
}

function cc(t) {
    var e = "-1-";
    return t.map(function (t) {
        return String.fromCharCode(t)
    }).join(e)
}

function hh(t) {
    var e = "-2-";
    return t.map(function (t) {
        return String.fromCharCode(t)
    }).join(e)
}

function ff(t) {
    var e = "-3-";
    return t.map(function (t) {
        return String.fromCharCode(t)
    }).join(e)
}

function aa(t, e) {
    return x(e, t)
}

function x(t, e) {
    return m(b(t, e))
}

function m(t) {
    var e, r, n = "0123456789abcdef", o = "";
    for (r = 0; r < t.length; r += 1)
        e = t.charCodeAt(r),
            o += n.charAt(e >>> 4 & 15) + n.charAt(15 & e);
    return o
}

function b(t, e) {
    return g(_(t), _(e))
}


function _(t) {
    return unescape(encodeURIComponent(t))
}

function g(t, e) {
    var r, n, o = f(t), i = [], a = [];
    for (i[15] = a[15] = void 0,
         o.length > 16 && (o = h(o, 8 * t.length)),
             r = 0; r < 16; r += 1)
        i[r] = 909522486 ^ o[r],
            a[r] = 1549556828 ^ o[r];
    return n = h(i.concat(f(e)), 512 + 8 * e.length),
        d(h(a.concat(n), 640))
}

function d(t) {
    var e, r = "", n = 32 * t.length;
    for (e = 0; e < n; e += 8)
        r += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
    return r
}

function f(t) {
    var e, r = [];
    for (r[(t.length >> 2) - 1] = void 0,
             e = 0; e < r.length; e += 1)
        r[e] = 0;
    var n = 8 * t.length;
    for (e = 0; e < n; e += 8)
        r[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
    return r
}

function h(t, e) {
    t[e >> 5] |= 128 << e % 32,
        t[(e + 64 >>> 9 << 4) + 14] = e;
    var r, n, o, a, s, h = 1732584193, d = -271733879, f = -1732584194, y = 271733878;
    for (r = 0; r < t.length; r += 16)
        n = h,
            o = d,
            a = f,
            s = y,
            h = l(h, d, f, y, t[r], 7, -680876936),
            y = l(y, h, d, f, t[r + 1], 12, -389564586),
            f = l(f, y, h, d, t[r + 2], 17, 606105819),
            d = l(d, f, y, h, t[r + 3], 22, -1044525330),
            h = l(h, d, f, y, t[r + 4], 7, -176418897),
            y = l(y, h, d, f, t[r + 5], 12, 1200080426),
            f = l(f, y, h, d, t[r + 6], 17, -1473231341),
            d = l(d, f, y, h, t[r + 7], 22, -45705983),
            h = l(h, d, f, y, t[r + 8], 7, 1770035416),
            y = l(y, h, d, f, t[r + 9], 12, -1958414417),
            f = l(f, y, h, d, t[r + 10], 17, -42063),
            d = l(d, f, y, h, t[r + 11], 22, -1990404162),
            h = l(h, d, f, y, t[r + 12], 7, 1804603682),
            y = l(y, h, d, f, t[r + 13], 12, -40341101),
            f = l(f, y, h, d, t[r + 14], 17, -1502002290),
            d = l(d, f, y, h, t[r + 15], 22, 1236535329),
            h = u(h, d, f, y, t[r + 1], 5, -165796510),
            y = u(y, h, d, f, t[r + 6], 9, -1069501632),
            f = u(f, y, h, d, t[r + 11], 14, 643717713),
            d = u(d, f, y, h, t[r], 20, -373897302),
            h = u(h, d, f, y, t[r + 5], 5, -701558691),
            y = u(y, h, d, f, t[r + 10], 9, 38016083),
            f = u(f, y, h, d, t[r + 15], 14, -660478335),
            d = u(d, f, y, h, t[r + 4], 20, -405537848),
            h = u(h, d, f, y, t[r + 9], 5, 568446438),
            y = u(y, h, d, f, t[r + 14], 9, -1019803690),
            f = u(f, y, h, d, t[r + 3], 14, -187363961),
            d = u(d, f, y, h, t[r + 8], 20, 1163531501),
            h = u(h, d, f, y, t[r + 13], 5, -1444681467),
            y = u(y, h, d, f, t[r + 2], 9, -51403784),
            f = u(f, y, h, d, t[r + 7], 14, 1735328473),
            d = u(d, f, y, h, t[r + 12], 20, -1926607734),
            h = c(h, d, f, y, t[r + 5], 4, -378558),
            y = c(y, h, d, f, t[r + 8], 11, -2022574463),
            f = c(f, y, h, d, t[r + 11], 16, 1839030562),
            d = c(d, f, y, h, t[r + 14], 23, -35309556),
            h = c(h, d, f, y, t[r + 1], 4, -1530992060),
            y = c(y, h, d, f, t[r + 4], 11, 1272893353),
            f = c(f, y, h, d, t[r + 7], 16, -155497632),
            d = c(d, f, y, h, t[r + 10], 23, -1094730640),
            h = c(h, d, f, y, t[r + 13], 4, 681279174),
            y = c(y, h, d, f, t[r], 11, -358537222),
            f = c(f, y, h, d, t[r + 3], 16, -722521979),
            d = c(d, f, y, h, t[r + 6], 23, 76029189),
            h = c(h, d, f, y, t[r + 9], 4, -640364487),
            y = c(y, h, d, f, t[r + 12], 11, -421815835),
            f = c(f, y, h, d, t[r + 15], 16, 530742520),
            d = c(d, f, y, h, t[r + 2], 23, -995338651),
            h = p(h, d, f, y, t[r], 6, -198630844),
            y = p(y, h, d, f, t[r + 7], 10, 1126891415),
            f = p(f, y, h, d, t[r + 14], 15, -1416354905),
            d = p(d, f, y, h, t[r + 5], 21, -57434055),
            h = p(h, d, f, y, t[r + 12], 6, 1700485571),
            y = p(y, h, d, f, t[r + 3], 10, -1894986606),
            f = p(f, y, h, d, t[r + 10], 15, -1051523),
            d = p(d, f, y, h, t[r + 1], 21, -2054922799),
            h = p(h, d, f, y, t[r + 8], 6, 1873313359),
            y = p(y, h, d, f, t[r + 15], 10, -30611744),
            f = p(f, y, h, d, t[r + 6], 15, -1560198380),
            d = p(d, f, y, h, t[r + 13], 21, 1309151649),
            h = p(h, d, f, y, t[r + 4], 6, -145523070),
            y = p(y, h, d, f, t[r + 11], 10, -1120210379),
            f = p(f, y, h, d, t[r + 2], 15, 718787259),
            d = p(d, f, y, h, t[r + 9], 21, -343485551),
            h = i(h, n),
            d = i(d, o),
            f = i(f, a),
            y = i(y, s);
    return [h, d, f, y]
}

function l(t, e, r, n, o, i, a) {
    return s(e & r | ~e & n, t, e, o, i, a)
}

function s(t, e, r, n, o, s) {
    return i(a(i(i(e, t), i(n, s)), o), r)
}

function i(t, e) {
    var r = (65535 & t) + (65535 & e)
        , n = (t >> 16) + (e >> 16) + (r >> 16);
    return n << 16 | 65535 & r
}

function a(t, e) {
    return t << e | t >>> 32 - e
}

function u(t, e, r, n, o, i, a) {
    return s(e & n | r & ~n, t, e, o, i, a)
}

function c(t, e, r, n, o, i, a) {
    return s(e ^ r ^ n, t, e, o, i, a)
}

function p(t, e, r, n, o, i, a) {
    return s(r ^ (e | ~n), t, e, o, i, a)
}