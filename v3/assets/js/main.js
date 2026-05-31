/* ================================================================
   Shared frontend logic: nav rendering, ECharts theme, helpers
   ================================================================ */

// ---- Sector registry (single source of truth for nav + landing) ----
window.SECTORS = [
  // AI (최상단 · LLM → 엔터 → 솔루션 순)
  { slug: "ai-llm",           name: "AI LLM 개발",            period: "2026–",     group: "AI",
    desc: "치킨게임에서 가치 구독으로. 클로드 코드의 ARPU 역전.",
    tickers: ["ANTHROPIC*", "OPENAI*", "GOOGL", "META"],
    sub: [
      { slug: "ai-llm-foundation", name: "파운데이션 모델" },
      { slug: "ai-llm-agent",      name: "AI 에이전트" },
      { slug: "ai-llm-inference",  name: "추론 · 인프라" },
    ] },
  { slug: "ai-entertainment", name: "AI 엔터테인먼트",        period: "2025–",     group: "AI",
    desc: "월드모델·AI 캐릭터·생성형 스토리. 스캐터랩·MiniMax·Genie.",
    tickers: ["SCATTERLAB*", "WRTN*", "META"],
    sub: [
      { slug: "ai-ent-world",     name: "월드모델 · 영상" },
      { slug: "ai-ent-character", name: "캐릭터 · 컴패니언" },
      { slug: "ai-ent-audio",     name: "음악 · 음성" },
    ] },
  { slug: "ai-solutions",     name: "데이터 솔루션",          period: "2023–2026", group: "AI",
    desc: "팔란티어·C3.ai·Snowflake·ServiceNow 등 B2B AI 적용층.",
    tickers: ["PLTR", "AI", "SNOW", "NOW"],
    sub: [
      { slug: "ai-solutions-decision", name: "의사결정·운영 AI" },
      { slug: "ai-solutions-platform", name: "데이터 플랫폼·DB" },
    ] },

  // AI 인프라
  { slug: "semiconductors",   name: "반도체",                period: "2024–2026", group: "AI 인프라",
    desc: "LLM 대용량 학습이 HBM·메모리 사이클을 견인.",
    tickers: ["000660.KS", "005930.KS", "MU", "NVDA"],
    sub: [
      { slug: "semiconductors-memory",  name: "메모리 (DRAM·HBM)" },
      { slug: "semiconductors-foundry", name: "파운드리" },
      { slug: "semiconductors-logic",   name: "시스템 / 로직" },
    ] },
  { slug: "datacenter",       name: "데이터센터",            period: "2026–",     group: "AI 인프라",
    desc: "빅테크 CapEx 슈퍼사이클. 변압기·전력·냉각·SMR.",
    tickers: ["VRT", "ETN", "267260.KS", "OKLO"],
    sub: [
      { slug: "datacenter-spacex",  name: "SpaceX · xAI Colossus" },
      { slug: "datacenter-compute", name: "컴퓨트 (GPU·ASIC)" },
      { slug: "datacenter-power",   name: "전력 · 냉각" },
      { slug: "datacenter-storage", name: "메모리 · 스토리지" },
      { slug: "datacenter-network", name: "네트워킹" },
    ] },

  // 우주
  { slug: "space",            name: "우주",                  period: "2020–",     group: "우주",
    desc: "스타링크 캐시카우와 우주 데이터센터 비전.",
    tickers: ["SPACEX*", "RKLB", "ASTS", "IRDM"],
    sub: [
      { slug: "space-launch",     name: "발사체 (로켓)" },
      { slug: "space-network",    name: "위성 네트워크" },
      { slug: "space-orbital-dc", name: "궤도 데이터센터" },
    ] },

  // 프런티어
  { slug: "quantum",          name: "양자컴퓨팅",            period: "2022–2026", group: "프런티어",
    desc: "초전도·이온·광자 노선의 PoC 경쟁. 미국이 전략자산으로 분류.",
    tickers: ["IONQ", "RGTI", "QBTS", "QUBT"] },
  { slug: "ai-robot-future",  name: "휴머노이드",            period: "2025–",     group: "프런티어",
    desc: "휴머노이드와 일자리·기본소득·새로운 유희경제 논의.",
    tickers: ["TSLA", "FIGURE*", "277810.KQ"] },
  { slug: "batteries",        name: "이차전지",              period: "2022–2023", group: "프런티어",
    desc: "전기차 폭주에서 케즘으로. ESS·전고체로 재시동 시도.",
    tickers: ["373220.KS", "006400.KS", "247540.KQ"] },

  // 지정학·국방
  { slug: "defense",          name: "방산",                  period: "2021–2025", group: "지정학·국방",
    desc: "우러전쟁 트리거의 K-방산 슈퍼사이클. 한화에어로·현대로템·LIG넥스원·KAI.",
    tickers: ["012450.KS", "064350.KS", "079550.KS", "047810.KS"] },
  { slug: "drones",           name: "드론",                  period: "2021–2025", group: "지정학·국방",
    desc: "탱크를 잡는 드론. AVAV·KTOS와 Replicator Initiative.",
    tickers: ["AVAV", "KTOS"] },
];

window.SECTOR_GROUPS = ["AI", "AI 인프라", "우주", "프런티어", "지정학·국방"];

