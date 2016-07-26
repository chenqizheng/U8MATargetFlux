import fetch from 'isomorphic-fetch';
export var month = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
export function sendWaRequest(session, wacomponents, onSuccess, onFail) {
    var body = {
        wacomponents: {
            session: {
                session: session.session,
                id: session.session
            },
            wacomponent: wacomponents
        }
    };

    return fetch(session.waurl, {
        method: "POST",
        headers: {
            'compresstype': '1',
            'translatetype': 'json',
            'translateversion': '1.1',
            'compress': 'N',
            'contaiver': 'N',
            'encryption': 'N',
            'encryptiontype': 1
        },
        body: JSON.stringify(body)
    }).then(response => response.json())
        .then(onSuccess, onFail);
}

export function fmoney(s, n) {
    if (isNaN(s) || s == "") {
        return s;
    }
    var start = "";
    if (s < 0) {
        s = Math.abs(s);
        start = "-";
    }
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return start + t.split("").reverse().join("") + "." + r;
}
