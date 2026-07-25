# AGENTS.md

**This file is the single source of truth** for AI agent policy, handover reference, and session logs.
Do NOT create separate agent memo files (`Agent.md`, `.cursor/rules/` duplicates, `docs/agent-*`, etc.).

WXT browser extension (Vue 3 + TypeScript + Bun) that enhances dcinside.com. Use `bun`.

---

## §1 AI Workflow (mandatory)

All work on this project is done by AI agents. Follow this checklist every session.

### 1.0 Facts first — no guessing (all responses)

**Never answer from assumption.** Investigate the repo, runtime, or user-provided evidence **before** stating how something works, what an icon/UI means, or what caused a bug.

**Required before claiming something as fact:**

1. **Read primary sources** — relevant source files, `package.json`, `wxt.config.ts`, built `.output/`, `AGENTS.md`, user screenshots (open/read image files when provided)
2. **Search the codebase** — grep/glob for symbols, config keys, icon paths, manifest fields
3. **Run checks when applicable** — terminal commands, build output, manifest contents (do not skip because the question seems simple)
4. **Label uncertainty** — if not verified, say **「추정」** or **「확인 필요」** and list what was / wasn't checked. Do **not** present guesses as facts.

**Forbidden:**

- Identifying UI elements (icons, tray apps, errors) by vague resemblance without checking this project or the user's context
- Citing files or APIs that were not confirmed to exist in this repo (grep first)
- Filling gaps with generic web-extension or tooling knowledge when project-specific evidence is available

**Good example:** User asks about a toolbar icon → read `src/assets/icon.png`, `.output/*/icons/*.png`, `manifest.json` → report it is this extension's icon and whether Chrome graying applies.

