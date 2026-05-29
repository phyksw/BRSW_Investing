# Investing Memo v4 — 라이트 인포그래픽 대시보드

> v3(상세 분석 풀버전)의 **간략·시각 요약** 버전. Mangoboard 톤(라이트 모드 + 망고 컬러).

## 컨셉

- **한 화면 요약** — 복잡한 내용 → 헤드라인 + 큰 숫자 + 1줄 메시지
- **시각 우선** — 카드·인포그래픽·색상 그라데이션 위주
- **재미있게** — 짧고 간단, 한 번에 이해
- **자세히는 v3로** — 모든 페이지에 v3 상세 링크 (https://kswterminal.netlify.app/)

## 디자인 참조

- [Mangoboard.net](https://www.mangoboard.net/) — 망고 오렌지 시그니처, 라이트 톤, 카드 그리드, Pretendard 폰트

## 디렉터리

```
v4/
├── index.html               # 대시보드 (헤로 + 큰 그림 + 8개 KPI + 11개 섹터 카드 + 11원칙 + CTA)
├── sectors/                 # 11개 섹터 간략 페이지
│   ├── semiconductors.html
│   ├── datacenter.html
│   ├── ai-llm.html
│   ├── ai-entertainment.html
│   ├── ai-solutions.html
│   ├── space.html
│   ├── quantum.html
│   ├── ai-robot-future.html
│   ├── batteries.html
│   ├── defense.html
│   └── drones.html
├── assets/
│   ├── css/main.css         # Mangoboard 톤 라이트 모드
│   └── js/main.js           # 진입 애니메이션 + 활성 네비
├── tools/
│   └── generate-sectors.mjs # 섹터 페이지 일괄 생성기
├── netlify.toml
├── package.json
└── README.md
```

## 색상 토큰

| 토큰 | 색 | 용도 |
|---|---|---|
| `--mango` | `#ff8c1a` | 시그니처 망고 오렌지 |
| `--sun` | `#ffd23f` | 햇살 노랑 (하이라이트 백그라운드) |
| `--berry` | `#e84a8e` | 살구 핑크 |
| `--mint` | `#20bfa9` | 민트 그린 |
| `--sky` | `#4a90e2` | 파랑 |
| `--grape` | `#8b5cf6` | 보라 |
| `--leaf` | `#6bbf59` | 잎 그린 |
| `--bg` | `#fffaf2` | 따뜻한 오프화이트 배경 |

## 폰트

- **본문**: Pretendard Variable
- **디스플레이/큰 숫자**: Pretendard Variable 800~900 (`--font-display`)
- **숫자(모노)**: Pretendard Variable (mono 대신 sans-serif 일관성)

## 카드 패턴

| 클래스 | 용도 |
|---|---|
| `.stat-card` | KPI 숫자 카드 (흰 배경) |
| `.stat-card.accent-mango` | 망고 그라데이션 강조 카드 (흰 텍스트) |
| `.stat-card.accent-mint/grape/sky` | 민트/보라/파랑 그라데이션 |
| `.sector-card` | 섹터 메뉴 카드 (호버 시 망고 보더 + 부유) |
| `.headline` | 망고→베리 그라데이션 풀 카드 (전체 영역 강조) |
| `.stripe` | 살구빛 배경 강조 영역 (큰 숫자 + 설명) |
| `.bignum` | 그라데이션 마스크 큰 숫자 (3~5.6rem) |

## v3 링크 패턴

각 v4 섹터 페이지의 "전체 분석 →" 버튼은 v3 사이트의 동일 슬러그 페이지로 이동:

```
v4/sectors/semiconductors.html
  → https://kswterminal.netlify.app/sectors/semiconductors.html
```

## 로컬 미리보기

```bash
npm run preview
# → http://localhost:8081
```

## 배포

Netlify에 별도 사이트로 배포 (v3와 분리).

## 저작권

© 2026 상보그룹 (BRSW) · CC BY-NC 4.0 · 상업적 활용 금지.
문의: [@phyksw](https://www.instagram.com/phyksw/)
