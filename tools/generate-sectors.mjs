// Sector page generator for v4 — Mangoboard tone
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SECTORS_DIR = join(__dirname, "..", "sectors");

const sectors = [
  {
    slug: "datacenter",
    name: "데이터센터",
    emoji: "⚡",
    tag: "AI 인프라 · 슈퍼사이클",
    heroHL: ["빅테크가 $725B를 ", "DC", "에 쏟아붓는 중"],
    heroSub: "2026 빅테크 CapEx 합산 $725B (+77% YoY). 한국 변압기 3사 수주잔고 33조 = 5~6년치. 전력·SMR·변압기·냉각 4종 세트가 모두 강세.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"AI는 결국 전력싸움. 변압기·원전·DC 인프라가 받쳐줘야 모델이 돌아간다\"",
    quoteSub: "5/28 보도: SpaceX × Anthropic 월 $1.2B 컴퓨트 계약. SpaceX가 데이터센터 인수 후 신규 컴퓨트 공급자로 진입. Anthropic 공급자가 4곳(Google·AWS·Broadcom·SpaceX)으로 확대.",
    stocks: [
      { label: "HD현대일렉 · 267260", value: "$24.5", unit: "B", note: "36.73조 ÷ 1,501원 · YTD ≈ +35% · 변압기", color: "accent-mango" },
      { label: "Vertiv · VRT", value: "$121", unit: "B", note: "5/28 $314.18 · YTD +93.93% · Q1 매출 +137% YoY", color: "accent-mint" },
      { label: "Constellation · CEG", value: "$103", unit: "B", note: "5/28 $286.31 · YTD -18.95% · 원전 PPA", color: "accent-sky" },
      { label: "두산에너빌 · 034020", value: "$44.0", unit: "B", note: "66.11조 ÷ 1,501원 · SMR + 변압기", color: "accent-grape" }
    ],
    bigNum: "$725B",
    bigNumColor: "down",
    bigNumLabel: "2026 빅테크 CapEx",
    bigNumTitle: "전년 +77%",
    bigNumDesc: "MSFT·GOOGL·META·AMZN 합산. 2027 $1T+ 전망. 변압기 3사 = 한국 직접 수혜.",
    v3Title: "변압기 3사·SMR PPA·곡괭이 vs 금광 차트 전부",
    v3Sub: "HD현대일렉·LS ELECTRIC·효성중공업 비교, 변압기 글로벌 시장 점유율, Vertiv·Eaton·Oklo 성과, SpaceX × Anthropic 콜아웃 상세."
  },
  {
    slug: "ai-llm",
    name: "AI LLM",
    emoji: "🤖",
    tag: "AI · 컨슈머 vs 엔터프라이즈",
    heroHL: ["1위가 누구냐? ", "둘 다", " 1위에요"],
    heroSub: "ChatGPT는 컨슈머 9억 WAU로 1위 · Anthropic은 엔터프라이즈 매출 $30B+ run-rate로 1위. 두 시장이 완전히 분리됐어요.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"컨슈머는 ChatGPT, 엔터프라이즈는 Claude\"",
    quoteSub: "First Page Sage 2026.5: 웹 점유율 ChatGPT 60.6% · Gemini 15.1% · Claude 5.0%. 그러나 매출 점유는 Anthropic 54.5% vs OpenAI 45.5% (공개 확인분만).",
    stocks: [
      { label: "Anthropic (비상장)", value: "$380", unit: "B", note: "2026.2 Series G · run-rate $30B+ · Q2 $40B+ 전망", color: "accent-grape" },
      { label: "Alphabet · GOOGL", value: "$4.70", unit: "T", note: "5/28 $390.13 · YTD +24.64% · Gemini", color: "accent-mango" },
      { label: "Meta · META", value: "$1.61", unit: "T", note: "5/28 $635.29 · YTD -3.76% · Llama", color: "accent-sky" },
      { label: "Zhipu · 2513.HK", value: "$97.9", unit: "B", note: "HKD 1,758 · IPO +1,415% · 중국 AI 6대 호랑이", color: "accent-mint" }
    ],
    bigNum: "+1,415%",
    bigNumColor: "up",
    bigNumLabel: "Zhipu 2513.HK IPO 후",
    bigNumTitle: "공모가 HKD 116 → 1,758",
    bigNumDesc: "2026.1.8 홍콩 상장. 4개월 만에 14배. AI 6대 호랑이(智谱·阶跃·百川·Moonshot·MiniMax·零一万物) 중 첫 상장.",
    v3Title: "ARPU 정밀 비교 · 3-tier 점유율 · Claude Code 램프업",
    v3Sub: "OpenAI vs Anthropic vs xAI 가격 비교 표, 유료/매출/전체 사용자 도넛 3종, ChatGPT 9억 WAU 검증, Anthropic Series G $380B 분석."
  },
  {
    slug: "ai-entertainment",
    name: "AI 엔터테인먼트",
    emoji: "🎭",
    tag: "AI · 월드모델 + 캐릭터 챗",
    heroHL: ["MAU ", "2,760만", " 1년 매출 2배+"],
    heroSub: "MiniMax Talkie · 한국 스캐터랩 제타 · Character.AI 사이의 진검승부. 비상장 한국 비밀병기는 흑자 전환했어요.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"한국 스캐터랩 제타가 3분기 연속 흑자\"",
    quoteSub: "Q2 매출 52억원 · OPM 17%. 사용자당 매출(ARPPU)이 글로벌 평균보다 높음. MiniMax는 1년간 매출 2배, 100만 클라이언트 돌파(보도).",
    stocks: [
      { label: "MiniMax · 0100.HK", value: "$34.6", unit: "B", note: "HKD 858 · IPO 공모가 165 → +420%", color: "accent-mango" },
      { label: "Meta · META", value: "$1.61", unit: "T", note: "AI 캐릭터 + Llama 기반 컴패니언", color: "accent-sky" },
      { label: "스캐터랩 (비상장)", value: "52", unit: "억/Q2", note: "제타 · 3분기 연속 흑자 · OPM 17%", color: "accent-mint" },
      { label: "뤼튼 (비상장)", value: "1,080", unit: "억", note: "2025.3 시리즈 B · 누적 1,300억", color: "accent-grape" }
    ],
    bigNum: "+420%",
    bigNumColor: "up",
    bigNumLabel: "MiniMax 0100.HK IPO 후",
    bigNumTitle: "공모가 HKD 165 → 858",
    bigNumDesc: "2026.1.9 홍콩 상장. 매출 1년에 2배. Talkie 글로벌 MAU 2,760만 (2025.9).",
    v3Title: "MAU vs ARPU 산점도 · Genie 3 · 한국 비상장 비교",
    v3Sub: "Character.AI vs MiniMax vs 스캐터랩 vs 뤼튼 6개 회사 동시 비교 표, Genie 3 일반공개 영향, MiniMax 성장 곡선."
  },
  {
    slug: "ai-solutions",
    name: "AI 솔루션",
    emoji: "🛠️",
    tag: "AI · B2B 적용층",
    heroHL: ["PLTR는 ", "11년 계약", "(2035)"],
    heroSub: "2024 +340% (S&P 1위), 2025 +135%, 2026 YTD -19% 조정 중. CRM·NOW·ADBE는 Sora·Agentforce 압박으로 -30%대 조정.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"AI 솔루션은 명확한 二極化\"",
    quoteSub: "정부·국방 온톨로지(PLTR)는 11년 계약. 클래식 SaaS(CRM·NOW·ADBE)는 GPT 직접 경쟁으로 -30~-48% 조정 중.",
    stocks: [
      { label: "Palantir · PLTR", value: "$344", unit: "B", note: "5/28 $143.34 · YTD -19.36% · 11년 계약(2035)", color: "accent-mango" },
      { label: "IBM", value: "$248", unit: "B", note: "5/28 $264.22 · YTD -10.80% · watsonx", color: "accent-sky" },
      { label: "Salesforce · CRM", value: "$144", unit: "B", note: "5/28 $176.17 · YTD -33.50% · Agentforce", color: "accent-grape" },
      { label: "ServiceNow · NOW", value: "$112", unit: "B", note: "5/28 $108.73 · YTD -29.02% · 고점 $211", color: "accent-mint" }
    ],
    bigNum: "-29%",
    bigNumColor: "down",
    bigNumLabel: "ServiceNow 2026 YTD",
    bigNumTitle: "고점 $211 → $108",
    bigNumDesc: "Salesforce -34% · Adobe -31% · NOW -29%. GPT가 직접 침투하는 영역의 대표 종목들이 모두 큰 조정.",
    v3Title: "11개 종목 비교 표 · PLTR 매출 추이 · Sora 충격",
    v3Sub: "PLTR·MSFT·CRM·SNOW·DBX·NOW·VEEV·IBM 11개 종목 11원칙 점검 표, AI 솔루션 가격 경쟁 매트릭스, ADBE 12개월 -40% 분석."
  },
  {
    slug: "space",
    name: "우주",
    emoji: "🚀",
    tag: "프런티어 · 스타링크 + 우주 DC",
    heroHL: ["SpaceX 6월 IPO ", "$1.75~2T", " 평가"],
    heroSub: "스타링크 캐시카우 (2025 매출 $11.4B, 가입자 890만)로 수익화 입증. 2025.12 텐더 $800B → 2026.5 S-1 공시. RKLB 1년 +415%.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"발사·통신 다음은 지상 컴퓨트\"",
    quoteSub: "SpaceX × Anthropic 월 $1.2B 컴퓨트 계약(5.28 보도). SpaceX가 데이터센터 인수 후 신규 공급자로 진입. Google Suncatcher · Starcloud로 우주 데이터센터 시대 개막.",
    stocks: [
      { label: "SpaceX (S-1 공시)", value: "$1.75~2", unit: "T", note: "5/20 SEC EDGAR · 6월 NASDAQ 예정", color: "accent-mango" },
      { label: "Rocket Lab · RKLB", value: "$86", unit: "B", note: "5/28 $148.03 · 2026 YTD +112% · Neutron", color: "accent-mint" },
      { label: "AST SpaceMobile · ASTS", value: "$52", unit: "B", note: "5/28 $133.09 · YTD +83% · D2D 위성", color: "accent-grape" },
      { label: "Iridium · IRDM", value: "$5.4", unit: "B", note: "5/28 $51.26 · YTD +195% · 위성통신", color: "accent-sky" }
    ],
    bigNum: "8승/12",
    bigNumColor: "up",
    bigNumLabel: "Starship IFT 누적",
    bigNumTitle: "Flight 12 V3 첫 성공 (2026.1)",
    bigNumDesc: "V2 라인 안정화(3패 후 1성공) → V3 Block 3 본격 가동. 100톤급 페이로드 진입 예상.",
    v3Title: "스타링크 매출 폭증 · Starship 발사 기록 12회 · 우주 DC",
    v3Sub: "스타링크 가입자/매출/ARPU 추이, Flight 4~12 발사 기록 표, Google Project Suncatcher · Starcloud-1 우주 DC 콜아웃."
  },
  {
    slug: "quantum",
    name: "양자컴퓨팅",
    emoji: "⚛️",
    tag: "프런티어 · 전략자산 지정",
    heroHL: ["NVQLink로 ", "NVIDIA가", " 게이트키퍼"],
    heroSub: "젠슨황 2025.1 \"양자 20년\" 발언 → 2025.3 Mea Culpa → 2025.10 NVQLink 정식 공개 → 2026.3 CUDA-Q 정식. 14개월의 점진적 행보.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"양자 자체는 늦더라도 NVIDIA가 표준 선점\"",
    quoteSub: "NVQLink: GPU↔QPU 직결 표준. 17개 QPU 벤더, 9개 미 국립연구소가 채택. 양자 상용화 시점은 늦어도 인프라 표준은 이미 형성 중.",
    stocks: [
      { label: "IonQ · IONQ", value: "$26", unit: "B", note: "5/28 $70.14 · 2026 YTD +56% · 트랩이온", color: "accent-grape" },
      { label: "D-Wave · QBTS", value: "$10.9", unit: "B", note: "5/28 $29.49 · YTD +12.77% · CHIPS Act LOI $100M", color: "accent-sky" },
      { label: "Rigetti · RGTI", value: "$9.0", unit: "B", note: "5/28 $27.03 · YTD +22% · 양자 게이트", color: "accent-mint" },
      { label: "IBM", value: "$248", unit: "B", note: "watsonx + 양자 100큐비트 로드맵", color: "accent-mango" }
    ],
    bigNum: "+755%",
    bigNumColor: "up",
    bigNumLabel: "IonQ Q1 2026 매출 YoY",
    bigNumTitle: "$64.67M (사상 최고)",
    bigNumDesc: "2025 매출 $100M+ (사상 첫 9자리 돌파). D-Wave 2025 매출 +178% · GAAP 마진 83%.",
    v3Title: "NVIDIA 양자 행보 14개월 타임라인 · 매출 추이",
    v3Sub: "IonQ·QBTS·RGTI·IBM 매출/시총 산점도, 젠슨황 발언 → NVQLink → CUDA-Q 풀 타임라인."
  },
  {
    slug: "ai-robot-future",
    name: "AI · 로봇 · 미래사회",
    emoji: "🦾",
    tag: "프런티어 · 휴머노이드",
    heroHL: ["BMW에서 ", "Figure 02가", " 일하는 중"],
    heroSub: "Tesla Optimus 2026.7~8 양산 계획. Figure 02 X3 Spartanburg에서 3만대 생산 기여. 레인보우로보(KRX) 삼성 자회사.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"휴머노이드 시장 $2.1B → $38B (CAGR 38%)\"",
    quoteSub: "2025 → 2035 10년 18배. AI 컴패니언도 거시 직관 정확 — McKinsey 2025.11: 미국 노동시간 57% 자동화 가능, IMF: 글로벌 일자리 40% AI 노출.",
    stocks: [
      { label: "Tesla · TSLA", value: "$1.39", unit: "T", note: "5/28 $442.10 · YTD -1.69% · Optimus 7~8월 양산", color: "accent-mango" },
      { label: "레인보우로보 · 277810", value: "$9.0", unit: "B", note: "5/29 ₩702,000 · 13.5조 ÷ 1,501 · 삼성 자회사", color: "accent-sky" },
      { label: "Figure AI (비상장)", value: "$2.6", unit: "B", note: "2024.2 평가 · BMW Spartanburg 기여", color: "accent-mint" },
      { label: "휴머노이드 2025→2035", value: "$2→38", unit: "B", note: "10년 CAGR 33~38% · 시장 18배", color: "accent-grape" }
    ],
    bigNum: "3만 대",
    bigNumColor: "up",
    bigNumLabel: "Figure 02 기여 (2025)",
    bigNumTitle: "BMW X3 Spartanburg",
    bigNumDesc: "Figure 03은 BMW 40대 배치 (2025년 보도). 사용자 메모의 '40대'와 다름 — Figure 02 실제 양산 기여는 3만대.",
    v3Title: "휴머노이드 글로벌 6개 회사 비교 · Optimus 양산 일정",
    v3Sub: "Tesla·Figure·1X·Apptronik·Boston Dynamics·UniTree·레인보우로보 동시 비교, 11원칙 레이더 5축, AI 컴패니언 시장 규모 추이."
  },
  {
    slug: "batteries",
    name: "이차전지",
    emoji: "🔋",
    tag: "에너지 · 호황 후 케즘",
    heroHL: ["호황 후 ", "케즘", " 진행 중"],
    heroSub: "LG엔솔 매출 33.7→23.7조 2년 연속 -24%. 에코프로비엠 2024 -60%. 다만 ESS·전고체 모멘텀으로 회복 시도 진입.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"2022 호황 → 2023 리튬 폭락 → 2024~25 매출 하락\"",
    quoteSub: "사용자 메모의 '전쟁 → 원자재 → 매출' 인과는 2022 한 해에만 강하게 들어맞음. 2023부터는 오히려 리튬 폭락으로 양극재·셀 메이커가 어려웠음.",
    stocks: [
      { label: "LG엔솔 · 373220", value: "$70.2", unit: "B", note: "105.30조 ÷ 1,501원", color: "accent-mango" },
      { label: "삼성SDI · 006400", value: "$36.7", unit: "B", note: "55.07조 ÷ 1,501원 · 1년 +307%", color: "accent-grape" },
      { label: "에코프로비엠 · 247540", value: "$14.3", unit: "B", note: "약 21.5조 ÷ 1,501원", color: "accent-mint" },
      { label: "3사 합산 시총", value: "$121", unit: "B", note: "5/29 실측 · 2024 저점 대비 회복 진행 중", color: "accent-sky" }
    ],
    bigNum: "-60%",
    bigNumColor: "down",
    bigNumLabel: "에코프로비엠 2024 매출",
    bigNumTitle: "6.90조 → 2.77조",
    bigNumDesc: "리튬 폭락 + EV 수요 둔화. ESS·전고체로 회복 시그널 진입 중이지만 본격 매출 회복은 2026~27 전망.",
    v3Title: "셀 3사 매출 추이 · 회복률 라인 · ESS 모멘텀",
    v3Sub: "LG엔솔·삼성SDI·SK이노 분기 매출, 양극재 회사들 매출 vs 리튬 가격 추이, 전고체·ESS 진척도."
  },
  {
    slug: "defense",
    name: "방산",
    emoji: "🛡️",
    tag: "지정학 · K-방산 슈퍼사이클",
    heroHL: ["폴란드 K2 ", "9조원", " 2차 계약"],
    heroSub: "한화에어로 5년 30~40배 · 신고가 165.5만(3.4) · 사우디·필리핀 확장. 한국 방산이 미국 빅3 격차를 50배→3배로 좁혔어요.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"K-방산은 우러전쟁 이전·이후가 다른 그림\"",
    quoteSub: "2022~2025 누적 수출 약 600억 달러. 세계 무기 수출 점유율 2.2%→6.5% 3배 점프 (SIPRI 2024). 한국 방산 빅4 합산 시총 = 록히드마틴 단독의 1/3 수준까지.",
    stocks: [
      { label: "한화에어로 · 012450", value: "$40.8", unit: "B", note: "₩1,189,000 · 신고가 165.5만 후 -28%", color: "accent-mango" },
      { label: "현대로템 · 064350", value: "$14.5", unit: "B", note: "₩198,900 · K2 폴란드 1·2차", color: "accent-sky" },
      { label: "LIG넥스원 · 079550", value: "$11.9", unit: "B", note: "₩812,000 · 천궁·해성", color: "accent-mint" },
      { label: "KAI · 047810", value: "$11.0", unit: "B", note: "₩170,200 · FA-50·KF-21", color: "accent-grape" }
    ],
    bigNum: "+260%",
    bigNumColor: "up",
    bigNumLabel: "한화에어로 2025 (KRW)",
    bigNumTitle: "방산 3사 평균 +207%",
    bigNumDesc: "한화에어로 5년 30~40배. 신고가 165.5만원(2026.3.4). 폴란드 K2 2차 9조원 + 사우디 추가 확장.",
    v3Title: "한국 vs 미국 방산 시총 격차 · K-방산 분기 매출",
    v3Sub: "한화에어로 유상증자 3.6조 분석, 폴란드 K2 1차 vs 2차, 한국 방산 5개 종목 11원칙 점검 표."
  },
  {
    slug: "drones",
    name: "드론",
    emoji: "🛸",
    tag: "지정학 · FPV 패러다임",
    heroHL: ["$400 드론이 ", "$800만 전차", "를 잡는다"],
    heroSub: "FPV 드론이 T-90·M1 Abrams 격파 다수. 우크라이나 2025 단독 450만 대 조달. 미국방부 Replicator 본격화로 AVAV·KTOS 수주 폭증.",
    quoteEyebrow: "한 줄 정리",
    quoteTitle: "\"수량의 시대 — 월 10만+ 생산이 일상\"",
    quoteSub: "$400 드론이 $300만 T-90, $800만 M1 Abrams 격파 다수. 러시아 FPV가 차량 손실의 최대 90% 차지 (ORF Online). 광섬유 유선 드론으로 재밍 회피도 시작.",
    stocks: [
      { label: "AeroVironment · AVAV", value: "$10.9", unit: "B", note: "5/28 $214.39 · YTD -11.37% · BlueHalo", color: "accent-mango" },
      { label: "Kratos · KTOS", value: "$12.2", unit: "B", note: "5/28 $65.19 · YTD -14.12% · Valkyrie", color: "accent-mint" },
      { label: "LIG넥스원 · 079550", value: "$11.9", unit: "B", note: "MUCP(중형무인기) 2025.3 상세설계 통과", color: "accent-sky" },
      { label: "FPV vs T-90", value: "$400→$300만", unit: "", note: "7,500배 가격 격차로 격파", color: "accent-grape" }
    ],
    bigNum: "450만 대",
    bigNumColor: "up",
    bigNumLabel: "우크라이나 FPV 2025",
    bigNumTitle: "단독 연 조달량",
    bigNumDesc: "대당 ~$400. 월 10만대 합산 생산 · Russian FPV가 차량 손실의 최대 90% 차지. 광섬유 유선 드론도 시작.",
    v3Title: "AVAV·KTOS 매출 추이 · 우크라 FPV 진화 타임라인",
    v3Sub: "AVAV 우크라 매출 비중 38%→6% 다각화, KTOS Q4 미스 -60% 분석, 한국 드론(LIG MUCP·한화 천광) 차세대 모멘텀."
  }
];

