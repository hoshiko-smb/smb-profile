import { useState, useRef, useEffect, useCallback } from "react";

// ── カラー ──────────────────────────────────────────────────────
const C = {
  bg:"#f5f5f5", white:"#ffffff", dark:"#222222",
  textDark:"#222222", textMid:"#555555", textLight:"#888888",
  border:"#e0e0e0", borderFocus:"#999999",
  gold:"#c8a96e", goldBg:"#fdf8f0", goldBd:"#e0c890",
  green:"#2e7d52", greenBg:"#eaf4ee", greenBd:"#88ccaa",
  blue:"#1a5fa8", blueBg:"#e8f0fa",
  amber:"#b8860b", amberBg:"#fdf6e3", amberBd:"#e0c890",
  red:"#c0392b", redBg:"#fdecea",
};

// ── 得意分野（実際のサイトのカテゴリと一致） ───────────────────
const CATEGORIES = [
  "DX\u30FB\u696D\u52D9\u52B9\u7387\u5316",
  "\u30C7\u30B6\u30A4\u30F3",
  "\u30DE\u30FC\u30B1\u30C6\u30A3\u30F3\u30B0",
  "\u55B6\u696D",
  "\u63A1\u7528",
  "\u65B0\u898F\u4E8B\u696D",
  "\u7D4C\u55B6\u30FB\u7BA1\u7406",
];
const CAT_COL = {
  "DX\u30FB\u696D\u52D9\u52B9\u7387\u5316":{bg:"#e8f4fb",tx:"#1a6fa8",bd:"#a8d4ee"},
  "\u30C7\u30B6\u30A4\u30F3":{bg:"#f3eefb",tx:"#6a3fa8",bd:"#c8aaee"},
  "\u30DE\u30FC\u30B1\u30C6\u30A3\u30F3\u30B0":{bg:"#fdf6e3",tx:"#b8860b",bd:"#e8cc88"},
  "\u55B6\u696D":{bg:"#eaf4ee",tx:"#2e7d52",bd:"#88ccaa"},
  "\u63A1\u7528":{bg:"#fdecea",tx:"#c0392b",bd:"#eeaaaa"},
  "\u65B0\u898F\u4E8B\u696D":{bg:"#fef0e6",tx:"#c0621b",bd:"#eebb88"},
  "\u7D4C\u55B6\u30FB\u7BA1\u7406":{bg:"#eeeefc",tx:"#3a3ab0",bd:"#aaaaee"},
};

// ── AIインタビュー質問（実際のフィールドに合わせて再設計） ───────
const IQ = [
  { id:"name",
    q:"\u304A\u540D\u524D\u3068\u5C4B\u53F7\u30FB\u4F1A\u793E\u540D\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044\u3002\u5C4B\u53F7\u304C\u306A\u3044\u5834\u5408\u306F\u304A\u540D\u524D\u3068\u3075\u308A\u304C\u306A\u306E\u307F\u3067\u5927\u4E08\u592B\u3067\u3059\u3002",
    hint:"\u4F8B\uFF1A\u661F\u5B50 \u8C6A\u5FD7\uFF08\u307B\u3057\u3053 \u3064\u3088\u3057\uFF09\uFF0FLacial\uFF08\u30E9\u30B7\u30A2\u30EB\uFF09\u3000\u307E\u305F\u306F\u3000\u7530\u4E2D\u592A\u90CE\uFF08\u305F\u306A\u304B \u305F\u308D\u3046\uFF09\uFF0F\u682A\u5F0F\u4F1A\u793EABC" },
  { id:"role",
    q:"\u5F79\u8077\u30FB\u8082\u66F8\u304D\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044\u3002",
    hint:"\u4F8B\uFF1A\u4EE3\u8868\u3001\u30D5\u30EA\u30FC\u30E9\u30F3\u30B9\u30A8\u30F3\u30B8\u30CB\u30A2\u3001\u8A2D\u8A08\u5E2B" },
  { id:"categories",
    q:"\u5F97\u610F\u5206\u91CE\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044\u3002",
    hint:"\u4F8B\uFF1A\u63A1\u7528\u3001DX\u30FB\u696D\u52D9\u52B9\u7387\u5316\u3001\u30DE\u30FC\u30B1\u30C6\u30A3\u30F3\u30B0\u306A\u3069" },
  { id:"career",
    q:"\u3053\u308C\u307E\u3067\u306E\u7D4C\u6B74\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044\u3002\u4F1A\u793E\u540D\u30FB\u5F79\u8077\u30FB\u5728\u7C4D\u671F\u9593\u306E\u30BB\u30C3\u30C8\u3067\u8907\u6570\u793E\u8A18\u8F09\u3067\u304D\u307E\u3059\u3002",
    hint:"\u4F8B\uFF1A\u682A\u5F0F\u4F1A\u793EA / \u55B6\u696D\u30DE\u30CD\u30FC\u30B8\u30E3\u30FC / 3\u5E74\u3001\u682A\u5F0F\u4F1A\u793EB / \u4E8B\u696D\u90E8\u9577 / 5\u5E74" },
  { id:"achievements",
    q:"\u904E\u53BB\u306E\u5B9F\u7E3E\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044\u3002",
    hint:"\u5404\u793E\u3067\u306E\u5177\u4F53\u7684\u306A\u6210\u679C\u30FB\u30A8\u30D4\u30BD\u30FC\u30C9\u3092\u81EA\u7531\u306B" },
  { id:"worktime",
    q:"\u7A3C\u50CD\u53EF\u80FD\u6642\u9593\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044\u3002",
    hint:"\u4F8B\uFF1A\u903140\u6642\u9593\u3001\u9031\u306B2\u30033\u65E5\u3001\u8981\u76F8\u8AC7" },
  { id:"reward",
    q:"\u5E0C\u671B\u3059\u308B\u5831\u916C\u5F62\u614B\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044\u3002",
    hint:"\u4F8B\uFF1A\u6642\u7D6530,000\u5186\u3001\u6708\u984D30\u4E07\u5186\u3001\u8981\u76F8\u8AC7" },
  { id:"message",
    q:"\u4E2D\u5C0F\u4F01\u696D\u306E\u65B9\u3078\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u8074\u304B\u305B\u3066\u304F\u3060\u3055\u3044\u3002",
    hint:"\u3069\u3093\u306A\u4F01\u696D\u3068\u51FA\u4F1A\u3044\u305F\u3044\u304B\u3001\u81EA\u5206\u306E\u5F37\u307F\u3084\u60F3\u3044\u3092\u81EA\u7531\u306B" },
  { id:"sns",
    q:"\u30B5\u30A4\u30C8\u30FBSNS\u30FB\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u306EURL\u304C\u3042\u308C\u3070\u6559\u3048\u3066\u304F\u3060\u3055\u3044\u3002\u306A\u3051\u308C\u3070\u300C\u306A\u3057\u300D\u3067\u5927\u4E08\u592B\u3067\u3059\u3002",
    hint:"\u4F8B\uFF1A https://example.com\u3001https://twitter.com/xxx" },
];

const AI_SYS = "\u3042\u306A\u305F\u306F\u300C\u4E2D\u5C0F\u4F01\u696D\u5171\u548C\u56FD\u300D\u4F1A\u54E1\u306E\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u4F5C\u6210AI\u3067\u3059\u3002\u30D5\u30EC\u30F3\u30C9\u30EA\u30FC\u306B\u30A4\u30F3\u30BF\u30D3\u30E5\u30FC\u3057\u3001\u5168\u60C5\u5831\u304C\u63C3\u3063\u305F\u3089\u4E0B\u8A18JSON\u3092\u51FA\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u56DE\u7B54\u304C\u8584\u3044\u5834\u5408\u306F\u81EA\u7136\u306B\u6DF1\u6398\u308A\u3057\u3001\u5341\u5206\u306A\u3089\u300C\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059\uFF01\u300D\u3068\u8FF0\u3079\u6B21\u306E\u8CEA\u554F\u3078\u3002\nJSON\u5F62\u5F0F\uFF1A{\"name\":\"\",\"kana\":\"\",\"company\":\"\",\"role\":\"\",\"categories\":[],\"career\":[{\"company\":\"\",\"role\":\"\",\"period\":\"\"}],\"achievements\":\"\",\"worktime\":\"\",\"reward\":\"\",\"message\":\"\",\"sns\":\"\"}";
const POLISH_SYS = "\u4E2D\u5C0F\u4F01\u696D\u5171\u548C\u56FD\u4F1A\u54E1\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u306E\u30E9\u30A4\u30BF\u30FC\u3067\u3059\u3002\u4E0B\u66F8\u304D\u3092\u9B45\u529B\u7684\u306A\u6587\u7AE0\u306B\u78E8\u3044\u3066\u304F\u3060\u3055\u3044\u3002\u4E8B\u5B9F\u30FB\u6570\u5B57\u30FB\u56FA\u6709\u540D\u8A5E\u306F\u5909\u3048\u305A\u3001\u8457\u8005\u306E\u58F0\u3092\u4FDD\u3064\u3002\u8FD4\u7B54\u306F\u30EA\u30E9\u30A4\u30C8\u5F8C\u306E\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u3002";

