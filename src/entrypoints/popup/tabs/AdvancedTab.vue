<template>
  <div class="tab tab1">
    <div v-if="loadState === 'loading'">
      <h3 class="need-refresh">모듈 설정을 불러오는 중…</h3>
    </div>
    <div v-else-if="loadState !== 'ready'">
      <h3 class="need-refresh">디시 페이지를 새로고침한 뒤 설정을 다시 열어주세요.</h3>
    </div>
    <div v-else>
      <settings-module
          v-for="moduleName in modulesWithAdvancedSettings"
          :key="moduleName"
          :module-enabled="modules[moduleName]?.enable ?? false"
          :module-name="moduleName"
          :module-settings="settings[moduleName]"
          :show-advanced="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {inject} from "vue";
import SettingsModule from "../components/settingsModule.vue";

const {
  modules,
  settings,
  loadState,
  modulesWithAdvancedSettings
} = inject("settings")!;
</script>