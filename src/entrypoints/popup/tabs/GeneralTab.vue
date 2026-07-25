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
          <span class="version">{{ version }}</span>
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
import {ref} from "vue";
import iconUrl from "@/assets/icon.png";
import SettingsModule from "../components/settingsModule.vue";

const {
  modules,
  settings,
  hasSettings,
  modulesWithBasicSettings
} = inject("settings")!;

const version = ref(
    import.meta.env.DEV
        ? `${browser.runtime.getManifest().version}-dev`
        : browser.runtime.getManifest().version
);

const links = [
  {text: "GitHub", url: "https://github.com/Baegovda/DCRefresher-Reborn"},
  {text: "도움말", url: "https://dcrefresher.green1052.com"}
];

const open = (url: string) => {
  browser.tabs.create({url});
};
</script>