// ---- Sidebar render -------------------------------------------------
function renderSidebar(activeSlug) {
  const root = document.getElementById("sidebar");
  if (!root) return;

  const groups = window.SECTOR_GROUPS.map(g => ({
    name: g,
    items: window.SECTORS.filter(s => s.group === g),
  }));

  // prefix 로직 — sectors/ 하위 페이지(섹터 + 하위분류)는 "../", 루트 페이지는 "./"
  // 경로 기반으로 판정 (data-sector가 SECTORS에 없는 하위분류 페이지도 정확히 처리)
  const isSectorPage = location.pathname.includes("/sectors/");
  const prefix = isSectorPage ? "../" : "./";

  // v4(Lite)로 돌아가는 복귀 경로 — v3은 /v3/ 하위에 있으므로 한 단계 더 상위로
  const liteHref = isSectorPage ? "../../index.html" : "../index.html";

  const html = `
    <a href="${prefix}index.html" class="brand" style="text-decoration:none;border-bottom:none">
      <div class="logo">$</div>
      <div>
        <div class="brand-title">Investing Memo</div>
        <div class="brand-sub">Macro · Sector · Themes</div>
      </div>
    </a>
    <a class="back-to-lite" href="${liteHref}">← Lite 요약으로</a>

    <div class="nav-group">
      <div class="nav-group-title">개요</div>
      <a class="nav-item ${activeSlug ? "" : "active"}" href="${prefix}index.html">
        <span>대시보드</span><span class="tag">INDEX</span>
      </a>
      <a class="nav-item ${activeSlug === "principles" ? "active" : ""}" href="${prefix}principles.html">
        <span>11원칙</span><span class="tag">RULES</span>
      </a>
      <a class="nav-item ${activeSlug === "timeline" ? "active" : ""}" href="${prefix}timeline.html">
        <span>연도별 키워드</span><span class="tag">TIME</span>
      </a>
    </div>

    ${groups.map(g => `
      <div class="nav-group">
        <div class="nav-group-title">${g.name}</div>
        ${g.items.map(s => {
          const subActive = s.sub && s.sub.some(sub => sub.slug === activeSlug);
          const itemActive = (activeSlug === s.slug || subActive) ? "active" : "";
          const subHtml = (s.sub && (activeSlug === s.slug || subActive))
            ? `<div class="nav-sub">${s.sub.map(sub => `
                <a class="nav-subitem ${activeSlug === sub.slug ? "active" : ""}" href="${prefix}sectors/${sub.slug}.html">
                  <span>${sub.name}</span>
                </a>`).join("")}</div>`
            : "";
          return `
          <a class="nav-item ${itemActive}" href="${prefix}sectors/${s.slug}.html">
            <span>${s.name}</span><span class="tag">${s.period.replace(/–.*/, "")}</span>
          </a>${subHtml}`;
        }).join("")}
      </div>
    `).join("")}

    <div class="nav-group">
      <div class="nav-group-title">메타</div>
      <a class="nav-item ${activeSlug === "methodology" ? "active" : ""}" href="${prefix}methodology.html">
        <span>방법론·면책</span><span class="tag">META</span>
      </a>
    </div>
  `;

  root.innerHTML = html;
}

// ---- Mobile sidebar toggle -----------------------------------------
function setupMobileToggle() {
  const btn = document.getElementById("mobileToggle");
  const sb  = document.getElementById("sidebar");
  if (!btn || !sb) return;
  btn.addEventListener("click", () => sb.classList.toggle("open"));
}

// ---- ECharts theme --------------------------------------------------
// 한글 가독성 우선 — Pretendard 우선, fallback으로 Inter / 시스템 폰트
window.FONT_SANS_KR = "Pretendard Variable, Pretendard, Inter, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif";
window.FONT_MONO_KR = "JetBrains Mono, Pretendard Variable, Consolas, monospace";

// 섹터 → 색상 매핑 — 4분면 차트(chartQuad)와 동일 팔레트
//   지정학·국방(앰버) · AI(청록) · AI 인프라(블루) · 프런티어(보라) · 이차전지(오렌지)
//   신규상장 강조는 핑크 (대장주 +1000% 시각 단서)
window.SECTOR_COLOR = {
  "방산":          "#ffb020",   // 4분면과 동일
  "드론":          "#ffb020",   // 같은 그룹 (앰버 톤)
  "데이터 솔루션":     "#2bd4a4",
  "AI LLM":         "#2bd4a4",
  "AI 엔터":        "#2bd4a4",
  "AI 인프라":     "#5aa7ff",
  "반도체":        "#5aa7ff",
  "반도체/HBM":    "#5aa7ff",
  "데이터센터":    "#5aa7ff",
  "이차전지":      "#ff7a00",
  "양자":          "#c489ff",
  "우주":          "#c489ff",
  "로봇":          "#c489ff",
  "휴머노이드":    "#c489ff",
  "신규상장 AI LLM":  "#2bd4a4",
  "신규상장 AI 엔터": "#2bd4a4",
};
window.sectorColor = function(s) { return window.SECTOR_COLOR[s] || "#8693a5"; };