const navTemplate = (currentSlug) => `
  <nav class="nav">
    <div class="container nav-inner">
      <a class="nav-brand" href="../index.html"><span class="nav-brand-dot"></span> Investing Memo <span style="color:var(--mango);font-size:11px;font-weight:600;letter-spacing:0.1em;">v4 LITE</span></a>
      <div class="nav-links">
        <a href="../index.html">홈</a>
        <a href="./semiconductors.html"${currentSlug === "semiconductors" ? ' class="active"' : ""}>반도체</a>
        <a href="./datacenter.html"${currentSlug === "datacenter" ? ' class="active"' : ""}>DC</a>
        <a href="./ai-llm.html"${currentSlug === "ai-llm" ? ' class="active"' : ""}>AI</a>
        <a href="./space.html"${currentSlug === "space" ? ' class="active"' : ""}>우주</a>
        <a href="./defense.html"${currentSlug === "defense" ? ' class="active"' : ""}>방산</a>
        <a href="/v3/sectors/${currentSlug}.html" target="_blank" rel="noopener" style="color:var(--mango-deep);font-weight:700">v3 상세 ↗</a>
      </div>
    </div>
  </nav>`;

const footerTemplate = `
  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        © 2026 · 상보그룹 <b style="color:#fff">BRSW</b> (Kim Sangwoo · Won Bora) · <b style="color:#fff">상업적 활용 금지</b> (CC BY-NC 4.0) · 문의 <a href="https://www.instagram.com/phyksw/" target="_blank" rel="noopener">@phyksw</a>
      </div>
    </div>
  </footer>`;

