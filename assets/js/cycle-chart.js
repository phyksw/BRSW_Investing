/* ============================================================
   Lite 홈 — 대표 종목 사이클 이동 산포 (시총 vs 수익률)
   v3 chartPos를 Lite(라이트 망고보드 톤)로 이식.
   데이터·애니메이션·호버 별자리·상세 패널 기능 100% 유지.
   ECharts 5.x 필요 (index.html에서 CDN 로드).
   ============================================================ */
(function () {
  if (typeof echarts === "undefined") return;
  var dom = document.getElementById("cyclePos");
  if (!dom) return;

  var mobile = window.innerWidth <= 700;
  var FONT = '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';

  /* --- 라이트 망고보드 팔레트 (v4 토큰과 통일) --- */
  var C = {
    line:   "#ece4d4",          // 그리드/축선 (베이지)
    axis:   "#8b8b9c",          // 축 라벨 (muted)
    axisName: "#595969",        // 축 이름
    note:   "#8b8b9c",
    hi:     "#ff8c1a",          // 별자리 하이라이트 (망고)
    hiSoft: "rgba(255,140,26,0.85)",
    tipBg:  "rgba(255,255,255,0.97)",
    tipBorder: "#ece4d4",
    tipText: "#1a1a2e",
    pointBorder: "#ffffff",     // 점 외곽선 (흰 카드 위 대비)
    labelText: "#1a1a2e",
    labelBorder: "rgba(255,255,255,0.92)",
    zeroLine: "#d8cfbf"
  };
  // 섹터 → 색 (v4 라이트 그라데이션 대표색)
  var SECTOR_COLOR = {
    "방산": "#e67200", "드론": "#e67200",
    "데이터 솔루션": "#20bfa9", "AI LLM": "#20bfa9", "AI 엔터": "#20bfa9",
    "신규상장 AI LLM": "#20bfa9", "신규상장 AI 엔터": "#20bfa9",
    "AI 인프라": "#4a90e2", "반도체": "#4a90e2", "반도체/HBM": "#4a90e2", "데이터센터": "#4a90e2",
    "이차전지": "#ff8c1a",
    "양자": "#8b5cf6", "우주": "#8b5cf6", "로봇": "#8b5cf6", "휴머노이드": "#8b5cf6"
  };
  function sectorColorFn(s) { return SECTOR_COLOR[s] || "#8b8b9c"; }

  /* ============================================================
     데이터 (v3 chain-rule 정합값 그대로 — 1차 권위는 v3)
     [mcap $B, annual return %, ticker, sector, tooltip(, meta)]
     ============================================================ */
  var data2024 = [
    [1.7,237,"QBTS","양자","D-Wave Quantum · NYSE:QBTS · 2024 EOY 시총 $1.7B · 2024 +237%"],
    [5.8,1000,"ASTS","우주","AST SpaceMobile · NASDAQ:ASTS · 2024 EOY $5.8B · 2024 +1,000%"],
    [8,360,"RKLB","우주","Rocket Lab · NASDAQ:RKLB · 2024 EOY $8B · 2024 +360%"],
    [80,340,"PLTR","데이터 솔루션","Palantir · NASDAQ:PLTR · 2024 EOY $80B · 2024 +340% (S&P 1위)"],
    [70,45,"SK하이닉스","반도체","SK하이닉스 · KRX:000660 · 2024 EOY $70B"],
    [240,-32,"삼성전자","반도체","삼성전자 · KRX:005930 · 2024 EOY $240B · 2024 -31.8% (HBM3E 지연)"],
    [21,174,"한화에어로","방산","한화에어로스페이스 · KRX:012450 · 2024 EOY $21B"],
    [3.4,90,"KTOS","드론","Kratos · NASDAQ:KTOS · 2024 EOY $3.4B · Valkyrie 수혜"],
    [178,37,"IBM","데이터 솔루션","IBM · NYSE:IBM · 2024 EOY $178B"],
    [2100,36,"GOOGL","AI LLM","Alphabet · NASDAQ:GOOGL · 2024 EOY $2,100B"],
    [3400,171,"NVDA","반도체","NVIDIA · NASDAQ:NVDA · 2024 EOY $3,400B · 2024 +171% (HBM/Blackwell)"],
    [3100,12,"MSFT","AI 인프라","Microsoft · NASDAQ:MSFT · 2024 EOY $3,100B"],
    [220,-25,"ADBE","데이터 솔루션","Adobe · NASDAQ:ADBE · 2024 EOY $220B (Sora 등장)"],
    [1300,63,"TSLA","로봇","Tesla · NASDAQ:TSLA · 2024 EOY $1,300B"]
  ];
  var data2025 = [
    [9.7,471,"QBTS","양자","D-Wave · QBTS · 2025 EOY $9.7B · 2025 +471% ($1.7B → $9.7B)"],
    [28.4,390,"ASTS","우주","AST SpaceMobile · ASTS · 2025 EOY $28.4B · 2025 +390%"],
    [333,376,"SK하이닉스","반도체","SK하이닉스 · 000660 · 2025 EOY $333B · 2025 +376% ($70B → $333B)"],
    [45,115,"한화에어로","방산","한화에어로 · 012450 · 2025 EOY $45B · 2025 +115% ($21B → $45B)"],
    [18.1,0,"HD현대일렉","데이터센터","HD현대일렉 · 267260 · 2025 EOY $18.1B · 2024 데이터 부재"],
    [13.2,0,"현대로템","방산","현대로템 · 064350 · 2025 EOY $13.2B · 2024 데이터 부재"],
    [14.2,318,"KTOS","드론","Kratos · KTOS · 2025 EOY $14.2B · 2025 +318% ($3.4B → $14.2B)"],
    [40.5,406,"RKLB","우주","Rocket Lab · RKLB · 2025 EOY $40.5B · 2025 +406% ($8B → $40.5B)"],
    [426,433,"PLTR","데이터 솔루션","Palantir · PLTR · 2025 EOY $426B · 2025 +433% ($80B → $426B)"],
    [676,181,"삼성전자","반도체","삼성전자 · 005930 · 2025 EOY $676B · 2025 +181% ($240B → $676B)"],
    [9.0,0,"레인보우로보","로봇","레인보우로보 · 277810 · 2025 EOY $9.0B · 2024 데이터 부재"],
    [278,56,"IBM","데이터 솔루션","IBM · 2025 EOY $278B · 2025 +56% ($178B → $278B)"],
    [3771,80,"GOOGL","AI LLM","Alphabet · GOOGL · 2025 EOY $3,771B · 2025 +80% ($2,100B → $3,771B)"],
    [4509,33,"NVDA","반도체","NVIDIA · NVDA · 2025 EOY $4,509B · 2025 +33% ($3,400B → $4,509B)"],
    [3591,16,"MSFT","AI 인프라","Microsoft · MSFT · 2025 EOY $3,591B · 2025 +16% ($3,100B → $3,591B)"],
    [142,-35,"ADBE","데이터 솔루션","Adobe · ADBE · 2025 EOY $142B · 2025 -35% ($220B → $142B)"],
    [1414,9,"TSLA","로봇","Tesla · TSLA · 2025 EOY $1,414B · 2025 +9% ($1,300B → $1,414B)"]
  ];
  var data2026 = [
    [97.9,1415,"Zhipu★","신규상장 AI LLM","智谱AI · 2513.HK · IPO 2026.1.8 공모가 HKD 116 · 5/29 HKD 1,758 · $97.9B · IPO +1,415%",{ipoStart:[6.9,0],ipoDate:"2026.1.8"}],
    [34.6,420,"MiniMax★","신규상장 AI 엔터","MiniMax · 0100.HK · IPO 2026.1.9 공모가 HKD 165 · 5/29 HKD 858 · $34.6B · IPO +420%",{ipoStart:[6.5,0],ipoDate:"2026.1.9"}],
    [1324,96,"삼성전자","반도체","삼성전자 · 005930 · 5/29 ₩313,500 · 1,987조 ÷1,501원 = $1.32T · 2026 YTD ≈ +96% USD"],
    [1107,232,"SK하이닉스","반도체","SK하이닉스 · 000660 · 5/29 ₩2,337,000 · 1,662조 ÷1,501원 = $1.11T · 2026 YTD ≈ +232% USD"],
    [40.8,-10,"한화에어로","방산","한화에어로 · 012450 · 5/29 ₩1,189,000 · $40.8B · 2026 YTD ≈ -10% 추정"],
    [24.5,35,"HD현대일렉","데이터센터","HD현대일렉 · 267260 · $24.5B · 2026 YTD ≈ +35% 추정"],
    [14.5,10,"현대로템","방산","현대로템 · 064350 · $14.5B · 2026 YTD ≈ +10% 추정"],
    [9.0,0,"레인보우로보","로봇","레인보우로보틱스 · 277810 · 약 13.5조 ÷1,501원 = $9.0B · YTD 추적 · 삼성 자회사"],
    [44.0,30,"두산에너빌리티","데이터센터","두산에너빌리티 · 034020 · $44.0B · 2026 YTD ≈ +30% 추정 (SMR+변압기)"],
    [5180,14.88,"NVDA","반도체","NVIDIA · NVDA · 5/28 $214.25 · $5.18T · 2026 YTD +14.88%"],
    [4700,24.64,"GOOGL","AI LLM","Alphabet · GOOGL · 5/28 $390.13 · $4.70T · 2026 YTD +24.64%"],
    [3170,-11.71,"MSFT","AI 인프라","Microsoft · MSFT · 5/28 $426.99 · $3.17T · 2026 YTD -11.71%"],
    [2950,18.71,"AMZN","AI 인프라","Amazon · AMZN · 5/28 $274.00 · $2.95T · 2026 YTD +18.71%"],
    [2020,23.25,"AVGO","반도체","Broadcom · AVGO · 5/28 $426.58 · $2.02T · 2026 YTD +23.25%"],
    [1910,39.81,"TSM","반도체","TSMC · TSM · 5/28 $424.86 · $1.91T · 2026 YTD +39.81%"],
    [1610,-3.76,"META","AI LLM","Meta · META · 5/28 $635.29 · $1.61T · 2026 YTD -3.76%"],
    [1390,-1.69,"TSLA","로봇","Tesla · TSLA · 5/28 $442.10 · $1.39T · 2026 YTD -1.69%"],
    [1040,223.58,"MU","반도체","Micron · MU · 5/28 $923.52 · $1.04T · 2026 YTD +223.58% · 5/26 $1T 클럽"],
    [344,-19.36,"PLTR","데이터 솔루션","Palantir · PLTR · 5/28 $143.34 · $344B · 2026 YTD -19.36%"],
    [248,-10.80,"IBM","데이터 솔루션","IBM · 5/28 $264.22 · $248B · 2026 YTD -10.80%"],
    [156,26.19,"ETN","데이터센터","Eaton · ETN · 5/28 $401.94 · $156B · 2026 YTD +26.19%"],
    [144,-33.50,"CRM","데이터 솔루션","Salesforce · CRM · 5/28 $176.17 · $144B · 2026 YTD -33.50%"],
    [121,93.93,"VRT","데이터센터","Vertiv · VRT · 5/28 $314.18 · $121B · 2026 YTD +93.93%"],
    [112,-29.02,"NOW","데이터 솔루션","ServiceNow · NOW · 5/28 $108.73 · $112B · 2026 YTD -29.02%"],
    [103,-18.95,"CEG","데이터센터","Constellation · CEG · 5/28 $286.31 · $103B · 2026 YTD -18.95%"],
    [98,-31.02,"ADBE","데이터 솔루션","Adobe · ADBE · 5/28 $241.44 · $98B · 2026 YTD -31.02%"],
    [86,112.20,"RKLB","우주","Rocket Lab · RKLB · 5/28 $148.03 · $86B · 2026 YTD +112.20%"],
    [83,9.04,"SNOW","데이터 솔루션","Snowflake · SNOW · 5/28 $239.20 · $83B · 2026 YTD +9.04%"],
    [52,83.24,"ASTS","우주","AST SpaceMobile · ASTS · 5/28 $133.09 · $52B · 2026 YTD +83.24%"],
    [26,56.32,"IONQ","양자","IonQ · IONQ · 5/28 $70.14 · $26B · 2026 YTD +56.32%"],
    [12.2,-14.12,"KTOS","드론","Kratos · KTOS · 5/28 $65.19 · $12.2B · 2026 YTD -14.12%"],
    [11.9,-5.11,"OKLO","데이터센터","Oklo · OKLO · 5/28 $68.09 · $11.9B · 2026 YTD -5.11%"],
    [10.9,12.77,"QBTS","양자","D-Wave · QBTS · 5/28 $29.49 · $10.9B · 2026 YTD +12.77%"],
    [10.9,-11.37,"AVAV","드론","AeroVironment · AVAV · 5/28 $214.39 · $10.9B · 2026 YTD -11.37%"],
    [9.0,22.03,"RGTI","양자","Rigetti · RGTI · 5/28 $27.03 · $9.0B · 2026 YTD +22.03%"],
    [5.4,194.94,"IRDM","우주","Iridium · IRDM · 5/28 $51.26 · $5.4B · 2026 YTD +194.94%"],
    [5.9,-5.79,"DBX","데이터 솔루션","Dropbox · DBX · 5/28 $26.19 · $5.9B · 2026 YTD -5.79%"]
  ];

  var stockKey = function (d) { return String(d[2]).replace("★", ""); };
  var representativeTickers = ["QBTS","RKLB","PLTR","SK하이닉스","삼성전자","한화에어로","KTOS","GOOGL","NVDA","TSLA","Zhipu","MiniMax"];
  var isRep = function (d) { return representativeTickers.indexOf(stockKey(d)) !== -1; };
  var posData2024 = data2024.filter(isRep);
  var posData2025 = data2025.filter(isRep);
  var posData2026 = data2026.filter(isRep);
  var byKey = function (arr) { var m = new Map(); arr.forEach(function (d) { m.set(stockKey(d), d); }); return m; };
  var data2025ByTicker = byKey(posData2025);
  var data2026ByTicker = byKey(posData2026);
  var data2026Existing = posData2026.filter(function (d) { return !(d[5] && d[5].ipoStart); });
  var data2026Ipo = posData2026.filter(function (d) { return d[5] && d[5].ipoStart; });

  var labelOverrides = {
    QBTS: { position: "right", offset: [6, 0] },
    RKLB: { position: "top", offset: [0, -8] },
    KTOS: { position: "bottom", offset: [0, 14] },
    GOOGL: { position: "top", offset: [0, -6] },
    TSLA: { position: "bottom", offset: [0, 14] },
    "삼성전자": { position: "right", offset: [6, -8] },
    "SK하이닉스": { position: "top", offset: [0, -6] }
  };
  var labelPosition = function (ticker, year) {
    var positions = {
      MSFT: { 2024: "left", 2025: "left", 2026: "left" },
      NVDA: { 2024: "left", 2025: "top", 2026: "top" },
      GOOGL: { 2024: "top", 2025: "top", 2026: "top" },
      TSLA: { 2024: "bottom", 2025: "bottom", 2026: "left" },
      "삼성전자": { 2024: "top", 2025: "top", 2026: "top" },
      PLTR: { 2026: "bottom" },
      "한화에어로": { 2026: "bottom" },
      "SK하이닉스": { 2026: "top" },
      QBTS: { 2024: "top", 2025: "top", 2026: "left" },
      RKLB: { 2024: "bottom", 2025: "right", 2026: "top" },
      KTOS: { 2024: "bottom", 2025: "right", 2026: "bottom" },
      "Zhipu★": { 2026: "right" },
      "MiniMax★": { 2026: "right" }
    };
    return (positions[ticker] && positions[ticker][year]) || (year === 2026 ? "right" : "top");
  };

  function posPoint(d, year) {
    var c = sectorColorFn(d[3]);
    var yearStyle = year === 2024 ? { opacity: 0.42, borderColor: "transparent", borderWidth: 0 }
                  : year === 2025 ? { opacity: 0.72, borderColor: "transparent", borderWidth: 0 }
                  :                  { opacity: 1.0, borderColor: C.pointBorder, borderWidth: 1.6 };
    return {
      name: d[2] || d[4] || "확인 필요",
      value: d,
      itemStyle: Object.assign({ color: c }, yearStyle),
      label: Object.assign({ position: labelPosition(d[2], year), distance: 6 }, labelOverrides[d[2]] || {}),
      _year: year
    };
  }

  var buildCycleLines = function (fromData, toMap, style) {
    return fromData.filter(function (d) { return toMap.has(stockKey(d)); }).map(function (d) {
      var next = toMap.get(stockKey(d));
      var c = sectorColorFn(d[3]);
      return {
        name: d[2], fromYear: style.fromYear, toYear: style.toYear, from: d[1], to: next[1],
        coords: [[d[0], d[1]], [next[0], next[1]]],
        lineStyle: { color: c, opacity: style.opacity, width: style.width, type: style.type }
      };
    });
  };
  var cycleLines2425 = buildCycleLines(posData2024, data2025ByTicker, { fromYear: 2024, toYear: 2025, opacity: 0.30, width: 1.0, type: "dashed" });
  var cycleLines2526 = buildCycleLines(posData2025, data2026ByTicker, { fromYear: 2025, toYear: 2026, opacity: 0.78, width: 1.8, type: "solid" });
  var ipoLines = data2026Ipo.map(function (d) {
    var c = sectorColorFn(d[3]);
    return { name: String(d[2]).replace("★", ""), fromYear: "IPO", toYear: 2026, from: 0, to: d[1], coords: [d[5].ipoStart, [d[0], d[1]]], lineStyle: { color: c, opacity: 0.8, width: 1.8, type: "solid" } };
  });
  var ipoStartPoints = data2026Ipo.map(function (d) {
    var c = sectorColorFn(d[3]); var clean = String(d[2]).replace("★", "");
    return { name: clean + " IPO", value: [d[5].ipoStart[0], d[5].ipoStart[1], clean + " IPO", d[3], d[4]], itemStyle: { color: c, opacity: 0.9, borderColor: C.pointBorder, borderWidth: 1 } };
  });
  var endpointLabelTickers = {};
  (mobile ? ["Zhipu★","MiniMax★","SK하이닉스","삼성전자","RKLB","GOOGL","TSLA"]
          : ["Zhipu★","MiniMax★","SK하이닉스","삼성전자","QBTS","RKLB","PLTR","KTOS","GOOGL","TSLA"]).forEach(function (t) { endpointLabelTickers[t] = 1; });

  var fmtR = function (r) { return (r > 0 ? "+" : "") + Math.round(r).toLocaleString() + "%"; };
  var fmtM = function (m) { return m >= 1000 ? "$" + (m / 1000).toFixed(2) + "T" : "$" + (m < 10 ? m.toFixed(1) : Math.round(m)) + "B"; };

  var chart = echarts.init(dom, null, { renderer: "canvas" });

  var option = {
    backgroundColor: "transparent",
    textStyle: { fontFamily: FONT, color: C.axis },
    tooltip: {
      confine: true, triggerOn: "click",
      backgroundColor: C.tipBg, borderColor: C.tipBorder, borderWidth: 1,
      textStyle: { color: C.tipText, fontFamily: FONT, fontSize: 12.5 },
      extraCssText: "box-shadow:0 8px 24px rgba(26,26,46,0.12);border-radius:10px;max-width:min(280px,calc(100vw - 28px));white-space:normal;line-height:1.55;",
      position: function (point, params, dom2, rect, size) {
        var gap = 12; var view = size.viewSize || [window.innerWidth, 320]; var box = size.contentSize || [240, 120];
        var left = point[0] > view[0] / 2 ? gap : Math.max(gap, view[0] - box[0] - gap);
        var topCandidate = point[1] > view[1] / 2 ? gap : point[1] + gap;
        var top = Math.max(gap, Math.min(view[1] - box[1] - gap, topCandidate));
        return [left, top];
      },
      formatter: function (p) {
        if (p.seriesType === "lines") { var d = p.data; if (!d) return ""; return "<b>" + d.name + "</b><br/>" + d.fromYear + ": " + fmtR(d.from) + " → " + d.toYear + ": " + fmtR(d.to); }
        var v = (p && p.data && p.data.value) || (p && p.value) || null;
        if (!v || !Array.isArray(v)) return "";
        var name = v[2] || (p.data && p.data.name) || "이름 확인 필요"; var sect = v[3] || "섹터 확인 필요"; var tip = v[4] || "";
        return "<b>" + name + "</b> · " + sect + "<br/>" + (tip ? tip + "<br/>" : "") + "시총: " + fmtM(v[0]) + "<br/>" + p.seriesName + ": " + fmtR(v[1]);
      }
    },
    legend: { show: false },
    grid: { left: mobile ? 30 : 56, right: mobile ? 32 : 92, top: mobile ? 48 : 50, bottom: mobile ? 42 : 56, containLabel: true },
    xAxis: {
      type: "log", name: mobile ? "" : "시총($B, 로그)", nameTextStyle: { color: C.axisName, fontSize: mobile ? 10 : 12 },
      min: 1, max: 5000, logBase: 10,
      axisLine: { lineStyle: { color: C.line } }, axisTick: { lineStyle: { color: C.line } },
      splitLine: { lineStyle: { color: C.line, type: "dashed" } },
      axisLabel: { color: C.axis, formatter: function (v) { return "$" + (v >= 1000 ? (v / 1000) + "T" : v + "B"); }, fontSize: mobile ? 9.5 : 11.5 }
    },
    yAxis: {
      type: "value", name: mobile ? "" : "수익률(%)", nameTextStyle: { color: C.axisName, fontSize: mobile ? 10 : 12 },
      min: -100, max: 1500,
      axisLine: { lineStyle: { color: C.line } }, axisTick: { lineStyle: { color: C.line } },
      splitLine: { lineStyle: { color: C.line, type: "dashed" } },
      axisLabel: { color: C.axis, formatter: "{value}%", fontSize: mobile ? 9.5 : 11.5 }
    },
    graphic: [{ type: "text", left: "center", top: mobile ? 10 : 20, style: { text: mobile ? "색=섹터 · 점=24/25 · ◆=26 · ■=신규" : "색=섹터 · 점=2024/2025 · ◆=2026 · ■=신규상장 · ✕=IPO", fill: C.note, font: (mobile ? "10px " : "12px ") + FONT } }],
    series: [
      { name: "2024→2025 이동", type: "lines", coordinateSystem: "cartesian2d", data: cycleLines2425, symbol: ["none", "arrow"], symbolSize: mobile ? 4 : 6, lineStyle: { curveness: 0.08 }, emphasis: { focus: "none", lineStyle: { opacity: 1, width: mobile ? 2.6 : 3.2 } }, tooltip: { show: true }, z: 1 },
      { name: "2025→2026 이동", type: "lines", coordinateSystem: "cartesian2d", data: cycleLines2526, symbol: ["none", "arrow"], symbolSize: mobile ? 5 : 7, lineStyle: { curveness: 0.08 }, emphasis: { focus: "none", lineStyle: { opacity: 1, width: mobile ? 3 : 3.6 } }, tooltip: { show: true }, z: 2 },
      { name: "IPO→2026 이동", type: "lines", coordinateSystem: "cartesian2d", data: ipoLines, symbol: ["none", "arrow"], symbolSize: mobile ? 5 : 7, lineStyle: { curveness: 0.08 }, emphasis: { focus: "none", lineStyle: { opacity: 1, width: mobile ? 3 : 3.6 } }, tooltip: { show: true }, z: 3 },
      { name: "신규상장 시작", type: "scatter", symbolSize: mobile ? 9 : 11, symbol: "path://M-5,-5L5,5M5,-5L-5,5", data: ipoStartPoints, label: { show: false }, tooltip: { formatter: function (p) { return "<b>" + p.data.value[2] + "</b><br/>공모가 기준 시작점: 0%"; } }, z: 4 },
      { name: "2024", type: "scatter", symbolSize: mobile ? 5 : 6, symbol: "circle", data: posData2024.map(function (d) { return posPoint(d, 2024); }), label: { show: false }, labelLayout: { hideOverlap: true }, emphasis: { focus: "none", scale: 2.0, label: { show: true, formatter: function (p) { return p.data.value[2] + " · " + p.data.value[3] + " · 2024 (" + (p.data.value[1] > 0 ? "+" : "") + p.data.value[1] + "%)"; }, position: "top", fontSize: 11, color: C.labelText, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.95)", padding: [4, 7], borderRadius: 4 } } },
      { name: "2025", type: "scatter", symbolSize: mobile ? 8 : 10, symbol: "circle", data: posData2025.map(function (d) { return posPoint(d, 2025); }), label: { show: false }, labelLayout: { hideOverlap: true }, emphasis: { focus: "none", scale: 1.7, label: { show: true, formatter: function (p) { return p.data.value[2] + " · " + p.data.value[3] + " · 2025 (" + (p.data.value[1] > 0 ? "+" : "") + p.data.value[1] + "%)"; }, position: "top", fontSize: 11, color: C.labelText, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.95)", padding: [4, 7], borderRadius: 4 } } },
      { name: "2026", type: "scatter", symbolSize: mobile ? 11 : 14, symbol: "diamond", data: data2026Existing.map(function (d) { return posPoint(d, 2026); }),
        label: { show: true, formatter: function (p) { var v = p.data.value; if (!endpointLabelTickers[v[2]]) return ""; return mobile ? v[2] : (v[2] + " · " + v[3]); }, color: C.labelText, fontSize: mobile ? 9.5 : 10.5, fontWeight: 700, textBorderColor: C.labelBorder, textBorderWidth: 3 },
        labelLayout: { hideOverlap: true, moveOverlap: "shiftY" },
        emphasis: { focus: "none", scale: 1.5, label: { show: true, fontSize: 12, fontWeight: 700, color: C.labelText, backgroundColor: "rgba(255,255,255,0.95)", padding: [4, 7], borderRadius: 4 } },
        markLine: { silent: true, symbol: "none", label: { show: false }, lineStyle: { color: C.zeroLine, type: "dashed" }, data: [{ yAxis: 0 }] } },
      { name: "신규상장 2026", type: "scatter", symbolSize: mobile ? 11 : 14, symbol: "rect", data: data2026Ipo.map(function (d) { var c = sectorColorFn(d[3]); return { value: d, itemStyle: { color: c, borderColor: C.pointBorder, borderWidth: 1.6 } }; }),
        label: { show: true, formatter: function (p) { var v = p.data.value; var clean = String(v[2]).replace("★", ""); return mobile ? clean : (clean + " · " + v[3].replace("신규상장 ", "")); }, position: "right", color: C.labelText, fontSize: mobile ? 9.5 : 10.5, fontWeight: 700, textBorderColor: C.labelBorder, textBorderWidth: 3 },
        emphasis: { focus: "none", scale: 1.5, label: { show: true, fontSize: 12, fontWeight: 700, color: C.labelText, backgroundColor: "rgba(255,255,255,0.95)", padding: [4, 7], borderRadius: 4 } }, z: 5 },
      // 호버 별자리 시리즈 (망고 하이라이트)
      { id: "hoverLine2425", name: "호버 2024→2025", type: "lines", coordinateSystem: "cartesian2d", data: [], silent: true, symbol: ["circle", "arrow"], symbolSize: mobile ? 6 : 8, effect: { show: true, period: 3, trailLength: 0.55, symbol: "circle", symbolSize: mobile ? 3.5 : 4.5, color: C.hiSoft }, lineStyle: { color: C.hiSoft, opacity: 1, width: mobile ? 2.2 : 2.6, type: "dashed", curveness: 0.08 }, animation: true, animationDuration: 450, animationDurationUpdate: 0, animationEasing: "cubicOut", z: 50, tooltip: { show: false } },
      { id: "hoverLine2526", name: "호버 2025→2026", type: "lines", coordinateSystem: "cartesian2d", data: [], silent: true, symbol: ["circle", "arrow"], symbolSize: mobile ? 6 : 8, effect: { show: true, period: 2.8, trailLength: 0.55, symbol: "circle", symbolSize: mobile ? 3.5 : 4.5, color: C.hi }, lineStyle: { color: C.hi, opacity: 0.98, width: mobile ? 2.4 : 2.8, type: "solid", curveness: 0.08 }, animation: true, animationDuration: 450, animationDurationUpdate: 0, animationEasing: "cubicOut", z: 51, tooltip: { show: false } },
      { id: "hoverLineIpo", name: "호버 IPO→2026", type: "lines", coordinateSystem: "cartesian2d", data: [], silent: true, symbol: ["circle", "arrow"], symbolSize: mobile ? 6 : 8, effect: { show: true, period: 2.8, trailLength: 0.55, symbol: "circle", symbolSize: mobile ? 3.5 : 4.5, color: C.hi }, lineStyle: { color: C.hi, opacity: 0.98, width: mobile ? 2.4 : 2.8, type: "solid", curveness: 0.08 }, animation: true, animationDuration: 450, animationDurationUpdate: 0, animationEasing: "cubicOut", z: 52, tooltip: { show: false } },
      { id: "hoverPoints", name: "호버 좌표", type: "effectScatter", data: [], silent: false, symbolSize: mobile ? 16 : 19, rippleEffect: { scale: 2.3, brushType: "stroke", period: 3, color: "rgba(255,140,26,0.5)" }, itemStyle: { color: "rgba(255,140,26,0.10)", borderColor: C.hi, borderWidth: 2.4 },
        label: { show: true, formatter: function (p) { return (p.data && p.data._label) || ""; }, position: "top", distance: 5, color: C.labelText, fontSize: mobile ? 9.5 : 10.5, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.92)", padding: [2, 5], borderRadius: 3 },
        labelLayout: { hideOverlap: true, moveOverlap: "shiftY" }, animation: true, animationDuration: 250, animationDurationUpdate: 0, animationEasing: "elasticOut", z: 53,
        tooltip: { show: true, formatter: function (p) { var v = p.data && p.data.value; if (!Array.isArray(v)) return ""; var ret = v[1]; var retStr = (ret > 0 ? "+" : "") + Math.round(ret).toLocaleString() + "%"; var mc = v[0] >= 1000 ? "$" + (v[0] / 1000).toFixed(2) + "T" : "$" + Math.round(v[0]) + "B"; return "<b>" + ((p.data && p.data._label) || v[2]) + "</b><br/>" + (v[3] || "") + "<br/>시총: " + mc + "<br/>수익률: " + retStr; } } }
    ]
  };
  chart.setOption(option);
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(function () { try { chart.resize(); } catch (e) {} });
  setTimeout(function () { try { chart.resize(); } catch (e) {} }, 300);
  window.addEventListener("resize", function () { try { chart.resize(); } catch (e) {} });

  /* --- 상세 패널 --- */
  var tickerProfiles = {
    "SK하이닉스": { sector: "반도체 / HBM", info: "5/29 ₩2,337,000 · 시총 1,662조 ÷1,501원 = $1.11T · 2026 YTD ≈ +232% USD. 2025 매출 97.15조 영익 47.21조." },
    "삼성전자": { sector: "반도체 / HBM", info: "5/29 ₩313,500 · 시총 1,987조 ÷1,501원 = $1.32T · 2026 YTD ≈ +96% USD. HBM4 슈퍼사이클." },
    "한화에어로": { sector: "방산", info: "5/29 ₩1,189,000 · 시총 61.31조 ÷1,501원 = $40.8B · 2026 YTD ≈ -10% 추정." },
    "PLTR": { sector: "데이터 솔루션", info: "5/28 $143.34 · 시총 $344B · 2026 YTD -19.36%. 11년 계약(2035)." },
    "QBTS": { sector: "양자", info: "D-Wave · 5/28 $29.49 · 시총 $10.9B · 2026 YTD +12.77%. CHIPS Act $100M LOI." },
    "RKLB": { sector: "우주", info: "Rocket Lab · 5/28 $148.03 · 시총 $86B · 2026 YTD +112.20%. Neutron 개발." },
    "KTOS": { sector: "드론", info: "Kratos · 5/28 $65.19 · 시총 $12.2B · 2026 YTD -14.12%. Valkyrie." },
    "GOOGL": { sector: "AI LLM", info: "Alphabet · 5/28 $390.13 · 시총 $4.70T · 2026 YTD +24.64%. Gemini." },
    "NVDA": { sector: "반도체", info: "NVIDIA · 5/28 $214.25 · 시총 $5.18T · 2026 YTD +14.88%. AI GPU 표준." },
    "TSLA": { sector: "로봇", info: "Tesla · 5/28 $442.10 · 시총 $1.39T · 2026 YTD -1.69%. Optimus 양산." },
    "Zhipu": { sector: "AI LLM (신규)", info: "智谱AI · 2513.HK · 5/29 HKD 1,758 · $97.9B · IPO 공모가 HKD 116 → +1,415%." },
    "MiniMax": { sector: "AI 엔터 (신규)", info: "0100.HK · 5/29 HKD 858 · $34.6B · IPO 공모가 HKD 165 → +420%." }
  };
  function fmtRetP(r) { if (r == null || isNaN(Number(r))) return "—"; var n = Math.round(Number(r)); return (n > 0 ? "+" : "") + n.toLocaleString() + "%"; }
  function fmtMcapP(m) { if (m == null || isNaN(Number(m))) return "—"; var n = Number(m); if (n >= 1000) return "$" + (n / 1000).toFixed(2) + "T"; if (n >= 100) return "$" + Math.round(n) + "B"; return "$" + n.toFixed(1) + "B"; }

  var pointSources = [];
  posData2024.forEach(function (d) { pointSources.push({ year: 2024, d: d }); });
  posData2025.forEach(function (d) { pointSources.push({ year: 2025, d: d }); });
  data2026Existing.forEach(function (d) { pointSources.push({ year: 2026, d: d }); });
  ipoStartPoints.forEach(function (p) { pointSources.push({ year: "IPO", d: p.value, isIpoStart: true }); });
  data2026Ipo.forEach(function (d) { pointSources.push({ year: 2026, d: d }); });

  function showDetail(ticker) {
    var panel = document.getElementById("cyclePosDetail"); if (!panel) return;
    var placeholder = panel.querySelector(".detail-placeholder");
    var content = panel.querySelector(".detail-content"); if (!content) return;
    var clean = String(ticker || "").replace("★", "").replace(" IPO", "");
    var profile = tickerProfiles[clean] || { sector: "—", info: "공개 자료 추적 중." };
    var brief = String(profile.info || "").split(/\.\s/)[0] + (profile.info.indexOf(".") >= 0 ? "." : "");
    var allYears = pointSources.filter(function (s) { return String(s.d[2] || "").replace("★", "").replace(" IPO", "") === clean; })
      .map(function (s) { return { year: s.isIpoStart ? "IPO" : s.year, mcap: s.d[0], ret: s.d[1], _order: s.isIpoStart ? 0 : (s.year === 2024 ? 1 : s.year === 2025 ? 2 : 3) }; })
      .sort(function (a, b) { return a._order - b._order; });
    var rows = allYears.length ? allYears.map(function (y) {
      var rn = Number(y.ret); var rc = rn > 1000 ? "pink" : rn > 300 ? "gold" : rn > 0 ? "up" : "down";
      return '<tr><td class="yr">' + y.year + '</td><td class="mc">' + fmtMcapP(y.mcap) + '</td><td class="rt ' + rc + '">' + fmtRetP(y.ret) + "</td></tr>";
    }).join("") : '<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">좌표 추적 중</td></tr>';
    content.querySelector(".detail-ticker").textContent = clean;
    content.querySelector(".detail-sector").textContent = profile.sector;
    content.querySelector(".detail-body").innerHTML = '<table class="detail-years"><thead><tr><th>연도</th><th>시총</th><th>수익률</th></tr></thead><tbody>' + rows + "</tbody></table><p>" + brief + "</p>";
    if (placeholder) placeholder.hidden = true;
    content.hidden = false;
  }
  function hideDetail() {
    var panel = document.getElementById("cyclePosDetail"); if (!panel) return;
    var placeholder = panel.querySelector(".detail-placeholder"); var content = panel.querySelector(".detail-content");
    if (content) content.hidden = true; if (placeholder) placeholder.hidden = false;
  }

  /* --- 호버 별자리 연동 --- */
  var cleanTicker = function (v) { return String(v || "").replace("★", "").replace(" IPO", ""); };
  var hoverTimers = [];
  function clearTimers() { hoverTimers.forEach(function (t) { window.clearTimeout(t); }); hoverTimers = []; }
  function queueStep(delay, series) { hoverTimers.push(window.setTimeout(function () { chart.setOption({ series: series }); }, delay)); }

  function dimBaseSeries(t) {
    var dimItem = function (point, isTarget) { if (isTarget) return point; var out = Object.assign({}, point); out.itemStyle = Object.assign({}, point.itemStyle || {}, { opacity: 0.08 }); out.label = Object.assign({}, point.label || {}, { show: false }); return out; };
    var dimLine = function (line) { if (cleanTicker(line.name) === t) return line; return Object.assign({}, line, { lineStyle: Object.assign({}, line.lineStyle || {}, { opacity: 0.05 }) }); };
    return { series: [
      { name: "2024→2025 이동", data: cycleLines2425.map(dimLine) },
      { name: "2025→2026 이동", data: cycleLines2526.map(dimLine) },
      { name: "IPO→2026 이동", data: ipoLines.map(dimLine) },
      { name: "신규상장 시작", data: ipoStartPoints.map(function (p) { return dimItem(p, cleanTicker(p.value[2]) === t); }) },
      { name: "2024", data: posData2024.map(function (d) { return dimItem(posPoint(d, 2024), cleanTicker(d[2]) === t); }) },
      { name: "2025", data: posData2025.map(function (d) { return dimItem(posPoint(d, 2025), cleanTicker(d[2]) === t); }) },
      { name: "2026", data: data2026Existing.map(function (d) { return dimItem(posPoint(d, 2026), cleanTicker(d[2]) === t); }) },
      { name: "신규상장 2026", data: data2026Ipo.map(function (d) { var c = sectorColorFn(d[3]); return dimItem({ value: d, itemStyle: { color: c, borderColor: C.pointBorder, borderWidth: 1.6 } }, cleanTicker(d[2]) === t); }) }
    ] };
  }
  function restoreBaseSeries() {
    return { series: [
      { name: "2024→2025 이동", data: cycleLines2425 },
      { name: "2025→2026 이동", data: cycleLines2526 },
      { name: "IPO→2026 이동", data: ipoLines },
      { name: "신규상장 시작", data: ipoStartPoints },
      { name: "2024", data: posData2024.map(function (d) { return posPoint(d, 2024); }) },
      { name: "2025", data: posData2025.map(function (d) { return posPoint(d, 2025); }) },
      { name: "2026", data: data2026Existing.map(function (d) { return posPoint(d, 2026); }) },
      { name: "신규상장 2026", data: data2026Ipo.map(function (d) { var c = sectorColorFn(d[3]); return { value: d, itemStyle: { color: c, borderColor: C.pointBorder, borderWidth: 1.6 } }; }) }
    ] };
  }
  function setHoverOverlay(ticker) {
    clearTimers();
    var t = cleanTicker(ticker);
    chart.setOption(dimBaseSeries(t));
    chart.setOption({ series: [{ id: "hoverLine2425", data: [] }, { id: "hoverLine2526", data: [] }, { id: "hoverLineIpo", data: [] }, { id: "hoverPoints", data: [] }] });
    var liftLine = function (line, style) { return Object.assign({}, line, { lineStyle: Object.assign({}, line.lineStyle || {}, style) }); };
    var lines2425 = cycleLines2425.filter(function (d) { return cleanTicker(d.name) === t; }).map(function (d) { return liftLine(d, { color: C.hiSoft, opacity: 1, width: mobile ? 2.2 : 2.6, type: "dashed" }); });
    var lines2526 = cycleLines2526.filter(function (d) { return cleanTicker(d.name) === t; }).map(function (d) { return liftLine(d, { color: C.hi, opacity: 1, width: mobile ? 2.4 : 2.8, type: "solid" }); });
    var linesIpo = ipoLines.filter(function (d) { return cleanTicker(d.name) === t; }).map(function (d) { return liftLine(d, { color: C.hi, opacity: 1, width: mobile ? 2.4 : 2.8, type: "solid" }); });
    var allPoints = pointSources.filter(function (s) { return cleanTicker(s.d[2]) === t; }).map(function (s) {
      var year = s.year; var isIpoStart = s.isIpoStart; var d = s.d;
      var order = isIpoStart ? 0 : (year === 2024 ? 1 : year === 2025 ? 2 : 3);
      var name = cleanTicker(d[2]) || "이름 확인 필요"; var label = name + " " + (isIpoStart ? "IPO" : year);
      return { name: label, value: d, _label: label, _order: order,
        label: { position: isIpoStart ? "bottom" : (year === 2024 ? "bottom" : year === 2025 ? "top" : "right"), distance: isIpoStart ? 7 : 6, offset: year === 2026 && !isIpoStart ? [4, 0] : [0, 0] },
        symbol: isIpoStart ? "path://M-5,-5L5,5M5,-5L-5,5" : (year === 2026 ? "diamond" : "circle"),
        symbolSize: isIpoStart ? (mobile ? 13 : 15) : (mobile ? 16 : 19),
        itemStyle: { color: "rgba(255,140,26,0.10)", borderColor: sectorColorFn(d[3]) || C.hi, borderWidth: 3 } };
    }).sort(function (a, b) { return a._order - b._order; });
    var upto = function (order) { return allPoints.filter(function (p) { return p._order <= order; }); };
    queueStep(75, [{ id: "hoverPoints", data: upto(1) }]);
    var nextDelay = 225;
    if (linesIpo.length) { queueStep(nextDelay, [{ id: "hoverLineIpo", data: linesIpo }]); nextDelay += 175; }
    if (lines2425.length) { queueStep(nextDelay, [{ id: "hoverLine2425", data: lines2425 }]); nextDelay += 175; }
    if (allPoints.some(function (p) { return p._order === 2; })) { queueStep(nextDelay, [{ id: "hoverPoints", data: upto(2) }]); nextDelay += 175; }
    if (lines2526.length) { queueStep(nextDelay, [{ id: "hoverLine2526", data: lines2526 }]); nextDelay += 175; }
    if (allPoints.some(function (p) { return p._order === 3; })) { queueStep(nextDelay, [{ id: "hoverPoints", data: allPoints }]); }
  }
  function clearHoverOverlay() {
    clearTimers();
    chart.setOption({ series: [{ id: "hoverLine2425", data: [] }, { id: "hoverLine2526", data: [] }, { id: "hoverLineIpo", data: [] }, { id: "hoverPoints", data: [] }] });
    chart.setOption(restoreBaseSeries());
  }
  var lastTicker = null;
  function tickerFromParams(params) { if (!params || !params.data) return ""; var lineTicker = params.seriesType === "lines" ? params.data.name : ""; var v = params.data.value || params.data; return lineTicker || (Array.isArray(v) ? v[2] : ""); }
  function activate(ticker, params) {
    if (!ticker || ticker === lastTicker) return; lastTicker = ticker; setHoverOverlay(ticker);
    try {
      var v = params && params.data && params.data.value;
      if (Array.isArray(v)) { showDetail(v[2] || ticker); }
      else if (params && params.seriesType === "lines" && params.data) { showDetail(ticker); }
    } catch (e) {}
  }
  chart.on("mouseover", function (params) { activate(tickerFromParams(params), params); });
  chart.on("click", function (params) { activate(tickerFromParams(params), params); });
  chart.on("globalout", function () { if (!lastTicker) return; clearHoverOverlay(); hideDetail(); lastTicker = null; });

  // QA 훅 — 실제 마우스 이벤트 없이 별자리/패널 동작 검증용
  window.__qaCycleHover = function (ticker) { lastTicker = ticker; setHoverOverlay(ticker); showDetail(ticker); };
  window.__qaCycleClear = function () { clearHoverOverlay(); hideDetail(); lastTicker = null; };
})();