// 섹터 활성도 히트맵 — v2.4 matplotlib Viridis colormap
//   다크 모드 시각화 표준 (Datawrapper·NN/g·Material 권장). 색약 친화.
//   딥 보라(무관심) → 블루 → 틸 → 그린(대장주) → 노랑(과열·정점).
//   명도 단조 증가 + cool→warm 그라데이션으로 다크 카드 위에서 정보 강도 명확.
window.HEATMAP_FOCUS_PALETTE = [
  "#440154", // 0.0 무관심      — 딥 보라 (Viridis 시작점)
  "#482878", // 0.5             — 보라
  "#3e4989", // 1.0 관심권      — 블루-퍼플
  "#31688e", // 1.5             — 블루
  "#26828e", // 2.0 주도주      — 틸 (warm 전환점)
  "#1f9e89", // 2.6             — 틸-그린
  "#35b779", // 3.1 대장주      — 그린
  "#6ece58", // 3.6             — 라임
  "#fde725"  // 4.0 과열·정점   — 노랑 (Viridis 끝점)
];

// 셀별 강조 제거 — 모든 셀이 동일한 스타일, 색상만 데이터값(level)에 따라
window.heatmapFocusPoint = function(point) {
  const value = Array.isArray(point) ? point : point.value;
  return {
    value,
    itemStyle: {
      borderRadius: 0,
      borderWidth: 0
    }
  };
};

window.CHART_THEME = {
  color: ["#f0c35d", "#2fbf9a", "#5aa7ff", "#9b8cff", "#ff4d6d", "#ff8b62", "#7fd6e8", "#d8b4fe"],
  textStyle: {
    color: "#d7dee8",
    fontFamily: window.FONT_SANS_KR,
    fontSize: 12.5,
  },
  backgroundColor: "transparent",
  title:   { textStyle: { color: "#f0f4fa", fontWeight: 600, fontFamily: window.FONT_SANS_KR }, subtextStyle: { color: "#8693a5", fontFamily: window.FONT_SANS_KR } },
  legend:  { textStyle: { color: "#d7dee8", fontFamily: window.FONT_SANS_KR } },
  tooltip: {
    backgroundColor: "rgba(17, 23, 32, 0.96)",
    borderColor: "#3a4555",
    borderWidth: 1,
    textStyle: { color: "#f0f4fa", fontFamily: window.FONT_SANS_KR },
    axisPointer: { lineStyle: { color: "#3a4555" }, crossStyle: { color: "#3a4555" } },
    confine: true,
    extraCssText: "max-width:min(280px, calc(100vw - 28px));white-space:normal;line-height:1.55;box-shadow:none;"
  },
  axisCommon: {
    axisLine:  { lineStyle: { color: "#3a4555" } },
    axisTick:  { lineStyle: { color: "#3a4555" } },
    axisLabel: { color: "#b7c3d2", fontFamily: window.FONT_SANS_KR, fontSize: 11.5 },
    // v2.6 — 축 이름(name)의 기본 색상도 다크 모드에 맞게 강제 (이전엔 미설정이라 ECharts 기본 어두운 회색이 적용됨)
    nameTextStyle: { color: "#a8b4c5", fontFamily: window.FONT_SANS_KR, fontSize: 11.5 },
    splitLine: { lineStyle: { color: "#1f2632", type: "dashed" } },
    splitArea: { areaStyle: { color: ["transparent", "transparent"] } },
  },
};

// 뷰포트 너비로 모바일 여부 판정
// CSS의 단일 컬럼 전환(980px)보다 좁은 700px 이하에서는 차트 UI도 모바일형으로 동작시킨다.
window.isMobile = () => window.innerWidth <= 700;
window.isTablet = () => window.innerWidth > 700 && window.innerWidth <= 980;

// 모바일에서 차트 옵션을 자동 슬림화 (grid 좁힘 + 라벨 폰트 축소 + 회전)
function applyMobileTweaks(option) {
  if (!window.isMobile()) return option;
  const cloneOption = value => {
    if (Array.isArray(value)) return value.map(cloneOption);
    if (value && typeof value === "object") {
      const out = {};
      Object.entries(value).forEach(([key, child]) => { out[key] = cloneOption(child); });
      return out;
    }
    return value;
  };
  const o = cloneOption(option);
  // grid 압축
  if (o.grid) {
    o.grid.left = Math.min(o.grid.left || 60, 46);
    o.grid.right = Math.max(Math.min(o.grid.right || 30, 30), 24);
    o.grid.top = Math.min(o.grid.top || 50, 40);
    o.grid.bottom = Math.max(o.grid.bottom || 40, 40);
    o.grid.containLabel = true;
  }
  // axis 라벨 축소 — 모바일에서도 한글 축 라벨은 10px 아래로 내리지 않는다.
  const shrinkAxis = ax => {
    if (!ax) return ax;
    const arr = Array.isArray(ax) ? ax : [ax];
    arr.forEach(a => {
      a.axisLabel = Object.assign({ fontSize: 10.5 }, a.axisLabel || {});
      if (a.axisLabel.fontSize > 11) a.axisLabel.fontSize = 11;
      if (a.nameTextStyle) a.nameTextStyle = Object.assign({}, a.nameTextStyle, { fontSize: 10.5 });
    });
    return arr.length === 1 && !Array.isArray(ax) ? arr[0] : arr;
  };
  if (o.xAxis) o.xAxis = shrinkAxis(o.xAxis);
  if (o.yAxis) o.yAxis = shrinkAxis(o.yAxis);
  // legend 축소
  if (o.legend) {
    o.legend.textStyle = Object.assign({}, o.legend.textStyle || {}, { fontSize: 11 });
    o.legend.itemGap = 8;
  }
  // visualMap 축소
  if (o.visualMap) {
    o.visualMap.itemWidth = Math.min(o.visualMap.itemWidth || 200, 240);
    o.visualMap.itemHeight = Math.min(o.visualMap.itemHeight || 14, 10);
    o.visualMap.textStyle = Object.assign({}, o.visualMap.textStyle || {}, { fontSize: 10 });
  }
  // graphic 텍스트 자동 축소
  if (Array.isArray(o.graphic)) {
    o.graphic.forEach(g => { if (g.style && g.style.font) g.style.font = g.style.font.replace(/\d+px/, "10px"); });
  }
  normalizeVisibleLabels(o);
  return o;
}