// ── サンプルデータ（星子さんの実際のページに基づく） ─────────────
const SAMPLE = {
  name:"\u661F\u5B50 \u8C6A\u5FD7", kana:"\u307B\u3057\u3053 \u3064\u3088\u3057",
  company:"Lacial\uFF08\u30E9\u30B7\u30A2\u30EB\uFF09", role:"\u4EE3\u8868",
  categories:["\u63A1\u7528","DX\u30FB\u696D\u52D9\u52B9\u7387\u5316","\u65B0\u898F\u4E8B\u696D","\u7D4C\u55B6\u30FB\u7BA1\u7406","\u30DE\u30FC\u30B1\u30C6\u30A3\u30F3\u30B0"],
  career:[
    {company:"\u682A\u5F0F\u4F1A\u793E\u30A2\u30A4\u30FB\u30D1\u30C3\u30B7\u30E7\u30F3", role:"\u4F01\u753B\u55B6\u696D\u90E8 \u30EA\u30FC\u30C0\u30FC \u517C \u30A2\u30A6\u30C8\u30BD\u30FC\u30B7\u30F3\u30B0\u4E8B\u696D\u90E8", period:"\u7D042\u5E74"},
    {company:"\u682A\u5F0F\u4F1A\u793E\u30DE\u30A4\u30CA\u30D3", role:"\u6559\u80B2\u7814\u4FEE\u4E8B\u696D\u90E8 \u55B6\u696D", period:"\u7D042\u5E74"},
    {company:"\u682A\u5F0F\u4F1A\u793E\u30A2\u30C9\u30F4\u30A1\u30F3\u30C6\u30FC\u30B8", role:"\u63A1\u7528\u306E\u30DF\u30AB\u30BF \u4E8B\u696D\u8CAC\u4EFB\u8005", period:"\u7D043\u5E74"},
    {company:"\u682A\u5F0F\u4F1A\u793EFloom", role:"\u57F7\u884C\u5F79\u54E1 \u517C \u63A1\u7528\u8CAC\u4EFB\u8005", period:"2022\u5E74\u301C\u73FE\u5728"},
    {company:"goodluck\u682A\u5F0F\u4F1A\u793E", role:"\u57F7\u884C\u5F79\u54E1 \u517C \u5B66\u751F\u4EBA\u4E8B\u4E8B\u696D\u8CAC\u4EFB\u8005", period:"2024\u5E749\u6708\u301C\u73FE\u5728"},
  ],
  achievements:"\u25FC\uFE0E\u682A\u5F0F\u4F1A\u793E\u30A2\u30A4\u30FB\u30D1\u30C3\u30B7\u30E7\u30F3\uFF1A\u793E\u9577\u55B6\u696D\u3068\u30A2\u30A6\u30C8\u30BD\u30FC\u30B9\u4E8B\u696D\u306E\u4E8B\u696D\u5316\n\u30FB\u5F93\u696D\u54E1300\u540D\u4EE5\u4E0B\u306E\u4E2D\u5C0F\u30FB\u30D9\u30F3\u30C1\u30E3\u30FC\u4F01\u696D\u3092\u5BFE\u8C61\u306B\u3001\u65B0\u5352\u63A1\u7528\u306E\u65B0\u898F\u958B\u62D3\u304B\u3089\u4F01\u753B\u30FB\u5B9F\u884C\u307E\u3067\u3092\u4E00\u6C17\u901A\u8CAB\u3067\u652F\u63F4\n\u30FB\u5730\u65B9\u63A1\u7528\u30A4\u30D9\u30F3\u30C8\u306E\u53F8\u4F1A\u30FB\u904B\u55B6\u3084\u3001RPO\u4E8B\u696D\u306E\u7ACB\u3061\u4E0A\u3052\u3092\u7D4C\u9A13\n\n\u25FC\uFE0E\u682A\u5F0F\u4F1A\u793E\u30DE\u30A4\u30CA\u30D3\uFF1A\u4E2D\u5C0F\u4F01\u696D\uFF5E\u5927\u624B\u4F01\u696D\u306B\u304A\u3051\u308B\u6559\u80B2\u7814\u4FEE\u30FB\u7D44\u7E54\u958B\u767A\n\u30FB\u5404\u4F01\u696D\u306E\u8AB2\u984C\u306B\u5408\u308F\u305B\u305F\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA\u7814\u4FEE\u3092\u8907\u6570\u8A2D\u8A08\n\u30FB\u30B3\u30ED\u30CA\u7985\u306B\u304A\u3051\u308B\u7814\u4FEE\u306E\u5B8C\u5168\u30AA\u30F3\u30E9\u30A4\u30F3\u5316\u3078\u306E\u79FB\u884C\u3092\u4E3B\u5C0E\n\n\u25FC\uFE0E\u682A\u5F0F\u4F1A\u793E\u30A2\u30C9\u30F4\u30A1\u30F3\u30C6\u30FC\u30B8\uFF1A\u65B0\u898F\u4E8B\u696D\u300C\u63A1\u7528\u306E\u30DF\u30AB\u30BF\u300D\u306E\u4E8B\u696D\u8CAC\u4EFB\u8005\n\u30FB\u63A1\u7528\u5B9F\u52D9\u306E\u52B9\u7387\u5316\uFF08DX\uFF09\u3068\u81EA\u793E\u63A1\u7528\u529B\u306E\u5F37\u5316\u3092\u8EF8\u306B\u3001\u4F01\u696D\u306E\u63A1\u7528\u30B3\u30B9\u30C8\u6700\u9069\u5316\u3092\u652F\u63F4\n\n\u25FC\uFE0E\u682A\u5F0F\u4F1A\u793EFloom\uFF1A\u56DB\u534A\u4E16\u7D00\u4EE5\u4E0A\u7D9A\u304F\u4F01\u696D\u306E\u30D6\u30E9\u30F3\u30C7\u30A3\u30F3\u30B0\u652F\u63F4\n\u30FB\u55B6\u696D\u30B3\u30B9\u30C8\u3092\u304B\u3051\u305A\u306B\u7D39\u4ECB\u3060\u3051\u3067\u5E74\u9593\u6570\u5343\u4E07\u306E\u58F2\u4E0A\u304C\u7ACB\u3064\u4ED5\u7D44\u307F\u3092\u30BC\u30ED\u304B\u3089\u78BA\u7ACB\n\n\u25FC\uFE0Egoodluck\u682A\u5F0F\u4F1A\u793E\uFF1A\u5B66\u751F\u4EBA\u4E8B\u30E2\u30C7\u30EB\u306E\u69CB\u7BC9\u3068\u4E8B\u696D\u6210\u9577\n\u30FB10\u5104\u5186\u898F\u6A21\u306E\u58F2\u4E0A\u76EE\u6A19\u9054\u6210\u306B\u5411\u3051\u305F\u6226\u7565\u30ED\u30FC\u30C9\u30DE\u30C3\u30D7\u3092\u7B56\u5B9A",
  worktime:"\u8981\u76F8\u8AC7",
  reward:"\u8981\u76F8\u8AC7\uFF08\u304A\u91D1\u3088\u308A\u3082\u60F3\u3044\u3092\u91CD\u8996\u3057\u3066\u652F\u63F4\u3057\u3066\u3044\u307E\u3059\uFF09",
  message:"\u306F\u3058\u3081\u307E\u3057\u3066\u3002\u661F\u5B50\uFF08\u307B\u3057\u3053\uFF09\u3067\u3059\u3002\n\u79C1\u306F\u3053\u308C\u307E\u3067\u3001\u65B0\u5352\u3067\u98DB\u3073\u8FBC\u3093\u3060\u793E\u54581 0\u540D\u306E\u30D9\u30F3\u30C1\u30E3\u30FC\u304B\u3089\u30011\u4E07\u4EBA\u898F\u6A21\u306E\u5927\u624B\u4F01\u696D\u3001\u305D\u3057\u3066\u73FE\u5728\u306E\u4E8B\u696D\u7D4C\u55B6\u306B\u81F3\u308B\u307E\u3067\u3001\u4E00\u8CAB\u3057\u3066\u300C\u63A1\u7528\u3068\u6559\u80B2\u300D\u306E\u73FE\u5834\u306B\u8EAB\u3092\u7F6E\u3044\u3066\u304D\u307E\u3057\u305F\u3002\n\n\u63A1\u7528\u306E\u672C\u8CEA\u3068\u306F\u5358\u306A\u308B\u300C\u624B\u6CD5\u300D\u3067\u306F\u306A\u304F\u3001\u305D\u306E\u4F01\u696D\u304C\u6301\u3064\u300C\u3089\u3057\u3055\u300D\u3092\u5F15\u304D\u51FA\u3057\u3001\u300C\u30AB\u30BF\u30C1\u300D\u306B\u3057\u3066\u4F1A\u793E\u306E\u9B45\u529B\u3092\u4F1A\u793E\u306E\u5185\u5916\u306B\u4F1D\u3048\u308B\u3053\u3068\u3060\u3068\u3044\u3046\u3053\u3068\u3067\u3059\u3002\n\n\u3069\u3093\u306A\u5C0F\u3055\u306A\u9055\u548C\u611F\u3067\u3082\u69CB\u3044\u307E\u305B\u3093\u3002\u307E\u305A\u306F\u8CB4\u793E\u306E\u300C\u3089\u3057\u3055\u300D\u3092\u79C1\u306B\u8074\u304B\u305B\u3066\u304F\u3060\u3055\u3044\uFF01",
  sns:"",
  photo:null,
};

