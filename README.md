# Web Publisher Portfolio

HTML, SCSS, JavaScript 기반의 정적 Multi Page 포트폴리오 템플릿입니다.

## 실행
- `index.html`을 Live Server 또는 VS Code HTML Compiler 환경에서 실행합니다.
- 하위 페이지는 각각 독립된 `index.html`로 구성되어 있습니다.

## SCSS
```bash
npm install
npm run sass
```
현재 `assets/css/style.css`에는 브라우저에서 바로 사용할 수 있는 컴파일 결과가 포함되어 있습니다.

## 수정 위치
- 공통 스타일: `assets/scss/style.scss`
- 공통 스크립트: `assets/js/common.js`
- 홈 전용 스크립트: `assets/js/home.js`
- 프로젝트 이미지: `assets/images/`
- 이메일/GitHub: `contact/index.html`
- 실제 사이트 링크: `project-detail/index.html`

## 구조
- `/index.html`
- `/about/index.html`
- `/projects/index.html`
- `/project-detail/index.html`
- `/blog-skin/index.html`
- `/personal-projects/index.html`
- `/contact/index.html`

## 참고
샘플 이미지와 프로젝트 문구는 교체용 플레이스홀더입니다. 실제 프로젝트 캡처, 역할, 기여도, URL로 변경해 사용하세요.