function isNearBlack(c) {
  return typeof c === "string" && /^(#000|#0a0e14|#111|black|rgb\(0\s*,\s*0\s*,\s*0\)|rgba\(0\s*,\s*0\s*,\s*0)/i.test(c.trim());
}

function normalizeVisibleLabels(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach(normalizeVisibleLabels);
    return;
  }
  ["label", "axisLabel", "upperLabel", "detail", "nameTextStyle"].forEach(key => {
    const target = node[key];
    if (target && typeof target === "object" && (target.show || key !== "label")) {
      if (!target.color || isNearBlack(target.color)) target.color = "#f0f4fa";
      target.textBorderColor = target.textBorderColor || "rgba(10,14,20,0.78)";
      target.textBorderWidth = target.textBorderWidth || 2;
    } else if (target && typeof target === "object" && isNearBlack(target.color)) {
      target.color = "#f0f4fa";
      target.textBorderColor = target.textBorderColor || "rgba(10,14,20,0.78)";
      target.textBorderWidth = target.textBorderWidth || 2;
    }
  });
  Object.values(node).forEach(normalizeVisibleLabels);
}

function normalizeSeriesLegibility(option) {
  const series = Array.isArray(option.series) ? option.series : (option.series ? [option.series] : []);
  series.forEach(s => {
    if (!s || typeof s !== "object") return;
    if (s.label && typeof s.label === "object" && s.label.show) {
      s.label.color = s.label.color || "#f0f4fa";
      s.label.textBorderColor = s.label.textBorderColor || "rgba(10,14,20,0.82)";
      s.label.textBorderWidth = s.label.textBorderWidth || 2;
      if (!s.labelLayout && ["scatter", "line", "bar", "pie"].includes(s.type)) {
        s.labelLayout = { hideOverlap: true };
      }
    }
    if (s.type === "pie" && s.avoidLabelOverlap === undefined) {
      s.avoidLabelOverlap = true;
    }
    if (s.type === "pie" && window.isMobile && window.isMobile()) {
      s.label = Object.assign({}, s.label || {}, { show: false });
      s.labelLine = Object.assign({}, s.labelLine || {}, { show: false });
      s.avoidLabelOverlap = true;
    }
  });
}

// v2.7 — KakaoTalk/Naver 인앱 WebView 호환: 차트 init 후 resize 강제로 0×0 캔버스 방지
//        init 시점에 컨테이너가 아직 레이아웃되지 않으면 캔버스가 0×0으로 그려져 안 보이는 사고가 잦음.
//        다음 시점에 모두 resize: rAF 직후 / 300ms 후 / window 'load' / fonts ready.
const __mkChartInstances = [];
function __resizeAllCharts() {
  __mkChartInstances.forEach(c => {
    try {
      if (c && !c.isDisposed()) {
        c.resize();
        // 컨테이너 폭이 0이면 다음 rAF에 한 번 더
        const dom = c.getDom && c.getDom();
        if (dom && dom.clientWidth === 0) {
          setTimeout(() => { try { c.resize(); } catch(_){} }, 200);
        }
      }
    } catch (_) { /* ignore */ }
  });
}
if (typeof window !== "undefined") {
  window.addEventListener("load", () => setTimeout(__resizeAllCharts, 0));
  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
    document.fonts.ready.then(() => setTimeout(__resizeAllCharts, 50));
  }
  // 페이지 가시성 변화 (탭 전환 / 인앱 → 외부) 후에도 한 번 더
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) setTimeout(__resizeAllCharts, 80);
  });
}

// Apply default options to every chart instance built via mkChart()
// Mobile (<=600px) label-overlap mitigation, non-destructive
function applyMobileChartDefaults(opt) {
  if (!opt || (window.innerWidth || 9999) > 600) return;
  if (opt.grid && !Array.isArray(opt.grid) && typeof opt.grid.right === 'number' && opt.grid.right < 38) opt.grid.right = 38;
  var axes = [];
  ['xAxis','yAxis'].forEach(function (k) { if (Array.isArray(opt[k])) axes = axes.concat(opt[k]); else if (opt[k]) axes.push(opt[k]); });
  axes.forEach(function (ax) { if (!ax) return; ax.axisLabel = ax.axisLabel || {}; if (ax.axisLabel.hideOverlap === undefined) ax.axisLabel.hideOverlap = true; if (ax.axisLabel.fontSize === undefined) ax.axisLabel.fontSize = 10; });
  if (opt.radar) { (Array.isArray(opt.radar) ? opt.radar : [opt.radar]).forEach(function (r) { if (!r) return; r.axisName = r.axisName || {}; if (r.axisName.fontSize === undefined) r.axisName.fontSize = 9; if (r.radius === undefined) r.radius = '60%'; }); }
  var series = Array.isArray(opt.series) ? opt.series : (opt.series ? [opt.series] : []);
  series.forEach(function (sr) { if (sr && sr.label && sr.label.show && sr.label.fontSize === undefined) sr.label.fontSize = 10; if (sr && sr.type === 'pie' && sr.label && sr.label.fontSize === undefined) sr.label.fontSize = 10; });
}