// ════════════════════════════════════════════════
// 写真トリマー
// ════════════════════════════════════════════════
function PhotoTrimmer({ onConfirm, onCancel, existingPhoto }) {
  const [imgSrc,setImgSrc]=useState(existingPhoto||null);
  const [imgNatW,setImgNatW]=useState(0);
  const [imgNatH,setImgNatH]=useState(0);
  const [offset,setOffset]=useState({x:0,y:0});
  const [scale,setScale]=useState(1);
  const [dragging,setDragging]=useState(false);
  const [dragStart,setDragStart]=useState(null);
  const [offsetStart,setOffsetStart]=useState(null);
  const fileRef=useRef(null);
  const canvasRef=useRef(null);
  const OUT=600; const PREV=280;

  const loadImage=(src)=>{
    const img=new Image();
    img.onload=()=>{
      setImgNatW(img.naturalWidth);setImgNatH(img.naturalHeight);
      const minSide=Math.min(img.naturalWidth,img.naturalHeight);
      setScale(PREV/minSide);setOffset({x:0,y:0});
    };
    img.src=src;
  };
  const handleFile=(file)=>{
    if(!file||!file.type.startsWith("image/"))return;
    const r=new FileReader();
    r.onload=e=>{setImgSrc(e.target.result);loadImage(e.target.result);};
    r.readAsDataURL(file);
  };
  const onMouseDown=(e)=>{e.preventDefault();setDragging(true);setDragStart({x:e.clientX,y:e.clientY});setOffsetStart({...offset});};
  const onMouseMove=useCallback((e)=>{if(!dragging)return;setOffset({x:offsetStart.x+(e.clientX-dragStart.x),y:offsetStart.y+(e.clientY-dragStart.y)});},[dragging,dragStart,offsetStart]);
  const onMouseUp=useCallback(()=>setDragging(false),[]);
  const onTouchStart=(e)=>{const t=e.touches[0];setDragging(true);setDragStart({x:t.clientX,y:t.clientY});setOffsetStart({...offset});};
  const onTouchMove=useCallback((e)=>{if(!dragging)return;const t=e.touches[0];setOffset({x:offsetStart.x+(t.clientX-dragStart.x),y:offsetStart.y+(t.clientY-dragStart.y)});},[dragging,dragStart,offsetStart]);
  const onTouchEnd=useCallback(()=>setDragging(false),[]);
  useEffect(()=>{
    window.addEventListener("mousemove",onMouseMove);window.addEventListener("mouseup",onMouseUp);
    window.addEventListener("touchmove",onTouchMove,{passive:false});window.addEventListener("touchend",onTouchEnd);
    return()=>{window.removeEventListener("mousemove",onMouseMove);window.removeEventListener("mouseup",onMouseUp);window.removeEventListener("touchmove",onTouchMove);window.removeEventListener("touchend",onTouchEnd);};
  },[onMouseMove,onMouseUp,onTouchMove,onTouchEnd]);
  useEffect(()=>{if(existingPhoto&&!imgSrc){setImgSrc(existingPhoto);loadImage(existingPhoto);}},[existingPhoto]);

  const confirm=()=>{
    if(!imgSrc)return;
    const canvas=canvasRef.current;const ctx=canvas.getContext("2d");const img=new Image();
    img.onload=()=>{
      canvas.width=OUT;canvas.height=OUT;ctx.clearRect(0,0,OUT,OUT);
      const dispW=imgNatW*scale,dispH=imgNatH*scale;
      const imgLeft=PREV/2-dispW/2+offset.x,imgTop=PREV/2-dispH/2+offset.y;
      ctx.drawImage(img,(0-imgLeft)/scale,(0-imgTop)/scale,PREV/scale,PREV/scale,0,0,OUT,OUT);
      onConfirm(canvas.toDataURL("image/jpeg",0.92));
    };
    img.src=imgSrc;
  };

  const dispW=imgNatW*scale,dispH=imgNatH*scale;
  const imgLeft=PREV/2-dispW/2+offset.x,imgTop=PREV/2-dispH/2+offset.y;

  return (
    <div style={T.overlay}>
      <div style={T.modal}>
        <div style={T.head}>
          <span style={{fontWeight:800,fontSize:15}}>📷 プロフィール写真を設定</span>
          <button onClick={onCancel} style={T.close}>✕</button>
        </div>
        {!imgSrc ? (
          <div style={T.drop} onClick={()=>fileRef.current.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}>
            <div style={{fontSize:36,marginBottom:10}}>🖼️</div>
            <div style={{fontWeight:700,marginBottom:4}}>写真をドロップ、またはクリックして選択</div>
            <div style={{fontSize:12,color:C.textLight}}>JPG / PNG / HEIC 推奨（正方形に近い画像）</div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
        ) : (
          <>
            <div style={{fontSize:12,color:C.textMid,marginBottom:10,textAlign:"center"}}>ドラッグで位置調整、スライダーで拡大縮小</div>
            <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
              <div>
                <div style={T.trimLabel}>トリミング範囲</div>
                <div style={{...T.trimBox,cursor:dragging?"grabbing":"grab"}} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
                  <img src={imgSrc} alt="" style={{position:"absolute",left:imgLeft,top:imgTop,width:dispW,height:dispH,userSelect:"none",pointerEvents:"none"}}/>
                  <div style={T.grid}/>
                  <div style={T.border}/>
                </div>
                <div style={{marginTop:10}}>
                  <div style={{fontSize:11,color:C.textLight,marginBottom:3}}>拡大縮小：{Math.round(scale*100)}%</div>
                  <input type="range" min="0.3" max="3" step="0.01" value={scale} onChange={e=>setScale(parseFloat(e.target.value))} style={{width:"100%"}}/>
                </div>
                <button onClick={()=>{setImgSrc(null);if(fileRef.current)fileRef.current.value="";}} style={T.changeBtn}>別の写真を選ぶ</button>
              </div>
              <div style={{flexShrink:0}}>
                <div style={T.trimLabel}>仕上がり（正方形）</div>
                <div style={{width:PREV,height:PREV,overflow:"hidden",borderRadius:4,border:"1px solid "+C.border,position:"relative"}}>
                  <img src={imgSrc} alt="" style={{position:"absolute",left:imgLeft,top:imgTop,width:dispW,height:dispH,userSelect:"none",pointerEvents:"none"}}/>
                </div>
                <div style={{marginTop:10}}>
                  <div style={T.trimLabel}>アバター表示（円形）</div>
                  <div style={{width:60,height:60,borderRadius:"50%",overflow:"hidden",border:"2px solid "+C.border,position:"relative"}}>
                    <div style={{width:PREV,height:PREV,transform:"scale("+(60/PREV)+")",transformOrigin:"top left",position:"absolute"}}>
                      <img src={imgSrc} alt="" style={{position:"absolute",left:imgLeft,top:imgTop,width:dispW,height:dispH,userSelect:"none",pointerEvents:"none"}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <canvas ref={canvasRef} style={{display:"none"}}/>
        <div style={T.foot}>
          <button onClick={onCancel} style={T.cancel}>キャンセル</button>
          <button onClick={confirm} disabled={!imgSrc} style={{...T.confirm,opacity:imgSrc?1:0.4}}>この位置で確定する</button>
        </div>
      </div>
    </div>
  );
}
const T={
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16},
  modal:{background:C.white,borderRadius:10,padding:24,maxWidth:660,width:"100%",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box"},
  head:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},
  close:{background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.textLight,padding:"2px 6px"},
  drop:{border:"2px dashed "+C.border,borderRadius:8,padding:"36px 20px",textAlign:"center",cursor:"pointer",background:"#fafafa"},
  trimBox:{width:280,height:280,position:"relative",overflow:"hidden",background:"#111",borderRadius:4,flexShrink:0,userSelect:"none"},
  grid:{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",backgroundSize:"93px 93px",zIndex:2},
  border:{position:"absolute",inset:0,border:"2px solid rgba(255,255,255,0.8)",borderRadius:2,pointerEvents:"none",zIndex:3},
  trimLabel:{fontSize:11,color:C.textLight,marginBottom:5,textAlign:"center"},
  changeBtn:{background:"#f0f0f0",color:C.textMid,border:"1px solid "+C.border,borderRadius:4,padding:"5px 12px",fontSize:11,cursor:"pointer",marginTop:8,display:"block"},
  foot:{display:"flex",gap:10,marginTop:16,justifyContent:"flex-end"},
  cancel:{background:"#f0f0f0",color:C.textDark,border:"1px solid "+C.border,borderRadius:4,padding:"10px 20px",fontSize:13,cursor:"pointer"},
  confirm:{background:C.dark,color:"#fff",border:"none",borderRadius:4,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer"},
};

// ════════════════════════════════════════════════
// メイン App
// ════════════════════════════════════════════════
const WEBHOOK_URL = "https://hook.us2.make.com/k573kpdb3u6n1n1d3goib6gvwchpjn2x";

export default function App() {
  const [screen,setScreen]=useState("intro");
  const [mode,setMode]=useState(null);
  const [ep,setEp]=useState(null);
  const [photo,setPhoto]=useState(null);
  const [showTrimmer,setShowTrimmer]=useState(false);

  const goPreview=(p)=>{setEp(JSON.parse(JSON.stringify(p)));setScreen("preview");};
  const restart=()=>{setScreen("intro");setMode(null);setEp(null);};

  return (
    <div style={S.app}>
      {showTrimmer&&<PhotoTrimmer existingPhoto={photo} onConfirm={d=>{setPhoto(d);setShowTrimmer(false);}} onCancel={()=>setShowTrimmer(false)}/>}
      <header style={S.header}>
        <img src="https://member.smb-republic.org/wp-content/uploads/2026/02/cropped-logo.png" alt="" style={S.headerLogo} onError={e=>e.target.style.display="none"}/>
        <span style={S.headerTitle}>中小企業共和国</span>
        <span style={S.headerBadge}>AIプロフィール作成</span>
      </header>
      <main style={S.main}>
        {screen==="intro"   && <Intro   onNext={()=>setScreen("mode")} onSample={()=>goPreview(SAMPLE)}/>}
        {screen==="mode"    && <Modes   onPick={m=>{setMode(m);setScreen(m);}} onBack={()=>setScreen("intro")}/>}
        {screen==="chat"    && <ChatMode   onDone={goPreview} onBack={()=>setScreen("mode")}/>}
        {screen==="form"    && <FormMode   onDone={goPreview} onBack={()=>setScreen("mode")}/>}
        {screen==="hybrid"  && <HybridMode onDone={goPreview} onBack={()=>setScreen("mode")}/>}
        {screen==="preview" && ep && <Preview p={ep} setP={setEp} photo={photo} onSetPhoto={()=>setShowTrimmer(true)} onEdit={()=>setScreen("edit")} onRestart={restart} onBack={()=>setScreen(mode||"mode")}/>}
        {screen==="edit"    && ep && <EditScreen p={ep} setP={setEp} photo={photo} onSetPhoto={()=>setShowTrimmer(true)} onBack={()=>setScreen("preview")}/>}
      </main>
      <footer style={S.footer}>© 2026 特定非営利活動法人中小企業共和国 All Rights Reserved.</footer>
    </div>
  );
}

// ── イントロ ─────────────────────────────────────────────────────
function Intro({onNext,onSample}) {
  return (
    <div>
      <Hero title={"話すだけで\nプロフィール完成"} sub="シェアで変える中小企業の未来"/>
      <div style={S.body}>
        <Kicker>AI プロフィール作成</Kicker>
        <h2 style={S.h2}>フォーム入力が面倒な方へ。<br/>AIと会話するだけで、魅力的な紹介ページが完成します。</h2>
        <p style={S.desc}>口頭インタビュー・フォーム入力・ハイブリッドの3つのモードから選べます。</p>
        <div style={S.steps}>
          {[["01","方法を選ぶ","3つのモードから好きな方法で"],["02","情報を入力","写真のトリミングもその場で"],["03","プロフィール完成","加筆・修正も自由に"]].map(([n,t,d])=>(
            <div key={n} style={S.step}><div style={S.stepN}>{n}</div><div><b style={{fontSize:13,fontWeight:700}}>{t}</b><br/><span style={{fontSize:12,color:C.textMid}}>{d}</span></div></div>
          ))}
        </div>
        <PBtn onClick={onNext}>作成をはじめる →</PBtn>
        <GBtn onClick={onSample} style={{marginTop:10}}>サンプル（星子さん）を確認する</GBtn>
      </div>
    </div>
  );
}

// ── モード選択 ───────────────────────────────────────────────────
function Modes({onPick,onBack}) {
  const modes=[
    {id:"chat",icon:"🎙️",label:"AIインタビュー",sub:"話すだけでOK",color:C.dark,desc:"AIが質問。フォーム不要。話すのが楽な方に。"},
    {id:"form",icon:"✍️",label:"自分で書く",sub:"こだわりたい",color:C.blue,desc:"全項目を自分で入力。AIが文章を磨くオプション付き。"},
    {id:"hybrid",icon:"⚡",label:"ハイブリッド",sub:"AIに書かせて加筆",color:C.green,desc:"AIが下書き作成→自分で加筆修正。いいとこ取り。"},
  ];
  return (
    <div>
      <BreadCrumb items={[{label:"TOP",onClick:onBack}]} current="作成方法を選択"/>
      <div style={S.body}>
        <Kicker>STEP 01</Kicker>
        <h2 style={S.h2}>作成方法を選んでください</h2>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {modes.map(m=>(
            <button key={m.id} onClick={()=>onPick(m.id)} style={S.modeCard}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:28}}>{m.icon}</span>
                <span style={{fontSize:11,background:m.color+"18",color:m.color,border:"1px solid "+m.color+"44",borderRadius:100,padding:"2px 10px",fontWeight:700}}>{m.sub}</span>
              </div>
              <div style={{fontSize:15,fontWeight:900,marginBottom:4}}>{m.label}</div>
              <div style={{fontSize:13,color:C.textMid,lineHeight:1.6}}>{m.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── チャット ─────────────────────────────────────────────────────
function ChatMode({onDone,onBack}) {
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");
  const [loading,setLd]=useState(false);
  const [qi,setQi]=useState(0);
  const [hist,setHist]=useState([]);
  const [data,setData]=useState({});
  const bottomRef=useRef(null);
  const inpRef=useRef(null);
  useEffect(()=>{const q=IQ[0];setMsgs([{role:"ai",text:"はじめまして！AIインタビュアーです 🎙️\n\n"+IQ.length+"つの質問に答えていただくだけで、プロフィールが完成します。\n下記の記入欄に入力もしくはボイスメモ等で話しながら回答してください！\n\n**Q1 / "+IQ.length+"："+q.q+"**\n\nヒント："+q.hint}]);},[]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);
  const send=async()=>{
    if(!inp.trim()||loading)return;
    const text=inp.trim();setInp("");
    const nm=[...msgs,{role:"user",text}];setMsgs(nm);setLd(true);
    const cur=IQ[qi],isLast=qi===IQ.length-1,nxt=!isLast?IQ[qi+1]:null;
    const nh=[...hist,{role:"user",content:text}];
    const ip=isLast
      ?"ユーザーが「"+cur.id+"」に答えました：「"+text+"」\n\n全質問の回答が揃いました。収集情報："+JSON.stringify({...data,[cur.id]:text})+"\n\n感謝の一言を述べてからJSONを出力してください。"
      :"ユーザーが「"+cur.id+"」に答えました：「"+text+"」\n\n回答が十分なら「ありがとうございます！」と述べてから次の質問「Q"+(qi+2)+"："+nxt.q+"（ヒント："+nxt.hint+"）」を提示してください。情報不足なら深掘りしてください。";
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:1400,system:AI_SYS,messages:[...nh,{role:"user",content:ip}]})});
      const d=await res.json();
      const at=d.content?.[0]?.text||"エラーが発生しました。";
      const match=at.match(/\{[\s\S]*"message"[\s\S]*\}/);
      if(match){try{const p=JSON.parse(match[0]);setMsgs([...nm,{role:"ai",text:"✨ プロフィールが完成しました！"}]);setTimeout(()=>onDone(p),600);}catch{setMsgs([...nm,{role:"ai",text:at}]);}}
      else{setMsgs([...nm,{role:"ai",text:at}]);if(at.includes("ありがとう")&&!isLast){setData({...data,[cur.id]:text});setQi(qi+1);}}
      setHist([...nh,{role:"assistant",content:at}]);
    }catch{setMsgs([...nm,{role:"ai",text:"通信エラー。再度お試しください。"}]);}
    setLd(false);setTimeout(()=>inpRef.current?.focus(),100);
  };
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={S.chatNav}>
        <button onClick={onBack} style={S.back}>← 戻る</button>
        <span style={{fontSize:12,color:C.textLight}}>Q {Math.min(qi+1,IQ.length)} / {IQ.length}</span>
        <div style={{flex:1,height:4,background:C.border,borderRadius:2,margin:"0 8px"}}>
          <div style={{width:(qi/IQ.length*100)+"%",height:"100%",background:C.dark,borderRadius:2,transition:"width .5s"}}/>
        </div>
      </div>
      <div style={S.chatMsgs}>
        {msgs.map((m,i)=><Bubble key={i} role={m.role} text={m.text}/>)}
        {loading&&<div style={{display:"flex",gap:8,alignItems:"flex-end"}}><AIBadge/><div style={S.bAI}><Dots/></div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={S.chatFoot}>
        <textarea ref={inpRef} value={inp} onChange={e=>setInp(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&e.shiftKey){e.preventDefault();send();}}}
          placeholder="ここに入力（Enterで改行 / Shift+Enterで送信）"
          style={S.chatTa} rows={2}/>
        <button onClick={send} disabled={loading||!inp.trim()} style={S.chatSend}>送信</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// 経歴エントリーの入力コンポーネント（追加・削除・並び替え）
// ════════════════════════════════════════════════
function CareerEditor({entries,onChange}) {
  const add=()=>onChange([...entries,{company:"",role:"",period:""}]);
  const remove=(i)=>onChange(entries.filter((_,idx)=>idx!==i));
  const update=(i,k,v)=>onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e));
  return (
    <div>
      {entries.map((e,i)=>(
        <div key={i} style={S.careerEntry}>
          <div style={S.careerEntryHead}>
            <span style={{fontSize:12,fontWeight:700,color:C.textMid}}>{i+1}社目</span>
            {entries.length>1&&<button onClick={()=>remove(i)} style={S.removeBtn}>✕ 削除</button>}
          </div>
          <div style={S.careerFields}>
            <div style={{flex:2,minWidth:0}}>
              <div style={S.subLabel}>会社名 / 屋号 <span style={S.req}>必須</span></div>
              <input value={e.company} onChange={ev=>update(i,"company",ev.target.value)}
                placeholder="例：株式会社アイ・パッション" style={S.input}/>
            </div>
            <div style={{flex:2,minWidth:0}}>
              <div style={S.subLabel}>役職 / 担当 <span style={S.req}>必須</span></div>
              <input value={e.role} onChange={ev=>update(i,"role",ev.target.value)}
                placeholder="例：企画営業部 リーダー" style={S.input}/>
            </div>
            <div style={{flex:1,minWidth:80}}>
              <div style={S.subLabel}>在籍期間</div>
              <input value={e.period} onChange={ev=>update(i,"period",ev.target.value)}
                placeholder="例：約2年" style={S.input}/>
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} style={S.addBtn}>＋ 経歴を追加する</button>
    </div>
  );
}

// ── フォームモード ────────────────────────────────────────────────
function FormMode({onDone,onBack}) {
  const initCareer=[{company:"",role:"",period:""}];
  const [name,setName]=useState("");
  const [kana,setKana]=useState("");
  const [company,setCompany]=useState("");
  const [role,setRole]=useState("");
  const [cats,setCats]=useState([]);
  const [career,setCareer]=useState(initCareer);
  const [achievements,setAchievements]=useState("");
  const [worktime,setWorktime]=useState("");
  const [reward,setReward]=useState("");
  const [message,setMessage]=useState("");
  const [sns,setSns]=useState("");
  const [polF,setPolF]=useState(null);
  const [polT,setPolT]=useState({});
  const [ldPol,setLdP]=useState(false);

  const polish=async(fid,text)=>{
    if(!text.trim())return;setPolF(fid);setLdP(true);
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:800,system:POLISH_SYS,
          messages:[{role:"user",content:"以下のテキストを磨いてください：\n\n"+text}]})});
      const d=await res.json();setPolT(p=>({...p,[fid]:d.content?.[0]?.text||""}));
    }catch{alert("エラーが発生しました。");}setLdP(false);
  };
  const applyPol=(fid,setter)=>{setter(polT[fid]);setPolT(p=>{const n={...p};delete n[fid];return n;});setPolF(null);};
  const discPol=(fid)=>{setPolT(p=>{const n={...p};delete n[fid];return n;});setPolF(null);};

  const submit=()=>onDone({name,kana,company,role,categories:cats,career,achievements,worktime,reward,message,sns});

  return (
    <div>
      <BreadCrumb items={[{label:"TOP",onClick:onBack}]} current="自分で書く"/>
      <div style={S.body}>
        <Kicker>STEP 02</Kicker>
        <h2 style={S.h2}>プロフィールを入力する</h2>
        <p style={S.desc}>実際のサイト掲載ページと同じ項目です。「✨ AIで磨く」で文章をブラッシュアップできます。</p>
        <Card>
          {/* 氏名 */}
          <FLabel label="お名前" req>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <div style={{flex:2,minWidth:120}}>
                <div style={S.subLabel}>氏名 / 屋号・会社名</div>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="例：星子 豪志　または　Lacial（ラシアル）" style={S.input}/>
              </div>
              <div style={{flex:2,minWidth:120}}>
                <div style={S.subLabel}>ふりがな ※屋号・会社名の場合は読み方</div>
                <input value={kana} onChange={e=>setKana(e.target.value)} placeholder="例：ほしこ つよし　または　らしある" style={S.input}/>
              </div>
            </div>
          </FLabel>

          {/* 屋号・会社名（別フィールド） */}
          <FLabel label="屋号 / 会社名" hint="個人で屋号がない場合は空欄でOK">
            <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="例：Lacial（ラシアル）、株式会社ABC" style={S.input}/>
          </FLabel>

          {/* 役職 */}
          <FLabel label="役職 / 肩書き" req>
            <input value={role} onChange={e=>setRole(e.target.value)} placeholder="例：代表、フリーランスエンジニア、設計士" style={S.input}/>
          </FLabel>

          {/* 得意分野 */}
          <FLabel label="得意分野" hint="複数選択可" req>
            <div style={S.catWrap}>
              {CATEGORIES.map(c=>{
                const on=cats.includes(c);const col=CAT_COL[c]||{bg:"#f0f0f0",tx:"#555",bd:"#ccc"};
                return <button key={c} onClick={()=>setCats(on?cats.filter(x=>x!==c):[...cats,c])}
                  style={{...S.chip,...(on?{background:col.bg,color:col.tx,borderColor:col.bd,fontWeight:700}:{})}}>{c}</button>;
              })}
            </div>
          </FLabel>

          {/* 経歴 */}
          <FLabel label="経歴" hint="会社ごとに1枠。「経歴を追加する」で複数社入力できます" req>
            <CareerEditor entries={career} onChange={setCareer}/>
          </FLabel>

          {/* 過去の実績 */}
          <FLabel label="過去の実績">
            <textarea value={achievements} onChange={e=>setAchievements(e.target.value)} style={{...S.ta,minHeight:140}} rows={6}
              placeholder={"例：\n◼︎株式会社アイ・パッション：社長営業とアウトソース事業の事業化\n・従業員300名以下の中小企業を対象に新卒採用を一気通貫で支援\n\n◼︎株式会社マイナビ：中小〜大手企業における教育研修・組織開発\n・各企業の課題に合わせたカスタマイズ研修を複数設計"}/>
            {achievements.trim().length>20&&(polT["achievements"]
              ?<PolishResult text={polT["achievements"]} onApply={()=>applyPol("achievements",setAchievements)} onDiscard={()=>discPol("achievements")}/>
              :<button onClick={()=>polish("achievements",achievements)} disabled={ldPol&&polF==="achievements"} style={S.polBtn}>{ldPol&&polF==="achievements"?"磨き中…":"✨ AIで磨く"}</button>
            )}
          </FLabel>

          {/* 稼働可能時間 */}
          <FLabel label="稼働可能時間" req>
            <input value={worktime} onChange={e=>setWorktime(e.target.value)} placeholder="例：週40時間、週に2〜3日、要相談" style={S.input}/>
          </FLabel>

          {/* 希望する報酬形態 */}
          <FLabel label="希望する報酬形態" req>
            <input value={reward} onChange={e=>setReward(e.target.value)} placeholder="例：時給2,000円、月額30万円、要相談" style={S.input}/>
          </FLabel>

          {/* メッセージ */}
          <FLabel label="メッセージ">
            <textarea value={message} onChange={e=>setMessage(e.target.value)} style={{...S.ta,minHeight:120}} rows={5}
              placeholder="中小企業の方々へ向けたメッセージを自由にどうぞ。"/>
            {message.trim().length>20&&(polT["message"]
              ?<PolishResult text={polT["message"]} onApply={()=>applyPol("message",setMessage)} onDiscard={()=>discPol("message")}/>
              :<button onClick={()=>polish("message",message)} disabled={ldPol&&polF==="message"} style={S.polBtn}>{ldPol&&polF==="message"?"磨き中…":"✨ AIで磨く"}</button>
            )}
          </FLabel>

          {/* SNS・HP */}
          <FLabel label="SNS・HP・ポートフォリオ等" hint="複数ある場合は改行で区切ってください">
            <textarea value={sns} onChange={e=>setSns(e.target.value)} style={{...S.ta,minHeight:70}} rows={3}
              placeholder={"例：https://example.com\nhttps://twitter.com/xxx\nhttps://note.com/xxx"}/>
          </FLabel>
        </Card>
        <PBtn onClick={submit} style={{marginTop:20}}>プレビューを確認する →</PBtn>
      </div>
    </div>
  );
}

