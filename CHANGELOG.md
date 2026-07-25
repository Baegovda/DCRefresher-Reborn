# Changelog

DCRefresher Reborn: SuckBong Edition (**Baegovda** 포크) 변경 이력.  
GitHub **[Releases](https://github.com/Baegovda/DCRefresher-Reborn/releases)** 와 동기화됩니다.

형식: [Keep a Changelog](https://keepachangelog.com/). 버전은 [Semantic Versioning](https://semver.org/) (`package.json`).

설치: Releases에서 `dcrefresher-reborn-*-chrome.zip` (Source code zip 아님).

---

## [5.2.9] — 2026-07-26

### Changed
- 변경 이력을 **CHANGELOG.md** 단일 문서로 통일 (GGPK_Custom과 동일 방식)
- README 상단 **변경 이력 (CHANGELOG)** · **Releases** 링크 배치

### Removed
- `docs/changelog.html` 제거

---

## [5.2.8] — 2026-07-26

### Added
- **`CHANGELOG.md`** — GitHub에서 바로 보는 공개 변경 이력
- README 변경 이력·릴리즈 링크, AGENTS.md 릴리즈 시 changelog 갱신 정책

---

## [5.2.7] — 2026-07-26

### Changed
- 설정 팝업 **최대 높이 제한(720px) 제거** — 아래 드래그로 더 크게 조절 가능 (최소 360px, 값 저장)

---

## [5.2.6] — 2026-07-26

### Added
- 설정 팝업 **하단 드래그 핸들**로 창 높이 조절 (360px~, 저장됨)
- **고급** 탭에 세부 모듈 설정 (미리보기·레이아웃·관리·차단·폰트 등)

### Changed
- 자주 쓰는 설정은 **일반** 탭, 세부 옵션은 **고급** 탭으로 분리

### Fixed
- 고급 탭이 비어 보이던 문제 (`advanced` 플래그 미적용)

---

## [5.2.5] — 2026-07-26

### Fixed
- 디시인사이드(갤/마이너갤 등) 탭에서 설정·모듈 목록이 **「로드된 모듈 없음」** 으로 나오던 문제
- 활성 탭 우선 탐색, URL 매칭, `getSchema` 재시도, `modulesReady` 게이트
- `tabs` 권한 추가

---

## [5.2.4] — 2026-07-26

### Changed
- GitHub Releases에서 **최신 버전만 공개**, 이전 릴리즈는 Draft 처리
- `scripts/hide-old-releases.ps1` 자동화 스크립트 추가

---

## [5.2.3] — 2026-07-26

### Changed
- **업데이트** 버튼: zip 다운로드 후 `chrome://extensions/` 페이지 자동 열기

---

## [5.2.2] — 2026-07-26

### Changed
- 버전 정리 및 릴리즈 정책 문서 보강

---

## [5.2.1] — 2026-07-26

### Changed
- 작업 완료 시 **항상** 백업·릴리즈·푸시 하도록 AGENTS.md 정책 명시

---

## [5.2.0] — 2026-07-26

### Added
- GitHub Releases **자동 업데이트 확인** (1분 간격)
- 설정 **일반** 탭에 업데이트 확인·다운로드 UI

---

## [5.1.9] — 2026-07-26

### Fixed
- 백그라운드 **컨텍스트 메뉴 중복 등록** 방지 (확장 리로드 시)

---

## [5.1.8] — 2026-07-26

Baegovda 포크 초기 공개 릴리즈 구간. 아래 5.1.2~5.1.7 변경이 이 태그에 포함됨.

### Added
- GitHub Releases 기반 **업데이트 확인** 기능 (초기 버전)
- F5 **개발 서버 재시작** 스크립트 (`scripts/dev-restart.ps1`)
- **차단** 탭 재설계: 사이드바 카테고리, 목록 뷰, 검색
- 설정 팝업 **마지막 탭 기억** (다시 열면 이전 탭 복원)

### Fixed
- 디시 **댓글 본문 차단** 복구 (`.usertxt`·`li.ub-content` 인식)
- **댓글(COMMENT) 차단**이 새로고침·모드 변경 후 풀리던 문제
- 미리보기에서 댓글 메모 비교 시 HTML 태그 제거

### Changed
- 차단 기본 매칭 모드를 **CONTAIN(포함)** 으로 통일
- 스폰서·갤러리·Discord 링크 제거, Baegovda 포크용 README·GitHub 링크 정리
- 에디션명 **「DCRefresher Reborn: SuckBong Edition」** 브랜딩
- CI 릴리즈 권한·수동 `workflow_dispatch` 보강
- AGENTS.md 통합 (워크플로, 버전·릴리즈 규칙, 사실 확인 우선 정책)

---

## [5.1.2] — 2026-07-26

[green1052/DCRefresher-Reborn](https://github.com/green1052/DCRefresher-Reborn) 기반 포크 시작.  
이전 upstream 변경은 원본 저장소·[공식 사이트](https://dcrefresher.green1052.com) 참고.

---

[5.2.9]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.9
[5.2.8]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.8
[5.2.7]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.7
[5.2.6]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.6
[5.2.5]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.5
[5.2.4]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.4
[5.2.3]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.3
[5.2.2]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.2
[5.2.1]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.1
[5.2.0]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.2.0
[5.1.9]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.1.9
[5.1.8]: https://github.com/Baegovda/DCRefresher-Reborn/releases/tag/5.1.8