function mkChart(domId, option) {
  try { applyMobileChartDefaults(option); } catch (e) {}
  const dom = document.getElementById(domId);
  if (!dom || typeof echarts === "undefined") return null;
  const chart = echarts.init(dom, null, { renderer: "canvas" });
  const T = window.CHART_THEME;

  const build = (opt) => {
    const tweaked = applyMobileTweaks(opt);
    normalizeVisibleLabels(tweaked);
    normalizeSeriesLegibility(tweaked);
    const merged = Object.assign({}, tweaked, {
      color: T.color,
      backgroundColor: T.backgroundColor,
      textStyle: T.textStyle,
      title: tweaked.title ? Object.assign({}, T.title, tweaked.title) : undefined,
      legend: tweaked.legend ? Object.assign({}, T.legend, tweaked.legend) : undefined,
      tooltip: tweaked.tooltip ? Object.assign({}, T.tooltip, tweaked.tooltip) : T.tooltip,
      grid: Object.assign({ left: window.isMobile() ? 46 : 56, right: window.isMobile() ? 24 : 30, top: 50, bottom: 40, containLabel: true }, tweaked.grid || {}),
    });

    // Inject axis defaults
    const applyAxis = (ax) => {
      if (!ax) return ax;
      const arr = Array.isArray(ax) ? ax : [ax];
      return arr.map(a => Object.assign({}, T.axisCommon, a, {
        axisLabel: Object.assign({}, T.axisCommon.axisLabel, a.axisLabel || {}),
        // v2.6 — 축 이름의 색상도 항상 다크 모드 기본을 보장 (axisLabel과 같은 패턴)
        nameTextStyle: Object.assign({}, T.axisCommon.nameTextStyle, a.nameTextStyle || {}),
      }));
    };
    if (tweaked.xAxis) merged.xAxis = applyAxis(tweaked.xAxis);
    if (tweaked.yAxis) merged.yAxis = applyAxis(tweaked.yAxis);
    return merged;
  };

  chart.setOption(build(option));

  // v2.7 — 인앱 WebView 0×0 캔버스 방지: init 직후 + 300ms 후 강제 resize
  __mkChartInstances.push(chart);
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => { try { chart.resize(); } catch(_){} });
  }
  setTimeout(() => { try { chart.resize(); } catch(_){} }, 300);

  // 뷰포트 변경 시 차트 옵션도 재빌드 (모바일 ↔ 데스크탑 전환)
  let lastIsMobile = window.isMobile();
  window.addEventListener("resize", () => {
    chart.resize();
    const m = window.isMobile();
    if (m !== lastIsMobile) {
      chart.setOption(build(option), true);
      lastIsMobile = m;
    }
  });
  return chart;
}

window.mkChart = mkChart;

