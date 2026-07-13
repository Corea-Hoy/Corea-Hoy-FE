# Corea Hoy

한국의 뉴스와 문화를 스페인어로 전달하는 미디어 플랫폼입니다.  
K-POP, 드라마, 뉴스, 음식, 스포츠, 문화 콘텐츠를 라틴아메리카 독자에게 제공합니다.

---

## 팀원

| 이름 | 역할 | GitHub |
|------|------|--------|
| 김인수 | Frontend | [![GitHub](https://img.shields.io/badge/insu1170-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/insu1170) |
| 나현지 | Frontend | [![GitHub](https://img.shields.io/badge/hollyjelly-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hollyjelly) |
| 이승훈 | Frontend | [![GitHub](https://img.shields.io/badge/codingguri-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/codingguri) |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | ![Next.js](https://img.shields.io/badge/Next.js-16.2.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) |
| Runtime | ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black) |
| Language | ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| Styling | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) |
| 상태 관리 | ![Zustand](https://img.shields.io/badge/Zustand-v5-443E38?style=for-the-badge&logo=react&logoColor=white) |
| 서버 상태 | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white) |
| HTTP | ![Axios](https://img.shields.io/badge/Axios-1.15-5A29E4?style=for-the-badge&logo=axios&logoColor=white) |
| 에디터 | ![Tiptap](https://img.shields.io/badge/Tiptap-v3-000000?style=for-the-badge) |
| XSS 방지 | ![DOMPurify](https://img.shields.io/badge/isomorphic--dompurify-XSS_방지-000000?style=for-the-badge) |
| 알림 UI | ![Sonner](https://img.shields.io/badge/Sonner-toast-000000?style=for-the-badge) |
| 아이콘 | ![Lucide](https://img.shields.io/badge/Lucide--React-icons-000000?style=for-the-badge) |
| 국제화 | ![next-intl](https://img.shields.io/badge/next--intl-v4-000000?style=for-the-badge) |
| 패키지 매니저 | ![pnpm](https://img.shields.io/badge/pnpm-package_manager-F69220?style=for-the-badge&logo=pnpm&logoColor=white) |
| Lint / Format | ![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?style=for-the-badge&logo=prettier&logoColor=black) |
| Git Hooks | ![Husky](https://img.shields.io/badge/Husky-git_hooks-000000?style=for-the-badge) |
| Commit 규칙 | ![Commitlint](https://img.shields.io/badge/Commitlint-커밋_규칙-000000?style=for-the-badge) |

---

## 프로젝트 구조

FSD(Feature-Sliced Design) 아키텍처를 따릅니다.

```
app/              # Next.js 앱 라우터 (실제 라우트 페이지)
├── admin/
├── article/[id]/
├── feedback/
├── login/
├── mypage/
└── layout.tsx, page.tsx, not-found.tsx

src/
├── app/          # 전역 Provider (AuthInitializer, IntlProvider) — 라우트 아님
├── entities/     # 도메인 엔티티 (article, comment, content, feedback, user)
├── features/     # 비즈니스 기능 단위 (admin, article, auth, comment, feedback)
├── views/        # 페이지 단위 UI (admin-pipeline, article, content-management, feedback, home, login, mypage)
├── widgets/      # 독립적 UI 블록 (header, footer, hot-news, korea-carousel)
├── shared/       # 공통 유틸 (api, config, lib, model, ui, utils)
└── i18n/         # next-intl 설정

message/
├── ko.json       # 한국어 메시지
└── es.json       # 스페인어 메시지
```

> ⚠️ `app/`(루트)와 `src/app/`은 이름이 비슷하지만 역할이 다릅니다. 실제 페이지 라우트는 루트 `app/`에 있고, `src/app/`은 전역 Provider만 포함합니다.

### 경로 별칭 (Path Alias)

`tsconfig.json`에 `@/*` → `./src/*` 별칭이 설정되어 있습니다.

```ts
import { useUsersStore } from '@/entities/user';
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

`env.sample` 파일을 복사해 `.env.local` 파일을 생성하고 아래 변수를 설정합니다.

```bash
cp env.sample .env.local
```

```env
NEXT_PUBLIC_API_URL=

# JWT
JWT_SECRET=

# Google OAuth (로그인)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Kakao (콘텐츠 공유 SDK)
NEXT_PUBLIC_KAKAO_KEY=
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

## 인증

- **Google OAuth**로 로그인하며, 서버에서 발급한 JWT로 세션을 관리합니다.
- **Kakao SDK**는 로그인 용도가 아닌 콘텐츠 공유(카카오톡 공유하기) 기능에 사용됩니다.

### API 프록시 & 쿠키 인증

`next.config.ts`의 `rewrites()` 설정으로 프론트엔드는 항상 같은 오리진의 `/api/:path*`로만 요청하고, Next.js가 이를 `NEXT_PUBLIC_API_URL`(백엔드)로 프록시합니다.  
axios 인스턴스(`src/shared/api/axios.ts`)는 `withCredentials: true`로 쿠키를 자동 전송/수신하며, `401` 응답 시 자동 로그아웃 후 `/login`으로 리다이렉트됩니다.

> 프론트와 백엔드를 다른 오리진으로 직접 호출하면 쿠키 저장/전송이 깨질 수 있으니, API 호출은 반드시 이 프록시(`/api/...`)를 거쳐야 합니다.

### 이미지 도메인

`next.config.ts`의 `images.remotePatterns`는 기본적으로 모든 http/https 호스트를 허용하며, `lh3.googleusercontent.com`(구글 프로필) 등 일부는 명시적으로 등록되어 있습니다. 새 이미지 소스 추가 시 필요하면 이 설정을 확인하세요.

---

## 코드 품질

커밋 전 자동으로 아래 작업이 실행됩니다.

- **pre-commit**: lint-staged — `*.{js,ts,tsx}` 파일에 ESLint fix + Prettier 적용
- **commit-msg**: commitlint — `type-enum` / `type-case` / `subject-empty` 규칙은 모두 비활성화되어 있어 커밋 타입·형식을 강제하지 않으며, `INIT` / `SETUP` / `BOOTSTRAP`로 시작하는 메시지만 예외(ignore) 처리됩니다.

PR 생성 시 [PR 템플릿](.github/PULL_REQUEST_TEMPLATE.md)이 자동 적용되며, [CODEOWNERS](.github/CODEOWNERS)에 따라 리뷰어가 지정됩니다. 또한 CodeRabbit(`.coderabbit.yaml`)을 통한 AI 코드 리뷰가 함께 진행됩니다.

---

## 국제화

`next-intl` 을 사용하며 한국어(`ko`)와 스페인어(`es`) 두 언어를 지원합니다.  
메시지 파일은 `message/` 디렉터리에 위치합니다.

일반적인 next-intl 설정과 달리 `/es/...` 같은 URL 기반 라우팅(`[locale]` 세그먼트 + 미들웨어)을 사용하지 않습니다. 대신:

- `src/i18n/request.ts`(서버 사이드)는 `locale`이 `'ko'`로 고정되어 있고,
- 실제 언어 전환은 [`IntlProvider`](src/app/providers/IntlProvider.tsx)에서 `useLanguageStore`(Zustand)의 상태를 읽어 클라이언트 사이드에서 처리됩니다.
