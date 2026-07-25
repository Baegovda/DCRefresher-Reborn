<template>
  <div class="tab tab0">
    <div class="info">
      <div class="icon-wrap">
        <img
            :src="iconUrl"
            class="icon"
        />
      </div>

      <div class="text">
        <h3>DCRefresher Reborn: SuckBong Edition</h3>
        <p>
          <span class="version">v{{ displayVersion }}</span>
          <a
              v-for="link in links"
              :key="link.url"
              @click="open(link.url)"
          >
            {{ link.text }}
          </a>
        </p>
      </div>
    </div>

    <section class="update-panel">
      <div class="update-panel__header">
        <h4>업데이트</h4>
        <span
            :class="{
              available: status.updateAvailable,
              latest: !status.updateAvailable && !status.error,
              error: Boolean(status.error)
            }"
            class="update-panel__badge"
        >
          {{ statusLabel }}
        </span>
      </div>

      <p class="update-panel__desc">
        GitHub 릴리즈를 1분마다 자동 확인합니다.
        <template v-if="status.updateAvailable">
          최신 버전 <strong>v{{ status.latestVersion }}</strong>을 설치할 수 있습니다.
        </template>
        <template v-else-if="status.latestVersion">
          현재 최신 버전입니다.
        </template>
      </p>

      <p
          v-if="status.error"
          class="update-panel__error"
      >
        {{ status.error }}
      </p>

      <p class="update-panel__meta">
        마지막 확인: {{ lastCheckedLabel() }}
      </p>

      <div class="update-panel__actions">
        <button
            :disabled="checking || applying"
            type="button"
            @click="checkUpdate(true)"
        >
          {{ checking ? "확인 중..." : "업데이트 확인" }}
        </button>

        <button
            v-if="status.updateAvailable"
            :disabled="checking || applying"
            class="update-panel__apply"
            type="button"
            @click="applyUpdate"
        >
          {{ applying ? "다운로드 중..." : "업데이트" }}
        </button>
      </div>
    </section>

    <div class="settings">
      <div v-if="!hasSettings">
        <h3 class="need-refresh">우선 디시인사이드 페이지를 열고 설정 해주세요.</h3>
      </div>
      <div v-else>
        <settings-module
            v-for="moduleName in modulesWithBasicSettings"
            :key="moduleName"
            :module-enabled="modules[moduleName]?.enable ?? false"
            :module-name="moduleName"
            :module-settings="settings[moduleName]"
            :show-advanced="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import iconUrl from "@/assets/icon.png";
import SettingsModule from "../components/settingsModule.vue";
import {useUpdate} from "../composables/useUpdate";

const {
  modules,
  settings,
  hasSettings,
  modulesWithBasicSettings
} = inject("settings")!;

const {status, checking, applying, checkUpdate, applyUpdate, lastCheckedLabel} = useUpdate();

const displayVersion = computed(() =>
    import.meta.env.DEV ? `${status.currentVersion}-dev` : status.currentVersion
);

const statusLabel = computed(() => {
  if (checking.value) return "확인 중";
  if (status.error) return "확인 실패";
  if (status.updateAvailable) return "업데이트 가능";
  if (status.latestVersion) return "최신";
  return "대기";
});

const links = [
  {text: "GitHub", url: "https://github.com/Baegovda/DCRefresher-Reborn"},
  {text: "도움말", url: "https://dcrefresher.green1052.com"}
];

const open = (url: string) => {
  browser.tabs.create({url});
};
</script>

<style lang="scss" scoped>
@use "../../../assets/styles/variables" as *;

.update-panel {
  background: var(--refresher-bg-blur);
  border: 1px solid var(--refresher-border-light);
  border-radius: $radius-md;
  margin-bottom: 16px;
  padding: 14px 16px;
}

.update-panel__header {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 8px;

  h4 {
    font-size: 16px;
  }
}

.update-panel__badge {
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;

  &.latest {
    background: color-mix(in srgb, var(--refresher-success) 14%, transparent);
    color: var(--refresher-success);
  }

  &.available {
    background: color-mix(in srgb, var(--refresher-primary) 14%, transparent);
    color: var(--refresher-primary);
  }

  &.error {
    background: color-mix(in srgb, var(--refresher-danger) 14%, transparent);
    color: var(--refresher-danger);
  }
}

.update-panel__desc,
.update-panel__meta {
  color: var(--refresher-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.update-panel__error {
  color: var(--refresher-danger);
  font-size: 12px;
  margin-top: 6px;
}

.update-panel__meta {
  margin-top: 8px;
}

.update-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.update-panel__apply {
  background: var(--refresher-primary);
  border-color: var(--refresher-primary);
  color: #fff;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--refresher-primary) 88%, #000);
    border-color: color-mix(in srgb, var(--refresher-primary) 88%, #000);
    color: #fff;
  }
}
</style>
