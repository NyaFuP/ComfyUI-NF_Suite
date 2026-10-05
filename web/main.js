import { api as en } from "../../scripts/api.js";
import { app as jt } from "../../scripts/app.js";
function Gu(e) {
  jt.registerExtension(e);
}
function to(e, t) {
  return e.widgets?.find((n) => n.name === t);
}
function An(e, t, n) {
  const i = to(e, t);
  return i === void 0 || i.value === void 0 ? n : i.value;
}
function No(e, t, n) {
  const i = to(e, t);
  return i ? (i.value === n || (i.value = n, e.setDirtyCanvas?.(!0, !0)), !0) : !1;
}
function qu(e) {
  e.hidden = !0, e.options.hidden = !0;
}
function Ju(e, t) {
  const n = e.callback;
  e.callback = function(i, ...o) {
    const r = n?.call(this, i, ...o);
    return t(i), r;
  };
}
function Wl(e, t) {
  const n = e, i = n.onConfigure;
  n.onConfigure = function(...o) {
    const r = i?.apply(this, o);
    return t(), r;
  };
}
function Yu(e, t) {
  return e.inputs?.find((n) => n.name === t)?.link != null;
}
function Zu(e, t) {
  const n = e, i = n.onConnectionsChange;
  n.onConnectionsChange = function(...o) {
    const r = i?.apply(this, o);
    return t(), r;
  };
}
function Vr(e, t, n, i = {}) {
  const o = e.addDOMWidget(t, "nf-ui", n, {
    hideOnZoom: !1,
    ...i,
    serialize: !1
  });
  return o.serialize = !1, o;
}
function Gl(e) {
  const t = e.computeSize?.();
  if (!t) return;
  const [n, i] = e.size;
  t[1] > i && e.setSize?.([n, t[1]]), e.setDirtyCanvas?.(!0, !0);
}
function vn(e, t, n) {
  jt.extensionManager?.toast?.add({ severity: e, summary: t, detail: n, life: e === "error" ? 6e3 : 3e3 });
}
async function Os(e, t) {
  const n = jt.extensionManager?.dialog;
  return n?.confirm ? await n.confirm({ title: e, message: t }) === !0 : window.confirm(`${e}

${t}`);
}
function Qu(e) {
  jt.extensionManager.registerSidebarTab({ ...e, type: "custom" });
}
function Xu(e, t) {
  return en.fetchApi(e, t);
}
async function ed() {
  const { output: e, workflow: t } = await jt.graphToPrompt();
  return { output: e, workflow: t };
}
async function td(e, t) {
  const n = await en.queuePrompt(0, e, {
    partialExecutionTargets: t
  });
  return { prompt_id: String(n.prompt_id) };
}
function nd(e, t) {
  const n = (i) => t(i.detail);
  return en.addEventListener(e, n), () => en.removeEventListener(e, n);
}
function id(e) {
  return en.interrupt(e);
}
function od(e) {
  return en.deleteItem("queue", e);
}
function rd(e, t) {
  const n = e, i = n.onExecuted;
  n.onExecuted = function(o) {
    const r = i?.call(this, o);
    return t(o ?? {}), r;
  };
}
function sd(e, t, n) {
  const i = e.properties?.[t];
  return i === void 0 ? n : i;
}
function ld(e, t, n) {
  const i = e;
  i.properties ??= {}, i.properties[t] = n, e.graph?.setDirtyCanvas?.(!0, !0);
}
function ql(e) {
  const t = new URLSearchParams({ filename: e.filename, subfolder: e.subfolder ?? "", type: e.type ?? "temp" });
  return en.apiURL(`/view?${t}`);
}
let Do = null;
function ad() {
  return Do ??= en.getNodeDefs().then(
    (e) => new Set(Object.entries(e).filter(([, t]) => t.output_node).map(([t]) => t))
  ).catch((e) => {
    throw Do = null, e;
  }), Do;
}
function ud() {
  return jt.extensionManager?.setting?.get("Comfy.VueNodes.Enabled") === !0;
}
function dd(e, t) {
  const n = jt.canvas;
  n.adjustMouseEvent(t), n.processContextMenu(e, t);
}
function Jl() {
  return jt.isGraphReady ? jt.rootGraph : void 0;
}
function cd(e) {
  return Jl()?.getNodeById?.(Number(e))?.title ?? `#${e}`;
}
function Yl(e) {
  const t = Jl();
  return !!e.graph && !!t && e.graph !== t;
}
var fd = Object.defineProperty, xs = Object.getOwnPropertySymbols, pd = Object.prototype.hasOwnProperty, hd = Object.prototype.propertyIsEnumerable, Is = (e, t, n) => t in e ? fd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, gd = (e, t) => {
  for (var n in t || (t = {})) pd.call(t, n) && Is(e, n, t[n]);
  if (xs) for (var n of xs(t)) hd.call(t, n) && Is(e, n, t[n]);
  return e;
};
function In(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function or(e, t, n = /* @__PURE__ */ new WeakSet()) {
  if (e === t) return !0;
  if (!e || !t || typeof e != "object" || typeof t != "object" || n.has(e) || n.has(t)) return !1;
  n.add(e).add(t);
  let i = Array.isArray(e), o = Array.isArray(t), r, s, l;
  if (i && o) {
    if (s = e.length, s != t.length) return !1;
    for (r = s; r-- !== 0; ) if (!or(e[r], t[r], n)) return !1;
    return !0;
  }
  if (i != o) return !1;
  let a = e instanceof Date, d = t instanceof Date;
  if (a != d) return !1;
  if (a && d) return e.getTime() == t.getTime();
  let u = e instanceof RegExp, c = t instanceof RegExp;
  if (u != c) return !1;
  if (u && c) return e.toString() == t.toString();
  let f = Object.keys(e);
  if (s = f.length, s !== Object.keys(t).length) return !1;
  for (r = s; r-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t, f[r])) return !1;
  for (r = s; r-- !== 0; ) if (l = f[r], !or(e[l], t[l], n)) return !1;
  return !0;
}
function md(e, t) {
  return or(e, t);
}
function So(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function ae(e) {
  return !In(e);
}
function We(e, t) {
  if (!e || !t) return null;
  try {
    let n = e[t];
    if (ae(n)) return n;
  } catch {
  }
  if (Object.keys(e).length) {
    if (So(t)) return t(e);
    if (t.indexOf(".") === -1) return e[t];
    {
      let n = t.split("."), i = e;
      for (let o = 0, r = n.length; o < r; ++o) {
        if (i == null) return null;
        i = i[n[o]];
      }
      return i;
    }
  }
  return null;
}
function no(e, t, n) {
  return n ? We(e, n) === We(t, n) : md(e, t);
}
function Ct(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Zl(e = {}, t = {}) {
  let n = gd({}, e);
  return Object.keys(t).forEach((i) => {
    let o = i;
    Ct(t[o]) && o in e && Ct(e[o]) ? n[o] = Zl(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function bd(...e) {
  return e.reduce((t, n, i) => i === 0 ? n : Zl(t, n), {});
}
function Mn(e, t) {
  let n = -1;
  if (ae(e)) try {
    n = e.findLastIndex(t);
  } catch {
    n = e.lastIndexOf([...e].reverse().find(t));
  }
  return n;
}
function Xe(e, ...t) {
  return So(e) ? e(...t) : e;
}
function Ye(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function $t(e) {
  return Ye(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function Nr(e, t = "", n = {}) {
  let i = $t(t).split("."), o = i.shift();
  if (o) {
    if (Ct(e)) {
      let r = Object.keys(e).find((s) => $t(s) === o) || "";
      return Nr(Xe(e[r], n), i.join("."), n);
    }
    return;
  }
  return Xe(e, n);
}
function Ql(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function vd(e) {
  return ae(e) && !isNaN(e);
}
function Xl(e = "") {
  return ae(e) && e.length === 1 && !!e.match(/\S| /);
}
function yn(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function yd(...e) {
  return bd(...e);
}
function ti(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function tt(e) {
  if (e && /[\xC0-\xFF\u0100-\u017E]/.test(e)) {
    let t = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
    for (let n in t) e = e.replace(t[n], n);
  }
  return e;
}
function Sd(e) {
  return Ye(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function ea(e) {
  return Ye(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function Dr() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let i = e.get(t);
    return i ? i.push(n) : i = [n], e.set(t, i), this;
  }, off(t, n) {
    let i = e.get(t);
    return i && i.splice(i.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let i = e.get(t);
    i && i.forEach((o) => {
      o(n);
    });
  }, clear() {
    e.clear();
  } };
}
function rt(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let i = e[n];
      if (!i) continue;
      let o = typeof i;
      if (o === "string" || o === "number") t.push(i);
      else if (o === "object") {
        let r = Array.isArray(i) ? [rt(...i)] : Object.entries(i).map(([s, l]) => l ? s : void 0);
        t = r.length ? t.concat(r.filter((s) => !!s)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function wd(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function Od(e, t) {
  if (e && t) {
    let n = (i) => {
      wd(e, i) || (e.classList ? e.classList.add(i) : e.className += " " + i);
    };
    [t].flat().filter(Boolean).forEach((i) => i.split(" ").forEach(n));
  }
}
function jo(e, t) {
  if (e && t) {
    let n = (i) => {
      e.classList ? e.classList.remove(i) : e.className = e.className.replace(new RegExp("(^|\\b)" + i.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((i) => i.split(" ").forEach(n));
  }
}
function rr(e) {
  for (let t of document?.styleSheets) try {
    for (let n of t?.cssRules) for (let i of n?.style) if (e.test(i)) return { name: i, value: n.style.getPropertyValue(i).trim() };
  } catch {
  }
  return null;
}
function ta(e) {
  let t = { width: 0, height: 0 };
  if (e) {
    let [n, i] = [e.style.visibility, e.style.display], o = e.getBoundingClientRect();
    e.style.visibility = "hidden", e.style.display = "block", t.width = o.width || e.offsetWidth, t.height = o.height || e.offsetHeight, e.style.display = i, e.style.visibility = n;
  }
  return t;
}
function na() {
  let e = window, t = document, n = t.documentElement, i = t.getElementsByTagName("body")[0], o = e.innerWidth || n.clientWidth || i.clientWidth, r = e.innerHeight || n.clientHeight || i.clientHeight;
  return { width: o, height: r };
}
function sr(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function xd() {
  let e = document.documentElement;
  return (window.pageXOffset || sr(e)) - (e.clientLeft || 0);
}
function Id() {
  let e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function $d(e) {
  return e ? getComputedStyle(e).direction === "rtl" : !1;
}
function _d(e, t, n = !0) {
  var i, o, r, s;
  if (e) {
    let l = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : ta(e), a = l.height, d = l.width, u = t.offsetHeight, c = t.offsetWidth, f = t.getBoundingClientRect(), h = Id(), b = xd(), y = na(), w, v, S = "top";
    f.top + u + a > y.height ? (w = f.top + h - a, S = "bottom", w < 0 && (w = h)) : w = u + f.top + h, f.left + d > y.width ? v = Math.max(0, f.left + b + c - d) : v = f.left + b, $d(e) ? e.style.insetInlineEnd = v + "px" : e.style.insetInlineStart = v + "px", e.style.top = w + "px", e.style.transformOrigin = S, n && (e.style.marginTop = S === "bottom" ? `calc(${(o = (i = rr(/-anchor-gutter$/)) == null ? void 0 : i.value) != null ? o : "2px"} * -1)` : (s = (r = rr(/-anchor-gutter$/)) == null ? void 0 : r.value) != null ? s : "");
  }
}
function Cd(e, t) {
  e && (typeof t == "string" ? e.style.cssText = t : Object.entries(t || {}).forEach(([n, i]) => e.style[n] = i));
}
function ia(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function kd(e, t, n = !0, i = void 0) {
  var o;
  if (e) {
    let r = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : ta(e), s = t.offsetHeight, l = t.getBoundingClientRect(), a = na(), d, u, c = i ?? "top";
    if (!i && l.top + s + r.height > a.height ? (d = -1 * r.height, c = "bottom", l.top + d < 0 && (d = -1 * l.top)) : d = s, r.width > a.width ? u = l.left * -1 : l.left + r.width > a.width ? u = (l.left + r.width - a.width) * -1 : u = 0, e.style.top = d + "px", e.style.insetInlineStart = u + "px", e.style.transformOrigin = c, n) {
      let f = (o = rr(/-anchor-gutter$/)) == null ? void 0 : o.value;
      e.style.marginTop = c === "bottom" ? `calc(${f ?? "2px"} * -1)` : f ?? "";
    }
  }
}
function oa(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Td(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && oa(e));
}
function $n(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function io(e, t = {}) {
  if ($n(e)) {
    let n = (i, o) => {
      var r, s;
      let l = (r = e?.$attrs) != null && r[i] ? [(s = e?.$attrs) == null ? void 0 : s[i]] : [];
      return [o].flat().reduce((a, d) => {
        if (d != null) {
          let u = typeof d;
          if (u === "string" || u === "number") a.push(d);
          else if (u === "object") {
            let c = Array.isArray(d) ? n(i, d) : Object.entries(d).map(([f, h]) => i === "style" && (h || h === 0) ? `${f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${h}` : h ? f : void 0);
            a = c.length ? a.concat(c.filter((f) => !!f)) : a;
          }
        }
        return a;
      }, l);
    };
    Object.entries(t).forEach(([i, o]) => {
      if (o != null) {
        let r = i.match(/^on(.+)/);
        r ? e.addEventListener(r[1].toLowerCase(), o) : i === "p-bind" || i === "pBind" ? io(e, o) : (o = i === "class" ? [...new Set(n("class", o))].join(" ").trim() : i === "style" ? n("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[i] = o), e.setAttribute(i, o));
      }
    });
  }
}
function Pd(e, t = {}, ...n) {
  {
    let i = document.createElement(e);
    return io(i, t), i.append(...n), i;
  }
}
function Ld(e, t) {
  return $n(e) ? Array.from(e.querySelectorAll(t)) : [];
}
function Ai(e, t) {
  return $n(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function it(e, t) {
  e && document.activeElement !== e && e.focus(t);
}
function Ed(e, t) {
  if ($n(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function jr(e, t = "") {
  let n = Ld(e, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`), i = [];
  for (let o of n) getComputedStyle(o).display != "none" && getComputedStyle(o).visibility != "hidden" && i.push(o);
  return i;
}
function lr(e, t) {
  let n = jr(e, t);
  return n.length > 0 ? n[0] : null;
}
function pn(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Ad(e, t) {
  let n = jr(e, t);
  return n.length > 0 ? n[n.length - 1] : null;
}
function Md(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || sr(document.documentElement) || sr(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Fd(e, t) {
  return e ? e.offsetHeight : 0;
}
function ra(e, t = []) {
  let n = oa(e);
  return n === null ? t : ra(n, t.concat([n]));
}
function Vd(e) {
  let t = [];
  if (e) {
    let n = ra(e), i = /(auto|scroll)/, o = (r) => {
      try {
        let s = window.getComputedStyle(r, null);
        return i.test(s.getPropertyValue("overflow")) || i.test(s.getPropertyValue("overflowX")) || i.test(s.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let r of n) {
      let s = r.nodeType === 1 && r.dataset.scrollselectors;
      if (s) {
        let l = s.split(",");
        for (let a of l) {
          let d = Ai(r, a);
          d && o(d) && t.push(d);
        }
      }
      r.nodeType !== 9 && o(r) && t.push(r);
    }
  }
  return t;
}
function hn(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function Nd() {
  return /(android)/i.test(navigator.userAgent);
}
function sa() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function oo(e) {
  return !!(e && e.offsetParent != null);
}
function Dd() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function jd(e, t = "", n) {
  $n(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Bi = {};
function Rd(e = "pui_id_") {
  return Object.hasOwn(Bi, e) || (Bi[e] = 0), Bi[e]++, `${e}${Bi[e]}`;
}
function zd() {
  let e = [], t = (s, l, a = 999) => {
    let d = o(s, l, a), u = d.value + (d.key === s ? 0 : a) + 1;
    return e.push({ key: s, value: u }), u;
  }, n = (s) => {
    e = e.filter((l) => l.value !== s);
  }, i = (s, l) => o(s).value, o = (s, l, a = 0) => [...e].reverse().find((d) => !0) || { key: s, value: a }, r = (s) => s && parseInt(s.style.zIndex, 10) || 0;
  return { get: r, set: (s, l, a) => {
    l && (l.style.zIndex = String(t(s, !0, a)));
  }, clear: (s) => {
    s && (n(r(s)), s.style.zIndex = "");
  }, getCurrent: (s) => i(s) };
}
var Ro = zd(), Bd = Object.defineProperty, Kd = Object.defineProperties, Hd = Object.getOwnPropertyDescriptors, ro = Object.getOwnPropertySymbols, la = Object.prototype.hasOwnProperty, aa = Object.prototype.propertyIsEnumerable, $s = (e, t, n) => t in e ? Bd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, pt = (e, t) => {
  for (var n in t || (t = {})) la.call(t, n) && $s(e, n, t[n]);
  if (ro) for (var n of ro(t)) aa.call(t, n) && $s(e, n, t[n]);
  return e;
}, zo = (e, t) => Kd(e, Hd(t)), Pt = (e, t) => {
  var n = {};
  for (var i in e) la.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && ro) for (var i of ro(e)) t.indexOf(i) < 0 && aa.call(e, i) && (n[i] = e[i]);
  return n;
}, Ud = Dr(), Fe = Ud, li = /{([^}]*)}/g, ua = /(\d+\s+[\+\-\*\/]\s+\d+)/g, da = /var\([^)]+\)/g;
function _s(e) {
  return Ye(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Wd(e) {
  return Ct(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function Gd(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function ar(e = "", t = "") {
  return Gd(`${Ye(e, !1) && Ye(t, !1) ? `${e}-` : e}${t}`);
}
function ca(e = "", t = "") {
  return `--${ar(e, t)}`;
}
function qd(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function fa(e, t = "", n = "", i = [], o) {
  if (Ye(e)) {
    let r = e.trim();
    if (qd(r)) return;
    if (yn(r, li)) {
      let s = r.replaceAll(li, (l) => {
        let a = l.replace(/{|}/g, "").split(".").filter((d) => !i.some((u) => yn(d, u)));
        return `var(${ca(n, ea(a.join("-")))}${ae(o) ? `, ${o}` : ""})`;
      });
      return yn(s.replace(da, "0"), ua) ? `calc(${s})` : s;
    }
    return r;
  } else if (vd(e)) return e;
}
function Jd(e, t, n) {
  Ye(t, !1) && e.push(`${t}:${n};`);
}
function Ln(e, t) {
  return e ? `${e}{${t}}` : "";
}
function pa(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(s, l) {
    let a = [], d = 0, u = "", c = null, f = 0;
    for (; d <= s.length; ) {
      let h = s[d];
      if ((h === '"' || h === "'" || h === "`") && s[d - 1] !== "\\" && (c = c === h ? null : h), !c && (h === "(" && f++, h === ")" && f--, (h === "," || d === s.length) && f === 0)) {
        let b = u.trim();
        b.startsWith("dt(") ? a.push(pa(b, l)) : a.push(i(b)), u = "", d++;
        continue;
      }
      h !== void 0 && (u += h), d++;
    }
    return a;
  }
  function i(s) {
    let l = s[0];
    if ((l === '"' || l === "'" || l === "`") && s[s.length - 1] === l) return s.slice(1, -1);
    let a = Number(s);
    return isNaN(a) ? s : a;
  }
  let o = [], r = [];
  for (let s = 0; s < e.length; s++) if (e[s] === "d" && e.slice(s, s + 3) === "dt(") r.push(s), s += 2;
  else if (e[s] === ")" && r.length > 0) {
    let l = r.pop();
    r.length === 0 && o.push([l, s]);
  }
  if (!o.length) return e;
  for (let s = o.length - 1; s >= 0; s--) {
    let [l, a] = o[s], d = e.slice(l + 3, a), u = n(d, t), c = t(...u);
    e = e.slice(0, l) + c + e.slice(a + 1);
  }
  return e;
}
var Sn = (...e) => Yd(we.getTheme(), ...e), Yd = (e = {}, t, n, i) => {
  if (t) {
    let { variable: o, options: r } = we.defaults || {}, { prefix: s, transform: l } = e?.options || r || {}, a = yn(t, li) ? t : `{${t}}`;
    return i === "value" || In(i) && l === "strict" ? we.getTokenValue(t) : fa(a, void 0, s, [o.excludedKeyRegex], n);
  }
  return "";
};
function Ki(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((i, o, r) => {
      var s;
      return i + o + ((s = Xe(t[r], { dt: Sn })) != null ? s : "");
    }, "");
    return pa(n, Sn);
  }
  return Xe(e, { dt: Sn });
}
function Zd(e, t = {}) {
  let n = we.defaults.variable, { prefix: i = n.prefix, selector: o = n.selector, excludedKeyRegex: r = n.excludedKeyRegex } = t, s = [], l = [], a = [{ node: e, path: i }];
  for (; a.length; ) {
    let { node: u, path: c } = a.pop();
    for (let f in u) {
      let h = u[f], b = Wd(h), y = yn(f, r) ? ar(c) : ar(c, ea(f));
      if (Ct(b)) a.push({ node: b, path: y });
      else {
        let w = ca(y), v = fa(b, y, i, [r]);
        Jd(l, w, v);
        let S = y;
        i && S.startsWith(i + "-") && (S = S.slice(i.length + 1)), s.push(S.replace(/-/g, "."));
      }
    }
  }
  let d = l.join("");
  return { value: l, tokens: s, declarations: d, css: Ln(o, d) };
}
var ct = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
  return { type: "class", selector: e, matched: this.pattern.test(e.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(e) {
  return { type: "attr", selector: `:root${e},:host${e}`, matched: this.pattern.test(e.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(e) {
  return { type: "media", selector: e, matched: this.pattern.test(e.trim()) };
} }, system: { pattern: /^system$/, resolve(e) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(e.trim()) };
} }, custom: { resolve(e) {
  return { type: "custom", selector: e, matched: !0 };
} } }, resolve(e) {
  let t = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
  return [e].flat().map((n) => {
    var i;
    return (i = t.map((o) => o.resolve(n)).find((o) => o.matched)) != null ? i : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return Zd(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: i, defaults: o }) {
  var r, s, l, a, d, u, c;
  let { preset: f, options: h } = t, b, y, w, v, S, $, g;
  if (ae(f) && h.transform !== "strict") {
    let { primitive: x, semantic: D, extend: L } = f, j = D || {}, { colorScheme: N } = j, G = Pt(j, ["colorScheme"]), U = L || {}, { colorScheme: E } = U, te = Pt(U, ["colorScheme"]), X = N || {}, { dark: ce } = X, se = Pt(X, ["dark"]), ne = E || {}, { dark: le } = ne, Te = Pt(ne, ["dark"]), z = ae(x) ? this._toVariables({ primitive: x }, h) : {}, H = ae(G) ? this._toVariables({ semantic: G }, h) : {}, Z = ae(se) ? this._toVariables({ light: se }, h) : {}, De = ae(ce) ? this._toVariables({ dark: ce }, h) : {}, Kt = ae(te) ? this._toVariables({ semantic: te }, h) : {}, Ri = ae(Te) ? this._toVariables({ light: Te }, h) : {}, Ht = ae(le) ? this._toVariables({ dark: le }, h) : {}, [Tn, Kn] = [(r = z.declarations) != null ? r : "", z.tokens], [zi, sn] = [(s = H.declarations) != null ? s : "", H.tokens || []], [vs, p] = [(l = Z.declarations) != null ? l : "", Z.tokens || []], [m, O] = [(a = De.declarations) != null ? a : "", De.tokens || []], [T, _] = [(d = Kt.declarations) != null ? d : "", Kt.tokens || []], [k, F] = [(u = Ri.declarations) != null ? u : "", Ri.tokens || []], [M, A] = [(c = Ht.declarations) != null ? c : "", Ht.tokens || []];
    b = this.transformCSS(e, Tn, "light", "variable", h, i, o), y = Kn;
    let C = this.transformCSS(e, `${zi}${vs}`, "light", "variable", h, i, o), J = this.transformCSS(e, `${m}`, "dark", "variable", h, i, o);
    w = `${C}${J}`, v = [.../* @__PURE__ */ new Set([...sn, ...p, ...O])];
    let R = this.transformCSS(e, `${T}${k}color-scheme:light`, "light", "variable", h, i, o), W = this.transformCSS(e, `${M}color-scheme:dark`, "dark", "variable", h, i, o);
    S = `${R}${W}`, $ = [.../* @__PURE__ */ new Set([..._, ...F, ...A])], g = Xe(f.css, { dt: Sn });
  }
  return { primitive: { css: b, tokens: y }, semantic: { css: w, tokens: v }, global: { css: S, tokens: $ }, style: g };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: i, set: o, defaults: r, selector: s }) {
  var l, a, d;
  let u, c, f;
  if (ae(t) && n.transform !== "strict") {
    let h = e.replace("-directive", ""), b = t, { colorScheme: y, extend: w, css: v } = b, S = Pt(b, ["colorScheme", "extend", "css"]), $ = w || {}, { colorScheme: g } = $, x = Pt($, ["colorScheme"]), D = y || {}, { dark: L } = D, j = Pt(D, ["dark"]), N = g || {}, { dark: G } = N, U = Pt(N, ["dark"]), E = ae(S) ? this._toVariables({ [h]: pt(pt({}, S), x) }, n) : {}, te = ae(j) ? this._toVariables({ [h]: pt(pt({}, j), U) }, n) : {}, X = ae(L) ? this._toVariables({ [h]: pt(pt({}, L), G) }, n) : {}, [ce, se] = [(l = E.declarations) != null ? l : "", E.tokens || []], [ne, le] = [(a = te.declarations) != null ? a : "", te.tokens || []], [Te, z] = [(d = X.declarations) != null ? d : "", X.tokens || []], H = this.transformCSS(h, `${ce}${ne}`, "light", "variable", n, o, r, s), Z = this.transformCSS(h, Te, "dark", "variable", n, o, r, s);
    u = `${H}${Z}`, c = [.../* @__PURE__ */ new Set([...se, ...le, ...z])], f = Xe(v, { dt: Sn });
  }
  return { css: u, tokens: c, style: f };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: i, defaults: o }) {
  var r;
  let { preset: s, options: l } = t, a = (r = s?.components) == null ? void 0 : r[e];
  return this.getPreset({ name: e, preset: a, options: l, params: n, set: i, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: i, defaults: o }) {
  var r, s;
  let l = e.replace("-directive", ""), { preset: a, options: d } = t, u = ((r = a?.components) == null ? void 0 : r[l]) || ((s = a?.directives) == null ? void 0 : s[l]);
  return this.getPreset({ name: l, preset: u, options: d, params: n, set: i, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, i) {
  let { cssLayer: o } = t;
  return o ? `@layer ${Xe(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: i = {}, set: o, defaults: r }) {
  let s = this.getCommon({ name: e, theme: t, params: n, set: o, defaults: r }), l = Object.entries(i).reduce((a, [d, u]) => a.push(`${d}="${u}"`) && a, []).join(" ");
  return Object.entries(s || {}).reduce((a, [d, u]) => {
    if (Ct(u) && Object.hasOwn(u, "css")) {
      let c = ti(u.css), f = `${d}-variables`;
      a.push(`<style type="text/css" data-primevue-style-id="${f}" ${l}>${c}</style>`);
    }
    return a;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: i = {}, set: o, defaults: r }) {
  var s;
  let l = { name: e, theme: t, params: n, set: o, defaults: r }, a = (s = e.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : s.css, d = Object.entries(i).reduce((u, [c, f]) => u.push(`${c}="${f}"`) && u, []).join(" ");
  return a ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${d}>${ti(a)}</style>` : "";
}, createTokens(e = {}, t, n = "", i = "", o = {}) {
  let r = function(l, a = {}, d = []) {
    if (d.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: a, value: void 0 };
    d.push(this.path), a.name = this.path, a.binding || (a.binding = {});
    let u = this.value;
    if (typeof this.value == "string" && li.test(this.value)) {
      let c = this.value.trim().replace(li, (f) => {
        var h;
        let b = f.slice(1, -1), y = this.tokens[b];
        if (!y) return console.warn(`Token not found for path: ${b}`), "__UNRESOLVED__";
        let w = y.computed(l, a, d);
        return Array.isArray(w) && w.length === 2 ? `light-dark(${w[0].value},${w[1].value})` : (h = w?.value) != null ? h : "__UNRESOLVED__";
      });
      u = ua.test(c.replace(da, "0")) ? `calc(${c})` : c;
    }
    return In(a.binding) && delete a.binding, d.pop(), { colorScheme: l, path: this.path, paths: a, value: u.includes("__UNRESOLVED__") ? void 0 : u };
  }, s = (l, a, d) => {
    Object.entries(l).forEach(([u, c]) => {
      let f = yn(u, t.variable.excludedKeyRegex) ? a : a ? `${a}.${_s(u)}` : _s(u), h = d ? `${d}.${u}` : u;
      Ct(c) ? s(c, f, h) : (o[f] || (o[f] = { paths: [], computed: (b, y = {}, w = []) => {
        if (o[f].paths.length === 1) return o[f].paths[0].computed(o[f].paths[0].scheme, y.binding, w);
        if (b && b !== "none") for (let v = 0; v < o[f].paths.length; v++) {
          let S = o[f].paths[v];
          if (S.scheme === b) return S.computed(b, y.binding, w);
        }
        return o[f].paths.map((v) => v.computed(v.scheme, y[v.scheme], w));
      } }), o[f].paths.push({ path: h, value: c, scheme: h.includes("colorScheme.light") ? "light" : h.includes("colorScheme.dark") ? "dark" : "none", computed: r, tokens: o }));
    });
  };
  return s(e, n, i), o;
}, getTokenValue(e, t, n) {
  var i;
  let o = ((l) => l.split(".").filter((a) => !yn(a.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), r = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, s = [(i = e[o]) == null ? void 0 : i.computed(r)].flat().filter((l) => l);
  return s.length === 1 ? s[0].value : s.reduce((l = {}, a) => {
    let d = a, { colorScheme: u } = d, c = Pt(d, ["colorScheme"]);
    return l[u] = c, l;
  }, void 0);
}, getSelectorRule(e, t, n, i) {
  return n === "class" || n === "attr" ? Ln(ae(t) ? `${e}${t},${e} ${t}` : e, i) : Ln(e, Ln(t ?? ":root,:host", i));
}, transformCSS(e, t, n, i, o = {}, r, s, l) {
  if (ae(t)) {
    let { cssLayer: a } = o;
    if (i !== "style") {
      let d = this.getColorSchemeOption(o, s);
      t = n === "dark" ? d.reduce((u, { type: c, selector: f }) => (ae(f) && (u += f.includes("[CSS]") ? f.replace("[CSS]", t) : this.getSelectorRule(f, l, c, t)), u), "") : Ln(l ?? ":root,:host", t);
    }
    if (a) {
      let d = { name: "primeui" };
      Ct(a) && (d.name = Xe(a.name, { name: e, type: i })), ae(d.name) && (t = Ln(`@layer ${d.name}`, t), r?.layerNames(d.name));
    }
    return t;
  }
  return "";
} }, we = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = zo(pt({}, t), { options: pt(pt({}, this.defaults.options), t.options) }), this._tokens = ct.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
}, get theme() {
  return this._theme;
}, get preset() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.preset) || {};
}, get options() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.options) || {};
}, get tokens() {
  return this._tokens;
}, getTheme() {
  return this.theme;
}, setTheme(e) {
  this.update({ theme: e }), Fe.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = zo(pt({}, this.theme), { preset: e }), this._tokens = ct.createTokens(e, this.defaults), this.clearLoadedStyleNames(), Fe.emit("preset:change", e), Fe.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = zo(pt({}, this.theme), { options: e }), this.clearLoadedStyleNames(), Fe.emit("options:change", e), Fe.emit("theme:change", this.theme);
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(e) {
  this._layerNames.add(e);
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(e) {
  return this._loadedStyleNames.has(e);
}, setLoadedStyleName(e) {
  this._loadedStyleNames.add(e);
}, deleteLoadedStyleName(e) {
  this._loadedStyleNames.delete(e);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(e) {
  return ct.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return ct.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return ct.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return ct.getPresetD(n);
}, getCustomPreset(e = "", t, n, i) {
  let o = { name: e, preset: t, options: this.options, selector: n, params: i, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return ct.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return ct.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", i) {
  return ct.transformCSS(e, t, i, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return ct.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return ct.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), Fe.emit(`theme:${t}:load`, e), !this._loadingStyles.size && Fe.emit("theme:load"));
} }, je = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
};
function Cs(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (!n) {
    if (Array.isArray(e) || (n = Qd(e)) || t) {
      n && (e = n);
      var i = 0, o = function() {
      };
      return { s: o, n: function() {
        return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] };
      }, e: function(d) {
        throw d;
      }, f: o };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var r, s = !0, l = !1;
  return { s: function() {
    n = n.call(e);
  }, n: function() {
    var d = n.next();
    return s = d.done, d;
  }, e: function(d) {
    l = !0, r = d;
  }, f: function() {
    try {
      s || n.return == null || n.return();
    } finally {
      if (l) throw r;
    }
  } };
}
function Qd(e, t) {
  if (e) {
    if (typeof e == "string") return ks(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ks(e, t) : void 0;
  }
}
function ks(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
var ur = {
  filter: function(t, n, i, o, r) {
    var s = [];
    if (!t)
      return s;
    var l = Cs(t), a;
    try {
      for (l.s(); !(a = l.n()).done; ) {
        var d = a.value;
        if (typeof d == "string") {
          if (this.filters[o](d, i, r)) {
            s.push(d);
            continue;
          }
        } else {
          var u = Cs(n), c;
          try {
            for (u.s(); !(c = u.n()).done; ) {
              var f = c.value, h = We(d, f);
              if (this.filters[o](h, i, r)) {
                s.push(d);
                break;
              }
            }
          } catch (b) {
            u.e(b);
          } finally {
            u.f();
          }
        }
      }
    } catch (b) {
      l.e(b);
    } finally {
      l.f();
    }
    return s;
  },
  filters: {
    startsWith: function(t, n, i) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = tt(n.toString()).toLocaleLowerCase(i), r = tt(t.toString()).toLocaleLowerCase(i);
      return r.slice(0, o.length) === o;
    },
    contains: function(t, n, i) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = tt(n.toString()).toLocaleLowerCase(i), r = tt(t.toString()).toLocaleLowerCase(i);
      return r.indexOf(o) !== -1;
    },
    notContains: function(t, n, i) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = tt(n.toString()).toLocaleLowerCase(i), r = tt(t.toString()).toLocaleLowerCase(i);
      return r.indexOf(o) === -1;
    },
    endsWith: function(t, n, i) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = tt(n.toString()).toLocaleLowerCase(i), r = tt(t.toString()).toLocaleLowerCase(i);
      return r.indexOf(o, r.length - o.length) !== -1;
    },
    equals: function(t, n, i) {
      return n == null || n === "" ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() === n.getTime() : tt(t.toString()).toLocaleLowerCase(i) == tt(n.toString()).toLocaleLowerCase(i);
    },
    notEquals: function(t, n, i) {
      return n == null || n === "" ? !1 : t == null ? !0 : t.getTime && n.getTime ? t.getTime() !== n.getTime() : tt(t.toString()).toLocaleLowerCase(i) != tt(n.toString()).toLocaleLowerCase(i);
    },
    in: function(t, n) {
      if (n == null || n.length === 0)
        return !0;
      for (var i = 0; i < n.length; i++)
        if (no(t, n[i]))
          return !0;
      return !1;
    },
    between: function(t, n) {
      return n == null || n[0] == null || n[1] == null ? !0 : t == null ? !1 : t.getTime ? n[0].getTime() <= t.getTime() && t.getTime() <= n[1].getTime() : n[0] <= t && t <= n[1];
    },
    lt: function(t, n) {
      return n == null ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() < n.getTime() : t < n;
    },
    lte: function(t, n) {
      return n == null ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() <= n.getTime() : t <= n;
    },
    gt: function(t, n) {
      return n == null ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() > n.getTime() : t > n;
    },
    gte: function(t, n) {
      return n == null ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() >= n.getTime() : t >= n;
    },
    dateIs: function(t, n) {
      return n == null ? !0 : t == null ? !1 : (typeof t == "string" && (t = new Date(t)), typeof n == "string" && (n = new Date(n)), t.toDateString() === n.toDateString());
    },
    dateIsNot: function(t, n) {
      return n == null ? !0 : t == null ? !1 : (typeof t == "string" && (t = new Date(t)), typeof n == "string" && (n = new Date(n)), t.toDateString() !== n.toDateString());
    },
    dateBefore: function(t, n) {
      return n == null ? !0 : t == null ? !1 : (typeof t == "string" && (t = new Date(t)), typeof n == "string" && (n = new Date(n)), t.getTime() < n.getTime());
    },
    dateAfter: function(t, n) {
      return n == null ? !0 : t == null ? !1 : (typeof t == "string" && (t = new Date(t)), typeof n == "string" && (n = new Date(n)), t.getTime() > n.getTime());
    }
  },
  register: function(t, n) {
    this.filters[t] = n;
  }
}, Xd = `
    *,
    ::before,
    ::after {
        box-sizing: border-box;
    }

    .p-collapsible-enter-active {
        animation: p-animate-collapsible-expand 0.2s ease-out;
        overflow: hidden;
    }

    .p-collapsible-leave-active {
        animation: p-animate-collapsible-collapse 0.2s ease-out;
        overflow: hidden;
    }

    @keyframes p-animate-collapsible-expand {
        from {
            grid-template-rows: 0fr;
        }
        to {
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-collapsible-collapse {
        from {
            grid-template-rows: 1fr;
        }
        to {
            grid-template-rows: 0fr;
        }
    }

    .p-disabled,
    .p-disabled * {
        cursor: default;
        pointer-events: none;
        user-select: none;
    }

    .p-disabled,
    .p-component:disabled {
        opacity: dt('disabled.opacity');
    }

    .pi {
        font-size: dt('icon.size');
    }

    .p-icon {
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .p-overlay-mask {
        background: var(--px-mask-background, dt('mask.background'));
        color: dt('mask.color');
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .p-overlay-mask-enter-active {
        animation: p-animate-overlay-mask-enter dt('mask.transition.duration') forwards;
    }

    .p-overlay-mask-leave-active {
        animation: p-animate-overlay-mask-leave dt('mask.transition.duration') forwards;
    }

    @keyframes p-animate-overlay-mask-enter {
        from {
            background: transparent;
        }
        to {
            background: var(--px-mask-background, dt('mask.background'));
        }
    }
    @keyframes p-animate-overlay-mask-leave {
        from {
            background: var(--px-mask-background, dt('mask.background'));
        }
        to {
            background: transparent;
        }
    }

    .p-anchored-overlay-enter-active {
        animation: p-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .p-anchored-overlay-leave-active {
        animation: p-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes p-animate-anchored-overlay-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-anchored-overlay-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
// @__NO_SIDE_EFFECTS__
function Rr(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const xe = {}, bn = [], kt = () => {
}, ha = () => !1, wo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Oo = (e) => e.startsWith("onUpdate:"), Ee = Object.assign, zr = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, ec = Object.prototype.hasOwnProperty, ve = (e, t) => ec.call(e, t), Y = Array.isArray, Zt = (e) => Mi(e) === "[object Map]", so = (e) => Mi(e) === "[object Set]", Ts = (e) => Mi(e) === "[object Date]", ee = (e) => typeof e == "function", _e = (e) => typeof e == "string", mt = (e) => typeof e == "symbol", ye = (e) => e !== null && typeof e == "object", ga = (e) => (ye(e) || ee(e)) && ee(e.then) && ee(e.catch), ma = Object.prototype.toString, Mi = (e) => ma.call(e), tc = (e) => Mi(e).slice(8, -1), ba = (e) => Mi(e) === "[object Object]", Br = (e) => _e(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ni = /* @__PURE__ */ Rr(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), xo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, nc = /-\w/g, qe = xo(
  (e) => e.replace(nc, (t) => t.slice(1).toUpperCase())
), ic = /\B([A-Z])/g, _n = xo(
  (e) => e.replace(ic, "-$1").toLowerCase()
), Io = xo((e) => e.charAt(0).toUpperCase() + e.slice(1)), Bo = xo(
  (e) => e ? `on${Io(e)}` : ""
), _t = (e, t) => !Object.is(e, t), Ko = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, va = (e, t, n, i = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, oc = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, rc = (e) => {
  const t = _e(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Ps;
const $o = () => Ps || (Ps = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function On(e) {
  if (Y(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const i = e[n], o = _e(i) ? uc(i) : On(i);
      if (o)
        for (const r in o)
          t[r] = o[r];
    }
    return t;
  } else if (_e(e) || ye(e))
    return e;
}
const sc = /;(?![^(]*\))/g, lc = /:([^]+)/, ac = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function uc(e) {
  const t = {};
  return e.replace(ac, (n) => n.startsWith("/*") ? "" : n).split(sc).forEach((n) => {
    if (n) {
      const i = n.split(lc);
      i.length > 1 && (t[i[0].trim()] = i[1].trim());
    }
  }), t;
}
function st(e) {
  let t = "";
  if (_e(e))
    t = e;
  else if (Y(e))
    for (let n = 0; n < e.length; n++) {
      const i = st(e[n]);
      i && (t += i + " ");
    }
  else if (ye(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function ya(e) {
  if (!e) return null;
  let { class: t, style: n } = e;
  return t && !_e(t) && (e.class = st(t)), n && (e.style = On(n)), e;
}
const dc = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", cc = /* @__PURE__ */ Rr(dc);
function Sa(e) {
  return !!e || e === "";
}
function fc(e, t, n) {
  if (e.length !== t.length) return !1;
  let i = !0;
  for (let o = 0; i && o < e.length; o++)
    i = _o(e[o], t[o], n);
  return i;
}
function Ls(e, t, n) {
  if (e.size !== t.size) return !1;
  const i = Array.from(t), o = new Uint8Array(i.length);
  for (const r of e) {
    let s = -1;
    for (let l = 0; l < i.length; l++)
      if (!o[l] && _o(r, i[l], n)) {
        s = l;
        break;
      }
    if (s < 0) return !1;
    o[s] = 1;
  }
  return !0;
}
function pc(e, t, n) {
  let i = Zt(e), o = Zt(t);
  if (i || o || (i = so(e), o = so(t), i || o))
    return i && o ? Ls(e, t, n) : !1;
  const r = Object.keys(e).length, s = Object.keys(t).length;
  if (r !== s)
    return !1;
  for (const l in e) {
    const a = e.hasOwnProperty(l), d = t.hasOwnProperty(l);
    if (a && !d || !a && d || !_o(e[l], t[l], n))
      return !1;
  }
  return String(e) === String(t);
}
function Es(e, t, n, i) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [o, r] = n;
  if (o.has(e) || r.has(t))
    return o.get(e) === t && r.get(t) === e;
  o.set(e, t), r.set(t, e);
  const s = i(e, t, n);
  return o.delete(e), r.delete(t), s;
}
function _o(e, t, n) {
  if (e === t) return !0;
  let i = Ts(e), o = Ts(t);
  return i || o ? i && o ? e.getTime() === t.getTime() : !1 : (i = mt(e), o = mt(t), i || o ? e === t : (i = Y(e), o = Y(t), i || o ? i && o ? Es(e, t, n, fc) : !1 : (i = ye(e), o = ye(t), i || o ? !i || !o ? !1 : Es(e, t, n, pc) : String(e) === String(t))));
}
const wa = (e) => !!(e && e.__v_isRef === !0), oe = (e) => _e(e) ? e : e == null ? "" : Y(e) || ye(e) && (e.toString === ma || !ee(e.toString)) ? wa(e) ? oe(e.value) : JSON.stringify(e, Oa, 2) : String(e), Oa = (e, t) => wa(t) ? Oa(e, t.value) : Zt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [i, o], r) => (n[Ho(i, r) + " =>"] = o, n),
    {}
  )
} : so(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Ho(n))
} : mt(t) ? Ho(t) : ye(t) && !Y(t) && !ba(t) ? String(t) : t, Ho = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    mt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let Me;
class hc {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && Me && (Me.active ? (this.parent = Me, this.index = (Me.scopes || (Me.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes) {
        const i = this.scopes.slice();
        for (t = 0, n = i.length; t < n; t++)
          i[t].pause();
      }
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes) {
        const o = this.scopes.slice();
        for (t = 0, n = o.length; t < n; t++)
          o[t].resume();
      }
      const i = this.effects.slice();
      for (t = 0, n = i.length; t < n; t++)
        i[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Me;
      try {
        return Me = this, t();
      } finally {
        Me = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Me, Me = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (Me === this)
        Me = this.prevScope;
      else {
        let t = Me;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, i;
      for (n = 0, i = this.effects.length; n < i; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, i = this.cleanups.length; n < i; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const o = this.scopes.slice();
        for (n = 0, i = o.length; n < i; n++)
          o[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const o = this.parent.scopes.pop();
        o && o !== this && (this.parent.scopes[this.index] = o, o.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function gc() {
  return Me;
}
let Ie;
const Uo = /* @__PURE__ */ new WeakSet();
class xa {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Me && (Me.active ? Me.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Uo.has(this) && (Uo.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || $a(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, As(this), _a(this);
    const t = Ie, n = gt;
    Ie = this, gt = !0;
    try {
      return this.fn();
    } finally {
      Ca(this), Ie = t, gt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Ur(t);
      this.deps = this.depsTail = void 0, As(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Uo.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    dr(this) && this.run();
  }
  get dirty() {
    return dr(this);
  }
}
let Ia = 0, ii, oi;
function $a(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = oi, oi = e;
    return;
  }
  e.next = ii, ii = e;
}
function Kr() {
  Ia++;
}
function Hr() {
  if (--Ia > 0)
    return;
  if (oi) {
    let t = oi;
    for (oi = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; ii; ) {
    let t = ii;
    for (ii = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (i) {
          e || (e = i);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function _a(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ca(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const o = i.prevDep;
    i.version === -1 ? (i === n && (n = o), Ur(i), mc(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = o;
  }
  e.deps = t, e.depsTail = n;
}
function dr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ka(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ka(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ai) || (e.globalVersion = ai, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !dr(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = Ie, i = gt;
  Ie = e, gt = !0;
  try {
    _a(e);
    const o = e.fn(e._value);
    (t.version === 0 || _t(o, e._value)) && (e.flags |= 128, e._value = o, t.version++);
  } catch (o) {
    throw t.version++, o;
  } finally {
    Ie = n, gt = i, Ca(e), e.flags &= -3;
  }
}
function Ur(e, t = !1) {
  const { dep: n, prevSub: i, nextSub: o } = e;
  if (i && (i.nextSub = o, e.prevSub = void 0), o && (o.prevSub = i, e.nextSub = void 0), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Ur(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function mc(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let gt = !0;
const Ta = [];
function Rt() {
  Ta.push(gt), gt = !1;
}
function zt() {
  const e = Ta.pop();
  gt = e === void 0 ? !0 : e;
}
function As(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = Ie;
    Ie = void 0;
    try {
      t();
    } finally {
      Ie = n;
    }
  }
}
let ai = 0;
class bc {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Wr {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!Ie || !gt || Ie === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Ie)
      n = this.activeLink = new bc(Ie, this), Ie.deps ? (n.prevDep = Ie.depsTail, Ie.depsTail.nextDep = n, Ie.depsTail = n) : Ie.deps = Ie.depsTail = n, Pa(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = Ie.depsTail, n.nextDep = void 0, Ie.depsTail.nextDep = n, Ie.depsTail = n, Ie.deps === n && (Ie.deps = i);
    }
    return n;
  }
  trigger(t) {
    this.version++, ai++, this.notify(t);
  }
  notify(t) {
    Kr();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Hr();
    }
  }
}
function Pa(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        Pa(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const cr = /* @__PURE__ */ new WeakMap(), wn = /* @__PURE__ */ Symbol(
  ""
), fr = /* @__PURE__ */ Symbol(
  ""
), ui = /* @__PURE__ */ Symbol(
  ""
);
function Re(e, t, n) {
  if (gt && Ie) {
    let i = cr.get(e);
    i || cr.set(e, i = /* @__PURE__ */ new Map());
    let o = i.get(n);
    o || (i.set(n, o = new Wr()), o.map = i, o.key = n), o.track();
  }
}
function Ft(e, t, n, i, o, r) {
  const s = cr.get(e);
  if (!s) {
    ai++;
    return;
  }
  const l = (a) => {
    a && a.trigger();
  };
  if (Kr(), t === "clear")
    s.forEach(l);
  else {
    const a = Y(e), d = a && Br(n);
    if (a && n === "length") {
      const u = Number(i);
      s.forEach((c, f) => {
        (f === "length" || f === ui || !mt(f) && f >= u) && l(c);
      });
    } else
      switch ((n !== void 0 || s.has(void 0)) && l(s.get(n)), d && l(s.get(ui)), t) {
        case "add":
          a ? d && l(s.get("length")) : (l(s.get(wn)), Zt(e) && l(s.get(fr)));
          break;
        case "delete":
          a || (l(s.get(wn)), Zt(e) && l(s.get(fr)));
          break;
        case "set":
          Zt(e) && l(s.get(wn));
          break;
      }
  }
  Hr();
}
function Pn(e) {
  const t = /* @__PURE__ */ me(e);
  return t === e || (Re(t, "iterate", ui), /* @__PURE__ */ at(e)) ? t : /* @__PURE__ */ Tt(e) ? /* @__PURE__ */ Qt(e) ? t.map((n) => tn(ut(n))) : t.map(tn) : t.map(ut);
}
function Co(e) {
  return Re(e = /* @__PURE__ */ me(e), "iterate", ui), e;
}
function xt(e, t) {
  return /* @__PURE__ */ Tt(e) ? tn(/* @__PURE__ */ Qt(e) ? ut(t) : t) : ut(t);
}
const vc = {
  __proto__: null,
  [Symbol.iterator]() {
    return Wo(this, Symbol.iterator, (e) => xt(this, e));
  },
  concat(...e) {
    return Pn(this).concat(
      ...e.map((t) => Y(t) ? Pn(t) : t)
    );
  },
  entries() {
    return Wo(this, "entries", (e) => (e[1] = xt(this, e[1]), e));
  },
  every(e, t) {
    return Lt(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Lt(
      this,
      "filter",
      e,
      t,
      (n) => n.map((i) => xt(this, i)),
      arguments
    );
  },
  find(e, t) {
    return Lt(
      this,
      "find",
      e,
      t,
      (n) => xt(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Lt(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Lt(
      this,
      "findLast",
      e,
      t,
      (n) => xt(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Lt(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Lt(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Go(this, "includes", e);
  },
  indexOf(...e) {
    return Go(this, "indexOf", e);
  },
  join(e) {
    return Pn(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Go(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Lt(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Un(this, "pop");
  },
  push(...e) {
    return Un(this, "push", e);
  },
  reduce(e, ...t) {
    return Ms(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ms(this, "reduceRight", e, t);
  },
  shift() {
    return Un(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Lt(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Un(this, "splice", e);
  },
  toReversed() {
    return Pn(this).toReversed();
  },
  toSorted(e) {
    return Pn(this).toSorted(e);
  },
  toSpliced(...e) {
    return Pn(this).toSpliced(...e);
  },
  unshift(...e) {
    return Un(this, "unshift", e);
  },
  values() {
    return Wo(this, "values", (e) => xt(this, e));
  }
};
function Wo(e, t, n) {
  const i = Co(e), o = i[t]();
  return i !== e && !/* @__PURE__ */ at(e) && (o._next = o.next, o.next = () => {
    const r = o._next();
    return r.done || (r.value = n(r.value)), r;
  }), o;
}
const yc = Array.prototype;
function Lt(e, t, n, i, o, r) {
  const s = Co(e), l = s !== e && !/* @__PURE__ */ at(e), a = s[t];
  if (a !== yc[t]) {
    const c = a.apply(e, r);
    return l ? ut(c) : c;
  }
  let d = n;
  s !== e && (l ? d = function(c, f) {
    return n.call(this, xt(e, c), f, e);
  } : n.length > 2 && (d = function(c, f) {
    return n.call(this, c, f, e);
  }));
  const u = a.call(s, d, i);
  return l && o ? o(u) : u;
}
function Ms(e, t, n, i) {
  const o = Co(e), r = o !== e && !/* @__PURE__ */ at(e);
  let s = n, l = !1;
  o !== e && (r ? (l = i.length === 0, s = function(d, u, c) {
    return l && (l = !1, d = xt(e, d)), n.call(this, d, xt(e, u), c, e);
  }) : n.length > 3 && (s = function(d, u, c) {
    return n.call(this, d, u, c, e);
  }));
  const a = o[t](s, ...i);
  return l ? xt(e, a) : a;
}
function Go(e, t, n) {
  const i = /* @__PURE__ */ me(e);
  Re(i, "iterate", ui);
  const o = i[t](...n);
  return (o === -1 || o === !1) && /* @__PURE__ */ Jr(n[0]) ? (n[0] = /* @__PURE__ */ me(n[0]), i[t](...n)) : o;
}
function Un(e, t, n = []) {
  Rt(), Kr();
  const i = (/* @__PURE__ */ me(e))[t].apply(e, n);
  return Hr(), zt(), i;
}
const Sc = /* @__PURE__ */ Rr("__proto__,__v_isRef,__isVue"), La = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(mt)
);
function wc(e) {
  mt(e) || (e = String(e));
  const t = /* @__PURE__ */ me(this);
  return Re(t, "has", e), t.hasOwnProperty(e);
}
class Ea {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, i) {
    if (n === "__v_skip") return t.__v_skip;
    const o = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !o;
    if (n === "__v_isReadonly")
      return o;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return i === (o ? r ? Lc : Va : r ? Fa : Ma).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(i) ? t : void 0;
    const s = Y(t);
    if (!o) {
      let a;
      if (s && (a = vc[n]))
        return a;
      if (n === "hasOwnProperty")
        return wc;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Ke(t) ? t : i
    );
    if ((mt(n) ? La.has(n) : Sc(n)) || (o || Re(t, "get", n), r))
      return l;
    if (/* @__PURE__ */ Ke(l)) {
      const a = s && Br(n) ? l : l.value;
      return o && ye(a) ? /* @__PURE__ */ lo(a) : a;
    }
    return ye(l) ? o ? /* @__PURE__ */ lo(l) : /* @__PURE__ */ on(l) : l;
  }
}
class Aa extends Ea {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, i, o) {
    let r = t[n];
    const s = Y(t) && Br(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ Tt(r);
      if (!/* @__PURE__ */ at(i) && !/* @__PURE__ */ Tt(i) && (r = /* @__PURE__ */ me(r), i = /* @__PURE__ */ me(i)), !s && /* @__PURE__ */ Ke(r) && !/* @__PURE__ */ Ke(i))
        return d || (r.value = i), !0;
    }
    const l = s ? Number(n) < t.length : ve(t, n), a = Reflect.set(
      t,
      n,
      i,
      /* @__PURE__ */ Ke(t) ? t : o
    );
    return t === /* @__PURE__ */ me(o) && a && (l ? _t(i, r) && Ft(t, "set", n, i) : Ft(t, "add", n, i)), a;
  }
  deleteProperty(t, n) {
    const i = ve(t, n);
    t[n];
    const o = Reflect.deleteProperty(t, n);
    return o && i && Ft(t, "delete", n, void 0), o;
  }
  has(t, n) {
    const i = Reflect.has(t, n);
    return (!mt(n) || !La.has(n)) && Re(t, "has", n), i;
  }
  ownKeys(t) {
    return Re(
      t,
      "iterate",
      Y(t) ? "length" : wn
    ), Reflect.ownKeys(t);
  }
}
class Oc extends Ea {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const xc = /* @__PURE__ */ new Aa(), Ic = /* @__PURE__ */ new Oc(), $c = /* @__PURE__ */ new Aa(!0);
const pr = (e) => e, Hi = (e) => Reflect.getPrototypeOf(e);
function _c(e, t, n) {
  return function(...i) {
    const o = this.__v_raw, r = /* @__PURE__ */ me(o), s = Zt(r), l = e === "entries" || e === Symbol.iterator && s, a = e === "keys" && s, d = o[e](...i), u = n ? pr : t ? tn : ut;
    return !t && Re(
      r,
      "iterate",
      a ? fr : wn
    ), Ee(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: c, done: f } = d.next();
          return f ? { value: c, done: f } : {
            value: l ? [u(c[0]), u(c[1])] : u(c),
            done: f
          };
        }
      }
    );
  };
}
function Ui(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Cc(e, t) {
  const n = {
    get(o) {
      const r = this.__v_raw, s = /* @__PURE__ */ me(r), l = /* @__PURE__ */ me(o);
      e || (_t(o, l) && Re(s, "get", o), Re(s, "get", l));
      const { has: a } = Hi(s), d = t ? pr : e ? tn : ut;
      if (a.call(s, o))
        return d(r.get(o));
      if (a.call(s, l))
        return d(r.get(l));
      r !== s && r.get(o);
    },
    get size() {
      const o = this.__v_raw;
      return !e && Re(/* @__PURE__ */ me(o), "iterate", wn), o.size;
    },
    has(o) {
      const r = this.__v_raw, s = /* @__PURE__ */ me(r), l = /* @__PURE__ */ me(o);
      return e || (_t(o, l) && Re(s, "has", o), Re(s, "has", l)), o === l ? r.has(o) : r.has(o) || r.has(l);
    },
    forEach(o, r) {
      const s = this, l = s.__v_raw, a = /* @__PURE__ */ me(l), d = t ? pr : e ? tn : ut;
      return !e && Re(a, "iterate", wn), l.forEach((u, c) => o.call(r, d(u), d(c), s));
    }
  };
  return Ee(
    n,
    e ? {
      add: Ui("add"),
      set: Ui("set"),
      delete: Ui("delete"),
      clear: Ui("clear")
    } : {
      add(o) {
        const r = /* @__PURE__ */ me(this), s = Hi(r), l = /* @__PURE__ */ me(o), a = !t && !/* @__PURE__ */ at(o) && !/* @__PURE__ */ Tt(o) ? l : o;
        return s.has.call(r, a) || _t(o, a) && s.has.call(r, o) || _t(l, a) && s.has.call(r, l) || (r.add(a), Ft(r, "add", a, a)), this;
      },
      set(o, r) {
        !t && !/* @__PURE__ */ at(r) && !/* @__PURE__ */ Tt(r) && (r = /* @__PURE__ */ me(r));
        const s = /* @__PURE__ */ me(this), { has: l, get: a } = Hi(s);
        let d = l.call(s, o);
        d || (o = /* @__PURE__ */ me(o), d = l.call(s, o));
        const u = a.call(s, o);
        return s.set(o, r), d ? _t(r, u) && Ft(s, "set", o, r) : Ft(s, "add", o, r), this;
      },
      delete(o) {
        const r = /* @__PURE__ */ me(this), { has: s, get: l } = Hi(r);
        let a = s.call(r, o);
        a || (o = /* @__PURE__ */ me(o), a = s.call(r, o)), l && l.call(r, o);
        const d = r.delete(o);
        return a && Ft(r, "delete", o, void 0), d;
      },
      clear() {
        const o = /* @__PURE__ */ me(this), r = o.size !== 0, s = o.clear();
        return r && Ft(
          o,
          "clear",
          void 0,
          void 0
        ), s;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((o) => {
    n[o] = _c(o, e, t);
  }), n;
}
function Gr(e, t) {
  const n = Cc(e, t);
  return (i, o, r) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_raw" ? i : Reflect.get(
    ve(n, o) && o in i ? n : i,
    o,
    r
  );
}
const kc = {
  get: /* @__PURE__ */ Gr(!1, !1)
}, Tc = {
  get: /* @__PURE__ */ Gr(!1, !0)
}, Pc = {
  get: /* @__PURE__ */ Gr(!0, !1)
};
const Ma = /* @__PURE__ */ new WeakMap(), Fa = /* @__PURE__ */ new WeakMap(), Va = /* @__PURE__ */ new WeakMap(), Lc = /* @__PURE__ */ new WeakMap();
function Ec(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function on(e) {
  return /* @__PURE__ */ Tt(e) ? e : qr(
    e,
    !1,
    xc,
    kc,
    Ma
  );
}
// @__NO_SIDE_EFFECTS__
function Ac(e) {
  return qr(
    e,
    !1,
    $c,
    Tc,
    Fa
  );
}
// @__NO_SIDE_EFFECTS__
function lo(e) {
  return qr(
    e,
    !0,
    Ic,
    Pc,
    Va
  );
}
function qr(e, t, n, i, o) {
  if (!ye(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = o.get(e);
  if (r)
    return r;
  const s = Ec(tc(e));
  if (s === 0)
    return e;
  const l = new Proxy(
    e,
    s === 2 ? i : n
  );
  return o.set(e, l), l;
}
// @__NO_SIDE_EFFECTS__
function Qt(e) {
  return /* @__PURE__ */ Tt(e) ? /* @__PURE__ */ Qt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Tt(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function at(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Jr(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function me(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ me(t) : e;
}
function Mc(e) {
  return !ve(e, "__v_skip") && Object.isExtensible(e) && va(e, "__v_skip", !0), e;
}
const ut = (e) => ye(e) ? /* @__PURE__ */ on(e) : e, tn = (e) => ye(e) ? /* @__PURE__ */ lo(e) : e;
// @__NO_SIDE_EFFECTS__
function Ke(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Ve(e) {
  return Na(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
  return Na(e, !0);
}
function Na(e, t) {
  return /* @__PURE__ */ Ke(e) ? e : new Fc(e, t);
}
class Fc {
  constructor(t, n) {
    this.dep = new Wr(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ me(t), this._value = n ? t : ut(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ at(t) || /* @__PURE__ */ Tt(t);
    t = i ? t : /* @__PURE__ */ me(t), _t(t, n) && (this._rawValue = t, this._value = i ? t : ut(t), this.dep.trigger());
  }
}
function B(e) {
  return /* @__PURE__ */ Ke(e) ? e.value : e;
}
const Vc = {
  get: (e, t, n) => t === "__v_raw" ? e : B(Reflect.get(e, t, n)),
  set: (e, t, n, i) => {
    const o = e[t];
    return /* @__PURE__ */ Ke(o) && !/* @__PURE__ */ Ke(n) ? (o.value = n, !0) : Reflect.set(e, t, n, i);
  }
};
function Da(e) {
  return /* @__PURE__ */ Qt(e) ? e : new Proxy(e, Vc);
}
class Nc {
  constructor(t, n, i) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Wr(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ai - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Ie !== this)
      return $a(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return ka(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Dc(e, t, n = !1) {
  let i, o;
  return ee(e) ? i = e : (i = e.get, o = e.set), new Nc(i, o, n);
}
const Wi = {}, ao = /* @__PURE__ */ new WeakMap();
let cn;
function jc(e, t = !1, n = cn) {
  if (n) {
    let i = ao.get(n);
    i || ao.set(n, i = []), i.push(e);
  }
}
function Rc(e, t, n = xe) {
  const { immediate: i, deep: o, once: r, scheduler: s, augmentJob: l, call: a } = n, d = (g) => o ? g : /* @__PURE__ */ at(g) || o === !1 || o === 0 ? Vt(g, 1) : Vt(g);
  let u, c, f, h, b = !1, y = !1;
  if (/* @__PURE__ */ Ke(e) ? (c = () => e.value, b = /* @__PURE__ */ at(e)) : /* @__PURE__ */ Qt(e) ? (c = () => d(e), b = !0) : Y(e) ? (y = !0, b = e.some((g) => /* @__PURE__ */ Qt(g) || /* @__PURE__ */ at(g)), c = () => e.map((g) => {
    if (/* @__PURE__ */ Ke(g))
      return g.value;
    if (/* @__PURE__ */ Qt(g))
      return d(g);
    if (ee(g))
      return a ? a(g, 2) : g();
  })) : ee(e) ? t ? c = a ? () => a(e, 2) : e : c = () => {
    if (f) {
      Rt();
      try {
        f();
      } finally {
        zt();
      }
    }
    const g = cn;
    cn = u;
    try {
      return a ? a(e, 3, [h]) : e(h);
    } finally {
      cn = g;
    }
  } : c = kt, t && o) {
    const g = c, x = o === !0 ? 1 / 0 : o;
    c = () => Vt(g(), x);
  }
  const w = gc(), v = () => {
    u.stop(), w && w.active && zr(w.effects, u);
  };
  if (r && t) {
    const g = t;
    t = (...x) => {
      const D = g(...x);
      return v(), D;
    };
  }
  let S = y ? new Array(e.length).fill(Wi) : Wi;
  const $ = (g) => {
    if (!(!(u.flags & 1) || !u.dirty && !g))
      if (t) {
        const x = u.run();
        if (g || o || b || (y ? x.some((D, L) => _t(D, S[L])) : _t(x, S))) {
          f && f();
          const D = cn;
          cn = u;
          try {
            const L = [
              x,
              // pass undefined as the old value when it's changed for the first time
              S === Wi ? void 0 : y && S[0] === Wi ? [] : S,
              h
            ];
            S = x, a ? a(t, 3, L) : (
              // @ts-expect-error
              t(...L)
            );
          } finally {
            cn = D;
          }
        }
      } else
        u.run();
  };
  return l && l($), u = new xa(c), u.scheduler = s ? () => s($, !1) : $, h = (g) => jc(g, !1, u), f = u.onStop = () => {
    const g = ao.get(u);
    if (g) {
      if (a)
        a(g, 4);
      else
        for (const x of g) x();
      ao.delete(u);
    }
  }, t ? i ? $(!0) : S = u.run() : s ? s($.bind(null, !0), !0) : u.run(), v.pause = u.pause.bind(u), v.resume = u.resume.bind(u), v.stop = v, v;
}
function Vt(e, t = 1 / 0, n) {
  if (t <= 0 || !ye(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ Ke(e))
    Vt(e.value, t, n);
  else if (Y(e))
    for (let i = 0; i < e.length; i++)
      Vt(e[i], t, n);
  else if (so(e) || Zt(e))
    e.forEach((i) => {
      Vt(i, t, n);
    });
  else if (ba(e)) {
    for (const i in e)
      Vt(e[i], t, n);
    for (const i of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, i) && Vt(e[i], t, n);
  }
  return e;
}
function Fi(e, t, n, i) {
  try {
    return i ? e(...i) : e();
  } catch (o) {
    ko(o, t, n);
  }
}
function dt(e, t, n, i) {
  if (ee(e)) {
    const o = Fi(e, t, n, i);
    return o && ga(o) && o.catch((r) => {
      ko(r, t, n);
    }), o;
  }
  if (Y(e)) {
    const o = [];
    for (let r = 0; r < e.length; r++)
      o.push(dt(e[r], t, n, i));
    return o;
  }
}
function ko(e, t, n, i = !0) {
  const o = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: s } = t && t.appContext.config || xe;
  if (t) {
    let l = t.parent;
    const a = t.proxy, d = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const u = l.ec;
      if (u) {
        for (let c = 0; c < u.length; c++)
          if (u[c](e, a, d) === !1)
            return;
      }
      l = l.parent;
    }
    if (r) {
      Rt(), Fi(r, null, 10, [
        e,
        a,
        d
      ]), zt();
      return;
    }
  }
  zc(e, n, o, i, s);
}
function zc(e, t, n, i = !0, o = !1) {
  if (o)
    throw e;
  console.error(e);
}
const Ge = [];
let Ot = -1;
const Vn = [];
let Gt = null, En = 0;
const ja = /* @__PURE__ */ Promise.resolve();
let uo = null;
function Yr(e) {
  const t = uo || ja;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Bc(e) {
  let t = Ot + 1, n = Ge.length;
  for (; t < n; ) {
    const i = t + n >>> 1, o = Ge[i], r = di(o);
    r < e || r === e && o.flags & 2 ? t = i + 1 : n = i;
  }
  return t;
}
function Zr(e) {
  if (!(e.flags & 1)) {
    const t = di(e), n = Ge[Ge.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= di(n) ? Ge.push(e) : Ge.splice(Bc(t), 0, e), e.flags |= 1, Ra();
  }
}
function Ra() {
  uo || (uo = ja.then(Ba));
}
function Kc(e) {
  if (!Y(e))
    Gt && e.id === -1 ? Gt.splice(En + 1, 0, e) : e.flags & 1 || (Vn.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Vn.push(e[t]);
  Ra();
}
function Fs(e, t, n = Ot + 1) {
  for (; n < Ge.length; n++) {
    const i = Ge[n];
    if (i && i.flags & 2) {
      if (e && i.id !== e.uid)
        continue;
      Ge.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function za(e) {
  if (Vn.length) {
    const t = [...new Set(Vn)].sort(
      (n, i) => di(n) - di(i)
    );
    if (Vn.length = 0, Gt) {
      for (let n = 0; n < t.length; n++)
        Gt.push(t[n]);
      return;
    }
    for (Gt = t, En = 0; En < Gt.length; En++) {
      const n = Gt[En];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    Gt = null, En = 0;
  }
}
const di = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Ba(e) {
  try {
    for (Ot = 0; Ot < Ge.length; Ot++) {
      const t = Ge[Ot];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Fi(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Ot < Ge.length; Ot++) {
      const t = Ge[Ot];
      t && (t.flags &= -2);
    }
    Ot = -1, Ge.length = 0, za(), uo = null, (Ge.length || Vn.length) && Ba();
  }
}
let Ne = null, Ka = null;
function co(e) {
  const t = Ne;
  return Ne = e, Ka = e && e.type.__scopeId || null, t;
}
function Qe(e, t = Ne, n) {
  if (!t || e._n)
    return e;
  const i = (...o) => {
    i._d && go(-1);
    const r = co(t), s = Dt.length;
    let l;
    try {
      l = e(...o);
    } finally {
      for (let a = Dt.length; a > s; a--) rs();
      co(r), i._d && go(1);
    }
    return l;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function Qr(e, t) {
  if (Ne === null)
    return e;
  const n = Mo(Ne), i = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [r, s, l, a = xe] = t[o];
    r && (ee(r) && (r = {
      mounted: r,
      updated: r
    }), r.deep && Vt(s), i.push({
      dir: r,
      instance: n,
      value: s,
      oldValue: void 0,
      arg: l,
      modifiers: a
    }));
  }
  return e;
}
function ln(e, t, n, i) {
  const o = e.dirs, r = t && t.dirs;
  for (let s = 0; s < o.length; s++) {
    const l = o[s];
    r && (l.oldValue = r[s].value);
    let a = l.dir[i];
    a && (Rt(), dt(a, n, 8, [
      e.el,
      l,
      e,
      t
    ]), zt());
  }
}
function Hc(e, t) {
  if (Be) {
    let n = Be.provides;
    const i = Be.parent && Be.parent.provides;
    i === n && (n = Be.provides = Object.create(i)), n[e] = t;
  }
}
function Xi(e, t, n = !1) {
  const i = hi();
  if (i || Dn) {
    let o = Dn ? Dn._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return n && ee(t) ? t.call(i && i.proxy) : t;
  }
}
const Uc = /* @__PURE__ */ Symbol.for("v-scx"), Wc = () => Xi(Uc);
function lt(e, t, n) {
  return Ha(e, t, n);
}
function Ha(e, t, n = xe) {
  const { immediate: i, deep: o, flush: r, once: s } = n, l = Ee({}, n), a = t && i || !t && r !== "post";
  let d;
  if (mi) {
    if (r === "sync") {
      const h = Wc();
      d = h.__watcherHandles || (h.__watcherHandles = []);
    } else if (!a) {
      const h = () => {
      };
      return h.stop = kt, h.resume = kt, h.pause = kt, h;
    }
  }
  const u = Be;
  l.call = (h, b, y) => dt(h, u, b, y);
  let c = !1;
  r === "post" ? l.scheduler = (h) => {
    Ue(h, u && u.suspense);
  } : r !== "sync" && (c = !0, l.scheduler = (h, b) => {
    b ? h() : Zr(h);
  }), l.augmentJob = (h) => {
    t && (h.flags |= 4), c && (h.flags |= 2, u && (h.id = u.uid, h.i = u));
  };
  const f = Rc(e, t, l);
  return mi && (d ? d.push(f) : a && f()), f;
}
function Gc(e, t, n) {
  const i = this.proxy, o = _e(e) ? e.includes(".") ? Ua(i, e) : () => i[e] : e.bind(i, i);
  let r;
  ee(t) ? r = t : (r = t.handler, n = t);
  const s = Ni(this), l = Ha(o, r.bind(i), n);
  return s(), l;
}
function Ua(e, t) {
  const n = t.split(".");
  return () => {
    let i = e;
    for (let o = 0; o < n.length && i; o++)
      i = i[n[o]];
    return i;
  };
}
const Wt = /* @__PURE__ */ new WeakMap(), Wa = /* @__PURE__ */ Symbol("_vte"), To = (e) => e.__isTeleport, gn = (e) => e && (e.disabled || e.disabled === ""), qc = (e) => e && (e.defer || e.defer === ""), Vs = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Ns = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, hr = (e, t) => {
  const n = e && e.to;
  return _e(n) ? t ? t(n) : null : n;
}, Jc = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, i, o, r, s, l, a, d) {
    const {
      mc: u,
      pc: c,
      pbc: f,
      o: { insert: h, querySelector: b, createText: y, createComment: w, parentNode: v }
    } = d, S = gn(t.props);
    let { dynamicChildren: $ } = t;
    const g = (L, j, N) => {
      L.shapeFlag & 16 && u(
        L.children,
        j,
        N,
        o,
        r,
        s,
        l,
        a
      );
    }, x = (L = t) => {
      const j = gn(L.props), N = L.target = hr(L.props, b), G = gr(N, L, y, h);
      N && (s !== "svg" && Vs(N) ? s = "svg" : s !== "mathml" && Ns(N) && (s = "mathml"), o && o.isCE && (o.ce._teleportTargets || (o.ce._teleportTargets = /* @__PURE__ */ new Set())).add(N), j || (g(L, N, G), Zn(L, !1)));
    }, D = (L) => {
      const j = () => {
        if (Wt.get(L) === j) {
          if (Wt.delete(L), gn(L.props)) {
            const N = v(L.el) || n;
            g(L, N, L.anchor), Zn(L, !0);
          }
          x(L);
        }
      };
      Wt.set(L, j), Ue(j, r);
    };
    if (e == null) {
      const L = t.el = y(""), j = t.anchor = y("");
      if (h(L, n, i), h(j, n, i), qc(t.props) || r && r.pendingBranch) {
        D(t);
        return;
      }
      S && (g(t, n, j), Zn(t, !0)), x();
    } else {
      t.el = e.el;
      const L = t.anchor = e.anchor, j = Wt.get(e);
      if (j) {
        j.flags |= 8, Wt.delete(e), D(t);
        return;
      }
      t.targetStart = e.targetStart;
      const N = t.target = e.target, G = t.targetAnchor = e.targetAnchor, U = gn(e.props), E = U ? n : N, te = U ? L : G;
      if (s === "svg" || Vs(N) ? s = "svg" : (s === "mathml" || Ns(N)) && (s = "mathml"), $ ? (f(
        e.dynamicChildren,
        $,
        E,
        o,
        r,
        s,
        l
      ), os(e, t, !0)) : a || c(
        e,
        t,
        E,
        te,
        o,
        r,
        s,
        l,
        !1
      ), S)
        U ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Gi(
          t,
          n,
          L,
          d,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const X = hr(t.props, b);
        X && (t.target = X, Gi(
          t,
          X,
          null,
          d,
          0
        ));
      } else U && Gi(
        t,
        N,
        G,
        d,
        1
      );
      Zn(t, S);
    }
  },
  remove(e, t, n, { um: i, o: { remove: o } }, r) {
    const {
      shapeFlag: s,
      children: l,
      anchor: a,
      targetStart: d,
      targetAnchor: u,
      target: c,
      props: f
    } = e, h = gn(f), b = r || !h, y = Wt.get(e);
    if (y && (y.flags |= 8, Wt.delete(e)), c && (o(d), o(u)), r && o(a), !y && (h || c) && s & 16)
      for (let w = 0; w < l.length; w++) {
        const v = l[w];
        i(
          v,
          t,
          n,
          b,
          !!v.dynamicChildren
        );
      }
  },
  move: Gi,
  hydrate: Yc
};
function Gi(e, t, n, { o: { insert: i }, m: o }, r = 2) {
  r === 0 && i(e.targetAnchor, t, n);
  const { el: s, anchor: l, shapeFlag: a, children: d, props: u } = e, c = r === 2;
  if (c && i(s, t, n), !Wt.has(e) && (!c || gn(u)) && a & 16)
    for (let f = 0; f < d.length; f++)
      o(
        d[f],
        t,
        n,
        2
      );
  c && i(l, t, n);
}
function Yc(e, t, n, i, o, r, {
  o: { nextSibling: s, parentNode: l, querySelector: a, insert: d, createText: u }
}, c) {
  function f(w, v) {
    let S = v;
    for (; S; ) {
      if (S && S.nodeType === 8) {
        if (S.data === "teleport start anchor")
          t.targetStart = S;
        else if (S.data === "teleport anchor") {
          t.targetAnchor = S, w._lpa = t.targetAnchor && s(t.targetAnchor);
          break;
        }
      }
      S = s(S);
    }
  }
  function h(w, v) {
    v.anchor = c(
      s(w),
      v,
      l(w),
      n,
      i,
      o,
      r
    );
  }
  const b = t.target = hr(
    t.props,
    a
  ), y = gn(t.props);
  if (b) {
    const w = b._lpa || b.firstChild;
    t.shapeFlag & 16 && (y ? (h(e, t), f(b, w), t.targetAnchor || gr(
      b,
      t,
      u,
      d,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      l(e) === b ? e : null
    )) : (t.anchor = s(e), f(b, w), t.targetAnchor || gr(b, t, u, d), c(
      w && s(w),
      t,
      b,
      n,
      i,
      o,
      r
    ))), Zn(t, y);
  } else y && t.shapeFlag & 16 && (h(e, t), t.targetStart = e, t.targetAnchor = s(e));
  return t.anchor && s(t.anchor);
}
const Zc = Jc;
function Zn(e, t) {
  const n = e.ctx;
  if (n && n.ut) {
    let i, o;
    for (t ? (i = e.el, o = e.anchor) : (i = e.targetStart, o = e.targetAnchor); i && i !== o; )
      i.nodeType === 1 && i.setAttribute("data-v-owner", n.uid), i = i.nextSibling;
    n.ut();
  }
}
function gr(e, t, n, i, o = null) {
  const r = t.targetStart = n(""), s = t.targetAnchor = n("");
  return r[Wa] = s, e && (i(r, e, o), i(s, e, o)), s;
}
const ot = /* @__PURE__ */ Symbol("_leaveCb"), Wn = /* @__PURE__ */ Symbol("_enterCb");
function Qc() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Cn(() => {
    e.isMounted = !0;
  }), Vi(() => {
    e.isUnmounting = !0;
  }), e;
}
const nt = [Function, Array], Ga = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: nt,
  onEnter: nt,
  onAfterEnter: nt,
  onEnterCancelled: nt,
  // leave
  onBeforeLeave: nt,
  onLeave: nt,
  onAfterLeave: nt,
  onLeaveCancelled: nt,
  // appear
  onBeforeAppear: nt,
  onAppear: nt,
  onAfterAppear: nt,
  onAppearCancelled: nt
}, qa = (e) => {
  const t = e.subTree;
  return t.component ? qa(t.component) : t;
}, Xc = {
  name: "BaseTransition",
  props: Ga,
  setup(e, { slots: t }) {
    const n = hi(), i = Qc();
    return () => {
      const o = t.default && Za(t.default(), !0), r = o && o.length ? Ja(o) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        n.subTree ? re() : void 0
      );
      if (!r)
        return;
      const s = /* @__PURE__ */ me(e), { mode: l } = s;
      if (i.isLeaving)
        return qo(r);
      const a = fo(r);
      if (!a)
        return qo(r);
      let d = mr(
        a,
        s,
        i,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (c) => d = c
      );
      a.type !== ze && ci(a, d);
      let u = n.subTree && fo(n.subTree);
      if (u && u.type !== ze && !mn(u, a) && qa(n).type !== ze) {
        let c = mr(
          u,
          s,
          i,
          n
        );
        if (ci(u, c), l === "out-in" && a.type !== ze)
          return i.isLeaving = !0, c.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete c.afterLeave, u = void 0;
          }, qo(r);
        l === "in-out" && a.type !== ze ? c.delayLeave = (f, h, b) => {
          const y = Ya(
            i,
            u
          );
          y[String(u.key)] = u, f[ot] = () => {
            h(), f[ot] = void 0, delete d.delayedLeave, u = void 0;
          }, d.delayedLeave = () => {
            b(), delete d.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return r;
    };
  }
};
function Ja(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== ze) {
        t = n;
        break;
      }
  }
  return t;
}
const ef = Xc;
function Ya(e, t) {
  const { leavingVNodes: n } = e;
  let i = n.get(t.type);
  return i || (i = /* @__PURE__ */ Object.create(null), n.set(t.type, i)), i;
}
function mr(e, t, n, i, o) {
  const {
    appear: r,
    mode: s,
    persisted: l = !1,
    onBeforeEnter: a,
    onEnter: d,
    onAfterEnter: u,
    onEnterCancelled: c,
    onBeforeLeave: f,
    onLeave: h,
    onAfterLeave: b,
    onLeaveCancelled: y,
    onBeforeAppear: w,
    onAppear: v,
    onAfterAppear: S,
    onAppearCancelled: $
  } = t, g = String(e.key), x = Ya(n, e), D = (N, G) => {
    N && dt(
      N,
      i,
      9,
      G
    );
  }, L = (N, G) => {
    const U = G[1];
    D(N, G), Y(N) ? N.every((E) => E.length <= 1) && U() : N.length <= 1 && U();
  }, j = {
    mode: s,
    persisted: l,
    beforeEnter(N) {
      let G = a;
      if (!n.isMounted)
        if (r)
          G = w || a;
        else
          return;
      N[ot] && N[ot](
        !0
        /* cancelled */
      );
      const U = x[g];
      U && mn(e, U) && U.el[ot] && U.el[ot](), D(G, [N]);
    },
    enter(N) {
      if (x[g] === e) return;
      let G = d, U = u, E = c;
      if (!n.isMounted)
        if (r)
          G = v || d, U = S || u, E = $ || c;
        else
          return;
      let te = !1;
      N[Wn] = (ce) => {
        te || (te = !0, ce ? D(E, [N]) : D(U, [N]), j.delayedLeave && j.delayedLeave(), N[Wn] = void 0);
      };
      const X = N[Wn].bind(null, !1);
      G ? L(G, [N, X]) : X();
    },
    leave(N, G) {
      const U = String(e.key);
      if (N[Wn] && N[Wn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return G();
      D(f, [N]);
      let E = !1;
      N[ot] = (X) => {
        E || (E = !0, G(), X ? D(y, [N]) : D(b, [N]), N[ot] = void 0, x[U] === e && delete x[U]);
      };
      const te = N[ot].bind(null, !1);
      x[U] = e, h ? L(h, [N, te]) : te();
    },
    clone(N) {
      const G = mr(
        N,
        t,
        n,
        i,
        o
      );
      return o && o(G), G;
    }
  };
  return j;
}
function qo(e) {
  if (Po(e))
    return e = nn(e), e.children = null, e;
}
function fo(e) {
  if (!Po(e))
    return To(e.type) && e.children ? Ja(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && ee(n.default))
      return n.default();
  }
}
function ci(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    ci(
      To(n.type) && fo(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Za(e, t = !1, n) {
  let i = [], o = 0;
  for (let r = 0; r < e.length; r++) {
    let s = e[r];
    const l = n == null ? s.key : String(n) + String(s.key != null ? s.key : r);
    s.type === ge ? (s.patchFlag & 128 && o++, i = i.concat(
      Za(s.children, t, l)
    )) : (t || s.type !== ze) && i.push(l != null ? nn(s, { key: l }) : s);
  }
  if (o > 1)
    for (let r = 0; r < i.length; r++)
      i[r].patchFlag = -2;
  return i;
}
// @__NO_SIDE_EFFECTS__
function rn(e, t) {
  return ee(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ee({ name: e.name }, t, { setup: e })
  ) : e;
}
function tf() {
  const e = hi();
  return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Qa(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ds(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const po = /* @__PURE__ */ new WeakMap();
function ri(e, t, n, i, o = !1) {
  if (Y(e)) {
    e.forEach(
      (y, w) => ri(
        y,
        t && (Y(t) ? t[w] : t),
        n,
        i,
        o
      )
    );
    return;
  }
  if (Nn(i) && !o) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && ri(e, t, n, i.component.subTree);
    return;
  }
  const r = i.shapeFlag & 4 ? Mo(i.component) : i.el, s = o ? null : r, { i: l, r: a } = e, d = t && t.r, u = l.refs === xe ? l.refs = {} : l.refs, c = l.setupState, f = /* @__PURE__ */ me(c), h = c === xe ? ha : (y) => Ds(u, y) ? !1 : ve(f, y), b = (y, w) => !(w && Ds(u, w));
  if (d != null && d !== a) {
    if (js(t), _e(d))
      u[d] = null, h(d) && (c[d] = null);
    else if (/* @__PURE__ */ Ke(d)) {
      const y = t;
      b(d, y.k) && (d.value = null), y.k && (u[y.k] = null);
    }
  }
  if (ee(a))
    Fi(a, l, 12, [s, u]);
  else {
    const y = _e(a), w = /* @__PURE__ */ Ke(a);
    if (y || w) {
      const v = () => {
        if (e.f) {
          const S = y ? h(a) ? c[a] : u[a] : b() || !e.k ? a.value : u[e.k];
          if (o)
            Y(S) && zr(S, r);
          else if (Y(S))
            S.includes(r) || S.push(r);
          else if (y)
            u[a] = [r], h(a) && (c[a] = u[a]);
          else {
            const $ = [r];
            b(a, e.k) && (a.value = $), e.k && (u[e.k] = $);
          }
        } else y ? (u[a] = s, h(a) && (c[a] = s)) : w && (b(a, e.k) && (a.value = s), e.k && (u[e.k] = s));
      };
      if (s) {
        const S = () => {
          v(), po.delete(e);
        };
        S.id = -1, po.set(e, S), Ue(S, n);
      } else
        js(e), v();
    }
  }
}
function js(e) {
  const t = po.get(e);
  t && (t.flags |= 8, po.delete(e));
}
$o().requestIdleCallback;
$o().cancelIdleCallback;
const Nn = (e) => !!e.type.__asyncLoader, Po = (e) => e.type.__isKeepAlive;
function nf(e, t) {
  Xa(e, "a", t);
}
function of(e, t) {
  Xa(e, "da", t);
}
function Xa(e, t, n = Be) {
  const i = e.__wdc || (e.__wdc = () => {
    let o = n;
    for (; o; ) {
      if (o.isDeactivated)
        return;
      o = o.parent;
    }
    return e();
  });
  if (Lo(t, i, n), n) {
    let o = n.parent;
    for (; o && o.parent; )
      Po(o.parent.vnode) && rf(i, t, n, o), o = o.parent;
  }
}
function rf(e, t, n, i) {
  const o = Lo(
    t,
    e,
    i,
    !0
    /* prepend */
  );
  eu(() => {
    zr(i[t], o);
  }, n);
}
function Lo(e, t, n = Be, i = !1) {
  if (n) {
    const o = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...s) => {
      Rt();
      const l = Ni(n), a = dt(t, n, e, s);
      return l(), zt(), a;
    });
    return i ? o.unshift(r) : o.push(r), r;
  }
}
const Bt = (e) => (t, n = Be) => {
  (!mi || e === "sp") && Lo(e, (...i) => t(...i), n);
}, sf = Bt("bm"), Cn = Bt("m"), lf = Bt(
  "bu"
), af = Bt("u"), Vi = Bt(
  "bum"
), eu = Bt("um"), uf = Bt(
  "sp"
), df = Bt("rtg"), cf = Bt("rtc");
function ff(e, t = Be) {
  Lo("ec", e, t);
}
const Xr = "components", pf = "directives";
function Le(e, t) {
  return ts(Xr, e, !0, t) || e;
}
const tu = /* @__PURE__ */ Symbol.for("v-ndc");
function br(e) {
  return _e(e) ? ts(Xr, e, !1) || e : e || tu;
}
function es(e) {
  return ts(pf, e);
}
function ts(e, t, n = !0, i = !1) {
  const o = Ne || Be;
  if (o) {
    const r = o.type;
    if (e === Xr) {
      const l = Jf(
        r,
        !1
      );
      if (l && (l === t || l === qe(t) || l === Io(qe(t))))
        return r;
    }
    const s = (
      // local registration
      // check instance[type] first which is resolved for options API
      Rs(o[e] || r[e], t) || // global registration
      Rs(o.appContext[e], t)
    );
    return !s && i ? r : s;
  }
}
function Rs(e, t) {
  return e && (e[t] || e[qe(t)] || e[Io(qe(t))]);
}
function ht(e, t, n, i) {
  let o;
  const r = n, s = Y(e);
  if (s || _e(e)) {
    const l = s && /* @__PURE__ */ Qt(e);
    let a = !1, d = !1;
    l && (a = !/* @__PURE__ */ at(e), d = /* @__PURE__ */ Tt(e), e = Co(e)), o = new Array(e.length);
    for (let u = 0, c = e.length; u < c; u++)
      o[u] = t(
        a ? d ? tn(ut(e[u])) : ut(e[u]) : e[u],
        u,
        void 0,
        r
      );
  } else if (typeof e == "number") {
    o = new Array(e);
    for (let l = 0; l < e; l++)
      o[l] = t(l + 1, l, void 0, r);
  } else if (ye(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (l, a) => t(l, a, void 0, r)
      );
    else {
      const l = Object.keys(e);
      o = new Array(l.length);
      for (let a = 0, d = l.length; a < d; a++) {
        const u = l[a];
        o[a] = t(e[u], u, a, r);
      }
    }
  else
    o = [];
  return o;
}
function nu(e, t) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    if (Y(i))
      for (let o = 0; o < i.length; o++)
        e[i[o].name] = i[o].fn;
    else i && (e[i.name] = i.key ? (...o) => {
      const r = i.fn(...o);
      return r && (r.key = i.key), r;
    } : i.fn);
  }
  return e;
}
function de(e, t, n, i, o, r) {
  if (n == null && (n = {}), Ne.ce || Ne.parent && Nn(Ne.parent) && Ne.parent.ce) {
    const d = n, u = Object.keys(d).length > 0;
    return t !== "default" && (d.name = t), I(), ke(
      ge,
      null,
      [q("slot", d, i && i())],
      u ? -2 : 64
    );
  }
  let s = e[t];
  s && s._c && (s._d = !1);
  const l = Dt.length;
  I();
  let a;
  try {
    const d = s && iu(s(n)), u = n.key || r || // slot content array of a dynamic conditional slot may have a branch
    // key attached in the `createSlots` helper, respect that
    d && d.key;
    a = ke(
      ge,
      {
        key: (u && !mt(u) ? u : `_${t}`) + // #7256 force differentiate fallback content from actual content
        (!d && i ? "_fb" : "")
      },
      d || (i ? i() : []),
      d && e._ === 1 ? 64 : -2
    );
  } catch (d) {
    for (let u = Dt.length; u > l; u--) rs();
    throw d;
  } finally {
    s && s._c && (s._d = !0);
  }
  return a.scopeId && (a.slotScopeIds = [a.scopeId + "-s"]), a;
}
function iu(e) {
  return e.some((t) => pi(t) ? !(t.type === ze || t.type === ge && !iu(t.children)) : !0) ? e : null;
}
const vr = (e) => e ? Ou(e) ? Mo(e) : vr(e.parent) : null, si = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ee(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => vr(e.parent),
    $root: (e) => vr(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => ru(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Zr(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Yr.bind(e.proxy)),
    $watch: (e) => Gc.bind(e)
  })
), Jo = (e, t) => e !== xe && !e.__isScriptSetup && ve(e, t), hf = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: i, data: o, props: r, accessCache: s, type: l, appContext: a } = e;
    if (t[0] !== "$") {
      const f = s[t];
      if (f !== void 0)
        switch (f) {
          case 1:
            return i[t];
          case 2:
            return o[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (Jo(i, t))
          return s[t] = 1, i[t];
        if (o !== xe && ve(o, t))
          return s[t] = 2, o[t];
        if (ve(r, t))
          return s[t] = 3, r[t];
        if (n !== xe && ve(n, t))
          return s[t] = 4, n[t];
        yr && (s[t] = 0);
      }
    }
    const d = si[t];
    let u, c;
    if (d)
      return t === "$attrs" && Re(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (u = l.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== xe && ve(n, t))
      return s[t] = 4, n[t];
    if (
      // global properties
      c = a.config.globalProperties, ve(c, t)
    )
      return c[t];
  },
  set({ _: e }, t, n) {
    const { data: i, setupState: o, ctx: r } = e;
    return Jo(o, t) ? (o[t] = n, !0) : i !== xe && ve(i, t) ? (i[t] = n, !0) : ve(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: o, props: r, type: s }
  }, l) {
    let a;
    return !!(n[l] || e !== xe && l[0] !== "$" && ve(e, l) || Jo(t, l) || ve(r, l) || ve(i, l) || ve(si, l) || ve(o.config.globalProperties, l) || (a = s.__cssModules) && a[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : ve(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function zs(e) {
  return Y(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let yr = !0;
function gf(e) {
  const t = ru(e), n = e.proxy, i = e.ctx;
  yr = !1, t.beforeCreate && Bs(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: r,
    methods: s,
    watch: l,
    provide: a,
    inject: d,
    // lifecycle
    created: u,
    beforeMount: c,
    mounted: f,
    beforeUpdate: h,
    updated: b,
    activated: y,
    deactivated: w,
    beforeDestroy: v,
    beforeUnmount: S,
    destroyed: $,
    unmounted: g,
    render: x,
    renderTracked: D,
    renderTriggered: L,
    errorCaptured: j,
    serverPrefetch: N,
    // public API
    expose: G,
    inheritAttrs: U,
    // assets
    components: E,
    directives: te,
    filters: X
  } = t;
  if (d && mf(d, i, null), s)
    for (const ne in s) {
      const le = s[ne];
      ee(le) && (i[ne] = le.bind(n));
    }
  if (o) {
    const ne = o.call(n, n);
    ye(ne) && (e.data = /* @__PURE__ */ on(ne));
  }
  if (yr = !0, r)
    for (const ne in r) {
      const le = r[ne], Te = ee(le) ? le.bind(n, n) : ee(le.get) ? le.get.bind(n, n) : kt, z = !ee(le) && ee(le.set) ? le.set.bind(n) : kt, H = $e({
        get: Te,
        set: z
      });
      Object.defineProperty(i, ne, {
        enumerable: !0,
        configurable: !0,
        get: () => H.value,
        set: (Z) => H.value = Z
      });
    }
  if (l)
    for (const ne in l)
      ou(l[ne], i, n, ne);
  if (a) {
    const ne = ee(a) ? a.call(n) : a;
    Reflect.ownKeys(ne).forEach((le) => {
      Hc(le, ne[le]);
    });
  }
  u && Bs(u, e, "c");
  function se(ne, le) {
    Y(le) ? le.forEach((Te) => ne(Te.bind(n))) : le && ne(le.bind(n));
  }
  if (se(sf, c), se(Cn, f), se(lf, h), se(af, b), se(nf, y), se(of, w), se(ff, j), se(cf, D), se(df, L), se(Vi, S), se(eu, g), se(uf, N), Y(G))
    if (G.length) {
      const ne = e.exposed || (e.exposed = {});
      G.forEach((le) => {
        Object.defineProperty(ne, le, {
          get: () => n[le],
          set: (Te) => n[le] = Te,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  x && e.render === kt && (e.render = x), U != null && (e.inheritAttrs = U), E && (e.components = E), te && (e.directives = te), N && Qa(e);
}
function mf(e, t, n = kt) {
  Y(e) && (e = Sr(e));
  for (const i in e) {
    const o = e[i];
    let r;
    ye(o) ? "default" in o ? r = Xi(
      o.from || i,
      o.default,
      !0
    ) : r = Xi(o.from || i) : r = Xi(o), /* @__PURE__ */ Ke(r) ? Object.defineProperty(t, i, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (s) => r.value = s
    }) : t[i] = r;
  }
}
function Bs(e, t, n) {
  dt(
    Y(e) ? e.map((i) => i.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function ou(e, t, n, i) {
  let o = i.includes(".") ? Ua(n, i) : () => n[i];
  if (_e(e)) {
    const r = t[e];
    ee(r) && lt(o, r);
  } else if (ee(e))
    lt(o, e.bind(n));
  else if (ye(e))
    if (Y(e))
      e.forEach((r) => ou(r, t, n, i));
    else {
      const r = ee(e.handler) ? e.handler.bind(n) : t[e.handler];
      ee(r) && lt(o, r, e);
    }
}
function ru(e) {
  const t = e.type, { mixins: n, extends: i } = t, {
    mixins: o,
    optionsCache: r,
    config: { optionMergeStrategies: s }
  } = e.appContext, l = r.get(t);
  let a;
  return l ? a = l : !o.length && !n && !i ? a = t : (a = {}, o.length && o.forEach(
    (d) => ho(a, d, s, !0)
  ), ho(a, t, s)), ye(t) && r.set(t, a), a;
}
function ho(e, t, n, i = !1) {
  const { mixins: o, extends: r } = t;
  r && ho(e, r, n, !0), o && o.forEach(
    (s) => ho(e, s, n, !0)
  );
  for (const s in t)
    if (!(i && s === "expose")) {
      const l = bf[s] || n && n[s];
      e[s] = l ? l(e[s], t[s]) : t[s];
    }
  return e;
}
const bf = {
  data: Ks,
  props: Hs,
  emits: Hs,
  // objects
  methods: Qn,
  computed: Qn,
  // lifecycle
  beforeCreate: He,
  created: He,
  beforeMount: He,
  mounted: He,
  beforeUpdate: He,
  updated: He,
  beforeDestroy: He,
  beforeUnmount: He,
  destroyed: He,
  unmounted: He,
  activated: He,
  deactivated: He,
  errorCaptured: He,
  serverPrefetch: He,
  // assets
  components: Qn,
  directives: Qn,
  // watch
  watch: yf,
  // provide / inject
  provide: Ks,
  inject: vf
};
function Ks(e, t) {
  return t ? e ? function() {
    return Ee(
      ee(e) ? e.call(this, this) : e,
      ee(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function vf(e, t) {
  return Qn(Sr(e), Sr(t));
}
function Sr(e) {
  if (Y(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function He(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Qn(e, t) {
  return e ? Ee(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Hs(e, t) {
  return e ? Y(e) && Y(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ee(
    /* @__PURE__ */ Object.create(null),
    zs(e),
    zs(t ?? {})
  ) : t;
}
function yf(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Ee(/* @__PURE__ */ Object.create(null), e);
  for (const i in t)
    n[i] = He(e[i], t[i]);
  return n;
}
function su() {
  return {
    app: null,
    config: {
      isNativeTag: ha,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Sf = 0;
function wf(e, t) {
  return function(i, o = null) {
    ee(i) || (i = Ee({}, i)), o != null && !ye(o) && (o = null);
    const r = su(), s = /* @__PURE__ */ new WeakSet(), l = [];
    let a = !1;
    const d = r.app = {
      _uid: Sf++,
      _component: i,
      _props: o,
      _container: null,
      _context: r,
      _instance: null,
      version: Qf,
      get config() {
        return r.config;
      },
      set config(u) {
      },
      use(u, ...c) {
        return s.has(u) || (u && ee(u.install) ? (s.add(u), u.install(d, ...c)) : ee(u) && (s.add(u), u(d, ...c))), d;
      },
      mixin(u) {
        return r.mixins.includes(u) || r.mixins.push(u), d;
      },
      component(u, c) {
        return c ? (r.components[u] = c, d) : r.components[u];
      },
      directive(u, c) {
        return c ? (r.directives[u] = c, d) : r.directives[u];
      },
      mount(u, c, f) {
        if (!a) {
          const h = d._ceVNode || q(i, o);
          return h.appContext = r, f === !0 ? f = "svg" : f === !1 && (f = void 0), e(h, u, f), a = !0, d._container = u, u.__vue_app__ = d, Mo(h.component);
        }
      },
      onUnmount(u) {
        l.push(u);
      },
      unmount() {
        a && (dt(
          l,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(u, c) {
        return r.provides[u] = c, d;
      },
      runWithContext(u) {
        const c = Dn;
        Dn = d;
        try {
          return u();
        } finally {
          Dn = c;
        }
      }
    };
    return d;
  };
}
let Dn = null;
const Of = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${qe(t)}Modifiers`] || e[`${_n(t)}Modifiers`];
function xf(e, t, ...n) {
  if (e.isUnmounted) return;
  const i = e.vnode.props || xe;
  let o = n;
  const r = t.startsWith("update:"), s = r && Of(i, t.slice(7));
  s && (s.trim && (o = n.map((u) => _e(u) ? u.trim() : u)), s.number && (o = o.map(oc)));
  let l, a = i[l = Bo(t)] || // also try camelCase event handler (#2249)
  i[l = Bo(qe(t))];
  !a && r && (a = i[l = Bo(_n(t))]), a && dt(
    a,
    e,
    6,
    o
  );
  const d = i[l + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, dt(
      d,
      e,
      6,
      o
    );
  }
}
const If = /* @__PURE__ */ new WeakMap();
function lu(e, t, n = !1) {
  const i = n ? If : t.emitsCache, o = i.get(e);
  if (o !== void 0)
    return o;
  const r = e.emits;
  let s = {}, l = !1;
  if (!ee(e)) {
    const a = (d) => {
      const u = lu(d, t, !0);
      u && (l = !0, Ee(s, u));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !r && !l ? (ye(e) && i.set(e, null), null) : (Y(r) ? r.forEach((a) => s[a] = null) : Ee(s, r), ye(e) && i.set(e, s), s);
}
function Eo(e, t) {
  return !e || !wo(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), ve(e, t[0].toLowerCase() + t.slice(1)) || ve(e, _n(t)) || ve(e, t));
}
function Us(e) {
  const {
    type: t,
    vnode: n,
    proxy: i,
    withProxy: o,
    propsOptions: [r],
    slots: s,
    attrs: l,
    emit: a,
    render: d,
    renderCache: u,
    props: c,
    data: f,
    setupState: h,
    ctx: b,
    inheritAttrs: y
  } = e, w = co(e);
  let v, S;
  try {
    if (n.shapeFlag & 4) {
      const g = o || i, x = g;
      v = It(
        d.call(
          x,
          g,
          u,
          c,
          h,
          f,
          b
        )
      ), S = l;
    } else {
      const g = t;
      v = It(
        g.length > 1 ? g(
          c,
          { attrs: l, slots: s, emit: a }
        ) : g(
          c,
          null
        )
      ), S = t.props ? l : $f(l);
    }
  } catch (g) {
    Dt.length = 0, ko(g, e, 1), v = q(ze);
  }
  let $ = v;
  if (S && y !== !1) {
    const g = Object.keys(S), { shapeFlag: x } = $;
    g.length && x & 7 && (r && g.some(Oo) && (S = _f(
      S,
      r
    )), $ = nn($, S, !1, !0));
  }
  if (n.dirs && ($ = nn($, null, !1, !0), $.dirs = $.dirs ? $.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const g = To($.type) && fo($) || $;
    ci(g, n.transition);
  }
  return v = $, co(w), v;
}
const $f = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || wo(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, _f = (e, t) => {
  const n = {};
  for (const i in e)
    (!Oo(i) || !(i.slice(9) in t)) && (n[i] = e[i]);
  return n;
};
function Cf(e, t, n) {
  const { props: i, children: o, component: r } = e, { props: s, children: l, patchFlag: a } = t, d = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return i ? Ws(i, s, d) : !!s;
    if (a & 8) {
      const u = t.dynamicProps;
      for (let c = 0; c < u.length; c++) {
        const f = u[c];
        if (au(s, i, f) && !Eo(d, f))
          return !0;
      }
    }
  } else
    return (o || l) && (!l || !l.$stable) ? !0 : i === s ? !1 : i ? s ? Ws(i, s, d) : !0 : !!s;
  return !1;
}
function Ws(e, t, n) {
  const i = Object.keys(t);
  if (i.length !== Object.keys(e).length)
    return !0;
  for (let o = 0; o < i.length; o++) {
    const r = i[o];
    if (au(t, e, r) && !Eo(n, r))
      return !0;
  }
  return !1;
}
function au(e, t, n) {
  const i = e[n], o = t[n];
  return n === "style" && ye(i) && ye(o) ? !_o(i, o) : i !== o;
}
function kf({ vnode: e, parent: t, suspense: n }, i) {
  for (; t; ) {
    const o = t.subTree;
    if (o.suspense && o.suspense.activeBranch === e && (o.suspense.vnode.el = o.el = i, e = o), o === e)
      (e = t.vnode).el = i, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = i);
}
const uu = {}, du = () => Object.create(uu), cu = (e) => Object.getPrototypeOf(e) === uu;
function Tf(e, t, n, i = !1) {
  const o = {}, r = du();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), fu(e, t, o, r);
  for (const s in e.propsOptions[0])
    s in o || (o[s] = void 0);
  n ? e.props = i ? o : /* @__PURE__ */ Ac(o) : e.type.props ? e.props = o : e.props = r, e.attrs = r;
}
function Pf(e, t, n, i) {
  const {
    props: o,
    attrs: r,
    vnode: { patchFlag: s }
  } = e, l = /* @__PURE__ */ me(o), [a] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (i || s > 0) && !(s & 16)
  ) {
    if (s & 8) {
      const u = e.vnode.dynamicProps;
      for (let c = 0; c < u.length; c++) {
        let f = u[c];
        if (Eo(e.emitsOptions, f))
          continue;
        const h = t[f];
        if (a)
          if (ve(r, f))
            h !== r[f] && (r[f] = h, d = !0);
          else {
            const b = qe(f);
            o[b] = wr(
              a,
              l,
              b,
              h,
              e,
              !1
            );
          }
        else
          h !== r[f] && (r[f] = h, d = !0);
      }
    }
  } else {
    fu(e, t, o, r) && (d = !0);
    let u;
    for (const c in l)
      (!t || // for camelCase
      !ve(t, c) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = _n(c)) === c || !ve(t, u))) && (a ? n && // for camelCase
      (n[c] !== void 0 || // for kebab-case
      n[u] !== void 0) && (o[c] = wr(
        a,
        l,
        c,
        void 0,
        e,
        !0
      )) : delete o[c]);
    if (r !== l)
      for (const c in r)
        (!t || !ve(t, c)) && (delete r[c], d = !0);
  }
  d && Ft(e.attrs, "set", "");
}
function fu(e, t, n, i) {
  const [o, r] = e.propsOptions;
  let s = !1, l;
  if (t)
    for (let a in t) {
      if (ni(a))
        continue;
      const d = t[a];
      let u;
      o && ve(o, u = qe(a)) ? !r || !r.includes(u) ? n[u] = d : (l || (l = {}))[u] = d : Eo(e.emitsOptions, a) || (!(a in i) || d !== i[a]) && (i[a] = d, s = !0);
    }
  if (r) {
    const a = /* @__PURE__ */ me(n), d = l || xe;
    for (let u = 0; u < r.length; u++) {
      const c = r[u];
      n[c] = wr(
        o,
        a,
        c,
        d[c],
        e,
        !ve(d, c)
      );
    }
  }
  return s;
}
function wr(e, t, n, i, o, r) {
  const s = e[n];
  if (s != null) {
    const l = ve(s, "default");
    if (l && i === void 0) {
      const a = s.default;
      if (s.type !== Function && !s.skipFactory && ee(a)) {
        const { propsDefaults: d } = o;
        if (n in d)
          i = d[n];
        else {
          const u = Ni(o);
          i = d[n] = a.call(
            null,
            t
          ), u();
        }
      } else
        i = a;
      o.ce && o.ce._setProp(n, i);
    }
    s[
      0
      /* shouldCast */
    ] && (r && !l ? i = !1 : s[
      1
      /* shouldCastTrue */
    ] && (i === "" || i === _n(n)) && (i = !0));
  }
  return i;
}
const Lf = /* @__PURE__ */ new WeakMap();
function pu(e, t, n = !1) {
  const i = n ? Lf : t.propsCache, o = i.get(e);
  if (o)
    return o;
  const r = e.props, s = {}, l = [];
  let a = !1;
  if (!ee(e)) {
    const u = (c) => {
      a = !0;
      const [f, h] = pu(c, t, !0);
      Ee(s, f), h && l.push(...h);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!r && !a)
    return ye(e) && i.set(e, bn), bn;
  if (Y(r))
    for (let u = 0; u < r.length; u++) {
      const c = qe(r[u]);
      Gs(c) && (s[c] = xe);
    }
  else if (r)
    for (const u in r) {
      const c = qe(u);
      if (Gs(c)) {
        const f = r[u], h = s[c] = Y(f) || ee(f) ? { type: f } : Ee({}, f), b = h.type;
        let y = !1, w = !0;
        if (Y(b))
          for (let v = 0; v < b.length; ++v) {
            const S = b[v], $ = ee(S) && S.name;
            if ($ === "Boolean") {
              y = !0;
              break;
            } else $ === "String" && (w = !1);
          }
        else
          y = ee(b) && b.name === "Boolean";
        h[
          0
          /* shouldCast */
        ] = y, h[
          1
          /* shouldCastTrue */
        ] = w, (y || ve(h, "default")) && l.push(c);
      }
    }
  const d = [s, l];
  return ye(e) && i.set(e, d), d;
}
function Gs(e) {
  return e[0] !== "$" && !ni(e);
}
const ns = (e) => e === "_" || e === "_ctx" || e === "$stable", is = (e) => Y(e) ? e.map(It) : [It(e)], Ef = (e, t, n) => {
  if (t._n)
    return t;
  const i = Qe((...o) => is(t(...o)), n);
  return i._c = !1, i;
}, hu = (e, t, n) => {
  const i = e._ctx;
  for (const o in e) {
    if (ns(o)) continue;
    const r = e[o];
    if (ee(r))
      t[o] = Ef(o, r, i);
    else if (r != null) {
      const s = is(r);
      t[o] = () => s;
    }
  }
}, gu = (e, t) => {
  const n = is(t);
  e.slots.default = () => n;
}, mu = (e, t, n) => {
  for (const i in t)
    (n || !ns(i)) && (e[i] = t[i]);
}, Af = (e, t, n) => {
  const i = e.slots = du();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (mu(i, t, n), n && va(i, "_", o, !0)) : hu(t, i);
  } else t && gu(e, t);
}, Mf = (e, t, n) => {
  const { vnode: i, slots: o } = e;
  let r = !0, s = xe;
  if (i.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? r = !1 : mu(o, t, n) : (r = !t.$stable, hu(t, o)), s = t;
  } else t && (gu(e, t), s = { default: 1 });
  if (r)
    for (const l in o)
      !ns(l) && s[l] == null && delete o[l];
}, Ue = jf;
function Ff(e) {
  return Vf(e);
}
function Vf(e, t) {
  const n = $o();
  n.__VUE__ = !0;
  const {
    insert: i,
    remove: o,
    patchProp: r,
    createElement: s,
    createText: l,
    createComment: a,
    setText: d,
    setElementText: u,
    parentNode: c,
    nextSibling: f,
    setScopeId: h = kt,
    insertStaticContent: b
  } = e, y = (p, m, O, T = null, _ = null, k = null, F = void 0, M = null, A = !!m.dynamicChildren) => {
    if (p === m)
      return;
    p && !mn(p, m) && (T = Tn(p), Z(p, _, k, !0), p = null), m.patchFlag === -2 && (A = !1, m.dynamicChildren = null), m.dynamicChildren && p && p.dynamicChildren && p.dynamicChildren.hasOnce && (m.dynamicChildren === bn && (m.dynamicChildren = []), m.dynamicChildren.hasOnce = !0);
    const { type: C, ref: J, shapeFlag: R } = m;
    switch (C) {
      case Ao:
        w(p, m, O, T);
        break;
      case ze:
        v(p, m, O, T);
        break;
      case Zo:
        p == null && S(m, O, T, F);
        break;
      case ge:
        E(
          p,
          m,
          O,
          T,
          _,
          k,
          F,
          M,
          A
        );
        break;
      default:
        R & 1 ? x(
          p,
          m,
          O,
          T,
          _,
          k,
          F,
          M,
          A
        ) : R & 6 ? te(
          p,
          m,
          O,
          T,
          _,
          k,
          F,
          M,
          A
        ) : (R & 64 || R & 128) && C.process(
          p,
          m,
          O,
          T,
          _,
          k,
          F,
          M,
          A,
          sn
        );
    }
    J != null && _ ? ri(J, p && p.ref, k, m || p, !m) : J == null && p && p.ref != null && ri(p.ref, null, k, p, !0);
  }, w = (p, m, O, T) => {
    if (p == null)
      i(
        m.el = l(m.children),
        O,
        T
      );
    else {
      const _ = m.el = p.el;
      m.children !== p.children && d(_, m.children);
    }
  }, v = (p, m, O, T) => {
    p == null ? i(
      m.el = a(m.children || ""),
      O,
      T
    ) : m.el = p.el;
  }, S = (p, m, O, T) => {
    [p.el, p.anchor] = b(
      p.children,
      m,
      O,
      T,
      p.el,
      p.anchor
    );
  }, $ = ({ el: p, anchor: m }, O, T) => {
    let _;
    for (; p && p !== m; )
      _ = f(p), i(p, O, T), p = _;
    i(m, O, T);
  }, g = ({ el: p, anchor: m }) => {
    let O;
    for (; p && p !== m; )
      O = f(p), o(p), p = O;
    o(m);
  }, x = (p, m, O, T, _, k, F, M, A) => {
    if (m.type === "svg" ? F = "svg" : m.type === "math" && (F = "mathml"), p == null)
      D(
        m,
        O,
        T,
        _,
        k,
        F,
        M,
        A
      );
    else {
      const C = p.el && p.el._isVueCE ? p.el : null;
      try {
        C && C._beginPatch(), N(
          p,
          m,
          _,
          k,
          F,
          M,
          A
        );
      } finally {
        C && C._endPatch();
      }
    }
  }, D = (p, m, O, T, _, k, F, M) => {
    let A, C;
    const { props: J, shapeFlag: R, transition: W, dirs: Q } = p;
    if (A = p.el = s(
      p.type,
      k,
      J && J.is,
      J
    ), R & 8 ? u(A, p.children) : R & 16 && j(
      p.children,
      A,
      null,
      T,
      _,
      Yo(p, k),
      F,
      M
    ), Q && ln(p, null, T, "created"), L(A, p, p.scopeId, F, T), J) {
      for (const Oe in J)
        Oe !== "value" && !ni(Oe) && r(A, Oe, null, J[Oe], k, T);
      "value" in J && r(A, "value", null, J.value, k), (C = J.onVnodeBeforeMount) && St(C, T, p);
    }
    Q && ln(p, null, T, "beforeMount");
    const fe = Nf(_, W);
    fe && W.beforeEnter(A), i(A, m, O), ((C = J && J.onVnodeMounted) || fe || Q) && Ue(() => {
      C && St(C, T, p), fe && W.enter(A), Q && ln(p, null, T, "mounted");
    }, _);
  }, L = (p, m, O, T, _) => {
    if (O && h(p, O), T)
      for (let k = 0; k < T.length; k++)
        h(p, T[k]);
    if (_) {
      let k = _.subTree;
      if (m === k || yu(k.type) && (k.ssContent === m || k.ssFallback === m)) {
        const F = _.vnode;
        L(
          p,
          F,
          F.scopeId,
          F.slotScopeIds,
          _.parent
        );
      }
    }
  }, j = (p, m, O, T, _, k, F, M, A = 0) => {
    for (let C = A; C < p.length; C++) {
      const J = p[C] = M ? Mt(p[C]) : It(p[C]);
      y(
        null,
        J,
        m,
        O,
        T,
        _,
        k,
        F,
        M
      );
    }
  }, N = (p, m, O, T, _, k, F) => {
    const M = m.el = p.el;
    let { patchFlag: A, dynamicChildren: C, dirs: J } = m;
    A |= p.patchFlag & 16;
    const R = p.props || xe, W = m.props || xe;
    let Q;
    if (O && an(O, !1), (Q = W.onVnodeBeforeUpdate) && St(Q, O, m, p), J && ln(m, p, O, "beforeUpdate"), O && an(O, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    C && (!p.dynamicChildren || p.dynamicChildren.length !== C.length) && (A = 0, F = !1, C = null), (R.innerHTML && W.innerHTML == null || R.textContent && W.textContent == null) && u(M, ""), C ? G(
      p.dynamicChildren,
      C,
      M,
      O,
      T,
      Yo(m, _),
      k
    ) : F || le(
      p,
      m,
      M,
      null,
      O,
      T,
      Yo(m, _),
      k,
      !1
    ), A > 0) {
      if (A & 16)
        U(M, R, W, O, _);
      else if (A & 2 && R.class !== W.class && r(M, "class", null, W.class, _), A & 4 && r(M, "style", R.style, W.style, _), A & 8) {
        const fe = m.dynamicProps;
        for (let Oe = 0; Oe < fe.length; Oe++) {
          const Se = fe[Oe], Pe = R[Se], Ae = W[Se];
          (Ae !== Pe || Se === "value") && r(M, Se, Pe, Ae, _, O);
        }
      }
      A & 1 && p.children !== m.children && u(M, m.children);
    } else !F && C == null && U(M, R, W, O, _);
    ((Q = W.onVnodeUpdated) || J) && Ue(() => {
      Q && St(Q, O, m, p), J && ln(m, p, O, "updated");
    }, T);
  }, G = (p, m, O, T, _, k, F) => {
    for (let M = 0; M < m.length; M++) {
      const A = p[M], C = m[M], J = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        A.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (A.type === ge || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !mn(A, C) || // - In the case of a component, it could contain anything.
        A.shapeFlag & 198) ? c(A.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          O
        )
      );
      y(
        A,
        C,
        J,
        null,
        T,
        _,
        k,
        F,
        !0
      );
    }
  }, U = (p, m, O, T, _) => {
    if (m !== O) {
      if (m !== xe)
        for (const k in m)
          !ni(k) && !(k in O) && r(
            p,
            k,
            m[k],
            null,
            _,
            T
          );
      for (const k in O) {
        if (ni(k)) continue;
        const F = O[k], M = m[k];
        F !== M && k !== "value" && r(p, k, M, F, _, T);
      }
      "value" in O && r(p, "value", m.value, O.value, _);
    }
  }, E = (p, m, O, T, _, k, F, M, A) => {
    const C = m.el = p ? p.el : l(""), J = m.anchor = p ? p.anchor : l("");
    let { patchFlag: R, dynamicChildren: W, slotScopeIds: Q } = m;
    Q && (M = M ? M.concat(Q) : Q), p == null ? (i(C, O, T), i(J, O, T), j(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      m.children || [],
      O,
      J,
      _,
      k,
      F,
      M,
      A
    )) : R > 0 && R & 64 && W && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    p.dynamicChildren && p.dynamicChildren.length === W.length ? (G(
      p.dynamicChildren,
      W,
      O,
      _,
      k,
      F,
      M
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (m.key != null || _ && m === _.subTree) && os(
      p,
      m,
      !0
      /* shallow */
    )) : le(
      p,
      m,
      O,
      J,
      _,
      k,
      F,
      M,
      A
    );
  }, te = (p, m, O, T, _, k, F, M, A) => {
    m.slotScopeIds = M, p == null ? m.shapeFlag & 512 ? _.ctx.activate(
      m,
      O,
      T,
      F,
      A
    ) : X(
      m,
      O,
      T,
      _,
      k,
      F,
      A
    ) : ce(p, m, A);
  }, X = (p, m, O, T, _, k, F) => {
    const M = p.component = Hf(
      p,
      T,
      _
    );
    if (Po(p) && (M.ctx.renderer = sn), Uf(M, !1, F), M.asyncDep) {
      if (_ && _.registerDep(M, se, F), !p.el) {
        const A = M.subTree = q(ze);
        v(null, A, m, O), p.placeholder = A.el;
      }
    } else
      se(
        M,
        p,
        m,
        O,
        _,
        k,
        F
      );
  }, ce = (p, m, O) => {
    const T = m.component = p.component;
    if (Cf(p, m, O))
      if (T.asyncDep && !T.asyncResolved) {
        m.el = p.el, ne(T, m, O);
        return;
      } else
        T.next = m, T.update();
    else
      m.el = p.el, T.vnode = m;
  }, se = (p, m, O, T, _, k, F) => {
    const M = () => {
      if (p.isMounted) {
        let { next: R, bu: W, u: Q, parent: fe, vnode: Oe } = p;
        {
          const vt = bu(p);
          if (vt) {
            R && (R.el = Oe.el, ne(p, R, F)), vt.asyncDep.then(() => {
              Ue(() => {
                p.isUnmounted || C();
              }, _);
            });
            return;
          }
        }
        let Se = R, Pe;
        an(p, !1), R ? (R.el = Oe.el, ne(p, R, F)) : R = Oe, W && Ko(W), (Pe = R.props && R.props.onVnodeBeforeUpdate) && St(Pe, fe, R, Oe), an(p, !0);
        const Ae = Us(p), bt = p.subTree;
        p.subTree = Ae, y(
          bt,
          Ae,
          // parent may have changed if it's in a teleport
          c(bt.el),
          // anchor may have changed if it's in a fragment
          Tn(bt),
          p,
          _,
          k
        ), R.el = Ae.el, Se === null && kf(p, Ae.el), Q && Ue(Q, _), (Pe = R.props && R.props.onVnodeUpdated) && Ue(
          () => St(Pe, fe, R, Oe),
          _
        );
      } else {
        let R;
        const { el: W, props: Q } = m, { bm: fe, m: Oe, parent: Se, root: Pe, type: Ae } = p, bt = Nn(m);
        an(p, !1), fe && Ko(fe), !bt && (R = Q && Q.onVnodeBeforeMount) && St(R, Se, m), an(p, !0);
        {
          Pe.ce && Pe.ce._hasShadowRoot() && Pe.ce._injectChildStyle(
            Ae,
            p.parent ? p.parent.type : void 0
          );
          const vt = p.subTree = Us(p);
          y(
            null,
            vt,
            O,
            T,
            p,
            _,
            k
          ), m.el = vt.el;
        }
        if (Oe && Ue(Oe, _), !bt && (R = Q && Q.onVnodeMounted)) {
          const vt = m;
          Ue(
            () => St(R, Se, vt),
            _
          );
        }
        (m.shapeFlag & 256 || Se && Nn(Se.vnode) && Se.vnode.shapeFlag & 256) && p.a && Ue(p.a, _), p.isMounted = !0, m = O = T = null;
      }
    };
    p.scope.on();
    const A = p.effect = new xa(M);
    p.scope.off();
    const C = p.update = A.run.bind(A), J = p.job = A.runIfDirty.bind(A);
    J.i = p, J.id = p.uid, A.scheduler = () => Zr(J), an(p, !0), C();
  }, ne = (p, m, O) => {
    m.component = p;
    const T = p.vnode.props;
    p.vnode = m, p.next = null, Pf(p, m.props, T, O), Mf(p, m.children, O), Rt(), Fs(p), zt();
  }, le = (p, m, O, T, _, k, F, M, A = !1) => {
    const C = p && p.children, J = p ? p.shapeFlag : 0, R = m.children, { patchFlag: W, shapeFlag: Q } = m;
    if (W > 0) {
      if (W & 128) {
        z(
          C,
          R,
          O,
          T,
          _,
          k,
          F,
          M,
          A
        );
        return;
      } else if (W & 256) {
        Te(
          C,
          R,
          O,
          T,
          _,
          k,
          F,
          M,
          A
        );
        return;
      }
    }
    Q & 8 ? (J & 16 && Ht(C, _, k), R !== C && u(O, R)) : J & 16 ? Q & 16 ? z(
      C,
      R,
      O,
      T,
      _,
      k,
      F,
      M,
      A
    ) : Ht(C, _, k, !0) : (J & 8 && u(O, ""), Q & 16 && j(
      R,
      O,
      T,
      _,
      k,
      F,
      M,
      A
    ));
  }, Te = (p, m, O, T, _, k, F, M, A) => {
    p = p || bn, m = m || bn;
    const C = p.length, J = m.length, R = Math.min(C, J);
    let W;
    for (W = 0; W < R; W++) {
      const Q = m[W] = A ? Mt(m[W]) : It(m[W]);
      y(
        p[W],
        Q,
        O,
        null,
        _,
        k,
        F,
        M,
        A
      );
    }
    C > J ? Ht(
      p,
      _,
      k,
      !0,
      !1,
      R
    ) : j(
      m,
      O,
      T,
      _,
      k,
      F,
      M,
      A,
      R
    );
  }, z = (p, m, O, T, _, k, F, M, A) => {
    let C = 0;
    const J = m.length;
    let R = p.length - 1, W = J - 1;
    for (; C <= R && C <= W; ) {
      const Q = p[C], fe = m[C] = A ? Mt(m[C]) : It(m[C]);
      if (mn(Q, fe))
        y(
          Q,
          fe,
          O,
          null,
          _,
          k,
          F,
          M,
          A
        );
      else
        break;
      C++;
    }
    for (; C <= R && C <= W; ) {
      const Q = p[R], fe = m[W] = A ? Mt(m[W]) : It(m[W]);
      if (mn(Q, fe))
        y(
          Q,
          fe,
          O,
          null,
          _,
          k,
          F,
          M,
          A
        );
      else
        break;
      R--, W--;
    }
    if (C > R) {
      if (C <= W) {
        const Q = W + 1, fe = Q < J ? m[Q].el : T;
        for (; C <= W; )
          y(
            null,
            m[C] = A ? Mt(m[C]) : It(m[C]),
            O,
            fe,
            _,
            k,
            F,
            M,
            A
          ), C++;
      }
    } else if (C > W)
      for (; C <= R; )
        Z(p[C], _, k, !0), C++;
    else {
      const Q = C, fe = C, Oe = /* @__PURE__ */ new Map();
      for (C = fe; C <= W; C++) {
        const Ze = m[C] = A ? Mt(m[C]) : It(m[C]);
        Ze.key != null && Oe.set(Ze.key, C);
      }
      let Se, Pe = 0;
      const Ae = W - fe + 1;
      let bt = !1, vt = 0;
      const Hn = new Array(Ae);
      for (C = 0; C < Ae; C++) Hn[C] = 0;
      for (C = Q; C <= R; C++) {
        const Ze = p[C];
        if (Pe >= Ae) {
          Z(Ze, _, k, !0);
          continue;
        }
        let yt;
        if (Ze.key != null)
          yt = Oe.get(Ze.key);
        else
          for (Se = fe; Se <= W; Se++)
            if (Hn[Se - fe] === 0 && mn(Ze, m[Se])) {
              yt = Se;
              break;
            }
        yt === void 0 ? Z(Ze, _, k, !0) : (Hn[yt - fe] = C + 1, yt >= vt ? vt = yt : bt = !0, y(
          Ze,
          m[yt],
          O,
          null,
          _,
          k,
          F,
          M,
          A
        ), Pe++);
      }
      const ys = bt ? Df(Hn) : bn;
      for (Se = ys.length - 1, C = Ae - 1; C >= 0; C--) {
        const Ze = fe + C, yt = m[Ze], Ss = m[Ze + 1], ws = Ze + 1 < J ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Ss.el || vu(Ss)
        ) : T;
        Hn[C] === 0 ? y(
          null,
          yt,
          O,
          ws,
          _,
          k,
          F,
          M,
          A
        ) : bt && (Se < 0 || C !== ys[Se] ? H(yt, O, ws, 2) : Se--);
      }
    }
  }, H = (p, m, O, T, _ = null) => {
    const { el: k, type: F, transition: M, children: A, shapeFlag: C } = p;
    if (C & 6) {
      H(p.component.subTree, m, O, T);
      return;
    }
    if (C & 128) {
      p.suspense.move(m, O, T);
      return;
    }
    if (C & 64) {
      F.move(p, m, O, sn);
      return;
    }
    if (F === ge) {
      i(k, m, O);
      for (let R = 0; R < A.length; R++)
        H(A[R], m, O, T);
      i(p.anchor, m, O);
      return;
    }
    if (F === Zo) {
      $(p, m, O);
      return;
    }
    if (T !== 2 && C & 1 && M)
      if (T === 0)
        M.persisted && !k[ot] ? i(k, m, O) : (M.beforeEnter(k), i(k, m, O), Ue(() => M.enter(k), _));
      else {
        const { leave: R, delayLeave: W, afterLeave: Q } = M, fe = () => {
          p.ctx.isUnmounted ? o(k) : i(k, m, O);
        }, Oe = () => {
          const Se = k._isLeaving || !!k[ot];
          k._isLeaving && k[ot](
            !0
            /* cancelled */
          ), M.persisted && !Se ? fe() : R(k, () => {
            fe(), Q && Q();
          });
        };
        W ? W(k, fe, Oe) : Oe();
      }
    else
      i(k, m, O);
  }, Z = (p, m, O, T = !1, _ = !1) => {
    const {
      type: k,
      props: F,
      ref: M,
      children: A,
      dynamicChildren: C,
      shapeFlag: J,
      patchFlag: R,
      dirs: W,
      cacheIndex: Q,
      memo: fe
    } = p;
    if ((R === -2 || C && C.hasOnce) && (_ = !1), M != null && (Rt(), ri(M, null, O, p, !0), zt()), Q != null && (!p.ctx || p.ctx === m) && (m.renderCache[Q] = void 0), J & 256) {
      m.ctx.deactivate(p);
      return;
    }
    const Oe = J & 1 && W, Se = !Nn(p);
    let Pe;
    if (Se && (Pe = F && F.onVnodeBeforeUnmount) && St(Pe, m, p), J & 6)
      Ri(p.component, O, T);
    else {
      if (J & 128) {
        p.suspense.unmount(O, T);
        return;
      }
      Oe && ln(p, null, m, "beforeUnmount"), J & 64 ? p.type.remove(
        p,
        m,
        O,
        sn,
        T
      ) : C && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !C.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (k !== ge || R > 0 && R & 64) ? Ht(
        C,
        m,
        O,
        !1,
        !0
      ) : (k === ge && R & 384 || !_ && J & 16) && Ht(A, m, O), T && De(p);
    }
    const Ae = fe != null && Q == null;
    (Se && (Pe = F && F.onVnodeUnmounted) || Oe || Ae) && Ue(() => {
      Pe && St(Pe, m, p), Oe && ln(p, null, m, "unmounted"), Ae && (p.el = null);
    }, O);
  }, De = (p) => {
    const { type: m, el: O, anchor: T, transition: _ } = p;
    if (m === ge) {
      Kt(O, T);
      return;
    }
    if (m === Zo) {
      g(p), _ && !_.persisted && _.afterLeave && _.afterLeave();
      return;
    }
    const k = () => {
      o(O), _ && !_.persisted && _.afterLeave && _.afterLeave();
    };
    if (p.shapeFlag & 1 && _ && !_.persisted) {
      const { leave: F, delayLeave: M } = _, A = () => F(O, k);
      M ? M(p.el, k, A) : A();
    } else
      k();
  }, Kt = (p, m) => {
    let O;
    for (; p !== m; )
      O = f(p), o(p), p = O;
    o(m);
  }, Ri = (p, m, O) => {
    const { bum: T, scope: _, job: k, subTree: F, um: M, m: A, a: C } = p;
    qs(A), qs(C), T && Ko(T), _.stop(), k ? (k.flags |= 8, Z(F, p, m, O)) : p.vnode.el && F && (F.transition = p.vnode.transition, Z(F, p, m, O)), M && Ue(M, m), Ue(() => {
      p.isUnmounted = !0;
    }, m);
  }, Ht = (p, m, O, T = !1, _ = !1, k = 0) => {
    for (let F = k; F < p.length; F++)
      Z(p[F], m, O, T, _);
  }, Tn = (p) => {
    if (p.shapeFlag & 6)
      return Tn(p.component.subTree);
    if (p.shapeFlag & 128)
      return p.suspense.next();
    const m = f(p.anchor || p.el), O = m && m[Wa];
    return O ? f(O) : m;
  };
  let Kn = !1;
  const zi = (p, m, O) => {
    let T;
    p == null ? m._vnode && (Z(m._vnode, null, null, !0), T = m._vnode.component) : y(
      m._vnode || null,
      p,
      m,
      null,
      null,
      null,
      O
    ), m._vnode = p, Kn || (Kn = !0, Fs(T), za(), Kn = !1);
  }, sn = {
    p: y,
    um: Z,
    m: H,
    r: De,
    mt: X,
    mc: j,
    pc: le,
    pbc: G,
    n: Tn,
    o: e
  };
  return {
    render: zi,
    hydrate: void 0,
    createApp: wf(zi)
  };
}
function Yo({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function an({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Nf(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function os(e, t, n = !1) {
  const i = e.children, o = t.children;
  if (Y(i) && Y(o))
    for (let r = 0; r < i.length; r++) {
      const s = i[r];
      let l = o[r];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = o[r] = Mt(o[r]), l.el = s.el), !n && l.patchFlag !== -2 && os(s, l)), l.type === Ao && (l.patchFlag === -1 && (l = o[r] = Mt(l)), l.el = s.el), l.type === ze && !l.el && (l.el = s.el);
    }
}
function Df(e) {
  const t = e.slice(), n = [0];
  let i, o, r, s, l;
  const a = e.length;
  for (i = 0; i < a; i++) {
    const d = e[i];
    if (d !== 0) {
      if (o = n[n.length - 1], e[o] < d) {
        t[i] = o, n.push(i);
        continue;
      }
      for (r = 0, s = n.length - 1; r < s; )
        l = r + s >> 1, e[n[l]] < d ? r = l + 1 : s = l;
      d < e[n[r]] && (r > 0 && (t[i] = n[r - 1]), n[r] = i);
    }
  }
  for (r = n.length, s = n[r - 1]; r-- > 0; )
    n[r] = s, s = t[s];
  return n;
}
function bu(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : bu(t);
}
function qs(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function vu(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? vu(t.subTree) : null;
}
const yu = (e) => e.__isSuspense;
function jf(e, t) {
  t && t.pendingBranch ? Y(e) ? t.effects.push(...e) : t.effects.push(e) : Kc(e);
}
const ge = /* @__PURE__ */ Symbol.for("v-fgt"), Ao = /* @__PURE__ */ Symbol.for("v-txt"), ze = /* @__PURE__ */ Symbol.for("v-cmt"), Zo = /* @__PURE__ */ Symbol.for("v-stc"), Dt = [];
let et = null;
function I(e = !1) {
  Dt.push(et = e ? null : []);
}
function rs() {
  Dt.pop(), et = Dt[Dt.length - 1] || null;
}
let fi = 1;
function go(e, t = !1) {
  fi += e, e < 0 && et && t && (et.hasOnce = !0);
}
function Su(e) {
  return e.dynamicChildren = fi > 0 ? et || bn : null, rs(), fi > 0 && et && et.push(e), e;
}
function P(e, t, n, i, o, r) {
  return Su(
    K(
      e,
      t,
      n,
      i,
      o,
      r,
      !0
    )
  );
}
function ke(e, t, n, i, o) {
  return Su(
    q(
      e,
      t,
      n,
      i,
      o,
      !0
    )
  );
}
function pi(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function mn(e, t) {
  return e.type === t.type && e.key === t.key;
}
const wu = ({ key: e }) => e ?? null, eo = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? _e(e) || /* @__PURE__ */ Ke(e) || ee(e) ? { i: Ne, r: e, k: t, f: !!n } : e : null);
function K(e, t = null, n = null, i = 0, o = null, r = e === ge ? 0 : 1, s = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && wu(t),
    ref: t && eo(t),
    scopeId: Ka,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: i,
    dynamicProps: o,
    dynamicChildren: null,
    appContext: null,
    ctx: Ne
  };
  return l ? (mo(a, n), r & 128 && e.normalize(a)) : n && (a.shapeFlag |= _e(n) ? 8 : 16), fi > 0 && // avoid a block node from tracking itself
  !s && // has current parent block
  et && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && et.push(a), a;
}
const q = Rf;
function Rf(e, t = null, n = null, i = 0, o = null, r = !1) {
  if ((!e || e === tu) && (e = ze), pi(e)) {
    const l = nn(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && mo(l, n), fi > 0 && !r && et && (l.shapeFlag & 6 ? et[et.indexOf(e)] = l : et.push(l)), l.patchFlag = -2, l;
  }
  if (Yf(e) && (e = e.__vccOpts), t) {
    t = zf(t);
    let { class: l, style: a } = t;
    l && !_e(l) && (t.class = st(l)), ye(a) && (/* @__PURE__ */ Jr(a) && !Y(a) && (a = Ee({}, a)), t.style = On(a));
  }
  const s = _e(e) ? 1 : yu(e) ? 128 : To(e) ? 64 : ye(e) ? 4 : ee(e) ? 2 : 0;
  return K(
    e,
    t,
    n,
    i,
    o,
    s,
    r,
    !0
  );
}
function zf(e) {
  return e ? /* @__PURE__ */ Jr(e) || cu(e) ? Ee({}, e) : e : null;
}
function nn(e, t, n = !1, i = !1) {
  const { props: o, ref: r, patchFlag: s, children: l, transition: a } = e, d = t ? V(o || {}, t) : o, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && wu(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? Y(r) ? r.concat(eo(t)) : [r, eo(t)] : eo(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== ge ? s === -1 ? 16 : s | 16 : s,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && nn(e.ssContent),
    ssFallback: e.ssFallback && nn(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return a && i && ci(
    u,
    a.clone(u)
  ), u;
}
function Nt(e = " ", t = 0) {
  return q(Ao, null, e, t);
}
function re(e = "", t = !1) {
  return t ? (I(), ke(ze, null, e)) : q(ze, null, e);
}
function It(e) {
  return e == null || typeof e == "boolean" ? q(ze) : Y(e) ? q(
    ge,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : pi(e) ? Mt(e) : q(Ao, null, String(e));
}
function Mt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : nn(e);
}
function mo(e, t) {
  let n = 0;
  const { shapeFlag: i } = e;
  if (t == null)
    t = null;
  else if (Y(t))
    n = 16;
  else if (typeof t == "object")
    if (i & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), mo(e, o()), o._c && (o._d = !0));
      return;
    } else {
      n = 32;
      const o = t._;
      !o && !cu(t) ? t._ctx = Ne : o === 3 && Ne && (Ne.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (ee(t)) {
    if (i & 65) {
      mo(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ne }, n = 32;
  } else
    t = String(t), i & 64 ? (n = 16, t = [Nt(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function V(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    for (const o in i)
      if (o === "class")
        t.class !== i.class && (t.class = st([t.class, i.class]));
      else if (o === "style")
        t.style = On([t.style, i.style]);
      else if (wo(o)) {
        const r = t[o], s = i[o];
        s && r !== s && !(Y(r) && r.includes(s)) ? t[o] = r ? [].concat(r, s) : s : s == null && r == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Oo(o) && (t[o] = s);
      } else o !== "" && (t[o] = i[o]);
  }
  return t;
}
function St(e, t, n, i = null) {
  dt(e, t, 7, [
    n,
    i
  ]);
}
const Bf = su();
let Kf = 0;
function Hf(e, t, n) {
  const i = e.type, o = (t ? t.appContext : e.appContext) || Bf, r = {
    uid: Kf++,
    vnode: e,
    type: i,
    parent: t,
    appContext: o,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new hc(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(o.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: pu(i, o),
    emitsOptions: lu(i, o),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: xe,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: xe,
    data: xe,
    props: xe,
    attrs: xe,
    slots: xe,
    refs: xe,
    setupState: xe,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = xf.bind(null, r), e.ce && e.ce(r), r;
}
let Be = null;
const hi = () => Be || Ne;
let bo, gi;
{
  const e = $o(), t = (n, i) => {
    let o;
    return (o = e[n]) || (o = e[n] = []), o.push(i), (r) => {
      o.length > 1 ? o.forEach((s) => s(r)) : o[0](r);
    };
  };
  bo = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Be = n
  ), gi = t(
    "__VUE_SSR_SETTERS__",
    (n) => mi = n
  );
}
const Ni = (e) => {
  const t = Be;
  return bo(e), e.scope.on(), () => {
    e.scope.off(), bo(t);
  };
}, Js = () => {
  Be && Be.scope.off(), bo(null);
};
function Ou(e) {
  return e.vnode.shapeFlag & 4;
}
let mi = !1;
function Uf(e, t = !1, n = !1) {
  t && gi(t);
  const { props: i, children: o } = e.vnode, r = Ou(e);
  Tf(e, i, r, t), Af(e, o, n || t);
  const s = r ? Wf(e, t) : void 0;
  return t && gi(!1), s;
}
function Wf(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, hf);
  const { setup: i } = n;
  if (i) {
    Rt();
    const o = e.setupContext = i.length > 1 ? qf(e) : null, r = Ni(e), s = Fi(
      i,
      e,
      0,
      [
        e.props,
        o
      ]
    ), l = ga(s);
    if (zt(), r(), (l || e.sp) && !Nn(e) && Qa(e), l) {
      if (s.then(Js, Js), t)
        return s.then((a) => {
          gi(!0);
          try {
            Ys(e, a, t);
          } finally {
            gi(!1);
          }
        }).catch((a) => {
          ko(a, e, 0);
        });
      e.asyncDep = s;
    } else
      Ys(e, s);
  } else
    xu(e);
}
function Ys(e, t, n) {
  ee(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : ye(t) && (e.setupState = Da(t)), xu(e);
}
function xu(e, t, n) {
  const i = e.type;
  e.render || (e.render = i.render || kt);
  {
    const o = Ni(e);
    Rt();
    try {
      gf(e);
    } finally {
      zt(), o();
    }
  }
}
const Gf = {
  get(e, t) {
    return Re(e, "get", ""), e[t];
  }
};
function qf(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Gf),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Mo(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Da(Mc(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in si)
        return si[n](e);
    },
    has(t, n) {
      return n in t || n in si;
    }
  })) : e.proxy;
}
function Jf(e, t = !0) {
  return ee(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Yf(e) {
  return ee(e) && "__vccOpts" in e;
}
const $e = (e, t) => /* @__PURE__ */ Dc(e, t, mi);
function Zf(e, t, n) {
  try {
    go(-1);
    const i = arguments.length;
    return i === 2 ? ye(t) && !Y(t) ? pi(t) ? q(e, null, [t]) : q(e, t) : q(e, null, t) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && pi(n) && (n = [n]), q(e, t, n));
  } finally {
    go(1);
  }
}
const Qf = "3.5.43";
let Or;
const Zs = typeof window < "u" && window.trustedTypes;
if (Zs)
  try {
    Or = /* @__PURE__ */ Zs.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Iu = Or ? (e) => Or.createHTML(e) : (e) => e, Xf = "http://www.w3.org/2000/svg", ep = "http://www.w3.org/1998/Math/MathML", At = typeof document < "u" ? document : null, Qs = At && /* @__PURE__ */ At.createElement("template"), tp = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, i) => {
    const o = t === "svg" ? At.createElementNS(Xf, e) : t === "mathml" ? At.createElementNS(ep, e) : n ? At.createElement(e, { is: n }) : At.createElement(e);
    return e === "select" && i && i.multiple != null && o.setAttribute("multiple", i.multiple), o;
  },
  createText: (e) => At.createTextNode(e),
  createComment: (e) => At.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => At.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, i, o, r) {
    const s = n ? n.previousSibling : t.lastChild;
    if (o && (o === r || o.nextSibling))
      for (; t.insertBefore(o.cloneNode(!0), n), !(o === r || !(o = o.nextSibling)); )
        ;
    else {
      Qs.innerHTML = Iu(
        i === "svg" ? `<svg>${e}</svg>` : i === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Qs.content;
      if (i === "svg" || i === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      s ? s.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Ut = "transition", Gn = "animation", bi = /* @__PURE__ */ Symbol("_vtc"), $u = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
}, np = /* @__PURE__ */ Ee(
  {},
  Ga,
  $u
), ip = (e) => (e.displayName = "Transition", e.props = np, e), op = /* @__PURE__ */ ip(
  (e, { slots: t }) => Zf(ef, rp(e), t)
), un = (e, t = []) => {
  Y(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Xs = (e) => e ? Y(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function rp(e) {
  const t = {};
  for (const E in e)
    E in $u || (t[E] = e[E]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: i,
    duration: o,
    enterFromClass: r = `${n}-enter-from`,
    enterActiveClass: s = `${n}-enter-active`,
    enterToClass: l = `${n}-enter-to`,
    appearFromClass: a = r,
    appearActiveClass: d = s,
    appearToClass: u = l,
    leaveFromClass: c = `${n}-leave-from`,
    leaveActiveClass: f = `${n}-leave-active`,
    leaveToClass: h = `${n}-leave-to`
  } = e, b = sp(o), y = b && b[0], w = b && b[1], {
    onBeforeEnter: v,
    onEnter: S,
    onEnterCancelled: $,
    onLeave: g,
    onLeaveCancelled: x,
    onBeforeAppear: D = v,
    onAppear: L = S,
    onAppearCancelled: j = $
  } = t, N = (E, te, X, ce) => {
    E._enterCancelled = ce, dn(E, te ? u : l), dn(E, te ? d : s), X && X();
  }, G = (E, te) => {
    E._isLeaving = !1, dn(E, c), dn(E, h), dn(E, f), te && te();
  }, U = (E) => (te, X) => {
    const ce = E ? L : S, se = () => N(te, E, X);
    un(ce, [te, se]), el(() => {
      dn(te, E ? a : r), Et(te, E ? u : l), Xs(ce) || tl(te, i, y, se);
    });
  };
  return Ee(t, {
    onBeforeEnter(E) {
      un(v, [E]), Et(E, r), Et(E, s);
    },
    onBeforeAppear(E) {
      un(D, [E]), Et(E, a), Et(E, d);
    },
    onEnter: U(!1),
    onAppear: U(!0),
    onLeave(E, te) {
      E._isLeaving = !0;
      const X = () => G(E, te);
      Et(E, c), E._enterCancelled ? (Et(E, f), ol(E)) : (ol(E), Et(E, f)), el(() => {
        E._isLeaving && (dn(E, c), Et(E, h), Xs(g) || tl(E, i, w, X));
      }), un(g, [E, X]);
    },
    onEnterCancelled(E) {
      N(E, !1, void 0, !0), un($, [E]);
    },
    onAppearCancelled(E) {
      N(E, !0, void 0, !0), un(j, [E]);
    },
    onLeaveCancelled(E) {
      G(E), un(x, [E]);
    }
  });
}
function sp(e) {
  if (e == null)
    return null;
  if (ye(e))
    return [Qo(e.enter), Qo(e.leave)];
  {
    const t = Qo(e);
    return [t, t];
  }
}
function Qo(e) {
  return rc(e);
}
function Et(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[bi] || (e[bi] = /* @__PURE__ */ new Set())).add(t);
}
function dn(e, t) {
  t.split(/\s+/).forEach((i) => i && e.classList.remove(i));
  const n = e[bi];
  n && (n.delete(t), n.size || (e[bi] = void 0));
}
function el(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let lp = 0;
function tl(e, t, n, i) {
  const o = e._endId = ++lp, r = () => {
    o === e._endId && i();
  };
  if (n != null)
    return setTimeout(r, n);
  const { type: s, timeout: l, propCount: a } = ap(e, t);
  if (!s)
    return i();
  const d = s + "end";
  let u = 0;
  const c = () => {
    e.removeEventListener(d, f), r();
  }, f = (h) => {
    h.target === e && ++u >= a && c();
  };
  setTimeout(() => {
    u < a && c();
  }, l + 1), e.addEventListener(d, f);
}
function ap(e, t) {
  const n = window.getComputedStyle(e), i = (b) => (n[b] || "").split(", "), o = i(`${Ut}Delay`), r = i(`${Ut}Duration`), s = nl(o, r), l = i(`${Gn}Delay`), a = i(`${Gn}Duration`), d = nl(l, a);
  let u = null, c = 0, f = 0;
  t === Ut ? s > 0 && (u = Ut, c = s, f = r.length) : t === Gn ? d > 0 && (u = Gn, c = d, f = a.length) : (c = Math.max(s, d), u = c > 0 ? s > d ? Ut : Gn : null, f = u ? u === Ut ? r.length : a.length : 0);
  const h = u === Ut && /\b(?:transform|all)(?:,|$)/.test(
    i(`${Ut}Property`).toString()
  );
  return {
    type: u,
    timeout: c,
    propCount: f,
    hasTransform: h
  };
}
function nl(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, i) => il(n) + il(e[i])));
}
function il(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function ol(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function up(e, t, n) {
  const i = e[bi];
  i && (t = (t ? [t, ...i] : [...i]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const rl = /* @__PURE__ */ Symbol("_vod"), dp = /* @__PURE__ */ Symbol("_vsh"), cp = /* @__PURE__ */ Symbol(""), fp = /(?:^|;)\s*display\s*:/;
function pp(e, t, n) {
  const i = e.style, o = _e(n);
  let r = !1;
  if (n && !o) {
    if (t)
      if (_e(t))
        for (const s of t.split(";")) {
          const l = s.slice(0, s.indexOf(":")).trim();
          n[l] == null && Xn(i, l, "");
        }
      else
        for (const s in t)
          n[s] == null && Xn(i, s, "");
    for (const s in n) {
      s === "display" && (r = !0);
      const l = n[s];
      l != null ? gp(
        e,
        s,
        !_e(t) && t ? t[s] : void 0,
        l
      ) || Xn(i, s, l) : Xn(i, s, "");
    }
  } else if (o) {
    if (t !== n) {
      const s = i[cp];
      s && (n += ";" + s), i.cssText = n, r = fp.test(n);
    }
  } else t && e.removeAttribute("style");
  rl in e && (e[rl] = r ? i.display : "", e[dp] && (i.display = "none"));
}
const qi = /\s*!important$/;
function Xn(e, t, n) {
  if (Y(n))
    n.forEach((i) => Xn(e, t, i));
  else if (n == null && (n = ""), t.startsWith("--"))
    qi.test(n) ? e.setProperty(t, n.replace(qi, ""), "important") : e.setProperty(t, n);
  else {
    const i = hp(e, t);
    qi.test(n) ? e.setProperty(
      _n(i),
      n.replace(qi, ""),
      "important"
    ) : e[i] = n;
  }
}
const sl = ["Webkit", "Moz", "ms"], Xo = {};
function hp(e, t) {
  const n = Xo[t];
  if (n)
    return n;
  let i = qe(t);
  if (i !== "filter" && i in e)
    return Xo[t] = i;
  i = Io(i);
  for (let o = 0; o < sl.length; o++) {
    const r = sl[o] + i;
    if (r in e)
      return Xo[t] = r;
  }
  return t;
}
function gp(e, t, n, i) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && _e(i) && n === i;
}
const ll = "http://www.w3.org/1999/xlink";
function al(e, t, n, i, o, r = cc(t)) {
  i && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ll, t.slice(6, t.length)) : e.setAttributeNS(ll, t, n) : n == null || r && !Sa(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : mt(n) ? String(n) : n
  );
}
function ul(e, t, n, i, o) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Iu(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const l = r === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== a || !("_value" in e)) && (e.value = a), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let s = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = Sa(n) : n == null && l === "string" ? (n = "", s = !0) : l === "number" && (n = 0, s = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  s && e.removeAttribute(o || t);
}
function mp(e, t, n, i) {
  e.addEventListener(t, n, i);
}
function bp(e, t, n, i) {
  e.removeEventListener(t, n, i);
}
const dl = /* @__PURE__ */ Symbol("_vei");
function vp(e, t, n, i, o = null) {
  const r = e[dl] || (e[dl] = {}), s = r[t];
  if (i && s)
    s.value = i;
  else {
    const [l, a] = wp(t);
    if (i) {
      const d = r[t] = Ip(
        i,
        o
      );
      mp(e, l, d, a);
    } else s && (bp(e, l, s, a), r[t] = void 0);
  }
}
const yp = /(Once|Passive|Capture)$/, Sp = /^on:?(?:Once|Passive|Capture)$/;
function wp(e) {
  let t, n;
  for (; (n = e.match(yp)) && !Sp.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : _n(e.slice(2)), t];
}
let er = 0;
const Op = /* @__PURE__ */ Promise.resolve(), xp = () => er || (Op.then(() => er = 0), er = Date.now());
function Ip(e, t) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    const o = n.value;
    if (Y(o)) {
      const r = i.stopImmediatePropagation;
      i.stopImmediatePropagation = () => {
        r.call(i), i._stopped = !0;
      };
      const s = o.slice(), l = [i];
      for (let a = 0; a < s.length && !i._stopped; a++) {
        const d = s[a];
        d && dt(
          d,
          t,
          5,
          l
        );
      }
    } else
      dt(
        o,
        t,
        5,
        [i]
      );
  };
  return n.value = e, n.attached = xp(), n;
}
const cl = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, $p = (e, t, n, i, o, r) => {
  const s = o === "svg";
  t === "class" ? up(e, i, s) : t === "style" ? pp(e, n, i) : wo(t) ? Oo(t) || vp(e, t, n, i, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : _p(e, t, i, s)) ? (ul(e, t, i), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && al(e, t, i, s, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Cp(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !_e(i))) ? ul(e, qe(t), i, r, t) : (t === "true-value" ? e._trueValue = i : t === "false-value" && (e._falseValue = i), al(e, t, i, s));
};
function _p(e, t, n, i) {
  if (i)
    return !!(t === "innerHTML" || t === "textContent" || t in e && cl(t) && ee(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return cl(t) && _e(n) ? !1 : t in e;
}
function Cp(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const i = qe(t);
  return Array.isArray(n) ? n.some((o) => qe(o) === i) : Object.keys(n).some((o) => qe(o) === i);
}
const kp = ["ctrl", "shift", "alt", "meta"], Tp = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => kp.some((n) => e[`${n}Key`] && !t.includes(n))
}, ss = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), i = t.join(".");
  return n[i] || (n[i] = ((o, ...r) => {
    for (let s = 0; s < t.length; s++) {
      const l = Tp[t[s]];
      if (l && l(o, t)) return;
    }
    return e(o, ...r);
  }));
}, Pp = /* @__PURE__ */ Ee({ patchProp: $p }, tp);
let fl;
function Lp() {
  return fl || (fl = Ff(Pp));
}
const Ep = ((...e) => {
  const t = Lp().createApp(...e), { mount: n } = t;
  return t.mount = (i) => {
    const o = Mp(i);
    if (!o) return;
    const r = t._component;
    !ee(r) && !r.render && !r.template && (r.template = o.innerHTML), o.nodeType === 1 && (o.textContent = "");
    const s = n(o, !1, Ap(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), s;
  }, t;
});
function Ap(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Mp(e) {
  return _e(e) ? document.querySelector(e) : e;
}
function vi(e) {
  "@babel/helpers - typeof";
  return vi = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, vi(e);
}
function pl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function hl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? pl(Object(n), !0).forEach(function(i) {
      Fp(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : pl(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Fp(e, t, n) {
  return (t = Vp(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Vp(e) {
  var t = Np(e, "string");
  return vi(t) == "symbol" ? t : t + "";
}
function Np(e, t) {
  if (vi(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (vi(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Dp(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  hi() && hi().components ? Cn(e) : t ? e() : Yr(e);
}
var jp = 0;
function Rp(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = /* @__PURE__ */ Ve(!1), i = /* @__PURE__ */ Ve(e), o = /* @__PURE__ */ Ve(null), r = sa() ? window.document : void 0, s = t.document, l = s === void 0 ? r : s, a = t.immediate, d = a === void 0 ? !0 : a, u = t.manual, c = u === void 0 ? !1 : u, f = t.name, h = f === void 0 ? "style_".concat(++jp) : f, b = t.id, y = b === void 0 ? void 0 : b, w = t.media, v = w === void 0 ? void 0 : w, S = t.nonce, $ = S === void 0 ? void 0 : S, g = t.first, x = g === void 0 ? !1 : g, D = t.onMounted, L = D === void 0 ? void 0 : D, j = t.onUpdated, N = j === void 0 ? void 0 : j, G = t.onLoad, U = G === void 0 ? void 0 : G, E = t.props, te = E === void 0 ? {} : E, X = function() {
  }, ce = function(le) {
    var Te = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var z = hl(hl({}, te), Te), H = z.name || h, Z = z.id || y, De = z.nonce || $;
      o.value = l.querySelector('style[data-primevue-style-id="'.concat(H, '"]')) || l.getElementById(Z) || l.createElement("style"), o.value.isConnected || (i.value = le || e, io(o.value, {
        type: "text/css",
        id: Z,
        media: v,
        nonce: De
      }), x ? l.head.prepend(o.value) : l.head.appendChild(o.value), jd(o.value, "data-primevue-style-id", H), io(o.value, z), o.value.onload = function(Kt) {
        return U?.(Kt, {
          name: H
        });
      }, L?.(H)), !n.value && (X = lt(i, function(Kt) {
        o.value.textContent = Kt, N?.(H);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, se = function() {
    !l || !n.value || (X(), Td(o.value) && l.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return d && !c && Dp(ce), {
    id: y,
    name: h,
    el: o,
    css: i,
    unload: se,
    load: ce,
    isLoaded: /* @__PURE__ */ lo(n)
  };
}
function yi(e) {
  "@babel/helpers - typeof";
  return yi = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, yi(e);
}
var gl, ml, bl, vl;
function yl(e, t) {
  return Hp(e) || Kp(e, t) || Bp(e, t) || zp();
}
function zp() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Bp(e, t) {
  if (e) {
    if (typeof e == "string") return Sl(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Sl(e, t) : void 0;
  }
}
function Sl(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Kp(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, o, r, s, l = [], a = !0, d = !1;
    try {
      if (r = (n = n.call(e)).next, t !== 0) for (; !(a = (i = r.call(n)).done) && (l.push(i.value), l.length !== t); a = !0) ;
    } catch (u) {
      d = !0, o = u;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return l;
  }
}
function Hp(e) {
  if (Array.isArray(e)) return e;
}
function wl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function tr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? wl(Object(n), !0).forEach(function(i) {
      Up(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : wl(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Up(e, t, n) {
  return (t = Wp(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Wp(e) {
  var t = Gp(e, "string");
  return yi(t) == "symbol" ? t : t + "";
}
function Gp(e, t) {
  if (yi(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (yi(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ji(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var qp = function(t) {
  var n = t.dt;
  return `
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    opacity: 0;
    overflow: hidden;
    padding: 0;
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: `.concat(n("scrollbar.width"), `;
}
`);
}, Jp = {}, Yp = {}, be = {
  name: "base",
  css: qp,
  style: Xd,
  classes: Jp,
  inlineStyles: Yp,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(r) {
      return r;
    }, o = i(Ki(gl || (gl = Ji(["", ""])), t));
    return ae(o) ? Rp(ti(o), tr({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return we.transformCSS(n.name || t.name, "".concat(o).concat(Ki(ml || (ml = Ji(["", ""])), i)));
    });
  },
  getCommonTheme: function(t) {
    return we.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return we.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return we.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, i) {
    return we.getCustomPreset(this.name, t, n, i);
  },
  getLayerOrderThemeCSS: function() {
    return we.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var i = Xe(this.css, {
        dt: Sn
      }) || "", o = ti(Ki(bl || (bl = Ji(["", "", ""])), i, t)), r = Object.entries(n).reduce(function(s, l) {
        var a = yl(l, 2), d = a[0], u = a[1];
        return s.push("".concat(d, '="').concat(u, '"')) && s;
      }, []).join(" ");
      return ae(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(r, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return we.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = [we.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), r = Ki(vl || (vl = Ji(["", ""])), Xe(this.style, {
        dt: Sn
      })), s = ti(we.transformCSS(o, r)), l = Object.entries(n).reduce(function(a, d) {
        var u = yl(d, 2), c = u[0], f = u[1];
        return a.push("".concat(c, '="').concat(f, '"')) && a;
      }, []).join(" ");
      ae(s) && i.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(l, ">").concat(s, "</style>"));
    }
    return i.join("");
  },
  extend: function(t) {
    return tr(tr({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, Yt = Dr();
function Si(e) {
  "@babel/helpers - typeof";
  return Si = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Si(e);
}
function Ol(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Yi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ol(Object(n), !0).forEach(function(i) {
      Zp(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ol(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Zp(e, t, n) {
  return (t = Qp(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Qp(e) {
  var t = Xp(e, "string");
  return Si(t) == "symbol" ? t : t + "";
}
function Xp(e, t) {
  if (Si(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Si(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var eh = {
  ripple: !1,
  inputStyle: null,
  inputVariant: null,
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    showMonthAfterYear: !1,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    fileChosenMessage: "{0} files",
    noFileChosenMessage: "No file chosen",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "Page {page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left",
      listLabel: "Option List"
    }
  },
  filterMatchModeOptions: {
    text: [je.STARTS_WITH, je.CONTAINS, je.NOT_CONTAINS, je.ENDS_WITH, je.EQUALS, je.NOT_EQUALS],
    numeric: [je.EQUALS, je.NOT_EQUALS, je.LESS_THAN, je.LESS_THAN_OR_EQUAL_TO, je.GREATER_THAN, je.GREATER_THAN_OR_EQUAL_TO],
    date: [je.DATE_IS, je.DATE_IS_NOT, je.DATE_BEFORE, je.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  theme: void 0,
  unstyled: !1,
  pt: void 0,
  ptOptions: {
    mergeSections: !0,
    mergeProps: !1
  },
  csp: {
    nonce: void 0
  }
}, th = /* @__PURE__ */ Symbol();
function nh(e, t) {
  var n = {
    config: /* @__PURE__ */ on(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(th, n), ih(), oh(e, n), n;
}
var Fn = [];
function ih() {
  Fe.clear(), Fn.forEach(function(e) {
    return e?.();
  }), Fn = [];
}
function oh(e, t) {
  var n = /* @__PURE__ */ Ve(!1), i = function() {
    var d;
    if (((d = t.config) === null || d === void 0 ? void 0 : d.theme) !== "none" && !we.isStyleNameLoaded("common")) {
      var u, c, f = ((u = be.getCommonTheme) === null || u === void 0 ? void 0 : u.call(be)) || {}, h = f.primitive, b = f.semantic, y = f.global, w = f.style, v = {
        nonce: (c = t.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      be.load(h?.css, Yi({
        name: "primitive-variables"
      }, v)), be.load(b?.css, Yi({
        name: "semantic-variables"
      }, v)), be.load(y?.css, Yi({
        name: "global-variables"
      }, v)), be.loadStyle(Yi({
        name: "global-style"
      }, v), w), we.setLoadedStyleName("common");
    }
  };
  Fe.on("theme:change", function(a) {
    n.value || (e.config.globalProperties.$primevue.config.theme = a, n.value = !0);
  });
  var o = lt(t.config, function(a, d) {
    Yt.emit("config:change", {
      newValue: a,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  }), r = lt(function() {
    return t.config.ripple;
  }, function(a, d) {
    Yt.emit("config:ripple:change", {
      newValue: a,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = lt(function() {
    return t.config.theme;
  }, function(a, d) {
    n.value || we.setTheme(a), t.config.unstyled || i(), n.value = !1, Yt.emit("config:theme:change", {
      newValue: a,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = lt(function() {
    return t.config.unstyled;
  }, function(a, d) {
    !a && t.config.theme && i(), Yt.emit("config:unstyled:change", {
      newValue: a,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  });
  Fn.push(o), Fn.push(r), Fn.push(s), Fn.push(l);
}
var rh = {
  install: function(t, n) {
    var i = yd(eh, n);
    nh(t, i);
  }
};
const sh = {
  select: {
    root: { class: "nf-select" },
    label: { class: "nf-select-label" },
    dropdown: { class: "nf-select-dropdown" },
    overlay: { class: "nf-overlay" },
    header: { class: "nf-overlay-header" },
    pcFilter: { root: { class: "nf-input nf-overlay-filter" } },
    listContainer: { class: "nf-overlay-list-container" },
    list: { class: "nf-overlay-list" },
    optionGroup: { class: "nf-overlay-group" },
    option: { class: "nf-overlay-option" },
    emptyMessage: { class: "nf-overlay-empty" }
  },
  listbox: {
    root: { class: "nf-listbox" },
    header: { class: "nf-listbox-header" },
    pcFilter: { root: { class: "nf-input" } },
    listContainer: { class: "nf-listbox-list-container" },
    list: { class: "nf-overlay-list" },
    optionGroup: { class: "nf-overlay-group" },
    option: { class: "nf-overlay-option" },
    emptyMessage: { class: "nf-overlay-empty" }
  },
  inputtext: {
    root: { class: "nf-input" }
  },
  button: {
    root: { class: "nf-button" }
  },
  textarea: {
    root: { class: "nf-input nf-textarea" }
  }
};
function Di(e, t, n = {}) {
  const i = Ep(t, n);
  return i.use(rh, { unstyled: !0, pt: sh }), { instance: i.mount(e), unmount: () => i.unmount() };
}
var qt = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(t) {
    return this._loadedStyleNames.has(t);
  },
  setLoadedStyleName: function(t) {
    this._loadedStyleNames.add(t);
  },
  deleteLoadedStyleName: function(t) {
    this._loadedStyleNames.delete(t);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
};
function lh() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = tf();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var xl = be.extend({
  name: "common"
});
function wi(e) {
  "@babel/helpers - typeof";
  return wi = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, wi(e);
}
function ah(e) {
  return ku(e) || uh(e) || Cu(e) || _u();
}
function uh(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function qn(e, t) {
  return ku(e) || dh(e, t) || Cu(e, t) || _u();
}
function _u() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Cu(e, t) {
  if (e) {
    if (typeof e == "string") return xr(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? xr(e, t) : void 0;
  }
}
function xr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function dh(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, o, r, s, l = [], a = !0, d = !1;
    try {
      if (r = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        a = !1;
      } else for (; !(a = (i = r.call(n)).done) && (l.push(i.value), l.length !== t); a = !0) ;
    } catch (u) {
      d = !0, o = u;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return l;
  }
}
function ku(e) {
  if (Array.isArray(e)) return e;
}
function Il(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function ue(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Il(Object(n), !0).forEach(function(i) {
      ei(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Il(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function ei(e, t, n) {
  return (t = ch(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ch(e) {
  var t = fh(e, "string");
  return wi(t) == "symbol" ? t : t + "";
}
function fh(e, t) {
  if (wi(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (wi(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var kn = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      default: void 0
    },
    ptOptions: {
      type: Object,
      default: void 0
    },
    unstyled: {
      type: Boolean,
      default: void 0
    },
    dt: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    }
  },
  watch: {
    isUnstyled: {
      immediate: !0,
      handler: function(t) {
        Fe.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var i = this;
        Fe.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return i._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, i, o, r, s, l, a, d, u, c, f = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, h = f ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, b = f ? (i = this.pt) === null || i === void 0 || (i = i.value) === null || i === void 0 ? void 0 : i[this.$.type.name] : this.pt;
    (o = b || h) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (r = o.onBeforeCreate) === null || r === void 0 || r.call(o);
    var y = (s = this.$primevueConfig) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s._usept, w = y ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, v = y ? (a = this.$primevue) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a.value : (d = this.$primevue) === null || d === void 0 || (d = d.config) === null || d === void 0 ? void 0 : d.pt;
    (u = v || w) === null || u === void 0 || (u = u[this.$.type.name]) === null || u === void 0 || (u = u.hooks) === null || u === void 0 || (c = u.onBeforeCreate) === null || c === void 0 || c.call(u), this.$attrSelector = lh(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = Ai($n(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = ue({
      name: this.$.type.name,
      attrSelector: this.$attrSelector
    }, this.$params)), this._loadStyles(), this._hook("onBeforeMount");
  },
  mounted: function() {
    this._hook("onMounted");
  },
  beforeUpdate: function() {
    this._hook("onBeforeUpdate");
  },
  updated: function() {
    this._hook("onUpdated");
  },
  beforeUnmount: function() {
    this._hook("onBeforeUnmount");
  },
  unmounted: function() {
    this._removeThemeListeners(), this._unloadScopedThemeStyles(), this._hook("onUnmounted");
  },
  methods: {
    _hook: function(t) {
      if (!this.$options.hostName) {
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), i = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), i?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        i[o - 1] = arguments[o];
      return So(t) ? t.apply(void 0, i) : V.apply(void 0, i);
    },
    _load: function() {
      qt.isStyleNameLoaded("base") || (be.loadCSS(this.$styleOptions), this._loadGlobalStyles(), qt.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !qt.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (xl.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), qt.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      ae(t) && be.load(t, ue({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!we.isStyleNameLoaded("common")) {
          var i, o, r = ((i = this.$style) === null || i === void 0 || (o = i.getCommonTheme) === null || o === void 0 ? void 0 : o.call(i)) || {}, s = r.primitive, l = r.semantic, a = r.global, d = r.style;
          be.load(s?.css, ue({
            name: "primitive-variables"
          }, this.$styleOptions)), be.load(l?.css, ue({
            name: "semantic-variables"
          }, this.$styleOptions)), be.load(a?.css, ue({
            name: "global-variables"
          }, this.$styleOptions)), be.loadStyle(ue({
            name: "global-style"
          }, this.$styleOptions), d), we.setLoadedStyleName("common");
        }
        if (!we.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var u, c, f, h, b = ((u = this.$style) === null || u === void 0 || (c = u.getComponentTheme) === null || c === void 0 ? void 0 : c.call(u)) || {}, y = b.css, w = b.style;
          (f = this.$style) === null || f === void 0 || f.load(y, ue({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (h = this.$style) === null || h === void 0 || h.loadStyle(ue({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), w), we.setLoadedStyleName(this.$style.name);
        }
        if (!we.isStyleNameLoaded("layer-order")) {
          var v, S, $ = (v = this.$style) === null || v === void 0 || (S = v.getLayerOrderThemeCSS) === null || S === void 0 ? void 0 : S.call(v);
          be.load($, ue({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), we.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, i, o, r = ((n = this.$style) === null || n === void 0 || (i = n.getPresetTheme) === null || i === void 0 ? void 0 : i.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, s = r.css, l = (o = this.$style) === null || o === void 0 ? void 0 : o.load(s, ue({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = l.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      qt.clearLoadedStyleNames(), Fe.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      Fe.off("theme:change", this._loadCoreStyles), Fe.off("theme:change", this._load), Fe.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return Nr(t, n, i);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, s = /./g.test(i) && !!o[i.split(".")[0]], l = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, a = l.mergeSections, d = a === void 0 ? !0 : a, u = l.mergeProps, c = u === void 0 ? !1 : u, f = r ? s ? this._useGlobalPT(this._getPTClassValue, i, o) : this._useDefaultPT(this._getPTClassValue, i, o) : void 0, h = s ? void 0 : this._getPTSelf(n, this._getPTClassValue, i, ue(ue({}, o), {}, {
        global: f || {}
      })), b = this._getPTDatasets(i);
      return d || !d && h ? c ? this._mergeProps(c, f, h, b) : ue(ue(ue({}, f), h), b) : ue(ue({}, h), b);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        i[o - 1] = arguments[o];
      return V(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(i)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(i))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", r = i === "root" && ae((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return i !== "transition" && ue(ue({}, i === "root" && ue(ue(ei({}, "".concat(o, "name"), $t(r ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), r && ei({}, "".concat(o, "extend"), $t(this.$.type.name))), {}, ei({}, "".concat(this.$attrSelector), ""))), {}, ei({}, "".concat(o, "section"), $t(i)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return Ye(t) || Ql(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, r = function(l) {
        var a, d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, u = o ? o(l) : l, c = $t(i), f = $t(n.$name);
        return (a = d ? c !== f ? u?.[c] : void 0 : u?.[c]) !== null && a !== void 0 ? a : u;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: r(t.originalValue),
        value: r(t.value)
      } : r(t, !0);
    },
    _usePT: function(t, n, i, o) {
      var r = function(y) {
        return n(y, i, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var s, l = t._usept || ((s = this.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, a = l.mergeSections, d = a === void 0 ? !0 : a, u = l.mergeProps, c = u === void 0 ? !1 : u, f = r(t.originalValue), h = r(t.value);
        return f === void 0 && h === void 0 ? void 0 : Ye(h) ? h : Ye(f) ? f : d || !d && h ? c ? this._mergeProps(c, f, h) : ue(ue({}, f), h) : h;
      }
      return r(t);
    },
    _useGlobalPT: function(t, n, i) {
      return this._usePT(this.globalPT, t, n, i);
    },
    _useDefaultPT: function(t, n, i) {
      return this._usePT(this.defaultPT, t, n, i);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, ue(ue({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = V(this.$_attrsWithoutPT, this.ptm(n, i));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, ue({
        instance: this
      }, i), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, ue(ue({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, ue(ue({}, this.$params), i)), r = this._getOptionValue(xl.inlineStyles, t, ue(ue({}, this.$params), i));
        return [r, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(i) {
        return Xe(i, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(i) {
        return n._getOptionValue(i, n.$name, ue({}, n.$params)) || Xe(i, ue({}, n.$params));
      });
    },
    isUnstyled: function() {
      var t;
      return this.unstyled !== void 0 ? this.unstyled : (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.unstyled;
    },
    $id: function() {
      return this.$attrs.id || this.uid;
    },
    $inProps: function() {
      var t, n = Object.keys(((t = this.$.vnode) === null || t === void 0 ? void 0 : t.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(i) {
        var o = qn(i, 1), r = o[0];
        return n?.includes(r);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return ue(ue({
        classes: void 0,
        inlineStyles: void 0,
        load: function() {
        },
        loadCSS: function() {
        },
        loadStyle: function() {
        }
      }, (this._getHostInstance(this) || {}).$style), this.$options.style);
    },
    $styleOptions: function() {
      var t;
      return {
        nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
      };
    },
    $primevueConfig: function() {
      var t;
      return (t = this.$primevue) === null || t === void 0 ? void 0 : t.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var t = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: t,
          props: t?.$props,
          state: t?.$data,
          attrs: t?.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = qn(t, 1), i = n[0];
        return i?.startsWith("pt:");
      }).reduce(function(t, n) {
        var i = qn(n, 2), o = i[0], r = i[1], s = o.split(":"), l = ah(s), a = xr(l).slice(1);
        return a?.reduce(function(d, u, c, f) {
          return !d[u] && (d[u] = c === f.length - 1 ? r : {}), d[u];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = qn(t, 1), i = n[0];
        return !(i != null && i.startsWith("pt:"));
      }).reduce(function(t, n) {
        var i = qn(n, 2), o = i[0], r = i[1];
        return t[o] = r, t;
      }, {});
    }
  }
}, ph = `
.p-icon {
    display: inline-block;
    vertical-align: baseline;
    flex-shrink: 0;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`, hh = be.extend({
  name: "baseicon",
  css: ph
});
function Oi(e) {
  "@babel/helpers - typeof";
  return Oi = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Oi(e);
}
function $l(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function _l(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $l(Object(n), !0).forEach(function(i) {
      gh(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : $l(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function gh(e, t, n) {
  return (t = mh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function mh(e) {
  var t = bh(e, "string");
  return Oi(t) == "symbol" ? t : t + "";
}
function bh(e, t) {
  if (Oi(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Oi(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var zn = {
  name: "BaseIcon",
  extends: kn,
  props: {
    label: {
      type: String,
      default: void 0
    },
    spin: {
      type: Boolean,
      default: !1
    }
  },
  style: hh,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = In(this.label);
      return _l(_l({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: t ? void 0 : "img",
        "aria-label": t ? void 0 : this.label,
        "aria-hidden": t
      });
    }
  }
}, Fo = {
  name: "SpinnerIcon",
  extends: zn
};
function vh(e) {
  return Oh(e) || wh(e) || Sh(e) || yh();
}
function yh() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Sh(e, t) {
  if (e) {
    if (typeof e == "string") return Ir(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ir(e, t) : void 0;
  }
}
function wh(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Oh(e) {
  if (Array.isArray(e)) return Ir(e);
}
function Ir(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function xh(e, t, n, i, o, r) {
  return I(), P("svg", V({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), vh(t[0] || (t[0] = [K("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Fo.render = xh;
var Ih = `
    .p-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .p-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .p-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .p-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .p-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .p-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .p-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .p-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .p-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .p-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .p-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .p-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`, $h = {
  root: function(t) {
    var n = t.props, i = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": ae(n.value) && String(n.value).length === 1,
      "p-badge-dot": In(n.value) && !i.$slots.default,
      "p-badge-sm": n.size === "small",
      "p-badge-lg": n.size === "large",
      "p-badge-xl": n.size === "xlarge",
      "p-badge-info": n.severity === "info",
      "p-badge-success": n.severity === "success",
      "p-badge-warn": n.severity === "warn",
      "p-badge-danger": n.severity === "danger",
      "p-badge-secondary": n.severity === "secondary",
      "p-badge-contrast": n.severity === "contrast"
    }];
  }
}, _h = be.extend({
  name: "badge",
  style: Ih,
  classes: $h
}), Ch = {
  name: "BaseBadge",
  extends: kn,
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    severity: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    }
  },
  style: _h,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function xi(e) {
  "@babel/helpers - typeof";
  return xi = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, xi(e);
}
function Cl(e, t, n) {
  return (t = kh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function kh(e) {
  var t = Th(e, "string");
  return xi(t) == "symbol" ? t : t + "";
}
function Th(e, t) {
  if (xi(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (xi(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Tu = {
  name: "Badge",
  extends: Ch,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return rt(Cl(Cl({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Ph = ["data-p"];
function Lh(e, t, n, i, o, r) {
  return I(), P("span", V({
    class: e.cx("root"),
    "data-p": r.dataP
  }, e.ptmi("root")), [de(e.$slots, "default", {}, function() {
    return [Nt(oe(e.value), 1)];
  })], 16, Ph);
}
Tu.render = Lh;
function Ii(e) {
  "@babel/helpers - typeof";
  return Ii = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ii(e);
}
function kl(e, t) {
  return Fh(e) || Mh(e, t) || Ah(e, t) || Eh();
}
function Eh() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ah(e, t) {
  if (e) {
    if (typeof e == "string") return Tl(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Tl(e, t) : void 0;
  }
}
function Tl(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Mh(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, o, r, s, l = [], a = !0, d = !1;
    try {
      if (r = (n = n.call(e)).next, t !== 0) for (; !(a = (i = r.call(n)).done) && (l.push(i.value), l.length !== t); a = !0) ;
    } catch (u) {
      d = !0, o = u;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return l;
  }
}
function Fh(e) {
  if (Array.isArray(e)) return e;
}
function Pl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function pe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Pl(Object(n), !0).forEach(function(i) {
      $r(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Pl(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function $r(e, t, n) {
  return (t = Vh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Vh(e) {
  var t = Nh(e, "string");
  return Ii(t) == "symbol" ? t : t + "";
}
function Nh(e, t) {
  if (Ii(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Ii(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ie = {
  _getMeta: function() {
    return [Ct(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], Xe(Ct(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var i, o, r;
    return (i = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (r = n.ctx) === null || r === void 0 || (r = r.appContext) === null || r === void 0 || (r = r.config) === null || r === void 0 || (r = r.globalProperties) === null || r === void 0 ? void 0 : r.$primevue)) === null || i === void 0 ? void 0 : i.config;
  },
  _getOptionValue: Nr,
  _getPTValue: function() {
    var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = function() {
      var S = ie._getOptionValue.apply(ie, arguments);
      return Ye(S) || Ql(S) ? {
        class: S
      } : S;
    }, d = ((t = i.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = i.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, u = d.mergeSections, c = u === void 0 ? !0 : u, f = d.mergeProps, h = f === void 0 ? !1 : f, b = l ? ie._useDefaultPT(i, i.defaultPT(), a, r, s) : void 0, y = ie._usePT(i, ie._getPT(o, i.$name), a, r, pe(pe({}, s), {}, {
      global: b || {}
    })), w = ie._getPTDatasets(i, r);
    return c || !c && y ? h ? ie._mergeProps(i, h, b, y, w) : pe(pe(pe({}, b), y), w) : pe(pe({}, y), w);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = "data-pc-";
    return pe(pe({}, n === "root" && $r({}, "".concat(i, "name"), $t(t.$name))), {}, $r({}, "".concat(i, "section"), $t(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 ? arguments[2] : void 0, o = function(s) {
      var l, a = i ? i(s) : s, d = $t(n);
      return (l = a?.[d]) !== null && l !== void 0 ? l : a;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, i = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, r = arguments.length > 4 ? arguments[4] : void 0, s = function(w) {
      return i(w, o, r);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var l, a = n._usept || ((l = t.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, d = a.mergeSections, u = d === void 0 ? !0 : d, c = a.mergeProps, f = c === void 0 ? !1 : c, h = s(n.originalValue), b = s(n.value);
      return h === void 0 && b === void 0 ? void 0 : Ye(b) ? b : Ye(h) ? h : u || !u && b ? f ? ie._mergeProps(t, f, h, b) : pe(pe({}, h), b) : b;
    }
    return s(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, r = arguments.length > 4 ? arguments[4] : void 0;
    return ie._usePT(t, n, i, o, r);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, r = ie._getConfig(i, o), s = {
      nonce: r == null || (t = r.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    ie._loadCoreStyles(n, s), ie._loadThemeStyles(n, s), ie._loadScopedThemeStyles(n, s), ie._removeThemeListeners(n), n.$loadStyles = function() {
      return ie._loadThemeStyles(n, s);
    }, ie._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!qt.isStyleNameLoaded((t = i.$style) === null || t === void 0 ? void 0 : t.name) && (n = i.$style) !== null && n !== void 0 && n.name) {
      var r;
      be.loadCSS(o), (r = i.$style) === null || r === void 0 || r.loadCSS(o), qt.setLoadedStyleName(i.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, i, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!we.isStyleNameLoaded("common")) {
        var s, l, a = ((s = o.$style) === null || s === void 0 || (l = s.getCommonTheme) === null || l === void 0 ? void 0 : l.call(s)) || {}, d = a.primitive, u = a.semantic, c = a.global, f = a.style;
        be.load(d?.css, pe({
          name: "primitive-variables"
        }, r)), be.load(u?.css, pe({
          name: "semantic-variables"
        }, r)), be.load(c?.css, pe({
          name: "global-variables"
        }, r)), be.loadStyle(pe({
          name: "global-style"
        }, r), f), we.setLoadedStyleName("common");
      }
      if (!we.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (i = o.$style) !== null && i !== void 0 && i.name) {
        var h, b, y, w, v = ((h = o.$style) === null || h === void 0 || (b = h.getDirectiveTheme) === null || b === void 0 ? void 0 : b.call(h)) || {}, S = v.css, $ = v.style;
        (y = o.$style) === null || y === void 0 || y.load(S, pe({
          name: "".concat(o.$style.name, "-variables")
        }, r)), (w = o.$style) === null || w === void 0 || w.loadStyle(pe({
          name: "".concat(o.$style.name, "-style")
        }, r), $), we.setLoadedStyleName(o.$style.name);
      }
      if (!we.isStyleNameLoaded("layer-order")) {
        var g, x, D = (g = o.$style) === null || g === void 0 || (x = g.getLayerOrderThemeCSS) === null || x === void 0 ? void 0 : x.call(g);
        be.load(D, pe({
          name: "layer-order",
          first: !0
        }, r)), we.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, i = t.preset();
    if (i && t.$attrSelector) {
      var o, r, s, l = ((o = t.$style) === null || o === void 0 || (r = o.getPresetTheme) === null || r === void 0 ? void 0 : r.call(o, i, "[".concat(t.$attrSelector, "]"))) || {}, a = l.css, d = (s = t.$style) === null || s === void 0 ? void 0 : s.load(a, pe({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = d.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    qt.clearLoadedStyleNames(), Fe.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Fe.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, i, o, r, s) {
    var l, a, d = "on".concat(Sd(n)), u = ie._getConfig(o, r), c = i?.$instance, f = ie._usePT(c, ie._getPT(o == null || (l = o.value) === null || l === void 0 ? void 0 : l.pt, t), ie._getOptionValue, "hooks.".concat(d)), h = ie._useDefaultPT(c, u == null || (a = u.pt) === null || a === void 0 || (a = a.directives) === null || a === void 0 ? void 0 : a[t], ie._getOptionValue, "hooks.".concat(d)), b = {
      el: i,
      binding: o,
      vnode: r,
      prevVnode: s
    };
    f?.(c, b), h?.(c, b);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      i[o - 2] = arguments[o];
    return So(t) ? t.apply(void 0, i) : V.apply(void 0, i);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = function(l, a, d, u, c) {
      var f, h, b, y;
      a._$instances = a._$instances || {};
      var w = ie._getConfig(d, u), v = a._$instances[t] || {}, S = In(v) ? pe(pe({}, n), n?.methods) : {};
      a._$instances[t] = pe(pe({}, v), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: a,
        $binding: d,
        $modifiers: d?.modifiers,
        $value: d?.value,
        $el: v.$el || a || void 0,
        $style: pe({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: w,
        $attrSelector: (f = a.$pd) === null || f === void 0 || (f = f[t]) === null || f === void 0 ? void 0 : f.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return ie._getPT(w?.pt, void 0, function(g) {
            var x;
            return g == null || (x = g.directives) === null || x === void 0 ? void 0 : x[t];
          });
        },
        isUnstyled: function() {
          var g, x;
          return ((g = a._$instances[t]) === null || g === void 0 || (g = g.$binding) === null || g === void 0 || (g = g.value) === null || g === void 0 ? void 0 : g.unstyled) !== void 0 ? (x = a._$instances[t]) === null || x === void 0 || (x = x.$binding) === null || x === void 0 || (x = x.value) === null || x === void 0 ? void 0 : x.unstyled : w?.unstyled;
        },
        theme: function() {
          var g;
          return (g = a._$instances[t]) === null || g === void 0 || (g = g.$primevueConfig) === null || g === void 0 ? void 0 : g.theme;
        },
        preset: function() {
          var g;
          return (g = a._$instances[t]) === null || g === void 0 || (g = g.$binding) === null || g === void 0 || (g = g.value) === null || g === void 0 ? void 0 : g.dt;
        },
        /* instance's methods */
        ptm: function() {
          var g, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return ie._getPTValue(a._$instances[t], (g = a._$instances[t]) === null || g === void 0 || (g = g.$binding) === null || g === void 0 || (g = g.value) === null || g === void 0 ? void 0 : g.pt, x, pe({}, D));
        },
        ptmo: function() {
          var g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", D = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return ie._getPTValue(a._$instances[t], g, x, D, !1);
        },
        cx: function() {
          var g, x, D = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", L = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (g = a._$instances[t]) !== null && g !== void 0 && g.isUnstyled() ? void 0 : ie._getOptionValue((x = a._$instances[t]) === null || x === void 0 || (x = x.$style) === null || x === void 0 ? void 0 : x.classes, D, pe({}, L));
        },
        sx: function() {
          var g, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, L = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return D ? ie._getOptionValue((g = a._$instances[t]) === null || g === void 0 || (g = g.$style) === null || g === void 0 ? void 0 : g.inlineStyles, x, pe({}, L)) : void 0;
        }
      }, S), a.$instance = a._$instances[t], (h = (b = a.$instance)[l]) === null || h === void 0 || h.call(b, a, d, u, c), a["$".concat(t)] = a.$instance, ie._hook(t, l, a, d, u, c), a.$pd || (a.$pd = {}), a.$pd[t] = pe(pe({}, (y = a.$pd) === null || y === void 0 ? void 0 : y[t]), {}, {
        name: t,
        instance: a._$instances[t]
      });
    }, o = function(l) {
      var a, d, u, c = l._$instances[t], f = c?.watch, h = function(w) {
        var v, S = w.newValue, $ = w.oldValue;
        return f == null || (v = f.config) === null || v === void 0 ? void 0 : v.call(c, S, $);
      }, b = function(w) {
        var v, S = w.newValue, $ = w.oldValue;
        return f == null || (v = f["config.ripple"]) === null || v === void 0 ? void 0 : v.call(c, S, $);
      };
      c.$watchersCallback = {
        config: h,
        "config.ripple": b
      }, f == null || (a = f.config) === null || a === void 0 || a.call(c, c?.$primevueConfig), Yt.on("config:change", h), f == null || (d = f["config.ripple"]) === null || d === void 0 || d.call(c, c == null || (u = c.$primevueConfig) === null || u === void 0 ? void 0 : u.ripple), Yt.on("config:ripple:change", b);
    }, r = function(l) {
      var a = l._$instances[t].$watchersCallback;
      a && (Yt.off("config:change", a.config), Yt.off("config:ripple:change", a["config.ripple"]), l._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(l, a, d, u) {
        l.$pd || (l.$pd = {}), l.$pd[t] = {
          name: t,
          attrSelector: Rd("pd")
        }, i("created", l, a, d, u);
      },
      beforeMount: function(l, a, d, u) {
        var c;
        ie._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, a, d), i("beforeMount", l, a, d, u), o(l);
      },
      mounted: function(l, a, d, u) {
        var c;
        ie._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, a, d), i("mounted", l, a, d, u);
      },
      beforeUpdate: function(l, a, d, u) {
        i("beforeUpdate", l, a, d, u);
      },
      updated: function(l, a, d, u) {
        var c;
        ie._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, a, d), i("updated", l, a, d, u);
      },
      beforeUnmount: function(l, a, d, u) {
        var c;
        r(l), ie._removeThemeListeners((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance), i("beforeUnmount", l, a, d, u);
      },
      unmounted: function(l, a, d, u) {
        var c;
        (c = l.$pd[t]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), i("unmounted", l, a, d, u);
      }
    };
  },
  extend: function() {
    var t = ie._getMeta.apply(ie, arguments), n = kl(t, 2), i = n[0], o = n[1];
    return pe({
      extend: function() {
        var s = ie._getMeta.apply(ie, arguments), l = kl(s, 2), a = l[0], d = l[1];
        return ie.extend(a, pe(pe(pe({}, o), o?.methods), d));
      }
    }, ie._extend(i, o));
  }
}, Dh = `
    .p-ink {
        display: block;
        position: absolute;
        background: dt('ripple.background');
        border-radius: 100%;
        transform: scale(0);
        pointer-events: none;
    }

    .p-ink-active {
        animation: ripple 0.4s linear;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`, jh = {
  root: "p-ink"
}, Rh = be.extend({
  name: "ripple-directive",
  style: Dh,
  classes: jh
}), zh = ie.extend({
  style: Rh
});
function $i(e) {
  "@babel/helpers - typeof";
  return $i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $i(e);
}
function Bh(e) {
  return Wh(e) || Uh(e) || Hh(e) || Kh();
}
function Kh() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Hh(e, t) {
  if (e) {
    if (typeof e == "string") return _r(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _r(e, t) : void 0;
  }
}
function Uh(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Wh(e) {
  if (Array.isArray(e)) return _r(e);
}
function _r(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Ll(e, t, n) {
  return (t = Gh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Gh(e) {
  var t = qh(e, "string");
  return $i(t) == "symbol" ? t : t + "";
}
function qh(e, t) {
  if ($i(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if ($i(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ls = zh.extend("ripple", {
  watch: {
    "config.ripple": function(t) {
      t ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(t) {
    this.remove(t);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(t) {
      t.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(t) {
      t.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(t) {
      var n = this.getInk(t);
      n || (n = Pd("span", Ll(Ll({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), t.appendChild(n), this.$el = n);
    },
    remove: function(t) {
      var n = this.getInk(t);
      n && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(t), n.removeEventListener("animationend", this.onAnimationEnd), n.remove());
    },
    onMouseDown: function(t) {
      var n = this, i = t.currentTarget, o = this.getInk(i);
      if (!(!o || getComputedStyle(o, null).display === "none")) {
        if (!this.isUnstyled() && jo(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !pn(o) && !hn(o)) {
          var r = Math.max(ia(i), Fd(i));
          o.style.height = r + "px", o.style.width = r + "px";
        }
        var s = Md(i), l = t.pageX - s.left + document.body.scrollTop - hn(o) / 2, a = t.pageY - s.top + document.body.scrollLeft - pn(o) / 2;
        o.style.top = a + "px", o.style.left = l + "px", !this.isUnstyled() && Od(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && jo(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && jo(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? Bh(t.children).find(function(n) {
        return Ed(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
}), Jh = `
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        color: dt('button.primary.color');
        background: dt('button.primary.background');
        border: 1px solid dt('button.primary.border.color');
        padding: dt('button.padding.y') dt('button.padding.x');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('button.transition.duration'),
            color dt('button.transition.duration'),
            border-color dt('button.transition.duration'),
            outline-color dt('button.transition.duration'),
            box-shadow dt('button.transition.duration');
        border-radius: dt('button.border.radius');
        outline-color: transparent;
        gap: dt('button.gap');
    }

    .p-button:disabled {
        cursor: default;
    }

    .p-button-icon-right {
        order: 1;
    }

    .p-button-icon-right:dir(rtl) {
        order: -1;
    }

    .p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
        order: 1;
    }

    .p-button-icon-bottom {
        order: 2;
    }

    .p-button-icon-only {
        width: dt('button.icon.only.width');
        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;
    }

    .p-button-icon-only.p-button-rounded {
        border-radius: 50%;
        height: dt('button.icon.only.width');
    }

    .p-button-icon-only .p-button-label {
        visibility: hidden;
        width: 0;
    }

    .p-button-icon-only::after {
        content: " ";
        visibility: hidden;
        width: 0;
    }

    .p-button-sm {
        font-size: dt('button.sm.font.size');
        padding: dt('button.sm.padding.y') dt('button.sm.padding.x');
    }

    .p-button-sm .p-button-icon {
        font-size: dt('button.sm.font.size');
    }

    .p-button-sm.p-button-icon-only {
        width: dt('button.sm.icon.only.width');
    }

    .p-button-sm.p-button-icon-only.p-button-rounded {
        height: dt('button.sm.icon.only.width');
    }

    .p-button-lg {
        font-size: dt('button.lg.font.size');
        padding: dt('button.lg.padding.y') dt('button.lg.padding.x');
    }

    .p-button-lg .p-button-icon {
        font-size: dt('button.lg.font.size');
    }

    .p-button-lg.p-button-icon-only {
        width: dt('button.lg.icon.only.width');
    }

    .p-button-lg.p-button-icon-only.p-button-rounded {
        height: dt('button.lg.icon.only.width');
    }

    .p-button-vertical {
        flex-direction: column;
    }

    .p-button-label {
        font-weight: dt('button.label.font.weight');
    }

    .p-button-fluid {
        width: 100%;
    }

    .p-button-fluid.p-button-icon-only {
        width: dt('button.icon.only.width');
    }

    .p-button:not(:disabled):hover {
        background: dt('button.primary.hover.background');
        border: 1px solid dt('button.primary.hover.border.color');
        color: dt('button.primary.hover.color');
    }

    .p-button:not(:disabled):active {
        background: dt('button.primary.active.background');
        border: 1px solid dt('button.primary.active.border.color');
        color: dt('button.primary.active.color');
    }

    .p-button:focus-visible {
        box-shadow: dt('button.primary.focus.ring.shadow');
        outline: dt('button.focus.ring.width') dt('button.focus.ring.style') dt('button.primary.focus.ring.color');
        outline-offset: dt('button.focus.ring.offset');
    }

    .p-button .p-badge {
        min-width: dt('button.badge.size');
        height: dt('button.badge.size');
        line-height: dt('button.badge.size');
    }

    .p-button-raised {
        box-shadow: dt('button.raised.shadow');
    }

    .p-button-rounded {
        border-radius: dt('button.rounded.border.radius');
    }

    .p-button-secondary {
        background: dt('button.secondary.background');
        border: 1px solid dt('button.secondary.border.color');
        color: dt('button.secondary.color');
    }

    .p-button-secondary:not(:disabled):hover {
        background: dt('button.secondary.hover.background');
        border: 1px solid dt('button.secondary.hover.border.color');
        color: dt('button.secondary.hover.color');
    }

    .p-button-secondary:not(:disabled):active {
        background: dt('button.secondary.active.background');
        border: 1px solid dt('button.secondary.active.border.color');
        color: dt('button.secondary.active.color');
    }

    .p-button-secondary:focus-visible {
        outline-color: dt('button.secondary.focus.ring.color');
        box-shadow: dt('button.secondary.focus.ring.shadow');
    }

    .p-button-success {
        background: dt('button.success.background');
        border: 1px solid dt('button.success.border.color');
        color: dt('button.success.color');
    }

    .p-button-success:not(:disabled):hover {
        background: dt('button.success.hover.background');
        border: 1px solid dt('button.success.hover.border.color');
        color: dt('button.success.hover.color');
    }

    .p-button-success:not(:disabled):active {
        background: dt('button.success.active.background');
        border: 1px solid dt('button.success.active.border.color');
        color: dt('button.success.active.color');
    }

    .p-button-success:focus-visible {
        outline-color: dt('button.success.focus.ring.color');
        box-shadow: dt('button.success.focus.ring.shadow');
    }

    .p-button-info {
        background: dt('button.info.background');
        border: 1px solid dt('button.info.border.color');
        color: dt('button.info.color');
    }

    .p-button-info:not(:disabled):hover {
        background: dt('button.info.hover.background');
        border: 1px solid dt('button.info.hover.border.color');
        color: dt('button.info.hover.color');
    }

    .p-button-info:not(:disabled):active {
        background: dt('button.info.active.background');
        border: 1px solid dt('button.info.active.border.color');
        color: dt('button.info.active.color');
    }

    .p-button-info:focus-visible {
        outline-color: dt('button.info.focus.ring.color');
        box-shadow: dt('button.info.focus.ring.shadow');
    }

    .p-button-warn {
        background: dt('button.warn.background');
        border: 1px solid dt('button.warn.border.color');
        color: dt('button.warn.color');
    }

    .p-button-warn:not(:disabled):hover {
        background: dt('button.warn.hover.background');
        border: 1px solid dt('button.warn.hover.border.color');
        color: dt('button.warn.hover.color');
    }

    .p-button-warn:not(:disabled):active {
        background: dt('button.warn.active.background');
        border: 1px solid dt('button.warn.active.border.color');
        color: dt('button.warn.active.color');
    }

    .p-button-warn:focus-visible {
        outline-color: dt('button.warn.focus.ring.color');
        box-shadow: dt('button.warn.focus.ring.shadow');
    }

    .p-button-help {
        background: dt('button.help.background');
        border: 1px solid dt('button.help.border.color');
        color: dt('button.help.color');
    }

    .p-button-help:not(:disabled):hover {
        background: dt('button.help.hover.background');
        border: 1px solid dt('button.help.hover.border.color');
        color: dt('button.help.hover.color');
    }

    .p-button-help:not(:disabled):active {
        background: dt('button.help.active.background');
        border: 1px solid dt('button.help.active.border.color');
        color: dt('button.help.active.color');
    }

    .p-button-help:focus-visible {
        outline-color: dt('button.help.focus.ring.color');
        box-shadow: dt('button.help.focus.ring.shadow');
    }

    .p-button-danger {
        background: dt('button.danger.background');
        border: 1px solid dt('button.danger.border.color');
        color: dt('button.danger.color');
    }

    .p-button-danger:not(:disabled):hover {
        background: dt('button.danger.hover.background');
        border: 1px solid dt('button.danger.hover.border.color');
        color: dt('button.danger.hover.color');
    }

    .p-button-danger:not(:disabled):active {
        background: dt('button.danger.active.background');
        border: 1px solid dt('button.danger.active.border.color');
        color: dt('button.danger.active.color');
    }

    .p-button-danger:focus-visible {
        outline-color: dt('button.danger.focus.ring.color');
        box-shadow: dt('button.danger.focus.ring.shadow');
    }

    .p-button-contrast {
        background: dt('button.contrast.background');
        border: 1px solid dt('button.contrast.border.color');
        color: dt('button.contrast.color');
    }

    .p-button-contrast:not(:disabled):hover {
        background: dt('button.contrast.hover.background');
        border: 1px solid dt('button.contrast.hover.border.color');
        color: dt('button.contrast.hover.color');
    }

    .p-button-contrast:not(:disabled):active {
        background: dt('button.contrast.active.background');
        border: 1px solid dt('button.contrast.active.border.color');
        color: dt('button.contrast.active.color');
    }

    .p-button-contrast:focus-visible {
        outline-color: dt('button.contrast.focus.ring.color');
        box-shadow: dt('button.contrast.focus.ring.shadow');
    }

    .p-button-outlined {
        background: transparent;
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):hover {
        background: dt('button.outlined.primary.hover.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):active {
        background: dt('button.outlined.primary.active.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined.p-button-secondary {
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):hover {
        background: dt('button.outlined.secondary.hover.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):active {
        background: dt('button.outlined.secondary.active.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-success {
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):hover {
        background: dt('button.outlined.success.hover.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):active {
        background: dt('button.outlined.success.active.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-info {
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):hover {
        background: dt('button.outlined.info.hover.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):active {
        background: dt('button.outlined.info.active.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-warn {
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):hover {
        background: dt('button.outlined.warn.hover.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):active {
        background: dt('button.outlined.warn.active.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-help {
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):hover {
        background: dt('button.outlined.help.hover.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):active {
        background: dt('button.outlined.help.active.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-danger {
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):hover {
        background: dt('button.outlined.danger.hover.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):active {
        background: dt('button.outlined.danger.active.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-contrast {
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):hover {
        background: dt('button.outlined.contrast.hover.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):active {
        background: dt('button.outlined.contrast.active.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-plain {
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):hover {
        background: dt('button.outlined.plain.hover.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):active {
        background: dt('button.outlined.plain.active.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-text {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):hover {
        background: dt('button.text.primary.hover.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):active {
        background: dt('button.text.primary.active.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text.p-button-secondary {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: dt('button.text.secondary.hover.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):active {
        background: dt('button.text.secondary.active.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-success {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):hover {
        background: dt('button.text.success.hover.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):active {
        background: dt('button.text.success.active.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-info {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):hover {
        background: dt('button.text.info.hover.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):active {
        background: dt('button.text.info.active.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-warn {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):hover {
        background: dt('button.text.warn.hover.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):active {
        background: dt('button.text.warn.active.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-help {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):hover {
        background: dt('button.text.help.hover.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):active {
        background: dt('button.text.help.active.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-danger {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):hover {
        background: dt('button.text.danger.hover.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):active {
        background: dt('button.text.danger.active.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-contrast {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):hover {
        background: dt('button.text.contrast.hover.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):active {
        background: dt('button.text.contrast.active.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-plain {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):hover {
        background: dt('button.text.plain.hover.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):active {
        background: dt('button.text.plain.active.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-link {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.color');
    }

    .p-button-link:not(:disabled):hover {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.hover.color');
    }

    .p-button-link:not(:disabled):hover .p-button-label {
        text-decoration: underline;
    }

    .p-button-link:not(:disabled):active {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.active.color');
    }
`;
function _i(e) {
  "@babel/helpers - typeof";
  return _i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _i(e);
}
function wt(e, t, n) {
  return (t = Yh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Yh(e) {
  var t = Zh(e, "string");
  return _i(t) == "symbol" ? t : t + "";
}
function Zh(e, t) {
  if (_i(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (_i(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Qh = {
  root: function(t) {
    var n = t.instance, i = t.props;
    return ["p-button p-component", wt(wt(wt(wt(wt(wt(wt(wt(wt({
      "p-button-icon-only": n.hasIcon && !i.label && !i.badge,
      "p-button-vertical": (i.iconPos === "top" || i.iconPos === "bottom") && i.label,
      "p-button-loading": i.loading,
      "p-button-link": i.link || i.variant === "link"
    }, "p-button-".concat(i.severity), i.severity), "p-button-raised", i.raised), "p-button-rounded", i.rounded), "p-button-text", i.text || i.variant === "text"), "p-button-outlined", i.outlined || i.variant === "outlined"), "p-button-sm", i.size === "small"), "p-button-lg", i.size === "large"), "p-button-plain", i.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var n = t.props;
    return ["p-button-icon", wt({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, Xh = be.extend({
  name: "button",
  style: Jh,
  classes: Qh
}), eg = {
  name: "BaseButton",
  extends: kn,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: [String, Object],
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: [String, Object],
      default: null
    },
    badgeSeverity: {
      type: String,
      default: "secondary"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    },
    link: {
      type: Boolean,
      default: !1
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: !1
    },
    rounded: {
      type: Boolean,
      default: !1
    },
    text: {
      type: Boolean,
      default: !1
    },
    outlined: {
      type: Boolean,
      default: !1
    },
    size: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: !1
    },
    fluid: {
      type: Boolean,
      default: null
    }
  },
  style: Xh,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function Ci(e) {
  "@babel/helpers - typeof";
  return Ci = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ci(e);
}
function Je(e, t, n) {
  return (t = tg(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function tg(e) {
  var t = ng(e, "string");
  return Ci(t) == "symbol" ? t : t + "";
}
function ng(e, t) {
  if (Ci(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Ci(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ce = {
  name: "Button",
  extends: eg,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      var n = t === "root" ? this.ptmi : this.ptm;
      return n(t, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
    },
    hasIcon: function() {
      return this.icon || this.$slots.icon;
    },
    attrs: function() {
      return V(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        "aria-label": this.defaultAriaLabel,
        "data-pc-name": "button",
        "data-p-disabled": this.disabled,
        "data-p-severity": this.severity
      };
    },
    hasFluid: function() {
      return In(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return rt(Je(Je(Je(Je(Je(Je(Je(Je(Je(Je({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return rt(Je(Je({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return rt(Je(Je({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Fo,
    Badge: Tu
  },
  directives: {
    ripple: ls
  }
}, ig = ["data-p"], og = ["data-p"];
function rg(e, t, n, i, o, r) {
  var s = Le("SpinnerIcon"), l = Le("Badge"), a = es("ripple");
  return e.asChild ? de(e.$slots, "default", {
    key: 1,
    class: st(e.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : Qr((I(), ke(br(e.as), V({
    key: 0,
    class: e.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: Qe(function() {
      return [de(e.$slots, "default", {}, function() {
        return [e.loading ? de(e.$slots, "loadingicon", V({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (I(), P("span", V({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (I(), ke(s, V({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : de(e.$slots, "icon", V({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (I(), P("span", V({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": r.dataIconP
          }, e.ptm("icon")), null, 16, ig)) : re("", !0)];
        }), e.label ? (I(), P("span", V({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": r.dataLabelP
        }), oe(e.label), 17, og)) : re("", !0), e.badge ? (I(), ke(l, {
          key: 3,
          value: e.badge,
          class: st(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : re("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[a]]);
}
Ce.render = rg;
const sg = { class: "nf-root nf-iq" }, lg = { class: "nf-row" }, ag = ["data-level"], ug = ["aria-valuenow"], dg = {
  key: 2,
  class: "nf-notice nf-pre",
  "data-level": "error"
}, cg = {
  key: 3,
  class: "nf-muted nf-small"
}, fg = {
  key: 4,
  class: "nf-preview"
}, pg = { class: "nf-row" }, hg = { class: "nf-preview-text nf-iq-result" }, gg = /* @__PURE__ */ rn({
  __name: "IndependentQueueNode",
  props: {
    runner: {}
  },
  setup(e) {
    const n = e.runner, i = $e(() => n.job.value?.state ?? null), o = $e(() => n.resultText()), r = $e(() => {
      if (n.starting.value) return "Queueing…";
      const c = i.value;
      if (!c) return null;
      switch (c.status) {
        case "queued":
          return "Waiting in queue…";
        case "running": {
          const f = n.runningTitle();
          return `Running${f ? `: ${f}` : "…"} (${c.nodesDone}/${c.nodesTotal})`;
        }
        case "success":
          return `Done (${c.nodesDone}/${c.nodesTotal})`;
        case "interrupted":
          return "Interrupted";
        case "cancelled":
          return "Cancelled";
        case "error":
          return null;
      }
      return null;
    }), s = $e(() => i.value?.status === "success" ? "info" : "muted"), l = $e(() => {
      if (n.queueError.value) return n.queueError.value;
      const c = i.value?.status === "error" ? i.value.error : null;
      return c ? c.nodeType ? `${c.nodeType}: ${c.message}` : c.message : null;
    }), a = $e(() => {
      const c = i.value?.progress;
      return !c || c.max <= 1 ? null : Math.round(c.value / c.max * 100);
    }), d = $e(() => {
      const c = n.seedChanges.value;
      return c.length ? c.map((f) => `#${f.nodeId} ${f.widget} → ${f.to}`).join(", ") : null;
    });
    async function u() {
      if (o.value)
        try {
          await navigator.clipboard.writeText(o.value), vn("success", "Copied");
        } catch (c) {
          vn("error", "Copy failed", c instanceof Error ? c.message : String(c));
        }
    }
    return Vi(() => n.dispose()), (c, f) => (I(), P("div", sg, [
      K("div", lg, [
        B(n).busy ? (I(), ke(B(Ce), {
          key: 1,
          class: "nf-button nf-button-danger nf-grow",
          icon: "pi pi-stop",
          label: "Cancel",
          disabled: B(n).starting.value,
          onClick: f[1] || (f[1] = (h) => B(n).cancel())
        }, null, 8, ["disabled"])) : (I(), ke(B(Ce), {
          key: 0,
          class: "nf-button nf-button-primary nf-grow",
          icon: "pi pi-play",
          label: "Run",
          title: "Run only the upstream branch of this node",
          onClick: f[0] || (f[0] = (h) => B(n).run())
        }))
      ]),
      r.value ? (I(), P("div", {
        key: 0,
        class: "nf-notice",
        "data-level": s.value
      }, oe(r.value), 9, ag)) : re("", !0),
      a.value !== null ? (I(), P("div", {
        key: 1,
        class: "nf-progress",
        role: "progressbar",
        "aria-valuenow": a.value
      }, [
        K("div", {
          class: "nf-progress-bar",
          style: On({ width: `${a.value}%` })
        }, null, 4)
      ], 8, ug)) : re("", !0),
      l.value ? (I(), P("div", dg, oe(l.value), 1)) : re("", !0),
      d.value && i.value?.status !== "error" ? (I(), P("div", cg, "seed: " + oe(d.value), 1)) : re("", !0),
      o.value !== null ? (I(), P("div", fg, [
        K("div", pg, [
          f[2] || (f[2] = K("span", { class: "nf-preview-label nf-grow" }, "result", -1)),
          q(B(Ce), {
            class: "nf-icon-button",
            icon: "pi pi-copy",
            title: "Copy",
            onClick: u
          })
        ]),
        K("pre", hg, oe(o.value || " "), 1)
      ])) : re("", !0)
    ]));
  }
});
function mg(e, t, n) {
  if (!e[t]) throw new Error(`Node ${t} is not in the prompt (muted or bypassed?)`);
  return { ...e, [t]: { ...e[t], class_type: n } };
}
function bg(e) {
  return Array.isArray(e) && e.length === 2 && typeof e[1] == "number";
}
function Pu(e, t) {
  const n = /* @__PURE__ */ new Set(), i = [t];
  for (; i.length; ) {
    const o = e[i.pop()];
    if (o)
      for (const r of Object.values(o.inputs ?? {})) {
        if (!bg(r)) continue;
        const s = String(r[0]);
        n.has(s) || (n.add(s), i.push(s));
      }
  }
  return n;
}
const Lu = ["success", "error", "interrupted", "cancelled"], vg = [
  "execution_start",
  "execution_cached",
  "progress_state",
  "executed",
  "execution_success",
  "execution_error",
  "execution_interrupted"
];
function yg(e, t) {
  return {
    promptId: e,
    status: "queued",
    runningNode: null,
    progress: null,
    nodesDone: 0,
    nodesTotal: t.length,
    outputs: {},
    error: null,
    branch: [...t],
    done: []
  };
}
function El(e, t) {
  const n = [.../* @__PURE__ */ new Set([...e.done, ...t.filter((i) => e.branch.includes(i))])];
  return { ...e, done: n, nodesDone: n.length };
}
function Sg(e, t) {
  const n = t.data ?? {};
  if (n.prompt_id !== e.promptId || Lu.includes(e.status)) return e;
  switch (t.type) {
    case "execution_start":
      return { ...e, status: "running" };
    case "execution_cached":
      return El({ ...e, status: "running" }, (n.nodes ?? []).map(String));
    case "progress_state": {
      const i = Object.entries(n.nodes ?? {}), o = i.filter(([, s]) => s.state === "finished").map(([s]) => s), r = i.find(([, s]) => s.state === "running");
      return El(
        {
          ...e,
          status: "running",
          runningNode: r ? r[0] : null,
          progress: r ? { value: r[1].value ?? 0, max: r[1].max ?? 1 } : null
        },
        o
      );
    }
    case "executed":
      return { ...e, outputs: { ...e.outputs, [String(n.node)]: n.output } };
    case "execution_success":
      return { ...e, status: "success", runningNode: null, progress: null };
    case "execution_error":
      return {
        ...e,
        status: "error",
        runningNode: null,
        progress: null,
        error: {
          message: String(n.exception_message ?? "Execution failed"),
          nodeId: n.node_id === void 0 ? void 0 : String(n.node_id),
          nodeType: n.node_type === void 0 ? void 0 : String(n.node_type)
        }
      };
    case "execution_interrupted":
      return { ...e, status: "interrupted", runningNode: null, progress: null };
    default:
      return e;
  }
}
class Cr extends Error {
  constructor(t, n) {
    super(t), this.nodeErrors = n;
  }
  nodeErrors;
}
function wg(e) {
  const t = e?.response;
  if (t) {
    const n = t.error, i = [
      ...new Set(
        Object.values(t.node_errors ?? {}).flatMap((r) => r.errors ?? []).map((r) => [r.message, r.details?.replace(/^[\w.]+ - /, "")].filter(Boolean).join(": "))
      )
    ], o = typeof n == "string" ? n : [n?.message, n?.details].filter(Boolean).join(": ");
    return new Cr([o, ...i].filter(Boolean).join(`
`) || "Queue failed", t.node_errors);
  }
  return new Cr(e instanceof Error ? e.message : String(e));
}
async function kr(e) {
  const t = await ed(), n = e.rewrite ? e.rewrite(t.output) : t.output, i = typeof e.targetIds == "function" ? e.targetIds(n) : e.targetIds;
  if (!i.length) throw new Cr("Nothing to run: no output node to target.");
  const o = [...new Set(i.flatMap((f) => [f, ...Pu(n, f)]))], r = [];
  let s = null;
  const l = vg.map(
    (f) => nd(f, (h) => {
      const b = { type: f, data: h ?? {} };
      s ? c(b) : r.push(b);
    })
  ), a = () => l.splice(0).forEach((f) => f());
  let d;
  try {
    d = (await td({ output: n, workflow: t.workflow }, i)).prompt_id;
  } catch (f) {
    throw a(), wg(f);
  }
  const u = /* @__PURE__ */ on(yg(d, o));
  s = u;
  function c(f) {
    Object.assign(u, Sg(u, f)), Lu.includes(u.status) && a();
  }
  return r.splice(0).forEach(c), {
    state: u,
    dispose: a,
    async cancel() {
      u.status === "running" ? await id(d) : u.status === "queued" && (await od(d), Object.assign(u, { status: "cancelled" }), a());
    }
  };
}
const nr = 1125899906842624;
function Og(e) {
  const t = e?.options?.values;
  return Array.isArray(t) && t.includes("randomize") && t.includes("fixed");
}
function xg(e) {
  const t = /* @__PURE__ */ new Set([e]), n = [], i = [e], o = (r) => {
    !r || t.has(r) || (t.add(r), n.push(r), i.push(r));
  };
  for (; i.length; ) {
    const r = i.pop();
    for (const s of r.inputs ?? []) {
      if (s.link == null) continue;
      const l = r.graph?.getLink(s.link);
      l && o(r.graph?.getNodeById(l.origin_id));
    }
    r.subgraph?.nodes.forEach(o);
  }
  return n;
}
function Ig(e) {
  const t = [];
  for (const n of e.widgets ?? []) {
    if (n.type !== "number" || typeof n.value != "number") continue;
    const i = n.linkedWidgets?.find(Og);
    i && t.push({ widget: n, control: i });
  }
  return t;
}
function $g(e = {}, t = Math.random) {
  const n = e.step2 && e.step2 > 0 ? e.step2 : 1, i = Math.max(-nr, e.min ?? 0), o = Math.min(nr, e.max ?? nr), r = Math.floor((o - i) / n);
  return Math.min(o, Math.floor(t() * (r + 1)) * n + i);
}
function Eu(e, t, n = Math.random) {
  if (t === "off") return [];
  const i = [];
  for (const o of xg(e))
    for (const { widget: r, control: s } of Ig(o)) {
      const l = r.value;
      t === "randomize" ? (r.value = $g(r.options, n), r.callback?.(r.value)) : (s.beforeQueued?.({ isPartialExecution: !1 }), s.afterQueued?.({ isPartialExecution: !1 })), r.value !== l && i.push({ nodeId: o.id, widget: r.name, from: l, to: r.value });
    }
  return i;
}
const _g = "NF_IndependentQueue", Cg = "NF_IndependentQueueRun";
class kg {
  constructor(t) {
    this.node = t;
  }
  node;
  job = /* @__PURE__ */ Jt(null);
  queueError = /* @__PURE__ */ Jt(null);
  seedChanges = /* @__PURE__ */ Jt([]);
  starting = /* @__PURE__ */ Jt(!1);
  get nodeId() {
    return String(this.node.id);
  }
  get supported() {
    return !Yl(this.node);
  }
  get busy() {
    const t = this.job.value?.state.status;
    return this.starting.value || t === "queued" || t === "running";
  }
  async run() {
    if (!this.busy) {
      if (!this.supported) {
        this.queueError.value = "NF Independent Queue cannot run inside a subgraph yet. Place it in the root graph.";
        return;
      }
      this.starting.value = !0, this.queueError.value = null, this.job.value?.dispose();
      try {
        const t = An(this.node, "seed_mode", "randomize");
        this.seedChanges.value = Eu(this.node, t), this.seedChanges.value.length && this.node.graph?.setDirtyCanvas?.(!0, !0), this.job.value = await kr({
          targetIds: [this.nodeId],
          rewrite: (n) => mg(n, this.nodeId, Cg)
        });
      } catch (t) {
        this.job.value = null, this.queueError.value = t instanceof Error ? t.message : String(t);
      } finally {
        this.starting.value = !1;
      }
    }
  }
  async cancel() {
    await this.job.value?.cancel();
  }
  /** Text shown by NF_IndependentQueueRun for this node (images are shown by the host). */
  resultText() {
    const n = this.job.value?.state.outputs[this.nodeId]?.text?.[0];
    return typeof n == "string" ? n : null;
  }
  runningTitle() {
    const t = this.job.value?.state.runningNode;
    return t ? cd(t) : null;
  }
  dispose() {
    this.job.value?.dispose();
  }
}
const Al = 300;
function Tg(e) {
  const t = new kg(e), n = document.createElement("div");
  n.className = "nf-widget-container";
  const i = Vr(e, "nf_independent_queue_ui", n, {
    getMinHeight: () => Math.max(40, n.firstElementChild?.offsetHeight ?? 0)
  }), { unmount: o } = Di(n, gg, { runner: t }), r = i.onRemove;
  i.onRemove = () => {
    o(), r?.call(i);
  }, new ResizeObserver(() => Gl(e)).observe(n), e.size[0] < Al && e.setSize?.([Al, e.size[1]]);
}
const Pg = 1500;
function Lg(e) {
  const { clicked: t, selection: n, count: i, now: o } = e;
  return i <= 0 ? null : t && o - t.at <= Pg && t.index < i ? t.index : [...n].sort((s, l) => s - l).find((s) => s < i) ?? 0;
}
const Ml = "NF_PreviewSelector", Eg = "NF_PreviewSelectorSource";
function Ag(e, t, n) {
  return Object.keys(e).filter(
    (i) => i !== t && n(e[i].class_type) && Pu(e, i).has(t)
  );
}
function Mg(e) {
  return [...new Set(e)].sort((t, n) => t - n).join(",");
}
function Fg(e, t) {
  return e.includes(t) ? e.filter((n) => n !== t) : [...e, t].sort((n, i) => n - i);
}
function Vg(e, t, n, i) {
  const o = e[t];
  if (!o) throw new Error(`Node ${t} is not in the prompt (muted or bypassed?)`);
  return {
    ...e,
    [t]: {
      ...o,
      class_type: Eg,
      inputs: { batch_id: n, selection: Mg(i) }
    }
  };
}
const Fl = "nf_preview_selector", Au = /* @__PURE__ */ new WeakMap();
function Ng(e) {
  return Au.get(e);
}
class Dg {
  constructor(t) {
    this.node = t, Au.set(t, this), this.restore(), Wl(t, () => this.restore()), rd(t, (n) => this.receive(n));
  }
  node;
  state = /* @__PURE__ */ on({
    batchId: null,
    candidates: [],
    selection: [],
    expired: !1
  });
  job = /* @__PURE__ */ Jt(null);
  action = /* @__PURE__ */ Jt(null);
  queueError = /* @__PURE__ */ Jt(null);
  starting = /* @__PURE__ */ Jt(!1);
  contextClick = null;
  get nodeId() {
    return String(this.node.id);
  }
  get busy() {
    const t = this.job.value?.state.status;
    return this.starting.value || t === "queued" || t === "running";
  }
  get canContinue() {
    return !this.busy && !!this.state.batchId && this.state.selection.length > 0 && !this.state.expired;
  }
  // --- state ---------------------------------------------------------------------
  restore() {
    const t = sd(this.node, Fl, {});
    this.state.batchId = t.batchId ?? null, this.state.candidates = t.candidates ?? [], this.state.selection = t.selection ?? [], this.state.expired = !1;
  }
  persist() {
    const { batchId: t, candidates: n, selection: i } = this.state;
    ld(this.node, Fl, { batchId: t, candidates: [...n], selection: [...i] });
  }
  receive(t) {
    const n = t.nf_candidates, i = t.nf_batch;
    !n || !i?.length || (this.state.candidates = n, this.state.batchId = i[0], this.state.selection = [], this.state.expired = !1, this.persist());
  }
  /** Remember which image was right-clicked, for the node menu that opens next. */
  noteContextClick(t) {
    this.contextClick = { index: t, at: Date.now() };
  }
  /** Index the node menu's image items act on, or null when there is nothing to act on. */
  menuTarget() {
    return this.state.expired ? null : Lg({
      clicked: this.contextClick,
      selection: this.state.selection,
      count: this.state.candidates.length,
      now: Date.now()
    });
  }
  /** Called when a candidate image fails to load (temp files are removed on restart). */
  markExpired() {
    this.state.expired = !0;
  }
  toggle(t) {
    this.busy || (this.state.selection = Fg(this.state.selection, t), this.persist());
  }
  selectAll() {
    this.state.selection = this.state.candidates.map((t, n) => n), this.persist();
  }
  clearSelection() {
    this.state.selection = [], this.persist();
  }
  // --- runs --------------------------------------------------------------------------
  async start(t, n) {
    if (!this.busy) {
      if (Yl(this.node)) {
        this.queueError.value = "NF Preview Selector buttons cannot run inside a subgraph yet. Place it in the root graph.";
        return;
      }
      this.starting.value = !0, this.action.value = t, this.queueError.value = null, this.job.value?.dispose();
      try {
        this.job.value = await n();
      } catch (i) {
        this.job.value = null, this.queueError.value = i instanceof Error ? i.message : String(i);
      } finally {
        this.starting.value = !1;
      }
    }
  }
  /** Re-run the upstream branch to get new candidates (downstream stays blocked). */
  generate() {
    return this.start("generate", () => {
      const t = An(this.node, "seed_mode", "randomize");
      return Eu(this.node, t).length && this.node.graph?.setDirtyCanvas?.(!0, !0), kr({ targetIds: [this.nodeId] });
    });
  }
  /** Run only the downstream outputs with the selected candidates. */
  continue() {
    if (!this.canContinue) return Promise.resolve();
    const { batchId: t, selection: n } = this.state;
    return this.start("continue", async () => {
      const i = await ad();
      return kr({
        rewrite: (o) => Vg(o, this.nodeId, t, n),
        targetIds: (o) => {
          const r = Ag(o, this.nodeId, (s) => i.has(s));
          if (!r.length) throw new Error("Nothing to continue: connect an output node (e.g. Save Image) after this node.");
          return r;
        }
      });
    });
  }
  async cancel() {
    await this.job.value?.cancel();
  }
  dispose() {
    this.job.value?.dispose();
  }
}
const jg = 0.02, Rg = 0.04;
function zg(e, t) {
  const n = Math.ceil(e.count / t), i = (e.width - e.gap * (t - 1)) / t, o = (e.height - e.gap * (n - 1)) / n, r = Math.min(i, o * e.aspect);
  return r > 0 ? { cols: t, rows: n, size: r, empty: t * n - e.count } : null;
}
function Bg(e) {
  if (e.count <= 0 || e.width <= 0 || e.height <= 0 || !(e.aspect > 0)) return null;
  const t = [];
  for (let l = 1; l <= e.count; l++) {
    const a = zg(e, l);
    a && t.push(a);
  }
  if (!t.length) return null;
  const n = Math.max(...t.map((l) => l.size));
  let i = t.filter((l) => l.size >= n * (1 - jg)).sort((l, a) => l.empty - a.empty || a.size - l.size)[0];
  const o = t.find((l) => l.cols === e.previousCols);
  o && o.size >= i.size * (1 - Rg) && (i = o);
  const r = Math.max(1, Math.floor(i.size)), s = Math.max(1, Math.floor(i.size / e.aspect));
  return { cols: i.cols, rows: i.rows, cellW: r, cellH: s };
}
const Kg = { class: "nf-root nf-ps" }, Hg = ["title", "aria-disabled", "onClick", "onContextmenu"], Ug = ["src", "onLoad"], Wg = { class: "nf-ps-badge" }, Gg = {
  key: 0,
  class: "nf-progress"
}, qg = { class: "nf-ps-bar" }, Jg = ["data-level", "title"], Vl = 4, Yg = /* @__PURE__ */ rn({
  __name: "PreviewSelectorNode",
  props: {
    controller: {}
  },
  setup(e) {
    const n = e.controller, i = n.state, o = /* @__PURE__ */ Ve(), r = /* @__PURE__ */ Ve({ width: 0, height: 0 }), s = /* @__PURE__ */ Ve(1);
    let l, a;
    const d = $e(() => {
      const v = Bg({
        count: i.candidates.length,
        aspect: s.value,
        width: r.value.width,
        height: r.value.height,
        gap: Vl,
        previousCols: l
      });
      return l = v?.cols, v;
    }), u = $e(() => {
      const v = d.value;
      return v ? {
        gridTemplateColumns: `repeat(${v.cols}, ${v.cellW}px)`,
        gridTemplateRows: `repeat(${v.rows}, ${v.cellH}px)`,
        gap: `${Vl}px`
      } : {};
    });
    Cn(() => {
      a = new ResizeObserver(([v]) => {
        r.value = { width: Math.floor(v.contentRect.width), height: Math.floor(v.contentRect.height) };
      }), o.value && a.observe(o.value);
    }), Vi(() => {
      a?.disconnect(), n.dispose();
    }), lt(
      () => i.batchId,
      () => {
        l = void 0, s.value = 1;
      }
    );
    const c = $e(() => i.candidates.map((v) => ql(v)));
    function f(v, S) {
      n.noteContextClick(S), !ud() && (v.preventDefault(), v.stopPropagation(), dd(n.node, v));
    }
    function h(v, S) {
      const $ = v.target;
      S === 0 && $.naturalWidth && $.naturalHeight && (s.value = $.naturalWidth / $.naturalHeight);
    }
    const b = $e(() => n.job.value?.state ?? null), y = $e(() => {
      if (n.queueError.value) return { level: "error", text: n.queueError.value };
      const v = b.value, S = n.action.value === "continue" ? "Continue" : "Generate";
      if (n.starting.value) return { level: "muted", text: `${S}: queueing…` };
      if (v) {
        if (v.status === "queued") return { level: "muted", text: `${S}: waiting in queue…` };
        if (v.status === "running") return { level: "muted", text: `${S}: running (${v.nodesDone}/${v.nodesTotal})` };
        if (v.status === "error") return { level: "error", text: `${S} failed: ${v.error?.nodeType ? `${v.error.nodeType}: ` : ""}${v.error?.message}` };
        if (v.status === "interrupted") return { level: "warn", text: `${S} interrupted` };
        if (v.status === "cancelled") return { level: "muted", text: `${S} cancelled` };
      }
      return i.expired ? { level: "warn", text: "Candidates are no longer available (ComfyUI restarted). Generate again." } : i.candidates.length ? v?.status === "success" && n.action.value === "continue" ? { level: "info", text: `${i.selection.length} / ${i.candidates.length} selected · continued` } : { level: "muted", text: `${i.selection.length} / ${i.candidates.length} selected` } : { level: "muted", text: "Run the workflow or press Generate to get candidates." };
    }), w = $e(() => {
      const v = b.value?.status === "running" ? b.value.progress : null;
      return v && v.max > 1 ? Math.round(v.value / v.max * 100) : null;
    });
    return (v, S) => (I(), P("div", Kg, [
      K("div", {
        ref_key: "area",
        ref: o,
        class: "nf-ps-area"
      }, [
        B(i).candidates.length ? (I(), P("div", {
          key: 0,
          class: "nf-ps-grid",
          style: On(u.value)
        }, [
          (I(!0), P(ge, null, ht(c.value, ($, g) => (I(), P("button", {
            key: `${B(i).batchId}-${g}`,
            type: "button",
            class: st(["nf-ps-cell", { selected: B(i).selection.includes(g) }]),
            title: `#${g + 1}`,
            "aria-disabled": B(n).busy,
            onClick: (x) => B(n).toggle(g),
            onContextmenu: (x) => f(x, g)
          }, [
            K("img", {
              src: $,
              alt: "",
              draggable: "false",
              onLoad: (x) => h(x, g),
              onError: S[0] || (S[0] = (x) => B(n).markExpired())
            }, null, 40, Ug),
            K("span", Wg, oe(g + 1), 1)
          ], 42, Hg))), 128))
        ], 4)) : re("", !0)
      ], 512),
      w.value !== null ? (I(), P("div", Gg, [
        K("div", {
          class: "nf-progress-bar",
          style: On({ width: `${w.value}%` })
        }, null, 4)
      ])) : re("", !0),
      K("div", qg, [
        K("span", {
          class: "nf-ps-status",
          "data-level": y.value.level,
          title: y.value.text
        }, oe(y.value.text), 9, Jg),
        q(B(Ce), {
          class: "nf-icon-button",
          icon: "pi pi-check-square",
          title: "Select all",
          disabled: B(n).busy || !B(i).candidates.length,
          onClick: S[1] || (S[1] = ($) => B(n).selectAll())
        }, null, 8, ["disabled"]),
        q(B(Ce), {
          class: "nf-icon-button",
          icon: "pi pi-stop",
          title: "Clear selection",
          disabled: B(n).busy || !B(i).selection.length,
          onClick: S[2] || (S[2] = ($) => B(n).clearSelection())
        }, null, 8, ["disabled"]),
        B(n).busy ? (I(), ke(B(Ce), {
          key: 1,
          class: "nf-button nf-button-danger",
          icon: "pi pi-times",
          label: "Cancel",
          disabled: B(n).starting.value,
          onClick: S[5] || (S[5] = ($) => B(n).cancel())
        }, null, 8, ["disabled"])) : (I(), P(ge, { key: 0 }, [
          q(B(Ce), {
            class: "nf-button",
            icon: "pi pi-refresh",
            label: "Generate",
            title: "Run the upstream part again",
            onClick: S[3] || (S[3] = ($) => B(n).generate())
          }),
          q(B(Ce), {
            class: "nf-button nf-button-primary",
            icon: "pi pi-play",
            label: "Continue",
            title: "Run the downstream part with the selected images",
            disabled: !B(n).canContinue,
            onClick: S[4] || (S[4] = ($) => B(n).continue())
          }, null, 8, ["disabled"])
        ], 64))
      ])
    ]));
  }
}), Zi = [420, 480];
function Zg(e) {
  const t = new Dg(e), n = document.createElement("div");
  n.className = "nf-widget-container nf-ps-container";
  const i = Vr(e, "nf_preview_selector_ui", n, { getMinHeight: () => 120 }), { unmount: o } = Di(n, Yg, { controller: t }), r = i.onRemove;
  i.onRemove = () => {
    o(), r?.call(i);
  };
  const [s, l] = e.size;
  (s < Zi[0] || l < Zi[1]) && e.setSize?.([Math.max(s, Zi[0]), Math.max(l, Zi[1])]);
}
class vo extends Error {
}
async function Qg(e) {
  const t = await fetch(e);
  if (!t.ok) throw new vo(`Could not load the image (HTTP ${t.status})`);
  return t.blob();
}
async function Xg(e) {
  if (e.type === "image/png") return e;
  const t = await createImageBitmap(e), n = document.createElement("canvas");
  return n.width = t.width, n.height = t.height, n.getContext("2d").drawImage(t, 0, 0), new Promise(
    (i, o) => n.toBlob((r) => r ? i(r) : o(new vo("PNG conversion failed")), "image/png")
  );
}
async function em(e) {
  if (!window.isSecureContext || !navigator.clipboard?.write || typeof ClipboardItem > "u")
    throw new vo(
      "The browser does not allow copying images here (needs https or localhost). Use Open Image and copy from the new tab."
    );
  const t = Qg(e).then(Xg);
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": t })]);
  } catch (n) {
    throw n instanceof DOMException && n.name === "NotAllowedError" ? new vo(
      "The browser blocked clipboard access. Allow the clipboard permission for this site, or use Open Image."
    ) : n;
  }
}
function tm(e) {
  window.open(e, "_blank", "noopener");
}
function nm(e, t) {
  const n = document.createElement("a");
  n.href = e, n.download = t, document.body.appendChild(n), n.click(), n.remove();
}
function im(e) {
  const t = Ng(e), n = t?.menuTarget();
  if (!t || n === null || n === void 0) return [];
  const i = t.state.candidates[n], o = ql(i), r = `#${n + 1}`;
  return [
    null,
    // separator
    {
      content: `Copy Image (${r})`,
      callback: () => {
        em(o).then(() => vn("success", "Image copied", r)).catch((s) => vn("error", "Copy Image failed", s instanceof Error ? s.message : String(s)));
      }
    },
    { content: `Open Image (${r})`, callback: () => tm(o) },
    { content: `Save Image (${r})`, callback: () => nm(o, i.filename) }
  ];
}
class xn extends Error {
  status;
  code;
  details;
  constructor(t, n) {
    super(n.message), this.status = t, this.code = n.code, this.details = n.details;
  }
}
async function Bn(e, t = {}) {
  const n = new Headers(t.headers);
  t.body !== void 0 && !n.has("Content-Type") && n.set("Content-Type", "application/json");
  let i;
  try {
    i = await Xu(e, { ...t, headers: n });
  } catch (r) {
    throw new xn(0, { code: "NETWORK_ERROR", message: r instanceof Error ? r.message : String(r) });
  }
  let o = null;
  try {
    o = await i.json();
  } catch {
  }
  if (!i.ok) {
    const r = o?.error;
    throw new xn(i.status, r ?? { code: "HTTP_ERROR", message: `HTTP ${i.status}` });
  }
  return o;
}
const ft = {
  templateId: "template_id",
  variables: "variables",
  snapshot: "snapshot",
  pinSnapshot: "pin_snapshot"
}, om = ["input1", "input2"], rm = "NF_PromptTemplate", ji = "/nyafu/prompt_template", he = /* @__PURE__ */ on({
  templates: [],
  revision: "",
  loaded: !1,
  loading: !1,
  error: null
});
let Jn = null;
function Vo() {
  return Jn || (he.loading = !0, Jn = Bn(`${ji}/templates`).then((e) => {
    he.templates = e.templates, he.revision = e.revision, he.error = null, he.loaded = !0;
  }).catch((e) => {
    he.error = e instanceof xn ? e : new xn(0, { code: "UNKNOWN", message: String(e) });
  }).finally(() => {
    he.loading = !1, Jn = null;
  }), Jn);
}
function Mu() {
  return he.loaded ? Promise.resolve() : Vo();
}
function Xt(e) {
  return he.templates.find((t) => t.id === e);
}
const Fu = (e) => `${ji}/templates/${encodeURIComponent(e)}`;
async function as(e) {
  try {
    const t = await e();
    return he.revision = t.revision, t;
  } catch (t) {
    throw t instanceof xn && t.status === 409 && await Vo(), t;
  }
}
async function sm(e) {
  const t = await as(
    () => Bn(`${ji}/templates`, {
      method: "POST",
      body: JSON.stringify({ template: e, base_revision: he.revision })
    })
  );
  return he.templates = [...he.templates, t.template], t.template;
}
async function lm(e, t) {
  const n = await as(
    () => Bn(Fu(e), {
      method: "PUT",
      body: JSON.stringify({ template: t, base_revision: he.revision })
    })
  );
  return he.templates = he.templates.map((i) => i.id === e ? n.template : i), n.template;
}
async function am(e) {
  await as(
    () => Bn(
      `${Fu(e)}?base_revision=${encodeURIComponent(he.revision)}`,
      { method: "DELETE" }
    )
  ), he.templates = he.templates.filter((t) => t.id !== e);
}
function um(e) {
  if (typeof e != "string" || !e.trim()) return {};
  try {
    const t = JSON.parse(e);
    return t === null || typeof t != "object" || Array.isArray(t) ? {} : Object.fromEntries(Object.entries(t).filter(([, n]) => typeof n == "string"));
  } catch {
    return {};
  }
}
function Nl(e) {
  if (typeof e != "string" || !e.trim()) return null;
  try {
    const t = JSON.parse(e);
    if (t && typeof t == "object" && typeof t.id == "string" && typeof t.template == "string")
      return { category: "", negative_prompt: "", variables: {}, ...t };
  } catch {
  }
  return null;
}
function Dl(e) {
  const t = Object.fromEntries(Object.entries(e.variables ?? {}).sort(([n], [i]) => n.localeCompare(i)));
  return JSON.stringify([e.template, e.negative_prompt ?? "", t]);
}
function Vu(e, t) {
  return Dl(e) === Dl(t);
}
function dm(e, t = /* @__PURE__ */ new Date()) {
  const n = { ...e, captured_at: t.toISOString() };
  return JSON.stringify(n);
}
const cm = "Uncategorized";
function Nu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const o of e) {
    const r = o.category || "";
    t.has(r) || t.set(r, []), t.get(r).push({ id: o.id, name: o.name });
  }
  const n = [...t].filter(([o]) => o).map(([o, r]) => ({ label: o, items: r })), i = t.get("");
  return i && n.push({ label: cm, items: i }), n;
}
function fm(e, t, n, i) {
  if (i)
    return n ? { template: n, source: "snapshot", notice: "pinned" } : { template: null, source: null, notice: "pinned_without_snapshot" };
  if (!e) return { template: null, source: null, notice: "no_template" };
  if (t) {
    const o = n !== null && !Vu(n, t);
    return { template: t, source: "library", notice: o ? "snapshot_outdated" : "none" };
  }
  return n && n.id === e ? { template: n, source: "snapshot", notice: "template_missing" } : { template: null, source: null, notice: "not_found" };
}
class pm {
  constructor(t) {
    this.node = t, this.state = /* @__PURE__ */ on({
      templateId: "",
      variables: {},
      snapshot: null,
      pinned: !1,
      connectedInputs: []
    }), this.syncFromWidgets();
  }
  node;
  state;
  syncFromWidgets() {
    this.state.templateId = String(An(this.node, ft.templateId, "")), this.state.variables = um(An(this.node, ft.variables, "{}")), this.state.snapshot = Nl(An(this.node, ft.snapshot, "")), this.state.pinned = !!An(this.node, ft.pinSnapshot, !1), this.syncConnections();
  }
  syncConnections() {
    this.state.connectedInputs = om.filter((t) => Yu(this.node, t));
  }
  /** Select a template: reset variable values to its defaults and capture a snapshot. */
  selectTemplate(t) {
    const n = Xt(t);
    this.writeTemplateId(t), this.writeVariables({ ...n?.variables ?? {} }), this.captureSnapshot(), this.fit();
  }
  setVariable(t, n) {
    this.writeVariables({ ...this.state.variables, [t]: n });
  }
  resetVariable(t) {
    const n = Xt(this.state.templateId)?.variables ?? this.state.snapshot?.variables ?? {};
    this.setVariable(t, n[t] ?? "");
  }
  /**
   * Store the current library content as the snapshot (skipped when pinned or unknown).
   * Only rewritten when the content changed, so queueing does not mark the workflow modified.
   */
  captureSnapshot() {
    if (this.syncFromWidgets(), this.state.pinned) return;
    const t = Xt(this.state.templateId);
    if (!t) return;
    const n = this.state.snapshot;
    if (n && n.id === t.id && Vu(n, t)) return;
    const i = dm(t);
    No(this.node, ft.snapshot, i), this.state.snapshot = Nl(i);
  }
  fit() {
    requestAnimationFrame(() => Gl(this.node));
  }
  writeTemplateId(t) {
    No(this.node, ft.templateId, t), this.state.templateId = t;
  }
  writeVariables(t) {
    No(this.node, ft.variables, JSON.stringify(t)), this.state.variables = t;
  }
}
function ki(e) {
  "@babel/helpers - typeof";
  return ki = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ki(e);
}
function hm(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function gm(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, bm(i.key), i);
  }
}
function mm(e, t, n) {
  return t && gm(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function bm(e) {
  var t = vm(e, "string");
  return ki(t) == "symbol" ? t : t + "";
}
function vm(e, t) {
  if (ki(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ki(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var ym = /* @__PURE__ */ (function() {
  function e(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    hm(this, e), this.element = t, this.listener = n;
  }
  return mm(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = Vd(this.element);
      for (var n = 0; n < this.scrollableParents.length; n++)
        this.scrollableParents[n].addEventListener("scroll", this.listener);
    }
  }, {
    key: "unbindScrollListener",
    value: function() {
      if (this.scrollableParents)
        for (var n = 0; n < this.scrollableParents.length; n++)
          this.scrollableParents[n].removeEventListener("scroll", this.listener);
    }
  }, {
    key: "destroy",
    value: function() {
      this.unbindScrollListener(), this.element = null, this.listener = null, this.scrollableParents = null;
    }
  }]);
})(), us = {
  name: "BlankIcon",
  extends: zn
};
function Sm(e) {
  return Im(e) || xm(e) || Om(e) || wm();
}
function wm() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Om(e, t) {
  if (e) {
    if (typeof e == "string") return Tr(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Tr(e, t) : void 0;
  }
}
function xm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Im(e) {
  if (Array.isArray(e)) return Tr(e);
}
function Tr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function $m(e, t, n, i, o, r) {
  return I(), P("svg", V({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Sm(t[0] || (t[0] = [K("rect", {
    width: "1",
    height: "1",
    fill: "currentColor",
    "fill-opacity": "0"
  }, null, -1)])), 16);
}
us.render = $m;
var ds = {
  name: "CheckIcon",
  extends: zn
};
function _m(e) {
  return Pm(e) || Tm(e) || km(e) || Cm();
}
function Cm() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function km(e, t) {
  if (e) {
    if (typeof e == "string") return Pr(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Pr(e, t) : void 0;
  }
}
function Tm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Pm(e) {
  if (Array.isArray(e)) return Pr(e);
}
function Pr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Lm(e, t, n, i, o, r) {
  return I(), P("svg", V({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), _m(t[0] || (t[0] = [K("path", {
    d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
ds.render = Lm;
var Du = {
  name: "ChevronDownIcon",
  extends: zn
};
function Em(e) {
  return Vm(e) || Fm(e) || Mm(e) || Am();
}
function Am() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Mm(e, t) {
  if (e) {
    if (typeof e == "string") return Lr(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Lr(e, t) : void 0;
  }
}
function Fm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Vm(e) {
  if (Array.isArray(e)) return Lr(e);
}
function Lr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Nm(e, t, n, i, o, r) {
  return I(), P("svg", V({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Em(t[0] || (t[0] = [K("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Du.render = Nm;
var cs = {
  name: "SearchIcon",
  extends: zn
};
function Dm(e) {
  return Bm(e) || zm(e) || Rm(e) || jm();
}
function jm() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Rm(e, t) {
  if (e) {
    if (typeof e == "string") return Er(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Er(e, t) : void 0;
  }
}
function zm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Bm(e) {
  if (Array.isArray(e)) return Er(e);
}
function Er(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Km(e, t, n, i, o, r) {
  return I(), P("svg", V({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Dm(t[0] || (t[0] = [K("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
cs.render = Km;
var ju = {
  name: "TimesIcon",
  extends: zn
};
function Hm(e) {
  return qm(e) || Gm(e) || Wm(e) || Um();
}
function Um() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Wm(e, t) {
  if (e) {
    if (typeof e == "string") return Ar(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ar(e, t) : void 0;
  }
}
function Gm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function qm(e) {
  if (Array.isArray(e)) return Ar(e);
}
function Ar(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Jm(e, t, n, i, o, r) {
  return I(), P("svg", V({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Hm(t[0] || (t[0] = [K("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
ju.render = Jm;
var Ym = `
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`, Zm = {
  root: "p-iconfield"
}, Qm = be.extend({
  name: "iconfield",
  style: Ym,
  classes: Zm
}), Xm = {
  name: "BaseIconField",
  extends: kn,
  style: Qm,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, fs = {
  name: "IconField",
  extends: Xm,
  inheritAttrs: !1
};
function eb(e, t, n, i, o, r) {
  return I(), P("div", V({
    class: e.cx("root")
  }, e.ptmi("root")), [de(e.$slots, "default")], 16);
}
fs.render = eb;
var tb = {
  root: "p-inputicon"
}, nb = be.extend({
  name: "inputicon",
  classes: tb
}), ib = {
  name: "BaseInputIcon",
  extends: kn,
  style: nb,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, ps = {
  name: "InputIcon",
  extends: ib,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function ob(e, t, n, i, o, r) {
  return I(), P("span", V({
    class: r.containerClass
  }, e.ptmi("root"), {
    "aria-hidden": "true"
  }), [de(e.$slots, "default")], 16);
}
ps.render = ob;
var Ru = {
  name: "BaseEditableHolder",
  extends: kn,
  emits: ["update:modelValue", "value-change"],
  props: {
    modelValue: {
      type: null,
      default: void 0
    },
    defaultValue: {
      type: null,
      default: void 0
    },
    name: {
      type: String,
      default: void 0
    },
    invalid: {
      type: Boolean,
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    formControl: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcForm: {
      default: void 0
    },
    $pcFormField: {
      default: void 0
    }
  },
  data: function() {
    return {
      d_value: this.defaultValue !== void 0 ? this.defaultValue : this.modelValue
    };
  },
  watch: {
    modelValue: {
      deep: !0,
      handler: function(t) {
        this.d_value = t;
      }
    },
    defaultValue: function(t) {
      this.d_value = t;
    },
    $formName: {
      immediate: !0,
      handler: function(t) {
        var n, i;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (i = n.register) === null || i === void 0 ? void 0 : i.call(n, t, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(t) {
        var n, i;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (i = n.register) === null || i === void 0 ? void 0 : i.call(n, this.$formName, t)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(t) {
        this.d_value !== t && (this.d_value = t);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(t) {
        var n;
        (n = this.$pcForm) !== null && n !== void 0 && n.getFieldState(this.$formName) && t !== this.d_value && (this.d_value = t);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(t, n) {
      var i, o;
      this.controlled && (this.d_value = t, this.$emit("update:modelValue", t)), this.$emit("value-change", t), (i = (o = this.formField).onChange) === null || i === void 0 || i.call(o, {
        originalEvent: n,
        value: t
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++)
        n[i] = arguments[i];
      return n.find(ae);
    }
  },
  computed: {
    $filled: function() {
      return ae(this.d_value);
    },
    $invalid: function() {
      var t, n;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (t = this.$pcFormField) === null || t === void 0 || (t = t.$field) === null || t === void 0 ? void 0 : t.invalid, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.invalid);
    },
    $formName: function() {
      var t;
      return this.$formNovalidate ? void 0 : this.name || ((t = this.$formControl) === null || t === void 0 ? void 0 : t.name);
    },
    $formControl: function() {
      var t;
      return this.formControl || ((t = this.$pcFormField) === null || t === void 0 ? void 0 : t.formControl);
    },
    $formNovalidate: function() {
      var t;
      return (t = this.$formControl) === null || t === void 0 ? void 0 : t.novalidate;
    },
    $formDefaultValue: function() {
      var t, n;
      return this.findNonEmpty(this.d_value, (t = this.$pcFormField) === null || t === void 0 ? void 0 : t.initialValue, (n = this.$pcForm) === null || n === void 0 || (n = n.initialValues) === null || n === void 0 ? void 0 : n[this.$formName]);
    },
    $formValue: function() {
      var t, n;
      return this.findNonEmpty((t = this.$pcFormField) === null || t === void 0 || (t = t.$field) === null || t === void 0 ? void 0 : t.value, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, hs = {
  name: "BaseInput",
  extends: Ru,
  props: {
    size: {
      type: String,
      default: null
    },
    fluid: {
      type: Boolean,
      default: null
    },
    variant: {
      type: String,
      default: null
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcFluid: {
      default: void 0
    }
  },
  computed: {
    $variant: function() {
      var t;
      return (t = this.variant) !== null && t !== void 0 ? t : this.$primevue.config.inputStyle || this.$primevue.config.inputVariant;
    },
    $fluid: function() {
      var t;
      return (t = this.fluid) !== null && t !== void 0 ? t : !!this.$pcFluid;
    },
    // @deprecated use $fluid instead
    hasFluid: function() {
      return this.$fluid;
    }
  }
}, rb = `
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`, sb = {
  root: function(t) {
    var n = t.instance, i = t.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": i.size === "small",
      "p-inputtext-lg p-inputfield-lg": i.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, lb = be.extend({
  name: "inputtext",
  style: rb,
  classes: sb
}), ab = {
  name: "BaseInputText",
  extends: hs,
  style: lb,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function Ti(e) {
  "@babel/helpers - typeof";
  return Ti = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ti(e);
}
function ub(e, t, n) {
  return (t = db(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function db(e) {
  var t = cb(e, "string");
  return Ti(t) == "symbol" ? t : t + "";
}
function cb(e, t) {
  if (Ti(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Ti(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var jn = {
  name: "InputText",
  extends: ab,
  inheritAttrs: !1,
  methods: {
    onInput: function(t) {
      this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return V(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return rt(ub({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, fb = ["value", "name", "disabled", "aria-invalid", "data-p"];
function pb(e, t, n, i, o, r) {
  return I(), P("input", V({
    type: "text",
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.$invalid || void 0,
    "data-p": r.dataP,
    onInput: t[0] || (t[0] = function() {
      return r.onInput && r.onInput.apply(r, arguments);
    })
  }, r.attrs), null, 16, fb);
}
jn.render = pb;
var hb = Dr(), zu = {
  name: "Portal",
  props: {
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    disabled: {
      type: Boolean,
      default: !1
    }
  },
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = sa();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function gb(e, t, n, i, o, r) {
  return r.inline ? de(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (I(), ke(Zc, {
    key: 1,
    to: n.appendTo
  }, [de(e.$slots, "default")], 8, ["to"])) : re("", !0);
}
zu.render = gb;
var mb = `
    .p-virtualscroller-loader {
        background: dt('virtualscroller.loader.mask.background');
        color: dt('virtualscroller.loader.mask.color');
    }

    .p-virtualscroller-loading-icon {
        font-size: dt('virtualscroller.loader.icon.size');
        width: dt('virtualscroller.loader.icon.size');
        height: dt('virtualscroller.loader.icon.size');
    }
`, bb = `
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}

.p-virtualscroller .p-virtualscroller-loading {
    transform: none !important;
    min-height: 0;
    position: sticky;
    inset-block-start: 0;
    inset-inline-start: 0;
}
`, jl = be.extend({
  name: "virtualscroller",
  css: bb,
  style: mb
}), vb = {
  name: "BaseVirtualScroller",
  extends: kn,
  props: {
    id: {
      type: String,
      default: null
    },
    style: null,
    class: null,
    items: {
      type: Array,
      default: null
    },
    itemSize: {
      type: [Number, Array],
      default: 0
    },
    scrollHeight: null,
    scrollWidth: null,
    orientation: {
      type: String,
      default: "vertical"
    },
    numToleratedItems: {
      type: Number,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    },
    resizeDelay: {
      type: Number,
      default: 10
    },
    lazy: {
      type: Boolean,
      default: !1
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    loaderDisabled: {
      type: Boolean,
      default: !1
    },
    columns: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: !1
    },
    showSpacer: {
      type: Boolean,
      default: !0
    },
    showLoader: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: 0
    },
    inline: {
      type: Boolean,
      default: !1
    },
    step: {
      type: Number,
      default: 0
    },
    appendOnly: {
      type: Boolean,
      default: !1
    },
    autoSize: {
      type: Boolean,
      default: !1
    }
  },
  style: jl,
  provide: function() {
    return {
      $pcVirtualScroller: this,
      $parentInstance: this
    };
  },
  beforeMount: function() {
    var t;
    jl.loadCSS({
      nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
    });
  }
};
function Pi(e) {
  "@babel/helpers - typeof";
  return Pi = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pi(e);
}
function Rl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Yn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Rl(Object(n), !0).forEach(function(i) {
      Bu(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Rl(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Bu(e, t, n) {
  return (t = yb(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function yb(e) {
  var t = Sb(e, "string");
  return Pi(t) == "symbol" ? t : t + "";
}
function Sb(e, t) {
  if (Pi(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Pi(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var gs = {
  name: "VirtualScroller",
  extends: vb,
  inheritAttrs: !1,
  emits: ["update:numToleratedItems", "scroll", "scroll-index-change", "lazy-load"],
  data: function() {
    var t = this.isBoth();
    return {
      first: t ? {
        rows: 0,
        cols: 0
      } : 0,
      last: t ? {
        rows: 0,
        cols: 0
      } : 0,
      page: t ? {
        rows: 0,
        cols: 0
      } : 0,
      numItemsInViewport: t ? {
        rows: 0,
        cols: 0
      } : 0,
      lastScrollPos: t ? {
        top: 0,
        left: 0
      } : 0,
      d_numToleratedItems: this.numToleratedItems,
      d_loading: this.loading,
      loaderArr: [],
      spacerStyle: {},
      contentStyle: {}
    };
  },
  element: null,
  content: null,
  lastScrollPos: null,
  scrollTimeout: null,
  resizeTimeout: null,
  defaultWidth: 0,
  defaultHeight: 0,
  defaultContentWidth: 0,
  defaultContentHeight: 0,
  isRangeChanged: !1,
  lazyLoadState: {},
  resizeListener: null,
  resizeObserver: null,
  initialized: !1,
  watch: {
    numToleratedItems: function(t) {
      this.d_numToleratedItems = t;
    },
    loading: function(t, n) {
      this.lazy && t !== n && t !== this.d_loading && (this.d_loading = t);
    },
    items: {
      handler: function(t, n) {
        (!n || n.length !== (t || []).length) && (this.init(), this.calculateAutoSize());
      },
      deep: !0
    },
    itemSize: function() {
      this.init(), this.calculateAutoSize();
    },
    orientation: function() {
      this.lastScrollPos = this.isBoth() ? {
        top: 0,
        left: 0
      } : 0;
    },
    scrollHeight: function() {
      this.init(), this.calculateAutoSize();
    },
    scrollWidth: function() {
      this.init(), this.calculateAutoSize();
    }
  },
  mounted: function() {
    this.viewInit(), this.lastScrollPos = this.isBoth() ? {
      top: 0,
      left: 0
    } : 0, this.lazyLoadState = this.lazyLoadState || {};
  },
  updated: function() {
    !this.initialized && this.viewInit();
  },
  unmounted: function() {
    this.unbindResizeListener(), this.initialized = !1;
  },
  methods: {
    viewInit: function() {
      oo(this.element) && (this.setContentEl(this.content), this.init(), this.calculateAutoSize(), this.defaultWidth = hn(this.element), this.defaultHeight = pn(this.element), this.defaultContentWidth = hn(this.content), this.defaultContentHeight = pn(this.content), this.initialized = !0), this.element && this.bindResizeListener();
    },
    init: function() {
      this.disabled || (this.setSize(), this.calculateOptions(), this.setSpacerSize());
    },
    isVertical: function() {
      return this.orientation === "vertical";
    },
    isHorizontal: function() {
      return this.orientation === "horizontal";
    },
    isBoth: function() {
      return this.orientation === "both";
    },
    scrollTo: function(t) {
      this.element && this.element.scrollTo(t);
    },
    scrollToIndex: function(t) {
      var n = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto", o = this.isBoth(), r = this.isHorizontal(), s = o ? t.every(function(L) {
        return L > -1;
      }) : t > -1;
      if (s) {
        var l = this.first, a = this.element, d = a.scrollTop, u = d === void 0 ? 0 : d, c = a.scrollLeft, f = c === void 0 ? 0 : c, h = this.calculateNumItems(), b = h.numToleratedItems, y = this.getContentPosition(), w = this.itemSize, v = function() {
          var j = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, N = arguments.length > 1 ? arguments[1] : void 0;
          return j <= N ? 0 : j;
        }, S = function(j, N, G) {
          return j * N + G;
        }, $ = function() {
          var j = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, N = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.scrollTo({
            left: j,
            top: N,
            behavior: i
          });
        }, g = o ? {
          rows: 0,
          cols: 0
        } : 0, x = !1, D = !1;
        o ? (g = {
          rows: v(t[0], b[0]),
          cols: v(t[1], b[1])
        }, $(S(g.cols, w[1], y.left), S(g.rows, w[0], y.top)), D = this.lastScrollPos.top !== u || this.lastScrollPos.left !== f, x = g.rows !== l.rows || g.cols !== l.cols) : (g = v(t, b), r ? $(S(g, w, y.left), u) : $(f, S(g, w, y.top)), D = this.lastScrollPos !== (r ? f : u), x = g !== l), this.isRangeChanged = x, D && (this.first = g);
      }
    },
    scrollInView: function(t, n) {
      var i = this, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "auto";
      if (n) {
        var r = this.isBoth(), s = this.isHorizontal(), l = r ? t.every(function(w) {
          return w > -1;
        }) : t > -1;
        if (l) {
          var a = this.getRenderedRange(), d = a.first, u = a.viewport, c = function() {
            var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return i.scrollTo({
              left: v,
              top: S,
              behavior: o
            });
          }, f = n === "to-start", h = n === "to-end";
          if (f) {
            if (r)
              u.first.rows - d.rows > t[0] ? c(u.first.cols * this.itemSize[1], (u.first.rows - 1) * this.itemSize[0]) : u.first.cols - d.cols > t[1] && c((u.first.cols - 1) * this.itemSize[1], u.first.rows * this.itemSize[0]);
            else if (u.first - d > t) {
              var b = (u.first - 1) * this.itemSize;
              s ? c(b, 0) : c(0, b);
            }
          } else if (h) {
            if (r)
              u.last.rows - d.rows <= t[0] + 1 ? c(u.first.cols * this.itemSize[1], (u.first.rows + 1) * this.itemSize[0]) : u.last.cols - d.cols <= t[1] + 1 && c((u.first.cols + 1) * this.itemSize[1], u.first.rows * this.itemSize[0]);
            else if (u.last - d <= t + 1) {
              var y = (u.first + 1) * this.itemSize;
              s ? c(y, 0) : c(0, y);
            }
          }
        }
      } else
        this.scrollToIndex(t, o);
    },
    getRenderedRange: function() {
      var t = function(c, f) {
        return Math.floor(c / (f || c));
      }, n = this.first, i = 0;
      if (this.element) {
        var o = this.isBoth(), r = this.isHorizontal(), s = this.element, l = s.scrollTop, a = s.scrollLeft;
        if (o)
          n = {
            rows: t(l, this.itemSize[0]),
            cols: t(a, this.itemSize[1])
          }, i = {
            rows: n.rows + this.numItemsInViewport.rows,
            cols: n.cols + this.numItemsInViewport.cols
          };
        else {
          var d = r ? a : l;
          n = t(d, this.itemSize), i = n + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: n,
          last: i
        }
      };
    },
    calculateNumItems: function() {
      var t = this.isBoth(), n = this.isHorizontal(), i = this.itemSize, o = this.getContentPosition(), r = this.element ? this.element.offsetWidth - o.left : 0, s = this.element ? this.element.offsetHeight - o.top : 0, l = function(f, h) {
        return Math.ceil(f / (h || f));
      }, a = function(f) {
        return Math.ceil(f / 2);
      }, d = t ? {
        rows: l(s, i[0]),
        cols: l(r, i[1])
      } : l(n ? r : s, i), u = this.d_numToleratedItems || (t ? [a(d.rows), a(d.cols)] : a(d));
      return {
        numItemsInViewport: d,
        numToleratedItems: u
      };
    },
    calculateOptions: function() {
      var t = this, n = this.isBoth(), i = this.first, o = this.calculateNumItems(), r = o.numItemsInViewport, s = o.numToleratedItems, l = function(u, c, f) {
        var h = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
        return t.getLast(u + c + (u < f ? 2 : 3) * f, h);
      }, a = n ? {
        rows: l(i.rows, r.rows, s[0]),
        cols: l(i.cols, r.cols, s[1], !0)
      } : l(i, r, s);
      this.last = a, this.numItemsInViewport = r, this.d_numToleratedItems = s, this.$emit("update:numToleratedItems", this.d_numToleratedItems), this.showLoader && (this.loaderArr = n ? Array.from({
        length: r.rows
      }).map(function() {
        return Array.from({
          length: r.cols
        });
      }) : Array.from({
        length: r
      })), this.lazy && Promise.resolve().then(function() {
        var d;
        t.lazyLoadState = {
          first: t.step ? n ? {
            rows: 0,
            cols: i.cols
          } : 0 : i,
          last: Math.min(t.step ? t.step : a, ((d = t.items) === null || d === void 0 ? void 0 : d.length) || 0)
        }, t.$emit("lazy-load", t.lazyLoadState);
      });
    },
    calculateAutoSize: function() {
      var t = this;
      this.autoSize && !this.d_loading && Promise.resolve().then(function() {
        if (t.content) {
          var n = t.isBoth(), i = t.isHorizontal(), o = t.isVertical();
          t.content.style.minHeight = t.content.style.minWidth = "auto", t.content.style.position = "relative", t.element.style.contain = "none";
          var r = [hn(t.element), pn(t.element)], s = r[0], l = r[1];
          (n || i) && (t.element.style.width = s < t.defaultWidth ? s + "px" : t.scrollWidth || t.defaultWidth + "px"), (n || o) && (t.element.style.height = l < t.defaultHeight ? l + "px" : t.scrollHeight || t.defaultHeight + "px"), t.content.style.minHeight = t.content.style.minWidth = "", t.content.style.position = "", t.element.style.contain = "";
        }
      });
    },
    getLast: function() {
      var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, o = arguments.length > 1 ? arguments[1] : void 0;
      return this.items ? Math.min(o ? ((t = this.columns || this.items[0]) === null || t === void 0 ? void 0 : t.length) || 0 : ((n = this.items) === null || n === void 0 ? void 0 : n.length) || 0, i) : 0;
    },
    getContentPosition: function() {
      if (this.content) {
        var t = getComputedStyle(this.content), n = parseFloat(t.paddingLeft) + Math.max(parseFloat(t.left) || 0, 0), i = parseFloat(t.paddingRight) + Math.max(parseFloat(t.right) || 0, 0), o = parseFloat(t.paddingTop) + Math.max(parseFloat(t.top) || 0, 0), r = parseFloat(t.paddingBottom) + Math.max(parseFloat(t.bottom) || 0, 0);
        return {
          left: n,
          right: i,
          top: o,
          bottom: r,
          x: n + i,
          y: o + r
        };
      }
      return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        x: 0,
        y: 0
      };
    },
    setSize: function() {
      var t = this;
      if (this.element) {
        var n = this.isBoth(), i = this.isHorizontal(), o = this.element.parentElement, r = this.scrollWidth || "".concat(this.element.offsetWidth || o.offsetWidth, "px"), s = this.scrollHeight || "".concat(this.element.offsetHeight || o.offsetHeight, "px"), l = function(d, u) {
          return t.element.style[d] = u;
        };
        n || i ? (l("height", s), l("width", r)) : l("height", s);
      }
    },
    setSpacerSize: function() {
      var t = this, n = this.items;
      if (n) {
        var i = this.isBoth(), o = this.isHorizontal(), r = this.getContentPosition(), s = function(a, d, u) {
          var c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          return t.spacerStyle = Yn(Yn({}, t.spacerStyle), Bu({}, "".concat(a), (d || []).length * u + c + "px"));
        };
        i ? (s("height", n, this.itemSize[0], r.y), s("width", this.columns || n[1], this.itemSize[1], r.x)) : o ? s("width", this.columns || n, this.itemSize, r.x) : s("height", n, this.itemSize, r.y);
      }
    },
    setContentPosition: function(t) {
      var n = this;
      if (this.content && !this.appendOnly) {
        var i = this.isBoth(), o = this.isHorizontal(), r = t ? t.first : this.first, s = function(u, c) {
          return u * c;
        }, l = function() {
          var u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.contentStyle = Yn(Yn({}, n.contentStyle), {
            transform: "translate3d(".concat(u, "px, ").concat(c, "px, 0)")
          });
        };
        if (i)
          l(s(r.cols, this.itemSize[1]), s(r.rows, this.itemSize[0]));
        else {
          var a = s(r, this.itemSize);
          o ? l(a, 0) : l(0, a);
        }
      }
    },
    onScrollPositionChange: function(t) {
      var n = this, i = t.target, o = this.isBoth(), r = this.isHorizontal(), s = this.getContentPosition(), l = function(U, E) {
        return U ? U > E ? U - E : U : 0;
      }, a = function(U, E) {
        return Math.floor(U / (E || U));
      }, d = function(U, E, te, X, ce, se) {
        return U <= ce ? ce : se ? te - X - ce : E + ce - 1;
      }, u = function(U, E, te, X, ce, se, ne, le) {
        if (U <= se) return 0;
        var Te = Math.max(0, ne ? U < E ? te : U - se : U > E ? te : U - 2 * se), z = n.getLast(Te, le);
        return Te > z ? z - ce : Te;
      }, c = function(U, E, te, X, ce, se) {
        var ne = E + X + 2 * ce;
        return U >= ce && (ne += ce + 1), n.getLast(ne, se);
      }, f = l(i.scrollTop, s.top), h = l(i.scrollLeft, s.left), b = o ? {
        rows: 0,
        cols: 0
      } : 0, y = this.last, w = !1, v = this.lastScrollPos;
      if (o) {
        var S = this.lastScrollPos.top <= f, $ = this.lastScrollPos.left <= h;
        if (!this.appendOnly || this.appendOnly && (S || $)) {
          var g = {
            rows: a(f, this.itemSize[0]),
            cols: a(h, this.itemSize[1])
          }, x = {
            rows: d(g.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], S),
            cols: d(g.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], $)
          };
          b = {
            rows: u(g.rows, x.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], S),
            cols: u(g.cols, x.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], $, !0)
          }, y = {
            rows: c(g.rows, b.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: c(g.cols, b.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], !0)
          }, w = b.rows !== this.first.rows || y.rows !== this.last.rows || b.cols !== this.first.cols || y.cols !== this.last.cols || this.isRangeChanged, v = {
            top: f,
            left: h
          };
        }
      } else {
        var D = r ? h : f, L = this.lastScrollPos <= D;
        if (!this.appendOnly || this.appendOnly && L) {
          var j = a(D, this.itemSize), N = d(j, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, L);
          b = u(j, N, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, L), y = c(j, b, this.last, this.numItemsInViewport, this.d_numToleratedItems), w = b !== this.first || y !== this.last || this.isRangeChanged, v = D;
        }
      }
      return {
        first: b,
        last: y,
        isRangeChanged: w,
        scrollPos: v
      };
    },
    onScrollChange: function(t) {
      var n = this.onScrollPositionChange(t), i = n.first, o = n.last, r = n.isRangeChanged, s = n.scrollPos;
      if (r) {
        var l = {
          first: i,
          last: o
        };
        if (this.setContentPosition(l), this.first = i, this.last = o, this.lastScrollPos = s, this.$emit("scroll-index-change", l), this.lazy && this.isPageChanged(i)) {
          var a, d, u = {
            first: this.step ? Math.min(this.getPageByFirst(i) * this.step, (((a = this.items) === null || a === void 0 ? void 0 : a.length) || 0) - this.step) : i,
            last: Math.min(this.step ? (this.getPageByFirst(i) + 1) * this.step : o, ((d = this.items) === null || d === void 0 ? void 0 : d.length) || 0)
          }, c = this.lazyLoadState.first !== u.first || this.lazyLoadState.last !== u.last;
          c && this.$emit("lazy-load", u), this.lazyLoadState = u;
        }
      }
    },
    onScroll: function(t) {
      var n = this;
      if (this.$emit("scroll", t), this.delay) {
        if (this.scrollTimeout && clearTimeout(this.scrollTimeout), this.isPageChanged()) {
          if (!this.d_loading && this.showLoader) {
            var i = this.onScrollPositionChange(t), o = i.isRangeChanged, r = o || (this.step ? this.isPageChanged() : !1);
            r && (this.d_loading = !0);
          }
          this.scrollTimeout = setTimeout(function() {
            n.onScrollChange(t), n.d_loading && n.showLoader && (!n.lazy || n.loading === void 0) && (n.d_loading = !1, n.page = n.getPageByFirst());
          }, this.delay);
        }
      } else
        this.onScrollChange(t);
    },
    onResize: function() {
      var t = this;
      this.resizeTimeout && clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
        if (oo(t.element)) {
          var n = t.isBoth(), i = t.isVertical(), o = t.isHorizontal(), r = [hn(t.element), pn(t.element)], s = r[0], l = r[1], a = s !== t.defaultWidth, d = l !== t.defaultHeight, u = n ? a || d : o ? a : i ? d : !1;
          u && (t.d_numToleratedItems = t.numToleratedItems, t.defaultWidth = s, t.defaultHeight = l, t.defaultContentWidth = hn(t.content), t.defaultContentHeight = pn(t.content), t.init());
        }
      }, this.resizeDelay);
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = this.onResize.bind(this), window.addEventListener("resize", this.resizeListener), window.addEventListener("orientationchange", this.resizeListener), this.resizeObserver = new ResizeObserver(function() {
        t.onResize();
      }), this.resizeObserver.observe(this.element));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), window.removeEventListener("orientationchange", this.resizeListener), this.resizeListener = null), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null);
    },
    getOptions: function(t) {
      var n = (this.items || []).length, i = this.isBoth() ? this.first.rows + t : this.first + t;
      return {
        index: i,
        count: n,
        first: i === 0,
        last: i === n - 1,
        even: i % 2 === 0,
        odd: i % 2 !== 0
      };
    },
    getLoaderOptions: function(t, n) {
      var i = this.loaderArr.length;
      return Yn({
        index: t,
        count: i,
        first: t === 0,
        last: t === i - 1,
        even: t % 2 === 0,
        odd: t % 2 !== 0
      }, n);
    },
    getPageByFirst: function(t) {
      return Math.floor(((t ?? this.first) + this.d_numToleratedItems * 4) / (this.step || 1));
    },
    isPageChanged: function(t) {
      return this.step && !this.lazy ? this.page !== this.getPageByFirst(t ?? this.first) : !0;
    },
    setContentEl: function(t) {
      this.content = t || this.content || Ai(this.element, '[data-pc-section="content"]');
    },
    elementRef: function(t) {
      this.element = t;
    },
    contentRef: function(t) {
      this.content = t;
    }
  },
  computed: {
    containerClass: function() {
      return ["p-virtualscroller", this.class, {
        "p-virtualscroller-inline": this.inline,
        "p-virtualscroller-both p-both-scroll": this.isBoth(),
        "p-virtualscroller-horizontal p-horizontal-scroll": this.isHorizontal()
      }];
    },
    contentClass: function() {
      return ["p-virtualscroller-content", {
        "p-virtualscroller-loading": this.d_loading
      }];
    },
    loaderClass: function() {
      return ["p-virtualscroller-loader", {
        "p-virtualscroller-loader-mask": !this.$slots.loader
      }];
    },
    loadedItems: function() {
      var t = this;
      return this.items && !this.d_loading ? this.isBoth() ? this.items.slice(this.appendOnly ? 0 : this.first.rows, this.last.rows).map(function(n) {
        return t.columns ? n : n.slice(t.appendOnly ? 0 : t.first.cols, t.last.cols);
      }) : this.isHorizontal() && this.columns ? this.items : this.items.slice(this.appendOnly ? 0 : this.first, this.last) : [];
    },
    loadedRows: function() {
      return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
    },
    loadedColumns: function() {
      if (this.columns) {
        var t = this.isBoth(), n = this.isHorizontal();
        if (t || n)
          return this.d_loading && this.loaderDisabled ? t ? this.loaderArr[0] : this.loaderArr : this.columns.slice(t ? this.first.cols : this.first, t ? this.last.cols : this.last);
      }
      return this.columns;
    }
  },
  components: {
    SpinnerIcon: Fo
  }
}, wb = ["tabindex"];
function Ob(e, t, n, i, o, r) {
  var s = Le("SpinnerIcon");
  return e.disabled ? (I(), P(ge, {
    key: 1
  }, [de(e.$slots, "default"), de(e.$slots, "content", {
    items: e.items,
    rows: e.items,
    columns: r.loadedColumns
  })], 64)) : (I(), P("div", V({
    key: 0,
    ref: r.elementRef,
    class: r.containerClass,
    tabindex: e.tabindex,
    style: e.style,
    onScroll: t[0] || (t[0] = function() {
      return r.onScroll && r.onScroll.apply(r, arguments);
    })
  }, e.ptmi("root")), [de(e.$slots, "content", {
    styleClass: r.contentClass,
    items: r.loadedItems,
    getItemOptions: r.getOptions,
    loading: o.d_loading,
    getLoaderOptions: r.getLoaderOptions,
    itemSize: e.itemSize,
    rows: r.loadedRows,
    columns: r.loadedColumns,
    contentRef: r.contentRef,
    spacerStyle: o.spacerStyle,
    contentStyle: o.contentStyle,
    vertical: r.isVertical(),
    horizontal: r.isHorizontal(),
    both: r.isBoth()
  }, function() {
    return [K("div", V({
      ref: r.contentRef,
      class: r.contentClass,
      style: o.contentStyle
    }, e.ptm("content")), [(I(!0), P(ge, null, ht(r.loadedItems, function(l, a) {
      return de(e.$slots, "item", {
        key: a,
        item: l,
        options: r.getOptions(a)
      });
    }), 128))], 16)];
  }), e.showSpacer ? (I(), P("div", V({
    key: 0,
    class: "p-virtualscroller-spacer",
    style: o.spacerStyle
  }, e.ptm("spacer")), null, 16)) : re("", !0), !e.loaderDisabled && e.showLoader && o.d_loading ? (I(), P("div", V({
    key: 1,
    class: r.loaderClass
  }, e.ptm("loader")), [e.$slots && e.$slots.loader ? (I(!0), P(ge, {
    key: 0
  }, ht(o.loaderArr, function(l, a) {
    return de(e.$slots, "loader", {
      key: a,
      options: r.getLoaderOptions(a, r.isBoth() && {
        numCols: e.d_numItemsInViewport.cols
      })
    });
  }), 128)) : re("", !0), de(e.$slots, "loadingicon", {}, function() {
    return [q(s, V({
      spin: "",
      class: "p-virtualscroller-loading-icon"
    }, e.ptm("loadingIcon")), null, 16)];
  })], 16)) : re("", !0)], 16, wb));
}
gs.render = Ob;
var xb = `
    .p-select {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('select.background');
        border: 1px solid dt('select.border.color');
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            outline-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration');
        border-radius: dt('select.border.radius');
        outline-color: transparent;
        box-shadow: dt('select.shadow');
    }

    .p-select:not(.p-disabled):hover {
        border-color: dt('select.hover.border.color');
    }

    .p-select:not(.p-disabled).p-focus {
        border-color: dt('select.focus.border.color');
        box-shadow: dt('select.focus.ring.shadow');
        outline: dt('select.focus.ring.width') dt('select.focus.ring.style') dt('select.focus.ring.color');
        outline-offset: dt('select.focus.ring.offset');
    }

    .p-select.p-variant-filled {
        background: dt('select.filled.background');
    }

    .p-select.p-variant-filled:not(.p-disabled):hover {
        background: dt('select.filled.hover.background');
    }

    .p-select.p-variant-filled:not(.p-disabled).p-focus {
        background: dt('select.filled.focus.background');
    }

    .p-select.p-invalid {
        border-color: dt('select.invalid.border.color');
    }

    .p-select.p-disabled {
        opacity: 1;
        background: dt('select.disabled.background');
    }

    .p-select-clear-icon {
        align-self: center;
        color: dt('select.clear.icon.color');
        inset-inline-end: dt('select.dropdown.width');
    }

    .p-select-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('select.dropdown.color');
        width: dt('select.dropdown.width');
        border-start-end-radius: dt('select.border.radius');
        border-end-end-radius: dt('select.border.radius');
    }

    .p-select-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        padding: dt('select.padding.y') dt('select.padding.x');
        text-overflow: ellipsis;
        cursor: pointer;
        color: dt('select.color');
        background: transparent;
        border: 0 none;
        outline: 0 none;
        font-size: 1rem;
    }

    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.p-invalid .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }

    .p-select.p-disabled .p-select-label {
        color: dt('select.disabled.color');
    }

    .p-select-label-empty {
        overflow: hidden;
        opacity: 0;
    }

    input.p-select-label {
        cursor: default;
    }

    .p-select-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('select.overlay.background');
        color: dt('select.overlay.color');
        border: 1px solid dt('select.overlay.border.color');
        border-radius: dt('select.overlay.border.radius');
        box-shadow: dt('select.overlay.shadow');
        min-width: 100%;
        transform-origin: inherit;
        will-change: transform;
    }

    .p-select-header {
        padding: dt('select.list.header.padding');
    }

    .p-select-filter {
        width: 100%;
    }

    .p-select-list-container {
        overflow: auto;
    }

    .p-select-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('select.option.group.padding');
        background: dt('select.option.group.background');
        color: dt('select.option.group.color');
        font-weight: dt('select.option.group.font.weight');
    }

    .p-select-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('select.list.padding');
        gap: dt('select.list.gap');
        display: flex;
        flex-direction: column;
    }

    .p-select-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('select.option.padding');
        border: 0 none;
        color: dt('select.option.color');
        background: transparent;
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration'),
            outline-color dt('select.transition.duration');
        border-radius: dt('select.option.border.radius');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled):hover {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option.p-select-option-selected {
        background: dt('select.option.selected.background');
        color: dt('select.option.selected.color');
    }

    .p-select-option.p-select-option-selected.p-focus {
        background: dt('select.option.selected.focus.background');
        color: dt('select.option.selected.focus.color');
    }
   
    .p-select-option-blank-icon {
        flex-shrink: 0;
    }

    .p-select-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('select.checkmark.gutter.start');
        margin-inline-end: dt('select.checkmark.gutter.end');
        color: dt('select.checkmark.color');
    }

    .p-select-empty-message {
        padding: dt('select.empty.message.padding');
    }

    .p-select-fluid {
        display: flex;
        width: 100%;
    }

    .p-select-sm .p-select-label {
        font-size: dt('select.sm.font.size');
        padding-block: dt('select.sm.padding.y');
        padding-inline: dt('select.sm.padding.x');
    }

    .p-select-sm .p-select-dropdown .p-icon {
        font-size: dt('select.sm.font.size');
        width: dt('select.sm.font.size');
        height: dt('select.sm.font.size');
    }

    .p-select-lg .p-select-label {
        font-size: dt('select.lg.font.size');
        padding-block: dt('select.lg.padding.y');
        padding-inline: dt('select.lg.padding.x');
    }

    .p-select-lg .p-select-dropdown .p-icon {
        font-size: dt('select.lg.font.size');
        width: dt('select.lg.font.size');
        height: dt('select.lg.font.size');
    }

    .p-floatlabel-in .p-select-filter {
        padding-block-start: dt('select.padding.y');
        padding-block-end: dt('select.padding.y');
    }
`, Ib = {
  root: function(t) {
    var n = t.instance, i = t.props, o = t.state;
    return ["p-select p-component p-inputwrapper", {
      "p-disabled": i.disabled,
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-focus": o.focused,
      "p-inputwrapper-filled": n.$filled,
      "p-inputwrapper-focus": o.focused || o.overlayVisible,
      "p-select-open": o.overlayVisible,
      "p-select-fluid": n.$fluid,
      "p-select-sm p-inputfield-sm": i.size === "small",
      "p-select-lg p-inputfield-lg": i.size === "large"
    }];
  },
  label: function(t) {
    var n, i = t.instance, o = t.props;
    return ["p-select-label", {
      "p-placeholder": !o.editable && i.label === o.placeholder,
      "p-select-label-empty": !o.editable && !i.$slots.value && (i.label === "p-emptylabel" || ((n = i.label) === null || n === void 0 ? void 0 : n.length) === 0)
    }];
  },
  clearIcon: "p-select-clear-icon",
  dropdown: "p-select-dropdown",
  loadingicon: "p-select-loading-icon",
  dropdownIcon: "p-select-dropdown-icon",
  overlay: "p-select-overlay p-component",
  header: "p-select-header",
  pcFilter: "p-select-filter",
  listContainer: "p-select-list-container",
  list: "p-select-list",
  optionGroup: "p-select-option-group",
  optionGroupLabel: "p-select-option-group-label",
  option: function(t) {
    var n = t.instance, i = t.props, o = t.state, r = t.option, s = t.focusedOption;
    return ["p-select-option", {
      "p-select-option-selected": n.isSelected(r) && i.highlightOnSelect,
      "p-focus": o.focusedOptionIndex === s,
      "p-disabled": n.isOptionDisabled(r)
    }];
  },
  optionLabel: "p-select-option-label",
  optionCheckIcon: "p-select-option-check-icon",
  optionBlankIcon: "p-select-option-blank-icon",
  emptyMessage: "p-select-empty-message"
}, $b = be.extend({
  name: "select",
  style: xb,
  classes: Ib
}), _b = {
  name: "BaseSelect",
  extends: hs,
  props: {
    options: Array,
    optionLabel: [String, Function],
    optionValue: [String, Function],
    optionDisabled: [String, Function],
    optionGroupLabel: [String, Function],
    optionGroupChildren: [String, Function],
    scrollHeight: {
      type: String,
      default: "14rem"
    },
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      default: "contains"
    },
    filterFields: {
      type: Array,
      default: null
    },
    editable: Boolean,
    placeholder: {
      type: String,
      default: null
    },
    dataKey: null,
    showClear: {
      type: Boolean,
      default: !1
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    labelId: {
      type: String,
      default: null
    },
    labelClass: {
      type: [String, Object],
      default: null
    },
    labelStyle: {
      type: Object,
      default: null
    },
    panelClass: {
      type: [String, Object],
      default: null
    },
    overlayStyle: {
      type: Object,
      default: null
    },
    overlayClass: {
      type: [String, Object],
      default: null
    },
    panelStyle: {
      type: Object,
      default: null
    },
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    clearIcon: {
      type: String,
      default: void 0
    },
    dropdownIcon: {
      type: String,
      default: void 0
    },
    filterIcon: {
      type: String,
      default: void 0
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    resetFilterOnHide: {
      type: Boolean,
      default: !1
    },
    resetFilterOnClear: {
      type: Boolean,
      default: !1
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: !1
    },
    autoFilterFocus: {
      type: Boolean,
      default: !1
    },
    selectOnFocus: {
      type: Boolean,
      default: !1
    },
    focusOnHover: {
      type: Boolean,
      default: !0
    },
    highlightOnSelect: {
      type: Boolean,
      default: !0
    },
    checkmark: {
      type: Boolean,
      default: !1
    },
    filterMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptyFilterMessage: {
      type: String,
      default: null
    },
    emptyMessage: {
      type: String,
      default: null
    },
    tabindex: {
      type: Number,
      default: 0
    },
    ariaLabel: {
      type: String,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    }
  },
  style: $b,
  provide: function() {
    return {
      $pcSelect: this,
      $parentInstance: this
    };
  }
};
function Li(e) {
  "@babel/helpers - typeof";
  return Li = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Li(e);
}
function Cb(e) {
  return Lb(e) || Pb(e) || Tb(e) || kb();
}
function kb() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Tb(e, t) {
  if (e) {
    if (typeof e == "string") return Mr(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Mr(e, t) : void 0;
  }
}
function Pb(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Lb(e) {
  if (Array.isArray(e)) return Mr(e);
}
function Mr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function zl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Bl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? zl(Object(n), !0).forEach(function(i) {
      fn(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : zl(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function fn(e, t, n) {
  return (t = Eb(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Eb(e) {
  var t = Ab(e, "string");
  return Li(t) == "symbol" ? t : t + "";
}
function Ab(e, t) {
  if (Li(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Li(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ku = {
  name: "Select",
  extends: _b,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur", "before-show", "before-hide", "show", "hide", "filter"],
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  labelClickListener: null,
  matchMediaOrientationListener: null,
  overlay: null,
  list: null,
  virtualScroller: null,
  searchTimeout: null,
  searchValue: null,
  isModelValueChanged: !1,
  data: function() {
    return {
      clicked: !1,
      focused: !1,
      focusedOptionIndex: -1,
      filterValue: null,
      overlayVisible: !1,
      queryOrientation: null
    };
  },
  watch: {
    modelValue: function() {
      this.isModelValueChanged = !0;
    },
    options: function() {
      this.autoUpdateModel();
    }
  },
  mounted: function() {
    this.autoUpdateModel(), this.bindLabelClickListener(), this.bindMatchMediaOrientationListener();
  },
  updated: function() {
    this.overlayVisible && this.isModelValueChanged && this.scrollInView(this.findSelectedOptionIndex()), this.isModelValueChanged = !1;
  },
  beforeUnmount: function() {
    this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindLabelClickListener(), this.unbindMatchMediaOrientationListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.overlay && (Ro.clear(this.overlay), this.overlay = null);
  },
  methods: {
    getOptionIndex: function(t, n) {
      return this.virtualScrollerDisabled ? t : n && n(t).index;
    },
    getOptionLabel: function(t) {
      return this.optionLabel ? We(t, this.optionLabel) : t;
    },
    getOptionValue: function(t) {
      return this.optionValue ? We(t, this.optionValue) : t;
    },
    getOptionRenderKey: function(t, n) {
      return (this.dataKey ? We(t, this.dataKey) : this.getOptionLabel(t)) + "_" + n;
    },
    getPTItemOptions: function(t, n, i, o) {
      return this.ptm(o, {
        context: {
          option: t,
          index: i,
          selected: this.isSelected(t),
          focused: this.focusedOptionIndex === this.getOptionIndex(i, n),
          disabled: this.isOptionDisabled(t)
        }
      });
    },
    isOptionDisabled: function(t) {
      return this.optionDisabled ? We(t, this.optionDisabled) : !1;
    },
    isOptionGroup: function(t) {
      return this.optionGroupLabel && t.optionGroup && t.group;
    },
    getOptionGroupLabel: function(t) {
      return We(t, this.optionGroupLabel);
    },
    getOptionGroupChildren: function(t) {
      return We(t, this.optionGroupChildren);
    },
    getAriaPosInset: function(t) {
      var n = this;
      return (this.optionGroupLabel ? t - this.visibleOptions.slice(0, t).filter(function(i) {
        return n.isOptionGroup(i);
      }).length : t) + 1;
    },
    show: function(t) {
      this.$emit("before-show"), this.overlayVisible = !0, this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), t && it(this.$refs.focusInput);
    },
    hide: function(t) {
      var n = this, i = function() {
        n.$emit("before-hide"), n.overlayVisible = !1, n.clicked = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.resetFilterOnHide && (n.filterValue = null), t && it(n.$refs.focusInput);
      };
      setTimeout(function() {
        i();
      }, 0);
    },
    onFocus: function(t) {
      this.disabled || (this.focused = !0, this.overlayVisible && (this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), this.scrollInView(this.focusedOptionIndex)), this.$emit("focus", t));
    },
    onBlur: function(t) {
      var n = this;
      setTimeout(function() {
        var i, o;
        n.focused = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.$emit("blur", t), (i = (o = n.formField).onBlur) === null || i === void 0 || i.call(o, t);
      }, 100);
    },
    onKeyDown: function(t) {
      var n = this;
      if (this.disabled) {
        t.preventDefault();
        return;
      }
      if (Nd())
        switch (t.code) {
          case "Backspace":
            this.onBackspaceKey(t, this.editable);
            break;
          case "Enter":
          case "NumpadDecimal":
            this.onEnterKey(t);
            break;
          default:
            t.preventDefault();
            return;
        }
      var i = t.metaKey || t.ctrlKey;
      switch (t.code) {
        case "ArrowDown":
          this.onArrowDownKey(t);
          break;
        case "ArrowUp":
          this.onArrowUpKey(t, this.editable);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(t, this.editable);
          break;
        case "Home":
          this.onHomeKey(t, this.editable);
          break;
        case "End":
          this.onEndKey(t, this.editable);
          break;
        case "PageDown":
          this.onPageDownKey(t);
          break;
        case "PageUp":
          this.onPageUpKey(t);
          break;
        case "Space":
          this.onSpaceKey(t, this.editable);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(t);
          break;
        case "Escape":
          this.onEscapeKey(t);
          break;
        case "Tab":
          this.onTabKey(t);
          break;
        case "Backspace":
          this.onBackspaceKey(t, this.editable);
          break;
        case "ShiftLeft":
        case "ShiftRight":
          break;
        default:
          !i && Xl(t.key) && (!this.overlayVisible && this.show(), !this.editable && this.searchOptions(t, t.key), this.filter && this.$nextTick(function() {
            n.$refs.filterInput && it(n.$refs.filterInput.$el);
          }));
          break;
      }
      this.clicked = !1;
    },
    onEditableInput: function(t) {
      var n = t.target.value;
      this.searchValue = "";
      var i = this.searchOptions(t, n);
      !i && (this.focusedOptionIndex = -1), this.updateModel(t, n), !this.overlayVisible && ae(n) && this.show();
    },
    onContainerClick: function(t) {
      this.disabled || this.loading || t.target.tagName === "INPUT" || t.target.getAttribute("data-pc-section") === "clearicon" || t.target.closest('[data-pc-section="clearicon"]') || ((!this.overlay || !this.overlay.contains(t.target)) && (this.overlayVisible ? this.hide(!0) : this.show(!0)), this.clicked = !0);
    },
    onClearClick: function(t) {
      this.updateModel(t, null), this.resetFilterOnClear && (this.filterValue = null);
    },
    onFirstHiddenFocus: function(t) {
      var n = t.relatedTarget === this.$refs.focusInput ? lr(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      it(n);
    },
    onLastHiddenFocus: function(t) {
      var n = t.relatedTarget === this.$refs.focusInput ? Ad(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      it(n);
    },
    onOptionSelect: function(t, n) {
      var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
      if (this.overlayVisible) {
        var o = this.getOptionValue(n);
        this.updateModel(t, o), i && this.hide(!0);
      }
    },
    onOptionMouseMove: function(t, n) {
      this.focusOnHover && this.changeFocusedOptionIndex(t, n);
    },
    onFilterChange: function(t) {
      var n = t.target.value;
      this.filterValue = n, this.focusedOptionIndex = -1, this.$emit("filter", {
        originalEvent: t,
        value: n
      }), !this.virtualScrollerDisabled && this.virtualScroller.scrollToIndex(0);
    },
    onFilterKeyDown: function(t) {
      if (!t.isComposing)
        switch (t.code) {
          case "ArrowDown":
            this.onArrowDownKey(t);
            break;
          case "ArrowUp":
            this.onArrowUpKey(t, !0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
            this.onArrowLeftKey(t, !0);
            break;
          case "Home":
            this.onHomeKey(t, !0);
            break;
          case "End":
            this.onEndKey(t, !0);
            break;
          case "Enter":
          case "NumpadEnter":
            this.onEnterKey(t);
            break;
          case "Escape":
            this.onEscapeKey(t);
            break;
          case "Tab":
            this.onTabKey(t);
            break;
        }
    },
    onFilterBlur: function() {
      this.focusedOptionIndex = -1;
    },
    onFilterUpdated: function() {
      this.overlayVisible && this.alignOverlay();
    },
    onOverlayClick: function(t) {
      hb.emit("overlay-click", {
        originalEvent: t,
        target: this.$el
      });
    },
    onOverlayKeyDown: function(t) {
      t.code === "Escape" && this.onEscapeKey(t);
    },
    onArrowDownKey: function(t) {
      if (!this.overlayVisible)
        this.show(), this.editable && this.changeFocusedOptionIndex(t, this.findSelectedOptionIndex());
      else {
        var n = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();
        this.changeFocusedOptionIndex(t, n);
      }
      t.preventDefault();
    },
    onArrowUpKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (t.altKey && !n)
        this.focusedOptionIndex !== -1 && this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]), this.overlayVisible && this.hide(), t.preventDefault();
      else {
        var i = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(t, i), !this.overlayVisible && this.show(), t.preventDefault();
      }
    },
    onArrowLeftKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && (this.focusedOptionIndex = -1);
    },
    onHomeKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var i = t.currentTarget;
        t.shiftKey ? i.setSelectionRange(0, t.target.selectionStart) : (i.setSelectionRange(0, 0), this.focusedOptionIndex = -1);
      } else
        this.changeFocusedOptionIndex(t, this.findFirstOptionIndex()), !this.overlayVisible && this.show();
      t.preventDefault();
    },
    onEndKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var i = t.currentTarget;
        if (t.shiftKey)
          i.setSelectionRange(t.target.selectionStart, i.value.length);
        else {
          var o = i.value.length;
          i.setSelectionRange(o, o), this.focusedOptionIndex = -1;
        }
      } else
        this.changeFocusedOptionIndex(t, this.findLastOptionIndex()), !this.overlayVisible && this.show();
      t.preventDefault();
    },
    onPageUpKey: function(t) {
      this.scrollInView(0), t.preventDefault();
    },
    onPageDownKey: function(t) {
      this.scrollInView(this.visibleOptions.length - 1), t.preventDefault();
    },
    onEnterKey: function(t) {
      this.overlayVisible ? (this.focusedOptionIndex !== -1 && this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]), this.hide(!0)) : (this.focusedOptionIndex = -1, this.onArrowDownKey(t)), t.preventDefault();
    },
    onSpaceKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      !n && this.onEnterKey(t);
    },
    onEscapeKey: function(t) {
      this.overlayVisible && this.hide(!0), t.preventDefault(), t.stopPropagation();
    },
    onTabKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n || (this.overlayVisible && this.hasFocusableElements() ? (it(this.$refs.firstHiddenFocusableElementOnOverlay), t.preventDefault()) : (this.focusedOptionIndex !== -1 && this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]), this.overlayVisible && this.hide(this.filter)));
    },
    onBackspaceKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && !this.overlayVisible && this.show();
    },
    onOverlayEnter: function(t) {
      var n = this;
      Ro.set("overlay", t, this.$primevue.config.zIndex.overlay), Cd(t, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.scrollInView(), this.$attrSelector && t.setAttribute(this.$attrSelector, ""), setTimeout(function() {
        n.autoFilterFocus && n.filter && it(n.$refs.filterInput.$el), n.autoUpdateModel();
      }, 1);
    },
    onOverlayAfterEnter: function() {
      this.bindOutsideClickListener(), this.bindScrollListener(), this.bindResizeListener(), this.$emit("show");
    },
    onOverlayLeave: function(t) {
      var n = this;
      t.style.pointerEvents = "none", this.unbindOutsideClickListener(), this.unbindScrollListener(), this.unbindResizeListener(), this.autoFilterFocus && this.filter && !this.editable && this.$nextTick(function() {
        n.$refs.filterInput && it(n.$refs.filterInput.$el);
      }), this.$emit("hide"), this.overlay = null;
    },
    onOverlayAfterLeave: function(t) {
      Ro.clear(t);
    },
    alignOverlay: function() {
      this.appendTo === "self" ? kd(this.overlay, this.$el) : this.overlay && (this.overlay.style.minWidth = ia(this.$el) + "px", _d(this.overlay, this.$el));
    },
    bindOutsideClickListener: function() {
      var t = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        var i = n.composedPath();
        t.overlayVisible && t.overlay && !i.includes(t.$el) && !i.includes(t.overlay) && t.hide();
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var t = this;
      this.scrollHandler || (this.scrollHandler = new ym(this.$refs.container, function() {
        t.overlayVisible && t.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = function() {
        t.overlayVisible && !Dd() && t.hide();
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    bindLabelClickListener: function() {
      var t = this;
      if (!this.editable && !this.labelClickListener) {
        var n = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        n && oo(n) && (this.labelClickListener = function() {
          it(t.$refs.focusInput);
        }, n.addEventListener("click", this.labelClickListener));
      }
    },
    unbindLabelClickListener: function() {
      if (this.labelClickListener) {
        var t = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        t && oo(t) && t.removeEventListener("click", this.labelClickListener);
      }
    },
    bindMatchMediaOrientationListener: function() {
      var t = this;
      if (!this.matchMediaOrientationListener) {
        var n = matchMedia("(orientation: portrait)");
        this.queryOrientation = n, this.matchMediaOrientationListener = function() {
          t.alignOverlay();
        }, this.queryOrientation.addEventListener("change", this.matchMediaOrientationListener);
      }
    },
    unbindMatchMediaOrientationListener: function() {
      this.matchMediaOrientationListener && (this.queryOrientation.removeEventListener("change", this.matchMediaOrientationListener), this.queryOrientation = null, this.matchMediaOrientationListener = null);
    },
    hasFocusableElements: function() {
      return jr(this.overlay, ':not([data-p-hidden-focusable="true"])').length > 0;
    },
    isOptionExactMatched: function(t) {
      var n;
      return this.isValidOption(t) && typeof this.getOptionLabel(t) == "string" && ((n = this.getOptionLabel(t)) === null || n === void 0 ? void 0 : n.toLocaleLowerCase(this.filterLocale)) == this.searchValue.toLocaleLowerCase(this.filterLocale);
    },
    isOptionStartsWith: function(t) {
      var n;
      return this.isValidOption(t) && typeof this.getOptionLabel(t) == "string" && ((n = this.getOptionLabel(t)) === null || n === void 0 ? void 0 : n.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)));
    },
    isValidOption: function(t) {
      return ae(t) && !(this.isOptionDisabled(t) || this.isOptionGroup(t));
    },
    isValidSelectedOption: function(t) {
      return this.isValidOption(t) && this.isSelected(t);
    },
    isSelected: function(t) {
      return no(this.d_value, this.getOptionValue(t), this.equalityKey);
    },
    findFirstOptionIndex: function() {
      var t = this;
      return this.visibleOptions.findIndex(function(n) {
        return t.isValidOption(n);
      });
    },
    findLastOptionIndex: function() {
      var t = this;
      return Mn(this.visibleOptions, function(n) {
        return t.isValidOption(n);
      });
    },
    findNextOptionIndex: function(t) {
      var n = this, i = t < this.visibleOptions.length - 1 ? this.visibleOptions.slice(t + 1).findIndex(function(o) {
        return n.isValidOption(o);
      }) : -1;
      return i > -1 ? i + t + 1 : t;
    },
    findPrevOptionIndex: function(t) {
      var n = this, i = t > 0 ? Mn(this.visibleOptions.slice(0, t), function(o) {
        return n.isValidOption(o);
      }) : -1;
      return i > -1 ? i : t;
    },
    findSelectedOptionIndex: function() {
      var t = this;
      return this.visibleOptions.findIndex(function(n) {
        return t.isValidSelectedOption(n);
      });
    },
    findFirstFocusedOptionIndex: function() {
      var t = this.findSelectedOptionIndex();
      return t < 0 ? this.findFirstOptionIndex() : t;
    },
    findLastFocusedOptionIndex: function() {
      var t = this.findSelectedOptionIndex();
      return t < 0 ? this.findLastOptionIndex() : t;
    },
    searchOptions: function(t, n) {
      var i = this;
      this.searchValue = (this.searchValue || "") + n;
      var o = -1, r = !1;
      return ae(this.searchValue) && (o = this.visibleOptions.findIndex(function(s) {
        return i.isOptionExactMatched(s);
      }), o === -1 && (o = this.visibleOptions.findIndex(function(s) {
        return i.isOptionStartsWith(s);
      })), o !== -1 && (r = !0), o === -1 && this.focusedOptionIndex === -1 && (o = this.findFirstFocusedOptionIndex()), o !== -1 && this.changeFocusedOptionIndex(t, o)), this.searchTimeout && clearTimeout(this.searchTimeout), this.searchTimeout = setTimeout(function() {
        i.searchValue = "", i.searchTimeout = null;
      }, 500), r;
    },
    changeFocusedOptionIndex: function(t, n) {
      this.focusedOptionIndex !== n && (this.focusedOptionIndex = n, this.scrollInView(), this.selectOnFocus && this.onOptionSelect(t, this.visibleOptions[n], !1));
    },
    scrollInView: function() {
      var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      this.$nextTick(function() {
        var i = n !== -1 ? "".concat(t.$id, "_").concat(n) : t.focusedOptionId, o = Ai(t.list, 'li[id="'.concat(i, '"]'));
        o ? o.scrollIntoView && o.scrollIntoView({
          block: "nearest",
          inline: "nearest"
        }) : t.virtualScrollerDisabled || t.virtualScroller && t.virtualScroller.scrollToIndex(n !== -1 ? n : t.focusedOptionIndex);
      });
    },
    autoUpdateModel: function() {
      this.autoOptionFocus && (this.focusedOptionIndex = this.findFirstFocusedOptionIndex()), this.selectOnFocus && this.autoOptionFocus && !this.$filled && this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], !1);
    },
    updateModel: function(t, n) {
      this.writeValue(n, t), this.$emit("change", {
        originalEvent: t,
        value: n
      });
    },
    flatOptions: function(t) {
      var n = this;
      return (t || []).reduce(function(i, o, r) {
        i.push({
          optionGroup: o,
          group: !0,
          index: r
        });
        var s = n.getOptionGroupChildren(o);
        return s && s.forEach(function(l) {
          return i.push(l);
        }), i;
      }, []);
    },
    overlayRef: function(t) {
      this.overlay = t;
    },
    listRef: function(t, n) {
      this.list = t, n && n(t);
    },
    virtualScrollerRef: function(t) {
      this.virtualScroller = t;
    }
  },
  computed: {
    visibleOptions: function() {
      var t = this, n = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];
      if (this.filterValue) {
        var i = ur.filter(n, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
        if (this.optionGroupLabel) {
          var o = this.options || [], r = [];
          return o.forEach(function(s) {
            var l = t.getOptionGroupChildren(s), a = l.filter(function(d) {
              return i.includes(d);
            });
            a.length > 0 && r.push(Bl(Bl({}, s), {}, fn({}, typeof t.optionGroupChildren == "string" ? t.optionGroupChildren : "items", Cb(a))));
          }), this.flatOptions(r);
        }
        return i;
      }
      return n;
    },
    // @deprecated use $filled instead
    hasSelectedOption: function() {
      return this.$filled;
    },
    label: function() {
      var t = this.findSelectedOptionIndex();
      return t !== -1 ? this.getOptionLabel(this.visibleOptions[t]) : this.placeholder || "p-emptylabel";
    },
    editableInputValue: function() {
      var t = this.findSelectedOptionIndex();
      return t !== -1 ? this.getOptionLabel(this.visibleOptions[t]) : this.d_value || "";
    },
    equalityKey: function() {
      return this.optionValue ? null : this.dataKey;
    },
    searchFields: function() {
      return this.filterFields || [this.optionLabel];
    },
    filterResultMessageText: function() {
      return ae(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
    },
    filterMessageText: function() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptyFilterMessageText: function() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || "";
    },
    emptyMessageText: function() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || "";
    },
    selectionMessageText: function() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText: function() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText: function() {
      return this.$filled ? this.selectionMessageText.replaceAll("{0}", "1") : this.emptySelectionMessageText;
    },
    focusedOptionId: function() {
      return this.focusedOptionIndex !== -1 ? "".concat(this.$id, "_").concat(this.focusedOptionIndex) : null;
    },
    ariaSetSize: function() {
      var t = this;
      return this.visibleOptions.filter(function(n) {
        return !t.isOptionGroup(n);
      }).length;
    },
    isClearIconVisible: function() {
      return this.showClear && this.d_value != null && !this.disabled && !this.loading;
    },
    virtualScrollerDisabled: function() {
      return !this.virtualScrollerOptions;
    },
    containerDataP: function() {
      return rt(fn({
        invalid: this.$invalid,
        disabled: this.disabled,
        focus: this.focused,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    },
    labelDataP: function() {
      return rt(fn(fn({
        placeholder: !this.editable && this.label === this.placeholder,
        clearable: this.showClear,
        disabled: this.disabled,
        editable: this.editable
      }, this.size, this.size), "empty", !this.editable && !this.$slots.value && (this.label === "p-emptylabel" || this.label.length === 0)));
    },
    dropdownIconDataP: function() {
      return rt(fn({}, this.size, this.size));
    },
    overlayDataP: function() {
      return rt(fn({}, "portal-" + this.appendTo, "portal-" + this.appendTo));
    }
  },
  directives: {
    ripple: ls
  },
  components: {
    InputText: jn,
    VirtualScroller: gs,
    Portal: zu,
    InputIcon: ps,
    IconField: fs,
    TimesIcon: ju,
    ChevronDownIcon: Du,
    SpinnerIcon: Fo,
    SearchIcon: cs,
    CheckIcon: ds,
    BlankIcon: us
  }
}, Mb = ["id", "data-p"], Fb = ["name", "id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "data-p"], Vb = ["name", "id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "aria-disabled", "data-p"], Nb = ["data-p"], Db = ["id"], jb = ["id"], Rb = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onMousedown", "onMousemove", "data-p-selected", "data-p-focused", "data-p-disabled"];
function zb(e, t, n, i, o, r) {
  var s = Le("SpinnerIcon"), l = Le("InputText"), a = Le("SearchIcon"), d = Le("InputIcon"), u = Le("IconField"), c = Le("CheckIcon"), f = Le("BlankIcon"), h = Le("VirtualScroller"), b = Le("Portal"), y = es("ripple");
  return I(), P("div", V({
    ref: "container",
    id: e.$id,
    class: e.cx("root"),
    onClick: t[12] || (t[12] = function() {
      return r.onContainerClick && r.onContainerClick.apply(r, arguments);
    }),
    "data-p": r.containerDataP
  }, e.ptmi("root")), [e.editable ? (I(), P("input", V({
    key: 0,
    ref: "focusInput",
    name: e.name,
    id: e.labelId || e.inputId,
    type: "text",
    class: [e.cx("label"), e.inputClass, e.labelClass],
    style: [e.inputStyle, e.labelStyle],
    value: r.editableInputValue,
    placeholder: e.placeholder,
    tabindex: e.disabled ? -1 : e.tabindex,
    disabled: e.disabled,
    autocomplete: "off",
    role: "combobox",
    "aria-label": e.ariaLabel,
    "aria-labelledby": e.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": o.overlayVisible,
    "aria-controls": o.overlayVisible ? e.$id + "_list" : void 0,
    "aria-activedescendant": o.focused ? r.focusedOptionId : void 0,
    "aria-invalid": e.invalid || void 0,
    onFocus: t[0] || (t[0] = function() {
      return r.onFocus && r.onFocus.apply(r, arguments);
    }),
    onBlur: t[1] || (t[1] = function() {
      return r.onBlur && r.onBlur.apply(r, arguments);
    }),
    onKeydown: t[2] || (t[2] = function() {
      return r.onKeyDown && r.onKeyDown.apply(r, arguments);
    }),
    onInput: t[3] || (t[3] = function() {
      return r.onEditableInput && r.onEditableInput.apply(r, arguments);
    }),
    "data-p": r.labelDataP
  }, e.ptm("label")), null, 16, Fb)) : (I(), P("span", V({
    key: 1,
    ref: "focusInput",
    name: e.name,
    id: e.labelId || e.inputId,
    class: [e.cx("label"), e.inputClass, e.labelClass],
    style: [e.inputStyle, e.labelStyle],
    tabindex: e.disabled ? -1 : e.tabindex,
    role: "combobox",
    "aria-label": e.ariaLabel || (r.label === "p-emptylabel" ? void 0 : r.label),
    "aria-labelledby": e.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": o.overlayVisible,
    "aria-controls": e.$id + "_list",
    "aria-activedescendant": o.focused ? r.focusedOptionId : void 0,
    "aria-invalid": e.invalid || void 0,
    "aria-disabled": e.disabled,
    onFocus: t[4] || (t[4] = function() {
      return r.onFocus && r.onFocus.apply(r, arguments);
    }),
    onBlur: t[5] || (t[5] = function() {
      return r.onBlur && r.onBlur.apply(r, arguments);
    }),
    onKeydown: t[6] || (t[6] = function() {
      return r.onKeyDown && r.onKeyDown.apply(r, arguments);
    }),
    "data-p": r.labelDataP
  }, e.ptm("label")), [de(e.$slots, "value", {
    value: e.d_value,
    placeholder: e.placeholder
  }, function() {
    var w;
    return [Nt(oe(r.label === "p-emptylabel" ? " " : (w = r.label) !== null && w !== void 0 ? w : "empty"), 1)];
  })], 16, Vb)), r.isClearIconVisible ? de(e.$slots, "clearicon", {
    key: 2,
    class: st(e.cx("clearIcon")),
    clearCallback: r.onClearClick
  }, function() {
    return [(I(), ke(br(e.clearIcon ? "i" : "TimesIcon"), V({
      ref: "clearIcon",
      class: [e.cx("clearIcon"), e.clearIcon],
      onClick: r.onClearClick
    }, e.ptm("clearIcon"), {
      "data-pc-section": "clearicon"
    }), null, 16, ["class", "onClick"]))];
  }) : re("", !0), K("div", V({
    class: e.cx("dropdown")
  }, e.ptm("dropdown")), [e.loading ? de(e.$slots, "loadingicon", {
    key: 0,
    class: st(e.cx("loadingIcon"))
  }, function() {
    return [e.loadingIcon ? (I(), P("span", V({
      key: 0,
      class: [e.cx("loadingIcon"), "pi-spin", e.loadingIcon],
      "aria-hidden": "true"
    }, e.ptm("loadingIcon")), null, 16)) : (I(), ke(s, V({
      key: 1,
      class: e.cx("loadingIcon"),
      spin: "",
      "aria-hidden": "true"
    }, e.ptm("loadingIcon")), null, 16, ["class"]))];
  }) : de(e.$slots, "dropdownicon", {
    key: 1,
    class: st(e.cx("dropdownIcon"))
  }, function() {
    return [(I(), ke(br(e.dropdownIcon ? "span" : "ChevronDownIcon"), V({
      class: [e.cx("dropdownIcon"), e.dropdownIcon],
      "aria-hidden": "true",
      "data-p": r.dropdownIconDataP
    }, e.ptm("dropdownIcon")), null, 16, ["class", "data-p"]))];
  })], 16), q(b, {
    appendTo: e.appendTo
  }, {
    default: Qe(function() {
      return [q(op, V({
        name: "p-anchored-overlay",
        onEnter: r.onOverlayEnter,
        onAfterEnter: r.onOverlayAfterEnter,
        onLeave: r.onOverlayLeave,
        onAfterLeave: r.onOverlayAfterLeave
      }, e.ptm("transition")), {
        default: Qe(function() {
          return [o.overlayVisible ? (I(), P("div", V({
            key: 0,
            ref: r.overlayRef,
            class: [e.cx("overlay"), e.panelClass, e.overlayClass],
            style: [e.panelStyle, e.overlayStyle],
            onClick: t[10] || (t[10] = function() {
              return r.onOverlayClick && r.onOverlayClick.apply(r, arguments);
            }),
            onKeydown: t[11] || (t[11] = function() {
              return r.onOverlayKeyDown && r.onOverlayKeyDown.apply(r, arguments);
            }),
            "data-p": r.overlayDataP
          }, e.ptm("overlay")), [K("span", V({
            ref: "firstHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: t[7] || (t[7] = function() {
              return r.onFirstHiddenFocus && r.onFirstHiddenFocus.apply(r, arguments);
            })
          }, e.ptm("hiddenFirstFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16), de(e.$slots, "header", {
            value: e.d_value,
            options: r.visibleOptions
          }), e.filter ? (I(), P("div", V({
            key: 0,
            class: e.cx("header")
          }, e.ptm("header")), [q(u, {
            unstyled: e.unstyled,
            pt: e.ptm("pcFilterContainer")
          }, {
            default: Qe(function() {
              return [q(l, {
                ref: "filterInput",
                type: "text",
                value: o.filterValue,
                onVnodeMounted: r.onFilterUpdated,
                onVnodeUpdated: r.onFilterUpdated,
                class: st(e.cx("pcFilter")),
                placeholder: e.filterPlaceholder,
                variant: e.variant,
                unstyled: e.unstyled,
                role: "searchbox",
                autocomplete: "off",
                "aria-owns": e.$id + "_list",
                "aria-activedescendant": r.focusedOptionId,
                onKeydown: r.onFilterKeyDown,
                onBlur: r.onFilterBlur,
                onInput: r.onFilterChange,
                pt: e.ptm("pcFilter"),
                formControl: {
                  novalidate: !0
                }
              }, null, 8, ["value", "onVnodeMounted", "onVnodeUpdated", "class", "placeholder", "variant", "unstyled", "aria-owns", "aria-activedescendant", "onKeydown", "onBlur", "onInput", "pt"]), q(d, {
                unstyled: e.unstyled,
                pt: e.ptm("pcFilterIconContainer")
              }, {
                default: Qe(function() {
                  return [de(e.$slots, "filtericon", {}, function() {
                    return [e.filterIcon ? (I(), P("span", V({
                      key: 0,
                      class: e.filterIcon
                    }, e.ptm("filterIcon")), null, 16)) : (I(), ke(a, ya(V({
                      key: 1
                    }, e.ptm("filterIcon"))), null, 16))];
                  })];
                }),
                _: 3
              }, 8, ["unstyled", "pt"])];
            }),
            _: 3
          }, 8, ["unstyled", "pt"]), K("span", V({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenFilterResult"), {
            "data-p-hidden-accessible": !0
          }), oe(r.filterResultMessageText), 17)], 16)) : re("", !0), K("div", V({
            class: e.cx("listContainer"),
            style: {
              "max-height": r.virtualScrollerDisabled ? e.scrollHeight : ""
            }
          }, e.ptm("listContainer")), [q(h, V({
            ref: r.virtualScrollerRef
          }, e.virtualScrollerOptions, {
            items: r.visibleOptions,
            style: {
              height: e.scrollHeight
            },
            tabindex: -1,
            disabled: r.virtualScrollerDisabled,
            pt: e.ptm("virtualScroller")
          }), nu({
            content: Qe(function(w) {
              var v = w.styleClass, S = w.contentRef, $ = w.items, g = w.getItemOptions, x = w.contentStyle, D = w.itemSize;
              return [K("ul", V({
                ref: function(j) {
                  return r.listRef(j, S);
                },
                id: e.$id + "_list",
                class: [e.cx("list"), v],
                style: x,
                role: "listbox"
              }, e.ptm("list")), [(I(!0), P(ge, null, ht($, function(L, j) {
                return I(), P(ge, {
                  key: r.getOptionRenderKey(L, r.getOptionIndex(j, g))
                }, [r.isOptionGroup(L) ? (I(), P("li", V({
                  key: 0,
                  id: e.$id + "_" + r.getOptionIndex(j, g),
                  style: {
                    height: D ? D + "px" : void 0
                  },
                  class: e.cx("optionGroup"),
                  role: "option"
                }, {
                  ref_for: !0
                }, e.ptm("optionGroup")), [de(e.$slots, "optiongroup", {
                  option: L.optionGroup,
                  index: r.getOptionIndex(j, g)
                }, function() {
                  return [K("span", V({
                    class: e.cx("optionGroupLabel")
                  }, {
                    ref_for: !0
                  }, e.ptm("optionGroupLabel")), oe(r.getOptionGroupLabel(L.optionGroup)), 17)];
                })], 16, jb)) : Qr((I(), P("li", V({
                  key: 1,
                  id: e.$id + "_" + r.getOptionIndex(j, g),
                  class: e.cx("option", {
                    option: L,
                    focusedOption: r.getOptionIndex(j, g)
                  }),
                  style: {
                    height: D ? D + "px" : void 0
                  },
                  role: "option",
                  "aria-label": r.getOptionLabel(L),
                  "aria-selected": r.isSelected(L),
                  "aria-disabled": r.isOptionDisabled(L),
                  "aria-setsize": r.ariaSetSize,
                  "aria-posinset": r.getAriaPosInset(r.getOptionIndex(j, g)),
                  onMousedown: function(G) {
                    return r.onOptionSelect(G, L);
                  },
                  onMousemove: function(G) {
                    return r.onOptionMouseMove(G, r.getOptionIndex(j, g));
                  },
                  onClick: t[8] || (t[8] = ss(function() {
                  }, ["stop"])),
                  "data-p-selected": !e.checkmark && r.isSelected(L),
                  "data-p-focused": o.focusedOptionIndex === r.getOptionIndex(j, g),
                  "data-p-disabled": r.isOptionDisabled(L)
                }, {
                  ref_for: !0
                }, r.getPTItemOptions(L, g, j, "option")), [e.checkmark ? (I(), P(ge, {
                  key: 0
                }, [r.isSelected(L) ? (I(), ke(c, V({
                  key: 0,
                  class: e.cx("optionCheckIcon")
                }, {
                  ref_for: !0
                }, e.ptm("optionCheckIcon")), null, 16, ["class"])) : (I(), ke(f, V({
                  key: 1,
                  class: e.cx("optionBlankIcon")
                }, {
                  ref_for: !0
                }, e.ptm("optionBlankIcon")), null, 16, ["class"]))], 64)) : re("", !0), de(e.$slots, "option", {
                  option: L,
                  selected: r.isSelected(L),
                  index: r.getOptionIndex(j, g)
                }, function() {
                  return [K("span", V({
                    class: e.cx("optionLabel")
                  }, {
                    ref_for: !0
                  }, e.ptm("optionLabel")), oe(r.getOptionLabel(L)), 17)];
                })], 16, Rb)), [[y]])], 64);
              }), 128)), o.filterValue && (!$ || $ && $.length === 0) ? (I(), P("li", V({
                key: 0,
                class: e.cx("emptyMessage"),
                role: "option"
              }, e.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [de(e.$slots, "emptyfilter", {}, function() {
                return [Nt(oe(r.emptyFilterMessageText), 1)];
              })], 16)) : !e.options || e.options && e.options.length === 0 ? (I(), P("li", V({
                key: 1,
                class: e.cx("emptyMessage"),
                role: "option"
              }, e.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [de(e.$slots, "empty", {}, function() {
                return [Nt(oe(r.emptyMessageText), 1)];
              })], 16)) : re("", !0)], 16, Db)];
            }),
            _: 2
          }, [e.$slots.loader ? {
            name: "loader",
            fn: Qe(function(w) {
              var v = w.options;
              return [de(e.$slots, "loader", {
                options: v
              })];
            }),
            key: "0"
          } : void 0]), 1040, ["items", "style", "disabled", "pt"])], 16), de(e.$slots, "footer", {
            value: e.d_value,
            options: r.visibleOptions
          }), !e.options || e.options && e.options.length === 0 ? (I(), P("span", V({
            key: 1,
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenEmptyMessage"), {
            "data-p-hidden-accessible": !0
          }), oe(r.emptyMessageText), 17)) : re("", !0), K("span", V({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenSelectedMessage"), {
            "data-p-hidden-accessible": !0
          }), oe(r.selectedMessageText), 17), K("span", V({
            ref: "lastHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: t[9] || (t[9] = function() {
              return r.onLastHiddenFocus && r.onLastHiddenFocus.apply(r, arguments);
            })
          }, e.ptm("hiddenLastFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16)], 16, Nb)) : re("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo"])], 16, Mb);
}
Ku.render = zb;
const Bb = ["aria-label"], Kb = { class: "nf-modal-header" }, Hb = { class: "nf-modal-title" }, Ub = { class: "nf-modal-body" }, Wb = /* @__PURE__ */ rn({
  __name: "ModalShell",
  props: {
    title: {}
  },
  emits: ["close-request"],
  setup(e, { emit: t }) {
    const n = t, i = /* @__PURE__ */ Ve();
    function o(r) {
      r.stopPropagation(), r.key === "Escape" && n("close-request");
    }
    return Cn(() => i.value?.focus()), (r, s) => (I(), P("div", {
      class: "nf-modal-backdrop",
      onMousedown: s[1] || (s[1] = ss((l) => n("close-request"), ["self"])),
      onKeydown: o
    }, [
      K("div", {
        ref_key: "panel",
        ref: i,
        class: "nf-modal nf-root",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": e.title,
        tabindex: "-1"
      }, [
        K("header", Kb, [
          K("span", Hb, oe(e.title), 1),
          q(B(Ce), {
            class: "nf-icon-button",
            icon: "pi pi-times",
            title: "Close",
            onClick: s[0] || (s[0] = (l) => n("close-request"))
          })
        ]),
        K("div", Ub, [
          de(r.$slots, "default")
        ])
      ], 8, Bb)
    ], 32));
  }
});
var Gb = `
    .p-listbox {
        display: block;
        background: dt('listbox.background');
        color: dt('listbox.color');
        border: 1px solid dt('listbox.border.color');
        border-radius: dt('listbox.border.radius');
        transition:
            background dt('listbox.transition.duration'),
            color dt('listbox.transition.duration'),
            border-color dt('listbox.transition.duration'),
            box-shadow dt('listbox.transition.duration'),
            outline-color dt('listbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('listbox.shadow');
    }

    .p-listbox.p-disabled {
        opacity: 1;
        background: dt('listbox.disabled.background');
        color: dt('listbox.disabled.color');
    }

    .p-listbox.p-disabled .p-listbox-option {
        color: dt('listbox.disabled.color');
    }

    .p-listbox.p-invalid {
        border-color: dt('listbox.invalid.border.color');
    }

    .p-listbox-header {
        padding: dt('listbox.list.header.padding');
    }

    .p-listbox-filter {
        width: 100%;
    }

    .p-listbox-list-container {
        overflow: auto;
    }

    .p-listbox-list {
        list-style-type: none;
        margin: 0;
        padding: dt('listbox.list.padding');
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('listbox.list.gap');
    }

    .p-listbox-option {
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        padding: dt('listbox.option.padding');
        border: 0 none;
        border-radius: dt('listbox.option.border.radius');
        color: dt('listbox.option.color');
        transition:
            background dt('listbox.transition.duration'),
            color dt('listbox.transition.duration'),
            border-color dt('listbox.transition.duration'),
            box-shadow dt('listbox.transition.duration'),
            outline-color dt('listbox.transition.duration');
    }

    .p-listbox-striped li:nth-child(even of .p-listbox-option) {
        background: dt('listbox.option.striped.background');
    }

    .p-listbox .p-listbox-list .p-listbox-option.p-listbox-option-selected {
        background: dt('listbox.option.selected.background');
        color: dt('listbox.option.selected.color');
    }

    .p-listbox:not(.p-disabled) .p-listbox-option.p-listbox-option-selected.p-focus {
        background: dt('listbox.option.selected.focus.background');
        color: dt('listbox.option.selected.focus.color');
    }

    .p-listbox:not(.p-disabled) .p-listbox-option:not(.p-listbox-option-selected):not(.p-disabled).p-focus {
        background: dt('listbox.option.focus.background');
        color: dt('listbox.option.focus.color');
    }

    .p-listbox:not(.p-disabled) .p-listbox-option:not(.p-listbox-option-selected):not(.p-disabled):hover {
        background: dt('listbox.option.focus.background');
        color: dt('listbox.option.focus.color');
    }

    .p-listbox-option-blank-icon {
        flex-shrink: 0;
    }

    .p-listbox-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('listbox.checkmark.gutter.start');
        margin-inline-end: dt('listbox.checkmark.gutter.end');
        color: dt('listbox.checkmark.color');
    }

    .p-listbox-option-group {
        margin: 0;
        padding: dt('listbox.option.group.padding');
        color: dt('listbox.option.group.color');
        background: dt('listbox.option.group.background');
        font-weight: dt('listbox.option.group.font.weight');
    }

    .p-listbox-empty-message {
        padding: dt('listbox.empty.message.padding');
    }

    .p-listbox-fluid {
        width: 100%;
    }
`, qb = {
  root: function(t) {
    var n = t.instance, i = t.props;
    return ["p-listbox p-component", {
      "p-listbox-striped": i.striped,
      "p-disabled": i.disabled,
      "p-listbox-fluid": i.fluid,
      "p-invalid": n.$invalid
    }];
  },
  header: "p-listbox-header",
  pcFilter: "p-listbox-filter",
  listContainer: "p-listbox-list-container",
  list: "p-listbox-list",
  optionGroup: "p-listbox-option-group",
  option: function(t) {
    var n = t.instance, i = t.props, o = t.option, r = t.index, s = t.getItemOptions;
    return ["p-listbox-option", {
      "p-listbox-option-selected": n.isSelected(o) && i.highlightOnSelect,
      "p-focus": n.focusedOptionIndex === n.getOptionIndex(r, s),
      "p-disabled": n.isOptionDisabled(o)
    }];
  },
  optionCheckIcon: "p-listbox-option-check-icon",
  optionBlankIcon: "p-listbox-option-blank-icon",
  emptyMessage: "p-listbox-empty-message"
}, Jb = be.extend({
  name: "listbox",
  style: Gb,
  classes: qb
}), Yb = {
  name: "BaseListbox",
  extends: Ru,
  props: {
    options: Array,
    optionLabel: null,
    optionValue: null,
    optionDisabled: null,
    optionGroupLabel: null,
    optionGroupChildren: null,
    listStyle: null,
    scrollHeight: {
      type: String,
      default: "14rem"
    },
    dataKey: null,
    multiple: {
      type: Boolean,
      default: !1
    },
    metaKeySelection: {
      type: Boolean,
      default: !1
    },
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      default: "contains"
    },
    filterFields: {
      type: Array,
      default: null
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: !0
    },
    selectOnFocus: {
      type: Boolean,
      default: !1
    },
    focusOnHover: {
      type: Boolean,
      default: !0
    },
    highlightOnSelect: {
      type: Boolean,
      default: !0
    },
    checkmark: {
      type: Boolean,
      default: !1
    },
    filterMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptyFilterMessage: {
      type: String,
      default: null
    },
    emptyMessage: {
      type: String,
      default: null
    },
    filterIcon: {
      type: String,
      default: void 0
    },
    striped: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: 0
    },
    fluid: {
      type: Boolean,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    }
  },
  style: Jb,
  provide: function() {
    return {
      $pcListbox: this,
      $parentInstance: this
    };
  }
};
function ir(e) {
  return ev(e) || Xb(e) || Qb(e) || Zb();
}
function Zb() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Qb(e, t) {
  if (e) {
    if (typeof e == "string") return Fr(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Fr(e, t) : void 0;
  }
}
function Xb(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ev(e) {
  if (Array.isArray(e)) return Fr(e);
}
function Fr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
var Hu = {
  name: "Listbox",
  extends: Yb,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur", "filter", "item-dblclick", "option-dblclick"],
  list: null,
  virtualScroller: null,
  optionTouched: !1,
  startRangeIndex: -1,
  searchTimeout: null,
  searchValue: "",
  data: function() {
    return {
      filterValue: null,
      focused: !1,
      focusedOptionIndex: -1
    };
  },
  watch: {
    options: function() {
      this.autoUpdateModel();
    }
  },
  mounted: function() {
    this.autoUpdateModel();
  },
  methods: {
    getOptionIndex: function(t, n) {
      return this.virtualScrollerDisabled ? t : n && n(t).index;
    },
    getOptionLabel: function(t) {
      return this.optionLabel ? We(t, this.optionLabel) : typeof t == "string" || typeof t == "number" || typeof t == "boolean" ? t : null;
    },
    getOptionValue: function(t) {
      return this.optionValue ? We(t, this.optionValue) : t;
    },
    getOptionRenderKey: function(t, n) {
      return (this.dataKey ? We(t, this.dataKey) : this.getOptionLabel(t)) + "_" + n;
    },
    getPTOptions: function(t, n, i, o) {
      return this.ptm(o, {
        context: {
          selected: this.isSelected(t),
          focused: this.focusedOptionIndex === this.getOptionIndex(i, n),
          disabled: this.isOptionDisabled(t)
        }
      });
    },
    isOptionDisabled: function(t) {
      return this.optionDisabled ? We(t, this.optionDisabled) : !1;
    },
    isOptionGroup: function(t) {
      return this.optionGroupLabel && t.optionGroup && t.group;
    },
    getOptionGroupLabel: function(t) {
      return We(t, this.optionGroupLabel);
    },
    getOptionGroupChildren: function(t) {
      return We(t, this.optionGroupChildren);
    },
    getAriaPosInset: function(t) {
      var n = this;
      return (this.optionGroupLabel ? t - this.visibleOptions.slice(0, t).filter(function(i) {
        return n.isOptionGroup(i);
      }).length : t) + 1;
    },
    onFirstHiddenFocus: function() {
      it(this.list);
      var t = lr(this.$el, ':not([data-p-hidden-focusable="true"])');
      this.$refs.lastHiddenFocusableElement.tabIndex = $n(t) ? void 0 : -1, this.$refs.firstHiddenFocusableElement.tabIndex = -1;
    },
    onLastHiddenFocus: function(t) {
      var n = t.relatedTarget;
      if (n === this.list) {
        var i = lr(this.$el, ':not([data-p-hidden-focusable="true"])');
        it(i), this.$refs.firstHiddenFocusableElement.tabIndex = void 0;
      } else
        it(this.$refs.firstHiddenFocusableElement);
      this.$refs.lastHiddenFocusableElement.tabIndex = -1;
    },
    onFocusout: function(t) {
      !this.$el.contains(t.relatedTarget) && this.$refs.lastHiddenFocusableElement && this.$refs.firstHiddenFocusableElement && (this.$refs.lastHiddenFocusableElement.tabIndex = this.$refs.firstHiddenFocusableElement.tabIndex = void 0);
    },
    onListFocus: function(t) {
      this.focused = !0, this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex(), this.autoUpdateModel(), this.scrollInView(this.focusedOptionIndex), this.$emit("focus", t);
    },
    onListBlur: function(t) {
      this.focused = !1, this.focusedOptionIndex = this.startRangeIndex = -1, this.searchValue = "", this.$emit("blur", t);
    },
    onListKeyDown: function(t) {
      var n = this, i = t.metaKey || t.ctrlKey;
      switch (t.code) {
        case "ArrowDown":
          this.onArrowDownKey(t);
          break;
        case "ArrowUp":
          this.onArrowUpKey(t);
          break;
        case "Home":
          this.onHomeKey(t);
          break;
        case "End":
          this.onEndKey(t);
          break;
        case "PageDown":
          this.onPageDownKey(t);
          break;
        case "PageUp":
          this.onPageUpKey(t);
          break;
        case "Enter":
        case "NumpadEnter":
        case "Space":
          this.onSpaceKey(t);
          break;
        case "Tab":
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.onShiftKey(t);
          break;
        default:
          if (this.multiple && t.code === "KeyA" && i) {
            var o = this.visibleOptions.filter(function(r) {
              return n.isValidOption(r);
            }).map(function(r) {
              return n.getOptionValue(r);
            });
            this.updateModel(t, o), t.preventDefault();
            break;
          }
          !i && Xl(t.key) && (this.searchOptions(t, t.key), t.preventDefault());
          break;
      }
    },
    onOptionSelect: function(t, n) {
      var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : -1;
      this.disabled || this.isOptionDisabled(n) || (this.multiple ? this.onOptionSelectMultiple(t, n) : this.onOptionSelectSingle(t, n), this.optionTouched = !1, i !== -1 && (this.focusedOptionIndex = i));
    },
    onOptionMouseDown: function(t, n) {
      this.changeFocusedOptionIndex(t, n);
    },
    onOptionMouseMove: function(t, n) {
      this.focusOnHover && this.focused && this.changeFocusedOptionIndex(t, n);
    },
    onOptionTouchEnd: function() {
      this.disabled || (this.optionTouched = !0);
    },
    onOptionDblClick: function(t, n) {
      this.$emit("item-dblclick", {
        originalEvent: t,
        value: n
      }), this.$emit("option-dblclick", {
        originalEvent: t,
        value: n
      });
    },
    onOptionSelectSingle: function(t, n) {
      var i = this.isSelected(n), o = !1, r = null, s = this.optionTouched ? !1 : this.metaKeySelection;
      if (s) {
        var l = t && (t.metaKey || t.ctrlKey);
        i ? l && (r = null, o = !0) : (r = this.getOptionValue(n), o = !0);
      } else
        r = i ? null : this.getOptionValue(n), o = !0;
      o && this.updateModel(t, r);
    },
    onOptionSelectMultiple: function(t, n) {
      var i = this.isSelected(n), o = null, r = this.optionTouched ? !1 : this.metaKeySelection;
      if (r) {
        var s = t.metaKey || t.ctrlKey;
        i ? o = s ? this.removeOption(n) : [this.getOptionValue(n)] : (o = s ? this.d_value || [] : [], o = [].concat(ir(o), [this.getOptionValue(n)]));
      } else
        o = i ? this.removeOption(n) : [].concat(ir(this.d_value || []), [this.getOptionValue(n)]);
      this.updateModel(t, o);
    },
    onOptionSelectRange: function(t) {
      var n = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : -1;
      if (i === -1 && (i = this.findNearestSelectedOptionIndex(o, !0)), o === -1 && (o = this.findNearestSelectedOptionIndex(i)), i !== -1 && o !== -1) {
        var r = Math.min(i, o), s = Math.max(i, o), l = this.visibleOptions.slice(r, s + 1).filter(function(a) {
          return n.isValidOption(a);
        }).map(function(a) {
          return n.getOptionValue(a);
        });
        this.updateModel(t, l);
      }
    },
    onFilterChange: function(t) {
      this.$emit("filter", {
        originalEvent: t,
        value: t.target.value,
        filterValue: this.visibleOptions
      }), this.focusedOptionIndex = this.startRangeIndex = -1;
    },
    onFilterKeyDown: function(t) {
      switch (t.code) {
        case "ArrowDown":
          this.onArrowDownKey(t);
          break;
        case "ArrowUp":
          this.onArrowUpKey(t);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(t, !0);
          break;
        case "Home":
          this.onHomeKey(t, !0);
          break;
        case "End":
          this.onEndKey(t, !0);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(t);
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.onShiftKey(t);
          break;
      }
    },
    onArrowDownKey: function(t) {
      var n = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();
      this.multiple && t.shiftKey && this.onOptionSelectRange(t, this.startRangeIndex, n), this.changeFocusedOptionIndex(t, n), t.preventDefault();
    },
    onArrowUpKey: function(t) {
      var n = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();
      this.multiple && t.shiftKey && this.onOptionSelectRange(t, n, this.startRangeIndex), this.changeFocusedOptionIndex(t, n), t.preventDefault();
    },
    onArrowLeftKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && (this.focusedOptionIndex = -1);
    },
    onHomeKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var i = t.currentTarget;
        t.shiftKey ? i.setSelectionRange(0, t.target.selectionStart) : (i.setSelectionRange(0, 0), this.focusedOptionIndex = -1);
      } else {
        var o = t.metaKey || t.ctrlKey, r = this.findFirstOptionIndex();
        this.multiple && t.shiftKey && o && this.onOptionSelectRange(t, r, this.startRangeIndex), this.changeFocusedOptionIndex(t, r);
      }
      t.preventDefault();
    },
    onEndKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var i = t.currentTarget;
        if (t.shiftKey)
          i.setSelectionRange(t.target.selectionStart, i.value.length);
        else {
          var o = i.value.length;
          i.setSelectionRange(o, o), this.focusedOptionIndex = -1;
        }
      } else {
        var r = t.metaKey || t.ctrlKey, s = this.findLastOptionIndex();
        this.multiple && t.shiftKey && r && this.onOptionSelectRange(t, this.startRangeIndex, s), this.changeFocusedOptionIndex(t, s);
      }
      t.preventDefault();
    },
    onPageUpKey: function(t) {
      this.scrollInView(0), t.preventDefault();
    },
    onPageDownKey: function(t) {
      this.scrollInView(this.visibleOptions.length - 1), t.preventDefault();
    },
    onEnterKey: function(t) {
      this.focusedOptionIndex !== -1 && (this.multiple && t.shiftKey ? this.onOptionSelectRange(t, this.focusedOptionIndex) : this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]));
    },
    onSpaceKey: function(t) {
      t.preventDefault(), this.onEnterKey(t);
    },
    onShiftKey: function() {
      this.startRangeIndex = this.focusedOptionIndex;
    },
    isOptionMatched: function(t) {
      var n;
      return this.isValidOption(t) && typeof this.getOptionLabel(t) == "string" && ((n = this.getOptionLabel(t)) === null || n === void 0 ? void 0 : n.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)));
    },
    isValidOption: function(t) {
      return ae(t) && !(this.isOptionDisabled(t) || this.isOptionGroup(t));
    },
    isValidSelectedOption: function(t) {
      return this.isValidOption(t) && this.isSelected(t);
    },
    isEquals: function(t, n) {
      return no(t, n, this.equalityKey);
    },
    isSelected: function(t) {
      var n = this, i = this.getOptionValue(t);
      return this.multiple ? (this.d_value || []).some(function(o) {
        return n.isEquals(o, i);
      }) : this.isEquals(this.d_value, i);
    },
    findFirstOptionIndex: function() {
      var t = this;
      return this.visibleOptions.findIndex(function(n) {
        return t.isValidOption(n);
      });
    },
    findLastOptionIndex: function() {
      var t = this;
      return Mn(this.visibleOptions, function(n) {
        return t.isValidOption(n);
      });
    },
    findNextOptionIndex: function(t) {
      var n = this, i = t < this.visibleOptions.length - 1 ? this.visibleOptions.slice(t + 1).findIndex(function(o) {
        return n.isValidOption(o);
      }) : -1;
      return i > -1 ? i + t + 1 : t;
    },
    findPrevOptionIndex: function(t) {
      var n = this, i = t > 0 ? Mn(this.visibleOptions.slice(0, t), function(o) {
        return n.isValidOption(o);
      }) : -1;
      return i > -1 ? i : t;
    },
    findSelectedOptionIndex: function() {
      var t = this;
      if (this.$filled)
        if (this.multiple) {
          for (var n = function() {
            var s = t.d_value[o], l = t.visibleOptions.findIndex(function(a) {
              return t.isValidSelectedOption(a) && t.isEquals(s, t.getOptionValue(a));
            });
            if (l > -1) return {
              v: l
            };
          }, i, o = this.d_value.length - 1; o >= 0; o--)
            if (i = n(), i) return i.v;
        } else
          return this.visibleOptions.findIndex(function(r) {
            return t.isValidSelectedOption(r);
          });
      return -1;
    },
    findFirstSelectedOptionIndex: function() {
      var t = this;
      return this.$filled ? this.visibleOptions.findIndex(function(n) {
        return t.isValidSelectedOption(n);
      }) : -1;
    },
    findLastSelectedOptionIndex: function() {
      var t = this;
      return this.$filled ? Mn(this.visibleOptions, function(n) {
        return t.isValidSelectedOption(n);
      }) : -1;
    },
    findNextSelectedOptionIndex: function(t) {
      var n = this, i = this.$filled && t < this.visibleOptions.length - 1 ? this.visibleOptions.slice(t + 1).findIndex(function(o) {
        return n.isValidSelectedOption(o);
      }) : -1;
      return i > -1 ? i + t + 1 : -1;
    },
    findPrevSelectedOptionIndex: function(t) {
      var n = this, i = this.$filled && t > 0 ? Mn(this.visibleOptions.slice(0, t), function(o) {
        return n.isValidSelectedOption(o);
      }) : -1;
      return i > -1 ? i : -1;
    },
    findNearestSelectedOptionIndex: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, i = -1;
      return this.$filled && (n ? (i = this.findPrevSelectedOptionIndex(t), i = i === -1 ? this.findNextSelectedOptionIndex(t) : i) : (i = this.findNextSelectedOptionIndex(t), i = i === -1 ? this.findPrevSelectedOptionIndex(t) : i)), i > -1 ? i : t;
    },
    findFirstFocusedOptionIndex: function() {
      var t = this.findFirstSelectedOptionIndex();
      return t < 0 ? this.findFirstOptionIndex() : t;
    },
    findLastFocusedOptionIndex: function() {
      var t = this.findLastSelectedOptionIndex();
      return t < 0 ? this.findLastOptionIndex() : t;
    },
    searchOptions: function(t, n) {
      var i = this;
      this.searchValue = (this.searchValue || "") + n;
      var o = -1;
      ae(this.searchValue) && (this.focusedOptionIndex !== -1 ? (o = this.visibleOptions.slice(this.focusedOptionIndex).findIndex(function(r) {
        return i.isOptionMatched(r);
      }), o = o === -1 ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex(function(r) {
        return i.isOptionMatched(r);
      }) : o + this.focusedOptionIndex) : o = this.visibleOptions.findIndex(function(r) {
        return i.isOptionMatched(r);
      }), o === -1 && this.focusedOptionIndex === -1 && (o = this.findFirstFocusedOptionIndex()), o !== -1 && this.changeFocusedOptionIndex(t, o)), this.searchTimeout && clearTimeout(this.searchTimeout), this.searchTimeout = setTimeout(function() {
        i.searchValue = "", i.searchTimeout = null;
      }, 500);
    },
    removeOption: function(t) {
      var n = this;
      return this.d_value.filter(function(i) {
        return !no(i, n.getOptionValue(t), n.equalityKey);
      });
    },
    changeFocusedOptionIndex: function(t, n) {
      this.focusedOptionIndex !== n && (this.focusedOptionIndex = n, this.scrollInView(), this.selectOnFocus && !this.multiple && this.onOptionSelect(t, this.visibleOptions[n]));
    },
    scrollInView: function() {
      var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      this.$nextTick(function() {
        var i = n !== -1 ? "".concat(t.$id, "_").concat(n) : t.focusedOptionId, o = Ai(t.list, 'li[id="'.concat(i, '"]'));
        o ? o.scrollIntoView && o.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "smooth"
        }) : t.virtualScrollerDisabled || t.virtualScroller && t.virtualScroller.scrollToIndex(n !== -1 ? n : t.focusedOptionIndex);
      });
    },
    autoUpdateModel: function() {
      this.selectOnFocus && this.autoOptionFocus && !this.$filled && !this.multiple && this.focused && (this.focusedOptionIndex = this.findFirstFocusedOptionIndex(), this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex]));
    },
    updateModel: function(t, n) {
      this.writeValue(n, t), this.$emit("change", {
        originalEvent: t,
        value: n
      });
    },
    listRef: function(t, n) {
      this.list = t, n && n(t);
    },
    virtualScrollerRef: function(t) {
      this.virtualScroller = t;
    }
  },
  computed: {
    optionsListFlat: function() {
      return this.filterValue ? ur.filter(this.options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale) : this.options;
    },
    optionsListGroup: function() {
      var t = this, n = [];
      return (this.options || []).forEach(function(i) {
        var o = t.getOptionGroupChildren(i) || [], r = t.filterValue ? ur.filter(o, t.searchFields, t.filterValue, t.filterMatchMode, t.filterLocale) : o;
        r != null && r.length && n.push.apply(n, [{
          optionGroup: i,
          group: !0
        }].concat(ir(r)));
      }), n;
    },
    visibleOptions: function() {
      return this.optionGroupLabel ? this.optionsListGroup : this.optionsListFlat;
    },
    // @deprecated use $filled instead
    hasSelectedOption: function() {
      return ae(this.d_value);
    },
    equalityKey: function() {
      return this.optionValue ? null : this.dataKey;
    },
    searchFields: function() {
      return this.filterFields || [this.optionLabel];
    },
    filterResultMessageText: function() {
      return ae(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
    },
    filterMessageText: function() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptyFilterMessageText: function() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || "";
    },
    emptyMessageText: function() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || "";
    },
    selectionMessageText: function() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText: function() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText: function() {
      return this.$filled ? this.selectionMessageText.replaceAll("{0}", this.multiple ? this.d_value.length : "1") : this.emptySelectionMessageText;
    },
    focusedOptionId: function() {
      return this.focusedOptionIndex !== -1 ? "".concat(this.$id, "_").concat(this.focusedOptionIndex) : null;
    },
    ariaSetSize: function() {
      var t = this;
      return this.visibleOptions.filter(function(n) {
        return !t.isOptionGroup(n);
      }).length;
    },
    virtualScrollerDisabled: function() {
      return !this.virtualScrollerOptions;
    },
    containerDataP: function() {
      return rt({
        invalid: this.$invalid,
        disabled: this.disabled
      });
    }
  },
  directives: {
    ripple: ls
  },
  components: {
    InputText: jn,
    VirtualScroller: gs,
    InputIcon: ps,
    IconField: fs,
    SearchIcon: cs,
    CheckIcon: ds,
    BlankIcon: us
  }
}, tv = ["id", "data-p"], nv = ["tabindex"], iv = ["id", "aria-multiselectable", "aria-label", "aria-labelledby", "aria-activedescendant", "aria-disabled"], ov = ["id"], rv = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousedown", "onMousemove", "onDblclick", "data-p-selected", "data-p-focused", "data-p-disabled"], sv = ["tabindex"];
function lv(e, t, n, i, o, r) {
  var s = Le("InputText"), l = Le("SearchIcon"), a = Le("InputIcon"), d = Le("IconField"), u = Le("CheckIcon"), c = Le("BlankIcon"), f = Le("VirtualScroller"), h = es("ripple");
  return I(), P("div", V({
    id: e.$id,
    class: e.cx("root"),
    onFocusout: t[7] || (t[7] = function() {
      return r.onFocusout && r.onFocusout.apply(r, arguments);
    }),
    "data-p": r.containerDataP
  }, e.ptmi("root")), [K("span", V({
    ref: "firstHiddenFocusableElement",
    role: "presentation",
    "aria-hidden": "true",
    class: "p-hidden-accessible p-hidden-focusable",
    tabindex: e.disabled ? -1 : e.tabindex,
    onFocus: t[0] || (t[0] = function() {
      return r.onFirstHiddenFocus && r.onFirstHiddenFocus.apply(r, arguments);
    })
  }, e.ptm("hiddenFirstFocusableEl"), {
    "data-p-hidden-accessible": !0,
    "data-p-hidden-focusable": !0
  }), null, 16, nv), e.$slots.header ? (I(), P("div", V({
    key: 0,
    class: e.cx("header")
  }, e.ptm("header")), [de(e.$slots, "header", {
    value: e.d_value,
    options: r.visibleOptions
  })], 16)) : re("", !0), e.filter ? (I(), P("div", V({
    key: 1,
    class: e.cx("header")
  }, e.ptm("header")), [q(d, {
    unstyled: e.unstyled,
    pt: e.ptm("pcFilterContainer")
  }, {
    default: Qe(function() {
      return [q(s, {
        modelValue: o.filterValue,
        "onUpdate:modelValue": t[1] || (t[1] = function(b) {
          return o.filterValue = b;
        }),
        type: "text",
        class: st(e.cx("pcFilter")),
        placeholder: e.filterPlaceholder,
        role: "searchbox",
        autocomplete: "off",
        disabled: e.disabled,
        unstyled: e.unstyled,
        "aria-owns": e.$id + "_list",
        "aria-activedescendant": r.focusedOptionId,
        tabindex: !e.disabled && !o.focused ? e.tabindex : -1,
        onInput: r.onFilterChange,
        onKeydown: r.onFilterKeyDown,
        pt: e.ptm("pcFilter")
      }, null, 8, ["modelValue", "class", "placeholder", "disabled", "unstyled", "aria-owns", "aria-activedescendant", "tabindex", "onInput", "onKeydown", "pt"]), q(a, {
        unstyled: e.unstyled,
        pt: e.ptm("pcFilterIconContainer")
      }, {
        default: Qe(function() {
          return [de(e.$slots, "filtericon", {}, function() {
            return [e.filterIcon ? (I(), P("span", V({
              key: 0,
              class: e.filterIcon
            }, e.ptm("filterIcon")), null, 16)) : (I(), ke(l, ya(V({
              key: 1
            }, e.ptm("filterIcon"))), null, 16))];
          })];
        }),
        _: 3
      }, 8, ["unstyled", "pt"])];
    }),
    _: 3
  }, 8, ["unstyled", "pt"]), K("span", V({
    role: "status",
    "aria-live": "polite",
    class: "p-hidden-accessible"
  }, e.ptm("hiddenFilterResult"), {
    "data-p-hidden-accessible": !0
  }), oe(r.filterResultMessageText), 17)], 16)) : re("", !0), K("div", V({
    class: e.cx("listContainer"),
    style: [{
      "max-height": r.virtualScrollerDisabled ? e.scrollHeight : ""
    }, e.listStyle]
  }, e.ptm("listContainer")), [q(f, V({
    ref: r.virtualScrollerRef
  }, e.virtualScrollerOptions, {
    items: r.visibleOptions,
    style: [{
      height: e.scrollHeight
    }, e.listStyle],
    tabindex: -1,
    disabled: r.virtualScrollerDisabled,
    pt: e.ptm("virtualScroller")
  }), nu({
    content: Qe(function(b) {
      var y = b.styleClass, w = b.contentRef, v = b.items, S = b.getItemOptions, $ = b.contentStyle, g = b.itemSize;
      return [K("ul", V({
        ref: function(D) {
          return r.listRef(D, w);
        },
        id: e.$id + "_list",
        class: [e.cx("list"), y],
        style: $,
        tabindex: -1,
        role: "listbox",
        "aria-multiselectable": e.multiple,
        "aria-label": e.ariaLabel,
        "aria-labelledby": e.ariaLabelledby,
        "aria-activedescendant": o.focused ? r.focusedOptionId : void 0,
        "aria-disabled": e.disabled,
        onFocus: t[3] || (t[3] = function() {
          return r.onListFocus && r.onListFocus.apply(r, arguments);
        }),
        onBlur: t[4] || (t[4] = function() {
          return r.onListBlur && r.onListBlur.apply(r, arguments);
        }),
        onKeydown: t[5] || (t[5] = function() {
          return r.onListKeyDown && r.onListKeyDown.apply(r, arguments);
        })
      }, e.ptm("list")), [(I(!0), P(ge, null, ht(v, function(x, D) {
        return I(), P(ge, {
          key: r.getOptionRenderKey(x, r.getOptionIndex(D, S))
        }, [r.isOptionGroup(x) ? (I(), P("li", V({
          key: 0,
          id: e.$id + "_" + r.getOptionIndex(D, S),
          style: {
            height: g ? g + "px" : void 0
          },
          class: e.cx("optionGroup"),
          role: "option"
        }, {
          ref_for: !0
        }, e.ptm("optionGroup")), [de(e.$slots, "optiongroup", {
          option: x.optionGroup,
          index: r.getOptionIndex(D, S)
        }, function() {
          return [Nt(oe(r.getOptionGroupLabel(x.optionGroup)), 1)];
        })], 16, ov)) : Qr((I(), P("li", V({
          key: 1,
          id: e.$id + "_" + r.getOptionIndex(D, S),
          style: {
            height: g ? g + "px" : void 0
          },
          class: e.cx("option", {
            option: x,
            index: D,
            getItemOptions: S
          }),
          role: "option",
          "aria-label": r.getOptionLabel(x),
          "aria-selected": r.isSelected(x),
          "aria-disabled": r.isOptionDisabled(x),
          "aria-setsize": r.ariaSetSize,
          "aria-posinset": r.getAriaPosInset(r.getOptionIndex(D, S)),
          onClick: function(j) {
            return r.onOptionSelect(j, x, r.getOptionIndex(D, S));
          },
          onMousedown: function(j) {
            return r.onOptionMouseDown(j, r.getOptionIndex(D, S));
          },
          onMousemove: function(j) {
            return r.onOptionMouseMove(j, r.getOptionIndex(D, S));
          },
          onTouchend: t[2] || (t[2] = function(L) {
            return r.onOptionTouchEnd();
          }),
          onDblclick: function(j) {
            return r.onOptionDblClick(j, x);
          }
        }, {
          ref_for: !0
        }, r.getPTOptions(x, S, D, "option"), {
          "data-p-selected": !e.checkmark && r.isSelected(x),
          "data-p-focused": o.focusedOptionIndex === r.getOptionIndex(D, S),
          "data-p-disabled": r.isOptionDisabled(x)
        }), [e.checkmark ? (I(), P(ge, {
          key: 0
        }, [r.isSelected(x) ? (I(), ke(u, V({
          key: 0,
          class: e.cx("optionCheckIcon")
        }, {
          ref_for: !0
        }, e.ptm("optionCheckIcon")), null, 16, ["class"])) : (I(), ke(c, V({
          key: 1,
          class: e.cx("optionBlankIcon")
        }, {
          ref_for: !0
        }, e.ptm("optionBlankIcon")), null, 16, ["class"]))], 64)) : re("", !0), de(e.$slots, "option", {
          option: x,
          selected: r.isSelected(x),
          index: r.getOptionIndex(D, S)
        }, function() {
          return [Nt(oe(r.getOptionLabel(x)), 1)];
        })], 16, rv)), [[h]])], 64);
      }), 128)), o.filterValue && (!v || v && v.length === 0) ? (I(), P("li", V({
        key: 0,
        class: e.cx("emptyMessage"),
        role: "option"
      }, e.ptm("emptyMessage")), [de(e.$slots, "emptyfilter", {}, function() {
        return [Nt(oe(r.emptyFilterMessageText), 1)];
      })], 16)) : !e.options || e.options && e.options.length === 0 ? (I(), P("li", V({
        key: 1,
        class: e.cx("emptyMessage"),
        role: "option"
      }, e.ptm("emptyMessage")), [de(e.$slots, "empty", {}, function() {
        return [Nt(oe(r.emptyMessageText), 1)];
      })], 16)) : re("", !0)], 16, iv)];
    }),
    _: 2
  }, [e.$slots.loader ? {
    name: "loader",
    fn: Qe(function(b) {
      var y = b.options;
      return [de(e.$slots, "loader", {
        options: y
      })];
    }),
    key: "0"
  } : void 0]), 1040, ["items", "style", "disabled", "pt"])], 16), de(e.$slots, "footer", {
    value: e.d_value,
    options: r.visibleOptions
  }), !e.options || e.options && e.options.length === 0 ? (I(), P("span", V({
    key: 2,
    role: "status",
    "aria-live": "polite",
    class: "p-hidden-accessible"
  }, e.ptm("hiddenEmptyMessage"), {
    "data-p-hidden-accessible": !0
  }), oe(r.emptyMessageText), 17)) : re("", !0), K("span", V({
    role: "status",
    "aria-live": "polite",
    class: "p-hidden-accessible"
  }, e.ptm("hiddenSelectedMessage"), {
    "data-p-hidden-accessible": !0
  }), oe(r.selectedMessageText), 17), K("span", V({
    ref: "lastHiddenFocusableElement",
    role: "presentation",
    "aria-hidden": "true",
    class: "p-hidden-accessible p-hidden-focusable",
    tabindex: e.disabled ? -1 : e.tabindex,
    onFocus: t[6] || (t[6] = function() {
      return r.onLastHiddenFocus && r.onLastHiddenFocus.apply(r, arguments);
    })
  }, e.ptm("hiddenLastFocusableEl"), {
    "data-p-hidden-accessible": !0,
    "data-p-hidden-focusable": !0
  }), null, 16, sv)], 16, tv);
}
Hu.render = lv;
var av = `
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`, uv = {
  root: function(t) {
    var n = t.instance, i = t.props;
    return ["p-textarea p-component", {
      "p-filled": n.$filled,
      "p-textarea-resizable ": i.autoResize,
      "p-textarea-sm p-inputfield-sm": i.size === "small",
      "p-textarea-lg p-inputfield-lg": i.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-textarea-fluid": n.$fluid
    }];
  }
}, dv = be.extend({
  name: "textarea",
  style: av,
  classes: uv
}), cv = {
  name: "BaseTextarea",
  extends: hs,
  props: {
    autoResize: Boolean
  },
  style: dv,
  provide: function() {
    return {
      $pcTextarea: this,
      $parentInstance: this
    };
  }
};
function Ei(e) {
  "@babel/helpers - typeof";
  return Ei = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ei(e);
}
function fv(e, t, n) {
  return (t = pv(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function pv(e) {
  var t = hv(e, "string");
  return Ei(t) == "symbol" ? t : t + "";
}
function hv(e, t) {
  if (Ei(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Ei(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Rn = {
  name: "Textarea",
  extends: cv,
  inheritAttrs: !1,
  observer: null,
  mounted: function() {
    var t = this;
    this.autoResize && (this.observer = new ResizeObserver(function() {
      requestAnimationFrame(function() {
        t.resize();
      });
    }), this.observer.observe(this.$el));
  },
  updated: function() {
    this.autoResize && this.resize();
  },
  beforeUnmount: function() {
    this.observer && this.observer.disconnect();
  },
  methods: {
    resize: function() {
      if (this.$el.offsetParent) {
        var t = this.$el.style.height, n = parseInt(t) || 0, i = this.$el.scrollHeight, o = !n || i > n, r = n && i < n;
        r ? (this.$el.style.height = "auto", this.$el.style.height = "".concat(this.$el.scrollHeight, "px")) : o && (this.$el.style.height = "".concat(i, "px"));
      }
    },
    onInput: function(t) {
      this.autoResize && this.resize(), this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return V(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return rt(fv({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, gv = ["value", "name", "disabled", "aria-invalid", "data-p"];
function mv(e, t, n, i, o, r) {
  return I(), P("textarea", V({
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.invalid || void 0,
    "data-p": r.dataP,
    onInput: t[0] || (t[0] = function() {
      return r.onInput && r.onInput.apply(r, arguments);
    })
  }, r.attrs), null, 16, gv);
}
Rn.render = mv;
const bv = new RegExp("(?<!\\{)\\{([A-Za-z_][A-Za-z0-9_]*)\\}(?!\\})", "g"), vv = /^[A-Za-z_][A-Za-z0-9_]*$/, yv = /* @__PURE__ */ new Set(["id", "name", "category", "template", "negative_prompt", "variables"]);
let Sv = 1;
function ms(e = "", t = "") {
  return { key: Sv++, name: e, value: t };
}
function bs(e) {
  const t = Object.fromEntries(Object.entries(e).filter(([n]) => !yv.has(n)));
  return {
    id: e.id,
    name: e.name,
    category: e.category ?? "",
    template: e.template,
    negative_prompt: e.negative_prompt ?? "",
    variables: Object.entries(e.variables ?? {}).map(([n, i]) => ms(n, i)),
    extra: t
  };
}
function wv() {
  return { id: null, name: "New template", category: "", template: "", negative_prompt: "", variables: [], extra: {} };
}
function Ov(e) {
  return { ...bs(e), id: null, name: `${e.name} (copy)` };
}
function yo(e) {
  const t = {
    ...e.extra,
    name: e.name,
    category: e.category,
    template: e.template,
    negative_prompt: e.negative_prompt,
    variables: Object.fromEntries(e.variables.map((n) => [n.name, n.value]))
  };
  return e.id === null ? t : { id: e.id, ...t };
}
function xv(e) {
  const t = [];
  e.name.trim() || t.push({ field: "name", message: "Name is required" });
  const n = /* @__PURE__ */ new Set();
  for (const i of e.variables)
    vv.test(i.name) ? n.has(i.name) && t.push({ field: "variables", message: `Duplicate variable name '${i.name}'` }) : t.push({ field: "variables", message: `Invalid variable name '${i.name}' (letters, digits and _ only)` }), n.add(i.name);
  return t;
}
function Kl(e) {
  return JSON.stringify(e, Object.keys(e).sort());
}
function Hl(e, t) {
  if (t === null || e.id === null) return !0;
  const n = yo(e), i = yo(bs(t));
  return Kl(n) !== Kl(i) || JSON.stringify(Object.entries(n.variables)) !== JSON.stringify(Object.entries(i.variables));
}
function Iv(...e) {
  const t = [];
  for (const n of e)
    for (const i of n.matchAll(bv))
      t.includes(i[1]) || t.push(i[1]);
  return t;
}
function $v(e) {
  const t = new Set(e.variables.map((i) => i.name)), n = Iv(e.template, e.negative_prompt).filter((i) => !t.has(i));
  for (const i of n) e.variables.push(ms(i, ""));
  return n;
}
const Uu = /* @__PURE__ */ new Map();
function _v(e) {
  return e ? Uu.get(e) : void 0;
}
function Cv(e, t) {
  e && Uu.set(e, t);
}
const kv = { class: "nf-editor-host" }, Tv = { class: "nf-editor-list" }, Pv = { class: "nf-row" }, Lv = {
  key: 0,
  class: "nf-editor-form"
}, Ev = {
  key: 0,
  class: "nf-notice",
  "data-level": "error"
}, Av = { class: "nf-field-grid" }, Mv = { class: "nf-field-static" }, Fv = ["value"], Vv = { class: "nf-row nf-section-header" }, Nv = {
  key: 1,
  class: "nf-var-table"
}, Dv = {
  key: 2,
  class: "nf-muted"
}, jv = {
  key: 3,
  class: "nf-errors"
}, Rv = { class: "nf-preview" }, zv = { class: "nf-preview-text" }, Bv = {
  key: 0,
  class: "nf-preview-text nf-preview-negative"
}, Kv = {
  key: 1,
  class: "nf-warnings"
}, Hv = {
  key: 1,
  class: "nf-notice",
  "data-level": "error"
}, Uv = {
  key: 4,
  class: "nf-notice",
  "data-level": "error"
}, Wv = { class: "nf-row nf-editor-actions" }, Gv = {
  key: 1,
  class: "nf-editor-form nf-editor-empty"
}, qv = {
  key: 0,
  class: "nf-notice",
  "data-level": "error"
}, Wu = /* @__PURE__ */ rn({
  __name: "TemplateEditor",
  props: {
    initialId: {},
    sessionKey: {}
  },
  setup(e, { expose: t }) {
    const n = e, i = /* @__PURE__ */ Ve(null), o = /* @__PURE__ */ Ve(null), r = /* @__PURE__ */ Ve(!1), s = /* @__PURE__ */ Ve(null), l = $e(() => i.value ? Xt(i.value) ?? null : null), a = $e(() => o.value !== null && Hl(o.value, l.value)), d = $e(() => o.value ? xv(o.value) : []), u = $e(() => he.error?.code === "LIBRARY_CORRUPT"), c = $e(() => a.value && d.value.length === 0 && !r.value && !u.value), f = $e(() => Nu(he.templates)), h = $e(() => [...new Set(he.templates.map((z) => z.category).filter(Boolean))]), b = `nf-categories-${Math.random().toString(36).slice(2)}`;
    function y(z) {
      i.value = z?.id ?? null, o.value = z ? bs(z) : null, s.value = null;
    }
    function w() {
      y(he.templates[0] ?? null);
    }
    async function v() {
      return !o.value || !a.value ? !0 : Os("Discard changes?", `"${o.value.name}" has unsaved changes. Discard them?`);
    }
    async function S() {
      const z = i.value;
      i.value = "\0", await Yr(), i.value = z;
    }
    async function $(z) {
      if (!z || z === i.value || !await v()) {
        await S();
        return;
      }
      y(Xt(z) ?? null);
    }
    async function g() {
      await v() && (i.value = null, o.value = wv(), s.value = null);
    }
    async function x() {
      if (!l.value || !await v()) return;
      const z = l.value;
      i.value = null, o.value = Ov(z), s.value = null;
    }
    function D() {
      l.value ? y(l.value) : w();
    }
    function L(z) {
      return z instanceof xn ? z.status === 409 && z.code === "CONFLICT" ? "The library was changed elsewhere and has been reloaded. Review your edits and save again." : z.message : String(z);
    }
    async function j() {
      if (!(!o.value || !c.value)) {
        r.value = !0, s.value = null;
        try {
          const z = yo(o.value), H = o.value.id === null ? await sm(z) : await lm(o.value.id, z);
          y(H), vn("success", "Template saved", H.name);
        } catch (z) {
          s.value = L(z);
        } finally {
          r.value = !1;
        }
      }
    }
    async function N() {
      const z = l.value;
      if (z && await Os("Delete template?", `Delete "${z.name}" (${z.id})? This cannot be undone.`))
        try {
          await am(z.id), vn("success", "Template deleted", z.name), w();
        } catch (H) {
          s.value = L(H);
        }
    }
    async function G() {
      await Vo();
    }
    function U() {
      o.value?.variables.push(ms("", ""));
    }
    function E(z) {
      o.value && (o.value.variables = o.value.variables.filter((H) => H.key !== z));
    }
    function te() {
      if (!o.value) return;
      $v(o.value).length || vn("info", "No missing variables");
    }
    lt(l, (z, H) => {
      !o.value || o.value.id === null || !H || Hl(o.value, H) || (z ? y(z) : w());
    });
    const X = /* @__PURE__ */ Ve(null), ce = /* @__PURE__ */ Ve(null);
    let se, ne = 0;
    lt(
      o,
      () => {
        clearTimeout(se), se = setTimeout(le, 300);
      },
      { deep: !0 }
    );
    async function le() {
      const z = ++ne;
      if (!o.value || d.value.length) {
        X.value = null, ce.value = null;
        return;
      }
      try {
        const H = { ...yo(o.value), id: o.value.id ?? "draft" }, Z = await Bn(`${ji}/expand`, {
          method: "POST",
          body: JSON.stringify({ template: H, variables: {} })
        });
        if (z !== ne) return;
        X.value = Z, ce.value = null;
      } catch (H) {
        if (z !== ne) return;
        X.value = null, ce.value = L(H);
      }
    }
    function Te(z) {
      (z.ctrlKey || z.metaKey) && z.key.toLowerCase() === "s" && (z.preventDefault(), j());
    }
    return Cn(async () => {
      const z = _v(n.sessionKey);
      if (z && (i.value = z.selectedId, o.value = z.form), await Mu(), z?.form) return;
      const H = n.initialId ? Xt(n.initialId) : void 0;
      H ? y(H) : w();
    }), Vi(() => {
      clearTimeout(se), Cv(n.sessionKey, { selectedId: i.value, form: o.value });
    }), t({ confirmDiscard: v, select: $ }), (z, H) => (I(), P("div", kv, [
      K("div", {
        class: "nf-editor",
        onKeydown: Te
      }, [
        K("aside", Tv, [
          K("div", Pv, [
            q(B(Ce), {
              class: "nf-button nf-grow",
              icon: "pi pi-plus",
              label: "New",
              onClick: g
            }),
            q(B(Ce), {
              class: "nf-icon-button",
              icon: "pi pi-refresh",
              title: "Reload from disk",
              onClick: G
            })
          ]),
          q(B(Hu), {
            "model-value": i.value,
            options: f.value,
            "option-label": "name",
            "option-value": "id",
            "option-group-label": "label",
            "option-group-children": "items",
            filter: "",
            "filter-placeholder": "Search",
            "empty-message": "No templates",
            "onUpdate:modelValue": $
          }, null, 8, ["model-value", "options"])
        ]),
        o.value ? (I(), P("section", Lv, [
          B(he).error ? (I(), P("div", Ev, " Library error: " + oe(B(he).error.message), 1)) : re("", !0),
          K("div", Av, [
            H[4] || (H[4] = K("label", { class: "nf-field-label" }, "Name", -1)),
            q(B(jn), {
              modelValue: o.value.name,
              "onUpdate:modelValue": H[0] || (H[0] = (Z) => o.value.name = Z),
              "aria-label": "Template name",
              invalid: d.value.some((Z) => Z.field === "name")
            }, null, 8, ["modelValue", "invalid"]),
            H[5] || (H[5] = K("label", { class: "nf-field-label" }, "Category", -1)),
            q(B(jn), {
              modelValue: o.value.category,
              "onUpdate:modelValue": H[1] || (H[1] = (Z) => o.value.category = Z),
              "aria-label": "Category",
              list: b,
              placeholder: "(none)"
            }, null, 8, ["modelValue"]),
            H[6] || (H[6] = K("label", { class: "nf-field-label" }, "ID", -1)),
            K("span", Mv, oe(o.value.id ?? "assigned on first save"), 1)
          ]),
          K("datalist", { id: b }, [
            (I(!0), P(ge, null, ht(h.value, (Z) => (I(), P("option", {
              key: Z,
              value: Z
            }, null, 8, Fv))), 128))
          ]),
          H[10] || (H[10] = K("label", { class: "nf-field-label" }, "Template", -1)),
          q(B(Rn), {
            modelValue: o.value.template,
            "onUpdate:modelValue": H[2] || (H[2] = (Z) => o.value.template = Z),
            "aria-label": "Template",
            rows: "4",
            "auto-resize": "",
            spellcheck: "false",
            placeholder: "{quality}, {character}"
          }, null, 8, ["modelValue"]),
          H[11] || (H[11] = K("label", { class: "nf-field-label" }, "Negative prompt", -1)),
          q(B(Rn), {
            modelValue: o.value.negative_prompt,
            "onUpdate:modelValue": H[3] || (H[3] = (Z) => o.value.negative_prompt = Z),
            "aria-label": "Negative prompt",
            rows: "2",
            "auto-resize": "",
            spellcheck: "false"
          }, null, 8, ["modelValue"]),
          K("div", Vv, [
            H[7] || (H[7] = K("span", { class: "nf-field-label nf-grow" }, "Variables (name / default)", -1)),
            q(B(Ce), {
              class: "nf-button",
              icon: "pi pi-bolt",
              label: "Add missing",
              title: "Add variables for {placeholders} without a definition",
              onClick: te
            }),
            q(B(Ce), {
              class: "nf-button",
              icon: "pi pi-plus",
              label: "Add",
              onClick: U
            })
          ]),
          o.value.variables.length ? (I(), P("div", Nv, [
            (I(!0), P(ge, null, ht(o.value.variables, (Z) => (I(), P(ge, {
              key: Z.key
            }, [
              q(B(jn), {
                modelValue: Z.name,
                "onUpdate:modelValue": (De) => Z.name = De,
                placeholder: "name",
                spellcheck: "false",
                "aria-label": `Variable name ${Z.name}`
              }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
              q(B(Rn), {
                modelValue: Z.value,
                "onUpdate:modelValue": (De) => Z.value = De,
                rows: "1",
                "auto-resize": "",
                spellcheck: "false",
                placeholder: "(empty)",
                "aria-label": `Default value of ${Z.name}`
              }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
              q(B(Ce), {
                class: "nf-icon-button",
                icon: "pi pi-trash",
                title: `Remove variable ${Z.name}`,
                onClick: (De) => E(Z.key)
              }, null, 8, ["title", "onClick"])
            ], 64))), 128))
          ])) : (I(), P("div", Dv, "No variables")),
          d.value.length ? (I(), P("ul", jv, [
            (I(!0), P(ge, null, ht(d.value, (Z, De) => (I(), P("li", { key: De }, oe(Z.message), 1))), 128))
          ])) : re("", !0),
          K("div", Rv, [
            H[8] || (H[8] = K("div", { class: "nf-preview-label" }, "preview (defaults)", -1)),
            X.value ? (I(), P(ge, { key: 0 }, [
              K("pre", zv, oe(X.value.positive || " "), 1),
              X.value.negative ? (I(), P("pre", Bv, oe(X.value.negative), 1)) : re("", !0),
              X.value.warnings.length ? (I(), P("ul", Kv, [
                (I(!0), P(ge, null, ht(X.value.warnings, (Z, De) => (I(), P("li", { key: De }, oe(Z.message), 1))), 128))
              ])) : re("", !0)
            ], 64)) : ce.value ? (I(), P("div", Hv, oe(ce.value), 1)) : re("", !0)
          ]),
          s.value ? (I(), P("div", Uv, oe(s.value), 1)) : re("", !0),
          K("div", Wv, [
            q(B(Ce), {
              class: "nf-button nf-button-primary",
              icon: "pi pi-save",
              label: r.value ? "Saving…" : "Save",
              disabled: !c.value,
              title: "Save (Ctrl+S)",
              onClick: j
            }, null, 8, ["label", "disabled"]),
            q(B(Ce), {
              class: "nf-button",
              icon: "pi pi-undo",
              label: "Revert",
              disabled: !a.value,
              onClick: D
            }, null, 8, ["disabled"]),
            H[9] || (H[9] = K("span", { class: "nf-grow" }, null, -1)),
            q(B(Ce), {
              class: "nf-button",
              icon: "pi pi-copy",
              label: "Duplicate",
              disabled: !l.value,
              onClick: x
            }, null, 8, ["disabled"]),
            q(B(Ce), {
              class: "nf-button nf-button-danger",
              icon: "pi pi-trash",
              label: "Delete",
              disabled: !l.value || u.value,
              onClick: N
            }, null, 8, ["disabled"])
          ])
        ])) : (I(), P("section", Gv, [
          B(he).error ? (I(), P("div", qv, "Library error: " + oe(B(he).error.message), 1)) : re("", !0),
          H[12] || (H[12] = K("p", { class: "nf-muted" }, "No template selected.", -1)),
          q(B(Ce), {
            class: "nf-button",
            icon: "pi pi-plus",
            label: "Create a template",
            onClick: g
          })
        ]))
      ], 32)
    ]));
  }
}), Jv = /* @__PURE__ */ rn({
  __name: "EditorModal",
  props: {
    initialId: {},
    onClose: { type: Function }
  },
  setup(e, { expose: t }) {
    const n = e, i = /* @__PURE__ */ Ve();
    async function o() {
      await (i.value?.confirmDiscard() ?? !0) && n.onClose();
    }
    return t({ select: (r) => i.value?.select(r) }), (r, s) => (I(), ke(Wb, {
      title: "Prompt Templates",
      onCloseRequest: o
    }, {
      default: Qe(() => [
        q(Wu, {
          ref_key: "editor",
          ref: i,
          "initial-id": e.initialId
        }, null, 8, ["initial-id"])
      ]),
      _: 1
    }));
  }
});
let Qi = null;
function Yv(e = null) {
  if (Qi) {
    Qi.select(e);
    return;
  }
  const t = document.createElement("div");
  t.className = "nf-modal-container", document.body.appendChild(t);
  const n = Di(t, Jv, {
    initialId: e,
    onClose: () => {
      n.unmount(), t.remove(), Qi = null;
    }
  });
  Qi = n.instance;
}
const Zv = {
  key: 0,
  class: "nf-vars"
}, Qv = ["title"], Xv = /* @__PURE__ */ rn({
  __name: "VariableFields",
  props: {
    defaults: {},
    values: {},
    disabled: { type: Boolean },
    connectedInputs: {}
  },
  emits: ["update", "reset"],
  setup(e, { emit: t }) {
    const n = t;
    return (i, o) => Object.keys(e.defaults).length ? (I(), P("div", Zv, [
      (I(!0), P(ge, null, ht(e.defaults, (r, s) => (I(), P("div", {
        key: s,
        class: "nf-var"
      }, [
        K("span", {
          class: "nf-var-label",
          title: `{${s}}`
        }, oe(s), 9, Qv),
        e.connectedInputs?.includes(String(s)) ? (I(), ke(B(Rn), {
          key: 0,
          class: "nf-var-input",
          "model-value": "",
          placeholder: `(from ${s})`,
          title: `Replaced by the connected ${s} input`,
          disabled: "",
          rows: "1"
        }, null, 8, ["placeholder", "title"])) : (I(), ke(B(Rn), {
          key: 1,
          class: "nf-var-input",
          "model-value": e.values[s] ?? r,
          placeholder: r ? `default: ${r}` : "(empty)",
          disabled: e.disabled,
          rows: "1",
          "auto-resize": "",
          spellcheck: "false",
          "onUpdate:modelValue": (l) => n("update", String(s), l ?? "")
        }, null, 8, ["model-value", "placeholder", "disabled", "onUpdate:modelValue"])),
        q(B(Ce), {
          class: "nf-icon-button",
          icon: "pi pi-undo",
          disabled: e.disabled || e.connectedInputs?.includes(String(s)) || (e.values[s] ?? r) === r,
          title: "Reset to default",
          onClick: (l) => n("reset", String(s))
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ])) : re("", !0);
  }
}), ey = { class: "nf-row" }, ty = ["data-level"], ny = {
  key: 2,
  class: "nf-preview"
}, iy = { class: "nf-preview-text" }, oy = { class: "nf-preview-text nf-preview-negative" }, ry = {
  key: 1,
  class: "nf-warnings"
}, sy = {
  key: 3,
  class: "nf-notice",
  "data-level": "error"
}, ly = /* @__PURE__ */ rn({
  __name: "PromptTemplateNode",
  props: {
    controller: {}
  },
  setup(e) {
    const t = e, n = t.controller.state, i = $e(() => Nu(he.templates)), o = $e(() => Xt(n.templateId) ? n.templateId : null), r = $e(() => n.templateId ? `${n.snapshot?.name ?? n.templateId} (not in library)` : "Select a template");
    function s($) {
      $ && $ !== n.templateId && t.controller.selectTemplate($);
    }
    async function l() {
      await Vo(), t.controller.captureSnapshot(), t.controller.fit();
    }
    Cn(async () => {
      await Mu(), t.controller.fit();
    });
    const a = $e(
      () => fm(n.templateId, Xt(n.templateId), n.snapshot, n.pinned)
    ), d = {
      none: "",
      no_template: "",
      pinned: "Pinned: using the snapshot",
      pinned_without_snapshot: "Pinned, but this node has no snapshot",
      snapshot_outdated: "Template changed since the last snapshot (updated on next queue)",
      template_missing: "Template not in library: using the snapshot",
      not_found: "Template not found and no snapshot"
    }, u = $e(() => {
      if (he.error) return { level: "error", text: `Library error: ${he.error.message}` };
      const $ = a.value.notice;
      return d[$] ? { level: $ === "not_found" || $ === "pinned_without_snapshot" ? "error" : $ === "pinned" ? "info" : "warn", text: d[$] } : null;
    }), c = () => Object.fromEntries(n.connectedInputs.map(($) => [$, `‹from ${$}›`])), f = /* @__PURE__ */ Ve(null), h = /* @__PURE__ */ Ve(null);
    let b = 0, y;
    function w() {
      clearTimeout(y), y = setTimeout(v, 250);
    }
    async function v() {
      const $ = a.value.template, g = ++b;
      if (!$) {
        f.value = null, h.value = null;
        return;
      }
      try {
        const x = await Bn(`${ji}/expand`, {
          method: "POST",
          body: JSON.stringify({
            template: $,
            variables: n.variables,
            inputs: c()
          })
        });
        if (g !== b) return;
        f.value = x, h.value = null;
      } catch (x) {
        if (g !== b) return;
        f.value = null, h.value = x instanceof xn ? `[${x.code}] ${x.message}` : String(x);
      }
      t.controller.fit();
    }
    lt(() => [a.value.template, n.variables, n.connectedInputs], w, {
      immediate: !0,
      deep: !0
    });
    function S($) {
      let g = $.target;
      for (; g && g !== $.currentTarget; ) {
        if (g.scrollHeight > g.clientHeight && getComputedStyle(g).overflowY !== "visible") {
          $.stopPropagation();
          return;
        }
        g = g.parentElement;
      }
    }
    return ($, g) => (I(), P("div", {
      class: "nf-root nf-pt",
      onWheel: S
    }, [
      K("div", ey, [
        q(B(Ku), {
          class: "nf-grow",
          "model-value": o.value,
          options: i.value,
          "option-label": "name",
          "option-value": "id",
          "option-group-label": "label",
          "option-group-children": "items",
          placeholder: r.value,
          filter: B(he).templates.length > 8,
          loading: B(he).loading,
          "append-to": "body",
          "onUpdate:modelValue": s
        }, null, 8, ["model-value", "options", "placeholder", "filter", "loading"]),
        q(B(Ce), {
          class: "nf-icon-button",
          icon: "pi pi-refresh",
          title: "Reload templates",
          disabled: B(he).loading,
          onClick: l
        }, null, 8, ["disabled"]),
        q(B(Ce), {
          class: "nf-icon-button",
          icon: "pi pi-pencil",
          title: "Edit templates",
          onClick: g[0] || (g[0] = (x) => B(Yv)(B(n).templateId || null))
        })
      ]),
      u.value ? (I(), P("div", {
        key: 0,
        class: "nf-notice",
        "data-level": u.value.level
      }, oe(u.value.text), 9, ty)) : re("", !0),
      a.value.template ? (I(), ke(Xv, {
        key: 1,
        defaults: a.value.template.variables,
        values: B(n).variables,
        "connected-inputs": B(n).connectedInputs,
        onUpdate: g[1] || (g[1] = (x, D) => e.controller.setVariable(x, D)),
        onReset: g[2] || (g[2] = (x) => e.controller.resetVariable(x))
      }, null, 8, ["defaults", "values", "connected-inputs"])) : re("", !0),
      f.value ? (I(), P("div", ny, [
        g[4] || (g[4] = K("div", { class: "nf-preview-label" }, "positive", -1)),
        K("pre", iy, oe(f.value.positive || " "), 1),
        f.value.negative ? (I(), P(ge, { key: 0 }, [
          g[3] || (g[3] = K("div", { class: "nf-preview-label" }, "negative", -1)),
          K("pre", oy, oe(f.value.negative), 1)
        ], 64)) : re("", !0),
        f.value.warnings.length ? (I(), P("ul", ry, [
          (I(!0), P(ge, null, ht(f.value.warnings, (x, D) => (I(), P("li", { key: D }, oe(x.message), 1))), 128))
        ])) : re("", !0)
      ])) : h.value ? (I(), P("div", sy, oe(h.value), 1)) : re("", !0)
    ], 32));
  }
}), Ul = 320;
function ay(e) {
  for (const l of [ft.templateId, ft.variables, ft.snapshot]) {
    const a = to(e, l);
    a && qu(a);
  }
  const t = new pm(e), n = to(e, ft.pinSnapshot);
  n && Ju(n, () => t.syncFromWidgets()), Wl(e, () => t.syncFromWidgets()), Zu(e, () => t.syncConnections());
  const i = document.createElement("div");
  i.className = "nf-widget-container";
  const o = Vr(e, "nf_prompt_template_ui", i, {
    getMinHeight: () => Math.max(60, i.firstElementChild?.offsetHeight ?? 0)
  });
  o.beforeQueued = () => t.captureSnapshot();
  const { unmount: r } = Di(i, ly, { controller: t }), s = o.onRemove;
  o.onRemove = () => {
    r(), s?.call(o);
  }, e.size[0] < Ul && e.setSize?.([Ul, e.size[1]]);
}
const uy = /* @__PURE__ */ rn({
  __name: "SidebarEditor",
  setup(e) {
    return (t, n) => (I(), P("div", {
      class: "nf-root nf-sidebar",
      onKeydown: n[0] || (n[0] = ss(() => {
      }, ["stop"]))
    }, [
      n[1] || (n[1] = K("header", { class: "nf-sidebar-header" }, "Prompt Templates", -1)),
      q(Wu, { "session-key": "sidebar" })
    ], 32));
  }
});
function dy() {
  let e = null;
  Qu({
    id: "nf-prompt-templates",
    title: "Prompt Templates",
    tooltip: "NF Prompt Templates",
    icon: "pi pi-file-edit",
    render(t) {
      e?.(), e = Di(t, uy).unmount;
    },
    destroy() {
      e?.(), e = null;
    }
  });
}
function cy() {
  const e = new URL(
    /* @vite-ignore */
    "./main.css",
    import.meta.url
  ).href;
  if (document.querySelector(`link[href="${e}"]`)) return;
  const t = document.createElement("link");
  t.rel = "stylesheet", t.href = e, document.head.appendChild(t);
}
cy();
Gu({
  name: "NyaFu.NFSuite",
  setup() {
    dy();
  },
  nodeCreated(e) {
    e.comfyClass === rm ? ay(e) : e.comfyClass === _g ? Tg(e) : e.comfyClass === Ml && Zg(e);
  },
  // Only this node's menu gets the items (right-clicking other nodes or the canvas is unchanged).
  getNodeMenuItems(e) {
    return e.comfyClass !== Ml ? [] : im(e);
  }
});
//# sourceMappingURL=main.js.map