const pageTemplate = (s) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${s.name} — Investing Memo v4</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable.min.css">
  <link rel="stylesheet" href="../assets/css/main.css?v=4.1">
</head>
<body>
${navTemplate(s.slug)}

  <section class="hero" style="background:linear-gradient(180deg,#fff5e6 0%,#fffaf2 100%)">
    <div class="container-narrow">
      <span class="hero-eyebrow">${s.emoji} ${s.tag}</span>
      <h1 class="hero-title">${s.heroHL[0]}<span class="highlight">${s.heroHL[1]}</span><span class="accent">${s.heroHL[2]}</span></h1>
      <p class="hero-sub">${s.heroSub}</p>
    </div>
  </section>

  <section style="padding-top:24px">
    <div class="container">
      <div class="headline">
        <div class="headline-eyebrow">🍊 ${s.quoteEyebrow}</div>
        <h3 class="headline-title">${s.quoteTitle}</h3>
        <p class="headline-sub">${s.quoteSub}</p>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head">
        <div class="section-eyebrow">핵심 종목 4</div>
        <h2 class="section-title">한눈에 보는 ${s.name}</h2>
      </div>
      <div class="grid grid-4">
${s.stocks.map(st => `        <div class="stat-card ${st.color}">
          <div class="stat-label">${st.label}</div>
          <div class="stat-value">${st.value}<span class="unit">${st.unit}</span></div>
          <div class="stat-note">${st.note}</div>
        </div>`).join("\n")}
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="stripe" style="background:linear-gradient(135deg,#fff5e6 0%,#fef0db 100%)">
        <div style="display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center">
          <div class="bignum ${s.bigNumColor}" style="font-size:5rem">${s.bigNum}</div>
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--mango-deep);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px">${s.bigNumLabel}</div>
            <h3 style="font-family:var(--font-display);font-size:1.8rem;font-weight:800;line-height:1.25;margin:0 0 8px;color:var(--text-strong)">${s.bigNumTitle}</h3>
            <p style="margin:0;color:var(--text-soft)">${s.bigNumDesc}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section style="padding-bottom:80px">
    <div class="container-narrow" style="text-align:center">
      <div class="section-head">
        <div class="section-eyebrow">v3에서 더 깊게</div>
        <h2 class="section-title">${s.v3Title}</h2>
        <p class="section-sub" style="margin-left:auto;margin-right:auto">${s.v3Sub}</p>
      </div>
      <div class="hero-cta">
        <a class="btn btn-primary" href="/v3/sectors/${s.slug}.html" target="_blank" rel="noopener">${s.name} 전체 분석 →</a>
        <a class="btn btn-ghost" href="../index.html">다른 섹터</a>
      </div>
    </div>
  </section>
${footerTemplate}

  <script src="../assets/js/main.js?v=4.1"></script>
</body>
</html>
`;

for (const s of sectors) {
  const p = join(SECTORS_DIR, `${s.slug}.html`);
  writeFileSync(p, pageTemplate(s), "utf8");
  console.log("Generated", p);
}

console.log(`\nTotal: ${sectors.length} sector pages generated.`);