// ── ハイブリッド ──────────────────────────────────────────────────
function HybridMode({onDone,onBack}) {
  const [step,setStep]=useState("chat");
  const [draft,setDraft]=useState(null);
  if(step==="chat") return <ChatMode onDone={p=>{setDraft(p);setStep("edit");}} onBack={onBack}/>;
  return <HybridEdit draft={draft} onDone={onDone} onBack={()=>setStep("chat")}/>;
}

function HybridEdit({draft,onDone,onBack}) {
  const [name,setName]=useState(draft.name||"");
  const [kana,setKana]=useState(draft.kana||"");
  const [company,setCompany]=useState(draft.company||"");
  const [role,setRole]=useState(draft.role||"");
  const [cats,setCats]=useState(draft.categories||[]);
  const [career,setCareer]=useState(draft.career&&draft.career.length>0?draft.career:[{company:"",role:"",period:""}]);
  const [achievements,setAchievements]=useState(draft.achievements||"");
  const [worktime,setWorktime]=useState(draft.worktime||"");
  const [reward,setReward]=useState(draft.reward||"");
  const [message,setMessage]=useState(draft.message||"");
  const [sns,setSns]=useState(draft.sns||"");
  const [polF,setPolF]=useState(null);
  const [polT,setPolT]=useState({});
  const [ldPol,setLdP]=useState(false);

  const polish=async(fid,text)=>{
    if(!text.trim())return;setPolF(fid);setLdP(true);
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:800,system:POLISH_SYS,
          messages:[{role:"user",content:"以下のテキストをさらに磨いてください：\n\n"+text}]})});
      const d=await res.json();setPolT(p=>({...p,[fid]:d.content?.[0]?.text||""}));
    }catch{alert("エラー");}setLdP(false);
  };
  const applyPol=(fid,setter)=>{setter(polT[fid]);setPolT(p=>{const n={...p};delete n[fid];return n;});setPolF(null);};
  const discPol=(fid)=>{setPolT(p=>{const n={...p};delete n[fid];return n;});setPolF(null);};
  const submit=()=>onDone({name,kana,company,role,categories:cats,career,achievements,worktime,reward,message,sns});

  return (
    <div>
      <BreadCrumb items={[{label:"AIインタビューに戻る",onClick:onBack}]} current="下書き編集"/>
      <div style={S.body}>
        <div style={S.hybridBanner}><span>⚡</span><div><b style={{color:C.green}}>AIが下書きを生成しました</b><br/><span style={{fontSize:13,color:"#3a6045"}}>内容を確認・加筆・修正してください。</span></div></div>
        <Card>
          <FLabel label="お名前" req>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <div style={{flex:2,minWidth:120}}>
                <div style={S.subLabel}>氏名 / 屋号・会社名</div>
                <input value={name} onChange={e=>setName(e.target.value)} style={S.input}/>
              </div>
              <div style={{flex:2,minWidth:120}}>
                <div style={S.subLabel}>ふりがな</div>
                <input value={kana} onChange={e=>setKana(e.target.value)} style={S.input}/>
              </div>
            </div>
          </FLabel>
          <FLabel label="屋号 / 会社名" hint="個人で屋号がない場合は空欄でOK">
            <input value={company} onChange={e=>setCompany(e.target.value)} style={S.input}/>
          </FLabel>
          <FLabel label="役職 / 肩書き" req>
            <input value={role} onChange={e=>setRole(e.target.value)} style={S.input}/>
          </FLabel>
          <FLabel label="得意分野" hint="複数選択可" req>
            <div style={S.catWrap}>
              {CATEGORIES.map(c=>{const on=cats.includes(c);const col=CAT_COL[c]||{bg:"#f0f0f0",tx:"#555",bd:"#ccc"};
                return <button key={c} onClick={()=>setCats(on?cats.filter(x=>x!==c):[...cats,c])} style={{...S.chip,...(on?{background:col.bg,color:col.tx,borderColor:col.bd,fontWeight:700}:{})}}>{c}</button>;})}
            </div>
          </FLabel>
          <FLabel label="経歴" hint="会社ごとに1枠" req>
            <CareerEditor entries={career} onChange={setCareer}/>
          </FLabel>
          <FLabel label="過去の実績">
            <textarea value={achievements} onChange={e=>setAchievements(e.target.value)} style={{...S.ta,minHeight:140}} rows={6}/>
            {achievements.trim().length>20&&(polT["achievements"]?<PolishResult text={polT["achievements"]} onApply={()=>applyPol("achievements",setAchievements)} onDiscard={()=>discPol("achievements")}/> :<button onClick={()=>polish("achievements",achievements)} disabled={ldPol&&polF==="achievements"} style={S.polBtn}>{ldPol&&polF==="achievements"?"磨き中…":"✨ AIでさらに磨く"}</button>)}
          </FLabel>
          <FLabel label="稼働可能時間" req>
            <input value={worktime} onChange={e=>setWorktime(e.target.value)} style={S.input}/>
          </FLabel>
          <FLabel label="希望する報酬形態" req>
            <input value={reward} onChange={e=>setReward(e.target.value)} style={S.input}/>
          </FLabel>
          <FLabel label="メッセージ">
            <textarea value={message} onChange={e=>setMessage(e.target.value)} style={{...S.ta,minHeight:120}} rows={5}/>
            {message.trim().length>20&&(polT["message"]?<PolishResult text={polT["message"]} onApply={()=>applyPol("message",setMessage)} onDiscard={()=>discPol("message")}/> :<button onClick={()=>polish("message",message)} disabled={ldPol&&polF==="message"} style={S.polBtn}>{ldPol&&polF==="message"?"磨き中…":"✨ AIでさらに磨く"}</button>)}
          </FLabel>
          <FLabel label="SNS・HP・ポートフォリオ等" hint="複数は改行で区切り">
            <textarea value={sns} onChange={e=>setSns(e.target.value)} style={{...S.ta,minHeight:70}} rows={3}/>
          </FLabel>
        </Card>
        <PBtn onClick={submit} style={{marginTop:20}}>プレビューを確認する →</PBtn>
      </div>
    </div>
  );
}

