import { api as Xt } from "../../scripts/api.js";
import { app as Dt } from "../../scripts/app.js";
function Bu(e) {
  Dt.registerExtension(e);
}
function eo(e, t) {
  return e.widgets?.find((n) => n.name === t);
}
function Ln(e, t, n) {
  const r = eo(e, t);
  return r === void 0 || r.value === void 0 ? n : r.value;
}
function Do(e, t, n) {
  const r = eo(e, t);
  return r ? (r.value === n || (r.value = n, e.setDirtyCanvas?.(!0, !0)), !0) : !1;
}
function Hu(e) {
  e.hidden = !0, e.options.hidden = !0;
}
function Ku(e, t) {
  const n = e.callback;
  e.callback = function(r, ...o) {
    const i = n?.call(this, r, ...o);
    return t(r), i;
  };
}
function El(e, t) {
  const n = e, r = n.onConfigure;
  n.onConfigure = function(...o) {
    const i = r?.apply(this, o);
    return t(), i;
  };
}
function Uu(e, t) {
  return e.inputs?.find((n) => n.name === t)?.link != null;
}
function Wu(e, t) {
  const n = e, r = n.onConnectionsChange;
  n.onConnectionsChange = function(...o) {
    const i = r?.apply(this, o);
    return t(), i;
  };
}
function Ai(e, t, n, r = {}) {
  const o = e.addDOMWidget(t, "nf-ui", n, {
    hideOnZoom: !1,
    ...r,
    serialize: !1
  });
  return o.serialize = !1, o;
}
function Al(e) {
  const t = e.computeSize?.();
  if (!t) return;
  const [n, r] = e.size;
  t[1] > r && e.setSize?.([n, t[1]]), e.setDirtyCanvas?.(!0, !0);
}
function bn(e, t, n) {
  Dt.extensionManager?.toast?.add({ severity: e, summary: t, detail: n, life: e === "error" ? 6e3 : 3e3 });
}
async function ss(e, t) {
  const n = Dt.extensionManager?.dialog;
  return n?.confirm ? await n.confirm({ title: e, message: t }) === !0 : window.confirm(`${e}

${t}`);
}
function qu(e) {
  Dt.extensionManager.registerSidebarTab({ ...e, type: "custom" });
}
function Gu(e, t) {
  return Xt.fetchApi(e, t);
}
async function Ju() {
  const { output: e, workflow: t } = await Dt.graphToPrompt();
  return { output: e, workflow: t };
}
async function Yu(e, t) {
  const n = await Xt.queuePrompt(0, e, {
    partialExecutionTargets: t
  });
  return { prompt_id: String(n.prompt_id) };
}
function Zu(e, t) {
  const n = (r) => t(r.detail);
  return Xt.addEventListener(e, n), () => Xt.removeEventListener(e, n);
}
function Qu(e) {
  return Xt.interrupt(e);
}
function Xu(e) {
  return Xt.deleteItem("queue", e);
}
function ec(e, t) {
  const n = e, r = n.onExecuted;
  n.onExecuted = function(o) {
    const i = r?.call(this, o);
    return t(o ?? {}), i;
  };
}
function tc(e, t, n) {
  const r = e.properties?.[t];
  return r === void 0 ? n : r;
}
function nc(e, t, n) {
  const r = e;
  r.properties ??= {}, r.properties[t] = n, e.graph?.setDirtyCanvas?.(!0, !0);
}
function Ml(e) {
  const t = new URLSearchParams({ filename: e.filename, subfolder: e.subfolder ?? "", type: e.type ?? "temp" });
  return Xt.apiURL(`/view?${t}`);
}
let Ro = null;
function rc() {
  return Ro ??= Xt.getNodeDefs().then(
    (e) => new Set(Object.entries(e).filter(([, t]) => t.output_node).map(([t]) => t))
  ).catch((e) => {
    throw Ro = null, e;
  }), Ro;
}
function oc() {
  return Dt.extensionManager?.setting?.get("Comfy.VueNodes.Enabled") === !0;
}
function ic(e, t) {
  const n = Dt.canvas;
  n.adjustMouseEvent(t), n.processContextMenu(e, t);
}
function jl() {
  return Dt.isGraphReady ? Dt.rootGraph : void 0;
}
function sc(e) {
  return jl()?.getNodeById?.(Number(e))?.title ?? `#${e}`;
}
function Nl(e) {
  const t = jl();
  return !!e.graph && !!t && e.graph !== t;
}
var lc = Object.defineProperty, ls = Object.getOwnPropertySymbols, ac = Object.prototype.hasOwnProperty, uc = Object.prototype.propertyIsEnumerable, as = (e, t, n) => t in e ? lc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, cc = (e, t) => {
  for (var n in t || (t = {})) ac.call(t, n) && as(e, n, t[n]);
  if (ls) for (var n of ls(t)) uc.call(t, n) && as(e, n, t[n]);
  return e;
};
function $n(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function ii(e, t, n = /* @__PURE__ */ new WeakSet()) {
  if (e === t) return !0;
  if (!e || !t || typeof e != "object" || typeof t != "object" || n.has(e) || n.has(t)) return !1;
  n.add(e).add(t);
  let r = Array.isArray(e), o = Array.isArray(t), i, s, l;
  if (r && o) {
    if (s = e.length, s != t.length) return !1;
    for (i = s; i-- !== 0; ) if (!ii(e[i], t[i], n)) return !1;
    return !0;
  }
  if (r != o) return !1;
  let a = e instanceof Date, c = t instanceof Date;
  if (a != c) return !1;
  if (a && c) return e.getTime() == t.getTime();
  let u = e instanceof RegExp, d = t instanceof RegExp;
  if (u != d) return !1;
  if (u && d) return e.toString() == t.toString();
  let f = Object.keys(e);
  if (s = f.length, s !== Object.keys(t).length) return !1;
  for (i = s; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t, f[i])) return !1;
  for (i = s; i-- !== 0; ) if (l = f[i], !ii(e[l], t[l], n)) return !1;
  return !0;
}
function dc(e, t) {
  return ii(e, t);
}
function yo(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function de(e) {
  return !$n(e);
}
function At(e, t) {
  if (!e || !t) return null;
  try {
    let n = e[t];
    if (de(n)) return n;
  } catch {
  }
  if (Object.keys(e).length) {
    if (yo(t)) return t(e);
    if (t.indexOf(".") === -1) return e[t];
    {
      let n = t.split("."), r = e;
      for (let o = 0, i = n.length; o < i; ++o) {
        if (r == null) return null;
        r = r[n[o]];
      }
      return r;
    }
  }
  return null;
}
function Fl(e, t, n) {
  return n ? At(e, n) === At(t, n) : dc(e, t);
}
function xt(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Vl(e = {}, t = {}) {
  let n = cc({}, e);
  return Object.keys(t).forEach((r) => {
    let o = r;
    xt(t[o]) && o in e && xt(e[o]) ? n[o] = Vl(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function fc(...e) {
  return e.reduce((t, n, r) => r === 0 ? n : Vl(t, n), {});
}
function us(e, t) {
  let n = -1;
  if (de(e)) try {
    n = e.findLastIndex(t);
  } catch {
    n = e.lastIndexOf([...e].reverse().find(t));
  }
  return n;
}
function Ye(e, ...t) {
  return yo(e) ? e(...t) : e;
}
function Ge(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function _t(e) {
  return Ge(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function Mi(e, t = "", n = {}) {
  let r = _t(t).split("."), o = r.shift();
  if (o) {
    if (xt(e)) {
      let i = Object.keys(e).find((s) => _t(s) === o) || "";
      return Mi(Ye(e[i], n), r.join("."), n);
    }
    return;
  }
  return Ye(e, n);
}
function Dl(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function pc(e) {
  return de(e) && !isNaN(e);
}
function hc(e = "") {
  return de(e) && e.length === 1 && !!e.match(/\S| /);
}
function vn(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function gc(...e) {
  return fc(...e);
}
function er(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function et(e) {
  if (e && /[\xC0-\xFF\u0100-\u017E]/.test(e)) {
    let t = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
    for (let n in t) e = e.replace(t[n], n);
  }
  return e;
}
function mc(e) {
  return Ge(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function Rl(e) {
  return Ge(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function ji() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let r = e.get(t);
    return r ? r.push(n) : r = [n], e.set(t, r), this;
  }, off(t, n) {
    let r = e.get(t);
    return r && r.splice(r.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let r = e.get(t);
    r && r.forEach((o) => {
      o(n);
    });
  }, clear() {
    e.clear();
  } };
}
function ft(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      if (!r) continue;
      let o = typeof r;
      if (o === "string" || o === "number") t.push(r);
      else if (o === "object") {
        let i = Array.isArray(r) ? [ft(...r)] : Object.entries(r).map(([s, l]) => l ? s : void 0);
        t = i.length ? t.concat(i.filter((s) => !!s)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function bc(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function vc(e, t) {
  if (e && t) {
    let n = (r) => {
      bc(e, r) || (e.classList ? e.classList.add(r) : e.className += " " + r);
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function zo(e, t) {
  if (e && t) {
    let n = (r) => {
      e.classList ? e.classList.remove(r) : e.className = e.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function si(e) {
  for (let t of document?.styleSheets) try {
    for (let n of t?.cssRules) for (let r of n?.style) if (e.test(r)) return { name: r, value: n.style.getPropertyValue(r).trim() };
  } catch {
  }
  return null;
}
function zl(e) {
  let t = { width: 0, height: 0 };
  if (e) {
    let [n, r] = [e.style.visibility, e.style.display], o = e.getBoundingClientRect();
    e.style.visibility = "hidden", e.style.display = "block", t.width = o.width || e.offsetWidth, t.height = o.height || e.offsetHeight, e.style.display = r, e.style.visibility = n;
  }
  return t;
}
function Bl() {
  let e = window, t = document, n = t.documentElement, r = t.getElementsByTagName("body")[0], o = e.innerWidth || n.clientWidth || r.clientWidth, i = e.innerHeight || n.clientHeight || r.clientHeight;
  return { width: o, height: i };
}
function li(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function yc() {
  let e = document.documentElement;
  return (window.pageXOffset || li(e)) - (e.clientLeft || 0);
}
function Sc() {
  let e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function wc(e) {
  return e ? getComputedStyle(e).direction === "rtl" : !1;
}
function _c(e, t, n = !0) {
  var r, o, i, s;
  if (e) {
    let l = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : zl(e), a = l.height, c = l.width, u = t.offsetHeight, d = t.offsetWidth, f = t.getBoundingClientRect(), h = Sc(), b = yc(), y = Bl(), S, v, w = "top";
    f.top + u + a > y.height ? (S = f.top + h - a, w = "bottom", S < 0 && (S = h)) : S = u + f.top + h, f.left + c > y.width ? v = Math.max(0, f.left + b + d - c) : v = f.left + b, wc(e) ? e.style.insetInlineEnd = v + "px" : e.style.insetInlineStart = v + "px", e.style.top = S + "px", e.style.transformOrigin = w, n && (e.style.marginTop = w === "bottom" ? `calc(${(o = (r = si(/-anchor-gutter$/)) == null ? void 0 : r.value) != null ? o : "2px"} * -1)` : (s = (i = si(/-anchor-gutter$/)) == null ? void 0 : i.value) != null ? s : "");
  }
}
function $c(e, t) {
  e && (typeof t == "string" ? e.style.cssText = t : Object.entries(t || {}).forEach(([n, r]) => e.style[n] = r));
}
function Hl(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function xc(e, t, n = !0, r = void 0) {
  var o;
  if (e) {
    let i = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : zl(e), s = t.offsetHeight, l = t.getBoundingClientRect(), a = Bl(), c, u, d = r ?? "top";
    if (!r && l.top + s + i.height > a.height ? (c = -1 * i.height, d = "bottom", l.top + c < 0 && (c = -1 * l.top)) : c = s, i.width > a.width ? u = l.left * -1 : l.left + i.width > a.width ? u = (l.left + i.width - a.width) * -1 : u = 0, e.style.top = c + "px", e.style.insetInlineStart = u + "px", e.style.transformOrigin = d, n) {
      let f = (o = si(/-anchor-gutter$/)) == null ? void 0 : o.value;
      e.style.marginTop = d === "bottom" ? `calc(${f ?? "2px"} * -1)` : f ?? "";
    }
  }
}
function Kl(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Cc(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && Kl(e));
}
function Dn(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function to(e, t = {}) {
  if (Dn(e)) {
    let n = (r, o) => {
      var i, s;
      let l = (i = e?.$attrs) != null && i[r] ? [(s = e?.$attrs) == null ? void 0 : s[r]] : [];
      return [o].flat().reduce((a, c) => {
        if (c != null) {
          let u = typeof c;
          if (u === "string" || u === "number") a.push(c);
          else if (u === "object") {
            let d = Array.isArray(c) ? n(r, c) : Object.entries(c).map(([f, h]) => r === "style" && (h || h === 0) ? `${f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${h}` : h ? f : void 0);
            a = d.length ? a.concat(d.filter((f) => !!f)) : a;
          }
        }
        return a;
      }, l);
    };
    Object.entries(t).forEach(([r, o]) => {
      if (o != null) {
        let i = r.match(/^on(.+)/);
        i ? e.addEventListener(i[1].toLowerCase(), o) : r === "p-bind" || r === "pBind" ? to(e, o) : (o = r === "class" ? [...new Set(n("class", o))].join(" ").trim() : r === "style" ? n("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[r] = o), e.setAttribute(r, o));
      }
    });
  }
}
function Oc(e, t = {}, ...n) {
  {
    let r = document.createElement(e);
    return to(r, t), r.append(...n), r;
  }
}
function Ic(e, t) {
  return Dn(e) ? Array.from(e.querySelectorAll(t)) : [];
}
function So(e, t) {
  return Dn(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function kt(e, t) {
  e && document.activeElement !== e && e.focus(t);
}
function kc(e, t) {
  if (Dn(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Ni(e, t = "") {
  let n = Ic(e, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`), r = [];
  for (let o of n) getComputedStyle(o).display != "none" && getComputedStyle(o).visibility != "hidden" && r.push(o);
  return r;
}
function Tc(e, t) {
  let n = Ni(e, t);
  return n.length > 0 ? n[0] : null;
}
function fn(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Pc(e, t) {
  let n = Ni(e, t);
  return n.length > 0 ? n[n.length - 1] : null;
}
function Lc(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || li(document.documentElement) || li(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Ec(e, t) {
  return e ? e.offsetHeight : 0;
}
function Ul(e, t = []) {
  let n = Kl(e);
  return n === null ? t : Ul(n, t.concat([n]));
}
function Ac(e) {
  let t = [];
  if (e) {
    let n = Ul(e), r = /(auto|scroll)/, o = (i) => {
      try {
        let s = window.getComputedStyle(i, null);
        return r.test(s.getPropertyValue("overflow")) || r.test(s.getPropertyValue("overflowX")) || r.test(s.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let i of n) {
      let s = i.nodeType === 1 && i.dataset.scrollselectors;
      if (s) {
        let l = s.split(",");
        for (let a of l) {
          let c = So(i, a);
          c && o(c) && t.push(c);
        }
      }
      i.nodeType !== 9 && o(i) && t.push(i);
    }
  }
  return t;
}
function pn(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function Mc() {
  return /(android)/i.test(navigator.userAgent);
}
function Wl() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function no(e) {
  return !!(e && e.offsetParent != null);
}
function jc() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Nc(e, t = "", n) {
  Dn(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var zr = {};
function Fc(e = "pui_id_") {
  return Object.hasOwn(zr, e) || (zr[e] = 0), zr[e]++, `${e}${zr[e]}`;
}
function Vc() {
  let e = [], t = (s, l, a = 999) => {
    let c = o(s, l, a), u = c.value + (c.key === s ? 0 : a) + 1;
    return e.push({ key: s, value: u }), u;
  }, n = (s) => {
    e = e.filter((l) => l.value !== s);
  }, r = (s, l) => o(s).value, o = (s, l, a = 0) => [...e].reverse().find((c) => !0) || { key: s, value: a }, i = (s) => s && parseInt(s.style.zIndex, 10) || 0;
  return { get: i, set: (s, l, a) => {
    l && (l.style.zIndex = String(t(s, !0, a)));
  }, clear: (s) => {
    s && (n(i(s)), s.style.zIndex = "");
  }, getCurrent: (s) => r(s) };
}
var Bo = Vc(), Dc = Object.defineProperty, Rc = Object.defineProperties, zc = Object.getOwnPropertyDescriptors, ro = Object.getOwnPropertySymbols, ql = Object.prototype.hasOwnProperty, Gl = Object.prototype.propertyIsEnumerable, cs = (e, t, n) => t in e ? Dc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ct = (e, t) => {
  for (var n in t || (t = {})) ql.call(t, n) && cs(e, n, t[n]);
  if (ro) for (var n of ro(t)) Gl.call(t, n) && cs(e, n, t[n]);
  return e;
}, Ho = (e, t) => Rc(e, zc(t)), Tt = (e, t) => {
  var n = {};
  for (var r in e) ql.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && ro) for (var r of ro(e)) t.indexOf(r) < 0 && Gl.call(e, r) && (n[r] = e[r]);
  return n;
}, Bc = ji(), Ne = Bc, sr = /{([^}]*)}/g, Jl = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Yl = /var\([^)]+\)/g;
function ds(e) {
  return Ge(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Hc(e) {
  return xt(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function Kc(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function ai(e = "", t = "") {
  return Kc(`${Ge(e, !1) && Ge(t, !1) ? `${e}-` : e}${t}`);
}
function Zl(e = "", t = "") {
  return `--${ai(e, t)}`;
}
function Uc(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function Ql(e, t = "", n = "", r = [], o) {
  if (Ge(e)) {
    let i = e.trim();
    if (Uc(i)) return;
    if (vn(i, sr)) {
      let s = i.replaceAll(sr, (l) => {
        let a = l.replace(/{|}/g, "").split(".").filter((c) => !r.some((u) => vn(c, u)));
        return `var(${Zl(n, Rl(a.join("-")))}${de(o) ? `, ${o}` : ""})`;
      });
      return vn(s.replace(Yl, "0"), Jl) ? `calc(${s})` : s;
    }
    return i;
  } else if (pc(e)) return e;
}
function Wc(e, t, n) {
  Ge(t, !1) && e.push(`${t}:${n};`);
}
function Tn(e, t) {
  return e ? `${e}{${t}}` : "";
}
function Xl(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(s, l) {
    let a = [], c = 0, u = "", d = null, f = 0;
    for (; c <= s.length; ) {
      let h = s[c];
      if ((h === '"' || h === "'" || h === "`") && s[c - 1] !== "\\" && (d = d === h ? null : h), !d && (h === "(" && f++, h === ")" && f--, (h === "," || c === s.length) && f === 0)) {
        let b = u.trim();
        b.startsWith("dt(") ? a.push(Xl(b, l)) : a.push(r(b)), u = "", c++;
        continue;
      }
      h !== void 0 && (u += h), c++;
    }
    return a;
  }
  function r(s) {
    let l = s[0];
    if ((l === '"' || l === "'" || l === "`") && s[s.length - 1] === l) return s.slice(1, -1);
    let a = Number(s);
    return isNaN(a) ? s : a;
  }
  let o = [], i = [];
  for (let s = 0; s < e.length; s++) if (e[s] === "d" && e.slice(s, s + 3) === "dt(") i.push(s), s += 2;
  else if (e[s] === ")" && i.length > 0) {
    let l = i.pop();
    i.length === 0 && o.push([l, s]);
  }
  if (!o.length) return e;
  for (let s = o.length - 1; s >= 0; s--) {
    let [l, a] = o[s], c = e.slice(l + 3, a), u = n(c, t), d = t(...u);
    e = e.slice(0, l) + d + e.slice(a + 1);
  }
  return e;
}
var yn = (...e) => qc($e.getTheme(), ...e), qc = (e = {}, t, n, r) => {
  if (t) {
    let { variable: o, options: i } = $e.defaults || {}, { prefix: s, transform: l } = e?.options || i || {}, a = vn(t, sr) ? t : `{${t}}`;
    return r === "value" || $n(r) && l === "strict" ? $e.getTokenValue(t) : Ql(a, void 0, s, [o.excludedKeyRegex], n);
  }
  return "";
};
function Br(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((r, o, i) => {
      var s;
      return r + o + ((s = Ye(t[i], { dt: yn })) != null ? s : "");
    }, "");
    return Xl(n, yn);
  }
  return Ye(e, { dt: yn });
}
function Gc(e, t = {}) {
  let n = $e.defaults.variable, { prefix: r = n.prefix, selector: o = n.selector, excludedKeyRegex: i = n.excludedKeyRegex } = t, s = [], l = [], a = [{ node: e, path: r }];
  for (; a.length; ) {
    let { node: u, path: d } = a.pop();
    for (let f in u) {
      let h = u[f], b = Hc(h), y = vn(f, i) ? ai(d) : ai(d, Rl(f));
      if (xt(b)) a.push({ node: b, path: y });
      else {
        let S = Zl(y), v = Ql(b, y, r, [i]);
        Wc(l, S, v);
        let w = y;
        r && w.startsWith(r + "-") && (w = w.slice(r.length + 1)), s.push(w.replace(/-/g, "."));
      }
    }
  }
  let c = l.join("");
  return { value: l, tokens: s, declarations: c, css: Tn(o, c) };
}
var at = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
    var r;
    return (r = t.map((o) => o.resolve(n)).find((o) => o.matched)) != null ? r : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return Gc(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var i, s, l, a, c, u, d;
  let { preset: f, options: h } = t, b, y, S, v, w, T, m;
  if (de(f) && h.transform !== "strict") {
    let { primitive: $, semantic: M, extend: P } = f, B = M || {}, { colorScheme: V } = B, q = Tt(B, ["colorScheme"]), U = P || {}, { colorScheme: E } = U, Y = Tt(U, ["colorScheme"]), te = V || {}, { dark: he } = te, ie = Tt(te, ["dark"]), re = E || {}, { dark: se } = re, R = Tt(re, ["dark"]), H = de($) ? this._toVariables({ primitive: $ }, h) : {}, Q = de(q) ? this._toVariables({ semantic: q }, h) : {}, Se = de(ie) ? this._toVariables({ light: ie }, h) : {}, rn = de(he) ? this._toVariables({ dark: he }, h) : {}, Ht = de(Y) ? this._toVariables({ semantic: Y }, h) : {}, Dr = de(R) ? this._toVariables({ light: R }, h) : {}, Kt = de(se) ? this._toVariables({ dark: se }, h) : {}, [In, Bn] = [(i = H.declarations) != null ? i : "", H.tokens], [Rr, on] = [(s = Q.declarations) != null ? s : "", Q.tokens || []], [ns, p] = [(l = Se.declarations) != null ? l : "", Se.tokens || []], [g, _] = [(a = rn.declarations) != null ? a : "", rn.tokens || []], [k, C] = [(c = Ht.declarations) != null ? c : "", Ht.tokens || []], [I, N] = [(u = Dr.declarations) != null ? u : "", Dr.tokens || []], [j, A] = [(d = Kt.declarations) != null ? d : "", Kt.tokens || []];
    b = this.transformCSS(e, In, "light", "variable", h, r, o), y = Bn;
    let O = this.transformCSS(e, `${Rr}${ns}`, "light", "variable", h, r, o), J = this.transformCSS(e, `${g}`, "dark", "variable", h, r, o);
    S = `${O}${J}`, v = [.../* @__PURE__ */ new Set([...on, ...p, ..._])];
    let D = this.transformCSS(e, `${k}${I}color-scheme:light`, "light", "variable", h, r, o), W = this.transformCSS(e, `${j}color-scheme:dark`, "dark", "variable", h, r, o);
    w = `${D}${W}`, T = [.../* @__PURE__ */ new Set([...C, ...N, ...A])], m = Ye(f.css, { dt: yn });
  }
  return { primitive: { css: b, tokens: y }, semantic: { css: S, tokens: v }, global: { css: w, tokens: T }, style: m };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: r, set: o, defaults: i, selector: s }) {
  var l, a, c;
  let u, d, f;
  if (de(t) && n.transform !== "strict") {
    let h = e.replace("-directive", ""), b = t, { colorScheme: y, extend: S, css: v } = b, w = Tt(b, ["colorScheme", "extend", "css"]), T = S || {}, { colorScheme: m } = T, $ = Tt(T, ["colorScheme"]), M = y || {}, { dark: P } = M, B = Tt(M, ["dark"]), V = m || {}, { dark: q } = V, U = Tt(V, ["dark"]), E = de(w) ? this._toVariables({ [h]: ct(ct({}, w), $) }, n) : {}, Y = de(B) ? this._toVariables({ [h]: ct(ct({}, B), U) }, n) : {}, te = de(P) ? this._toVariables({ [h]: ct(ct({}, P), q) }, n) : {}, [he, ie] = [(l = E.declarations) != null ? l : "", E.tokens || []], [re, se] = [(a = Y.declarations) != null ? a : "", Y.tokens || []], [R, H] = [(c = te.declarations) != null ? c : "", te.tokens || []], Q = this.transformCSS(h, `${he}${re}`, "light", "variable", n, o, i, s), Se = this.transformCSS(h, R, "dark", "variable", n, o, i, s);
    u = `${Q}${Se}`, d = [.../* @__PURE__ */ new Set([...ie, ...se, ...H])], f = Ye(v, { dt: yn });
  }
  return { css: u, tokens: d, style: f };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var i;
  let { preset: s, options: l } = t, a = (i = s?.components) == null ? void 0 : i[e];
  return this.getPreset({ name: e, preset: a, options: l, params: n, set: r, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var i, s;
  let l = e.replace("-directive", ""), { preset: a, options: c } = t, u = ((i = a?.components) == null ? void 0 : i[l]) || ((s = a?.directives) == null ? void 0 : s[l]);
  return this.getPreset({ name: l, preset: u, options: c, params: n, set: r, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, r) {
  let { cssLayer: o } = t;
  return o ? `@layer ${Ye(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: i }) {
  let s = this.getCommon({ name: e, theme: t, params: n, set: o, defaults: i }), l = Object.entries(r).reduce((a, [c, u]) => a.push(`${c}="${u}"`) && a, []).join(" ");
  return Object.entries(s || {}).reduce((a, [c, u]) => {
    if (xt(u) && Object.hasOwn(u, "css")) {
      let d = er(u.css), f = `${c}-variables`;
      a.push(`<style type="text/css" data-primevue-style-id="${f}" ${l}>${d}</style>`);
    }
    return a;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: i }) {
  var s;
  let l = { name: e, theme: t, params: n, set: o, defaults: i }, a = (s = e.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : s.css, c = Object.entries(r).reduce((u, [d, f]) => u.push(`${d}="${f}"`) && u, []).join(" ");
  return a ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${c}>${er(a)}</style>` : "";
}, createTokens(e = {}, t, n = "", r = "", o = {}) {
  let i = function(l, a = {}, c = []) {
    if (c.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: a, value: void 0 };
    c.push(this.path), a.name = this.path, a.binding || (a.binding = {});
    let u = this.value;
    if (typeof this.value == "string" && sr.test(this.value)) {
      let d = this.value.trim().replace(sr, (f) => {
        var h;
        let b = f.slice(1, -1), y = this.tokens[b];
        if (!y) return console.warn(`Token not found for path: ${b}`), "__UNRESOLVED__";
        let S = y.computed(l, a, c);
        return Array.isArray(S) && S.length === 2 ? `light-dark(${S[0].value},${S[1].value})` : (h = S?.value) != null ? h : "__UNRESOLVED__";
      });
      u = Jl.test(d.replace(Yl, "0")) ? `calc(${d})` : d;
    }
    return $n(a.binding) && delete a.binding, c.pop(), { colorScheme: l, path: this.path, paths: a, value: u.includes("__UNRESOLVED__") ? void 0 : u };
  }, s = (l, a, c) => {
    Object.entries(l).forEach(([u, d]) => {
      let f = vn(u, t.variable.excludedKeyRegex) ? a : a ? `${a}.${ds(u)}` : ds(u), h = c ? `${c}.${u}` : u;
      xt(d) ? s(d, f, h) : (o[f] || (o[f] = { paths: [], computed: (b, y = {}, S = []) => {
        if (o[f].paths.length === 1) return o[f].paths[0].computed(o[f].paths[0].scheme, y.binding, S);
        if (b && b !== "none") for (let v = 0; v < o[f].paths.length; v++) {
          let w = o[f].paths[v];
          if (w.scheme === b) return w.computed(b, y.binding, S);
        }
        return o[f].paths.map((v) => v.computed(v.scheme, y[v.scheme], S));
      } }), o[f].paths.push({ path: h, value: d, scheme: h.includes("colorScheme.light") ? "light" : h.includes("colorScheme.dark") ? "dark" : "none", computed: i, tokens: o }));
    });
  };
  return s(e, n, r), o;
}, getTokenValue(e, t, n) {
  var r;
  let o = ((l) => l.split(".").filter((a) => !vn(a.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), i = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, s = [(r = e[o]) == null ? void 0 : r.computed(i)].flat().filter((l) => l);
  return s.length === 1 ? s[0].value : s.reduce((l = {}, a) => {
    let c = a, { colorScheme: u } = c, d = Tt(c, ["colorScheme"]);
    return l[u] = d, l;
  }, void 0);
}, getSelectorRule(e, t, n, r) {
  return n === "class" || n === "attr" ? Tn(de(t) ? `${e}${t},${e} ${t}` : e, r) : Tn(e, Tn(t ?? ":root,:host", r));
}, transformCSS(e, t, n, r, o = {}, i, s, l) {
  if (de(t)) {
    let { cssLayer: a } = o;
    if (r !== "style") {
      let c = this.getColorSchemeOption(o, s);
      t = n === "dark" ? c.reduce((u, { type: d, selector: f }) => (de(f) && (u += f.includes("[CSS]") ? f.replace("[CSS]", t) : this.getSelectorRule(f, l, d, t)), u), "") : Tn(l ?? ":root,:host", t);
    }
    if (a) {
      let c = { name: "primeui" };
      xt(a) && (c.name = Ye(a.name, { name: e, type: r })), de(c.name) && (t = Tn(`@layer ${c.name}`, t), i?.layerNames(c.name));
    }
    return t;
  }
  return "";
} }, $e = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = Ho(ct({}, t), { options: ct(ct({}, this.defaults.options), t.options) }), this._tokens = at.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: e }), Ne.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = Ho(ct({}, this.theme), { preset: e }), this._tokens = at.createTokens(e, this.defaults), this.clearLoadedStyleNames(), Ne.emit("preset:change", e), Ne.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = Ho(ct({}, this.theme), { options: e }), this.clearLoadedStyleNames(), Ne.emit("options:change", e), Ne.emit("theme:change", this.theme);
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
  return at.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return at.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return at.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return at.getPresetD(n);
}, getCustomPreset(e = "", t, n, r) {
  let o = { name: e, preset: t, options: this.options, selector: n, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return at.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return at.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", r) {
  return at.transformCSS(e, t, r, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return at.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return at.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), Ne.emit(`theme:${t}:load`, e), !this._loadingStyles.size && Ne.emit("theme:load"));
} }, Ve = {
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
function fs(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (!n) {
    if (Array.isArray(e) || (n = Jc(e)) || t) {
      n && (e = n);
      var r = 0, o = function() {
      };
      return { s: o, n: function() {
        return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
      }, e: function(c) {
        throw c;
      }, f: o };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var i, s = !0, l = !1;
  return { s: function() {
    n = n.call(e);
  }, n: function() {
    var c = n.next();
    return s = c.done, c;
  }, e: function(c) {
    l = !0, i = c;
  }, f: function() {
    try {
      s || n.return == null || n.return();
    } finally {
      if (l) throw i;
    }
  } };
}
function Jc(e, t) {
  if (e) {
    if (typeof e == "string") return ps(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ps(e, t) : void 0;
  }
}
function ps(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
var Yc = {
  filter: function(t, n, r, o, i) {
    var s = [];
    if (!t)
      return s;
    var l = fs(t), a;
    try {
      for (l.s(); !(a = l.n()).done; ) {
        var c = a.value;
        if (typeof c == "string") {
          if (this.filters[o](c, r, i)) {
            s.push(c);
            continue;
          }
        } else {
          var u = fs(n), d;
          try {
            for (u.s(); !(d = u.n()).done; ) {
              var f = d.value, h = At(c, f);
              if (this.filters[o](h, r, i)) {
                s.push(c);
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
    startsWith: function(t, n, r) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = et(n.toString()).toLocaleLowerCase(r), i = et(t.toString()).toLocaleLowerCase(r);
      return i.slice(0, o.length) === o;
    },
    contains: function(t, n, r) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = et(n.toString()).toLocaleLowerCase(r), i = et(t.toString()).toLocaleLowerCase(r);
      return i.indexOf(o) !== -1;
    },
    notContains: function(t, n, r) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = et(n.toString()).toLocaleLowerCase(r), i = et(t.toString()).toLocaleLowerCase(r);
      return i.indexOf(o) === -1;
    },
    endsWith: function(t, n, r) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = et(n.toString()).toLocaleLowerCase(r), i = et(t.toString()).toLocaleLowerCase(r);
      return i.indexOf(o, i.length - o.length) !== -1;
    },
    equals: function(t, n, r) {
      return n == null || n === "" ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() === n.getTime() : et(t.toString()).toLocaleLowerCase(r) == et(n.toString()).toLocaleLowerCase(r);
    },
    notEquals: function(t, n, r) {
      return n == null || n === "" ? !1 : t == null ? !0 : t.getTime && n.getTime ? t.getTime() !== n.getTime() : et(t.toString()).toLocaleLowerCase(r) != et(n.toString()).toLocaleLowerCase(r);
    },
    in: function(t, n) {
      if (n == null || n.length === 0)
        return !0;
      for (var r = 0; r < n.length; r++)
        if (Fl(t, n[r]))
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
}, Zc = `
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
function Fi(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Ce = {}, mn = [], Ct = () => {
}, ea = () => !1, wo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), _o = (e) => e.startsWith("onUpdate:"), Ae = Object.assign, Vi = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Qc = Object.prototype.hasOwnProperty, be = (e, t) => Qc.call(e, t), Z = Array.isArray, Zt = (e) => Ar(e) === "[object Map]", oo = (e) => Ar(e) === "[object Set]", hs = (e) => Ar(e) === "[object Date]", ee = (e) => typeof e == "function", Ie = (e) => typeof e == "string", Xe = (e) => typeof e == "symbol", me = (e) => e !== null && typeof e == "object", ta = (e) => (me(e) || ee(e)) && ee(e.then) && ee(e.catch), na = Object.prototype.toString, Ar = (e) => na.call(e), Xc = (e) => Ar(e).slice(8, -1), ra = (e) => Ar(e) === "[object Object]", $o = (e) => Ie(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, tr = /* @__PURE__ */ Fi(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), xo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, ed = /-\w/g, Ue = xo(
  (e) => e.replace(ed, (t) => t.slice(1).toUpperCase())
), td = /\B([A-Z])/g, xn = xo(
  (e) => e.replace(td, "-$1").toLowerCase()
), Co = xo((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ko = xo(
  (e) => e ? `on${Co(e)}` : ""
), $t = (e, t) => !Object.is(e, t), Uo = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, oa = (e, t, n, r = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
}, nd = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, rd = (e) => {
  const t = Ie(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let gs;
const Oo = () => gs || (gs = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function wn(e) {
  if (Z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n], o = Ie(r) ? ld(r) : wn(r);
      if (o)
        for (const i in o)
          t[i] = o[i];
    }
    return t;
  } else if (Ie(e) || me(e))
    return e;
}
const od = /;(?![^(]*\))/g, id = /:([^]+)/, sd = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ld(e) {
  const t = {};
  return e.replace(sd, (n) => n.startsWith("/*") ? "" : n).split(od).forEach((n) => {
    if (n) {
      const r = n.split(id);
      r.length > 1 && (t[r[0].trim()] = r[1].trim());
    }
  }), t;
}
function ot(e) {
  let t = "";
  if (Ie(e))
    t = e;
  else if (Z(e))
    for (let n = 0; n < e.length; n++) {
      const r = ot(e[n]);
      r && (t += r + " ");
    }
  else if (me(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function ad(e) {
  if (!e) return null;
  let { class: t, style: n } = e;
  return t && !Ie(t) && (e.class = ot(t)), n && (e.style = wn(n)), e;
}
const ud = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", cd = /* @__PURE__ */ Fi(ud);
function ia(e) {
  return !!e || e === "";
}
function dd(e, t, n) {
  if (e.length !== t.length) return !1;
  let r = !0;
  for (let o = 0; r && o < e.length; o++)
    r = Io(e[o], t[o], n);
  return r;
}
function ms(e, t, n) {
  if (e.size !== t.size) return !1;
  const r = Array.from(t), o = new Uint8Array(r.length);
  for (const i of e) {
    let s = -1;
    for (let l = 0; l < r.length; l++)
      if (!o[l] && Io(i, r[l], n)) {
        s = l;
        break;
      }
    if (s < 0) return !1;
    o[s] = 1;
  }
  return !0;
}
function fd(e, t, n) {
  let r = Zt(e), o = Zt(t);
  if (r || o || (r = oo(e), o = oo(t), r || o))
    return r && o ? ms(e, t, n) : !1;
  const i = Object.keys(e).length, s = Object.keys(t).length;
  if (i !== s)
    return !1;
  for (const l in e) {
    const a = e.hasOwnProperty(l), c = t.hasOwnProperty(l);
    if (a && !c || !a && c || !Io(e[l], t[l], n))
      return !1;
  }
  return String(e) === String(t);
}
function bs(e, t, n, r) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [o, i] = n;
  if (o.has(e) || i.has(t))
    return o.get(e) === t && i.get(t) === e;
  o.set(e, t), i.set(t, e);
  const s = r(e, t, n);
  return o.delete(e), i.delete(t), s;
}
function Io(e, t, n) {
  if (e === t) return !0;
  let r = hs(e), o = hs(t);
  return r || o ? r && o ? e.getTime() === t.getTime() : !1 : (r = Xe(e), o = Xe(t), r || o ? e === t : (r = Z(e), o = Z(t), r || o ? r && o ? bs(e, t, n, dd) : !1 : (r = me(e), o = me(t), r || o ? !r || !o ? !1 : bs(e, t, n, fd) : String(e) === String(t))));
}
const sa = (e) => !!(e && e.__v_isRef === !0), oe = (e) => Ie(e) ? e : e == null ? "" : Z(e) || me(e) && (e.toString === na || !ee(e.toString)) ? sa(e) ? oe(e.value) : JSON.stringify(e, la, 2) : String(e), la = (e, t) => sa(t) ? la(e, t.value) : Zt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [r, o], i) => (n[Wo(r, i) + " =>"] = o, n),
    {}
  )
} : oo(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Wo(n))
} : Xe(t) ? Wo(t) : me(t) && !Z(t) && !ra(t) ? String(t) : t, Wo = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Xe(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let je;
class pd {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && je && (je.active ? (this.parent = je, this.index = (je.scopes || (je.scopes = [])).push(
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
        const r = this.scopes.slice();
        for (t = 0, n = r.length; t < n; t++)
          r[t].pause();
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
      const r = this.effects.slice();
      for (t = 0, n = r.length; t < n; t++)
        r[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = je;
      try {
        return je = this, t();
      } finally {
        je = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = je, je = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (je === this)
        je = this.prevScope;
      else {
        let t = je;
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
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const o = this.scopes.slice();
        for (n = 0, r = o.length; n < r; n++)
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
function hd() {
  return je;
}
let Oe;
const qo = /* @__PURE__ */ new WeakSet();
class aa {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, je && (je.active ? je.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, qo.has(this) && (qo.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ca(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, vs(this), da(this);
    const t = Oe, n = pt;
    Oe = this, pt = !0;
    try {
      return this.fn();
    } finally {
      fa(this), Oe = t, pt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        zi(t);
      this.deps = this.depsTail = void 0, vs(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? qo.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ui(this) && this.run();
  }
  get dirty() {
    return ui(this);
  }
}
let ua = 0, nr, rr;
function ca(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = rr, rr = e;
    return;
  }
  e.next = nr, nr = e;
}
function Di() {
  ua++;
}
function Ri() {
  if (--ua > 0)
    return;
  if (rr) {
    let t = rr;
    for (rr = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; nr; ) {
    let t = nr;
    for (nr = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (r) {
          e || (e = r);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function da(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function fa(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const o = r.prevDep;
    r.version === -1 ? (r === n && (n = o), zi(r), gd(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = o;
  }
  e.deps = t, e.depsTail = n;
}
function ui(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (pa(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function pa(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === lr) || (e.globalVersion = lr, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ui(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = Oe, r = pt;
  Oe = e, pt = !0;
  try {
    da(e);
    const o = e.fn(e._value);
    (t.version === 0 || $t(o, e._value)) && (e.flags |= 128, e._value = o, t.version++);
  } catch (o) {
    throw t.version++, o;
  } finally {
    Oe = n, pt = r, fa(e), e.flags &= -3;
  }
}
function zi(e, t = !1) {
  const { dep: n, prevSub: r, nextSub: o } = e;
  if (r && (r.nextSub = o, e.prevSub = void 0), o && (o.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      zi(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function gd(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let pt = !0;
const ha = [];
function Rt() {
  ha.push(pt), pt = !1;
}
function zt() {
  const e = ha.pop();
  pt = e === void 0 ? !0 : e;
}
function vs(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = Oe;
    Oe = void 0;
    try {
      t();
    } finally {
      Oe = n;
    }
  }
}
let lr = 0;
class md {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Bi {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!Oe || !pt || Oe === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Oe)
      n = this.activeLink = new md(Oe, this), Oe.deps ? (n.prevDep = Oe.depsTail, Oe.depsTail.nextDep = n, Oe.depsTail = n) : Oe.deps = Oe.depsTail = n, ga(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = Oe.depsTail, n.nextDep = void 0, Oe.depsTail.nextDep = n, Oe.depsTail = n, Oe.deps === n && (Oe.deps = r);
    }
    return n;
  }
  trigger(t) {
    this.version++, lr++, this.notify(t);
  }
  notify(t) {
    Di();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Ri();
    }
  }
}
function ga(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep)
        ga(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const io = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ Symbol(
  ""
), ci = /* @__PURE__ */ Symbol(
  ""
), ar = /* @__PURE__ */ Symbol(
  ""
);
function De(e, t, n) {
  if (pt && Oe) {
    let r = io.get(e);
    r || io.set(e, r = /* @__PURE__ */ new Map());
    let o = r.get(n);
    o || (r.set(n, o = new Bi()), o.map = r, o.key = n), o.track();
  }
}
function jt(e, t, n, r, o, i) {
  const s = io.get(e);
  if (!s) {
    lr++;
    return;
  }
  const l = (a) => {
    a && a.trigger();
  };
  if (Di(), t === "clear")
    s.forEach(l);
  else {
    const a = Z(e), c = a && $o(n);
    if (a && n === "length") {
      const u = Number(r);
      s.forEach((d, f) => {
        (f === "length" || f === ar || !Xe(f) && f >= u) && l(d);
      });
    } else
      switch ((n !== void 0 || s.has(void 0)) && l(s.get(n)), c && l(s.get(ar)), t) {
        case "add":
          a ? c && l(s.get("length")) : (l(s.get(Sn)), Zt(e) && l(s.get(ci)));
          break;
        case "delete":
          a || (l(s.get(Sn)), Zt(e) && l(s.get(ci)));
          break;
        case "set":
          Zt(e) && l(s.get(Sn));
          break;
      }
  }
  Ri();
}
function bd(e, t) {
  const n = io.get(e);
  return n && n.get(t);
}
function kn(e) {
  const t = /* @__PURE__ */ ge(e);
  return t === e || (De(t, "iterate", ar), /* @__PURE__ */ Qe(e)) ? t : /* @__PURE__ */ Ot(e) ? /* @__PURE__ */ Qt(e) ? t.map((n) => en(st(n))) : t.map(en) : t.map(st);
}
function ko(e) {
  return De(e = /* @__PURE__ */ ge(e), "iterate", ar), e;
}
function St(e, t) {
  return /* @__PURE__ */ Ot(e) ? en(/* @__PURE__ */ Qt(e) ? st(t) : t) : st(t);
}
const vd = {
  __proto__: null,
  [Symbol.iterator]() {
    return Go(this, Symbol.iterator, (e) => St(this, e));
  },
  concat(...e) {
    return kn(this).concat(
      ...e.map((t) => Z(t) ? kn(t) : t)
    );
  },
  entries() {
    return Go(this, "entries", (e) => (e[1] = St(this, e[1]), e));
  },
  every(e, t) {
    return Pt(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Pt(
      this,
      "filter",
      e,
      t,
      (n) => n.map((r) => St(this, r)),
      arguments
    );
  },
  find(e, t) {
    return Pt(
      this,
      "find",
      e,
      t,
      (n) => St(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Pt(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Pt(
      this,
      "findLast",
      e,
      t,
      (n) => St(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Pt(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Pt(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Jo(this, "includes", e);
  },
  indexOf(...e) {
    return Jo(this, "indexOf", e);
  },
  join(e) {
    return kn(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Jo(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Pt(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Kn(this, "pop");
  },
  push(...e) {
    return Kn(this, "push", e);
  },
  reduce(e, ...t) {
    return ys(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return ys(this, "reduceRight", e, t);
  },
  shift() {
    return Kn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Pt(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Kn(this, "splice", e);
  },
  toReversed() {
    return kn(this).toReversed();
  },
  toSorted(e) {
    return kn(this).toSorted(e);
  },
  toSpliced(...e) {
    return kn(this).toSpliced(...e);
  },
  unshift(...e) {
    return Kn(this, "unshift", e);
  },
  values() {
    return Go(this, "values", (e) => St(this, e));
  }
};
function Go(e, t, n) {
  const r = ko(e), o = r[t]();
  return r !== e && !/* @__PURE__ */ Qe(e) && (o._next = o.next, o.next = () => {
    const i = o._next();
    return i.done || (i.value = n(i.value)), i;
  }), o;
}
const yd = Array.prototype;
function Pt(e, t, n, r, o, i) {
  const s = ko(e), l = s !== e && !/* @__PURE__ */ Qe(e), a = s[t];
  if (a !== yd[t]) {
    const d = a.apply(e, i);
    return l ? st(d) : d;
  }
  let c = n;
  s !== e && (l ? c = function(d, f) {
    return n.call(this, St(e, d), f, e);
  } : n.length > 2 && (c = function(d, f) {
    return n.call(this, d, f, e);
  }));
  const u = a.call(s, c, r);
  return l && o ? o(u) : u;
}
function ys(e, t, n, r) {
  const o = ko(e), i = o !== e && !/* @__PURE__ */ Qe(e);
  let s = n, l = !1;
  o !== e && (i ? (l = r.length === 0, s = function(c, u, d) {
    return l && (l = !1, c = St(e, c)), n.call(this, c, St(e, u), d, e);
  }) : n.length > 3 && (s = function(c, u, d) {
    return n.call(this, c, u, d, e);
  }));
  const a = o[t](s, ...r);
  return l ? St(e, a) : a;
}
function Jo(e, t, n) {
  const r = /* @__PURE__ */ ge(e);
  De(r, "iterate", ar);
  const o = r[t](...n);
  return (o === -1 || o === !1) && /* @__PURE__ */ To(n[0]) ? (n[0] = /* @__PURE__ */ ge(n[0]), r[t](...n)) : o;
}
function Kn(e, t, n = []) {
  Rt(), Di();
  const r = (/* @__PURE__ */ ge(e))[t].apply(e, n);
  return Ri(), zt(), r;
}
const Sd = /* @__PURE__ */ Fi("__proto__,__v_isRef,__isVue"), ma = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Xe)
);
function wd(e) {
  Xe(e) || (e = String(e));
  const t = /* @__PURE__ */ ge(this);
  return De(t, "has", e), t.hasOwnProperty(e);
}
class ba {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, r) {
    if (n === "__v_skip") return t.__v_skip;
    const o = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !o;
    if (n === "__v_isReadonly")
      return o;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return r === (o ? i ? Ld : wa : i ? Sa : ya).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const s = Z(t);
    if (!o) {
      let a;
      if (s && (a = vd[n]))
        return a;
      if (n === "hasOwnProperty")
        return wd;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Ee(t) ? t : r
    );
    if ((Xe(n) ? ma.has(n) : Sd(n)) || (o || De(t, "get", n), i))
      return l;
    if (/* @__PURE__ */ Ee(l)) {
      const a = s && $o(n) ? l : l.value;
      return o && me(a) ? /* @__PURE__ */ so(a) : a;
    }
    return me(l) ? o ? /* @__PURE__ */ so(l) : /* @__PURE__ */ nn(l) : l;
  }
}
class va extends ba {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, r, o) {
    let i = t[n];
    const s = Z(t) && $o(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ Ot(i);
      if (!/* @__PURE__ */ Qe(r) && !/* @__PURE__ */ Ot(r) && (i = /* @__PURE__ */ ge(i), r = /* @__PURE__ */ ge(r)), !s && /* @__PURE__ */ Ee(i) && !/* @__PURE__ */ Ee(r))
        return c || (i.value = r), !0;
    }
    const l = s ? Number(n) < t.length : be(t, n), a = Reflect.set(
      t,
      n,
      r,
      /* @__PURE__ */ Ee(t) ? t : o
    );
    return t === /* @__PURE__ */ ge(o) && a && (l ? $t(r, i) && jt(t, "set", n, r) : jt(t, "add", n, r)), a;
  }
  deleteProperty(t, n) {
    const r = be(t, n);
    t[n];
    const o = Reflect.deleteProperty(t, n);
    return o && r && jt(t, "delete", n, void 0), o;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!Xe(n) || !ma.has(n)) && De(t, "has", n), r;
  }
  ownKeys(t) {
    return De(
      t,
      "iterate",
      Z(t) ? "length" : Sn
    ), Reflect.ownKeys(t);
  }
}
class _d extends ba {
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
const $d = /* @__PURE__ */ new va(), xd = /* @__PURE__ */ new _d(), Cd = /* @__PURE__ */ new va(!0);
const di = (e) => e, Hr = (e) => Reflect.getPrototypeOf(e);
function Od(e, t, n) {
  return function(...r) {
    const o = this.__v_raw, i = /* @__PURE__ */ ge(o), s = Zt(i), l = e === "entries" || e === Symbol.iterator && s, a = e === "keys" && s, c = o[e](...r), u = n ? di : t ? en : st;
    return !t && De(
      i,
      "iterate",
      a ? ci : Sn
    ), Ae(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: d, done: f } = c.next();
          return f ? { value: d, done: f } : {
            value: l ? [u(d[0]), u(d[1])] : u(d),
            done: f
          };
        }
      }
    );
  };
}
function Kr(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Id(e, t) {
  const n = {
    get(o) {
      const i = this.__v_raw, s = /* @__PURE__ */ ge(i), l = /* @__PURE__ */ ge(o);
      e || ($t(o, l) && De(s, "get", o), De(s, "get", l));
      const { has: a } = Hr(s), c = t ? di : e ? en : st;
      if (a.call(s, o))
        return c(i.get(o));
      if (a.call(s, l))
        return c(i.get(l));
      i !== s && i.get(o);
    },
    get size() {
      const o = this.__v_raw;
      return !e && De(/* @__PURE__ */ ge(o), "iterate", Sn), o.size;
    },
    has(o) {
      const i = this.__v_raw, s = /* @__PURE__ */ ge(i), l = /* @__PURE__ */ ge(o);
      return e || ($t(o, l) && De(s, "has", o), De(s, "has", l)), o === l ? i.has(o) : i.has(o) || i.has(l);
    },
    forEach(o, i) {
      const s = this, l = s.__v_raw, a = /* @__PURE__ */ ge(l), c = t ? di : e ? en : st;
      return !e && De(a, "iterate", Sn), l.forEach((u, d) => o.call(i, c(u), c(d), s));
    }
  };
  return Ae(
    n,
    e ? {
      add: Kr("add"),
      set: Kr("set"),
      delete: Kr("delete"),
      clear: Kr("clear")
    } : {
      add(o) {
        const i = /* @__PURE__ */ ge(this), s = Hr(i), l = /* @__PURE__ */ ge(o), a = !t && !/* @__PURE__ */ Qe(o) && !/* @__PURE__ */ Ot(o) ? l : o;
        return s.has.call(i, a) || $t(o, a) && s.has.call(i, o) || $t(l, a) && s.has.call(i, l) || (i.add(a), jt(i, "add", a, a)), this;
      },
      set(o, i) {
        !t && !/* @__PURE__ */ Qe(i) && !/* @__PURE__ */ Ot(i) && (i = /* @__PURE__ */ ge(i));
        const s = /* @__PURE__ */ ge(this), { has: l, get: a } = Hr(s);
        let c = l.call(s, o);
        c || (o = /* @__PURE__ */ ge(o), c = l.call(s, o));
        const u = a.call(s, o);
        return s.set(o, i), c ? $t(i, u) && jt(s, "set", o, i) : jt(s, "add", o, i), this;
      },
      delete(o) {
        const i = /* @__PURE__ */ ge(this), { has: s, get: l } = Hr(i);
        let a = s.call(i, o);
        a || (o = /* @__PURE__ */ ge(o), a = s.call(i, o)), l && l.call(i, o);
        const c = i.delete(o);
        return a && jt(i, "delete", o, void 0), c;
      },
      clear() {
        const o = /* @__PURE__ */ ge(this), i = o.size !== 0, s = o.clear();
        return i && jt(
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
    n[o] = Od(o, e, t);
  }), n;
}
function Hi(e, t) {
  const n = Id(e, t);
  return (r, o, i) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_raw" ? r : Reflect.get(
    be(n, o) && o in r ? n : r,
    o,
    i
  );
}
const kd = {
  get: /* @__PURE__ */ Hi(!1, !1)
}, Td = {
  get: /* @__PURE__ */ Hi(!1, !0)
}, Pd = {
  get: /* @__PURE__ */ Hi(!0, !1)
};
const ya = /* @__PURE__ */ new WeakMap(), Sa = /* @__PURE__ */ new WeakMap(), wa = /* @__PURE__ */ new WeakMap(), Ld = /* @__PURE__ */ new WeakMap();
function Ed(e) {
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
function nn(e) {
  return /* @__PURE__ */ Ot(e) ? e : Ki(
    e,
    !1,
    $d,
    kd,
    ya
  );
}
// @__NO_SIDE_EFFECTS__
function Ad(e) {
  return Ki(
    e,
    !1,
    Cd,
    Td,
    Sa
  );
}
// @__NO_SIDE_EFFECTS__
function so(e) {
  return Ki(
    e,
    !0,
    xd,
    Pd,
    wa
  );
}
function Ki(e, t, n, r, o) {
  if (!me(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = o.get(e);
  if (i)
    return i;
  const s = Ed(Xc(e));
  if (s === 0)
    return e;
  const l = new Proxy(
    e,
    s === 2 ? r : n
  );
  return o.set(e, l), l;
}
// @__NO_SIDE_EFFECTS__
function Qt(e) {
  return /* @__PURE__ */ Ot(e) ? /* @__PURE__ */ Qt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ot(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Qe(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function To(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ge(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ ge(t) : e;
}
function Md(e) {
  return !be(e, "__v_skip") && Object.isExtensible(e) && oa(e, "__v_skip", !0), e;
}
const st = (e) => me(e) ? /* @__PURE__ */ nn(e) : e, en = (e) => me(e) ? /* @__PURE__ */ so(e) : e;
// @__NO_SIDE_EFFECTS__
function Ee(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Te(e) {
  return _a(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
  return _a(e, !0);
}
function _a(e, t) {
  return /* @__PURE__ */ Ee(e) ? e : new jd(e, t);
}
class jd {
  constructor(t, n) {
    this.dep = new Bi(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ ge(t), this._value = n ? t : st(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this.__v_isShallow || /* @__PURE__ */ Qe(t) || /* @__PURE__ */ Ot(t);
    t = r ? t : /* @__PURE__ */ ge(t), $t(t, n) && (this._rawValue = t, this._value = r ? t : st(t), this.dep.trigger());
  }
}
function F(e) {
  return /* @__PURE__ */ Ee(e) ? e.value : e;
}
const Nd = {
  get: (e, t, n) => t === "__v_raw" ? e : F(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const o = e[t];
    return /* @__PURE__ */ Ee(o) && !/* @__PURE__ */ Ee(n) ? (o.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function $a(e) {
  return /* @__PURE__ */ Qt(e) ? e : new Proxy(e, Nd);
}
class Fd {
  constructor(t, n, r) {
    this._object = t, this._defaultValue = r, this.__v_isRef = !0, this._value = void 0, this._key = Xe(n) ? n : String(n), this._raw = /* @__PURE__ */ ge(t);
    let o = !0, i = t;
    if (!Z(t) || Xe(this._key) || !$o(this._key))
      do
        o = !/* @__PURE__ */ To(i) || /* @__PURE__ */ Qe(i);
      while (o && (i = i.__v_raw));
    this._shallow = o;
  }
  get value() {
    let t = this._object[this._key];
    return this._shallow && (t = F(t)), this._value = t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    if (this._shallow && /* @__PURE__ */ Ee(this._raw[this._key])) {
      const n = this._object[this._key];
      if (/* @__PURE__ */ Ee(n)) {
        n.value = t;
        return;
      }
    }
    this._object[this._key] = t;
  }
  get dep() {
    return bd(this._raw, this._key);
  }
}
class Vd {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Dd(e, t, n) {
  return /* @__PURE__ */ Ee(e) ? e : ee(e) ? new Vd(e) : me(e) && arguments.length > 1 ? Rd(e, t, n) : /* @__PURE__ */ Te(e);
}
function Rd(e, t, n) {
  return new Fd(e, t, n);
}
class zd {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Bi(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = lr - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Oe !== this)
      return ca(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return pa(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Bd(e, t, n = !1) {
  let r, o;
  return ee(e) ? r = e : (r = e.get, o = e.set), new zd(r, o, n);
}
const Ur = {}, lo = /* @__PURE__ */ new WeakMap();
let cn;
function Hd(e, t = !1, n = cn) {
  if (n) {
    let r = lo.get(n);
    r || lo.set(n, r = []), r.push(e);
  }
}
function Kd(e, t, n = Ce) {
  const { immediate: r, deep: o, once: i, scheduler: s, augmentJob: l, call: a } = n, c = (m) => o ? m : /* @__PURE__ */ Qe(m) || o === !1 || o === 0 ? Nt(m, 1) : Nt(m);
  let u, d, f, h, b = !1, y = !1;
  if (/* @__PURE__ */ Ee(e) ? (d = () => e.value, b = /* @__PURE__ */ Qe(e)) : /* @__PURE__ */ Qt(e) ? (d = () => c(e), b = !0) : Z(e) ? (y = !0, b = e.some((m) => /* @__PURE__ */ Qt(m) || /* @__PURE__ */ Qe(m)), d = () => e.map((m) => {
    if (/* @__PURE__ */ Ee(m))
      return m.value;
    if (/* @__PURE__ */ Qt(m))
      return c(m);
    if (ee(m))
      return a ? a(m, 2) : m();
  })) : ee(e) ? t ? d = a ? () => a(e, 2) : e : d = () => {
    if (f) {
      Rt();
      try {
        f();
      } finally {
        zt();
      }
    }
    const m = cn;
    cn = u;
    try {
      return a ? a(e, 3, [h]) : e(h);
    } finally {
      cn = m;
    }
  } : d = Ct, t && o) {
    const m = d, $ = o === !0 ? 1 / 0 : o;
    d = () => Nt(m(), $);
  }
  const S = hd(), v = () => {
    u.stop(), S && S.active && Vi(S.effects, u);
  };
  if (i && t) {
    const m = t;
    t = (...$) => {
      const M = m(...$);
      return v(), M;
    };
  }
  let w = y ? new Array(e.length).fill(Ur) : Ur;
  const T = (m) => {
    if (!(!(u.flags & 1) || !u.dirty && !m))
      if (t) {
        const $ = u.run();
        if (m || o || b || (y ? $.some((M, P) => $t(M, w[P])) : $t($, w))) {
          f && f();
          const M = cn;
          cn = u;
          try {
            const P = [
              $,
              // pass undefined as the old value when it's changed for the first time
              w === Ur ? void 0 : y && w[0] === Ur ? [] : w,
              h
            ];
            w = $, a ? a(t, 3, P) : (
              // @ts-expect-error
              t(...P)
            );
          } finally {
            cn = M;
          }
        }
      } else
        u.run();
  };
  return l && l(T), u = new aa(d), u.scheduler = s ? () => s(T, !1) : T, h = (m) => Hd(m, !1, u), f = u.onStop = () => {
    const m = lo.get(u);
    if (m) {
      if (a)
        a(m, 4);
      else
        for (const $ of m) $();
      lo.delete(u);
    }
  }, t ? r ? T(!0) : w = u.run() : s ? s(T.bind(null, !0), !0) : u.run(), v.pause = u.pause.bind(u), v.resume = u.resume.bind(u), v.stop = v, v;
}
function Nt(e, t = 1 / 0, n) {
  if (t <= 0 || !me(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ Ee(e))
    Nt(e.value, t, n);
  else if (Z(e))
    for (let r = 0; r < e.length; r++)
      Nt(e[r], t, n);
  else if (oo(e) || Zt(e))
    e.forEach((r) => {
      Nt(r, t, n);
    });
  else if (ra(e)) {
    for (const r in e)
      Nt(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && Nt(e[r], t, n);
  }
  return e;
}
function Mr(e, t, n, r) {
  try {
    return r ? e(...r) : e();
  } catch (o) {
    Po(o, t, n);
  }
}
function lt(e, t, n, r) {
  if (ee(e)) {
    const o = Mr(e, t, n, r);
    return o && ta(o) && o.catch((i) => {
      Po(i, t, n);
    }), o;
  }
  if (Z(e)) {
    const o = [];
    for (let i = 0; i < e.length; i++)
      o.push(lt(e[i], t, n, r));
    return o;
  }
}
function Po(e, t, n, r = !0) {
  const o = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: s } = t && t.appContext.config || Ce;
  if (t) {
    let l = t.parent;
    const a = t.proxy, c = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const u = l.ec;
      if (u) {
        for (let d = 0; d < u.length; d++)
          if (u[d](e, a, c) === !1)
            return;
      }
      l = l.parent;
    }
    if (i) {
      Rt(), Mr(i, null, 10, [
        e,
        a,
        c
      ]), zt();
      return;
    }
  }
  Ud(e, n, o, r, s);
}
function Ud(e, t, n, r = !0, o = !1) {
  if (o)
    throw e;
  console.error(e);
}
const Ke = [];
let yt = -1;
const An = [];
let qt = null, Pn = 0;
const xa = /* @__PURE__ */ Promise.resolve();
let ao = null;
function Ca(e) {
  const t = ao || xa;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Wd(e) {
  let t = yt + 1, n = Ke.length;
  for (; t < n; ) {
    const r = t + n >>> 1, o = Ke[r], i = ur(o);
    i < e || i === e && o.flags & 2 ? t = r + 1 : n = r;
  }
  return t;
}
function Ui(e) {
  if (!(e.flags & 1)) {
    const t = ur(e), n = Ke[Ke.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= ur(n) ? Ke.push(e) : Ke.splice(Wd(t), 0, e), e.flags |= 1, Oa();
  }
}
function Oa() {
  ao || (ao = xa.then(ka));
}
function qd(e) {
  if (!Z(e))
    qt && e.id === -1 ? qt.splice(Pn + 1, 0, e) : e.flags & 1 || (An.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      An.push(e[t]);
  Oa();
}
function Ss(e, t, n = yt + 1) {
  for (; n < Ke.length; n++) {
    const r = Ke[n];
    if (r && r.flags & 2) {
      if (e && r.id !== e.uid)
        continue;
      Ke.splice(n, 1), n--, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
    }
  }
}
function Ia(e) {
  if (An.length) {
    const t = [...new Set(An)].sort(
      (n, r) => ur(n) - ur(r)
    );
    if (An.length = 0, qt) {
      for (let n = 0; n < t.length; n++)
        qt.push(t[n]);
      return;
    }
    for (qt = t, Pn = 0; Pn < qt.length; Pn++) {
      const n = qt[Pn];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    qt = null, Pn = 0;
  }
}
const ur = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function ka(e) {
  try {
    for (yt = 0; yt < Ke.length; yt++) {
      const t = Ke[yt];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Mr(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; yt < Ke.length; yt++) {
      const t = Ke[yt];
      t && (t.flags &= -2);
    }
    yt = -1, Ke.length = 0, Ia(), ao = null, (Ke.length || An.length) && ka();
  }
}
let Fe = null, Ta = null;
function uo(e) {
  const t = Fe;
  return Fe = e, Ta = e && e.type.__scopeId || null, t;
}
function dt(e, t = Fe, n) {
  if (!t || e._n)
    return e;
  const r = (...o) => {
    r._d && ho(-1);
    const i = uo(t), s = Ft.length;
    let l;
    try {
      l = e(...o);
    } finally {
      for (let a = Ft.length; a > s; a--) Zi();
      uo(i), r._d && ho(1);
    }
    return l;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function Pa(e, t) {
  if (Fe === null)
    return e;
  const n = No(Fe), r = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [i, s, l, a = Ce] = t[o];
    i && (ee(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && Nt(s), r.push({
      dir: i,
      instance: n,
      value: s,
      oldValue: void 0,
      arg: l,
      modifiers: a
    }));
  }
  return e;
}
function sn(e, t, n, r) {
  const o = e.dirs, i = t && t.dirs;
  for (let s = 0; s < o.length; s++) {
    const l = o[s];
    i && (l.oldValue = i[s].value);
    let a = l.dir[r];
    a && (Rt(), lt(a, n, 8, [
      e.el,
      l,
      e,
      t
    ]), zt());
  }
}
function Gd(e, t) {
  if (ze) {
    let n = ze.provides;
    const r = ze.parent && ze.parent.provides;
    r === n && (n = ze.provides = Object.create(r)), n[e] = t;
  }
}
function Qr(e, t, n = !1) {
  const r = pr();
  if (r || jn) {
    let o = jn ? jn._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return n && ee(t) ? t.call(r && r.proxy) : t;
  }
}
const Jd = /* @__PURE__ */ Symbol.for("v-scx"), Yd = () => Qr(Jd);
function qe(e, t, n) {
  return La(e, t, n);
}
function La(e, t, n = Ce) {
  const { immediate: r, deep: o, flush: i, once: s } = n, l = Ae({}, n), a = t && r || !t && i !== "post";
  let c;
  if (gr) {
    if (i === "sync") {
      const h = Yd();
      c = h.__watcherHandles || (h.__watcherHandles = []);
    } else if (!a) {
      const h = () => {
      };
      return h.stop = Ct, h.resume = Ct, h.pause = Ct, h;
    }
  }
  const u = ze;
  l.call = (h, b, y) => lt(h, u, b, y);
  let d = !1;
  i === "post" ? l.scheduler = (h) => {
    He(h, u && u.suspense);
  } : i !== "sync" && (d = !0, l.scheduler = (h, b) => {
    b ? h() : Ui(h);
  }), l.augmentJob = (h) => {
    t && (h.flags |= 4), d && (h.flags |= 2, u && (h.id = u.uid, h.i = u));
  };
  const f = Kd(e, t, l);
  return gr && (c ? c.push(f) : a && f()), f;
}
function Zd(e, t, n) {
  const r = this.proxy, o = Ie(e) ? e.includes(".") ? Ea(r, e) : () => r[e] : e.bind(r, r);
  let i;
  ee(t) ? i = t : (i = t.handler, n = t);
  const s = Nr(this), l = La(o, i.bind(r), n);
  return s(), l;
}
function Ea(e, t) {
  const n = t.split(".");
  return () => {
    let r = e;
    for (let o = 0; o < n.length && r; o++)
      r = r[n[o]];
    return r;
  };
}
const Wt = /* @__PURE__ */ new WeakMap(), Aa = /* @__PURE__ */ Symbol("_vte"), Lo = (e) => e.__isTeleport, hn = (e) => e && (e.disabled || e.disabled === ""), Qd = (e) => e && (e.defer || e.defer === ""), ws = (e) => typeof SVGElement < "u" && e instanceof SVGElement, _s = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, fi = (e, t) => {
  const n = e && e.to;
  return Ie(n) ? t ? t(n) : null : n;
}, Xd = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, r, o, i, s, l, a, c) {
    const {
      mc: u,
      pc: d,
      pbc: f,
      o: { insert: h, querySelector: b, createText: y, createComment: S, parentNode: v }
    } = c, w = hn(t.props);
    let { dynamicChildren: T } = t;
    const m = (P, B, V) => {
      P.shapeFlag & 16 && u(
        P.children,
        B,
        V,
        o,
        i,
        s,
        l,
        a
      );
    }, $ = (P = t) => {
      const B = hn(P.props), V = P.target = fi(P.props, b), q = pi(V, P, y, h);
      V && (s !== "svg" && ws(V) ? s = "svg" : s !== "mathml" && _s(V) && (s = "mathml"), o && o.isCE && (o.ce._teleportTargets || (o.ce._teleportTargets = /* @__PURE__ */ new Set())).add(V), B || (m(P, V, q), Yn(P, !1)));
    }, M = (P) => {
      const B = () => {
        if (Wt.get(P) === B) {
          if (Wt.delete(P), hn(P.props)) {
            const V = v(P.el) || n;
            m(P, V, P.anchor), Yn(P, !0);
          }
          $(P);
        }
      };
      Wt.set(P, B), He(B, i);
    };
    if (e == null) {
      const P = t.el = y(""), B = t.anchor = y("");
      if (h(P, n, r), h(B, n, r), Qd(t.props) || i && i.pendingBranch) {
        M(t);
        return;
      }
      w && (m(t, n, B), Yn(t, !0)), $();
    } else {
      t.el = e.el;
      const P = t.anchor = e.anchor, B = Wt.get(e);
      if (B) {
        B.flags |= 8, Wt.delete(e), M(t);
        return;
      }
      t.targetStart = e.targetStart;
      const V = t.target = e.target, q = t.targetAnchor = e.targetAnchor, U = hn(e.props), E = U ? n : V, Y = U ? P : q;
      if (s === "svg" || ws(V) ? s = "svg" : (s === "mathml" || _s(V)) && (s = "mathml"), T ? (f(
        e.dynamicChildren,
        T,
        E,
        o,
        i,
        s,
        l
      ), Yi(e, t, !0)) : a || d(
        e,
        t,
        E,
        Y,
        o,
        i,
        s,
        l,
        !1
      ), w)
        U ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Wr(
          t,
          n,
          P,
          c,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const te = fi(t.props, b);
        te && (t.target = te, Wr(
          t,
          te,
          null,
          c,
          0
        ));
      } else U && Wr(
        t,
        V,
        q,
        c,
        1
      );
      Yn(t, w);
    }
  },
  remove(e, t, n, { um: r, o: { remove: o } }, i) {
    const {
      shapeFlag: s,
      children: l,
      anchor: a,
      targetStart: c,
      targetAnchor: u,
      target: d,
      props: f
    } = e, h = hn(f), b = i || !h, y = Wt.get(e);
    if (y && (y.flags |= 8, Wt.delete(e)), d && (o(c), o(u)), i && o(a), !y && (h || d) && s & 16)
      for (let S = 0; S < l.length; S++) {
        const v = l[S];
        r(
          v,
          t,
          n,
          b,
          !!v.dynamicChildren
        );
      }
  },
  move: Wr,
  hydrate: ef
};
function Wr(e, t, n, { o: { insert: r }, m: o }, i = 2) {
  i === 0 && r(e.targetAnchor, t, n);
  const { el: s, anchor: l, shapeFlag: a, children: c, props: u } = e, d = i === 2;
  if (d && r(s, t, n), !Wt.has(e) && (!d || hn(u)) && a & 16)
    for (let f = 0; f < c.length; f++)
      o(
        c[f],
        t,
        n,
        2
      );
  d && r(l, t, n);
}
function ef(e, t, n, r, o, i, {
  o: { nextSibling: s, parentNode: l, querySelector: a, insert: c, createText: u }
}, d) {
  function f(S, v) {
    let w = v;
    for (; w; ) {
      if (w && w.nodeType === 8) {
        if (w.data === "teleport start anchor")
          t.targetStart = w;
        else if (w.data === "teleport anchor") {
          t.targetAnchor = w, S._lpa = t.targetAnchor && s(t.targetAnchor);
          break;
        }
      }
      w = s(w);
    }
  }
  function h(S, v) {
    v.anchor = d(
      s(S),
      v,
      l(S),
      n,
      r,
      o,
      i
    );
  }
  const b = t.target = fi(
    t.props,
    a
  ), y = hn(t.props);
  if (b) {
    const S = b._lpa || b.firstChild;
    t.shapeFlag & 16 && (y ? (h(e, t), f(b, S), t.targetAnchor || pi(
      b,
      t,
      u,
      c,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      l(e) === b ? e : null
    )) : (t.anchor = s(e), f(b, S), t.targetAnchor || pi(b, t, u, c), d(
      S && s(S),
      t,
      b,
      n,
      r,
      o,
      i
    ))), Yn(t, y);
  } else y && t.shapeFlag & 16 && (h(e, t), t.targetStart = e, t.targetAnchor = s(e));
  return t.anchor && s(t.anchor);
}
const tf = Xd;
function Yn(e, t) {
  const n = e.ctx;
  if (n && n.ut) {
    let r, o;
    for (t ? (r = e.el, o = e.anchor) : (r = e.targetStart, o = e.targetAnchor); r && r !== o; )
      r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
    n.ut();
  }
}
function pi(e, t, n, r, o = null) {
  const i = t.targetStart = n(""), s = t.targetAnchor = n("");
  return i[Aa] = s, e && (r(i, e, o), r(s, e, o)), s;
}
const rt = /* @__PURE__ */ Symbol("_leaveCb"), Un = /* @__PURE__ */ Symbol("_enterCb");
function nf() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Cn(() => {
    e.isMounted = !0;
  }), jr(() => {
    e.isUnmounting = !0;
  }), e;
}
const tt = [Function, Array], Ma = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: tt,
  onEnter: tt,
  onAfterEnter: tt,
  onEnterCancelled: tt,
  // leave
  onBeforeLeave: tt,
  onLeave: tt,
  onAfterLeave: tt,
  onLeaveCancelled: tt,
  // appear
  onBeforeAppear: tt,
  onAppear: tt,
  onAfterAppear: tt,
  onAppearCancelled: tt
}, ja = (e) => {
  const t = e.subTree;
  return t.component ? ja(t.component) : t;
}, rf = {
  name: "BaseTransition",
  props: Ma,
  setup(e, { slots: t }) {
    const n = pr(), r = nf();
    return () => {
      const o = t.default && Va(t.default(), !0), i = o && o.length ? Na(o) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        n.subTree ? ae() : void 0
      );
      if (!i)
        return;
      const s = /* @__PURE__ */ ge(e), { mode: l } = s;
      if (r.isLeaving)
        return Yo(i);
      const a = co(i);
      if (!a)
        return Yo(i);
      let c = hi(
        a,
        s,
        r,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => c = d
      );
      a.type !== Re && cr(a, c);
      let u = n.subTree && co(n.subTree);
      if (u && u.type !== Re && !gn(u, a) && ja(n).type !== Re) {
        let d = hi(
          u,
          s,
          r,
          n
        );
        if (cr(u, d), l === "out-in" && a.type !== Re)
          return r.isLeaving = !0, d.afterLeave = () => {
            r.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, u = void 0;
          }, Yo(i);
        l === "in-out" && a.type !== Re ? d.delayLeave = (f, h, b) => {
          const y = Fa(
            r,
            u
          );
          y[String(u.key)] = u, f[rt] = () => {
            h(), f[rt] = void 0, delete c.delayedLeave, u = void 0;
          }, c.delayedLeave = () => {
            b(), delete c.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return i;
    };
  }
};
function Na(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== Re) {
        t = n;
        break;
      }
  }
  return t;
}
const of = rf;
function Fa(e, t) {
  const { leavingVNodes: n } = e;
  let r = n.get(t.type);
  return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function hi(e, t, n, r, o) {
  const {
    appear: i,
    mode: s,
    persisted: l = !1,
    onBeforeEnter: a,
    onEnter: c,
    onAfterEnter: u,
    onEnterCancelled: d,
    onBeforeLeave: f,
    onLeave: h,
    onAfterLeave: b,
    onLeaveCancelled: y,
    onBeforeAppear: S,
    onAppear: v,
    onAfterAppear: w,
    onAppearCancelled: T
  } = t, m = String(e.key), $ = Fa(n, e), M = (V, q) => {
    V && lt(
      V,
      r,
      9,
      q
    );
  }, P = (V, q) => {
    const U = q[1];
    M(V, q), Z(V) ? V.every((E) => E.length <= 1) && U() : V.length <= 1 && U();
  }, B = {
    mode: s,
    persisted: l,
    beforeEnter(V) {
      let q = a;
      if (!n.isMounted)
        if (i)
          q = S || a;
        else
          return;
      V[rt] && V[rt](
        !0
        /* cancelled */
      );
      const U = $[m];
      U && gn(e, U) && U.el[rt] && U.el[rt](), M(q, [V]);
    },
    enter(V) {
      if ($[m] === e) return;
      let q = c, U = u, E = d;
      if (!n.isMounted)
        if (i)
          q = v || c, U = w || u, E = T || d;
        else
          return;
      let Y = !1;
      V[Un] = (he) => {
        Y || (Y = !0, he ? M(E, [V]) : M(U, [V]), B.delayedLeave && B.delayedLeave(), V[Un] = void 0);
      };
      const te = V[Un].bind(null, !1);
      q ? P(q, [V, te]) : te();
    },
    leave(V, q) {
      const U = String(e.key);
      if (V[Un] && V[Un](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return q();
      M(f, [V]);
      let E = !1;
      V[rt] = (te) => {
        E || (E = !0, q(), te ? M(y, [V]) : M(b, [V]), V[rt] = void 0, $[U] === e && delete $[U]);
      };
      const Y = V[rt].bind(null, !1);
      $[U] = e, h ? P(h, [V, Y]) : Y();
    },
    clone(V) {
      const q = hi(
        V,
        t,
        n,
        r,
        o
      );
      return o && o(q), q;
    }
  };
  return B;
}
function Yo(e) {
  if (Eo(e))
    return e = tn(e), e.children = null, e;
}
function co(e) {
  if (!Eo(e))
    return Lo(e.type) && e.children ? Na(e.children) : e;
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
function cr(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    cr(
      Lo(n.type) && co(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Va(e, t = !1, n) {
  let r = [], o = 0;
  for (let i = 0; i < e.length; i++) {
    let s = e[i];
    const l = n == null ? s.key : String(n) + String(s.key != null ? s.key : i);
    s.type === pe ? (s.patchFlag & 128 && o++, r = r.concat(
      Va(s.children, t, l)
    )) : (t || s.type !== Re) && r.push(l != null ? tn(s, { key: l }) : s);
  }
  if (o > 1)
    for (let i = 0; i < r.length; i++)
      r[i].patchFlag = -2;
  return r;
}
// @__NO_SIDE_EFFECTS__
function It(e, t) {
  return ee(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ae({ name: e.name }, t, { setup: e })
  ) : e;
}
function sf() {
  const e = pr();
  return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Da(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function $s(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const fo = /* @__PURE__ */ new WeakMap();
function or(e, t, n, r, o = !1) {
  if (Z(e)) {
    e.forEach(
      (y, S) => or(
        y,
        t && (Z(t) ? t[S] : t),
        n,
        r,
        o
      )
    );
    return;
  }
  if (Mn(r) && !o) {
    r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && or(e, t, n, r.component.subTree);
    return;
  }
  const i = r.shapeFlag & 4 ? No(r.component) : r.el, s = o ? null : i, { i: l, r: a } = e, c = t && t.r, u = l.refs === Ce ? l.refs = {} : l.refs, d = l.setupState, f = /* @__PURE__ */ ge(d), h = d === Ce ? ea : (y) => $s(u, y) ? !1 : be(f, y), b = (y, S) => !(S && $s(u, S));
  if (c != null && c !== a) {
    if (xs(t), Ie(c))
      u[c] = null, h(c) && (d[c] = null);
    else if (/* @__PURE__ */ Ee(c)) {
      const y = t;
      b(c, y.k) && (c.value = null), y.k && (u[y.k] = null);
    }
  }
  if (ee(a))
    Mr(a, l, 12, [s, u]);
  else {
    const y = Ie(a), S = /* @__PURE__ */ Ee(a);
    if (y || S) {
      const v = () => {
        if (e.f) {
          const w = y ? h(a) ? d[a] : u[a] : b() || !e.k ? a.value : u[e.k];
          if (o)
            Z(w) && Vi(w, i);
          else if (Z(w))
            w.includes(i) || w.push(i);
          else if (y)
            u[a] = [i], h(a) && (d[a] = u[a]);
          else {
            const T = [i];
            b(a, e.k) && (a.value = T), e.k && (u[e.k] = T);
          }
        } else y ? (u[a] = s, h(a) && (d[a] = s)) : S && (b(a, e.k) && (a.value = s), e.k && (u[e.k] = s));
      };
      if (s) {
        const w = () => {
          v(), fo.delete(e);
        };
        w.id = -1, fo.set(e, w), He(w, n);
      } else
        xs(e), v();
    }
  }
}
function xs(e) {
  const t = fo.get(e);
  t && (t.flags |= 8, fo.delete(e));
}
Oo().requestIdleCallback;
Oo().cancelIdleCallback;
const Mn = (e) => !!e.type.__asyncLoader, Eo = (e) => e.type.__isKeepAlive;
function lf(e, t) {
  Ra(e, "a", t);
}
function af(e, t) {
  Ra(e, "da", t);
}
function Ra(e, t, n = ze) {
  const r = e.__wdc || (e.__wdc = () => {
    let o = n;
    for (; o; ) {
      if (o.isDeactivated)
        return;
      o = o.parent;
    }
    return e();
  });
  if (Ao(t, r, n), n) {
    let o = n.parent;
    for (; o && o.parent; )
      Eo(o.parent.vnode) && uf(r, t, n, o), o = o.parent;
  }
}
function uf(e, t, n, r) {
  const o = Ao(
    t,
    e,
    r,
    !0
    /* prepend */
  );
  za(() => {
    Vi(r[t], o);
  }, n);
}
function Ao(e, t, n = ze, r = !1) {
  if (n) {
    const o = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...s) => {
      Rt();
      const l = Nr(n), a = lt(t, n, e, s);
      return l(), zt(), a;
    });
    return r ? o.unshift(i) : o.push(i), i;
  }
}
const Bt = (e) => (t, n = ze) => {
  (!gr || e === "sp") && Ao(e, (...r) => t(...r), n);
}, cf = Bt("bm"), Cn = Bt("m"), df = Bt(
  "bu"
), ff = Bt("u"), jr = Bt(
  "bum"
), za = Bt("um"), pf = Bt(
  "sp"
), hf = Bt("rtg"), gf = Bt("rtc");
function mf(e, t = ze) {
  Ao("ec", e, t);
}
const Wi = "components", bf = "directives";
function nt(e, t) {
  return qi(Wi, e, !0, t) || e;
}
const Ba = /* @__PURE__ */ Symbol.for("v-ndc");
function gi(e) {
  return Ie(e) ? qi(Wi, e, !1) || e : e || Ba;
}
function Ha(e) {
  return qi(bf, e);
}
function qi(e, t, n = !0, r = !1) {
  const o = Fe || ze;
  if (o) {
    const i = o.type;
    if (e === Wi) {
      const l = ep(
        i,
        !1
      );
      if (l && (l === t || l === Ue(t) || l === Co(Ue(t))))
        return i;
    }
    const s = (
      // local registration
      // check instance[type] first which is resolved for options API
      Cs(o[e] || i[e], t) || // global registration
      Cs(o.appContext[e], t)
    );
    return !s && r ? i : s;
  }
}
function Cs(e, t) {
  return e && (e[t] || e[Ue(t)] || e[Co(Ue(t))]);
}
function it(e, t, n, r) {
  let o;
  const i = n, s = Z(e);
  if (s || Ie(e)) {
    const l = s && /* @__PURE__ */ Qt(e);
    let a = !1, c = !1;
    l && (a = !/* @__PURE__ */ Qe(e), c = /* @__PURE__ */ Ot(e), e = ko(e)), o = new Array(e.length);
    for (let u = 0, d = e.length; u < d; u++)
      o[u] = t(
        a ? c ? en(st(e[u])) : st(e[u]) : e[u],
        u,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    o = new Array(e);
    for (let l = 0; l < e; l++)
      o[l] = t(l + 1, l, void 0, i);
  } else if (me(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (l, a) => t(l, a, void 0, i)
      );
    else {
      const l = Object.keys(e);
      o = new Array(l.length);
      for (let a = 0, c = l.length; a < c; a++) {
        const u = l[a];
        o[a] = t(e[u], u, a, i);
      }
    }
  else
    o = [];
  return o;
}
function vf(e, t) {
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (Z(r))
      for (let o = 0; o < r.length; o++)
        e[r[o].name] = r[o].fn;
    else r && (e[r.name] = r.key ? (...o) => {
      const i = r.fn(...o);
      return i && (i.key = r.key), i;
    } : r.fn);
  }
  return e;
}
function _e(e, t, n, r, o, i) {
  if (n == null && (n = {}), Fe.ce || Fe.parent && Mn(Fe.parent) && Fe.parent.ce) {
    const c = n, u = Object.keys(c).length > 0;
    return t !== "default" && (c.name = t), x(), Le(
      pe,
      null,
      [G("slot", c, r && r())],
      u ? -2 : 64
    );
  }
  let s = e[t];
  s && s._c && (s._d = !1);
  const l = Ft.length;
  x();
  let a;
  try {
    const c = s && Ka(s(n)), u = n.key || i || // slot content array of a dynamic conditional slot may have a branch
    // key attached in the `createSlots` helper, respect that
    c && c.key;
    a = Le(
      pe,
      {
        key: (u && !Xe(u) ? u : `_${t}`) + // #7256 force differentiate fallback content from actual content
        (!c && r ? "_fb" : "")
      },
      c || (r ? r() : []),
      c && e._ === 1 ? 64 : -2
    );
  } catch (c) {
    for (let u = Ft.length; u > l; u--) Zi();
    throw c;
  } finally {
    s && s._c && (s._d = !0);
  }
  return a.scopeId && (a.slotScopeIds = [a.scopeId + "-s"]), a;
}
function Ka(e) {
  return e.some((t) => fr(t) ? !(t.type === Re || t.type === pe && !Ka(t.children)) : !0) ? e : null;
}
const mi = (e) => e ? uu(e) ? No(e) : mi(e.parent) : null, ir = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ae(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => mi(e.parent),
    $root: (e) => mi(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Wa(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Ui(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Ca.bind(e.proxy)),
    $watch: (e) => Zd.bind(e)
  })
), Zo = (e, t) => e !== Ce && !e.__isScriptSetup && be(e, t), yf = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: r, data: o, props: i, accessCache: s, type: l, appContext: a } = e;
    if (t[0] !== "$") {
      const f = s[t];
      if (f !== void 0)
        switch (f) {
          case 1:
            return r[t];
          case 2:
            return o[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Zo(r, t))
          return s[t] = 1, r[t];
        if (o !== Ce && be(o, t))
          return s[t] = 2, o[t];
        if (be(i, t))
          return s[t] = 3, i[t];
        if (n !== Ce && be(n, t))
          return s[t] = 4, n[t];
        bi && (s[t] = 0);
      }
    }
    const c = ir[t];
    let u, d;
    if (c)
      return t === "$attrs" && De(e.attrs, "get", ""), c(e);
    if (
      // css module (injected by vue-loader)
      (u = l.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== Ce && be(n, t))
      return s[t] = 4, n[t];
    if (
      // global properties
      d = a.config.globalProperties, be(d, t)
    )
      return d[t];
  },
  set({ _: e }, t, n) {
    const { data: r, setupState: o, ctx: i } = e;
    return Zo(o, t) ? (o[t] = n, !0) : r !== Ce && be(r, t) ? (r[t] = n, !0) : be(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: o, props: i, type: s }
  }, l) {
    let a;
    return !!(n[l] || e !== Ce && l[0] !== "$" && be(e, l) || Zo(t, l) || be(i, l) || be(r, l) || be(ir, l) || be(o.config.globalProperties, l) || (a = s.__cssModules) && a[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : be(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Os(e) {
  return Z(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let bi = !0;
function Sf(e) {
  const t = Wa(e), n = e.proxy, r = e.ctx;
  bi = !1, t.beforeCreate && Is(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: i,
    methods: s,
    watch: l,
    provide: a,
    inject: c,
    // lifecycle
    created: u,
    beforeMount: d,
    mounted: f,
    beforeUpdate: h,
    updated: b,
    activated: y,
    deactivated: S,
    beforeDestroy: v,
    beforeUnmount: w,
    destroyed: T,
    unmounted: m,
    render: $,
    renderTracked: M,
    renderTriggered: P,
    errorCaptured: B,
    serverPrefetch: V,
    // public API
    expose: q,
    inheritAttrs: U,
    // assets
    components: E,
    directives: Y,
    filters: te
  } = t;
  if (c && wf(c, r, null), s)
    for (const re in s) {
      const se = s[re];
      ee(se) && (r[re] = se.bind(n));
    }
  if (o) {
    const re = o.call(n, n);
    me(re) && (e.data = /* @__PURE__ */ nn(re));
  }
  if (bi = !0, i)
    for (const re in i) {
      const se = i[re], R = ee(se) ? se.bind(n, n) : ee(se.get) ? se.get.bind(n, n) : Ct, H = !ee(se) && ee(se.set) ? se.set.bind(n) : Ct, Q = ye({
        get: R,
        set: H
      });
      Object.defineProperty(r, re, {
        enumerable: !0,
        configurable: !0,
        get: () => Q.value,
        set: (Se) => Q.value = Se
      });
    }
  if (l)
    for (const re in l)
      Ua(l[re], r, n, re);
  if (a) {
    const re = ee(a) ? a.call(n) : a;
    Reflect.ownKeys(re).forEach((se) => {
      Gd(se, re[se]);
    });
  }
  u && Is(u, e, "c");
  function ie(re, se) {
    Z(se) ? se.forEach((R) => re(R.bind(n))) : se && re(se.bind(n));
  }
  if (ie(cf, d), ie(Cn, f), ie(df, h), ie(ff, b), ie(lf, y), ie(af, S), ie(mf, B), ie(gf, M), ie(hf, P), ie(jr, w), ie(za, m), ie(pf, V), Z(q))
    if (q.length) {
      const re = e.exposed || (e.exposed = {});
      q.forEach((se) => {
        Object.defineProperty(re, se, {
          get: () => n[se],
          set: (R) => n[se] = R,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  $ && e.render === Ct && (e.render = $), U != null && (e.inheritAttrs = U), E && (e.components = E), Y && (e.directives = Y), V && Da(e);
}
function wf(e, t, n = Ct) {
  Z(e) && (e = vi(e));
  for (const r in e) {
    const o = e[r];
    let i;
    me(o) ? "default" in o ? i = Qr(
      o.from || r,
      o.default,
      !0
    ) : i = Qr(o.from || r) : i = Qr(o), /* @__PURE__ */ Ee(i) ? Object.defineProperty(t, r, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (s) => i.value = s
    }) : t[r] = i;
  }
}
function Is(e, t, n) {
  lt(
    Z(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Ua(e, t, n, r) {
  let o = r.includes(".") ? Ea(n, r) : () => n[r];
  if (Ie(e)) {
    const i = t[e];
    ee(i) && qe(o, i);
  } else if (ee(e))
    qe(o, e.bind(n));
  else if (me(e))
    if (Z(e))
      e.forEach((i) => Ua(i, t, n, r));
    else {
      const i = ee(e.handler) ? e.handler.bind(n) : t[e.handler];
      ee(i) && qe(o, i, e);
    }
}
function Wa(e) {
  const t = e.type, { mixins: n, extends: r } = t, {
    mixins: o,
    optionsCache: i,
    config: { optionMergeStrategies: s }
  } = e.appContext, l = i.get(t);
  let a;
  return l ? a = l : !o.length && !n && !r ? a = t : (a = {}, o.length && o.forEach(
    (c) => po(a, c, s, !0)
  ), po(a, t, s)), me(t) && i.set(t, a), a;
}
function po(e, t, n, r = !1) {
  const { mixins: o, extends: i } = t;
  i && po(e, i, n, !0), o && o.forEach(
    (s) => po(e, s, n, !0)
  );
  for (const s in t)
    if (!(r && s === "expose")) {
      const l = _f[s] || n && n[s];
      e[s] = l ? l(e[s], t[s]) : t[s];
    }
  return e;
}
const _f = {
  data: ks,
  props: Ts,
  emits: Ts,
  // objects
  methods: Zn,
  computed: Zn,
  // lifecycle
  beforeCreate: Be,
  created: Be,
  beforeMount: Be,
  mounted: Be,
  beforeUpdate: Be,
  updated: Be,
  beforeDestroy: Be,
  beforeUnmount: Be,
  destroyed: Be,
  unmounted: Be,
  activated: Be,
  deactivated: Be,
  errorCaptured: Be,
  serverPrefetch: Be,
  // assets
  components: Zn,
  directives: Zn,
  // watch
  watch: xf,
  // provide / inject
  provide: ks,
  inject: $f
};
function ks(e, t) {
  return t ? e ? function() {
    return Ae(
      ee(e) ? e.call(this, this) : e,
      ee(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function $f(e, t) {
  return Zn(vi(e), vi(t));
}
function vi(e) {
  if (Z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Be(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Zn(e, t) {
  return e ? Ae(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Ts(e, t) {
  return e ? Z(e) && Z(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ae(
    /* @__PURE__ */ Object.create(null),
    Os(e),
    Os(t ?? {})
  ) : t;
}
function xf(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Ae(/* @__PURE__ */ Object.create(null), e);
  for (const r in t)
    n[r] = Be(e[r], t[r]);
  return n;
}
function qa() {
  return {
    app: null,
    config: {
      isNativeTag: ea,
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
let Cf = 0;
function Of(e, t) {
  return function(r, o = null) {
    ee(r) || (r = Ae({}, r)), o != null && !me(o) && (o = null);
    const i = qa(), s = /* @__PURE__ */ new WeakSet(), l = [];
    let a = !1;
    const c = i.app = {
      _uid: Cf++,
      _component: r,
      _props: o,
      _container: null,
      _context: i,
      _instance: null,
      version: rp,
      get config() {
        return i.config;
      },
      set config(u) {
      },
      use(u, ...d) {
        return s.has(u) || (u && ee(u.install) ? (s.add(u), u.install(c, ...d)) : ee(u) && (s.add(u), u(c, ...d))), c;
      },
      mixin(u) {
        return i.mixins.includes(u) || i.mixins.push(u), c;
      },
      component(u, d) {
        return d ? (i.components[u] = d, c) : i.components[u];
      },
      directive(u, d) {
        return d ? (i.directives[u] = d, c) : i.directives[u];
      },
      mount(u, d, f) {
        if (!a) {
          const h = c._ceVNode || G(r, o);
          return h.appContext = i, f === !0 ? f = "svg" : f === !1 && (f = void 0), e(h, u, f), a = !0, c._container = u, u.__vue_app__ = c, No(h.component);
        }
      },
      onUnmount(u) {
        l.push(u);
      },
      unmount() {
        a && (lt(
          l,
          c._instance,
          16
        ), e(null, c._container), delete c._container.__vue_app__);
      },
      provide(u, d) {
        return i.provides[u] = d, c;
      },
      runWithContext(u) {
        const d = jn;
        jn = c;
        try {
          return u();
        } finally {
          jn = d;
        }
      }
    };
    return c;
  };
}
let jn = null;
const If = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ue(t)}Modifiers`] || e[`${xn(t)}Modifiers`];
function kf(e, t, ...n) {
  if (e.isUnmounted) return;
  const r = e.vnode.props || Ce;
  let o = n;
  const i = t.startsWith("update:"), s = i && If(r, t.slice(7));
  s && (s.trim && (o = n.map((u) => Ie(u) ? u.trim() : u)), s.number && (o = o.map(nd)));
  let l, a = r[l = Ko(t)] || // also try camelCase event handler (#2249)
  r[l = Ko(Ue(t))];
  !a && i && (a = r[l = Ko(xn(t))]), a && lt(
    a,
    e,
    6,
    o
  );
  const c = r[l + "Once"];
  if (c) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, lt(
      c,
      e,
      6,
      o
    );
  }
}
const Tf = /* @__PURE__ */ new WeakMap();
function Ga(e, t, n = !1) {
  const r = n ? Tf : t.emitsCache, o = r.get(e);
  if (o !== void 0)
    return o;
  const i = e.emits;
  let s = {}, l = !1;
  if (!ee(e)) {
    const a = (c) => {
      const u = Ga(c, t, !0);
      u && (l = !0, Ae(s, u));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !i && !l ? (me(e) && r.set(e, null), null) : (Z(i) ? i.forEach((a) => s[a] = null) : Ae(s, i), me(e) && r.set(e, s), s);
}
function Mo(e, t) {
  return !e || !wo(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), be(e, t[0].toLowerCase() + t.slice(1)) || be(e, xn(t)) || be(e, t));
}
function Ps(e) {
  const {
    type: t,
    vnode: n,
    proxy: r,
    withProxy: o,
    propsOptions: [i],
    slots: s,
    attrs: l,
    emit: a,
    render: c,
    renderCache: u,
    props: d,
    data: f,
    setupState: h,
    ctx: b,
    inheritAttrs: y
  } = e, S = uo(e);
  let v, w;
  try {
    if (n.shapeFlag & 4) {
      const m = o || r, $ = m;
      v = wt(
        c.call(
          $,
          m,
          u,
          d,
          h,
          f,
          b
        )
      ), w = l;
    } else {
      const m = t;
      v = wt(
        m.length > 1 ? m(
          d,
          { attrs: l, slots: s, emit: a }
        ) : m(
          d,
          null
        )
      ), w = t.props ? l : Pf(l);
    }
  } catch (m) {
    Ft.length = 0, Po(m, e, 1), v = G(Re);
  }
  let T = v;
  if (w && y !== !1) {
    const m = Object.keys(w), { shapeFlag: $ } = T;
    m.length && $ & 7 && (i && m.some(_o) && (w = Lf(
      w,
      i
    )), T = tn(T, w, !1, !0));
  }
  if (n.dirs && (T = tn(T, null, !1, !0), T.dirs = T.dirs ? T.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const m = Lo(T.type) && co(T) || T;
    cr(m, n.transition);
  }
  return v = T, uo(S), v;
}
const Pf = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || wo(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Lf = (e, t) => {
  const n = {};
  for (const r in e)
    (!_o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
  return n;
};
function Ef(e, t, n) {
  const { props: r, children: o, component: i } = e, { props: s, children: l, patchFlag: a } = t, c = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return r ? Ls(r, s, c) : !!s;
    if (a & 8) {
      const u = t.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        const f = u[d];
        if (Ja(s, r, f) && !Mo(c, f))
          return !0;
      }
    }
  } else
    return (o || l) && (!l || !l.$stable) ? !0 : r === s ? !1 : r ? s ? Ls(r, s, c) : !0 : !!s;
  return !1;
}
function Ls(e, t, n) {
  const r = Object.keys(t);
  if (r.length !== Object.keys(e).length)
    return !0;
  for (let o = 0; o < r.length; o++) {
    const i = r[o];
    if (Ja(t, e, i) && !Mo(n, i))
      return !0;
  }
  return !1;
}
function Ja(e, t, n) {
  const r = e[n], o = t[n];
  return n === "style" && me(r) && me(o) ? !Io(r, o) : r !== o;
}
function Af({ vnode: e, parent: t, suspense: n }, r) {
  for (; t; ) {
    const o = t.subTree;
    if (o.suspense && o.suspense.activeBranch === e && (o.suspense.vnode.el = o.el = r, e = o), o === e)
      (e = t.vnode).el = r, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = r);
}
const Ya = {}, Za = () => Object.create(Ya), Qa = (e) => Object.getPrototypeOf(e) === Ya;
function Mf(e, t, n, r = !1) {
  const o = {}, i = Za();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Xa(e, t, o, i);
  for (const s in e.propsOptions[0])
    s in o || (o[s] = void 0);
  n ? e.props = r ? o : /* @__PURE__ */ Ad(o) : e.type.props ? e.props = o : e.props = i, e.attrs = i;
}
function jf(e, t, n, r) {
  const {
    props: o,
    attrs: i,
    vnode: { patchFlag: s }
  } = e, l = /* @__PURE__ */ ge(o), [a] = e.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (r || s > 0) && !(s & 16)
  ) {
    if (s & 8) {
      const u = e.vnode.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        let f = u[d];
        if (Mo(e.emitsOptions, f))
          continue;
        const h = t[f];
        if (a)
          if (be(i, f))
            h !== i[f] && (i[f] = h, c = !0);
          else {
            const b = Ue(f);
            o[b] = yi(
              a,
              l,
              b,
              h,
              e,
              !1
            );
          }
        else
          h !== i[f] && (i[f] = h, c = !0);
      }
    }
  } else {
    Xa(e, t, o, i) && (c = !0);
    let u;
    for (const d in l)
      (!t || // for camelCase
      !be(t, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = xn(d)) === d || !be(t, u))) && (a ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[u] !== void 0) && (o[d] = yi(
        a,
        l,
        d,
        void 0,
        e,
        !0
      )) : delete o[d]);
    if (i !== l)
      for (const d in i)
        (!t || !be(t, d)) && (delete i[d], c = !0);
  }
  c && jt(e.attrs, "set", "");
}
function Xa(e, t, n, r) {
  const [o, i] = e.propsOptions;
  let s = !1, l;
  if (t)
    for (let a in t) {
      if (tr(a))
        continue;
      const c = t[a];
      let u;
      o && be(o, u = Ue(a)) ? !i || !i.includes(u) ? n[u] = c : (l || (l = {}))[u] = c : Mo(e.emitsOptions, a) || (!(a in r) || c !== r[a]) && (r[a] = c, s = !0);
    }
  if (i) {
    const a = /* @__PURE__ */ ge(n), c = l || Ce;
    for (let u = 0; u < i.length; u++) {
      const d = i[u];
      n[d] = yi(
        o,
        a,
        d,
        c[d],
        e,
        !be(c, d)
      );
    }
  }
  return s;
}
function yi(e, t, n, r, o, i) {
  const s = e[n];
  if (s != null) {
    const l = be(s, "default");
    if (l && r === void 0) {
      const a = s.default;
      if (s.type !== Function && !s.skipFactory && ee(a)) {
        const { propsDefaults: c } = o;
        if (n in c)
          r = c[n];
        else {
          const u = Nr(o);
          r = c[n] = a.call(
            null,
            t
          ), u();
        }
      } else
        r = a;
      o.ce && o.ce._setProp(n, r);
    }
    s[
      0
      /* shouldCast */
    ] && (i && !l ? r = !1 : s[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === xn(n)) && (r = !0));
  }
  return r;
}
const Nf = /* @__PURE__ */ new WeakMap();
function eu(e, t, n = !1) {
  const r = n ? Nf : t.propsCache, o = r.get(e);
  if (o)
    return o;
  const i = e.props, s = {}, l = [];
  let a = !1;
  if (!ee(e)) {
    const u = (d) => {
      a = !0;
      const [f, h] = eu(d, t, !0);
      Ae(s, f), h && l.push(...h);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!i && !a)
    return me(e) && r.set(e, mn), mn;
  if (Z(i))
    for (let u = 0; u < i.length; u++) {
      const d = Ue(i[u]);
      Es(d) && (s[d] = Ce);
    }
  else if (i)
    for (const u in i) {
      const d = Ue(u);
      if (Es(d)) {
        const f = i[u], h = s[d] = Z(f) || ee(f) ? { type: f } : Ae({}, f), b = h.type;
        let y = !1, S = !0;
        if (Z(b))
          for (let v = 0; v < b.length; ++v) {
            const w = b[v], T = ee(w) && w.name;
            if (T === "Boolean") {
              y = !0;
              break;
            } else T === "String" && (S = !1);
          }
        else
          y = ee(b) && b.name === "Boolean";
        h[
          0
          /* shouldCast */
        ] = y, h[
          1
          /* shouldCastTrue */
        ] = S, (y || be(h, "default")) && l.push(d);
      }
    }
  const c = [s, l];
  return me(e) && r.set(e, c), c;
}
function Es(e) {
  return e[0] !== "$" && !tr(e);
}
const Gi = (e) => e === "_" || e === "_ctx" || e === "$stable", Ji = (e) => Z(e) ? e.map(wt) : [wt(e)], Ff = (e, t, n) => {
  if (t._n)
    return t;
  const r = dt((...o) => Ji(t(...o)), n);
  return r._c = !1, r;
}, tu = (e, t, n) => {
  const r = e._ctx;
  for (const o in e) {
    if (Gi(o)) continue;
    const i = e[o];
    if (ee(i))
      t[o] = Ff(o, i, r);
    else if (i != null) {
      const s = Ji(i);
      t[o] = () => s;
    }
  }
}, nu = (e, t) => {
  const n = Ji(t);
  e.slots.default = () => n;
}, ru = (e, t, n) => {
  for (const r in t)
    (n || !Gi(r)) && (e[r] = t[r]);
}, Vf = (e, t, n) => {
  const r = e.slots = Za();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (ru(r, t, n), n && oa(r, "_", o, !0)) : tu(t, r);
  } else t && nu(e, t);
}, Df = (e, t, n) => {
  const { vnode: r, slots: o } = e;
  let i = !0, s = Ce;
  if (r.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? i = !1 : ru(o, t, n) : (i = !t.$stable, tu(t, o)), s = t;
  } else t && (nu(e, t), s = { default: 1 });
  if (i)
    for (const l in o)
      !Gi(l) && s[l] == null && delete o[l];
}, He = Kf;
function Rf(e) {
  return zf(e);
}
function zf(e, t) {
  const n = Oo();
  n.__VUE__ = !0;
  const {
    insert: r,
    remove: o,
    patchProp: i,
    createElement: s,
    createText: l,
    createComment: a,
    setText: c,
    setElementText: u,
    parentNode: d,
    nextSibling: f,
    setScopeId: h = Ct,
    insertStaticContent: b
  } = e, y = (p, g, _, k = null, C = null, I = null, N = void 0, j = null, A = !!g.dynamicChildren) => {
    if (p === g)
      return;
    p && !gn(p, g) && (k = In(p), Se(p, C, I, !0), p = null), g.patchFlag === -2 && (A = !1, g.dynamicChildren = null), g.dynamicChildren && p && p.dynamicChildren && p.dynamicChildren.hasOnce && (g.dynamicChildren === mn && (g.dynamicChildren = []), g.dynamicChildren.hasOnce = !0);
    const { type: O, ref: J, shapeFlag: D } = g;
    switch (O) {
      case jo:
        S(p, g, _, k);
        break;
      case Re:
        v(p, g, _, k);
        break;
      case Xo:
        p == null && w(g, _, k, N);
        break;
      case pe:
        E(
          p,
          g,
          _,
          k,
          C,
          I,
          N,
          j,
          A
        );
        break;
      default:
        D & 1 ? $(
          p,
          g,
          _,
          k,
          C,
          I,
          N,
          j,
          A
        ) : D & 6 ? Y(
          p,
          g,
          _,
          k,
          C,
          I,
          N,
          j,
          A
        ) : (D & 64 || D & 128) && O.process(
          p,
          g,
          _,
          k,
          C,
          I,
          N,
          j,
          A,
          on
        );
    }
    J != null && C ? or(J, p && p.ref, I, g || p, !g) : J == null && p && p.ref != null && or(p.ref, null, I, p, !0);
  }, S = (p, g, _, k) => {
    if (p == null)
      r(
        g.el = l(g.children),
        _,
        k
      );
    else {
      const C = g.el = p.el;
      g.children !== p.children && c(C, g.children);
    }
  }, v = (p, g, _, k) => {
    p == null ? r(
      g.el = a(g.children || ""),
      _,
      k
    ) : g.el = p.el;
  }, w = (p, g, _, k) => {
    [p.el, p.anchor] = b(
      p.children,
      g,
      _,
      k,
      p.el,
      p.anchor
    );
  }, T = ({ el: p, anchor: g }, _, k) => {
    let C;
    for (; p && p !== g; )
      C = f(p), r(p, _, k), p = C;
    r(g, _, k);
  }, m = ({ el: p, anchor: g }) => {
    let _;
    for (; p && p !== g; )
      _ = f(p), o(p), p = _;
    o(g);
  }, $ = (p, g, _, k, C, I, N, j, A) => {
    if (g.type === "svg" ? N = "svg" : g.type === "math" && (N = "mathml"), p == null)
      M(
        g,
        _,
        k,
        C,
        I,
        N,
        j,
        A
      );
    else {
      const O = p.el && p.el._isVueCE ? p.el : null;
      try {
        O && O._beginPatch(), V(
          p,
          g,
          C,
          I,
          N,
          j,
          A
        );
      } finally {
        O && O._endPatch();
      }
    }
  }, M = (p, g, _, k, C, I, N, j) => {
    let A, O;
    const { props: J, shapeFlag: D, transition: W, dirs: X } = p;
    if (A = p.el = s(
      p.type,
      I,
      J && J.is,
      J
    ), D & 8 ? u(A, p.children) : D & 16 && B(
      p.children,
      A,
      null,
      k,
      C,
      Qo(p, I),
      N,
      j
    ), X && sn(p, null, k, "created"), P(A, p, p.scopeId, N, k), J) {
      for (const xe in J)
        xe !== "value" && !tr(xe) && i(A, xe, null, J[xe], I, k);
      "value" in J && i(A, "value", null, J.value, I), (O = J.onVnodeBeforeMount) && bt(O, k, p);
    }
    X && sn(p, null, k, "beforeMount");
    const ue = Bf(C, W);
    ue && W.beforeEnter(A), r(A, g, _), ((O = J && J.onVnodeMounted) || ue || X) && He(() => {
      O && bt(O, k, p), ue && W.enter(A), X && sn(p, null, k, "mounted");
    }, C);
  }, P = (p, g, _, k, C) => {
    if (_ && h(p, _), k)
      for (let I = 0; I < k.length; I++)
        h(p, k[I]);
    if (C) {
      let I = C.subTree;
      if (g === I || su(I.type) && (I.ssContent === g || I.ssFallback === g)) {
        const N = C.vnode;
        P(
          p,
          N,
          N.scopeId,
          N.slotScopeIds,
          C.parent
        );
      }
    }
  }, B = (p, g, _, k, C, I, N, j, A = 0) => {
    for (let O = A; O < p.length; O++) {
      const J = p[O] = j ? Mt(p[O]) : wt(p[O]);
      y(
        null,
        J,
        g,
        _,
        k,
        C,
        I,
        N,
        j
      );
    }
  }, V = (p, g, _, k, C, I, N) => {
    const j = g.el = p.el;
    let { patchFlag: A, dynamicChildren: O, dirs: J } = g;
    A |= p.patchFlag & 16;
    const D = p.props || Ce, W = g.props || Ce;
    let X;
    if (_ && ln(_, !1), (X = W.onVnodeBeforeUpdate) && bt(X, _, g, p), J && sn(g, p, _, "beforeUpdate"), _ && ln(_, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    O && (!p.dynamicChildren || p.dynamicChildren.length !== O.length) && (A = 0, N = !1, O = null), (D.innerHTML && W.innerHTML == null || D.textContent && W.textContent == null) && u(j, ""), O ? q(
      p.dynamicChildren,
      O,
      j,
      _,
      k,
      Qo(g, C),
      I
    ) : N || se(
      p,
      g,
      j,
      null,
      _,
      k,
      Qo(g, C),
      I,
      !1
    ), A > 0) {
      if (A & 16)
        U(j, D, W, _, C);
      else if (A & 2 && D.class !== W.class && i(j, "class", null, W.class, C), A & 4 && i(j, "style", D.style, W.style, C), A & 8) {
        const ue = g.dynamicProps;
        for (let xe = 0; xe < ue.length; xe++) {
          const we = ue[xe], Pe = D[we], Me = W[we];
          (Me !== Pe || we === "value") && i(j, we, Pe, Me, C, _);
        }
      }
      A & 1 && p.children !== g.children && u(j, g.children);
    } else !N && O == null && U(j, D, W, _, C);
    ((X = W.onVnodeUpdated) || J) && He(() => {
      X && bt(X, _, g, p), J && sn(g, p, _, "updated");
    }, k);
  }, q = (p, g, _, k, C, I, N) => {
    for (let j = 0; j < g.length; j++) {
      const A = p[j], O = g[j], J = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        A.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (A.type === pe || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !gn(A, O) || // - In the case of a component, it could contain anything.
        A.shapeFlag & 198) ? d(A.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          _
        )
      );
      y(
        A,
        O,
        J,
        null,
        k,
        C,
        I,
        N,
        !0
      );
    }
  }, U = (p, g, _, k, C) => {
    if (g !== _) {
      if (g !== Ce)
        for (const I in g)
          !tr(I) && !(I in _) && i(
            p,
            I,
            g[I],
            null,
            C,
            k
          );
      for (const I in _) {
        if (tr(I)) continue;
        const N = _[I], j = g[I];
        N !== j && I !== "value" && i(p, I, j, N, C, k);
      }
      "value" in _ && i(p, "value", g.value, _.value, C);
    }
  }, E = (p, g, _, k, C, I, N, j, A) => {
    const O = g.el = p ? p.el : l(""), J = g.anchor = p ? p.anchor : l("");
    let { patchFlag: D, dynamicChildren: W, slotScopeIds: X } = g;
    X && (j = j ? j.concat(X) : X), p == null ? (r(O, _, k), r(J, _, k), B(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      g.children || [],
      _,
      J,
      C,
      I,
      N,
      j,
      A
    )) : D > 0 && D & 64 && W && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    p.dynamicChildren && p.dynamicChildren.length === W.length ? (q(
      p.dynamicChildren,
      W,
      _,
      C,
      I,
      N,
      j
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (g.key != null || C && g === C.subTree) && Yi(
      p,
      g,
      !0
      /* shallow */
    )) : se(
      p,
      g,
      _,
      J,
      C,
      I,
      N,
      j,
      A
    );
  }, Y = (p, g, _, k, C, I, N, j, A) => {
    g.slotScopeIds = j, p == null ? g.shapeFlag & 512 ? C.ctx.activate(
      g,
      _,
      k,
      N,
      A
    ) : te(
      g,
      _,
      k,
      C,
      I,
      N,
      A
    ) : he(p, g, A);
  }, te = (p, g, _, k, C, I, N) => {
    const j = p.component = Jf(
      p,
      k,
      C
    );
    if (Eo(p) && (j.ctx.renderer = on), Yf(j, !1, N), j.asyncDep) {
      if (C && C.registerDep(j, ie, N), !p.el) {
        const A = j.subTree = G(Re);
        v(null, A, g, _), p.placeholder = A.el;
      }
    } else
      ie(
        j,
        p,
        g,
        _,
        C,
        I,
        N
      );
  }, he = (p, g, _) => {
    const k = g.component = p.component;
    if (Ef(p, g, _))
      if (k.asyncDep && !k.asyncResolved) {
        g.el = p.el, re(k, g, _);
        return;
      } else
        k.next = g, k.update();
    else
      g.el = p.el, k.vnode = g;
  }, ie = (p, g, _, k, C, I, N) => {
    const j = () => {
      if (p.isMounted) {
        let { next: D, bu: W, u: X, parent: ue, vnode: xe } = p;
        {
          const gt = ou(p);
          if (gt) {
            D && (D.el = xe.el, re(p, D, N)), gt.asyncDep.then(() => {
              He(() => {
                p.isUnmounted || O();
              }, C);
            });
            return;
          }
        }
        let we = D, Pe;
        ln(p, !1), D ? (D.el = xe.el, re(p, D, N)) : D = xe, W && Uo(W), (Pe = D.props && D.props.onVnodeBeforeUpdate) && bt(Pe, ue, D, xe), ln(p, !0);
        const Me = Ps(p), ht = p.subTree;
        p.subTree = Me, y(
          ht,
          Me,
          // parent may have changed if it's in a teleport
          d(ht.el),
          // anchor may have changed if it's in a fragment
          In(ht),
          p,
          C,
          I
        ), D.el = Me.el, we === null && Af(p, Me.el), X && He(X, C), (Pe = D.props && D.props.onVnodeUpdated) && He(
          () => bt(Pe, ue, D, xe),
          C
        );
      } else {
        let D;
        const { el: W, props: X } = g, { bm: ue, m: xe, parent: we, root: Pe, type: Me } = p, ht = Mn(g);
        ln(p, !1), ue && Uo(ue), !ht && (D = X && X.onVnodeBeforeMount) && bt(D, we, g), ln(p, !0);
        {
          Pe.ce && Pe.ce._hasShadowRoot() && Pe.ce._injectChildStyle(
            Me,
            p.parent ? p.parent.type : void 0
          );
          const gt = p.subTree = Ps(p);
          y(
            null,
            gt,
            _,
            k,
            p,
            C,
            I
          ), g.el = gt.el;
        }
        if (xe && He(xe, C), !ht && (D = X && X.onVnodeMounted)) {
          const gt = g;
          He(
            () => bt(D, we, gt),
            C
          );
        }
        (g.shapeFlag & 256 || we && Mn(we.vnode) && we.vnode.shapeFlag & 256) && p.a && He(p.a, C), p.isMounted = !0, g = _ = k = null;
      }
    };
    p.scope.on();
    const A = p.effect = new aa(j);
    p.scope.off();
    const O = p.update = A.run.bind(A), J = p.job = A.runIfDirty.bind(A);
    J.i = p, J.id = p.uid, A.scheduler = () => Ui(J), ln(p, !0), O();
  }, re = (p, g, _) => {
    g.component = p;
    const k = p.vnode.props;
    p.vnode = g, p.next = null, jf(p, g.props, k, _), Df(p, g.children, _), Rt(), Ss(p), zt();
  }, se = (p, g, _, k, C, I, N, j, A = !1) => {
    const O = p && p.children, J = p ? p.shapeFlag : 0, D = g.children, { patchFlag: W, shapeFlag: X } = g;
    if (W > 0) {
      if (W & 128) {
        H(
          O,
          D,
          _,
          k,
          C,
          I,
          N,
          j,
          A
        );
        return;
      } else if (W & 256) {
        R(
          O,
          D,
          _,
          k,
          C,
          I,
          N,
          j,
          A
        );
        return;
      }
    }
    X & 8 ? (J & 16 && Kt(O, C, I), D !== O && u(_, D)) : J & 16 ? X & 16 ? H(
      O,
      D,
      _,
      k,
      C,
      I,
      N,
      j,
      A
    ) : Kt(O, C, I, !0) : (J & 8 && u(_, ""), X & 16 && B(
      D,
      _,
      k,
      C,
      I,
      N,
      j,
      A
    ));
  }, R = (p, g, _, k, C, I, N, j, A) => {
    p = p || mn, g = g || mn;
    const O = p.length, J = g.length, D = Math.min(O, J);
    let W;
    for (W = 0; W < D; W++) {
      const X = g[W] = A ? Mt(g[W]) : wt(g[W]);
      y(
        p[W],
        X,
        _,
        null,
        C,
        I,
        N,
        j,
        A
      );
    }
    O > J ? Kt(
      p,
      C,
      I,
      !0,
      !1,
      D
    ) : B(
      g,
      _,
      k,
      C,
      I,
      N,
      j,
      A,
      D
    );
  }, H = (p, g, _, k, C, I, N, j, A) => {
    let O = 0;
    const J = g.length;
    let D = p.length - 1, W = J - 1;
    for (; O <= D && O <= W; ) {
      const X = p[O], ue = g[O] = A ? Mt(g[O]) : wt(g[O]);
      if (gn(X, ue))
        y(
          X,
          ue,
          _,
          null,
          C,
          I,
          N,
          j,
          A
        );
      else
        break;
      O++;
    }
    for (; O <= D && O <= W; ) {
      const X = p[D], ue = g[W] = A ? Mt(g[W]) : wt(g[W]);
      if (gn(X, ue))
        y(
          X,
          ue,
          _,
          null,
          C,
          I,
          N,
          j,
          A
        );
      else
        break;
      D--, W--;
    }
    if (O > D) {
      if (O <= W) {
        const X = W + 1, ue = X < J ? g[X].el : k;
        for (; O <= W; )
          y(
            null,
            g[O] = A ? Mt(g[O]) : wt(g[O]),
            _,
            ue,
            C,
            I,
            N,
            j,
            A
          ), O++;
      }
    } else if (O > W)
      for (; O <= D; )
        Se(p[O], C, I, !0), O++;
    else {
      const X = O, ue = O, xe = /* @__PURE__ */ new Map();
      for (O = ue; O <= W; O++) {
        const Je = g[O] = A ? Mt(g[O]) : wt(g[O]);
        Je.key != null && xe.set(Je.key, O);
      }
      let we, Pe = 0;
      const Me = W - ue + 1;
      let ht = !1, gt = 0;
      const Hn = new Array(Me);
      for (O = 0; O < Me; O++) Hn[O] = 0;
      for (O = X; O <= D; O++) {
        const Je = p[O];
        if (Pe >= Me) {
          Se(Je, C, I, !0);
          continue;
        }
        let mt;
        if (Je.key != null)
          mt = xe.get(Je.key);
        else
          for (we = ue; we <= W; we++)
            if (Hn[we - ue] === 0 && gn(Je, g[we])) {
              mt = we;
              break;
            }
        mt === void 0 ? Se(Je, C, I, !0) : (Hn[mt - ue] = O + 1, mt >= gt ? gt = mt : ht = !0, y(
          Je,
          g[mt],
          _,
          null,
          C,
          I,
          N,
          j,
          A
        ), Pe++);
      }
      const rs = ht ? Hf(Hn) : mn;
      for (we = rs.length - 1, O = Me - 1; O >= 0; O--) {
        const Je = ue + O, mt = g[Je], os = g[Je + 1], is = Je + 1 < J ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          os.el || iu(os)
        ) : k;
        Hn[O] === 0 ? y(
          null,
          mt,
          _,
          is,
          C,
          I,
          N,
          j,
          A
        ) : ht && (we < 0 || O !== rs[we] ? Q(mt, _, is, 2) : we--);
      }
    }
  }, Q = (p, g, _, k, C = null) => {
    const { el: I, type: N, transition: j, children: A, shapeFlag: O } = p;
    if (O & 6) {
      Q(p.component.subTree, g, _, k);
      return;
    }
    if (O & 128) {
      p.suspense.move(g, _, k);
      return;
    }
    if (O & 64) {
      N.move(p, g, _, on);
      return;
    }
    if (N === pe) {
      r(I, g, _);
      for (let D = 0; D < A.length; D++)
        Q(A[D], g, _, k);
      r(p.anchor, g, _);
      return;
    }
    if (N === Xo) {
      T(p, g, _);
      return;
    }
    if (k !== 2 && O & 1 && j)
      if (k === 0)
        j.persisted && !I[rt] ? r(I, g, _) : (j.beforeEnter(I), r(I, g, _), He(() => j.enter(I), C));
      else {
        const { leave: D, delayLeave: W, afterLeave: X } = j, ue = () => {
          p.ctx.isUnmounted ? o(I) : r(I, g, _);
        }, xe = () => {
          const we = I._isLeaving || !!I[rt];
          I._isLeaving && I[rt](
            !0
            /* cancelled */
          ), j.persisted && !we ? ue() : D(I, () => {
            ue(), X && X();
          });
        };
        W ? W(I, ue, xe) : xe();
      }
    else
      r(I, g, _);
  }, Se = (p, g, _, k = !1, C = !1) => {
    const {
      type: I,
      props: N,
      ref: j,
      children: A,
      dynamicChildren: O,
      shapeFlag: J,
      patchFlag: D,
      dirs: W,
      cacheIndex: X,
      memo: ue
    } = p;
    if ((D === -2 || O && O.hasOnce) && (C = !1), j != null && (Rt(), or(j, null, _, p, !0), zt()), X != null && (!p.ctx || p.ctx === g) && (g.renderCache[X] = void 0), J & 256) {
      g.ctx.deactivate(p);
      return;
    }
    const xe = J & 1 && W, we = !Mn(p);
    let Pe;
    if (we && (Pe = N && N.onVnodeBeforeUnmount) && bt(Pe, g, p), J & 6)
      Dr(p.component, _, k);
    else {
      if (J & 128) {
        p.suspense.unmount(_, k);
        return;
      }
      xe && sn(p, null, g, "beforeUnmount"), J & 64 ? p.type.remove(
        p,
        g,
        _,
        on,
        k
      ) : O && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !O.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (I !== pe || D > 0 && D & 64) ? Kt(
        O,
        g,
        _,
        !1,
        !0
      ) : (I === pe && D & 384 || !C && J & 16) && Kt(A, g, _), k && rn(p);
    }
    const Me = ue != null && X == null;
    (we && (Pe = N && N.onVnodeUnmounted) || xe || Me) && He(() => {
      Pe && bt(Pe, g, p), xe && sn(p, null, g, "unmounted"), Me && (p.el = null);
    }, _);
  }, rn = (p) => {
    const { type: g, el: _, anchor: k, transition: C } = p;
    if (g === pe) {
      Ht(_, k);
      return;
    }
    if (g === Xo) {
      m(p), C && !C.persisted && C.afterLeave && C.afterLeave();
      return;
    }
    const I = () => {
      o(_), C && !C.persisted && C.afterLeave && C.afterLeave();
    };
    if (p.shapeFlag & 1 && C && !C.persisted) {
      const { leave: N, delayLeave: j } = C, A = () => N(_, I);
      j ? j(p.el, I, A) : A();
    } else
      I();
  }, Ht = (p, g) => {
    let _;
    for (; p !== g; )
      _ = f(p), o(p), p = _;
    o(g);
  }, Dr = (p, g, _) => {
    const { bum: k, scope: C, job: I, subTree: N, um: j, m: A, a: O } = p;
    As(A), As(O), k && Uo(k), C.stop(), I ? (I.flags |= 8, Se(N, p, g, _)) : p.vnode.el && N && (N.transition = p.vnode.transition, Se(N, p, g, _)), j && He(j, g), He(() => {
      p.isUnmounted = !0;
    }, g);
  }, Kt = (p, g, _, k = !1, C = !1, I = 0) => {
    for (let N = I; N < p.length; N++)
      Se(p[N], g, _, k, C);
  }, In = (p) => {
    if (p.shapeFlag & 6)
      return In(p.component.subTree);
    if (p.shapeFlag & 128)
      return p.suspense.next();
    const g = f(p.anchor || p.el), _ = g && g[Aa];
    return _ ? f(_) : g;
  };
  let Bn = !1;
  const Rr = (p, g, _) => {
    let k;
    p == null ? g._vnode && (Se(g._vnode, null, null, !0), k = g._vnode.component) : y(
      g._vnode || null,
      p,
      g,
      null,
      null,
      null,
      _
    ), g._vnode = p, Bn || (Bn = !0, Ss(k), Ia(), Bn = !1);
  }, on = {
    p: y,
    um: Se,
    m: Q,
    r: rn,
    mt: te,
    mc: B,
    pc: se,
    pbc: q,
    n: In,
    o: e
  };
  return {
    render: Rr,
    hydrate: void 0,
    createApp: Of(Rr)
  };
}
function Qo({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ln({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Bf(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Yi(e, t, n = !1) {
  const r = e.children, o = t.children;
  if (Z(r) && Z(o))
    for (let i = 0; i < r.length; i++) {
      const s = r[i];
      let l = o[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = o[i] = Mt(o[i]), l.el = s.el), !n && l.patchFlag !== -2 && Yi(s, l)), l.type === jo && (l.patchFlag === -1 && (l = o[i] = Mt(l)), l.el = s.el), l.type === Re && !l.el && (l.el = s.el);
    }
}
function Hf(e) {
  const t = e.slice(), n = [0];
  let r, o, i, s, l;
  const a = e.length;
  for (r = 0; r < a; r++) {
    const c = e[r];
    if (c !== 0) {
      if (o = n[n.length - 1], e[o] < c) {
        t[r] = o, n.push(r);
        continue;
      }
      for (i = 0, s = n.length - 1; i < s; )
        l = i + s >> 1, e[n[l]] < c ? i = l + 1 : s = l;
      c < e[n[i]] && (i > 0 && (t[r] = n[i - 1]), n[i] = r);
    }
  }
  for (i = n.length, s = n[i - 1]; i-- > 0; )
    n[i] = s, s = t[s];
  return n;
}
function ou(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : ou(t);
}
function As(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function iu(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? iu(t.subTree) : null;
}
const su = (e) => e.__isSuspense;
function Kf(e, t) {
  t && t.pendingBranch ? Z(e) ? t.effects.push(...e) : t.effects.push(e) : qd(e);
}
const pe = /* @__PURE__ */ Symbol.for("v-fgt"), jo = /* @__PURE__ */ Symbol.for("v-txt"), Re = /* @__PURE__ */ Symbol.for("v-cmt"), Xo = /* @__PURE__ */ Symbol.for("v-stc"), Ft = [];
let Ze = null;
function x(e = !1) {
  Ft.push(Ze = e ? null : []);
}
function Zi() {
  Ft.pop(), Ze = Ft[Ft.length - 1] || null;
}
let dr = 1;
function ho(e, t = !1) {
  dr += e, e < 0 && Ze && t && (Ze.hasOnce = !0);
}
function lu(e) {
  return e.dynamicChildren = dr > 0 ? Ze || mn : null, Zi(), dr > 0 && Ze && Ze.push(e), e;
}
function L(e, t, n, r, o, i) {
  return lu(
    z(
      e,
      t,
      n,
      r,
      o,
      i,
      !0
    )
  );
}
function Le(e, t, n, r, o) {
  return lu(
    G(
      e,
      t,
      n,
      r,
      o,
      !0
    )
  );
}
function fr(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function gn(e, t) {
  return e.type === t.type && e.key === t.key;
}
const au = ({ key: e }) => e ?? null, Xr = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? Ie(e) || /* @__PURE__ */ Ee(e) || ee(e) ? { i: Fe, r: e, k: t, f: !!n } : e : null);
function z(e, t = null, n = null, r = 0, o = null, i = e === pe ? 0 : 1, s = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && au(t),
    ref: t && Xr(t),
    scopeId: Ta,
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
    shapeFlag: i,
    patchFlag: r,
    dynamicProps: o,
    dynamicChildren: null,
    appContext: null,
    ctx: Fe
  };
  return l ? (go(a, n), i & 128 && e.normalize(a)) : n && (a.shapeFlag |= Ie(n) ? 8 : 16), dr > 0 && // avoid a block node from tracking itself
  !s && // has current parent block
  Ze && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Ze.push(a), a;
}
const G = Uf;
function Uf(e, t = null, n = null, r = 0, o = null, i = !1) {
  if ((!e || e === Ba) && (e = Re), fr(e)) {
    const l = tn(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && go(l, n), dr > 0 && !i && Ze && (l.shapeFlag & 6 ? Ze[Ze.indexOf(e)] = l : Ze.push(l)), l.patchFlag = -2, l;
  }
  if (tp(e) && (e = e.__vccOpts), t) {
    t = Wf(t);
    let { class: l, style: a } = t;
    l && !Ie(l) && (t.class = ot(l)), me(a) && (/* @__PURE__ */ To(a) && !Z(a) && (a = Ae({}, a)), t.style = wn(a));
  }
  const s = Ie(e) ? 1 : su(e) ? 128 : Lo(e) ? 64 : me(e) ? 4 : ee(e) ? 2 : 0;
  return z(
    e,
    t,
    n,
    r,
    o,
    s,
    i,
    !0
  );
}
function Wf(e) {
  return e ? /* @__PURE__ */ To(e) || Qa(e) ? Ae({}, e) : e : null;
}
function tn(e, t, n = !1, r = !1) {
  const { props: o, ref: i, patchFlag: s, children: l, transition: a } = e, c = t ? K(o || {}, t) : o, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && au(c),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? Z(i) ? i.concat(Xr(t)) : [i, Xr(t)] : Xr(t)
    ) : i,
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
    patchFlag: t && e.type !== pe ? s === -1 ? 16 : s | 16 : s,
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
    ssContent: e.ssContent && tn(e.ssContent),
    ssFallback: e.ssFallback && tn(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return a && r && cr(
    u,
    a.clone(u)
  ), u;
}
function Nn(e = " ", t = 0) {
  return G(jo, null, e, t);
}
function ae(e = "", t = !1) {
  return t ? (x(), Le(Re, null, e)) : G(Re, null, e);
}
function wt(e) {
  return e == null || typeof e == "boolean" ? G(Re) : Z(e) ? G(
    pe,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : fr(e) ? Mt(e) : G(jo, null, String(e));
}
function Mt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : tn(e);
}
function go(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null)
    t = null;
  else if (Z(t))
    n = 16;
  else if (typeof t == "object")
    if (r & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), go(e, o()), o._c && (o._d = !0));
      return;
    } else {
      n = 32;
      const o = t._;
      !o && !Qa(t) ? t._ctx = Fe : o === 3 && Fe && (Fe.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (ee(t)) {
    if (r & 65) {
      go(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Fe }, n = 32;
  } else
    t = String(t), r & 64 ? (n = 16, t = [Nn(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function K(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (const o in r)
      if (o === "class")
        t.class !== r.class && (t.class = ot([t.class, r.class]));
      else if (o === "style")
        t.style = wn([t.style, r.style]);
      else if (wo(o)) {
        const i = t[o], s = r[o];
        s && i !== s && !(Z(i) && i.includes(s)) ? t[o] = i ? [].concat(i, s) : s : s == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !_o(o) && (t[o] = s);
      } else o !== "" && (t[o] = r[o]);
  }
  return t;
}
function bt(e, t, n, r = null) {
  lt(e, t, 7, [
    n,
    r
  ]);
}
const qf = qa();
let Gf = 0;
function Jf(e, t, n) {
  const r = e.type, o = (t ? t.appContext : e.appContext) || qf, i = {
    uid: Gf++,
    vnode: e,
    type: r,
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
    scope: new pd(
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
    propsOptions: eu(r, o),
    emitsOptions: Ga(r, o),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Ce,
    // inheritAttrs
    inheritAttrs: r.inheritAttrs,
    // state
    ctx: Ce,
    data: Ce,
    props: Ce,
    attrs: Ce,
    slots: Ce,
    refs: Ce,
    setupState: Ce,
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
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = kf.bind(null, i), e.ce && e.ce(i), i;
}
let ze = null;
const pr = () => ze || Fe;
let mo, hr;
{
  const e = Oo(), t = (n, r) => {
    let o;
    return (o = e[n]) || (o = e[n] = []), o.push(r), (i) => {
      o.length > 1 ? o.forEach((s) => s(i)) : o[0](i);
    };
  };
  mo = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ze = n
  ), hr = t(
    "__VUE_SSR_SETTERS__",
    (n) => gr = n
  );
}
const Nr = (e) => {
  const t = ze;
  return mo(e), e.scope.on(), () => {
    e.scope.off(), mo(t);
  };
}, Ms = () => {
  ze && ze.scope.off(), mo(null);
};
function uu(e) {
  return e.vnode.shapeFlag & 4;
}
let gr = !1;
function Yf(e, t = !1, n = !1) {
  t && hr(t);
  const { props: r, children: o } = e.vnode, i = uu(e);
  Mf(e, r, i, t), Vf(e, o, n || t);
  const s = i ? Zf(e, t) : void 0;
  return t && hr(!1), s;
}
function Zf(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, yf);
  const { setup: r } = n;
  if (r) {
    Rt();
    const o = e.setupContext = r.length > 1 ? Xf(e) : null, i = Nr(e), s = Mr(
      r,
      e,
      0,
      [
        e.props,
        o
      ]
    ), l = ta(s);
    if (zt(), i(), (l || e.sp) && !Mn(e) && Da(e), l) {
      if (s.then(Ms, Ms), t)
        return s.then((a) => {
          hr(!0);
          try {
            js(e, a, t);
          } finally {
            hr(!1);
          }
        }).catch((a) => {
          Po(a, e, 0);
        });
      e.asyncDep = s;
    } else
      js(e, s);
  } else
    cu(e);
}
function js(e, t, n) {
  ee(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : me(t) && (e.setupState = $a(t)), cu(e);
}
function cu(e, t, n) {
  const r = e.type;
  e.render || (e.render = r.render || Ct);
  {
    const o = Nr(e);
    Rt();
    try {
      Sf(e);
    } finally {
      zt(), o();
    }
  }
}
const Qf = {
  get(e, t) {
    return De(e, "get", ""), e[t];
  }
};
function Xf(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Qf),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function No(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy($a(Md(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in ir)
        return ir[n](e);
    },
    has(t, n) {
      return n in t || n in ir;
    }
  })) : e.proxy;
}
function ep(e, t = !0) {
  return ee(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function tp(e) {
  return ee(e) && "__vccOpts" in e;
}
const ye = (e, t) => /* @__PURE__ */ Bd(e, t, gr);
function np(e, t, n) {
  try {
    ho(-1);
    const r = arguments.length;
    return r === 2 ? me(t) && !Z(t) ? fr(t) ? G(e, null, [t]) : G(e, t) : G(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && fr(n) && (n = [n]), G(e, t, n));
  } finally {
    ho(1);
  }
}
const rp = "3.5.43";
let Si;
const Ns = typeof window < "u" && window.trustedTypes;
if (Ns)
  try {
    Si = /* @__PURE__ */ Ns.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const du = Si ? (e) => Si.createHTML(e) : (e) => e, op = "http://www.w3.org/2000/svg", ip = "http://www.w3.org/1998/Math/MathML", Et = typeof document < "u" ? document : null, Fs = Et && /* @__PURE__ */ Et.createElement("template"), sp = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, r) => {
    const o = t === "svg" ? Et.createElementNS(op, e) : t === "mathml" ? Et.createElementNS(ip, e) : n ? Et.createElement(e, { is: n }) : Et.createElement(e);
    return e === "select" && r && r.multiple != null && o.setAttribute("multiple", r.multiple), o;
  },
  createText: (e) => Et.createTextNode(e),
  createComment: (e) => Et.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Et.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, r, o, i) {
    const s = n ? n.previousSibling : t.lastChild;
    if (o && (o === i || o.nextSibling))
      for (; t.insertBefore(o.cloneNode(!0), n), !(o === i || !(o = o.nextSibling)); )
        ;
    else {
      Fs.innerHTML = du(
        r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Fs.content;
      if (r === "svg" || r === "mathml") {
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
}, Ut = "transition", Wn = "animation", mr = /* @__PURE__ */ Symbol("_vtc"), fu = {
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
}, lp = /* @__PURE__ */ Ae(
  {},
  Ma,
  fu
), ap = (e) => (e.displayName = "Transition", e.props = lp, e), up = /* @__PURE__ */ ap(
  (e, { slots: t }) => np(of, cp(e), t)
), an = (e, t = []) => {
  Z(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Vs = (e) => e ? Z(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function cp(e) {
  const t = {};
  for (const E in e)
    E in fu || (t[E] = e[E]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: r,
    duration: o,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: s = `${n}-enter-active`,
    enterToClass: l = `${n}-enter-to`,
    appearFromClass: a = i,
    appearActiveClass: c = s,
    appearToClass: u = l,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: f = `${n}-leave-active`,
    leaveToClass: h = `${n}-leave-to`
  } = e, b = dp(o), y = b && b[0], S = b && b[1], {
    onBeforeEnter: v,
    onEnter: w,
    onEnterCancelled: T,
    onLeave: m,
    onLeaveCancelled: $,
    onBeforeAppear: M = v,
    onAppear: P = w,
    onAppearCancelled: B = T
  } = t, V = (E, Y, te, he) => {
    E._enterCancelled = he, un(E, Y ? u : l), un(E, Y ? c : s), te && te();
  }, q = (E, Y) => {
    E._isLeaving = !1, un(E, d), un(E, h), un(E, f), Y && Y();
  }, U = (E) => (Y, te) => {
    const he = E ? P : w, ie = () => V(Y, E, te);
    an(he, [Y, ie]), Ds(() => {
      un(Y, E ? a : i), Lt(Y, E ? u : l), Vs(he) || Rs(Y, r, y, ie);
    });
  };
  return Ae(t, {
    onBeforeEnter(E) {
      an(v, [E]), Lt(E, i), Lt(E, s);
    },
    onBeforeAppear(E) {
      an(M, [E]), Lt(E, a), Lt(E, c);
    },
    onEnter: U(!1),
    onAppear: U(!0),
    onLeave(E, Y) {
      E._isLeaving = !0;
      const te = () => q(E, Y);
      Lt(E, d), E._enterCancelled ? (Lt(E, f), Hs(E)) : (Hs(E), Lt(E, f)), Ds(() => {
        E._isLeaving && (un(E, d), Lt(E, h), Vs(m) || Rs(E, r, S, te));
      }), an(m, [E, te]);
    },
    onEnterCancelled(E) {
      V(E, !1, void 0, !0), an(T, [E]);
    },
    onAppearCancelled(E) {
      V(E, !0, void 0, !0), an(B, [E]);
    },
    onLeaveCancelled(E) {
      q(E), an($, [E]);
    }
  });
}
function dp(e) {
  if (e == null)
    return null;
  if (me(e))
    return [ei(e.enter), ei(e.leave)];
  {
    const t = ei(e);
    return [t, t];
  }
}
function ei(e) {
  return rd(e);
}
function Lt(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[mr] || (e[mr] = /* @__PURE__ */ new Set())).add(t);
}
function un(e, t) {
  t.split(/\s+/).forEach((r) => r && e.classList.remove(r));
  const n = e[mr];
  n && (n.delete(t), n.size || (e[mr] = void 0));
}
function Ds(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let fp = 0;
function Rs(e, t, n, r) {
  const o = e._endId = ++fp, i = () => {
    o === e._endId && r();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: s, timeout: l, propCount: a } = pp(e, t);
  if (!s)
    return r();
  const c = s + "end";
  let u = 0;
  const d = () => {
    e.removeEventListener(c, f), i();
  }, f = (h) => {
    h.target === e && ++u >= a && d();
  };
  setTimeout(() => {
    u < a && d();
  }, l + 1), e.addEventListener(c, f);
}
function pp(e, t) {
  const n = window.getComputedStyle(e), r = (b) => (n[b] || "").split(", "), o = r(`${Ut}Delay`), i = r(`${Ut}Duration`), s = zs(o, i), l = r(`${Wn}Delay`), a = r(`${Wn}Duration`), c = zs(l, a);
  let u = null, d = 0, f = 0;
  t === Ut ? s > 0 && (u = Ut, d = s, f = i.length) : t === Wn ? c > 0 && (u = Wn, d = c, f = a.length) : (d = Math.max(s, c), u = d > 0 ? s > c ? Ut : Wn : null, f = u ? u === Ut ? i.length : a.length : 0);
  const h = u === Ut && /\b(?:transform|all)(?:,|$)/.test(
    r(`${Ut}Property`).toString()
  );
  return {
    type: u,
    timeout: d,
    propCount: f,
    hasTransform: h
  };
}
function zs(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, r) => Bs(n) + Bs(e[r])));
}
function Bs(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Hs(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function hp(e, t, n) {
  const r = e[mr];
  r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Ks = /* @__PURE__ */ Symbol("_vod"), gp = /* @__PURE__ */ Symbol("_vsh"), mp = /* @__PURE__ */ Symbol(""), bp = /(?:^|;)\s*display\s*:/;
function vp(e, t, n) {
  const r = e.style, o = Ie(n);
  let i = !1;
  if (n && !o) {
    if (t)
      if (Ie(t))
        for (const s of t.split(";")) {
          const l = s.slice(0, s.indexOf(":")).trim();
          n[l] == null && Qn(r, l, "");
        }
      else
        for (const s in t)
          n[s] == null && Qn(r, s, "");
    for (const s in n) {
      s === "display" && (i = !0);
      const l = n[s];
      l != null ? Sp(
        e,
        s,
        !Ie(t) && t ? t[s] : void 0,
        l
      ) || Qn(r, s, l) : Qn(r, s, "");
    }
  } else if (o) {
    if (t !== n) {
      const s = r[mp];
      s && (n += ";" + s), r.cssText = n, i = bp.test(n);
    }
  } else t && e.removeAttribute("style");
  Ks in e && (e[Ks] = i ? r.display : "", e[gp] && (r.display = "none"));
}
const qr = /\s*!important$/;
function Qn(e, t, n) {
  if (Z(n))
    n.forEach((r) => Qn(e, t, r));
  else if (n == null && (n = ""), t.startsWith("--"))
    qr.test(n) ? e.setProperty(t, n.replace(qr, ""), "important") : e.setProperty(t, n);
  else {
    const r = yp(e, t);
    qr.test(n) ? e.setProperty(
      xn(r),
      n.replace(qr, ""),
      "important"
    ) : e[r] = n;
  }
}
const Us = ["Webkit", "Moz", "ms"], ti = {};
function yp(e, t) {
  const n = ti[t];
  if (n)
    return n;
  let r = Ue(t);
  if (r !== "filter" && r in e)
    return ti[t] = r;
  r = Co(r);
  for (let o = 0; o < Us.length; o++) {
    const i = Us[o] + r;
    if (i in e)
      return ti[t] = i;
  }
  return t;
}
function Sp(e, t, n, r) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && Ie(r) && n === r;
}
const Ws = "http://www.w3.org/1999/xlink";
function qs(e, t, n, r, o, i = cd(t)) {
  r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ws, t.slice(6, t.length)) : e.setAttributeNS(Ws, t, n) : n == null || i && !ia(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : Xe(n) ? String(n) : n
  );
}
function Gs(e, t, n, r, o) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? du(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const l = i === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
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
    l === "boolean" ? n = ia(n) : n == null && l === "string" ? (n = "", s = !0) : l === "number" && (n = 0, s = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  s && e.removeAttribute(o || t);
}
function wp(e, t, n, r) {
  e.addEventListener(t, n, r);
}
function _p(e, t, n, r) {
  e.removeEventListener(t, n, r);
}
const Js = /* @__PURE__ */ Symbol("_vei");
function $p(e, t, n, r, o = null) {
  const i = e[Js] || (e[Js] = {}), s = i[t];
  if (r && s)
    s.value = r;
  else {
    const [l, a] = Op(t);
    if (r) {
      const c = i[t] = Tp(
        r,
        o
      );
      wp(e, l, c, a);
    } else s && (_p(e, l, s, a), i[t] = void 0);
  }
}
const xp = /(Once|Passive|Capture)$/, Cp = /^on:?(?:Once|Passive|Capture)$/;
function Op(e) {
  let t, n;
  for (; (n = e.match(xp)) && !Cp.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : xn(e.slice(2)), t];
}
let ni = 0;
const Ip = /* @__PURE__ */ Promise.resolve(), kp = () => ni || (Ip.then(() => ni = 0), ni = Date.now());
function Tp(e, t) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    const o = n.value;
    if (Z(o)) {
      const i = r.stopImmediatePropagation;
      r.stopImmediatePropagation = () => {
        i.call(r), r._stopped = !0;
      };
      const s = o.slice(), l = [r];
      for (let a = 0; a < s.length && !r._stopped; a++) {
        const c = s[a];
        c && lt(
          c,
          t,
          5,
          l
        );
      }
    } else
      lt(
        o,
        t,
        5,
        [r]
      );
  };
  return n.value = e, n.attached = kp(), n;
}
const Ys = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Pp = (e, t, n, r, o, i) => {
  const s = o === "svg";
  t === "class" ? hp(e, r, s) : t === "style" ? vp(e, n, r) : wo(t) ? _o(t) || $p(e, t, n, r, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Lp(e, t, r, s)) ? (Gs(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && qs(e, t, r, s, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Ep(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !Ie(r))) ? Gs(e, Ue(t), r, i, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), qs(e, t, r, s));
};
function Lp(e, t, n, r) {
  if (r)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Ys(t) && ee(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return Ys(t) && Ie(n) ? !1 : t in e;
}
function Ep(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const r = Ue(t);
  return Array.isArray(n) ? n.some((o) => Ue(o) === r) : Object.keys(n).some((o) => Ue(o) === r);
}
const Ap = ["ctrl", "shift", "alt", "meta"], Mp = {
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
  exact: (e, t) => Ap.some((n) => e[`${n}Key`] && !t.includes(n))
}, br = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), r = t.join(".");
  return n[r] || (n[r] = ((o, ...i) => {
    for (let s = 0; s < t.length; s++) {
      const l = Mp[t[s]];
      if (l && l(o, t)) return;
    }
    return e(o, ...i);
  }));
}, jp = /* @__PURE__ */ Ae({ patchProp: Pp }, sp);
let Zs;
function Np() {
  return Zs || (Zs = Rf(jp));
}
const Fp = ((...e) => {
  const t = Np().createApp(...e), { mount: n } = t;
  return t.mount = (r) => {
    const o = Dp(r);
    if (!o) return;
    const i = t._component;
    !ee(i) && !i.render && !i.template && (i.template = o.innerHTML), o.nodeType === 1 && (o.textContent = "");
    const s = n(o, !1, Vp(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), s;
  }, t;
});
function Vp(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Dp(e) {
  return Ie(e) ? document.querySelector(e) : e;
}
function vr(e) {
  "@babel/helpers - typeof";
  return vr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, vr(e);
}
function Qs(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Xs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qs(Object(n), !0).forEach(function(r) {
      Rp(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qs(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Rp(e, t, n) {
  return (t = zp(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function zp(e) {
  var t = Bp(e, "string");
  return vr(t) == "symbol" ? t : t + "";
}
function Bp(e, t) {
  if (vr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (vr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Hp(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  pr() && pr().components ? Cn(e) : t ? e() : Ca(e);
}
var Kp = 0;
function Up(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = /* @__PURE__ */ Te(!1), r = /* @__PURE__ */ Te(e), o = /* @__PURE__ */ Te(null), i = Wl() ? window.document : void 0, s = t.document, l = s === void 0 ? i : s, a = t.immediate, c = a === void 0 ? !0 : a, u = t.manual, d = u === void 0 ? !1 : u, f = t.name, h = f === void 0 ? "style_".concat(++Kp) : f, b = t.id, y = b === void 0 ? void 0 : b, S = t.media, v = S === void 0 ? void 0 : S, w = t.nonce, T = w === void 0 ? void 0 : w, m = t.first, $ = m === void 0 ? !1 : m, M = t.onMounted, P = M === void 0 ? void 0 : M, B = t.onUpdated, V = B === void 0 ? void 0 : B, q = t.onLoad, U = q === void 0 ? void 0 : q, E = t.props, Y = E === void 0 ? {} : E, te = function() {
  }, he = function(se) {
    var R = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var H = Xs(Xs({}, Y), R), Q = H.name || h, Se = H.id || y, rn = H.nonce || T;
      o.value = l.querySelector('style[data-primevue-style-id="'.concat(Q, '"]')) || l.getElementById(Se) || l.createElement("style"), o.value.isConnected || (r.value = se || e, to(o.value, {
        type: "text/css",
        id: Se,
        media: v,
        nonce: rn
      }), $ ? l.head.prepend(o.value) : l.head.appendChild(o.value), Nc(o.value, "data-primevue-style-id", Q), to(o.value, H), o.value.onload = function(Ht) {
        return U?.(Ht, {
          name: Q
        });
      }, P?.(Q)), !n.value && (te = qe(r, function(Ht) {
        o.value.textContent = Ht, V?.(Q);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, ie = function() {
    !l || !n.value || (te(), Cc(o.value) && l.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return c && !d && Hp(he), {
    id: y,
    name: h,
    el: o,
    css: r,
    unload: ie,
    load: he,
    isLoaded: /* @__PURE__ */ so(n)
  };
}
function yr(e) {
  "@babel/helpers - typeof";
  return yr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, yr(e);
}
var el, tl, nl, rl;
function ol(e, t) {
  return Jp(e) || Gp(e, t) || qp(e, t) || Wp();
}
function Wp() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qp(e, t) {
  if (e) {
    if (typeof e == "string") return il(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? il(e, t) : void 0;
  }
}
function il(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Gp(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, i, s, l = [], a = !0, c = !1;
    try {
      if (i = (n = n.call(e)).next, t !== 0) for (; !(a = (r = i.call(n)).done) && (l.push(r.value), l.length !== t); a = !0) ;
    } catch (u) {
      c = !0, o = u;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return l;
  }
}
function Jp(e) {
  if (Array.isArray(e)) return e;
}
function sl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function ri(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? sl(Object(n), !0).forEach(function(r) {
      Yp(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : sl(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Yp(e, t, n) {
  return (t = Zp(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Zp(e) {
  var t = Qp(e, "string");
  return yr(t) == "symbol" ? t : t + "";
}
function Qp(e, t) {
  if (yr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (yr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Gr(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Xp = function(t) {
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
}, eh = {}, th = {}, ve = {
  name: "base",
  css: Xp,
  style: Zc,
  classes: eh,
  inlineStyles: th,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(i) {
      return i;
    }, o = r(Br(el || (el = Gr(["", ""])), t));
    return de(o) ? Up(er(o), ri({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return $e.transformCSS(n.name || t.name, "".concat(o).concat(Br(tl || (tl = Gr(["", ""])), r)));
    });
  },
  getCommonTheme: function(t) {
    return $e.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return $e.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return $e.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, r) {
    return $e.getCustomPreset(this.name, t, n, r);
  },
  getLayerOrderThemeCSS: function() {
    return $e.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var r = Ye(this.css, {
        dt: yn
      }) || "", o = er(Br(nl || (nl = Gr(["", "", ""])), r, t)), i = Object.entries(n).reduce(function(s, l) {
        var a = ol(l, 2), c = a[0], u = a[1];
        return s.push("".concat(c, '="').concat(u, '"')) && s;
      }, []).join(" ");
      return de(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(i, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return $e.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = [$e.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), i = Br(rl || (rl = Gr(["", ""])), Ye(this.style, {
        dt: yn
      })), s = er($e.transformCSS(o, i)), l = Object.entries(n).reduce(function(a, c) {
        var u = ol(c, 2), d = u[0], f = u[1];
        return a.push("".concat(d, '="').concat(f, '"')) && a;
      }, []).join(" ");
      de(s) && r.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(l, ">").concat(s, "</style>"));
    }
    return r.join("");
  },
  extend: function(t) {
    return ri(ri({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, Yt = ji();
function Sr(e) {
  "@babel/helpers - typeof";
  return Sr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Sr(e);
}
function ll(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Jr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ll(Object(n), !0).forEach(function(r) {
      nh(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ll(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function nh(e, t, n) {
  return (t = rh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function rh(e) {
  var t = oh(e, "string");
  return Sr(t) == "symbol" ? t : t + "";
}
function oh(e, t) {
  if (Sr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Sr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ih = {
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
    text: [Ve.STARTS_WITH, Ve.CONTAINS, Ve.NOT_CONTAINS, Ve.ENDS_WITH, Ve.EQUALS, Ve.NOT_EQUALS],
    numeric: [Ve.EQUALS, Ve.NOT_EQUALS, Ve.LESS_THAN, Ve.LESS_THAN_OR_EQUAL_TO, Ve.GREATER_THAN, Ve.GREATER_THAN_OR_EQUAL_TO],
    date: [Ve.DATE_IS, Ve.DATE_IS_NOT, Ve.DATE_BEFORE, Ve.DATE_AFTER]
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
}, sh = /* @__PURE__ */ Symbol();
function lh(e, t) {
  var n = {
    config: /* @__PURE__ */ nn(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(sh, n), ah(), uh(e, n), n;
}
var En = [];
function ah() {
  Ne.clear(), En.forEach(function(e) {
    return e?.();
  }), En = [];
}
function uh(e, t) {
  var n = /* @__PURE__ */ Te(!1), r = function() {
    var c;
    if (((c = t.config) === null || c === void 0 ? void 0 : c.theme) !== "none" && !$e.isStyleNameLoaded("common")) {
      var u, d, f = ((u = ve.getCommonTheme) === null || u === void 0 ? void 0 : u.call(ve)) || {}, h = f.primitive, b = f.semantic, y = f.global, S = f.style, v = {
        nonce: (d = t.config) === null || d === void 0 || (d = d.csp) === null || d === void 0 ? void 0 : d.nonce
      };
      ve.load(h?.css, Jr({
        name: "primitive-variables"
      }, v)), ve.load(b?.css, Jr({
        name: "semantic-variables"
      }, v)), ve.load(y?.css, Jr({
        name: "global-variables"
      }, v)), ve.loadStyle(Jr({
        name: "global-style"
      }, v), S), $e.setLoadedStyleName("common");
    }
  };
  Ne.on("theme:change", function(a) {
    n.value || (e.config.globalProperties.$primevue.config.theme = a, n.value = !0);
  });
  var o = qe(t.config, function(a, c) {
    Yt.emit("config:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), i = qe(function() {
    return t.config.ripple;
  }, function(a, c) {
    Yt.emit("config:ripple:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = qe(function() {
    return t.config.theme;
  }, function(a, c) {
    n.value || $e.setTheme(a), t.config.unstyled || r(), n.value = !1, Yt.emit("config:theme:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = qe(function() {
    return t.config.unstyled;
  }, function(a, c) {
    !a && t.config.theme && r(), Yt.emit("config:unstyled:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  });
  En.push(o), En.push(i), En.push(s), En.push(l);
}
var ch = {
  install: function(t, n) {
    var r = gc(ih, n);
    lh(t, r);
  }
};
const dh = {
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
function Fr(e, t, n = {}) {
  const r = Fp(t, n);
  return r.use(ch, { unstyled: !0, pt: dh }), { instance: r.mount(e), unmount: () => r.unmount() };
}
var Gt = {
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
function fh() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = sf();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var al = ve.extend({
  name: "common"
});
function wr(e) {
  "@babel/helpers - typeof";
  return wr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, wr(e);
}
function ph(e) {
  return gu(e) || hh(e) || hu(e) || pu();
}
function hh(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function qn(e, t) {
  return gu(e) || gh(e, t) || hu(e, t) || pu();
}
function pu() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function hu(e, t) {
  if (e) {
    if (typeof e == "string") return wi(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? wi(e, t) : void 0;
  }
}
function wi(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function gh(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, i, s, l = [], a = !0, c = !1;
    try {
      if (i = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        a = !1;
      } else for (; !(a = (r = i.call(n)).done) && (l.push(r.value), l.length !== t); a = !0) ;
    } catch (u) {
      c = !0, o = u;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return l;
  }
}
function gu(e) {
  if (Array.isArray(e)) return e;
}
function ul(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function le(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ul(Object(n), !0).forEach(function(r) {
      Xn(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ul(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Xn(e, t, n) {
  return (t = mh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function mh(e) {
  var t = bh(e, "string");
  return wr(t) == "symbol" ? t : t + "";
}
function bh(e, t) {
  if (wr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (wr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var On = {
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
        Ne.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var r = this;
        Ne.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return r._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, r, o, i, s, l, a, c, u, d, f = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, h = f ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, b = f ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (o = b || h) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (i = o.onBeforeCreate) === null || i === void 0 || i.call(o);
    var y = (s = this.$primevueConfig) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s._usept, S = y ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, v = y ? (a = this.$primevue) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a.value : (c = this.$primevue) === null || c === void 0 || (c = c.config) === null || c === void 0 ? void 0 : c.pt;
    (u = v || S) === null || u === void 0 || (u = u[this.$.type.name]) === null || u === void 0 || (u = u.hooks) === null || u === void 0 || (d = u.onBeforeCreate) === null || d === void 0 || d.call(u), this.$attrSelector = fh(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = So(Dn(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = le({
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
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), r = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), r?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return yo(t) ? t.apply(void 0, r) : K.apply(void 0, r);
    },
    _load: function() {
      Gt.isStyleNameLoaded("base") || (ve.loadCSS(this.$styleOptions), this._loadGlobalStyles(), Gt.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !Gt.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (al.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), Gt.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      de(t) && ve.load(t, le({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!$e.isStyleNameLoaded("common")) {
          var r, o, i = ((r = this.$style) === null || r === void 0 || (o = r.getCommonTheme) === null || o === void 0 ? void 0 : o.call(r)) || {}, s = i.primitive, l = i.semantic, a = i.global, c = i.style;
          ve.load(s?.css, le({
            name: "primitive-variables"
          }, this.$styleOptions)), ve.load(l?.css, le({
            name: "semantic-variables"
          }, this.$styleOptions)), ve.load(a?.css, le({
            name: "global-variables"
          }, this.$styleOptions)), ve.loadStyle(le({
            name: "global-style"
          }, this.$styleOptions), c), $e.setLoadedStyleName("common");
        }
        if (!$e.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var u, d, f, h, b = ((u = this.$style) === null || u === void 0 || (d = u.getComponentTheme) === null || d === void 0 ? void 0 : d.call(u)) || {}, y = b.css, S = b.style;
          (f = this.$style) === null || f === void 0 || f.load(y, le({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (h = this.$style) === null || h === void 0 || h.loadStyle(le({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), S), $e.setLoadedStyleName(this.$style.name);
        }
        if (!$e.isStyleNameLoaded("layer-order")) {
          var v, w, T = (v = this.$style) === null || v === void 0 || (w = v.getLayerOrderThemeCSS) === null || w === void 0 ? void 0 : w.call(v);
          ve.load(T, le({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), $e.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, r, o, i = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, s = i.css, l = (o = this.$style) === null || o === void 0 ? void 0 : o.load(s, le({
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
      Gt.clearLoadedStyleNames(), Ne.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      Ne.off("theme:change", this._loadCoreStyles), Ne.off("theme:change", this._load), Ne.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return Mi(t, n, r);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, s = /./g.test(r) && !!o[r.split(".")[0]], l = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, a = l.mergeSections, c = a === void 0 ? !0 : a, u = l.mergeProps, d = u === void 0 ? !1 : u, f = i ? s ? this._useGlobalPT(this._getPTClassValue, r, o) : this._useDefaultPT(this._getPTClassValue, r, o) : void 0, h = s ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, le(le({}, o), {}, {
        global: f || {}
      })), b = this._getPTDatasets(r);
      return c || !c && h ? d ? this._mergeProps(d, f, h, b) : le(le(le({}, f), h), b) : le(le({}, h), b);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return K(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", i = r === "root" && de((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return r !== "transition" && le(le({}, r === "root" && le(le(Xn({}, "".concat(o, "name"), _t(i ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), i && Xn({}, "".concat(o, "extend"), _t(this.$.type.name))), {}, Xn({}, "".concat(this.$attrSelector), ""))), {}, Xn({}, "".concat(o, "section"), _t(r)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return Ge(t) || Dl(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, i = function(l) {
        var a, c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, u = o ? o(l) : l, d = _t(r), f = _t(n.$name);
        return (a = c ? d !== f ? u?.[d] : void 0 : u?.[d]) !== null && a !== void 0 ? a : u;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: i(t.originalValue),
        value: i(t.value)
      } : i(t, !0);
    },
    _usePT: function(t, n, r, o) {
      var i = function(y) {
        return n(y, r, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var s, l = t._usept || ((s = this.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, a = l.mergeSections, c = a === void 0 ? !0 : a, u = l.mergeProps, d = u === void 0 ? !1 : u, f = i(t.originalValue), h = i(t.value);
        return f === void 0 && h === void 0 ? void 0 : Ge(h) ? h : Ge(f) ? f : c || !c && h ? d ? this._mergeProps(d, f, h) : le(le({}, f), h) : h;
      }
      return i(t);
    },
    _useGlobalPT: function(t, n, r) {
      return this._usePT(this.globalPT, t, n, r);
    },
    _useDefaultPT: function(t, n, r) {
      return this._usePT(this.defaultPT, t, n, r);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, le(le({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = K(this.$_attrsWithoutPT, this.ptm(n, r));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, le({
        instance: this
      }, r), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, le(le({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, le(le({}, this.$params), r)), i = this._getOptionValue(al.inlineStyles, t, le(le({}, this.$params), r));
        return [i, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return Ye(r, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return n._getOptionValue(r, n.$name, le({}, n.$params)) || Ye(r, le({}, n.$params));
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
      return Object.fromEntries(Object.entries(this.$props).filter(function(r) {
        var o = qn(r, 1), i = o[0];
        return n?.includes(i);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return le(le({
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
        var n = qn(t, 1), r = n[0];
        return r?.startsWith("pt:");
      }).reduce(function(t, n) {
        var r = qn(n, 2), o = r[0], i = r[1], s = o.split(":"), l = ph(s), a = wi(l).slice(1);
        return a?.reduce(function(c, u, d, f) {
          return !c[u] && (c[u] = d === f.length - 1 ? i : {}), c[u];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = qn(t, 1), r = n[0];
        return !(r != null && r.startsWith("pt:"));
      }).reduce(function(t, n) {
        var r = qn(n, 2), o = r[0], i = r[1];
        return t[o] = i, t;
      }, {});
    }
  }
}, vh = `
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
`, yh = ve.extend({
  name: "baseicon",
  css: vh
});
function _r(e) {
  "@babel/helpers - typeof";
  return _r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _r(e);
}
function cl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function dl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? cl(Object(n), !0).forEach(function(r) {
      Sh(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : cl(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Sh(e, t, n) {
  return (t = wh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function wh(e) {
  var t = _h(e, "string");
  return _r(t) == "symbol" ? t : t + "";
}
function _h(e, t) {
  if (_r(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (_r(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Rn = {
  name: "BaseIcon",
  extends: On,
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
  style: yh,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = $n(this.label);
      return dl(dl({}, !this.isUnstyled && {
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
  extends: Rn
};
function $h(e) {
  return Ih(e) || Oh(e) || Ch(e) || xh();
}
function xh() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ch(e, t) {
  if (e) {
    if (typeof e == "string") return _i(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _i(e, t) : void 0;
  }
}
function Oh(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ih(e) {
  if (Array.isArray(e)) return _i(e);
}
function _i(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function kh(e, t, n, r, o, i) {
  return x(), L("svg", K({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), $h(t[0] || (t[0] = [z("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Fo.render = kh;
var Th = `
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
`, Ph = {
  root: function(t) {
    var n = t.props, r = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": de(n.value) && String(n.value).length === 1,
      "p-badge-dot": $n(n.value) && !r.$slots.default,
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
}, Lh = ve.extend({
  name: "badge",
  style: Th,
  classes: Ph
}), Eh = {
  name: "BaseBadge",
  extends: On,
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
  style: Lh,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function $r(e) {
  "@babel/helpers - typeof";
  return $r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $r(e);
}
function fl(e, t, n) {
  return (t = Ah(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ah(e) {
  var t = Mh(e, "string");
  return $r(t) == "symbol" ? t : t + "";
}
function Mh(e, t) {
  if ($r(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if ($r(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var mu = {
  name: "Badge",
  extends: Eh,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return ft(fl(fl({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, jh = ["data-p"];
function Nh(e, t, n, r, o, i) {
  return x(), L("span", K({
    class: e.cx("root"),
    "data-p": i.dataP
  }, e.ptmi("root")), [_e(e.$slots, "default", {}, function() {
    return [Nn(oe(e.value), 1)];
  })], 16, jh);
}
mu.render = Nh;
function xr(e) {
  "@babel/helpers - typeof";
  return xr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, xr(e);
}
function pl(e, t) {
  return Rh(e) || Dh(e, t) || Vh(e, t) || Fh();
}
function Fh() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Vh(e, t) {
  if (e) {
    if (typeof e == "string") return hl(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? hl(e, t) : void 0;
  }
}
function hl(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Dh(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, i, s, l = [], a = !0, c = !1;
    try {
      if (i = (n = n.call(e)).next, t !== 0) for (; !(a = (r = i.call(n)).done) && (l.push(r.value), l.length !== t); a = !0) ;
    } catch (u) {
      c = !0, o = u;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return l;
  }
}
function Rh(e) {
  if (Array.isArray(e)) return e;
}
function gl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function ce(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? gl(Object(n), !0).forEach(function(r) {
      $i(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : gl(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function $i(e, t, n) {
  return (t = zh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function zh(e) {
  var t = Bh(e, "string");
  return xr(t) == "symbol" ? t : t + "";
}
function Bh(e, t) {
  if (xr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (xr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ne = {
  _getMeta: function() {
    return [xt(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], Ye(xt(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var r, o, i;
    return (r = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (i = n.ctx) === null || i === void 0 || (i = i.appContext) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.globalProperties) === null || i === void 0 ? void 0 : i.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: Mi,
  _getPTValue: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = function() {
      var w = ne._getOptionValue.apply(ne, arguments);
      return Ge(w) || Dl(w) ? {
        class: w
      } : w;
    }, c = ((t = r.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, u = c.mergeSections, d = u === void 0 ? !0 : u, f = c.mergeProps, h = f === void 0 ? !1 : f, b = l ? ne._useDefaultPT(r, r.defaultPT(), a, i, s) : void 0, y = ne._usePT(r, ne._getPT(o, r.$name), a, i, ce(ce({}, s), {}, {
      global: b || {}
    })), S = ne._getPTDatasets(r, i);
    return d || !d && y ? h ? ne._mergeProps(r, h, b, y, S) : ce(ce(ce({}, b), y), S) : ce(ce({}, y), S);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return ce(ce({}, n === "root" && $i({}, "".concat(r, "name"), _t(t.$name))), {}, $i({}, "".concat(r, "section"), _t(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(s) {
      var l, a = r ? r(s) : s, c = _t(n);
      return (l = a?.[c]) !== null && l !== void 0 ? l : a;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0, s = function(S) {
      return r(S, o, i);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var l, a = n._usept || ((l = t.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, c = a.mergeSections, u = c === void 0 ? !0 : c, d = a.mergeProps, f = d === void 0 ? !1 : d, h = s(n.originalValue), b = s(n.value);
      return h === void 0 && b === void 0 ? void 0 : Ge(b) ? b : Ge(h) ? h : u || !u && b ? f ? ne._mergeProps(t, f, h, b) : ce(ce({}, h), b) : b;
    }
    return s(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0;
    return ne._usePT(t, n, r, o, i);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, i = ne._getConfig(r, o), s = {
      nonce: i == null || (t = i.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    ne._loadCoreStyles(n, s), ne._loadThemeStyles(n, s), ne._loadScopedThemeStyles(n, s), ne._removeThemeListeners(n), n.$loadStyles = function() {
      return ne._loadThemeStyles(n, s);
    }, ne._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!Gt.isStyleNameLoaded((t = r.$style) === null || t === void 0 ? void 0 : t.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var i;
      ve.loadCSS(o), (i = r.$style) === null || i === void 0 || i.loadCSS(o), Gt.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, r, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!$e.isStyleNameLoaded("common")) {
        var s, l, a = ((s = o.$style) === null || s === void 0 || (l = s.getCommonTheme) === null || l === void 0 ? void 0 : l.call(s)) || {}, c = a.primitive, u = a.semantic, d = a.global, f = a.style;
        ve.load(c?.css, ce({
          name: "primitive-variables"
        }, i)), ve.load(u?.css, ce({
          name: "semantic-variables"
        }, i)), ve.load(d?.css, ce({
          name: "global-variables"
        }, i)), ve.loadStyle(ce({
          name: "global-style"
        }, i), f), $e.setLoadedStyleName("common");
      }
      if (!$e.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (r = o.$style) !== null && r !== void 0 && r.name) {
        var h, b, y, S, v = ((h = o.$style) === null || h === void 0 || (b = h.getDirectiveTheme) === null || b === void 0 ? void 0 : b.call(h)) || {}, w = v.css, T = v.style;
        (y = o.$style) === null || y === void 0 || y.load(w, ce({
          name: "".concat(o.$style.name, "-variables")
        }, i)), (S = o.$style) === null || S === void 0 || S.loadStyle(ce({
          name: "".concat(o.$style.name, "-style")
        }, i), T), $e.setLoadedStyleName(o.$style.name);
      }
      if (!$e.isStyleNameLoaded("layer-order")) {
        var m, $, M = (m = o.$style) === null || m === void 0 || ($ = m.getLayerOrderThemeCSS) === null || $ === void 0 ? void 0 : $.call(m);
        ve.load(M, ce({
          name: "layer-order",
          first: !0
        }, i)), $e.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = t.preset();
    if (r && t.$attrSelector) {
      var o, i, s, l = ((o = t.$style) === null || o === void 0 || (i = o.getPresetTheme) === null || i === void 0 ? void 0 : i.call(o, r, "[".concat(t.$attrSelector, "]"))) || {}, a = l.css, c = (s = t.$style) === null || s === void 0 ? void 0 : s.load(a, ce({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = c.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    Gt.clearLoadedStyleNames(), Ne.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Ne.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, r, o, i, s) {
    var l, a, c = "on".concat(mc(n)), u = ne._getConfig(o, i), d = r?.$instance, f = ne._usePT(d, ne._getPT(o == null || (l = o.value) === null || l === void 0 ? void 0 : l.pt, t), ne._getOptionValue, "hooks.".concat(c)), h = ne._useDefaultPT(d, u == null || (a = u.pt) === null || a === void 0 || (a = a.directives) === null || a === void 0 ? void 0 : a[t], ne._getOptionValue, "hooks.".concat(c)), b = {
      el: r,
      binding: o,
      vnode: i,
      prevVnode: s
    };
    f?.(d, b), h?.(d, b);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      r[o - 2] = arguments[o];
    return yo(t) ? t.apply(void 0, r) : K.apply(void 0, r);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(l, a, c, u, d) {
      var f, h, b, y;
      a._$instances = a._$instances || {};
      var S = ne._getConfig(c, u), v = a._$instances[t] || {}, w = $n(v) ? ce(ce({}, n), n?.methods) : {};
      a._$instances[t] = ce(ce({}, v), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: a,
        $binding: c,
        $modifiers: c?.modifiers,
        $value: c?.value,
        $el: v.$el || a || void 0,
        $style: ce({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: S,
        $attrSelector: (f = a.$pd) === null || f === void 0 || (f = f[t]) === null || f === void 0 ? void 0 : f.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return ne._getPT(S?.pt, void 0, function(m) {
            var $;
            return m == null || ($ = m.directives) === null || $ === void 0 ? void 0 : $[t];
          });
        },
        isUnstyled: function() {
          var m, $;
          return ((m = a._$instances[t]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.unstyled) !== void 0 ? ($ = a._$instances[t]) === null || $ === void 0 || ($ = $.$binding) === null || $ === void 0 || ($ = $.value) === null || $ === void 0 ? void 0 : $.unstyled : S?.unstyled;
        },
        theme: function() {
          var m;
          return (m = a._$instances[t]) === null || m === void 0 || (m = m.$primevueConfig) === null || m === void 0 ? void 0 : m.theme;
        },
        preset: function() {
          var m;
          return (m = a._$instances[t]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.dt;
        },
        /* instance's methods */
        ptm: function() {
          var m, $ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", M = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return ne._getPTValue(a._$instances[t], (m = a._$instances[t]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.pt, $, ce({}, M));
        },
        ptmo: function() {
          var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", M = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return ne._getPTValue(a._$instances[t], m, $, M, !1);
        },
        cx: function() {
          var m, $, M = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", P = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (m = a._$instances[t]) !== null && m !== void 0 && m.isUnstyled() ? void 0 : ne._getOptionValue(($ = a._$instances[t]) === null || $ === void 0 || ($ = $.$style) === null || $ === void 0 ? void 0 : $.classes, M, ce({}, P));
        },
        sx: function() {
          var m, $ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", M = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, P = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return M ? ne._getOptionValue((m = a._$instances[t]) === null || m === void 0 || (m = m.$style) === null || m === void 0 ? void 0 : m.inlineStyles, $, ce({}, P)) : void 0;
        }
      }, w), a.$instance = a._$instances[t], (h = (b = a.$instance)[l]) === null || h === void 0 || h.call(b, a, c, u, d), a["$".concat(t)] = a.$instance, ne._hook(t, l, a, c, u, d), a.$pd || (a.$pd = {}), a.$pd[t] = ce(ce({}, (y = a.$pd) === null || y === void 0 ? void 0 : y[t]), {}, {
        name: t,
        instance: a._$instances[t]
      });
    }, o = function(l) {
      var a, c, u, d = l._$instances[t], f = d?.watch, h = function(S) {
        var v, w = S.newValue, T = S.oldValue;
        return f == null || (v = f.config) === null || v === void 0 ? void 0 : v.call(d, w, T);
      }, b = function(S) {
        var v, w = S.newValue, T = S.oldValue;
        return f == null || (v = f["config.ripple"]) === null || v === void 0 ? void 0 : v.call(d, w, T);
      };
      d.$watchersCallback = {
        config: h,
        "config.ripple": b
      }, f == null || (a = f.config) === null || a === void 0 || a.call(d, d?.$primevueConfig), Yt.on("config:change", h), f == null || (c = f["config.ripple"]) === null || c === void 0 || c.call(d, d == null || (u = d.$primevueConfig) === null || u === void 0 ? void 0 : u.ripple), Yt.on("config:ripple:change", b);
    }, i = function(l) {
      var a = l._$instances[t].$watchersCallback;
      a && (Yt.off("config:change", a.config), Yt.off("config:ripple:change", a["config.ripple"]), l._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(l, a, c, u) {
        l.$pd || (l.$pd = {}), l.$pd[t] = {
          name: t,
          attrSelector: Fc("pd")
        }, r("created", l, a, c, u);
      },
      beforeMount: function(l, a, c, u) {
        var d;
        ne._loadStyles((d = l.$pd[t]) === null || d === void 0 ? void 0 : d.instance, a, c), r("beforeMount", l, a, c, u), o(l);
      },
      mounted: function(l, a, c, u) {
        var d;
        ne._loadStyles((d = l.$pd[t]) === null || d === void 0 ? void 0 : d.instance, a, c), r("mounted", l, a, c, u);
      },
      beforeUpdate: function(l, a, c, u) {
        r("beforeUpdate", l, a, c, u);
      },
      updated: function(l, a, c, u) {
        var d;
        ne._loadStyles((d = l.$pd[t]) === null || d === void 0 ? void 0 : d.instance, a, c), r("updated", l, a, c, u);
      },
      beforeUnmount: function(l, a, c, u) {
        var d;
        i(l), ne._removeThemeListeners((d = l.$pd[t]) === null || d === void 0 ? void 0 : d.instance), r("beforeUnmount", l, a, c, u);
      },
      unmounted: function(l, a, c, u) {
        var d;
        (d = l.$pd[t]) === null || d === void 0 || (d = d.instance) === null || d === void 0 || (d = d.scopedStyleEl) === null || d === void 0 || (d = d.value) === null || d === void 0 || d.remove(), r("unmounted", l, a, c, u);
      }
    };
  },
  extend: function() {
    var t = ne._getMeta.apply(ne, arguments), n = pl(t, 2), r = n[0], o = n[1];
    return ce({
      extend: function() {
        var s = ne._getMeta.apply(ne, arguments), l = pl(s, 2), a = l[0], c = l[1];
        return ne.extend(a, ce(ce(ce({}, o), o?.methods), c));
      }
    }, ne._extend(r, o));
  }
}, Hh = `
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
`, Kh = {
  root: "p-ink"
}, Uh = ve.extend({
  name: "ripple-directive",
  style: Hh,
  classes: Kh
}), Wh = ne.extend({
  style: Uh
});
function Cr(e) {
  "@babel/helpers - typeof";
  return Cr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Cr(e);
}
function qh(e) {
  return Zh(e) || Yh(e) || Jh(e) || Gh();
}
function Gh() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Jh(e, t) {
  if (e) {
    if (typeof e == "string") return xi(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? xi(e, t) : void 0;
  }
}
function Yh(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Zh(e) {
  if (Array.isArray(e)) return xi(e);
}
function xi(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ml(e, t, n) {
  return (t = Qh(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Qh(e) {
  var t = Xh(e, "string");
  return Cr(t) == "symbol" ? t : t + "";
}
function Xh(e, t) {
  if (Cr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Cr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var bu = Wh.extend("ripple", {
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
      n || (n = Oc("span", ml(ml({
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
      var n = this, r = t.currentTarget, o = this.getInk(r);
      if (!(!o || getComputedStyle(o, null).display === "none")) {
        if (!this.isUnstyled() && zo(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !fn(o) && !pn(o)) {
          var i = Math.max(Hl(r), Ec(r));
          o.style.height = i + "px", o.style.width = i + "px";
        }
        var s = Lc(r), l = t.pageX - s.left + document.body.scrollTop - pn(o) / 2, a = t.pageY - s.top + document.body.scrollLeft - fn(o) / 2;
        o.style.top = a + "px", o.style.left = l + "px", !this.isUnstyled() && vc(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && zo(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && zo(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? qh(t.children).find(function(n) {
        return kc(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
}), eg = `
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
function Or(e) {
  "@babel/helpers - typeof";
  return Or = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Or(e);
}
function vt(e, t, n) {
  return (t = tg(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function tg(e) {
  var t = ng(e, "string");
  return Or(t) == "symbol" ? t : t + "";
}
function ng(e, t) {
  if (Or(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Or(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var rg = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-button p-component", vt(vt(vt(vt(vt(vt(vt(vt(vt({
      "p-button-icon-only": n.hasIcon && !r.label && !r.badge,
      "p-button-vertical": (r.iconPos === "top" || r.iconPos === "bottom") && r.label,
      "p-button-loading": r.loading,
      "p-button-link": r.link || r.variant === "link"
    }, "p-button-".concat(r.severity), r.severity), "p-button-raised", r.raised), "p-button-rounded", r.rounded), "p-button-text", r.text || r.variant === "text"), "p-button-outlined", r.outlined || r.variant === "outlined"), "p-button-sm", r.size === "small"), "p-button-lg", r.size === "large"), "p-button-plain", r.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var n = t.props;
    return ["p-button-icon", vt({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, og = ve.extend({
  name: "button",
  style: eg,
  classes: rg
}), ig = {
  name: "BaseButton",
  extends: On,
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
  style: og,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function Ir(e) {
  "@babel/helpers - typeof";
  return Ir = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ir(e);
}
function We(e, t, n) {
  return (t = sg(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function sg(e) {
  var t = lg(e, "string");
  return Ir(t) == "symbol" ? t : t + "";
}
function lg(e, t) {
  if (Ir(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ir(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ke = {
  name: "Button",
  extends: ig,
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
      return K(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return $n(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return ft(We(We(We(We(We(We(We(We(We(We({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return ft(We(We({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return ft(We(We({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Fo,
    Badge: mu
  },
  directives: {
    ripple: bu
  }
}, ag = ["data-p"], ug = ["data-p"];
function cg(e, t, n, r, o, i) {
  var s = nt("SpinnerIcon"), l = nt("Badge"), a = Ha("ripple");
  return e.asChild ? _e(e.$slots, "default", {
    key: 1,
    class: ot(e.cx("root")),
    a11yAttrs: i.a11yAttrs
  }) : Pa((x(), Le(gi(e.as), K({
    key: 0,
    class: e.cx("root"),
    "data-p": i.dataP
  }, i.attrs), {
    default: dt(function() {
      return [_e(e.$slots, "default", {}, function() {
        return [e.loading ? _e(e.$slots, "loadingicon", K({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (x(), L("span", K({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (x(), Le(s, K({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : _e(e.$slots, "icon", K({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (x(), L("span", K({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": i.dataIconP
          }, e.ptm("icon")), null, 16, ag)) : ae("", !0)];
        }), e.label ? (x(), L("span", K({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": i.dataLabelP
        }), oe(e.label), 17, ug)) : ae("", !0), e.badge ? (x(), Le(l, {
          key: 3,
          value: e.badge,
          class: ot(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : ae("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[a]]);
}
ke.render = cg;
const dg = { class: "nf-root nf-iq" }, fg = { class: "nf-row" }, pg = ["data-level"], hg = ["aria-valuenow"], gg = {
  key: 2,
  class: "nf-notice nf-pre",
  "data-level": "error"
}, mg = {
  key: 3,
  class: "nf-muted nf-small"
}, bg = {
  key: 4,
  class: "nf-preview"
}, vg = { class: "nf-row" }, yg = { class: "nf-preview-text nf-iq-result" }, Sg = /* @__PURE__ */ It({
  __name: "IndependentQueueNode",
  props: {
    runner: {}
  },
  setup(e) {
    const n = e.runner, r = ye(() => n.job.value?.state ?? null), o = ye(() => n.resultText()), i = ye(() => {
      if (n.starting.value) return "Queueing…";
      const d = r.value;
      if (!d) return null;
      switch (d.status) {
        case "queued":
          return "Waiting in queue…";
        case "running": {
          const f = n.runningTitle();
          return `Running${f ? `: ${f}` : "…"} (${d.nodesDone}/${d.nodesTotal})`;
        }
        case "success":
          return `Done (${d.nodesDone}/${d.nodesTotal})`;
        case "interrupted":
          return "Interrupted";
        case "cancelled":
          return "Cancelled";
        case "error":
          return null;
      }
      return null;
    }), s = ye(() => r.value?.status === "success" ? "info" : "muted"), l = ye(() => {
      if (n.queueError.value) return n.queueError.value;
      const d = r.value?.status === "error" ? r.value.error : null;
      return d ? d.nodeType ? `${d.nodeType}: ${d.message}` : d.message : null;
    }), a = ye(() => {
      const d = r.value?.progress;
      return !d || d.max <= 1 ? null : Math.round(d.value / d.max * 100);
    }), c = ye(() => {
      const d = n.seedChanges.value;
      return d.length ? d.map((f) => `#${f.nodeId} ${f.widget} → ${f.to}`).join(", ") : null;
    });
    async function u() {
      if (o.value)
        try {
          await navigator.clipboard.writeText(o.value), bn("success", "Copied");
        } catch (d) {
          bn("error", "Copy failed", d instanceof Error ? d.message : String(d));
        }
    }
    return jr(() => n.dispose()), (d, f) => (x(), L("div", dg, [
      z("div", fg, [
        F(n).busy ? (x(), Le(F(ke), {
          key: 1,
          class: "nf-button nf-button-danger nf-grow",
          icon: "pi pi-stop",
          label: "Cancel",
          disabled: F(n).starting.value,
          onClick: f[1] || (f[1] = (h) => F(n).cancel())
        }, null, 8, ["disabled"])) : (x(), Le(F(ke), {
          key: 0,
          class: "nf-button nf-button-primary nf-grow",
          icon: "pi pi-play",
          label: "Run",
          title: "Run only the upstream branch of this node",
          onClick: f[0] || (f[0] = (h) => F(n).run())
        }))
      ]),
      i.value ? (x(), L("div", {
        key: 0,
        class: "nf-notice",
        "data-level": s.value
      }, oe(i.value), 9, pg)) : ae("", !0),
      a.value !== null ? (x(), L("div", {
        key: 1,
        class: "nf-progress",
        role: "progressbar",
        "aria-valuenow": a.value
      }, [
        z("div", {
          class: "nf-progress-bar",
          style: wn({ width: `${a.value}%` })
        }, null, 4)
      ], 8, hg)) : ae("", !0),
      l.value ? (x(), L("div", gg, oe(l.value), 1)) : ae("", !0),
      c.value && r.value?.status !== "error" ? (x(), L("div", mg, "seed: " + oe(c.value), 1)) : ae("", !0),
      o.value !== null ? (x(), L("div", bg, [
        z("div", vg, [
          f[2] || (f[2] = z("span", { class: "nf-preview-label nf-grow" }, "result", -1)),
          G(F(ke), {
            class: "nf-icon-button",
            icon: "pi pi-copy",
            title: "Copy",
            onClick: u
          })
        ]),
        z("pre", yg, oe(o.value || " "), 1)
      ])) : ae("", !0)
    ]));
  }
});
function wg(e, t, n) {
  if (!e[t]) throw new Error(`Node ${t} is not in the prompt (muted or bypassed?)`);
  return { ...e, [t]: { ...e[t], class_type: n } };
}
function _g(e) {
  return Array.isArray(e) && e.length === 2 && typeof e[1] == "number";
}
function vu(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [t];
  for (; r.length; ) {
    const o = e[r.pop()];
    if (o)
      for (const i of Object.values(o.inputs ?? {})) {
        if (!_g(i)) continue;
        const s = String(i[0]);
        n.has(s) || (n.add(s), r.push(s));
      }
  }
  return n;
}
const yu = ["success", "error", "interrupted", "cancelled"], $g = [
  "execution_start",
  "execution_cached",
  "progress_state",
  "executed",
  "execution_success",
  "execution_error",
  "execution_interrupted"
];
function xg(e, t) {
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
function bl(e, t) {
  const n = [.../* @__PURE__ */ new Set([...e.done, ...t.filter((r) => e.branch.includes(r))])];
  return { ...e, done: n, nodesDone: n.length };
}
function Cg(e, t) {
  const n = t.data ?? {};
  if (n.prompt_id !== e.promptId || yu.includes(e.status)) return e;
  switch (t.type) {
    case "execution_start":
      return { ...e, status: "running" };
    case "execution_cached":
      return bl({ ...e, status: "running" }, (n.nodes ?? []).map(String));
    case "progress_state": {
      const r = Object.entries(n.nodes ?? {}), o = r.filter(([, s]) => s.state === "finished").map(([s]) => s), i = r.find(([, s]) => s.state === "running");
      return bl(
        {
          ...e,
          status: "running",
          runningNode: i ? i[0] : null,
          progress: i ? { value: i[1].value ?? 0, max: i[1].max ?? 1 } : null
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
class Ci extends Error {
  constructor(t, n) {
    super(t), this.nodeErrors = n;
  }
  nodeErrors;
}
function Og(e) {
  const t = e?.response;
  if (t) {
    const n = t.error, r = [
      ...new Set(
        Object.values(t.node_errors ?? {}).flatMap((i) => i.errors ?? []).map((i) => [i.message, i.details?.replace(/^[\w.]+ - /, "")].filter(Boolean).join(": "))
      )
    ], o = typeof n == "string" ? n : [n?.message, n?.details].filter(Boolean).join(": ");
    return new Ci([o, ...r].filter(Boolean).join(`
`) || "Queue failed", t.node_errors);
  }
  return new Ci(e instanceof Error ? e.message : String(e));
}
async function Oi(e) {
  const t = await Ju(), n = e.rewrite ? e.rewrite(t.output) : t.output, r = typeof e.targetIds == "function" ? e.targetIds(n) : e.targetIds;
  if (!r.length) throw new Ci("Nothing to run: no output node to target.");
  const o = [...new Set(r.flatMap((f) => [f, ...vu(n, f)]))], i = [];
  let s = null;
  const l = $g.map(
    (f) => Zu(f, (h) => {
      const b = { type: f, data: h ?? {} };
      s ? d(b) : i.push(b);
    })
  ), a = () => l.splice(0).forEach((f) => f());
  let c;
  try {
    c = (await Yu({ output: n, workflow: t.workflow }, r)).prompt_id;
  } catch (f) {
    throw a(), Og(f);
  }
  const u = /* @__PURE__ */ nn(xg(c, o));
  s = u;
  function d(f) {
    Object.assign(u, Cg(u, f)), yu.includes(u.status) && a();
  }
  return i.splice(0).forEach(d), {
    state: u,
    dispose: a,
    async cancel() {
      u.status === "running" ? await Qu(c) : u.status === "queued" && (await Xu(c), Object.assign(u, { status: "cancelled" }), a());
    }
  };
}
const oi = 1125899906842624;
function Ig(e) {
  const t = e?.options?.values;
  return Array.isArray(t) && t.includes("randomize") && t.includes("fixed");
}
function kg(e) {
  const t = /* @__PURE__ */ new Set([e]), n = [], r = [e], o = (i) => {
    !i || t.has(i) || (t.add(i), n.push(i), r.push(i));
  };
  for (; r.length; ) {
    const i = r.pop();
    for (const s of i.inputs ?? []) {
      if (s.link == null) continue;
      const l = i.graph?.getLink(s.link);
      l && o(i.graph?.getNodeById(l.origin_id));
    }
    if (i.isVirtualNode)
      for (let s = 0; s < (i.outputs?.length ?? 0); s++) {
        const l = i.resolveVirtualOutput?.(s);
        if (l) {
          o(l.node);
          continue;
        }
        const a = i.getInputLink?.(s);
        a && o(i.graph?.getNodeById(a.origin_id));
      }
    i.subgraph?.nodes.forEach(o);
  }
  return n;
}
function Tg(e) {
  const t = [];
  for (const n of e.widgets ?? []) {
    if (n.type !== "number" || typeof n.value != "number") continue;
    const r = n.linkedWidgets?.find(Ig);
    r && t.push({ widget: n, control: r });
  }
  return t;
}
function Pg(e = {}, t = Math.random) {
  const n = e.step2 && e.step2 > 0 ? e.step2 : 1, r = Math.max(-oi, e.min ?? 0), o = Math.min(oi, e.max ?? oi), i = Math.floor((o - r) / n);
  return Math.min(o, Math.floor(t() * (i + 1)) * n + r);
}
function Su(e, t, n = Math.random) {
  if (t === "off") return [];
  const r = [];
  for (const o of kg(e))
    for (const { widget: i, control: s } of Tg(o)) {
      const l = i.value;
      t === "randomize" ? (i.value = Pg(i.options, n), i.callback?.(i.value)) : (s.beforeQueued?.({ isPartialExecution: !1 }), s.afterQueued?.({ isPartialExecution: !1 })), i.value !== l && r.push({ nodeId: o.id, widget: i.name, from: l, to: i.value });
    }
  return r;
}
const Lg = "NF_IndependentQueue", Eg = "NF_IndependentQueueRun";
class Ag {
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
    return !Nl(this.node);
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
        const t = Ln(this.node, "seed_mode", "randomize");
        this.seedChanges.value = Su(this.node, t), this.seedChanges.value.length && this.node.graph?.setDirtyCanvas?.(!0, !0), this.job.value = await Oi({
          targetIds: [this.nodeId],
          rewrite: (n) => wg(n, this.nodeId, Eg)
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
    return t ? sc(t) : null;
  }
  dispose() {
    this.job.value?.dispose();
  }
}
const vl = 300;
function Mg(e) {
  const t = new Ag(e), n = document.createElement("div");
  n.className = "nf-widget-container";
  const r = Ai(e, "nf_independent_queue_ui", n, {
    getMinHeight: () => Math.max(40, n.firstElementChild?.offsetHeight ?? 0)
  }), { unmount: o } = Fr(n, Sg, { runner: t }), i = r.onRemove;
  r.onRemove = () => {
    o(), i?.call(r);
  }, new ResizeObserver(() => Al(e)).observe(n), e.size[0] < vl && e.setSize?.([vl, e.size[1]]);
}
const jg = 1500;
function Ng(e) {
  const { clicked: t, selection: n, count: r, now: o } = e;
  return r <= 0 ? null : t && o - t.at <= jg && t.index < r ? t.index : [...n].sort((s, l) => s - l).find((s) => s < r) ?? 0;
}
const yl = "NF_PreviewSelector", Fg = "NF_PreviewSelectorSource";
function Vg(e, t, n) {
  return Object.keys(e).filter(
    (r) => r !== t && n(e[r].class_type) && vu(e, r).has(t)
  );
}
function Dg(e) {
  return [...new Set(e)].sort((t, n) => t - n).join(",");
}
function Rg(e, t) {
  return e.includes(t) ? e.filter((n) => n !== t) : [...e, t].sort((n, r) => n - r);
}
function zg(e, t, n, r) {
  const o = e[t];
  if (!o) throw new Error(`Node ${t} is not in the prompt (muted or bypassed?)`);
  return {
    ...e,
    [t]: {
      ...o,
      class_type: Fg,
      inputs: { batch_id: n, selection: Dg(r) }
    }
  };
}
const Sl = "nf_preview_selector", wu = /* @__PURE__ */ new WeakMap();
function Bg(e) {
  return wu.get(e);
}
class Hg {
  constructor(t) {
    this.node = t, wu.set(t, this), this.restore(), El(t, () => this.restore()), ec(t, (n) => this.receive(n));
  }
  node;
  state = /* @__PURE__ */ nn({
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
    const t = tc(this.node, Sl, {});
    this.state.batchId = t.batchId ?? null, this.state.candidates = t.candidates ?? [], this.state.selection = t.selection ?? [], this.state.expired = !1;
  }
  persist() {
    const { batchId: t, candidates: n, selection: r } = this.state;
    nc(this.node, Sl, { batchId: t, candidates: [...n], selection: [...r] });
  }
  receive(t) {
    const n = t.nf_candidates, r = t.nf_batch;
    !n || !r?.length || (this.state.candidates = n, this.state.batchId = r[0], this.state.selection = [], this.state.expired = !1, this.persist());
  }
  /** Remember which image was right-clicked, for the node menu that opens next. */
  noteContextClick(t) {
    this.contextClick = { index: t, at: Date.now() };
  }
  /** Index the node menu's image items act on, or null when there is nothing to act on. */
  menuTarget() {
    return this.state.expired ? null : Ng({
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
    this.busy || (this.state.selection = Rg(this.state.selection, t), this.persist());
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
      if (Nl(this.node)) {
        this.queueError.value = "NF Preview Selector buttons cannot run inside a subgraph yet. Place it in the root graph.";
        return;
      }
      this.starting.value = !0, this.action.value = t, this.queueError.value = null, this.job.value?.dispose();
      try {
        this.job.value = await n();
      } catch (r) {
        this.job.value = null, this.queueError.value = r instanceof Error ? r.message : String(r);
      } finally {
        this.starting.value = !1;
      }
    }
  }
  /** Re-run the upstream branch to get new candidates (downstream stays blocked). */
  generate() {
    return this.start("generate", () => {
      const t = Ln(this.node, "seed_mode", "randomize");
      return Su(this.node, t).length && this.node.graph?.setDirtyCanvas?.(!0, !0), Oi({ targetIds: [this.nodeId] });
    });
  }
  /** Run only the downstream outputs with the selected candidates. */
  continue() {
    if (!this.canContinue) return Promise.resolve();
    const { batchId: t, selection: n } = this.state;
    return this.start("continue", async () => {
      const r = await rc();
      return Oi({
        rewrite: (o) => zg(o, this.nodeId, t, n),
        targetIds: (o) => {
          const i = Vg(o, this.nodeId, (s) => r.has(s));
          if (!i.length) throw new Error("Nothing to continue: connect an output node (e.g. Save Image) after this node.");
          return i;
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
const Kg = 0.02, Ug = 0.04;
function Wg(e, t) {
  const n = Math.ceil(e.count / t), r = (e.width - e.gap * (t - 1)) / t, o = (e.height - e.gap * (n - 1)) / n, i = Math.min(r, o * e.aspect);
  return i > 0 ? { cols: t, rows: n, size: i, empty: t * n - e.count } : null;
}
function qg(e) {
  if (e.count <= 0 || e.width <= 0 || e.height <= 0 || !(e.aspect > 0)) return null;
  const t = [];
  for (let l = 1; l <= e.count; l++) {
    const a = Wg(e, l);
    a && t.push(a);
  }
  if (!t.length) return null;
  const n = Math.max(...t.map((l) => l.size));
  let r = t.filter((l) => l.size >= n * (1 - Kg)).sort((l, a) => l.empty - a.empty || a.size - l.size)[0];
  const o = t.find((l) => l.cols === e.previousCols);
  o && o.size >= r.size * (1 - Ug) && (r = o);
  const i = Math.max(1, Math.floor(r.size)), s = Math.max(1, Math.floor(r.size / e.aspect));
  return { cols: r.cols, rows: r.rows, cellW: i, cellH: s };
}
const Gg = { class: "nf-root nf-ps" }, Jg = ["title", "aria-disabled", "onClick", "onContextmenu"], Yg = ["src", "onLoad"], Zg = { class: "nf-ps-badge" }, Qg = {
  key: 0,
  class: "nf-progress"
}, Xg = { class: "nf-ps-bar" }, em = ["data-level", "title"], wl = 4, tm = /* @__PURE__ */ It({
  __name: "PreviewSelectorNode",
  props: {
    controller: {}
  },
  setup(e) {
    const n = e.controller, r = n.state, o = /* @__PURE__ */ Te(), i = /* @__PURE__ */ Te({ width: 0, height: 0 }), s = /* @__PURE__ */ Te(1);
    let l, a;
    const c = ye(() => {
      const v = qg({
        count: r.candidates.length,
        aspect: s.value,
        width: i.value.width,
        height: i.value.height,
        gap: wl,
        previousCols: l
      });
      return l = v?.cols, v;
    }), u = ye(() => {
      const v = c.value;
      return v ? {
        gridTemplateColumns: `repeat(${v.cols}, ${v.cellW}px)`,
        gridTemplateRows: `repeat(${v.rows}, ${v.cellH}px)`,
        gap: `${wl}px`
      } : {};
    });
    Cn(() => {
      a = new ResizeObserver(([v]) => {
        i.value = { width: Math.floor(v.contentRect.width), height: Math.floor(v.contentRect.height) };
      }), o.value && a.observe(o.value);
    }), jr(() => {
      a?.disconnect(), n.dispose();
    }), qe(
      () => r.batchId,
      () => {
        l = void 0, s.value = 1;
      }
    );
    const d = ye(() => r.candidates.map((v) => Ml(v)));
    function f(v, w) {
      n.noteContextClick(w), !oc() && (v.preventDefault(), v.stopPropagation(), ic(n.node, v));
    }
    function h(v, w) {
      const T = v.target;
      w === 0 && T.naturalWidth && T.naturalHeight && (s.value = T.naturalWidth / T.naturalHeight);
    }
    const b = ye(() => n.job.value?.state ?? null), y = ye(() => {
      if (n.queueError.value) return { level: "error", text: n.queueError.value };
      const v = b.value, w = n.action.value === "continue" ? "Continue" : "Generate";
      if (n.starting.value) return { level: "muted", text: `${w}: queueing…` };
      if (v) {
        if (v.status === "queued") return { level: "muted", text: `${w}: waiting in queue…` };
        if (v.status === "running") return { level: "muted", text: `${w}: running (${v.nodesDone}/${v.nodesTotal})` };
        if (v.status === "error") return { level: "error", text: `${w} failed: ${v.error?.nodeType ? `${v.error.nodeType}: ` : ""}${v.error?.message}` };
        if (v.status === "interrupted") return { level: "warn", text: `${w} interrupted` };
        if (v.status === "cancelled") return { level: "muted", text: `${w} cancelled` };
      }
      return r.expired ? { level: "warn", text: "Candidates are no longer available (ComfyUI restarted). Generate again." } : r.candidates.length ? v?.status === "success" && n.action.value === "continue" ? { level: "info", text: `${r.selection.length} / ${r.candidates.length} selected · continued` } : { level: "muted", text: `${r.selection.length} / ${r.candidates.length} selected` } : { level: "muted", text: "Run the workflow or press Generate to get candidates." };
    }), S = ye(() => {
      const v = b.value?.status === "running" ? b.value.progress : null;
      return v && v.max > 1 ? Math.round(v.value / v.max * 100) : null;
    });
    return (v, w) => (x(), L("div", Gg, [
      z("div", {
        ref_key: "area",
        ref: o,
        class: "nf-ps-area"
      }, [
        F(r).candidates.length ? (x(), L("div", {
          key: 0,
          class: "nf-ps-grid",
          style: wn(u.value)
        }, [
          (x(!0), L(pe, null, it(d.value, (T, m) => (x(), L("button", {
            key: `${F(r).batchId}-${m}`,
            type: "button",
            class: ot(["nf-ps-cell", { selected: F(r).selection.includes(m) }]),
            title: `#${m + 1}`,
            "aria-disabled": F(n).busy,
            onClick: ($) => F(n).toggle(m),
            onContextmenu: ($) => f($, m)
          }, [
            z("img", {
              src: T,
              alt: "",
              draggable: "false",
              onLoad: ($) => h($, m),
              onError: w[0] || (w[0] = ($) => F(n).markExpired())
            }, null, 40, Yg),
            z("span", Zg, oe(m + 1), 1)
          ], 42, Jg))), 128))
        ], 4)) : ae("", !0)
      ], 512),
      S.value !== null ? (x(), L("div", Qg, [
        z("div", {
          class: "nf-progress-bar",
          style: wn({ width: `${S.value}%` })
        }, null, 4)
      ])) : ae("", !0),
      z("div", Xg, [
        z("span", {
          class: "nf-ps-status",
          "data-level": y.value.level,
          title: y.value.text
        }, oe(y.value.text), 9, em),
        G(F(ke), {
          class: "nf-icon-button",
          icon: "pi pi-check-square",
          title: "Select all",
          disabled: F(n).busy || !F(r).candidates.length,
          onClick: w[1] || (w[1] = (T) => F(n).selectAll())
        }, null, 8, ["disabled"]),
        G(F(ke), {
          class: "nf-icon-button",
          icon: "pi pi-stop",
          title: "Clear selection",
          disabled: F(n).busy || !F(r).selection.length,
          onClick: w[2] || (w[2] = (T) => F(n).clearSelection())
        }, null, 8, ["disabled"]),
        F(n).busy ? (x(), Le(F(ke), {
          key: 1,
          class: "nf-button nf-button-danger",
          icon: "pi pi-times",
          label: "Cancel",
          disabled: F(n).starting.value,
          onClick: w[5] || (w[5] = (T) => F(n).cancel())
        }, null, 8, ["disabled"])) : (x(), L(pe, { key: 0 }, [
          G(F(ke), {
            class: "nf-button",
            icon: "pi pi-refresh",
            label: "Generate",
            title: "Run the upstream part again",
            onClick: w[3] || (w[3] = (T) => F(n).generate())
          }),
          G(F(ke), {
            class: "nf-button nf-button-primary",
            icon: "pi pi-play",
            label: "Continue",
            title: "Run the downstream part with the selected images",
            disabled: !F(n).canContinue,
            onClick: w[4] || (w[4] = (T) => F(n).continue())
          }, null, 8, ["disabled"])
        ], 64))
      ])
    ]));
  }
}), Yr = [420, 480];
function nm(e) {
  const t = new Hg(e), n = document.createElement("div");
  n.className = "nf-widget-container nf-ps-container";
  const r = Ai(e, "nf_preview_selector_ui", n, { getMinHeight: () => 120 }), { unmount: o } = Fr(n, tm, { controller: t }), i = r.onRemove;
  r.onRemove = () => {
    o(), i?.call(r);
  };
  const [s, l] = e.size;
  (s < Yr[0] || l < Yr[1]) && e.setSize?.([Math.max(s, Yr[0]), Math.max(l, Yr[1])]);
}
class bo extends Error {
}
async function rm(e) {
  const t = await fetch(e);
  if (!t.ok) throw new bo(`Could not load the image (HTTP ${t.status})`);
  return t.blob();
}
async function om(e) {
  if (e.type === "image/png") return e;
  const t = await createImageBitmap(e), n = document.createElement("canvas");
  return n.width = t.width, n.height = t.height, n.getContext("2d").drawImage(t, 0, 0), new Promise(
    (r, o) => n.toBlob((i) => i ? r(i) : o(new bo("PNG conversion failed")), "image/png")
  );
}
async function im(e) {
  if (!window.isSecureContext || !navigator.clipboard?.write || typeof ClipboardItem > "u")
    throw new bo(
      "The browser does not allow copying images here (needs https or localhost). Use Open Image and copy from the new tab."
    );
  const t = rm(e).then(om);
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": t })]);
  } catch (n) {
    throw n instanceof DOMException && n.name === "NotAllowedError" ? new bo(
      "The browser blocked clipboard access. Allow the clipboard permission for this site, or use Open Image."
    ) : n;
  }
}
function sm(e) {
  window.open(e, "_blank", "noopener");
}
function lm(e, t) {
  const n = document.createElement("a");
  n.href = e, n.download = t, document.body.appendChild(n), n.click(), n.remove();
}
function am(e) {
  const t = Bg(e), n = t?.menuTarget();
  if (!t || n === null || n === void 0) return [];
  const r = t.state.candidates[n], o = Ml(r), i = `#${n + 1}`;
  return [
    null,
    // separator
    {
      content: `Copy Image (${i})`,
      callback: () => {
        im(o).then(() => bn("success", "Image copied", i)).catch((s) => bn("error", "Copy Image failed", s instanceof Error ? s.message : String(s)));
      }
    },
    { content: `Open Image (${i})`, callback: () => sm(o) },
    { content: `Save Image (${i})`, callback: () => lm(o, r.filename) }
  ];
}
class _n extends Error {
  status;
  code;
  details;
  constructor(t, n) {
    super(n.message), this.status = t, this.code = n.code, this.details = n.details;
  }
}
async function zn(e, t = {}) {
  const n = new Headers(t.headers);
  t.body !== void 0 && !n.has("Content-Type") && n.set("Content-Type", "application/json");
  let r;
  try {
    r = await Gu(e, { ...t, headers: n });
  } catch (i) {
    throw new _n(0, { code: "NETWORK_ERROR", message: i instanceof Error ? i.message : String(i) });
  }
  let o = null;
  try {
    o = await r.json();
  } catch {
  }
  if (!r.ok) {
    const i = o?.error;
    throw new _n(r.status, i ?? { code: "HTTP_ERROR", message: `HTTP ${r.status}` });
  }
  return o;
}
const ut = {
  templateId: "template_id",
  variables: "variables",
  snapshot: "snapshot",
  pinSnapshot: "pin_snapshot"
}, um = ["input1", "input2"], cm = "NF_PromptTemplate", Vr = "/nyafu/prompt_template", fe = /* @__PURE__ */ nn({
  templates: [],
  revision: "",
  loaded: !1,
  loading: !1,
  error: null
});
let Gn = null;
function Vo() {
  return Gn || (fe.loading = !0, Gn = zn(`${Vr}/templates`).then((e) => {
    fe.templates = e.templates, fe.revision = e.revision, fe.error = null, fe.loaded = !0;
  }).catch((e) => {
    fe.error = e instanceof _n ? e : new _n(0, { code: "UNKNOWN", message: String(e) });
  }).finally(() => {
    fe.loading = !1, Gn = null;
  }), Gn);
}
function _u() {
  return fe.loaded ? Promise.resolve() : Vo();
}
function Vt(e) {
  return fe.templates.find((t) => t.id === e);
}
const $u = (e) => `${Vr}/templates/${encodeURIComponent(e)}`;
async function Qi(e) {
  try {
    const t = await e();
    return fe.revision = t.revision, t;
  } catch (t) {
    throw t instanceof _n && t.status === 409 && await Vo(), t;
  }
}
async function dm(e) {
  const t = await Qi(
    () => zn(`${Vr}/templates`, {
      method: "POST",
      body: JSON.stringify({ template: e, base_revision: fe.revision })
    })
  );
  return fe.templates = [...fe.templates, t.template], t.template;
}
async function fm(e, t) {
  const n = await Qi(
    () => zn($u(e), {
      method: "PUT",
      body: JSON.stringify({ template: t, base_revision: fe.revision })
    })
  );
  return fe.templates = fe.templates.map((r) => r.id === e ? n.template : r), n.template;
}
async function pm(e) {
  await Qi(
    () => zn(
      `${$u(e)}?base_revision=${encodeURIComponent(fe.revision)}`,
      { method: "DELETE" }
    )
  ), fe.templates = fe.templates.filter((t) => t.id !== e);
}
function hm(e) {
  if (typeof e != "string" || !e.trim()) return {};
  try {
    const t = JSON.parse(e);
    return t === null || typeof t != "object" || Array.isArray(t) ? {} : Object.fromEntries(Object.entries(t).filter(([, n]) => typeof n == "string"));
  } catch {
    return {};
  }
}
function _l(e) {
  if (typeof e != "string" || !e.trim()) return null;
  try {
    const t = JSON.parse(e);
    if (t && typeof t == "object" && typeof t.id == "string" && typeof t.template == "string")
      return { category: "", negative_prompt: "", variables: {}, ...t };
  } catch {
  }
  return null;
}
function $l(e) {
  const t = Object.fromEntries(Object.entries(e.variables ?? {}).sort(([n], [r]) => n.localeCompare(r)));
  return JSON.stringify([e.template, e.negative_prompt ?? "", t]);
}
function xu(e, t) {
  return $l(e) === $l(t);
}
function gm(e, t = /* @__PURE__ */ new Date()) {
  const n = { ...e, captured_at: t.toISOString() };
  return JSON.stringify(n);
}
const mm = "Uncategorized", xl = (e, t) => e.localeCompare(t, void 0, { sensitivity: "base" });
function Cu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const o of e) {
    const i = o.category || "";
    t.has(i) || t.set(i, []), t.get(i).push({ id: o.id, name: o.name });
  }
  for (const o of t.values()) o.sort((i, s) => xl(i.name, s.name));
  const n = [...t].filter(([o]) => o).sort(([o], [i]) => xl(o, i)).map(([o, i]) => ({ label: o, items: i })), r = t.get("");
  return r && n.push({ label: mm, items: r }), n;
}
function bm(e, t, n) {
  return n ? e : e.map((r) => t.has(r.label) ? r : { ...r, items: [] });
}
function vm(e, t) {
  const n = t.trim().toLocaleLowerCase();
  return n ? e.map((r) => ({ ...r, items: r.items.filter((o) => o.name.toLocaleLowerCase().includes(n)) })).filter((r) => r.items.length) : e;
}
function Ou(e, t) {
  return e.find((n) => n.items.some((r) => r.id === t))?.label;
}
function ym(e, t, n, r) {
  if (r)
    return n ? { template: n, source: "snapshot", notice: "pinned" } : { template: null, source: null, notice: "pinned_without_snapshot" };
  if (!e) return { template: null, source: null, notice: "no_template" };
  if (t) {
    const o = n !== null && !xu(n, t);
    return { template: t, source: "library", notice: o ? "snapshot_outdated" : "none" };
  }
  return n && n.id === e ? { template: n, source: "snapshot", notice: "template_missing" } : { template: null, source: null, notice: "not_found" };
}
class Sm {
  constructor(t) {
    this.node = t, this.state = /* @__PURE__ */ nn({
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
    this.state.templateId = String(Ln(this.node, ut.templateId, "")), this.state.variables = hm(Ln(this.node, ut.variables, "{}")), this.state.snapshot = _l(Ln(this.node, ut.snapshot, "")), this.state.pinned = !!Ln(this.node, ut.pinSnapshot, !1), this.syncConnections();
  }
  syncConnections() {
    this.state.connectedInputs = um.filter((t) => Uu(this.node, t));
  }
  /** Select a template: reset variable values to its defaults and capture a snapshot. */
  selectTemplate(t) {
    const n = Vt(t);
    this.writeTemplateId(t), this.writeVariables({ ...n?.variables ?? {} }), this.captureSnapshot(), this.fit();
  }
  setVariable(t, n) {
    this.writeVariables({ ...this.state.variables, [t]: n });
  }
  resetVariable(t) {
    const n = Vt(this.state.templateId)?.variables ?? this.state.snapshot?.variables ?? {};
    this.setVariable(t, n[t] ?? "");
  }
  /**
   * Store the current library content as the snapshot (skipped when pinned or unknown).
   * Only rewritten when the content changed, so queueing does not mark the workflow modified.
   */
  captureSnapshot() {
    if (this.syncFromWidgets(), this.state.pinned) return;
    const t = Vt(this.state.templateId);
    if (!t) return;
    const n = this.state.snapshot;
    if (n && n.id === t.id && xu(n, t)) return;
    const r = gm(t);
    Do(this.node, ut.snapshot, r), this.state.snapshot = _l(r);
  }
  fit() {
    requestAnimationFrame(() => Al(this.node));
  }
  writeTemplateId(t) {
    Do(this.node, ut.templateId, t), this.state.templateId = t;
  }
  writeVariables(t) {
    Do(this.node, ut.variables, JSON.stringify(t)), this.state.variables = t;
  }
}
function kr(e) {
  "@babel/helpers - typeof";
  return kr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, kr(e);
}
function wm(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function _m(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, xm(r.key), r);
  }
}
function $m(e, t, n) {
  return t && _m(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function xm(e) {
  var t = Cm(e, "string");
  return kr(t) == "symbol" ? t : t + "";
}
function Cm(e, t) {
  if (kr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (kr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Om = /* @__PURE__ */ (function() {
  function e(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    wm(this, e), this.element = t, this.listener = n;
  }
  return $m(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = Ac(this.element);
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
})(), Iu = {
  name: "BlankIcon",
  extends: Rn
};
function Im(e) {
  return Lm(e) || Pm(e) || Tm(e) || km();
}
function km() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Tm(e, t) {
  if (e) {
    if (typeof e == "string") return Ii(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ii(e, t) : void 0;
  }
}
function Pm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Lm(e) {
  if (Array.isArray(e)) return Ii(e);
}
function Ii(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Em(e, t, n, r, o, i) {
  return x(), L("svg", K({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Im(t[0] || (t[0] = [z("rect", {
    width: "1",
    height: "1",
    fill: "currentColor",
    "fill-opacity": "0"
  }, null, -1)])), 16);
}
Iu.render = Em;
var ku = {
  name: "CheckIcon",
  extends: Rn
};
function Am(e) {
  return Fm(e) || Nm(e) || jm(e) || Mm();
}
function Mm() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function jm(e, t) {
  if (e) {
    if (typeof e == "string") return ki(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ki(e, t) : void 0;
  }
}
function Nm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Fm(e) {
  if (Array.isArray(e)) return ki(e);
}
function ki(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Vm(e, t, n, r, o, i) {
  return x(), L("svg", K({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Am(t[0] || (t[0] = [z("path", {
    d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
ku.render = Vm;
var Tu = {
  name: "ChevronDownIcon",
  extends: Rn
};
function Dm(e) {
  return Hm(e) || Bm(e) || zm(e) || Rm();
}
function Rm() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zm(e, t) {
  if (e) {
    if (typeof e == "string") return Ti(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ti(e, t) : void 0;
  }
}
function Bm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Hm(e) {
  if (Array.isArray(e)) return Ti(e);
}
function Ti(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Km(e, t, n, r, o, i) {
  return x(), L("svg", K({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Dm(t[0] || (t[0] = [z("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Tu.render = Km;
var Pu = {
  name: "SearchIcon",
  extends: Rn
};
function Um(e) {
  return Jm(e) || Gm(e) || qm(e) || Wm();
}
function Wm() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qm(e, t) {
  if (e) {
    if (typeof e == "string") return Pi(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Pi(e, t) : void 0;
  }
}
function Gm(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Jm(e) {
  if (Array.isArray(e)) return Pi(e);
}
function Pi(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Ym(e, t, n, r, o, i) {
  return x(), L("svg", K({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Um(t[0] || (t[0] = [z("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Pu.render = Ym;
var Lu = {
  name: "TimesIcon",
  extends: Rn
};
function Zm(e) {
  return tb(e) || eb(e) || Xm(e) || Qm();
}
function Qm() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xm(e, t) {
  if (e) {
    if (typeof e == "string") return Li(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Li(e, t) : void 0;
  }
}
function eb(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function tb(e) {
  if (Array.isArray(e)) return Li(e);
}
function Li(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function nb(e, t, n, r, o, i) {
  return x(), L("svg", K({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Zm(t[0] || (t[0] = [z("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Lu.render = nb;
var rb = `
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
`, ob = {
  root: "p-iconfield"
}, ib = ve.extend({
  name: "iconfield",
  style: rb,
  classes: ob
}), sb = {
  name: "BaseIconField",
  extends: On,
  style: ib,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, Eu = {
  name: "IconField",
  extends: sb,
  inheritAttrs: !1
};
function lb(e, t, n, r, o, i) {
  return x(), L("div", K({
    class: e.cx("root")
  }, e.ptmi("root")), [_e(e.$slots, "default")], 16);
}
Eu.render = lb;
var ab = {
  root: "p-inputicon"
}, ub = ve.extend({
  name: "inputicon",
  classes: ab
}), cb = {
  name: "BaseInputIcon",
  extends: On,
  style: ub,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, Au = {
  name: "InputIcon",
  extends: cb,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function db(e, t, n, r, o, i) {
  return x(), L("span", K({
    class: i.containerClass
  }, e.ptmi("root"), {
    "aria-hidden": "true"
  }), [_e(e.$slots, "default")], 16);
}
Au.render = db;
var fb = {
  name: "BaseEditableHolder",
  extends: On,
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
        var n, r;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (r = n.register) === null || r === void 0 ? void 0 : r.call(n, t, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(t) {
        var n, r;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (r = n.register) === null || r === void 0 ? void 0 : r.call(n, this.$formName, t)) || {};
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
      var r, o;
      this.controlled && (this.d_value = t, this.$emit("update:modelValue", t)), this.$emit("value-change", t), (r = (o = this.formField).onChange) === null || r === void 0 || r.call(o, {
        originalEvent: n,
        value: t
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
        n[r] = arguments[r];
      return n.find(de);
    }
  },
  computed: {
    $filled: function() {
      return de(this.d_value);
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
}, Xi = {
  name: "BaseInput",
  extends: fb,
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
}, pb = `
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
`, hb = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": r.size === "small",
      "p-inputtext-lg p-inputfield-lg": r.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, gb = ve.extend({
  name: "inputtext",
  style: pb,
  classes: hb
}), mb = {
  name: "BaseInputText",
  extends: Xi,
  style: gb,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function Tr(e) {
  "@babel/helpers - typeof";
  return Tr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Tr(e);
}
function bb(e, t, n) {
  return (t = vb(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function vb(e) {
  var t = yb(e, "string");
  return Tr(t) == "symbol" ? t : t + "";
}
function yb(e, t) {
  if (Tr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Tr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Fn = {
  name: "InputText",
  extends: mb,
  inheritAttrs: !1,
  methods: {
    onInput: function(t) {
      this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return K(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return ft(bb({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, Sb = ["value", "name", "disabled", "aria-invalid", "data-p"];
function wb(e, t, n, r, o, i) {
  return x(), L("input", K({
    type: "text",
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.$invalid || void 0,
    "data-p": i.dataP,
    onInput: t[0] || (t[0] = function() {
      return i.onInput && i.onInput.apply(i, arguments);
    })
  }, i.attrs), null, 16, Sb);
}
Fn.render = wb;
var _b = ji(), Mu = {
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
    this.mounted = Wl();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function $b(e, t, n, r, o, i) {
  return i.inline ? _e(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (x(), Le(tf, {
    key: 1,
    to: n.appendTo
  }, [_e(e.$slots, "default")], 8, ["to"])) : ae("", !0);
}
Mu.render = $b;
var xb = `
    .p-virtualscroller-loader {
        background: dt('virtualscroller.loader.mask.background');
        color: dt('virtualscroller.loader.mask.color');
    }

    .p-virtualscroller-loading-icon {
        font-size: dt('virtualscroller.loader.icon.size');
        width: dt('virtualscroller.loader.icon.size');
        height: dt('virtualscroller.loader.icon.size');
    }
`, Cb = `
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
`, Cl = ve.extend({
  name: "virtualscroller",
  css: Cb,
  style: xb
}), Ob = {
  name: "BaseVirtualScroller",
  extends: On,
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
  style: Cl,
  provide: function() {
    return {
      $pcVirtualScroller: this,
      $parentInstance: this
    };
  },
  beforeMount: function() {
    var t;
    Cl.loadCSS({
      nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
    });
  }
};
function Pr(e) {
  "@babel/helpers - typeof";
  return Pr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pr(e);
}
function Ol(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Jn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ol(Object(n), !0).forEach(function(r) {
      ju(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ol(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function ju(e, t, n) {
  return (t = Ib(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ib(e) {
  var t = kb(e, "string");
  return Pr(t) == "symbol" ? t : t + "";
}
function kb(e, t) {
  if (Pr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Pr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Nu = {
  name: "VirtualScroller",
  extends: Ob,
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
      no(this.element) && (this.setContentEl(this.content), this.init(), this.calculateAutoSize(), this.defaultWidth = pn(this.element), this.defaultHeight = fn(this.element), this.defaultContentWidth = pn(this.content), this.defaultContentHeight = fn(this.content), this.initialized = !0), this.element && this.bindResizeListener();
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
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto", o = this.isBoth(), i = this.isHorizontal(), s = o ? t.every(function(P) {
        return P > -1;
      }) : t > -1;
      if (s) {
        var l = this.first, a = this.element, c = a.scrollTop, u = c === void 0 ? 0 : c, d = a.scrollLeft, f = d === void 0 ? 0 : d, h = this.calculateNumItems(), b = h.numToleratedItems, y = this.getContentPosition(), S = this.itemSize, v = function() {
          var B = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, V = arguments.length > 1 ? arguments[1] : void 0;
          return B <= V ? 0 : B;
        }, w = function(B, V, q) {
          return B * V + q;
        }, T = function() {
          var B = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, V = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.scrollTo({
            left: B,
            top: V,
            behavior: r
          });
        }, m = o ? {
          rows: 0,
          cols: 0
        } : 0, $ = !1, M = !1;
        o ? (m = {
          rows: v(t[0], b[0]),
          cols: v(t[1], b[1])
        }, T(w(m.cols, S[1], y.left), w(m.rows, S[0], y.top)), M = this.lastScrollPos.top !== u || this.lastScrollPos.left !== f, $ = m.rows !== l.rows || m.cols !== l.cols) : (m = v(t, b), i ? T(w(m, S, y.left), u) : T(f, w(m, S, y.top)), M = this.lastScrollPos !== (i ? f : u), $ = m !== l), this.isRangeChanged = $, M && (this.first = m);
      }
    },
    scrollInView: function(t, n) {
      var r = this, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "auto";
      if (n) {
        var i = this.isBoth(), s = this.isHorizontal(), l = i ? t.every(function(S) {
          return S > -1;
        }) : t > -1;
        if (l) {
          var a = this.getRenderedRange(), c = a.first, u = a.viewport, d = function() {
            var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, w = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return r.scrollTo({
              left: v,
              top: w,
              behavior: o
            });
          }, f = n === "to-start", h = n === "to-end";
          if (f) {
            if (i)
              u.first.rows - c.rows > t[0] ? d(u.first.cols * this.itemSize[1], (u.first.rows - 1) * this.itemSize[0]) : u.first.cols - c.cols > t[1] && d((u.first.cols - 1) * this.itemSize[1], u.first.rows * this.itemSize[0]);
            else if (u.first - c > t) {
              var b = (u.first - 1) * this.itemSize;
              s ? d(b, 0) : d(0, b);
            }
          } else if (h) {
            if (i)
              u.last.rows - c.rows <= t[0] + 1 ? d(u.first.cols * this.itemSize[1], (u.first.rows + 1) * this.itemSize[0]) : u.last.cols - c.cols <= t[1] + 1 && d((u.first.cols + 1) * this.itemSize[1], u.first.rows * this.itemSize[0]);
            else if (u.last - c <= t + 1) {
              var y = (u.first + 1) * this.itemSize;
              s ? d(y, 0) : d(0, y);
            }
          }
        }
      } else
        this.scrollToIndex(t, o);
    },
    getRenderedRange: function() {
      var t = function(d, f) {
        return Math.floor(d / (f || d));
      }, n = this.first, r = 0;
      if (this.element) {
        var o = this.isBoth(), i = this.isHorizontal(), s = this.element, l = s.scrollTop, a = s.scrollLeft;
        if (o)
          n = {
            rows: t(l, this.itemSize[0]),
            cols: t(a, this.itemSize[1])
          }, r = {
            rows: n.rows + this.numItemsInViewport.rows,
            cols: n.cols + this.numItemsInViewport.cols
          };
        else {
          var c = i ? a : l;
          n = t(c, this.itemSize), r = n + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: n,
          last: r
        }
      };
    },
    calculateNumItems: function() {
      var t = this.isBoth(), n = this.isHorizontal(), r = this.itemSize, o = this.getContentPosition(), i = this.element ? this.element.offsetWidth - o.left : 0, s = this.element ? this.element.offsetHeight - o.top : 0, l = function(f, h) {
        return Math.ceil(f / (h || f));
      }, a = function(f) {
        return Math.ceil(f / 2);
      }, c = t ? {
        rows: l(s, r[0]),
        cols: l(i, r[1])
      } : l(n ? i : s, r), u = this.d_numToleratedItems || (t ? [a(c.rows), a(c.cols)] : a(c));
      return {
        numItemsInViewport: c,
        numToleratedItems: u
      };
    },
    calculateOptions: function() {
      var t = this, n = this.isBoth(), r = this.first, o = this.calculateNumItems(), i = o.numItemsInViewport, s = o.numToleratedItems, l = function(u, d, f) {
        var h = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
        return t.getLast(u + d + (u < f ? 2 : 3) * f, h);
      }, a = n ? {
        rows: l(r.rows, i.rows, s[0]),
        cols: l(r.cols, i.cols, s[1], !0)
      } : l(r, i, s);
      this.last = a, this.numItemsInViewport = i, this.d_numToleratedItems = s, this.$emit("update:numToleratedItems", this.d_numToleratedItems), this.showLoader && (this.loaderArr = n ? Array.from({
        length: i.rows
      }).map(function() {
        return Array.from({
          length: i.cols
        });
      }) : Array.from({
        length: i
      })), this.lazy && Promise.resolve().then(function() {
        var c;
        t.lazyLoadState = {
          first: t.step ? n ? {
            rows: 0,
            cols: r.cols
          } : 0 : r,
          last: Math.min(t.step ? t.step : a, ((c = t.items) === null || c === void 0 ? void 0 : c.length) || 0)
        }, t.$emit("lazy-load", t.lazyLoadState);
      });
    },
    calculateAutoSize: function() {
      var t = this;
      this.autoSize && !this.d_loading && Promise.resolve().then(function() {
        if (t.content) {
          var n = t.isBoth(), r = t.isHorizontal(), o = t.isVertical();
          t.content.style.minHeight = t.content.style.minWidth = "auto", t.content.style.position = "relative", t.element.style.contain = "none";
          var i = [pn(t.element), fn(t.element)], s = i[0], l = i[1];
          (n || r) && (t.element.style.width = s < t.defaultWidth ? s + "px" : t.scrollWidth || t.defaultWidth + "px"), (n || o) && (t.element.style.height = l < t.defaultHeight ? l + "px" : t.scrollHeight || t.defaultHeight + "px"), t.content.style.minHeight = t.content.style.minWidth = "", t.content.style.position = "", t.element.style.contain = "";
        }
      });
    },
    getLast: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, o = arguments.length > 1 ? arguments[1] : void 0;
      return this.items ? Math.min(o ? ((t = this.columns || this.items[0]) === null || t === void 0 ? void 0 : t.length) || 0 : ((n = this.items) === null || n === void 0 ? void 0 : n.length) || 0, r) : 0;
    },
    getContentPosition: function() {
      if (this.content) {
        var t = getComputedStyle(this.content), n = parseFloat(t.paddingLeft) + Math.max(parseFloat(t.left) || 0, 0), r = parseFloat(t.paddingRight) + Math.max(parseFloat(t.right) || 0, 0), o = parseFloat(t.paddingTop) + Math.max(parseFloat(t.top) || 0, 0), i = parseFloat(t.paddingBottom) + Math.max(parseFloat(t.bottom) || 0, 0);
        return {
          left: n,
          right: r,
          top: o,
          bottom: i,
          x: n + r,
          y: o + i
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
        var n = this.isBoth(), r = this.isHorizontal(), o = this.element.parentElement, i = this.scrollWidth || "".concat(this.element.offsetWidth || o.offsetWidth, "px"), s = this.scrollHeight || "".concat(this.element.offsetHeight || o.offsetHeight, "px"), l = function(c, u) {
          return t.element.style[c] = u;
        };
        n || r ? (l("height", s), l("width", i)) : l("height", s);
      }
    },
    setSpacerSize: function() {
      var t = this, n = this.items;
      if (n) {
        var r = this.isBoth(), o = this.isHorizontal(), i = this.getContentPosition(), s = function(a, c, u) {
          var d = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          return t.spacerStyle = Jn(Jn({}, t.spacerStyle), ju({}, "".concat(a), (c || []).length * u + d + "px"));
        };
        r ? (s("height", n, this.itemSize[0], i.y), s("width", this.columns || n[1], this.itemSize[1], i.x)) : o ? s("width", this.columns || n, this.itemSize, i.x) : s("height", n, this.itemSize, i.y);
      }
    },
    setContentPosition: function(t) {
      var n = this;
      if (this.content && !this.appendOnly) {
        var r = this.isBoth(), o = this.isHorizontal(), i = t ? t.first : this.first, s = function(u, d) {
          return u * d;
        }, l = function() {
          var u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.contentStyle = Jn(Jn({}, n.contentStyle), {
            transform: "translate3d(".concat(u, "px, ").concat(d, "px, 0)")
          });
        };
        if (r)
          l(s(i.cols, this.itemSize[1]), s(i.rows, this.itemSize[0]));
        else {
          var a = s(i, this.itemSize);
          o ? l(a, 0) : l(0, a);
        }
      }
    },
    onScrollPositionChange: function(t) {
      var n = this, r = t.target, o = this.isBoth(), i = this.isHorizontal(), s = this.getContentPosition(), l = function(U, E) {
        return U ? U > E ? U - E : U : 0;
      }, a = function(U, E) {
        return Math.floor(U / (E || U));
      }, c = function(U, E, Y, te, he, ie) {
        return U <= he ? he : ie ? Y - te - he : E + he - 1;
      }, u = function(U, E, Y, te, he, ie, re, se) {
        if (U <= ie) return 0;
        var R = Math.max(0, re ? U < E ? Y : U - ie : U > E ? Y : U - 2 * ie), H = n.getLast(R, se);
        return R > H ? H - he : R;
      }, d = function(U, E, Y, te, he, ie) {
        var re = E + te + 2 * he;
        return U >= he && (re += he + 1), n.getLast(re, ie);
      }, f = l(r.scrollTop, s.top), h = l(r.scrollLeft, s.left), b = o ? {
        rows: 0,
        cols: 0
      } : 0, y = this.last, S = !1, v = this.lastScrollPos;
      if (o) {
        var w = this.lastScrollPos.top <= f, T = this.lastScrollPos.left <= h;
        if (!this.appendOnly || this.appendOnly && (w || T)) {
          var m = {
            rows: a(f, this.itemSize[0]),
            cols: a(h, this.itemSize[1])
          }, $ = {
            rows: c(m.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], w),
            cols: c(m.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], T)
          };
          b = {
            rows: u(m.rows, $.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], w),
            cols: u(m.cols, $.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], T, !0)
          }, y = {
            rows: d(m.rows, b.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: d(m.cols, b.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], !0)
          }, S = b.rows !== this.first.rows || y.rows !== this.last.rows || b.cols !== this.first.cols || y.cols !== this.last.cols || this.isRangeChanged, v = {
            top: f,
            left: h
          };
        }
      } else {
        var M = i ? h : f, P = this.lastScrollPos <= M;
        if (!this.appendOnly || this.appendOnly && P) {
          var B = a(M, this.itemSize), V = c(B, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, P);
          b = u(B, V, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, P), y = d(B, b, this.last, this.numItemsInViewport, this.d_numToleratedItems), S = b !== this.first || y !== this.last || this.isRangeChanged, v = M;
        }
      }
      return {
        first: b,
        last: y,
        isRangeChanged: S,
        scrollPos: v
      };
    },
    onScrollChange: function(t) {
      var n = this.onScrollPositionChange(t), r = n.first, o = n.last, i = n.isRangeChanged, s = n.scrollPos;
      if (i) {
        var l = {
          first: r,
          last: o
        };
        if (this.setContentPosition(l), this.first = r, this.last = o, this.lastScrollPos = s, this.$emit("scroll-index-change", l), this.lazy && this.isPageChanged(r)) {
          var a, c, u = {
            first: this.step ? Math.min(this.getPageByFirst(r) * this.step, (((a = this.items) === null || a === void 0 ? void 0 : a.length) || 0) - this.step) : r,
            last: Math.min(this.step ? (this.getPageByFirst(r) + 1) * this.step : o, ((c = this.items) === null || c === void 0 ? void 0 : c.length) || 0)
          }, d = this.lazyLoadState.first !== u.first || this.lazyLoadState.last !== u.last;
          d && this.$emit("lazy-load", u), this.lazyLoadState = u;
        }
      }
    },
    onScroll: function(t) {
      var n = this;
      if (this.$emit("scroll", t), this.delay) {
        if (this.scrollTimeout && clearTimeout(this.scrollTimeout), this.isPageChanged()) {
          if (!this.d_loading && this.showLoader) {
            var r = this.onScrollPositionChange(t), o = r.isRangeChanged, i = o || (this.step ? this.isPageChanged() : !1);
            i && (this.d_loading = !0);
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
        if (no(t.element)) {
          var n = t.isBoth(), r = t.isVertical(), o = t.isHorizontal(), i = [pn(t.element), fn(t.element)], s = i[0], l = i[1], a = s !== t.defaultWidth, c = l !== t.defaultHeight, u = n ? a || c : o ? a : r ? c : !1;
          u && (t.d_numToleratedItems = t.numToleratedItems, t.defaultWidth = s, t.defaultHeight = l, t.defaultContentWidth = pn(t.content), t.defaultContentHeight = fn(t.content), t.init());
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
      var n = (this.items || []).length, r = this.isBoth() ? this.first.rows + t : this.first + t;
      return {
        index: r,
        count: n,
        first: r === 0,
        last: r === n - 1,
        even: r % 2 === 0,
        odd: r % 2 !== 0
      };
    },
    getLoaderOptions: function(t, n) {
      var r = this.loaderArr.length;
      return Jn({
        index: t,
        count: r,
        first: t === 0,
        last: t === r - 1,
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
      this.content = t || this.content || So(this.element, '[data-pc-section="content"]');
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
}, Tb = ["tabindex"];
function Pb(e, t, n, r, o, i) {
  var s = nt("SpinnerIcon");
  return e.disabled ? (x(), L(pe, {
    key: 1
  }, [_e(e.$slots, "default"), _e(e.$slots, "content", {
    items: e.items,
    rows: e.items,
    columns: i.loadedColumns
  })], 64)) : (x(), L("div", K({
    key: 0,
    ref: i.elementRef,
    class: i.containerClass,
    tabindex: e.tabindex,
    style: e.style,
    onScroll: t[0] || (t[0] = function() {
      return i.onScroll && i.onScroll.apply(i, arguments);
    })
  }, e.ptmi("root")), [_e(e.$slots, "content", {
    styleClass: i.contentClass,
    items: i.loadedItems,
    getItemOptions: i.getOptions,
    loading: o.d_loading,
    getLoaderOptions: i.getLoaderOptions,
    itemSize: e.itemSize,
    rows: i.loadedRows,
    columns: i.loadedColumns,
    contentRef: i.contentRef,
    spacerStyle: o.spacerStyle,
    contentStyle: o.contentStyle,
    vertical: i.isVertical(),
    horizontal: i.isHorizontal(),
    both: i.isBoth()
  }, function() {
    return [z("div", K({
      ref: i.contentRef,
      class: i.contentClass,
      style: o.contentStyle
    }, e.ptm("content")), [(x(!0), L(pe, null, it(i.loadedItems, function(l, a) {
      return _e(e.$slots, "item", {
        key: a,
        item: l,
        options: i.getOptions(a)
      });
    }), 128))], 16)];
  }), e.showSpacer ? (x(), L("div", K({
    key: 0,
    class: "p-virtualscroller-spacer",
    style: o.spacerStyle
  }, e.ptm("spacer")), null, 16)) : ae("", !0), !e.loaderDisabled && e.showLoader && o.d_loading ? (x(), L("div", K({
    key: 1,
    class: i.loaderClass
  }, e.ptm("loader")), [e.$slots && e.$slots.loader ? (x(!0), L(pe, {
    key: 0
  }, it(o.loaderArr, function(l, a) {
    return _e(e.$slots, "loader", {
      key: a,
      options: i.getLoaderOptions(a, i.isBoth() && {
        numCols: e.d_numItemsInViewport.cols
      })
    });
  }), 128)) : ae("", !0), _e(e.$slots, "loadingicon", {}, function() {
    return [G(s, K({
      spin: "",
      class: "p-virtualscroller-loading-icon"
    }, e.ptm("loadingIcon")), null, 16)];
  })], 16)) : ae("", !0)], 16, Tb));
}
Nu.render = Pb;
var Lb = `
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
`, Eb = {
  root: function(t) {
    var n = t.instance, r = t.props, o = t.state;
    return ["p-select p-component p-inputwrapper", {
      "p-disabled": r.disabled,
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-focus": o.focused,
      "p-inputwrapper-filled": n.$filled,
      "p-inputwrapper-focus": o.focused || o.overlayVisible,
      "p-select-open": o.overlayVisible,
      "p-select-fluid": n.$fluid,
      "p-select-sm p-inputfield-sm": r.size === "small",
      "p-select-lg p-inputfield-lg": r.size === "large"
    }];
  },
  label: function(t) {
    var n, r = t.instance, o = t.props;
    return ["p-select-label", {
      "p-placeholder": !o.editable && r.label === o.placeholder,
      "p-select-label-empty": !o.editable && !r.$slots.value && (r.label === "p-emptylabel" || ((n = r.label) === null || n === void 0 ? void 0 : n.length) === 0)
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
    var n = t.instance, r = t.props, o = t.state, i = t.option, s = t.focusedOption;
    return ["p-select-option", {
      "p-select-option-selected": n.isSelected(i) && r.highlightOnSelect,
      "p-focus": o.focusedOptionIndex === s,
      "p-disabled": n.isOptionDisabled(i)
    }];
  },
  optionLabel: "p-select-option-label",
  optionCheckIcon: "p-select-option-check-icon",
  optionBlankIcon: "p-select-option-blank-icon",
  emptyMessage: "p-select-empty-message"
}, Ab = ve.extend({
  name: "select",
  style: Lb,
  classes: Eb
}), Mb = {
  name: "BaseSelect",
  extends: Xi,
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
  style: Ab,
  provide: function() {
    return {
      $pcSelect: this,
      $parentInstance: this
    };
  }
};
function Lr(e) {
  "@babel/helpers - typeof";
  return Lr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Lr(e);
}
function jb(e) {
  return Db(e) || Vb(e) || Fb(e) || Nb();
}
function Nb() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Fb(e, t) {
  if (e) {
    if (typeof e == "string") return Ei(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ei(e, t) : void 0;
  }
}
function Vb(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Db(e) {
  if (Array.isArray(e)) return Ei(e);
}
function Ei(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Il(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function kl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Il(Object(n), !0).forEach(function(r) {
      dn(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Il(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function dn(e, t, n) {
  return (t = Rb(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Rb(e) {
  var t = zb(e, "string");
  return Lr(t) == "symbol" ? t : t + "";
}
function zb(e, t) {
  if (Lr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Lr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Fu = {
  name: "Select",
  extends: Mb,
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
    this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindLabelClickListener(), this.unbindMatchMediaOrientationListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.overlay && (Bo.clear(this.overlay), this.overlay = null);
  },
  methods: {
    getOptionIndex: function(t, n) {
      return this.virtualScrollerDisabled ? t : n && n(t).index;
    },
    getOptionLabel: function(t) {
      return this.optionLabel ? At(t, this.optionLabel) : t;
    },
    getOptionValue: function(t) {
      return this.optionValue ? At(t, this.optionValue) : t;
    },
    getOptionRenderKey: function(t, n) {
      return (this.dataKey ? At(t, this.dataKey) : this.getOptionLabel(t)) + "_" + n;
    },
    getPTItemOptions: function(t, n, r, o) {
      return this.ptm(o, {
        context: {
          option: t,
          index: r,
          selected: this.isSelected(t),
          focused: this.focusedOptionIndex === this.getOptionIndex(r, n),
          disabled: this.isOptionDisabled(t)
        }
      });
    },
    isOptionDisabled: function(t) {
      return this.optionDisabled ? At(t, this.optionDisabled) : !1;
    },
    isOptionGroup: function(t) {
      return this.optionGroupLabel && t.optionGroup && t.group;
    },
    getOptionGroupLabel: function(t) {
      return At(t, this.optionGroupLabel);
    },
    getOptionGroupChildren: function(t) {
      return At(t, this.optionGroupChildren);
    },
    getAriaPosInset: function(t) {
      var n = this;
      return (this.optionGroupLabel ? t - this.visibleOptions.slice(0, t).filter(function(r) {
        return n.isOptionGroup(r);
      }).length : t) + 1;
    },
    show: function(t) {
      this.$emit("before-show"), this.overlayVisible = !0, this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), t && kt(this.$refs.focusInput);
    },
    hide: function(t) {
      var n = this, r = function() {
        n.$emit("before-hide"), n.overlayVisible = !1, n.clicked = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.resetFilterOnHide && (n.filterValue = null), t && kt(n.$refs.focusInput);
      };
      setTimeout(function() {
        r();
      }, 0);
    },
    onFocus: function(t) {
      this.disabled || (this.focused = !0, this.overlayVisible && (this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), this.scrollInView(this.focusedOptionIndex)), this.$emit("focus", t));
    },
    onBlur: function(t) {
      var n = this;
      setTimeout(function() {
        var r, o;
        n.focused = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.$emit("blur", t), (r = (o = n.formField).onBlur) === null || r === void 0 || r.call(o, t);
      }, 100);
    },
    onKeyDown: function(t) {
      var n = this;
      if (this.disabled) {
        t.preventDefault();
        return;
      }
      if (Mc())
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
      var r = t.metaKey || t.ctrlKey;
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
          !r && hc(t.key) && (!this.overlayVisible && this.show(), !this.editable && this.searchOptions(t, t.key), this.filter && this.$nextTick(function() {
            n.$refs.filterInput && kt(n.$refs.filterInput.$el);
          }));
          break;
      }
      this.clicked = !1;
    },
    onEditableInput: function(t) {
      var n = t.target.value;
      this.searchValue = "";
      var r = this.searchOptions(t, n);
      !r && (this.focusedOptionIndex = -1), this.updateModel(t, n), !this.overlayVisible && de(n) && this.show();
    },
    onContainerClick: function(t) {
      this.disabled || this.loading || t.target.tagName === "INPUT" || t.target.getAttribute("data-pc-section") === "clearicon" || t.target.closest('[data-pc-section="clearicon"]') || ((!this.overlay || !this.overlay.contains(t.target)) && (this.overlayVisible ? this.hide(!0) : this.show(!0)), this.clicked = !0);
    },
    onClearClick: function(t) {
      this.updateModel(t, null), this.resetFilterOnClear && (this.filterValue = null);
    },
    onFirstHiddenFocus: function(t) {
      var n = t.relatedTarget === this.$refs.focusInput ? Tc(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      kt(n);
    },
    onLastHiddenFocus: function(t) {
      var n = t.relatedTarget === this.$refs.focusInput ? Pc(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      kt(n);
    },
    onOptionSelect: function(t, n) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
      if (this.overlayVisible) {
        var o = this.getOptionValue(n);
        this.updateModel(t, o), r && this.hide(!0);
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
      _b.emit("overlay-click", {
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
        var r = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(t, r), !this.overlayVisible && this.show(), t.preventDefault();
      }
    },
    onArrowLeftKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && (this.focusedOptionIndex = -1);
    },
    onHomeKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var r = t.currentTarget;
        t.shiftKey ? r.setSelectionRange(0, t.target.selectionStart) : (r.setSelectionRange(0, 0), this.focusedOptionIndex = -1);
      } else
        this.changeFocusedOptionIndex(t, this.findFirstOptionIndex()), !this.overlayVisible && this.show();
      t.preventDefault();
    },
    onEndKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var r = t.currentTarget;
        if (t.shiftKey)
          r.setSelectionRange(t.target.selectionStart, r.value.length);
        else {
          var o = r.value.length;
          r.setSelectionRange(o, o), this.focusedOptionIndex = -1;
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
      n || (this.overlayVisible && this.hasFocusableElements() ? (kt(this.$refs.firstHiddenFocusableElementOnOverlay), t.preventDefault()) : (this.focusedOptionIndex !== -1 && this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]), this.overlayVisible && this.hide(this.filter)));
    },
    onBackspaceKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && !this.overlayVisible && this.show();
    },
    onOverlayEnter: function(t) {
      var n = this;
      Bo.set("overlay", t, this.$primevue.config.zIndex.overlay), $c(t, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.scrollInView(), this.$attrSelector && t.setAttribute(this.$attrSelector, ""), setTimeout(function() {
        n.autoFilterFocus && n.filter && kt(n.$refs.filterInput.$el), n.autoUpdateModel();
      }, 1);
    },
    onOverlayAfterEnter: function() {
      this.bindOutsideClickListener(), this.bindScrollListener(), this.bindResizeListener(), this.$emit("show");
    },
    onOverlayLeave: function(t) {
      var n = this;
      t.style.pointerEvents = "none", this.unbindOutsideClickListener(), this.unbindScrollListener(), this.unbindResizeListener(), this.autoFilterFocus && this.filter && !this.editable && this.$nextTick(function() {
        n.$refs.filterInput && kt(n.$refs.filterInput.$el);
      }), this.$emit("hide"), this.overlay = null;
    },
    onOverlayAfterLeave: function(t) {
      Bo.clear(t);
    },
    alignOverlay: function() {
      this.appendTo === "self" ? xc(this.overlay, this.$el) : this.overlay && (this.overlay.style.minWidth = Hl(this.$el) + "px", _c(this.overlay, this.$el));
    },
    bindOutsideClickListener: function() {
      var t = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        var r = n.composedPath();
        t.overlayVisible && t.overlay && !r.includes(t.$el) && !r.includes(t.overlay) && t.hide();
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var t = this;
      this.scrollHandler || (this.scrollHandler = new Om(this.$refs.container, function() {
        t.overlayVisible && t.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = function() {
        t.overlayVisible && !jc() && t.hide();
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    bindLabelClickListener: function() {
      var t = this;
      if (!this.editable && !this.labelClickListener) {
        var n = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        n && no(n) && (this.labelClickListener = function() {
          kt(t.$refs.focusInput);
        }, n.addEventListener("click", this.labelClickListener));
      }
    },
    unbindLabelClickListener: function() {
      if (this.labelClickListener) {
        var t = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        t && no(t) && t.removeEventListener("click", this.labelClickListener);
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
      return Ni(this.overlay, ':not([data-p-hidden-focusable="true"])').length > 0;
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
      return de(t) && !(this.isOptionDisabled(t) || this.isOptionGroup(t));
    },
    isValidSelectedOption: function(t) {
      return this.isValidOption(t) && this.isSelected(t);
    },
    isSelected: function(t) {
      return Fl(this.d_value, this.getOptionValue(t), this.equalityKey);
    },
    findFirstOptionIndex: function() {
      var t = this;
      return this.visibleOptions.findIndex(function(n) {
        return t.isValidOption(n);
      });
    },
    findLastOptionIndex: function() {
      var t = this;
      return us(this.visibleOptions, function(n) {
        return t.isValidOption(n);
      });
    },
    findNextOptionIndex: function(t) {
      var n = this, r = t < this.visibleOptions.length - 1 ? this.visibleOptions.slice(t + 1).findIndex(function(o) {
        return n.isValidOption(o);
      }) : -1;
      return r > -1 ? r + t + 1 : t;
    },
    findPrevOptionIndex: function(t) {
      var n = this, r = t > 0 ? us(this.visibleOptions.slice(0, t), function(o) {
        return n.isValidOption(o);
      }) : -1;
      return r > -1 ? r : t;
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
      var r = this;
      this.searchValue = (this.searchValue || "") + n;
      var o = -1, i = !1;
      return de(this.searchValue) && (o = this.visibleOptions.findIndex(function(s) {
        return r.isOptionExactMatched(s);
      }), o === -1 && (o = this.visibleOptions.findIndex(function(s) {
        return r.isOptionStartsWith(s);
      })), o !== -1 && (i = !0), o === -1 && this.focusedOptionIndex === -1 && (o = this.findFirstFocusedOptionIndex()), o !== -1 && this.changeFocusedOptionIndex(t, o)), this.searchTimeout && clearTimeout(this.searchTimeout), this.searchTimeout = setTimeout(function() {
        r.searchValue = "", r.searchTimeout = null;
      }, 500), i;
    },
    changeFocusedOptionIndex: function(t, n) {
      this.focusedOptionIndex !== n && (this.focusedOptionIndex = n, this.scrollInView(), this.selectOnFocus && this.onOptionSelect(t, this.visibleOptions[n], !1));
    },
    scrollInView: function() {
      var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      this.$nextTick(function() {
        var r = n !== -1 ? "".concat(t.$id, "_").concat(n) : t.focusedOptionId, o = So(t.list, 'li[id="'.concat(r, '"]'));
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
      return (t || []).reduce(function(r, o, i) {
        r.push({
          optionGroup: o,
          group: !0,
          index: i
        });
        var s = n.getOptionGroupChildren(o);
        return s && s.forEach(function(l) {
          return r.push(l);
        }), r;
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
        var r = Yc.filter(n, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
        if (this.optionGroupLabel) {
          var o = this.options || [], i = [];
          return o.forEach(function(s) {
            var l = t.getOptionGroupChildren(s), a = l.filter(function(c) {
              return r.includes(c);
            });
            a.length > 0 && i.push(kl(kl({}, s), {}, dn({}, typeof t.optionGroupChildren == "string" ? t.optionGroupChildren : "items", jb(a))));
          }), this.flatOptions(i);
        }
        return r;
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
      return de(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
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
      return ft(dn({
        invalid: this.$invalid,
        disabled: this.disabled,
        focus: this.focused,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    },
    labelDataP: function() {
      return ft(dn(dn({
        placeholder: !this.editable && this.label === this.placeholder,
        clearable: this.showClear,
        disabled: this.disabled,
        editable: this.editable
      }, this.size, this.size), "empty", !this.editable && !this.$slots.value && (this.label === "p-emptylabel" || this.label.length === 0)));
    },
    dropdownIconDataP: function() {
      return ft(dn({}, this.size, this.size));
    },
    overlayDataP: function() {
      return ft(dn({}, "portal-" + this.appendTo, "portal-" + this.appendTo));
    }
  },
  directives: {
    ripple: bu
  },
  components: {
    InputText: Fn,
    VirtualScroller: Nu,
    Portal: Mu,
    InputIcon: Au,
    IconField: Eu,
    TimesIcon: Lu,
    ChevronDownIcon: Tu,
    SpinnerIcon: Fo,
    SearchIcon: Pu,
    CheckIcon: ku,
    BlankIcon: Iu
  }
}, Bb = ["id", "data-p"], Hb = ["name", "id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "data-p"], Kb = ["name", "id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "aria-disabled", "data-p"], Ub = ["data-p"], Wb = ["id"], qb = ["id"], Gb = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onMousedown", "onMousemove", "data-p-selected", "data-p-focused", "data-p-disabled"];
function Jb(e, t, n, r, o, i) {
  var s = nt("SpinnerIcon"), l = nt("InputText"), a = nt("SearchIcon"), c = nt("InputIcon"), u = nt("IconField"), d = nt("CheckIcon"), f = nt("BlankIcon"), h = nt("VirtualScroller"), b = nt("Portal"), y = Ha("ripple");
  return x(), L("div", K({
    ref: "container",
    id: e.$id,
    class: e.cx("root"),
    onClick: t[12] || (t[12] = function() {
      return i.onContainerClick && i.onContainerClick.apply(i, arguments);
    }),
    "data-p": i.containerDataP
  }, e.ptmi("root")), [e.editable ? (x(), L("input", K({
    key: 0,
    ref: "focusInput",
    name: e.name,
    id: e.labelId || e.inputId,
    type: "text",
    class: [e.cx("label"), e.inputClass, e.labelClass],
    style: [e.inputStyle, e.labelStyle],
    value: i.editableInputValue,
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
    "aria-activedescendant": o.focused ? i.focusedOptionId : void 0,
    "aria-invalid": e.invalid || void 0,
    onFocus: t[0] || (t[0] = function() {
      return i.onFocus && i.onFocus.apply(i, arguments);
    }),
    onBlur: t[1] || (t[1] = function() {
      return i.onBlur && i.onBlur.apply(i, arguments);
    }),
    onKeydown: t[2] || (t[2] = function() {
      return i.onKeyDown && i.onKeyDown.apply(i, arguments);
    }),
    onInput: t[3] || (t[3] = function() {
      return i.onEditableInput && i.onEditableInput.apply(i, arguments);
    }),
    "data-p": i.labelDataP
  }, e.ptm("label")), null, 16, Hb)) : (x(), L("span", K({
    key: 1,
    ref: "focusInput",
    name: e.name,
    id: e.labelId || e.inputId,
    class: [e.cx("label"), e.inputClass, e.labelClass],
    style: [e.inputStyle, e.labelStyle],
    tabindex: e.disabled ? -1 : e.tabindex,
    role: "combobox",
    "aria-label": e.ariaLabel || (i.label === "p-emptylabel" ? void 0 : i.label),
    "aria-labelledby": e.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": o.overlayVisible,
    "aria-controls": e.$id + "_list",
    "aria-activedescendant": o.focused ? i.focusedOptionId : void 0,
    "aria-invalid": e.invalid || void 0,
    "aria-disabled": e.disabled,
    onFocus: t[4] || (t[4] = function() {
      return i.onFocus && i.onFocus.apply(i, arguments);
    }),
    onBlur: t[5] || (t[5] = function() {
      return i.onBlur && i.onBlur.apply(i, arguments);
    }),
    onKeydown: t[6] || (t[6] = function() {
      return i.onKeyDown && i.onKeyDown.apply(i, arguments);
    }),
    "data-p": i.labelDataP
  }, e.ptm("label")), [_e(e.$slots, "value", {
    value: e.d_value,
    placeholder: e.placeholder
  }, function() {
    var S;
    return [Nn(oe(i.label === "p-emptylabel" ? " " : (S = i.label) !== null && S !== void 0 ? S : "empty"), 1)];
  })], 16, Kb)), i.isClearIconVisible ? _e(e.$slots, "clearicon", {
    key: 2,
    class: ot(e.cx("clearIcon")),
    clearCallback: i.onClearClick
  }, function() {
    return [(x(), Le(gi(e.clearIcon ? "i" : "TimesIcon"), K({
      ref: "clearIcon",
      class: [e.cx("clearIcon"), e.clearIcon],
      onClick: i.onClearClick
    }, e.ptm("clearIcon"), {
      "data-pc-section": "clearicon"
    }), null, 16, ["class", "onClick"]))];
  }) : ae("", !0), z("div", K({
    class: e.cx("dropdown")
  }, e.ptm("dropdown")), [e.loading ? _e(e.$slots, "loadingicon", {
    key: 0,
    class: ot(e.cx("loadingIcon"))
  }, function() {
    return [e.loadingIcon ? (x(), L("span", K({
      key: 0,
      class: [e.cx("loadingIcon"), "pi-spin", e.loadingIcon],
      "aria-hidden": "true"
    }, e.ptm("loadingIcon")), null, 16)) : (x(), Le(s, K({
      key: 1,
      class: e.cx("loadingIcon"),
      spin: "",
      "aria-hidden": "true"
    }, e.ptm("loadingIcon")), null, 16, ["class"]))];
  }) : _e(e.$slots, "dropdownicon", {
    key: 1,
    class: ot(e.cx("dropdownIcon"))
  }, function() {
    return [(x(), Le(gi(e.dropdownIcon ? "span" : "ChevronDownIcon"), K({
      class: [e.cx("dropdownIcon"), e.dropdownIcon],
      "aria-hidden": "true",
      "data-p": i.dropdownIconDataP
    }, e.ptm("dropdownIcon")), null, 16, ["class", "data-p"]))];
  })], 16), G(b, {
    appendTo: e.appendTo
  }, {
    default: dt(function() {
      return [G(up, K({
        name: "p-anchored-overlay",
        onEnter: i.onOverlayEnter,
        onAfterEnter: i.onOverlayAfterEnter,
        onLeave: i.onOverlayLeave,
        onAfterLeave: i.onOverlayAfterLeave
      }, e.ptm("transition")), {
        default: dt(function() {
          return [o.overlayVisible ? (x(), L("div", K({
            key: 0,
            ref: i.overlayRef,
            class: [e.cx("overlay"), e.panelClass, e.overlayClass],
            style: [e.panelStyle, e.overlayStyle],
            onClick: t[10] || (t[10] = function() {
              return i.onOverlayClick && i.onOverlayClick.apply(i, arguments);
            }),
            onKeydown: t[11] || (t[11] = function() {
              return i.onOverlayKeyDown && i.onOverlayKeyDown.apply(i, arguments);
            }),
            "data-p": i.overlayDataP
          }, e.ptm("overlay")), [z("span", K({
            ref: "firstHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: t[7] || (t[7] = function() {
              return i.onFirstHiddenFocus && i.onFirstHiddenFocus.apply(i, arguments);
            })
          }, e.ptm("hiddenFirstFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16), _e(e.$slots, "header", {
            value: e.d_value,
            options: i.visibleOptions
          }), e.filter ? (x(), L("div", K({
            key: 0,
            class: e.cx("header")
          }, e.ptm("header")), [G(u, {
            unstyled: e.unstyled,
            pt: e.ptm("pcFilterContainer")
          }, {
            default: dt(function() {
              return [G(l, {
                ref: "filterInput",
                type: "text",
                value: o.filterValue,
                onVnodeMounted: i.onFilterUpdated,
                onVnodeUpdated: i.onFilterUpdated,
                class: ot(e.cx("pcFilter")),
                placeholder: e.filterPlaceholder,
                variant: e.variant,
                unstyled: e.unstyled,
                role: "searchbox",
                autocomplete: "off",
                "aria-owns": e.$id + "_list",
                "aria-activedescendant": i.focusedOptionId,
                onKeydown: i.onFilterKeyDown,
                onBlur: i.onFilterBlur,
                onInput: i.onFilterChange,
                pt: e.ptm("pcFilter"),
                formControl: {
                  novalidate: !0
                }
              }, null, 8, ["value", "onVnodeMounted", "onVnodeUpdated", "class", "placeholder", "variant", "unstyled", "aria-owns", "aria-activedescendant", "onKeydown", "onBlur", "onInput", "pt"]), G(c, {
                unstyled: e.unstyled,
                pt: e.ptm("pcFilterIconContainer")
              }, {
                default: dt(function() {
                  return [_e(e.$slots, "filtericon", {}, function() {
                    return [e.filterIcon ? (x(), L("span", K({
                      key: 0,
                      class: e.filterIcon
                    }, e.ptm("filterIcon")), null, 16)) : (x(), Le(a, ad(K({
                      key: 1
                    }, e.ptm("filterIcon"))), null, 16))];
                  })];
                }),
                _: 3
              }, 8, ["unstyled", "pt"])];
            }),
            _: 3
          }, 8, ["unstyled", "pt"]), z("span", K({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenFilterResult"), {
            "data-p-hidden-accessible": !0
          }), oe(i.filterResultMessageText), 17)], 16)) : ae("", !0), z("div", K({
            class: e.cx("listContainer"),
            style: {
              "max-height": i.virtualScrollerDisabled ? e.scrollHeight : ""
            }
          }, e.ptm("listContainer")), [G(h, K({
            ref: i.virtualScrollerRef
          }, e.virtualScrollerOptions, {
            items: i.visibleOptions,
            style: {
              height: e.scrollHeight
            },
            tabindex: -1,
            disabled: i.virtualScrollerDisabled,
            pt: e.ptm("virtualScroller")
          }), vf({
            content: dt(function(S) {
              var v = S.styleClass, w = S.contentRef, T = S.items, m = S.getItemOptions, $ = S.contentStyle, M = S.itemSize;
              return [z("ul", K({
                ref: function(B) {
                  return i.listRef(B, w);
                },
                id: e.$id + "_list",
                class: [e.cx("list"), v],
                style: $,
                role: "listbox"
              }, e.ptm("list")), [(x(!0), L(pe, null, it(T, function(P, B) {
                return x(), L(pe, {
                  key: i.getOptionRenderKey(P, i.getOptionIndex(B, m))
                }, [i.isOptionGroup(P) ? (x(), L("li", K({
                  key: 0,
                  id: e.$id + "_" + i.getOptionIndex(B, m),
                  style: {
                    height: M ? M + "px" : void 0
                  },
                  class: e.cx("optionGroup"),
                  role: "option"
                }, {
                  ref_for: !0
                }, e.ptm("optionGroup")), [_e(e.$slots, "optiongroup", {
                  option: P.optionGroup,
                  index: i.getOptionIndex(B, m)
                }, function() {
                  return [z("span", K({
                    class: e.cx("optionGroupLabel")
                  }, {
                    ref_for: !0
                  }, e.ptm("optionGroupLabel")), oe(i.getOptionGroupLabel(P.optionGroup)), 17)];
                })], 16, qb)) : Pa((x(), L("li", K({
                  key: 1,
                  id: e.$id + "_" + i.getOptionIndex(B, m),
                  class: e.cx("option", {
                    option: P,
                    focusedOption: i.getOptionIndex(B, m)
                  }),
                  style: {
                    height: M ? M + "px" : void 0
                  },
                  role: "option",
                  "aria-label": i.getOptionLabel(P),
                  "aria-selected": i.isSelected(P),
                  "aria-disabled": i.isOptionDisabled(P),
                  "aria-setsize": i.ariaSetSize,
                  "aria-posinset": i.getAriaPosInset(i.getOptionIndex(B, m)),
                  onMousedown: function(q) {
                    return i.onOptionSelect(q, P);
                  },
                  onMousemove: function(q) {
                    return i.onOptionMouseMove(q, i.getOptionIndex(B, m));
                  },
                  onClick: t[8] || (t[8] = br(function() {
                  }, ["stop"])),
                  "data-p-selected": !e.checkmark && i.isSelected(P),
                  "data-p-focused": o.focusedOptionIndex === i.getOptionIndex(B, m),
                  "data-p-disabled": i.isOptionDisabled(P)
                }, {
                  ref_for: !0
                }, i.getPTItemOptions(P, m, B, "option")), [e.checkmark ? (x(), L(pe, {
                  key: 0
                }, [i.isSelected(P) ? (x(), Le(d, K({
                  key: 0,
                  class: e.cx("optionCheckIcon")
                }, {
                  ref_for: !0
                }, e.ptm("optionCheckIcon")), null, 16, ["class"])) : (x(), Le(f, K({
                  key: 1,
                  class: e.cx("optionBlankIcon")
                }, {
                  ref_for: !0
                }, e.ptm("optionBlankIcon")), null, 16, ["class"]))], 64)) : ae("", !0), _e(e.$slots, "option", {
                  option: P,
                  selected: i.isSelected(P),
                  index: i.getOptionIndex(B, m)
                }, function() {
                  return [z("span", K({
                    class: e.cx("optionLabel")
                  }, {
                    ref_for: !0
                  }, e.ptm("optionLabel")), oe(i.getOptionLabel(P)), 17)];
                })], 16, Gb)), [[y]])], 64);
              }), 128)), o.filterValue && (!T || T && T.length === 0) ? (x(), L("li", K({
                key: 0,
                class: e.cx("emptyMessage"),
                role: "option"
              }, e.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [_e(e.$slots, "emptyfilter", {}, function() {
                return [Nn(oe(i.emptyFilterMessageText), 1)];
              })], 16)) : !e.options || e.options && e.options.length === 0 ? (x(), L("li", K({
                key: 1,
                class: e.cx("emptyMessage"),
                role: "option"
              }, e.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [_e(e.$slots, "empty", {}, function() {
                return [Nn(oe(i.emptyMessageText), 1)];
              })], 16)) : ae("", !0)], 16, Wb)];
            }),
            _: 2
          }, [e.$slots.loader ? {
            name: "loader",
            fn: dt(function(S) {
              var v = S.options;
              return [_e(e.$slots, "loader", {
                options: v
              })];
            }),
            key: "0"
          } : void 0]), 1040, ["items", "style", "disabled", "pt"])], 16), _e(e.$slots, "footer", {
            value: e.d_value,
            options: i.visibleOptions
          }), !e.options || e.options && e.options.length === 0 ? (x(), L("span", K({
            key: 1,
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenEmptyMessage"), {
            "data-p-hidden-accessible": !0
          }), oe(i.emptyMessageText), 17)) : ae("", !0), z("span", K({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenSelectedMessage"), {
            "data-p-hidden-accessible": !0
          }), oe(i.selectedMessageText), 17), z("span", K({
            ref: "lastHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: t[9] || (t[9] = function() {
              return i.onLastHiddenFocus && i.onLastHiddenFocus.apply(i, arguments);
            })
          }, e.ptm("hiddenLastFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16)], 16, Ub)) : ae("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo"])], 16, Bb);
}
Fu.render = Jb;
const Yb = ["aria-label"], Zb = { class: "nf-modal-header" }, Qb = { class: "nf-modal-title" }, Xb = { class: "nf-modal-body" }, ev = /* @__PURE__ */ It({
  __name: "ModalShell",
  props: {
    title: {}
  },
  emits: ["close-request"],
  setup(e, { emit: t }) {
    const n = t, r = /* @__PURE__ */ Te();
    function o(i) {
      i.stopPropagation(), i.key === "Escape" && n("close-request");
    }
    return Cn(() => r.value?.focus()), (i, s) => (x(), L("div", {
      class: "nf-modal-backdrop",
      onMousedown: s[1] || (s[1] = br((l) => n("close-request"), ["self"])),
      onKeydown: o
    }, [
      z("div", {
        ref_key: "panel",
        ref: r,
        class: "nf-modal nf-root",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": e.title,
        tabindex: "-1"
      }, [
        z("header", Zb, [
          z("span", Qb, oe(e.title), 1),
          G(F(ke), {
            class: "nf-icon-button",
            icon: "pi pi-times",
            title: "Close",
            onClick: s[0] || (s[0] = (l) => n("close-request"))
          })
        ]),
        z("div", Xb, [
          _e(i.$slots, "default")
        ])
      ], 8, Yb)
    ], 32));
  }
});
var tv = `
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
`, nv = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-textarea p-component", {
      "p-filled": n.$filled,
      "p-textarea-resizable ": r.autoResize,
      "p-textarea-sm p-inputfield-sm": r.size === "small",
      "p-textarea-lg p-inputfield-lg": r.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-textarea-fluid": n.$fluid
    }];
  }
}, rv = ve.extend({
  name: "textarea",
  style: tv,
  classes: nv
}), ov = {
  name: "BaseTextarea",
  extends: Xi,
  props: {
    autoResize: Boolean
  },
  style: rv,
  provide: function() {
    return {
      $pcTextarea: this,
      $parentInstance: this
    };
  }
};
function Er(e) {
  "@babel/helpers - typeof";
  return Er = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Er(e);
}
function iv(e, t, n) {
  return (t = sv(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function sv(e) {
  var t = lv(e, "string");
  return Er(t) == "symbol" ? t : t + "";
}
function lv(e, t) {
  if (Er(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Er(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Vn = {
  name: "Textarea",
  extends: ov,
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
        var t = this.$el.style.height, n = parseInt(t) || 0, r = this.$el.scrollHeight, o = !n || r > n, i = n && r < n;
        i ? (this.$el.style.height = "auto", this.$el.style.height = "".concat(this.$el.scrollHeight, "px")) : o && (this.$el.style.height = "".concat(r, "px"));
      }
    },
    onInput: function(t) {
      this.autoResize && this.resize(), this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return K(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return ft(iv({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, av = ["value", "name", "disabled", "aria-invalid", "data-p"];
function uv(e, t, n, r, o, i) {
  return x(), L("textarea", K({
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.invalid || void 0,
    "data-p": i.dataP,
    onInput: t[0] || (t[0] = function() {
      return i.onInput && i.onInput.apply(i, arguments);
    })
  }, i.attrs), null, 16, av);
}
Vn.render = uv;
const cv = new RegExp("(?<!\\{)\\{([A-Za-z_][A-Za-z0-9_]*)\\}(?!\\})", "g"), dv = /^[A-Za-z_][A-Za-z0-9_]*$/, fv = /* @__PURE__ */ new Set(["id", "name", "category", "template", "negative_prompt", "variables"]);
let pv = 1;
function es(e = "", t = "") {
  return { key: pv++, name: e, value: t };
}
function ts(e) {
  const t = Object.fromEntries(Object.entries(e).filter(([n]) => !fv.has(n)));
  return {
    id: e.id,
    name: e.name,
    category: e.category ?? "",
    template: e.template,
    negative_prompt: e.negative_prompt ?? "",
    variables: Object.entries(e.variables ?? {}).map(([n, r]) => es(n, r)),
    extra: t
  };
}
function hv() {
  return { id: null, name: "New template", category: "", template: "", negative_prompt: "", variables: [], extra: {} };
}
function gv(e) {
  return { ...ts(e), id: null, name: `${e.name} (copy)` };
}
function vo(e) {
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
function mv(e) {
  const t = [];
  e.name.trim() || t.push({ field: "name", message: "Name is required" });
  const n = /* @__PURE__ */ new Set();
  for (const r of e.variables)
    dv.test(r.name) ? n.has(r.name) && t.push({ field: "variables", message: `Duplicate variable name '${r.name}'` }) : t.push({ field: "variables", message: `Invalid variable name '${r.name}' (letters, digits and _ only)` }), n.add(r.name);
  return t;
}
function Tl(e) {
  return JSON.stringify(e, Object.keys(e).sort());
}
function Pl(e, t) {
  if (t === null || e.id === null) return !0;
  const n = vo(e), r = vo(ts(t));
  return Tl(n) !== Tl(r) || JSON.stringify(Object.entries(n.variables)) !== JSON.stringify(Object.entries(r.variables));
}
function bv(...e) {
  const t = [];
  for (const n of e)
    for (const r of n.matchAll(cv))
      t.includes(r[1]) || t.push(r[1]);
  return t;
}
function vv(e) {
  const t = new Set(e.variables.map((r) => r.name)), n = bv(e.template, e.negative_prompt).filter((r) => !t.has(r));
  for (const r of n) e.variables.push(es(r, ""));
  return n;
}
const Vu = /* @__PURE__ */ new Map();
function yv(e) {
  return e ? Vu.get(e) : void 0;
}
function Sv(e, t) {
  e && Vu.set(e, t);
}
function Du(e, t) {
  const n = /* @__PURE__ */ Te(/* @__PURE__ */ new Set()), r = /* @__PURE__ */ Te(!1), o = ye(() => bm(e.value, n.value, r.value)), i = ye(() => new Map(e.value.map((d) => [d.label, d.items.length])));
  function s() {
    const d = Ou(e.value, t.value);
    n.value = new Set(d ? [d] : []), r.value = !1;
  }
  function l(d) {
    d && !n.value.has(d) && (n.value = /* @__PURE__ */ new Set([...n.value, d]));
  }
  function a(d) {
    const f = new Set(n.value);
    f.delete(d) || f.add(d), n.value = f;
  }
  function c(d) {
    r.value = d.value.trim() !== "";
  }
  const u = (d) => r.value || n.value.has(d);
  return s(), { options: o, counts: i, reset: s, expand: l, toggle: a, onFilter: c, isExpanded: u };
}
const wv = ["aria-expanded"], _v = { class: "nf-group-label" }, $v = { class: "nf-group-count" }, Ru = /* @__PURE__ */ It({
  __name: "GroupToggle",
  props: {
    label: {},
    count: {},
    expanded: { type: Boolean }
  },
  emits: ["toggle"],
  setup(e) {
    return (t, n) => (x(), L("div", {
      class: "nf-group-toggle",
      "aria-expanded": e.expanded,
      onMousedown: n[0] || (n[0] = br(() => {
      }, ["prevent"])),
      onClick: n[1] || (n[1] = br((r) => t.$emit("toggle"), ["stop"]))
    }, [
      z("i", {
        class: ot(e.expanded ? "pi pi-chevron-down" : "pi pi-chevron-right")
      }, null, 2),
      z("span", _v, oe(e.label), 1),
      z("span", $v, oe(e.count), 1)
    ], 40, wv));
  }
}), xv = { class: "nf-listbox" }, Cv = { class: "nf-listbox-header" }, Ov = { class: "nf-listbox-list-container" }, Iv = {
  key: 0,
  class: "nf-overlay-list",
  role: "listbox"
}, kv = {
  class: "nf-overlay-group",
  role: "presentation"
}, Tv = ["aria-selected", "data-p-selected", "title", "onClick"], Pv = {
  key: 1,
  class: "nf-overlay-empty"
}, Lv = /* @__PURE__ */ It({
  __name: "TemplateList",
  props: {
    groups: {},
    selectedId: {}
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = /* @__PURE__ */ Te(""), i = ye(() => vm(n.groups, o.value)), s = Du(i, /* @__PURE__ */ Dd(n, "selectedId"));
    return qe(o, (l) => s.onFilter({ value: l })), qe([() => n.selectedId, () => n.groups], () => s.expand(Ou(n.groups, n.selectedId)), {
      immediate: !0
    }), (l, a) => (x(), L("div", xv, [
      z("div", Cv, [
        G(F(Fn), {
          modelValue: o.value,
          "onUpdate:modelValue": a[0] || (a[0] = (c) => o.value = c),
          placeholder: "Search",
          "aria-label": "Search templates"
        }, null, 8, ["modelValue"])
      ]),
      z("div", Ov, [
        F(s).options.value.length ? (x(), L("ul", Iv, [
          (x(!0), L(pe, null, it(F(s).options.value, (c) => (x(), L(pe, {
            key: c.label
          }, [
            z("li", kv, [
              G(Ru, {
                label: c.label,
                count: F(s).counts.value.get(c.label) ?? 0,
                expanded: F(s).isExpanded(c.label),
                onToggle: (u) => F(s).toggle(c.label)
              }, null, 8, ["label", "count", "expanded", "onToggle"])
            ]),
            (x(!0), L(pe, null, it(c.items, (u) => (x(), L("li", {
              key: u.id,
              class: "nf-overlay-option",
              role: "option",
              "aria-selected": u.id === e.selectedId,
              "data-p-selected": u.id === e.selectedId,
              title: u.name,
              onClick: (d) => r("select", u.id)
            }, oe(u.name), 9, Tv))), 128))
          ], 64))), 128))
        ])) : (x(), L("div", Pv, oe(o.value.trim() ? "No matches" : "No templates"), 1))
      ])
    ]));
  }
}), Ev = { class: "nf-editor-host" }, Av = { class: "nf-editor-list" }, Mv = { class: "nf-row" }, jv = {
  key: 0,
  class: "nf-editor-form"
}, Nv = {
  key: 0,
  class: "nf-notice",
  "data-level": "error"
}, Fv = { class: "nf-field-grid" }, Vv = { class: "nf-field-static" }, Dv = ["value"], Rv = { class: "nf-row nf-section-header" }, zv = {
  key: 1,
  class: "nf-var-table"
}, Bv = {
  key: 2,
  class: "nf-muted"
}, Hv = {
  key: 3,
  class: "nf-errors"
}, Kv = { class: "nf-preview" }, Uv = { class: "nf-preview-text" }, Wv = {
  key: 0,
  class: "nf-preview-text nf-preview-negative"
}, qv = {
  key: 1,
  class: "nf-warnings"
}, Gv = {
  key: 1,
  class: "nf-notice",
  "data-level": "error"
}, Jv = {
  key: 4,
  class: "nf-notice",
  "data-level": "error"
}, Yv = { class: "nf-row nf-editor-actions" }, Zv = {
  key: 1,
  class: "nf-editor-form nf-editor-empty"
}, Qv = {
  key: 0,
  class: "nf-notice",
  "data-level": "error"
}, zu = /* @__PURE__ */ It({
  __name: "TemplateEditor",
  props: {
    initialId: {},
    sessionKey: {}
  },
  setup(e, { expose: t }) {
    const n = e, r = /* @__PURE__ */ Te(null), o = /* @__PURE__ */ Te(null), i = /* @__PURE__ */ Te(!1), s = /* @__PURE__ */ Te(null), l = ye(() => r.value ? Vt(r.value) ?? null : null), a = ye(() => o.value !== null && Pl(o.value, l.value)), c = ye(() => o.value ? mv(o.value) : []), u = ye(() => fe.error?.code === "LIBRARY_CORRUPT"), d = ye(() => a.value && c.value.length === 0 && !i.value && !u.value), f = ye(() => Cu(fe.templates)), h = ye(() => [...new Set(fe.templates.map((R) => R.category).filter(Boolean))]), b = `nf-categories-${Math.random().toString(36).slice(2)}`;
    function y(R) {
      r.value = R?.id ?? null, o.value = R ? ts(R) : null, s.value = null;
    }
    function S() {
      y(fe.templates[0] ?? null);
    }
    async function v() {
      return !o.value || !a.value ? !0 : ss("Discard changes?", `"${o.value.name}" has unsaved changes. Discard them?`);
    }
    async function w(R) {
      !R || R === r.value || !await v() || y(Vt(R) ?? null);
    }
    async function T() {
      await v() && (r.value = null, o.value = hv(), s.value = null);
    }
    async function m() {
      if (!l.value || !await v()) return;
      const R = l.value;
      r.value = null, o.value = gv(R), s.value = null;
    }
    function $() {
      l.value ? y(l.value) : S();
    }
    function M(R) {
      return R instanceof _n ? R.status === 409 && R.code === "CONFLICT" ? "The library was changed elsewhere and has been reloaded. Review your edits and save again." : R.message : String(R);
    }
    async function P() {
      if (!(!o.value || !d.value)) {
        i.value = !0, s.value = null;
        try {
          const R = vo(o.value), H = o.value.id === null ? await dm(R) : await fm(o.value.id, R);
          y(H), bn("success", "Template saved", H.name);
        } catch (R) {
          s.value = M(R);
        } finally {
          i.value = !1;
        }
      }
    }
    async function B() {
      const R = l.value;
      if (R && await ss("Delete template?", `Delete "${R.name}" (${R.id})? This cannot be undone.`))
        try {
          await pm(R.id), bn("success", "Template deleted", R.name), S();
        } catch (H) {
          s.value = M(H);
        }
    }
    async function V() {
      await Vo();
    }
    function q() {
      o.value?.variables.push(es("", ""));
    }
    function U(R) {
      o.value && (o.value.variables = o.value.variables.filter((H) => H.key !== R));
    }
    function E() {
      if (!o.value) return;
      vv(o.value).length || bn("info", "No missing variables");
    }
    qe(l, (R, H) => {
      !o.value || o.value.id === null || !H || Pl(o.value, H) || (R ? y(R) : S());
    });
    const Y = /* @__PURE__ */ Te(null), te = /* @__PURE__ */ Te(null);
    let he, ie = 0;
    qe(
      o,
      () => {
        clearTimeout(he), he = setTimeout(re, 300);
      },
      { deep: !0 }
    );
    async function re() {
      const R = ++ie;
      if (!o.value || c.value.length) {
        Y.value = null, te.value = null;
        return;
      }
      try {
        const H = { ...vo(o.value), id: o.value.id ?? "draft" }, Q = await zn(`${Vr}/expand`, {
          method: "POST",
          body: JSON.stringify({ template: H, variables: {} })
        });
        if (R !== ie) return;
        Y.value = Q, te.value = null;
      } catch (H) {
        if (R !== ie) return;
        Y.value = null, te.value = M(H);
      }
    }
    function se(R) {
      (R.ctrlKey || R.metaKey) && R.key.toLowerCase() === "s" && (R.preventDefault(), P());
    }
    return Cn(async () => {
      const R = yv(n.sessionKey);
      if (R && (r.value = R.selectedId, o.value = R.form), await _u(), R?.form) return;
      const H = n.initialId ? Vt(n.initialId) : void 0;
      H ? y(H) : S();
    }), jr(() => {
      clearTimeout(he), Sv(n.sessionKey, { selectedId: r.value, form: o.value });
    }), t({ confirmDiscard: v, select: w }), (R, H) => (x(), L("div", Ev, [
      z("div", {
        class: "nf-editor",
        onKeydown: se
      }, [
        z("aside", Av, [
          z("div", Mv, [
            G(F(ke), {
              class: "nf-button nf-grow",
              icon: "pi pi-plus",
              label: "New",
              onClick: T
            }),
            G(F(ke), {
              class: "nf-icon-button",
              icon: "pi pi-refresh",
              title: "Reload from disk",
              onClick: V
            })
          ]),
          G(Lv, {
            groups: f.value,
            "selected-id": r.value,
            onSelect: w
          }, null, 8, ["groups", "selected-id"])
        ]),
        o.value ? (x(), L("section", jv, [
          F(fe).error ? (x(), L("div", Nv, " Library error: " + oe(F(fe).error.message), 1)) : ae("", !0),
          z("div", Fv, [
            H[4] || (H[4] = z("label", { class: "nf-field-label" }, "Name", -1)),
            G(F(Fn), {
              modelValue: o.value.name,
              "onUpdate:modelValue": H[0] || (H[0] = (Q) => o.value.name = Q),
              "aria-label": "Template name",
              invalid: c.value.some((Q) => Q.field === "name")
            }, null, 8, ["modelValue", "invalid"]),
            H[5] || (H[5] = z("label", { class: "nf-field-label" }, "Category", -1)),
            G(F(Fn), {
              modelValue: o.value.category,
              "onUpdate:modelValue": H[1] || (H[1] = (Q) => o.value.category = Q),
              "aria-label": "Category",
              list: b,
              placeholder: "(none)"
            }, null, 8, ["modelValue"]),
            H[6] || (H[6] = z("label", { class: "nf-field-label" }, "ID", -1)),
            z("span", Vv, oe(o.value.id ?? "assigned on first save"), 1)
          ]),
          z("datalist", { id: b }, [
            (x(!0), L(pe, null, it(h.value, (Q) => (x(), L("option", {
              key: Q,
              value: Q
            }, null, 8, Dv))), 128))
          ]),
          H[10] || (H[10] = z("label", { class: "nf-field-label" }, "Template", -1)),
          G(F(Vn), {
            modelValue: o.value.template,
            "onUpdate:modelValue": H[2] || (H[2] = (Q) => o.value.template = Q),
            "aria-label": "Template",
            rows: "4",
            "auto-resize": "",
            spellcheck: "false",
            placeholder: "{quality}, {character}"
          }, null, 8, ["modelValue"]),
          H[11] || (H[11] = z("label", { class: "nf-field-label" }, "Negative prompt", -1)),
          G(F(Vn), {
            modelValue: o.value.negative_prompt,
            "onUpdate:modelValue": H[3] || (H[3] = (Q) => o.value.negative_prompt = Q),
            "aria-label": "Negative prompt",
            rows: "2",
            "auto-resize": "",
            spellcheck: "false"
          }, null, 8, ["modelValue"]),
          z("div", Rv, [
            H[7] || (H[7] = z("span", { class: "nf-field-label nf-grow" }, "Variables (name / default)", -1)),
            G(F(ke), {
              class: "nf-button",
              icon: "pi pi-bolt",
              label: "Add missing",
              title: "Add variables for {placeholders} without a definition",
              onClick: E
            }),
            G(F(ke), {
              class: "nf-button",
              icon: "pi pi-plus",
              label: "Add",
              onClick: q
            })
          ]),
          o.value.variables.length ? (x(), L("div", zv, [
            (x(!0), L(pe, null, it(o.value.variables, (Q) => (x(), L(pe, {
              key: Q.key
            }, [
              G(F(Fn), {
                modelValue: Q.name,
                "onUpdate:modelValue": (Se) => Q.name = Se,
                placeholder: "name",
                spellcheck: "false",
                "aria-label": `Variable name ${Q.name}`
              }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
              G(F(Vn), {
                modelValue: Q.value,
                "onUpdate:modelValue": (Se) => Q.value = Se,
                rows: "1",
                "auto-resize": "",
                spellcheck: "false",
                placeholder: "(empty)",
                "aria-label": `Default value of ${Q.name}`
              }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
              G(F(ke), {
                class: "nf-icon-button",
                icon: "pi pi-trash",
                title: `Remove variable ${Q.name}`,
                onClick: (Se) => U(Q.key)
              }, null, 8, ["title", "onClick"])
            ], 64))), 128))
          ])) : (x(), L("div", Bv, "No variables")),
          c.value.length ? (x(), L("ul", Hv, [
            (x(!0), L(pe, null, it(c.value, (Q, Se) => (x(), L("li", { key: Se }, oe(Q.message), 1))), 128))
          ])) : ae("", !0),
          z("div", Kv, [
            H[8] || (H[8] = z("div", { class: "nf-preview-label" }, "preview (defaults)", -1)),
            Y.value ? (x(), L(pe, { key: 0 }, [
              z("pre", Uv, oe(Y.value.positive || " "), 1),
              Y.value.negative ? (x(), L("pre", Wv, oe(Y.value.negative), 1)) : ae("", !0),
              Y.value.warnings.length ? (x(), L("ul", qv, [
                (x(!0), L(pe, null, it(Y.value.warnings, (Q, Se) => (x(), L("li", { key: Se }, oe(Q.message), 1))), 128))
              ])) : ae("", !0)
            ], 64)) : te.value ? (x(), L("div", Gv, oe(te.value), 1)) : ae("", !0)
          ]),
          s.value ? (x(), L("div", Jv, oe(s.value), 1)) : ae("", !0),
          z("div", Yv, [
            G(F(ke), {
              class: "nf-button nf-button-primary",
              icon: "pi pi-save",
              label: i.value ? "Saving…" : "Save",
              disabled: !d.value,
              title: "Save (Ctrl+S)",
              onClick: P
            }, null, 8, ["label", "disabled"]),
            G(F(ke), {
              class: "nf-button",
              icon: "pi pi-undo",
              label: "Revert",
              disabled: !a.value,
              onClick: $
            }, null, 8, ["disabled"]),
            H[9] || (H[9] = z("span", { class: "nf-grow" }, null, -1)),
            G(F(ke), {
              class: "nf-button",
              icon: "pi pi-copy",
              label: "Duplicate",
              disabled: !l.value,
              onClick: m
            }, null, 8, ["disabled"]),
            G(F(ke), {
              class: "nf-button nf-button-danger",
              icon: "pi pi-trash",
              label: "Delete",
              disabled: !l.value || u.value,
              onClick: B
            }, null, 8, ["disabled"])
          ])
        ])) : (x(), L("section", Zv, [
          F(fe).error ? (x(), L("div", Qv, "Library error: " + oe(F(fe).error.message), 1)) : ae("", !0),
          H[12] || (H[12] = z("p", { class: "nf-muted" }, "No template selected.", -1)),
          G(F(ke), {
            class: "nf-button",
            icon: "pi pi-plus",
            label: "Create a template",
            onClick: T
          })
        ]))
      ], 32)
    ]));
  }
}), Xv = /* @__PURE__ */ It({
  __name: "EditorModal",
  props: {
    initialId: {},
    onClose: { type: Function }
  },
  setup(e, { expose: t }) {
    const n = e, r = /* @__PURE__ */ Te();
    async function o() {
      await (r.value?.confirmDiscard() ?? !0) && n.onClose();
    }
    return t({ select: (i) => r.value?.select(i) }), (i, s) => (x(), Le(ev, {
      title: "Prompt Templates",
      onCloseRequest: o
    }, {
      default: dt(() => [
        G(zu, {
          ref_key: "editor",
          ref: r,
          "initial-id": e.initialId
        }, null, 8, ["initial-id"])
      ]),
      _: 1
    }));
  }
});
let Zr = null;
function ey(e = null) {
  if (Zr) {
    Zr.select(e);
    return;
  }
  const t = document.createElement("div");
  t.className = "nf-modal-container", document.body.appendChild(t);
  const n = Fr(t, Xv, {
    initialId: e,
    onClose: () => {
      n.unmount(), t.remove(), Zr = null;
    }
  });
  Zr = n.instance;
}
const ty = {
  key: 0,
  class: "nf-vars"
}, ny = ["title"], ry = /* @__PURE__ */ It({
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
    return (r, o) => Object.keys(e.defaults).length ? (x(), L("div", ty, [
      (x(!0), L(pe, null, it(e.defaults, (i, s) => (x(), L("div", {
        key: s,
        class: "nf-var"
      }, [
        z("span", {
          class: "nf-var-label",
          title: `{${s}}`
        }, oe(s), 9, ny),
        e.connectedInputs?.includes(String(s)) ? (x(), Le(F(Vn), {
          key: 0,
          class: "nf-var-input",
          "model-value": "",
          placeholder: `(from ${s})`,
          title: `Replaced by the connected ${s} input`,
          disabled: "",
          rows: "1"
        }, null, 8, ["placeholder", "title"])) : (x(), Le(F(Vn), {
          key: 1,
          class: "nf-var-input",
          "model-value": e.values[s] ?? i,
          placeholder: i ? `default: ${i}` : "(empty)",
          disabled: e.disabled,
          rows: "1",
          "auto-resize": "",
          spellcheck: "false",
          "onUpdate:modelValue": (l) => n("update", String(s), l ?? "")
        }, null, 8, ["model-value", "placeholder", "disabled", "onUpdate:modelValue"])),
        G(F(ke), {
          class: "nf-icon-button",
          icon: "pi pi-undo",
          disabled: e.disabled || e.connectedInputs?.includes(String(s)) || (e.values[s] ?? i) === i,
          title: "Reset to default",
          onClick: (l) => n("reset", String(s))
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ])) : ae("", !0);
  }
}), oy = { class: "nf-row" }, iy = ["data-level"], sy = {
  key: 2,
  class: "nf-preview"
}, ly = { class: "nf-preview-text" }, ay = { class: "nf-preview-text nf-preview-negative" }, uy = {
  key: 1,
  class: "nf-warnings"
}, cy = {
  key: 3,
  class: "nf-notice",
  "data-level": "error"
}, dy = /* @__PURE__ */ It({
  __name: "PromptTemplateNode",
  props: {
    controller: {}
  },
  setup(e) {
    const t = e, n = t.controller.state, r = ye(() => Cu(fe.templates)), o = ye(() => Vt(n.templateId) ? n.templateId : null), i = Du(r, o), s = ye(() => n.templateId ? `${n.snapshot?.name ?? n.templateId} (not in library)` : "Select a template");
    function l(m) {
      m && m !== n.templateId && t.controller.selectTemplate(m);
    }
    async function a() {
      await Vo(), t.controller.captureSnapshot(), t.controller.fit();
    }
    Cn(async () => {
      await _u(), t.controller.fit();
    });
    const c = ye(
      () => ym(n.templateId, Vt(n.templateId), n.snapshot, n.pinned)
    ), u = {
      none: "",
      no_template: "",
      pinned: "Pinned: using the snapshot",
      pinned_without_snapshot: "Pinned, but this node has no snapshot",
      snapshot_outdated: "Template changed since the last snapshot (updated on next queue)",
      template_missing: "Template not in library: using the snapshot",
      not_found: "Template not found and no snapshot"
    }, d = ye(() => {
      if (fe.error) return { level: "error", text: `Library error: ${fe.error.message}` };
      const m = c.value.notice;
      return u[m] ? { level: m === "not_found" || m === "pinned_without_snapshot" ? "error" : m === "pinned" ? "info" : "warn", text: u[m] } : null;
    }), f = () => Object.fromEntries(n.connectedInputs.map((m) => [m, `‹from ${m}›`])), h = /* @__PURE__ */ Te(null), b = /* @__PURE__ */ Te(null);
    let y = 0, S;
    function v() {
      clearTimeout(S), S = setTimeout(w, 250);
    }
    async function w() {
      const m = c.value.template, $ = ++y;
      if (!m) {
        h.value = null, b.value = null;
        return;
      }
      try {
        const M = await zn(`${Vr}/expand`, {
          method: "POST",
          body: JSON.stringify({
            template: m,
            variables: n.variables,
            inputs: f()
          })
        });
        if ($ !== y) return;
        h.value = M, b.value = null;
      } catch (M) {
        if ($ !== y) return;
        h.value = null, b.value = M instanceof _n ? `[${M.code}] ${M.message}` : String(M);
      }
      t.controller.fit();
    }
    qe(() => [c.value.template, n.variables, n.connectedInputs], v, {
      immediate: !0,
      deep: !0
    });
    function T(m) {
      let $ = m.target;
      for (; $ && $ !== m.currentTarget; ) {
        if ($.scrollHeight > $.clientHeight && getComputedStyle($).overflowY !== "visible") {
          m.stopPropagation();
          return;
        }
        $ = $.parentElement;
      }
    }
    return (m, $) => (x(), L("div", {
      class: "nf-root nf-pt",
      onWheel: T
    }, [
      z("div", oy, [
        G(F(Fu), {
          class: "nf-grow",
          "model-value": o.value,
          options: F(i).options.value,
          "option-label": "name",
          "option-value": "id",
          "option-group-label": "label",
          "option-group-children": "items",
          placeholder: s.value,
          filter: F(fe).templates.length > 8,
          "reset-filter-on-hide": "",
          loading: F(fe).loading,
          "append-to": "body",
          onBeforeShow: $[0] || ($[0] = (M) => F(i).reset()),
          onFilter: F(i).onFilter,
          "onUpdate:modelValue": l
        }, {
          value: dt(({ value: M, placeholder: P }) => [
            Nn(oe(M && F(Vt)(M)?.name || P), 1)
          ]),
          optiongroup: dt(({ option: M }) => [
            G(Ru, {
              label: M.label,
              count: F(i).counts.value.get(M.label) ?? 0,
              expanded: F(i).isExpanded(M.label),
              onToggle: (P) => F(i).toggle(M.label)
            }, null, 8, ["label", "count", "expanded", "onToggle"])
          ]),
          _: 1
        }, 8, ["model-value", "options", "placeholder", "filter", "loading", "onFilter"]),
        G(F(ke), {
          class: "nf-icon-button",
          icon: "pi pi-refresh",
          title: "Reload templates",
          disabled: F(fe).loading,
          onClick: a
        }, null, 8, ["disabled"]),
        G(F(ke), {
          class: "nf-icon-button",
          icon: "pi pi-pencil",
          title: "Edit templates",
          onClick: $[1] || ($[1] = (M) => F(ey)(F(n).templateId || null))
        })
      ]),
      d.value ? (x(), L("div", {
        key: 0,
        class: "nf-notice",
        "data-level": d.value.level
      }, oe(d.value.text), 9, iy)) : ae("", !0),
      c.value.template ? (x(), Le(ry, {
        key: 1,
        defaults: c.value.template.variables,
        values: F(n).variables,
        "connected-inputs": F(n).connectedInputs,
        onUpdate: $[2] || ($[2] = (M, P) => e.controller.setVariable(M, P)),
        onReset: $[3] || ($[3] = (M) => e.controller.resetVariable(M))
      }, null, 8, ["defaults", "values", "connected-inputs"])) : ae("", !0),
      h.value ? (x(), L("div", sy, [
        $[5] || ($[5] = z("div", { class: "nf-preview-label" }, "positive", -1)),
        z("pre", ly, oe(h.value.positive || " "), 1),
        h.value.negative ? (x(), L(pe, { key: 0 }, [
          $[4] || ($[4] = z("div", { class: "nf-preview-label" }, "negative", -1)),
          z("pre", ay, oe(h.value.negative), 1)
        ], 64)) : ae("", !0),
        h.value.warnings.length ? (x(), L("ul", uy, [
          (x(!0), L(pe, null, it(h.value.warnings, (M, P) => (x(), L("li", { key: P }, oe(M.message), 1))), 128))
        ])) : ae("", !0)
      ])) : b.value ? (x(), L("div", cy, oe(b.value), 1)) : ae("", !0)
    ], 32));
  }
}), Ll = 320;
function fy(e) {
  for (const l of [ut.templateId, ut.variables, ut.snapshot]) {
    const a = eo(e, l);
    a && Hu(a);
  }
  const t = new Sm(e), n = eo(e, ut.pinSnapshot);
  n && Ku(n, () => t.syncFromWidgets()), El(e, () => t.syncFromWidgets()), Wu(e, () => t.syncConnections());
  const r = document.createElement("div");
  r.className = "nf-widget-container";
  const o = Ai(e, "nf_prompt_template_ui", r, {
    getMinHeight: () => Math.max(60, r.firstElementChild?.offsetHeight ?? 0)
  });
  o.beforeQueued = () => t.captureSnapshot();
  const { unmount: i } = Fr(r, dy, { controller: t }), s = o.onRemove;
  o.onRemove = () => {
    i(), s?.call(o);
  }, e.size[0] < Ll && e.setSize?.([Ll, e.size[1]]);
}
const py = /* @__PURE__ */ It({
  __name: "SidebarEditor",
  setup(e) {
    return (t, n) => (x(), L("div", {
      class: "nf-root nf-sidebar",
      onKeydown: n[0] || (n[0] = br(() => {
      }, ["stop"]))
    }, [
      n[1] || (n[1] = z("header", { class: "nf-sidebar-header" }, "Prompt Templates", -1)),
      G(zu, { "session-key": "sidebar" })
    ], 32));
  }
});
function hy() {
  let e = null;
  qu({
    id: "nf-prompt-templates",
    title: "Prompt Templates",
    tooltip: "NF Prompt Templates",
    icon: "pi pi-file-edit",
    render(t) {
      e?.(), e = Fr(t, py).unmount;
    },
    destroy() {
      e?.(), e = null;
    }
  });
}
function gy() {
  const e = new URL(
    /* @vite-ignore */
    "./main.css",
    import.meta.url
  ).href;
  if (document.querySelector(`link[href="${e}"]`)) return;
  const t = document.createElement("link");
  t.rel = "stylesheet", t.href = e, document.head.appendChild(t);
}
gy();
Bu({
  name: "NyaFu.NFSuite",
  setup() {
    hy();
  },
  nodeCreated(e) {
    e.comfyClass === cm ? fy(e) : e.comfyClass === Lg ? Mg(e) : e.comfyClass === yl && nm(e);
  },
  // Only this node's menu gets the items (right-clicking other nodes or the canvas is unchanged).
  getNodeMenuItems(e) {
    return e.comfyClass !== yl ? [] : am(e);
  }
});
//# sourceMappingURL=main.js.map
