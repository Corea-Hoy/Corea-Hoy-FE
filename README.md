# Corea Hoy

한국의 뉴스와 문화를 스페인어로 전달하는 미디어 플랫폼입니다.  
K-POP, 드라마, 뉴스, 음식, 스포츠, 문화 콘텐츠를 라틴아메리카 독자에게 제공합니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16.2.4 |
| Runtime | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| 상태 관리 | Zustand v5 |
| 서버 상태 | TanStack React Query v5 |
| HTTP | Axios |
| 국제화 | next-intl v4 (ko / es) |
| 패키지 매니저 | pnpm |

---

## 프로젝트 구조

FSD(Feature-Sliced Design) 아키텍처를 따릅니다.

```
src/
├── app/          # Next.js 앱 라우터 + 전역 Provider
├── entities/     # 도메인 엔티티 (user 등)
├── features/     # 비즈니스 기능 단위
├── views/        # 페이지 단위 UI (home, login)
├── widgets/      # 독립적 UI 블록 (header, footer)
├── shared/       # 공통 유틸 (api, config, lib, types, ui)
└── i18n/         # next-intl 설정

message/
├── ko.json       # 한국어 메시지
└── es.json       # 스페인어 메시지
```

---

## 시작하기

### 요구사항

- Node.js 20+
- pnpm

### 설치

```bash
pnpm install
```

### 환경 변수

`.env.local` 파일을 생성하고 아래 변수를 설정합니다.

```env
NEXT_PUBLIC_API_URL=https://your-api-url
```

### 개발 서버 실행

```bash
pnpm dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |
| `pnpm format` | Prettier 포맷 적용 |
| `pnpm format:check` | Prettier 포맷 검사 |

---

## 코드 품질

커밋 전 자동으로 아래 작업이 실행됩니다.

- **pre-commit**: lint-staged — `*.{js,ts,tsx}` 파일에 ESLint fix + Prettier 적용
- **commit-msg**: commitlint — 커밋 메시지 규칙 검사 (INIT / SETUP / BOOTSTRAP 접두어는 제외)

---

## 국제화

`next-intl` 을 사용하며 한국어(`ko`)와 스페인어(`es`) 두 언어를 지원합니다.  
메시지 파일은 `message/` 디렉터리에 위치합니다.