// ── プレビュー ────────────────────────────────────────────────────
function Preview({p,photo,onSetPhoto,onEdit,onRestart,onBack}) {
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);
  const [sendErr,setSendErr]=useState("");

  const handleRegister=async()=>{
    if(!WEBHOOK_URL){setSendErr("Webhook URLが設定されていません。開発者にお知らせください。");return;}
    setSending(true);setSendErr("");
    try{
      const res=await fetch(WEBHOOK_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...p,photo:photo||null})});
      if(res.ok){setSent(true);}else{setSendErr("送信に失敗しました（HTTP "+res.status+"）。");}
    }catch(e){setSendErr("通信エラー："+e.message);}
    setSending(false);
  };

  if(sent)return(
    <div style={S.body}>
      <div style={{textAlign:"center",padding:"48px 20px"}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <h2 style={{fontSize:20,fontWeight:900,marginBottom:8}}>登録が完了しました！</h2>
        <p style={{color:C.textMid,fontSize:14,lineHeight:1.8,marginBottom:24}}>管理者に通知が送られました。内容確認後、サイトに掲載されます。</p>
        <GBtn onClick={onRestart} style={{maxWidth:280,margin:"0 auto"}}>TOPに戻る</GBtn>
      </div>
    </div>
  );

  return (
    <div>
      <BreadCrumb items={[{label:"TOP",onClick:onRestart},{label:"作成画面に戻る",onClick:onBack}]} current="プレビュー"/>
      <div style={S.body}>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <button onClick={onSetPhoto} style={S.photoBtn}>📷 {photo?"写真を変更する":"写真をアップロード"}</button>
          <button onClick={onEdit} style={S.editBtn}>✏️ テキストを編集する</button>
          <PBtn onClick={handleRegister} disabled={sending} style={{flex:"none",width:"auto",padding:"10px 24px",fontSize:13,opacity:sending?0.6:1}}>
            {sending?"送信中…":"✓ この内容で登録する"}
          </PBtn>
        </div>
        {sendErr&&<div style={{background:C.redBg,border:"1px solid "+C.red+"66",borderRadius:6,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:12}}>{sendErr}</div>}
        {!WEBHOOK_URL&&<div style={{background:C.amberBg,border:"1px solid "+C.amberBd,borderRadius:6,padding:"10px 14px",fontSize:12,color:C.amber,marginBottom:12}}>⚙️ <b>開発者向け：</b>WEBHOOK_URL を設定すると実際に登録が動作します。</div>}
        {!photo&&<div style={{background:"#fffbe6",border:"1px solid #f0d060",borderRadius:6,padding:"10px 14px",fontSize:13,color:"#7a6000",marginBottom:12}}>📷 プロフィール写真がまだ設定されていません。</div>}

        {/* プロフィールカード（実際のサイトと同じ構成） */}
        <div style={S.profCard}>
          {/* ヒーロー */}
          <div style={S.profHero}>
            <img src="https://member.smb-republic.org/wp-content/uploads/2026/03/top_kv2.jpg" alt="" style={S.profHeroBg} onError={e=>e.target.style.display="none"}/>
            <div style={S.profHeroOvl}/>
            <div style={S.profHeroContent}>
              <div style={{...S.profAvatar,padding:0,overflow:"hidden",background:photo?"transparent":C.gold}}>
                {photo?<img src={photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      :<span style={{fontSize:24,fontWeight:900,color:"#fff"}}>{p.name?p.name[0]:"?"}</span>}
              </div>
              <div>
                <div style={S.profName}>{p.name}{p.kana&&<span style={{fontSize:13,fontWeight:400,opacity:0.8}}> （{p.kana}）</span>}</div>
                {p.company&&<div style={{fontSize:14,fontWeight:700,color:C.gold,marginBottom:4}}>{p.company}</div>}
                {p.role&&<div style={S.profRole}>{p.role}</div>}
              </div>
            </div>
          </div>

          {/* 得意分野 */}
          {p.categories?.length>0&&(
            <PSection label="得意分野">
              <div style={S.catWrap}>
                {p.categories.map((c,i)=>{const col=CAT_COL[c]||{bg:"#f0f0f0",tx:"#555",bd:"#ccc"};
                  return <span key={i} style={{...S.chip,background:col.bg,color:col.tx,borderColor:col.bd,fontWeight:700,cursor:"default"}}>{c}</span>;})}
              </div>
            </PSection>
          )}

          {/* 経歴 */}
          {p.career?.filter(c=>c.company).length>0&&(
            <PSection label="経歴">
              {p.career.filter(c=>c.company).map((c,i)=>(
                <div key={i} style={{marginBottom:16}}>
                  <div style={{fontWeight:700,fontSize:14}}>{c.company}</div>
                  {c.role&&<div style={{fontWeight:700,fontSize:13,color:C.textMid,marginTop:2}}>{c.role}</div>}
                  {c.period&&<div style={{fontSize:12,color:C.textLight,marginTop:2}}>{c.period}</div>}
                </div>
              ))}
            </PSection>
          )}

          {/* 過去の実績 */}
          {p.achievements&&(
            <PSection label="過去の実績">
              <div style={{fontSize:13,lineHeight:2,whiteSpace:"pre-wrap",color:C.textDark}}>{p.achievements}</div>
            </PSection>
          )}

          {/* 稼働可能時間 */}
          {p.worktime&&(
            <PSection label="稼働可能時間">
              <div style={{fontSize:14,color:C.textDark}}>{p.worktime}</div>
            </PSection>
          )}

          {/* 希望する報酬形態 */}
          {p.reward&&(
            <PSection label="希望する報酬形態">
              <div style={{fontSize:14,color:C.textDark}}>{p.reward}</div>
            </PSection>
          )}

          {/* メッセージ */}
          {p.message&&(
            <PSection label="メッセージ">
              <div style={{fontSize:14,lineHeight:2,borderLeft:"3px solid "+C.gold,paddingLeft:16,whiteSpace:"pre-wrap"}}>{p.message}</div>
            </PSection>
          )}

          {/* SNS・HP・ポートフォリオ等 */}
          {p.sns&&(
            <PSection label="SNS・HP・ポートフォリオ等">
              <div style={{fontSize:13,lineHeight:2}}>
                {p.sns.split("\n").filter(Boolean).map((url,i)=>(
                  <div key={i}><a href={url} target="_blank" rel="noopener noreferrer" style={{color:C.blue,textDecoration:"underline"}}>{url}</a></div>
                ))}
              </div>
            </PSection>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 直接編集 ──────────────────────────────────────────────────────
function EditScreen({p,setP,photo,onSetPhoto,onBack}) {
  const set=(k,v)=>setP(prev=>({...prev,[k]:v}));
  return (
    <div>
      <BreadCrumb items={[{label:"プレビューに戻る",onClick:onBack}]} current="テキスト編集"/>
      <div style={S.body}>
        <Kicker>EDIT</Kicker>
        <h2 style={S.h2}>テキストを直接編集</h2>
        <div style={{marginBottom:20}}>
          <button onClick={onSetPhoto} style={S.photoBtn}>📷 {photo?"写真を変更する":"写真をアップロードする"}</button>
          {photo&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:10}}>
            <img src={photo} alt="" style={{width:48,height:48,objectFit:"cover",borderRadius:4,border:"1px solid "+C.border}}/>
            <span style={{fontSize:12,color:C.green}}>✓ 写真設定済み</span>
          </div>}
        </div>
        <Card>
          <FLabel label="お名前" req>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <div style={{flex:2,minWidth:120}}>
                <div style={S.subLabel}>氏名 / 屋号・会社名</div>
                <input value={p.name||""} onChange={e=>set("name",e.target.value)} style={S.input}/>
              </div>
              <div style={{flex:2,minWidth:120}}>
                <div style={S.subLabel}>ふりがな</div>
                <input value={p.kana||""} onChange={e=>set("kana",e.target.value)} style={S.input}/>
              </div>
            </div>
          </FLabel>
          <FLabel label="屋号 / 会社名">
            <input value={p.company||""} onChange={e=>set("company",e.target.value)} style={S.input}/>
          </FLabel>
          <FLabel label="役職 / 肩書き" req>
            <input value={p.role||""} onChange={e=>set("role",e.target.value)} style={S.input}/>
          </FLabel>
          <FLabel label="得意分野" hint="タップで変更">
            <div style={S.catWrap}>
              {CATEGORIES.map(c=>{const on=p.categories?.includes(c);const col=CAT_COL[c]||{bg:"#f0f0f0",tx:"#555",bd:"#ccc"};
                return <button key={c} onClick={()=>set("categories",on?p.categories.filter(x=>x!==c):[...(p.categories||[]),c])}
                  style={{...S.chip,...(on?{background:col.bg,color:col.tx,borderColor:col.bd,fontWeight:700}:{})}}>{c}</button>;})}
            </div>
          </FLabel>
          <FLabel label="経歴" hint="会社ごとに1枠">
            <CareerEditor entries={p.career&&p.career.length>0?p.career:[{company:"",role:"",period:""}]} onChange={v=>set("career",v)}/>
          </FLabel>
          <FLabel label="過去の実績">
            <textarea value={p.achievements||""} onChange={e=>set("achievements",e.target.value)} style={{...S.ta,minHeight:140}} rows={6}/>
          </FLabel>
          <FLabel label="稼働可能時間">
            <input value={p.worktime||""} onChange={e=>set("worktime",e.target.value)} style={S.input}/>
          </FLabel>
          <FLabel label="希望する報酬形態">
            <input value={p.reward||""} onChange={e=>set("reward",e.target.value)} style={S.input}/>
          </FLabel>
          <FLabel label="メッセージ">
            <textarea value={p.message||""} onChange={e=>set("message",e.target.value)} style={{...S.ta,minHeight:120}} rows={5}/>
          </FLabel>
          <FLabel label="SNS・HP・ポートフォリオ等" hint="複数は改行で区切り">
            <textarea value={p.sns||""} onChange={e=>set("sns",e.target.value)} style={{...S.ta,minHeight:70}} rows={3}/>
          </FLabel>
        </Card>
        <PBtn onClick={onBack} style={{marginTop:20}}>プレビューに戻る</PBtn>
      </div>
    </div>
  );
}

// ── 共通パーツ ────────────────────────────────────────────────────
function Hero({title,sub}){return(<div style={{position:"relative",height:160,overflow:"hidden",flexShrink:0}}><img src="https://member.smb-republic.org/wp-content/uploads/2026/03/top_kv2.jpg" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="#333";}} /><div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)"}}/><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 16px"}}>{sub&&<div style={{fontSize:11,color:"rgba(255,255,255,0.75)",letterSpacing:2,marginBottom:8}}>{sub}</div>}<h1 style={{fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.5,whiteSpace:"pre-line",margin:0}}>{title}</h1></div></div>);}
function BreadCrumb({items,current}){return(<div style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"10px 16px",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>{items.filter(Boolean).map((it,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:6}}><button onClick={it.onClick} style={{background:"none",border:"none",color:C.textMid,fontSize:12,cursor:"pointer",padding:0,textDecoration:"underline"}}>{it.label}</button><span style={{color:C.textLight,fontSize:11}}>›</span></span>))}<span style={{fontSize:12,color:C.textDark,fontWeight:600}}>{current}</span></div>);}
function Kicker({children}){return <div style={{fontSize:10,fontWeight:800,letterSpacing:3,color:C.gold,marginBottom:8}}>{children}</div>;}
function Card({children}){return <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:"24px",boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>{children}</div>;}
function FLabel({label,hint,req,children}){return(<div style={{marginBottom:20}}><div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}}><span style={{fontSize:13,fontWeight:700,color:C.textDark}}>{label}</span>{req&&<span style={S.req}>必須</span>}{hint&&<span style={{fontSize:11,color:C.textLight}}>{hint}</span>}</div>{children}</div>);}
function PSection({label,children}){return(<div style={{padding:"18px 20px",borderBottom:"1px solid "+C.border}}><div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.gold,marginBottom:12,textTransform:"uppercase"}}>{label}</div>{children}</div>);}
function PolishResult({text,onApply,onDiscard}){return(<div style={{background:C.amberBg,border:"1px solid "+C.amberBd,borderRadius:6,padding:"12px 14px",marginTop:8}}><div style={{fontSize:11,color:C.amber,fontWeight:700,marginBottom:8}}>✨ AIが磨いた文章</div><div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",marginBottom:10}}>{text}</div><div style={{display:"flex",gap:8}}><button onClick={onApply} style={{background:C.greenBg,color:C.green,border:"1px solid "+C.greenBd,borderRadius:4,padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>これを使う</button><button onClick={onDiscard} style={{background:"#f3f3f3",color:C.textMid,border:"1px solid "+C.border,borderRadius:4,padding:"5px 12px",fontSize:12,cursor:"pointer"}}>使わない</button></div></div>);}
function PBtn({children,onClick,style,disabled}){return <button onClick={onClick} disabled={disabled} style={{display:"block",width:"100%",background:C.dark,color:"#fff",border:"none",borderRadius:4,padding:"14px 20px",fontSize:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",letterSpacing:0.5,...style}}>{children}</button>;}
function GBtn({children,onClick,style}){return <button onClick={onClick} style={{display:"block",width:"100%",background:C.white,color:C.dark,border:"2px solid "+C.dark,borderRadius:4,padding:"12px 20px",fontSize:14,fontWeight:600,cursor:"pointer",...style}}>{children}</button>;}
function AIBadge(){return <div style={{width:32,height:32,borderRadius:"50%",background:C.dark,color:"#fff",fontWeight:800,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>AI</div>;}
function Dots(){return <span style={{display:"flex",gap:4,padding:"4px 0"}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:C.textLight,display:"inline-block",animation:"dotBounce 1s "+i*0.2+"s infinite"}}/>)}</span>;}
function Bubble({role,text}){const isAI=role==="ai";const lines=text.split("\n").map((ln,i)=>{const parts=ln.split(/\*\*(.*?)\*\*/g);return <span key={i}>{parts.map((p,j)=>j%2===1?<strong key={j}>{p}</strong>:p)}{i<text.split("\n").length-1&&<br/>}</span>;});return <div style={{display:"flex",alignItems:"flex-end",gap:8,justifyContent:isAI?"flex-start":"flex-end",marginBottom:6}}>{isAI&&<AIBadge/>}<div style={{...S.bub,...(isAI?S.bAI:S.bUser)}}>{lines}</div></div>;}

// ── スタイル ──────────────────────────────────────────────────────
const S={
  app:   {minHeight:"100vh",background:C.bg,color:C.textDark,fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif",display:"flex",flexDirection:"column"},
  header:{background:C.dark,padding:"0 16px",height:52,display:"flex",alignItems:"center",gap:10,flexShrink:0},
  headerLogo:{height:26,objectFit:"contain"},
  headerTitle:{fontSize:13,fontWeight:700,color:"#fff",flex:1},
  headerBadge:{fontSize:10,background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",borderRadius:100,padding:"2px 10px",flexShrink:0},
  main:  {flex:1,display:"flex",flexDirection:"column"},
  footer:{background:C.dark,color:"#666",fontSize:11,textAlign:"center",padding:"16px",flexShrink:0},
  body:  {maxWidth:680,margin:"0 auto",padding:"24px 16px 60px",width:"100%",boxSizing:"border-box"},
  h2:    {fontSize:18,fontWeight:900,lineHeight:1.5,margin:"0 0 10px"},
  desc:  {fontSize:13,color:C.textMid,lineHeight:1.8,margin:"0 0 20px"},
  steps: {display:"flex",flexDirection:"column",gap:14,margin:"0 0 20px"},
  step:  {display:"flex",alignItems:"flex-start",gap:12},
  stepN: {width:30,height:30,borderRadius:"50%",background:C.dark,color:"#fff",fontWeight:800,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  modeCard:{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:"18px 16px",cursor:"pointer",textAlign:"left",color:C.textDark,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
  chatNav:{background:C.white,borderBottom:"1px solid "+C.border,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,flexShrink:0},
  back:  {background:"none",border:"none",color:C.textMid,fontSize:12,cursor:"pointer",padding:0},
  chatMsgs:{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:8,background:C.bg,minHeight:200},
  chatFoot:{background:C.white,borderTop:"1px solid "+C.border,padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-end",flexShrink:0},
  chatTa:{flex:1,background:"#f7f7f7",border:"1px solid "+C.border,borderRadius:4,color:C.textDark,padding:"8px 12px",fontSize:13,resize:"none",lineHeight:1.6,outline:"none",fontFamily:"inherit"},
  chatSend:{background:C.dark,color:"#fff",border:"none",borderRadius:4,padding:"8px 16px",fontWeight:700,fontSize:13,cursor:"pointer",flexShrink:0},
  bub:   {padding:"10px 14px",borderRadius:6,fontSize:13,lineHeight:1.8,maxWidth:"80%"},
  bAI:   {background:C.white,border:"1px solid "+C.border,borderBottomLeftRadius:2,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"},
  bUser: {background:C.dark,color:"#fff",borderBottomRightRadius:2},
  input: {width:"100%",boxSizing:"border-box",background:"#fafafa",border:"1px solid "+C.border,borderRadius:4,color:C.textDark,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit"},
  ta:    {width:"100%",boxSizing:"border-box",background:"#fafafa",border:"1px solid "+C.border,borderRadius:4,color:C.textDark,padding:"8px 12px",fontSize:13,resize:"vertical",lineHeight:1.7,outline:"none",fontFamily:"inherit"},
  subLabel:{fontSize:11,color:C.textMid,fontWeight:600,marginBottom:4},
  req:   {fontSize:10,background:C.redBg,color:C.red,border:"1px solid "+C.red+"44",borderRadius:3,padding:"1px 6px",fontWeight:700},
  catWrap:{display:"flex",flexWrap:"wrap",gap:6,marginTop:4},
  chip:  {background:"#f3f3f3",color:C.textMid,border:"1px solid #d8d8d8",borderRadius:100,padding:"4px 12px",fontSize:12,fontWeight:500,cursor:"pointer"},
  careerEntry:{background:"#fafafa",border:"1px solid "+C.border,borderRadius:6,padding:"14px",marginBottom:10},
  careerEntryHead:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10},
  careerFields:{display:"flex",gap:10,flexWrap:"wrap"},
  removeBtn:{background:C.redBg,color:C.red,border:"1px solid "+C.red+"44",borderRadius:4,padding:"3px 10px",fontSize:11,cursor:"pointer"},
  addBtn:{background:C.white,color:C.dark,border:"2px dashed "+C.border,borderRadius:6,padding:"10px",fontSize:13,cursor:"pointer",width:"100%",textAlign:"center",marginTop:4},
  polBtn:{background:C.amberBg,color:C.amber,border:"1px solid "+C.amberBd,borderRadius:4,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",marginTop:6},
  hybridBanner:{display:"flex",alignItems:"flex-start",gap:12,background:C.greenBg,border:"1px solid "+C.greenBd,borderRadius:6,padding:"12px 16px",marginBottom:20,fontSize:14},
  photoBtn:{background:C.dark,color:"#fff",border:"none",borderRadius:4,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer"},
  editBtn:{background:C.white,color:C.blue,border:"1px solid "+C.blue,borderRadius:4,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer"},
  profCard:{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.08)"},
  profHero:{position:"relative",height:150,overflow:"hidden"},
  profHeroBg:{width:"100%",height:"100%",objectFit:"cover"},
  profHeroOvl:{position:"absolute",inset:0,background:"rgba(10,10,10,0.58)"},
  profHeroContent:{position:"absolute",inset:0,display:"flex",alignItems:"center",gap:16,padding:"0 20px"},
  profAvatar:{width:64,height:64,borderRadius:"50%",background:C.gold,color:"#fff",fontWeight:900,fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"2px solid rgba(255,255,255,0.8)"},
  profName:{fontSize:18,fontWeight:900,color:"#fff",margin:"0 0 4px"},
  profRole:{fontSize:12,color:"rgba(255,255,255,0.75)",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:3,padding:"2px 8px",display:"inline-block"},
};