// ---- Ticker dictionary -----------------------------------------------
// 코드/축약명 → "풀네임 · 거래소:티커" 호버 툴팁용
window.TICKER_NAMES = {
  // 미국
  "MSFT":  "Microsoft · NASDAQ:MSFT",
  "AMZN":  "Amazon.com · NASDAQ:AMZN",
  "GOOGL": "Alphabet (Google) · NASDAQ:GOOGL",
  "META":  "Meta Platforms · NASDAQ:META",
  "NVDA":  "NVIDIA · NASDAQ:NVDA",
  "AVGO":  "Broadcom · NASDAQ:AVGO",
  "TSM":   "Taiwan Semiconductor · NYSE:TSM",
  "IBM":   "International Business Machines · NYSE:IBM",
  "MU":    "Micron Technology · NASDAQ:MU",
  "CEG":   "Constellation Energy · NASDAQ:CEG",
  "VRT":   "Vertiv Holdings · NYSE:VRT",
  "ETN":   "Eaton · NYSE:ETN",
  "OKLO":  "Oklo (SMR) · NYSE:OKLO",
  "PLTR":  "Palantir Technologies · NASDAQ:PLTR",
  "CRM":   "Salesforce · NYSE:CRM",
  "NOW":   "ServiceNow · NYSE:NOW",
  "ADBE":  "Adobe · NASDAQ:ADBE",
  "SNOW":  "Snowflake · NYSE:SNOW",
  "VEEV":  "Veeva Systems · NYSE:VEEV",
  "DBX":   "Dropbox · NASDAQ:DBX",
  "AI":    "C3.ai · NYSE:AI",
  "TSLA":  "Tesla · NASDAQ:TSLA",
  "RKLB":  "Rocket Lab · NASDAQ:RKLB",
  "ASTS":  "AST SpaceMobile · NASDAQ:ASTS",
  "IRDM":  "Iridium Communications · NASDAQ:IRDM",
  "IONQ":  "IonQ · NYSE:IONQ",
  "RGTI":  "Rigetti Computing · NASDAQ:RGTI",
  "QBTS":  "D-Wave Quantum · NYSE:QBTS",
  "QUBT":  "Quantum Computing Inc. · NASDAQ:QUBT",
  "RTX":   "RTX (Raytheon) · NYSE:RTX",
  "AVAV":  "AeroVironment · NASDAQ:AVAV",
  "KTOS":  "Kratos Defense · NASDAQ:KTOS",
  // 비상장 (별표)
  "SPACEX*":    "SpaceX · 비상장 (2026.5 S-1 공시)",
  "ANTHROPIC*": "Anthropic · 비상장 (2026.2 Series G $380B post)",
  "OPENAI*":    "OpenAI · 비상장",
  "FIGURE*":    "Figure AI · 비상장 (휴머노이드)",
  "SCATTERLAB*":"스캐터랩 (이루다) · 비상장",
  "WRTN*":      "뤼튼 테크놀로지스 · 비상장",
  "DBX*":       "Dropbox · NASDAQ:DBX (별표=구버전)",
  "MINIMAX*":   "MiniMax · 0100.HK (2026.1.9 IPO)",
  // 한국
  "삼성전자":         "삼성전자 · KRX:005930",
  "SK하이닉스":       "SK하이닉스 · KRX:000660",
  "HD현대일렉":       "HD현대일렉트릭 · KRX:267260",
  "HD현대일렉트릭":   "HD현대일렉트릭 · KRX:267260",
  "한화에어로":       "한화에어로스페이스 · KRX:012450",
  "현대로템":         "현대로템 · KRX:064350",
  "LIG넥스원":        "LIG넥스원 · KRX:079550",
  "KAI":              "한국항공우주산업(KAI) · KRX:047810",
  "LG엔솔":           "LG에너지솔루션 · KRX:373220",
  "에코프로비엠":     "에코프로비엠 · KRX:247540",
  "삼성SDI":          "삼성SDI · KRX:006400",
  "두산에너빌리티":   "두산에너빌리티 · KRX:034020",
  "레인보우로보":     "레인보우로보틱스 · KRX:277810 (삼성 자회사)",
  "레인보우로보틱스": "레인보우로보틱스 · KRX:277810 (삼성 자회사)",
  // 한국 코드
  "005930":   "삼성전자 · KRX:005930",
  "000660":   "SK하이닉스 · KRX:000660",
  "012450":   "한화에어로스페이스 · KRX:012450",
  "064350":   "현대로템 · KRX:064350",
  "079550":   "LIG넥스원 · KRX:079550",
  "047810":   "한국항공우주산업(KAI) · KRX:047810",
  "267260":   "HD현대일렉트릭 · KRX:267260",
  "373220":   "LG에너지솔루션 · KRX:373220",
  "006400":   "삼성SDI · KRX:006400",
  "247540":   "에코프로비엠 · KRX:247540",
  "277810":   "레인보우로보틱스 · KRX:277810",
  // 신규상장
  "Zhipu":           "智谱AI (Zhipu) · 2513.HK · IPO 2026.1.8",
  "Zhipu/아틀라스":  "智谱AI · Knowledge Atlas Technology JSC · 2513.HK",
  "아틀라스 테크놀로지": "Knowledge Atlas Technology JSC (Zhipu AI) · 2513.HK",
  "MiniMax":         "MiniMax · 0100.HK · IPO 2026.1.9",
};
window.tk = function(code) {
  const name = window.TICKER_NAMES[code];
  if (!name) return code;
  return `<span class="tk" title="${name}">${code}</span>`;
};

// ---- Term glossary (ARR, MAU, ARPU 등) -------------------------------
window.TERM_GLOSSARY = {
  "ARR":   "Annual Recurring Revenue · 연간 반복 매출. 비상장 AI 기업의 경우 보통 'annualized revenue run rate'(현재 매출 흐름을 12개월로 환산한 run-rate) 의미로 사용",
  "ARPU":  "Average Revenue Per User · 사용자당 평균 매출 = 매출 ÷ 유료 사용자 수 (구독 플랜 정가 아님)",
  "MAU":   "Monthly Active Users · 월간 활성 사용자 수",
  "WAU":   "Weekly Active Users · 주간 활성 사용자 수",
  "DAU":   "Daily Active Users · 일간 활성 사용자 수",
  "CapEx": "Capital Expenditure · 자본적 지출. 데이터센터·반도체 라인 등 미래 투자",
  "OPM":   "Operating Margin · 영업이익률 = 영업이익 ÷ 매출",
  "YoY":   "Year-over-Year · 전년 동기 대비",
  "YTD":   "Year-To-Date · 연초 대비 현재까지 누적",
  "HBM":   "High Bandwidth Memory · 고대역폭 메모리 (AI/HPC용 적층 D램)",
  "FCF":   "Free Cash Flow · 잉여현금흐름",
  "TAM":   "Total Addressable Market · 도달 가능한 전체 시장 규모",
  "ROI":   "Return On Investment · 투자수익률",
  "EPS":   "Earnings Per Share · 주당순이익",
  "PER":   "Price-to-Earnings Ratio · 주가수익비율 = 주가 ÷ EPS",
  "PSR":   "Price-to-Sales Ratio · 주가매출비율 = 시총 ÷ 매출",
  "EV":    "Enterprise Value · 기업가치 = 시총 + 순부채",
  "EBITDA":"Earnings Before Interest, Tax, Depreciation, Amortization · 감가상각 전 영업이익",
  "RPO":   "Remaining Performance Obligations · 잔여수행의무 (장기계약 잔액)",
  "NDR":   "Net Dollar Retention · 기존 고객 순매출 유지율",
  "ACV":   "Annual Contract Value · 연간 계약 금액",
  "LTV":   "Lifetime Value · 고객 생애가치",
  "CAC":   "Customer Acquisition Cost · 고객 획득 비용",
  "SaaS":  "Software as a Service · 구독형 소프트웨어",
  "FPV":   "First-Person View · 1인칭 시점 드론 (조종사 시점 영상)",
  "SMR":   "Small Modular Reactor · 소형 모듈 원전",
  "SST":   "Solid-State Transformer · 반도체 변압기",
  "ESS":   "Energy Storage System · 에너지 저장 시스템",
  "SiC":   "Silicon Carbide · 탄화규소 (고전압 전력반도체 소재)",
  "IPO":   "Initial Public Offering · 신규 상장",
  "IRA":   "Inflation Reduction Act · 미국 인플레감축법 (EV·청정에너지 세액공제)",
  "IEEPA": "International Emergency Economic Powers Act · 미국 국제비상경제권한법 (관세·제재 근거)",
  "S-1":   "SEC Form S-1 · 미국 신규상장 등록신고서",
  "PoC":   "Proof of Concept · 개념 증명 (양산 전 시제품·실증)",
};
window.glossaryHTML = function(terms) {
  const items = (terms || Object.keys(window.TERM_GLOSSARY)).map(t => {
    const v = window.TERM_GLOSSARY[t];
    return v ? `<dt>${t}</dt><dd>${v}</dd>` : "";
  }).join("");
  return `<dl class="glossary">${items}</dl>`;
};

