<p align="center">
  <img src="./src/assets/icon.png" width="160" alt="DCRefresher Reborn icon"/>
  <br><br>
  <a href="https://github.com/Baegovda/DCRefresher-Reborn/releases">
    <img src="https://img.shields.io/github/v/release/Baegovda/DCRefresher-Reborn" alt="release">
  </a>
  <img src="https://img.shields.io/badge/license-GPL--3.0-blue" alt="license">
  <img src="https://img.shields.io/badge/runtime-Bun-f9f1e1?logo=bun&logoColor=000" alt="bun">
</p>

# DCRefresher Reborn: SuckBong Edition

[green1052/DCRefresher-Reborn](https://github.com/green1052/DCRefresher-Reborn)을 기반으로 한 디시인사이드 개선 확장 프로그램입니다.

갤러리·게시글·댓글 사용 경험을 다듬고, 차단·메모·미리보기·새로고침 등 자주 쓰는 기능을 브라우저 안에서 바로 쓸 수 있게 합니다.

## 주요 기능

| 모듈 | 설명 |
|------|------|
| **새로고침** | 글 목록 자동/수동 새로고침 (`Alt+R`, `Alt+S`) |
| **미리보기** | 글·댓글 미리보기 (`Alt+P`) |
| **컨텐츠 차단** | 닉네임, ID, IP, 제목, 본문, 댓글, 디시콘, 말머리 차단 |
| **메모** | 유저·IP에 메모 표시 |
| **레이아웃** | 갤러리 UI 요소 숨기기 등 화면 정리 |
| **글쓰기** | 글쓰기 화면 편의 기능 |
| **유저 정보** | 유저 관련 정보 표시 |
| **이미지 검색** | 이미지 역검색 |
| **폰트** | 사이트 폰트 변경 |
| **스텔스** | 확장 사용 흔적 최소화 |
| **관리** | 갤러리 관리 권한이 있을 때 관리 패널 |

설정은 확장 아이콘을 눌러 팝업에서 바꿀 수 있고, 마지막으로 보던 탭이 다시 열립니다.

## 업데이트 로그

버전별 변경 사항은 아래에서 확인할 수 있습니다.

- **[CHANGELOG.md](./CHANGELOG.md)** — 마크다운 (GitHub에서 바로 읽기)
- **[업데이트 로그 페이지](./docs/changelog.html)** — HTML (목차·버전별 상세)
- **[GitHub Releases](https://github.com/Baegovda/DCRefresher-Reborn/releases/latest)** — 최신 빌드 다운로드

## 설치 (개발 빌드)

스토어 배포본이 아니라 이 저장소에서 직접 쓰려면:

1. [Bun](https://bun.sh) 설치
2. 저장소 클론 후 의존성 설치

```bash
git clone https://github.com/Baegovda/DCRefresher-Reborn.git
cd DCRefresher-Reborn
bun install
```

3. 빌드

```bash
bun build
```

4. 브라우저에 로드
   - **Chrome**: `chrome://extensions` → 개발자 모드 → 압축해제된 확장 프로그램 로드 → `.output/chrome-mv3`
   - **Firefox**: `about:debugging` → 임시 추가 기능 로드 → `.output/firefox-mv2/manifest.json`

## 개발

```bash
bun dev          # Chrome 개발 서버 (핫 리로드)
bun dev:firefox  # Firefox 개발 서버
bun build        # Chrome + Firefox 빌드
bun zip          # 배포용 zip 생성
```

타입 검사:

```bash
bunx wxt prepare
bunx tsc --noEmit -p tsconfig.json
```

## 기술 스택

- [WXT](https://wxt.dev) — WebExtension 프레임워크
- Vue 3 + TypeScript
- Bun

## 문의

버그 제보·기능 제안은 [Issues](https://github.com/Baegovda/DCRefresher-Reborn/issues)를 이용해 주세요.

원본 프로젝트 문서가 필요하면 [DCRefresher 공식 사이트](https://dcrefresher.green1052.com)를 참고할 수 있습니다.

## 크레딧

- 원작: [green1052/DCRefresher-Reborn](https://github.com/green1052/DCRefresher-Reborn)
- 이 포크: [Baegovda/DCRefresher-Reborn](https://github.com/Baegovda/DCRefresher-Reborn)

## 라이선스

[GPL-3.0-only](LICENSE)
