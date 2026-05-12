# Web Tetris — 설치 없이 바로, 클래식 테트리스

**▶ [지금 플레이 →](https://tetris-web-tau.vercel.app)**

> 브라우저만 있으면 됩니다. URL 하나로 즉시 플레이 — 로그인도, 다운로드도 없이.

<!-- TODO: 데모 GIF 삽입 (GIF 확보 후 아래 주석 교체) -->
<!-- ![Demo](./docs/demo.gif) -->

---

## Features

| | 기능 | 설명 |
|---|---|---|
| 🚀 | **Zero Friction** | 설치도, 로그인도 없습니다. 링크 하나면 게임이 시작됩니다. |
| 📱 | **어디서나** | 데스크탑과 모바일에서 동일한 경험. 화면 크기에 맞게 자동 조절됩니다. |
| ⚡ | **60fps 스무스** | `requestAnimationFrame` 기반 렌더링. 지연 없는 입력 반응. |
| 🎮 | **SRS 회전** | Tetris Guideline의 Super Rotation System 구현. |

---

## 기술 스택

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

- **Vite 8 / React 19 / TypeScript 6**
- **Tailwind CSS v4** — 스타일링
- **Zustand 5** — 게임 상태 관리
- **Vitest 4 + React Testing Library** — 단위/컴포넌트 테스트
- **Playwright** — E2E 테스트

---

## 개발

```bash
npm install
npm run dev       # 개발 서버
npm run test      # 단위/컴포넌트 테스트
npm run test:e2e  # E2E 테스트
npm run build     # 프로덕션 빌드
```

---

## License

[MIT](./LICENSE) © gomsclaw