window.setupResponsiveTables = function() {
  document.querySelectorAll(".table-wrap table").forEach(table => {
    const headers = Array.from(table.querySelectorAll("thead th")).map(th =>
      th.textContent.replace(/\s+/g, " ").trim()
    );
    const wrap = table.closest(".table-wrap");

    // v1.9 — 표 분류 로직 개선
    //   ① 가로 비교가 핵심인 표는 모바일에서도 가로 스크롤 + 첫 컬럼 sticky로 유지
    //      (카드형으로 변환되면 같은 행 데이터끼리 비교가 어려워지므로)
    //   ② 명시 화이트리스트: leader-table / llm-matrix / rule-matrix / arpu-precision
    //   ③ 자동 판정: thead 컬럼 ≥ 4 → 가로 비교 표로 간주
    //   ④ 명시 강제 카드형: .force-card-table 클래스
    //   ⑤ 그 외 (컬럼 ≤ 3): 카드형 자동 변환

    const colCount = (table.querySelector("thead tr")?.children.length) || 0;
    const forceCard = wrap && wrap.classList.contains("force-card-table");
    const explicitMatrix =
      table.classList.contains("leader-table") ||
      !!table.closest(".llm-matrix") ||
      !!(wrap && (wrap.classList.contains("rule-matrix") || wrap.classList.contains("arpu-precision")));
    const wideComparison = colCount >= 4;
    const keepMatrix = !forceCard && (explicitMatrix || wideComparison);

    if (wrap && !keepMatrix) {
      wrap.classList.add("mobile-card-table");
    }
    // scrollable-matrix는 leader-table이 아닌 경우에만 (leader-table은 자체 모바일 CSS 보유)
    if (wrap && keepMatrix && !table.classList.contains("leader-table")) {
      wrap.classList.add("scrollable-matrix");
    }

    table.querySelectorAll("tbody tr").forEach(row => {
      Array.from(row.children).forEach((cell, idx) => {
        if (!["TD", "TH"].includes(cell.tagName)) return;
        if (!cell.dataset.label) cell.dataset.label = headers[idx] || headers[0] || "";
      });
    });
  });
};
// 문서 본문의 <abbr data-term="ARR">ARR</abbr>를 자동으로 title 채워넣기
window.fillAbbrs = function() {
  document.querySelectorAll("abbr[data-term]").forEach(el => {
    const t = el.getAttribute("data-term");
    if (window.TERM_GLOSSARY[t] && !el.getAttribute("title")) {
      el.setAttribute("title", window.TERM_GLOSSARY[t]);
    }
  });
};