**Bad example:** Small gray "R" icon → guess AutoHotkey paused (wrong; it was DCRefresher's own icon).

### 1.1 Before work — explain the problem (bug/fix tasks)

Before editing code, explain to the user in **beginner-friendly** terms (3–5 sentences):

1. **Symptom** — what goes wrong from the user's perspective
2. **Cause** — why it happens (mark as hypothesis if unsure)
3. **Plan** — what will be changed (one line)

Skip for pure new features or refactors with no bug.

### 1.2 During work

- Match existing conventions (Korean UI/comments, `bun`, minimal diff)
- Verify changes:
  ```bash
  bunx wxt prepare
  bunx tsc --noEmit -p tsconfig.json
  # or: bun build
  ```
- Manual smoke test when behavior changes: `bun dev` → load extension → test on `gall.dcinside.com`
- **Do not** create other memo/log files — append only to **§4 Session Log** below

### 1.3 After work — user report (fixed template)

```markdown
## 작업 완료 보고

### 문제 (무엇이었나)
- (한두 문장, 쉬운 말)

### 해결 (어떻게 고쳤나)
- (한두 문장)

### 직접 확인해볼 것
- [ ] (구체적 테스트 단계 1)
- [ ] (구체적 테스트 단계 2)

### 버전 / 커밋 / 릴리스
- version: x.y.z → x.y.z+1
- commit: (해시 또는 메시지 요약)
- release: 없음 | tag x.y.z pushed
```

### 1.4 After work — AI session log

Append a structured entry to **§4 Session Log** (newest first). English/structured format OK — humans don't read it.

---

## §2 Version / Commit / Release

**Version source:** `package.json` `version` only (WXT manifest follows it). Current: `5.2.4`.

| Change type | Examples | Version bump | Commit | Tag / Release |
|-------------|----------|--------------|--------|---------------|
| Small | bugfix, typo, style, docs-only | **patch +1** | required | **tag + Release** (see **Every work session**) |
| Feature / important | new module, new setting, behavior change | **minor +1** (patch → 0) | required | **tag + Release** |
| Breaking | storage key change, API removal | **major +1** | required | tag + Release + user approval |

**Every work session (default — always at task end)**

When any task completes (code, docs, or policy), **always** run the full backup/release/push flow. Do **not** stop at commit only. User does not need to say `릴리즈` again.

1. Bump `package.json` patch (+1) if anything changed since the last tag (`src/` → required; docs/policy → still bump patch for release traceability)
2. `bun zip` — verify `.output/*-chrome.zip` and `*-firefox.zip`
3. Commit + `git push origin` (current branch, usually `develop`)
4. `git tag X.Y.Z` + `git push origin X.Y.Z` (no `v` prefix)
5. GitHub Release with both zips attached
6. CI miss / empty assets → `gh release create` or `gh release upload` with built zips
7. **Hide old releases:** `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/hide-old-releases.ps1` — sets every release except the newest to **Draft** (public Releases page shows only Latest; git tags remain)
8. Report release URL; remind user to install `*-chrome.zip` (not Source code zip)

**User release request** — same flow as above; never skip because work was "small" or "already committed".

**Commit**

- Agent commits at end of work per this policy (no need for explicit user request)
- Message: one English line, why-focused
- Example: `fix(preview): prevent frame leak on rapid close`

**Release** — covered by **Every work session** above (always tag + GitHub Release + push).

**Dev vs release build**

- Dev: `bun dev` — incremental hot-reload
- Release: `bun zip` — full Chrome + Firefox build

---

## §3 Project Reference

### Commands

- `bun install` — also runs `postinstall: wxt prepare` which generates `.wxt/`
- `bun dev` — Chrome dev (WXT dev server, auto-reload)
- `bun dev:firefox` — Firefox dev
- `bun build` — builds Chrome **and** Firefox into `.output/`
- `bun zip` — zips both targets (used by CI release)

No test, lint, format, or typecheck scripts exist. Verify edits by:
- `bunx wxt prepare` then `bunx tsc --noEmit -p tsconfig.json` (typecheck; requires `.wxt/` generated first)
- `bun build` (compiles both targets)

### Setup gotcha

`tsconfig.json` extends `.wxt/tsconfig.json`, which is **generated** by `wxt prepare` (gitignored). On a fresh clone, `bun install` triggers this via `postinstall`. If `.wxt/` is missing (e.g. after `git clean`), run `bunx wxt prepare` before anything type-checks.

### Auto-imports (do not add explicit imports for these)

WXT auto-imports globals declared in `.wxt/types/imports.d.ts` (generated, gitignored). Auto-import dirs: `components`, `composables`, `hooks`, `utils`, `storage`, `http`. Notably:
- WXT APIs: `defineBackground`, `defineContentScript`, `defineUnlistedScript`, `defineWxtPlugin`, `browser`, `storage`, `createIntegratedUi`, `createShadowRootUi`, `createIframeUi`, `defineAppConfig`
- Vue APIs: `ref`, `computed`, `reactive`, `watch`, `createApp`, `defineComponent`, `nextTick`, ...
- From auto-import dirs: `blockStorage`, `blockModeStorage`, `memoStorage`, `moduleEnableStorage`, `moduleDataStorage`, `moduleSettingStorage`, `databaseStorage` (from `src/storage/wxtStorage.ts`), `client`, http helpers (from `src/http/`), `User`, `toast` (from `src/utils/`), `useRelativeTime` (from `src/composables/`)

**Note:** Content-specific code under `src/entrypoints/content/` is NOT auto-imported. The preview module uses explicit imports (`makeBodyFrame`, `makeCommentFrame`, `previewRequest`, `panel`, `blockPreset`, `closeAllPopups`, `createMiniPreview`, `miniPreview*`, `getRelevantData`, `PostCache`, `ScrollDetection`, `queryString`). `useDcconPopup` and `useMeDetection` are also explicitly imported.

If unsure whether a symbol is auto-imported, grep `.wxt/types/imports.d.ts`. Redundant explicit imports can cause conflicts.

Global types (`RefresherModule`, `RefresherSettings`, `RefresherBlockType`, `RefresherMemoType`, `RefresherEventMap`, ...) are declared `global` in `src/@types/*.ts` — no import needed.

Path aliases: `@/` and `~/` → `src/`; `@@/` and `~~/` → project root.

### Architecture

**Entrypoints** (`src/entrypoints/`):
- `background.ts` — service worker; context menus, commands, periodic database fetch from `https://dcrefresher.green1052.com/data`, storage migration
- `content/index.ts` — content script on `https://*.dcinside.com/*` (excludes event/h5/m/mall/wiki/gallog), `document_start`
- `grecaptcha.content.ts` — `world: "MAIN"`, reCAPTCHA token bridge
- `popup/` — extension popup settings UI
- `options/` — full-page settings (reuses popup components)

**Module system** (main extension mechanism):

`content/index.ts` auto-loads via `import.meta.glob`:
- `./modules/*/index.ts` (folder form)
- `./modules/*.ts` (flat form)

Each **default export** registers as `RefresherModule` through `src/core/modules.ts`. Interface: `src/@types/module.ts`. After load, `filter.run()` applies registered filters.

**Content modules (11 total)**

| Module | `default_enable` | URL scope | Role |
|--------|------------------|-----------|------|
| 글 목록 새로고침 (`refresh/`) | yes | `/board/(view\|lists)` | AJAX list refresh, in-page paging, Alt+R/S |
| 컨텐츠 차단 (`block/`) | yes | same | Block nick/ID/IP/title/text/comment/dccon/tab |
| 미리보기 (`preview/`) | yes | same | Right-click preview, tooltip, admin panel, comments |
| 유저 정보 (`userinfo.ts`) | yes | same | UID, IP ISP, memo display |
| 레이아웃 수정 (`layout.ts`) | yes | all | Compact mode, hide sidebars/notices |
| 폰트 교체 (`fonts.ts`) | yes | all | Dynamic font-family/size CSS |
| 이미지 검색 (`imagesearch.ts`) | yes | all | SauceNao context menu |
| 관리 (`manage/`) | no | `/board/(view\|lists)` | Ratio, perm-ban, shift/ctrl bulk check, ctrl delete |
| 스텔스 모드 (`stealth.ts`) | no | all | Hide images, Alt+P toggle |
| 글쓰기 (`write.ts`) | no | `/board/(write\|modify)` | Header/footer HTML, title limit bypass |

**Storage** (`src/storage/`):
- `wxtStorage.ts` — WXT `storage.defineItem` typed items; keys like `local:refresher:block:{TYPE}`, `local:refresher:memo:{TYPE}`, `local:refresher:module:{NAME}:enable|data|setting:{KEY}`, `local:refresher:database:*`
- `migration.ts` — migrates legacy keys (`__REFRESHER_*`, `NAME.enable`, `refresher.module:*`); runs in background + content on load

**Messaging / events** — use the right one:
- `src/http/messaging.ts` — `@webext-core/messaging` typed **background ↔ content** (`sendMessage`/`onMessage`, `ProtocolMap`)
- `src/core/eventbus.ts` — in-content pub/sub (`eventBus.on`/`emit`/`emitNextTick`); see `RefresherEventMap` in `src/@types/core.ts`

**Core files** (`src/core/`):
- `modules.ts` — register/load modules, popup message handlers
- `filtering.ts` — DOM filter engine (`MutationObserver`)
- `settings.ts` — per-module settings store
- `block.ts` — block list cache + `check()`/`add()`
- `memo.ts` — memo cache + `get()`/`add()`/`remove()`

**Shared UI** (`src/components/`): countdown, dccon, loader, previewButton, timestamp, toast, user. Preview SFCs live under `preview/components/`. SCSS: `src/assets/styles/index.scss` imported by `content/index.ts`.

### Directory structure

```
src/
├── @types/         # global type declarations (no imports needed)
├── assets/         # icons (icons/*.webp), styles
├── components/     # shared Vue SFCs (7 files)
├── composables/    # useRelativeTime.ts (shared)
├── core/           # block, eventbus, filtering, memo, modules, settings
├── entrypoints/
│   ├── background.ts
│   ├── grecaptcha.content.ts
│   ├── popup/      # settings UI + composables + tabs
│   ├── options/    # reuses popup
│   └── content/
│       ├── index.ts
│       ├── composables/  # useDcconPopup, useMeDetection
│       └── modules/      # 11 feature modules
├── http/           # http.ts (URLs), httpClient.ts (ky), messaging.ts
├── storage/        # wxtStorage.ts, migration.ts
└── utils/          # ban, comment, ip, memoAsk, toast, user, userDataInsert, types
```

### Manifest

Defined in `wxt.config.ts` (no static `manifest.json`). Permissions, `host_permissions` (`https://*.dcinside.com/*`), commands (Alt+R / Alt+S / Alt+P), `web_accessible_resources`, `browser_specific_settings`. `@wxt-dev/auto-icons` from `src/assets/icon.png`.

### Gitignored local files

`.env`, `.wxt/`, `.output/`, `web-ext.config.ts` — never commit `web-ext.config.ts` (machine-specific Chrome paths).

### Release (CI)

Tag push matching `*.*.*` → `.github/workflows/build.yml`: `bun install` → `bun zip` → GitHub Release (`*-chrome.zip`, `*-firefox.zip`) → `wxt submit` to stores. Bump `package.json` version before tagging.

### Conventions

- UI text and code comments are in Korean — preserve this.
- Renovate config extends `github>green1052/renovate-config`.

---

## §4 Session Log

<!-- AI: newest first. humans don't read this. -->

### [2026-07-26] v5.2.4 | type: patch | release: 5.2.4

- **task**: hide all GitHub releases except latest (draft); automate via script + policy
- **files**: scripts/hide-old-releases.ps1, AGENTS.md, package.json
- **fix**: older releases → Draft (public sees only Latest); step 7 in release flow
- **tag**: 5.2.4

### [2026-07-26] v5.2.3 | type: patch | release: 5.2.3

- **task**: update button opens chrome://extensions after zip download; policy = always release at task end
- **files**: updateCheck.ts, useUpdate.ts, AGENTS.md, package.json
- **fix**: applyExtensionUpdate tabs.create → chrome://extensions/; **Every work session** now mandates backup/release/push always
- **tag**: 5.2.3

### [2026-07-26] v5.2.1 | type: docs | release: no

- **task**: document user-mandated release policy in AGENTS.md
- **files**: AGENTS.md
- **root_cause**: user asked for release every time; agent sometimes stopped at commit/push; policy still said "small work = no release"
- **fix**: added **User release request** override (릴리즈/릴리즈백업푸시 → full zip + tag + GitHub Release); CI fallback via `gh release`; current version → 5.2.1
- **verify**: grep AGENTS.md for "User release request"
- **commit**: pending
- **tag**: none

### [2026-07-26] v5.1.7 | type: patch | release: no

- **task**: redesign Block tab layout (sidebar categories, list view, search)
- **files**: BlockTab.vue, BlockListItem.vue, useBlocks.ts, popup.scss, package.json, AGENTS.md
- **root_cause**: user request for intuitive/systematic block settings UI
- **fix**: two-column layout with grouped nav, per-type mode control, search, row-based list items
- **verify**: pending
- **commit**: pending
- **tag**: none

### [2026-07-26] v5.1.6 | type: patch | release: no

- **task**: remove sponsor/gallery/discord links; point GitHub to Baegovda repo; rewrite README
- **files**: GeneralTab.vue, README.md, package.json, AGENTS.md
- **root_cause**: user fork branding; upstream community links not wanted
- **fix**: links trimmed to GitHub + 도움말; README rewritten for Baegovda/DCRefresher-Reborn
- **verify**: pending
- **commit**: pending
- **tag**: none

### [2026-07-26] v5.1.5 | type: patch | release: no

- **task**: remember last popup tab when reopening extension UI
- **files**: wxtStorage.ts, usePopupTab.ts, popup/App.vue, options/App.vue, package.json, AGENTS.md
- **root_cause**: popup always initialized tab to 0 (일반)
- **fix**: persist last tab id in local storage; restore on open via usePopupTab composable
- **verify**: pending
- **commit**: 87031c4
- **tag**: none

### [2026-07-26] v5.1.4 | type: patch | release: no

- **task**: fix COMMENT block not persisting after page refresh / mode toggle
- **files**: core/block.ts, block/index.ts, package.json, AGENTS.md
- **root_cause**: block cache loaded async but filters ran before ready; rerun only hid elements without reset on mode/list change
- **fix**: export blockReady promise; await before registering filters; reset data-refresher-blocked then re-apply; debounced rerun on refresh + comment DOM observer
- **verify**: pending
- **commit**: 91b5523
- **tag**: none

### [2026-07-26] v5.1.3 | type: patch | release: no

- **task**: fix COMMENT block not working on dcinside comments
- **files**: block/index.ts, preview/commentFrame.ts, package.json, AGENTS.md
- **root_cause**: comment text read only inside .cmt_info ancestor of .ub-writer (sibling layout); no re-apply on block list change; preview compared raw HTML memo
- **fix**: resolve comment via li.ub-content; dedicated .usertxt filter; refresh event re-run; plainCommentText in preview
- **verify**: pending
- **commit**: 6c6eda4
- **tag**: none

### [2026-07-26] v5.1.2 | type: docs | release: no

- **task**: add §1.0 facts-first policy (no guessing; investigate before answering)
- **files**: AGENTS.md
- **root_cause**: agent misidentified extension icon as unrelated app
- **fix**: mandatory investigate/read/run/search rules + good/bad example
- **verify**: n/a
- **commit**: e4276b3
- **tag**: none

### [2026-07-26] v5.1.2 | type: patch | release: no

- **task**: bump version + SuckBong Edition branding
- **files**: package.json, wxt.config.ts, popup/index.html, options/index.html, GeneralTab.vue, AGENTS.md
- **root_cause**: user request custom edition name
- **fix**: displayName/manifest/UI title → "DCRefresher Reborn: SuckBong Edition", version 5.1.1→5.1.2
- **verify**: pending
- **commit**: pending
- **tag**: none

### [2026-07-26] v5.1.1 | type: docs | release: no

- **task**: bootstrap unified AI agent policy in AGENTS.md (§1–§4)
- **files**: AGENTS.md
- **root_cause**: n/a (policy init)
- **fix**: added workflow, version/commit/release rules, updated project reference (removed stale webStorage/communicate/data module docs), session log section
- **verify**: n/a (docs only)
- **commit**: 024d13a
- **tag**: none