// 본문 텍스트에서 알려진 용어(ARR, MAU 등)를 자동으로 abbr 태그로 감싸기
// 각 용어를 페이지에서 "첫 등장" 위치에만 적용 (시각적 노이즈 최소화)
// 사용자가 그 용어를 처음 만날 때 한 번 호버해서 익히고, 이후엔 그대로 읽도록.
window.autoTermify = function() {
  if (!window.TERM_GLOSSARY) return;
  const terms = Object.keys(window.TERM_GLOSSARY).sort((a, b) => b.length - a.length); // 긴 단어 우선
  const seen = new Set();
  // 이미 본문에 abbr로 들어간 단어는 seen에 추가
  document.querySelectorAll("abbr[data-term]").forEach(el => seen.add(el.getAttribute("data-term")));

  const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const SKIP_TAGS = new Set(["ABBR", "SCRIPT", "STYLE", "CODE", "PRE", "H1", "H2", "H3", "H4", "H5", "TITLE", "META"]);
  const containers = document.querySelectorAll(".main p, .main li, .main td, .main .sector-desc, .main .callout p, .main .card p, .main .glossary dd, .main .section-lede");

  function isInsideSkip(node, root) {
    let p = node.parentNode;
    while (p && p !== root) {
      if (SKIP_TAGS.has(p.tagName)) return true;
      p = p.parentNode;
    }
    return false;
  }

  // 페이지 전체에서 첫 등장만 변환 — 각 컨테이너의 텍스트 노드를 차례로 탐색
  containers.forEach(node => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: t => {
        if (!t.nodeValue || !t.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (isInsideSkip(t, node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(textNode => {
      // 아직 안 본 용어 중 첫 매칭만 찾기
      let bestMatch = null;
      let bestIdx = Infinity;
      let bestTerm = null;
      for (const term of terms) {
        if (seen.has(term)) continue;
        const re = new RegExp(`(^|[^A-Za-z0-9])(${escape(term)})($|[^A-Za-z0-9])`);
        const m = re.exec(textNode.nodeValue);
        if (m) {
          const idx = m.index + m[1].length;
          if (idx < bestIdx) {
            bestIdx = idx;
            bestMatch = m;
            bestTerm = term;
          }
        }
      }
      if (!bestMatch) return;
      const text = textNode.nodeValue;
      const before = text.slice(0, bestIdx);
      const after = text.slice(bestIdx + bestTerm.length);
      const frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      const ab = document.createElement("abbr");
      ab.setAttribute("data-term", bestTerm);
      ab.setAttribute("title", window.TERM_GLOSSARY[bestTerm]);
      ab.textContent = bestTerm;
      frag.appendChild(ab);
      const tailNode = document.createTextNode(after);
      frag.appendChild(tailNode);
      textNode.parentNode.replaceChild(frag, textNode);
      seen.add(bestTerm);
      // 같은 노드 뒷부분에 또 다른 용어가 있을 수 있으니 후속 처리: tailNode를 walker에 안 넣으므로
      // 새로 펼친 tailNode에 대해 재귀 처리 (단순화)
      // 깊이 1단계만 — 한 노드 안에 미세하게 여러 용어가 처음 등장하는 경우
      let cur = tailNode;
      while (true) {
        let m2 = null, idx2 = Infinity, term2 = null;
        for (const term of terms) {
          if (seen.has(term)) continue;
          const re = new RegExp(`(^|[^A-Za-z0-9])(${escape(term)})($|[^A-Za-z0-9])`);
          const m = re.exec(cur.nodeValue);
          if (m) {
            const ix = m.index + m[1].length;
            if (ix < idx2) { idx2 = ix; m2 = m; term2 = term; }
          }
        }
        if (!m2) break;
        const t = cur.nodeValue;
        const b2 = t.slice(0, idx2);
        const a2 = t.slice(idx2 + term2.length);
        const fr = document.createDocumentFragment();
        if (b2) fr.appendChild(document.createTextNode(b2));
        const ab2 = document.createElement("abbr");
        ab2.setAttribute("data-term", term2);
        ab2.setAttribute("title", window.TERM_GLOSSARY[term2]);
        ab2.textContent = term2;
        fr.appendChild(ab2);
        const newTail = document.createTextNode(a2);
        fr.appendChild(newTail);
        cur.parentNode.replaceChild(fr, cur);
        seen.add(term2);
        cur = newTail;
      }
    });
  });
};

// ---- Number formatting -----------------------------------------------
window.fmt = {
  krw:   (n) => (n >= 1e12 ? (n/1e12).toFixed(1)+"조" : n >= 1e8 ? (n/1e8).toFixed(0)+"억" : n.toLocaleString()),
  usd:   (n) => "$" + (n >= 1e9 ? (n/1e9).toFixed(1)+"B" : n >= 1e6 ? (n/1e6).toFixed(0)+"M" : n.toLocaleString()),
  pct:   (n) => (n>0?"+":"") + n.toFixed(1) + "%",
};

// ---- Subnav (본문 상단 하위메뉴 칩 바) — 상위 복귀 + 형제 하위메뉴 ----
function renderSubnav(activeSlug) {
  if (!activeSlug) return;
  let parent = null, isParent = false;
  for (const s of window.SECTORS) {
    if (!s.sub) continue;
    if (s.slug === activeSlug) { parent = s; isParent = true; break; }
    if (s.sub.some(sub => sub.slug === activeSlug)) { parent = s; break; }
  }
  if (!parent) return;                          // 하위메뉴 없는 섹터는 칩바 미표시
  const main = document.querySelector(".main");
  if (!main) return;
  const chips = [
    `<a class="subnav-chip parent ${isParent ? "active" : ""}" href="./${parent.slug}.html">▣ ${parent.name} 전체</a>`,
    ...parent.sub.map(sub => `<a class="subnav-chip ${activeSlug === sub.slug ? "active" : ""}" href="./${sub.slug}.html">${sub.name}</a>`)
  ].join("");
  const bar = document.createElement("nav");
  bar.className = "subnav";
  bar.setAttribute("aria-label", parent.name + " 하위 메뉴");
  bar.innerHTML = chips;
  const crumb = main.querySelector(".crumb");
  if (crumb) crumb.insertAdjacentElement("afterend", bar);
  else main.insertBefore(bar, main.firstChild);
}

// ---- Init on DOM ready ----------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const slug = document.body.dataset.sector || null;
  renderSidebar(slug);
  renderSubnav(slug);
  setupMobileToggle();
  if (window.fillAbbrs) window.fillAbbrs();
  if (window.autoTermify) window.autoTermify();
  if (window.setupResponsiveTables) window.setupResponsiveTables();
});
