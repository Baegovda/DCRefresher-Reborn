import {defineConfig} from "wxt";

export default defineConfig({
    srcDir: "src",
    webExt: {
        startUrls: ["https://gall.dcinside.com"]
    },
    modules: [
        "@wxt-dev/auto-icons",
        "@wxt-dev/webextension-polyfill",
        "@wxt-dev/module-vue"
    ],
    manifest: {
        name: "DCRefresher Reborn: SuckBong Edition",
        description: "디시인사이드 개선 확장 프로그램",
        permissions: [
            "activeTab",
            "alarms",
            "contextMenus",
            "downloads",
            "notifications",
            "storage",
            "scripting",
            "unlimitedStorage",
            "clipboardWrite"
        ],
        host_permissions: [
            "https://*.dcinside.com/*",
            "https://api.github.com/*"
        ],
        web_accessible_resources: [
            {
                resources: ["assets/*.webp"],
                matches: ["<all_urls>"]
            }
        ],
        commands: {
            refreshLists: {
                suggested_key: {
                    default: "Alt+R"
                },
                description: "글 목록 새로고침: 새로고침"
            },
            refreshPause: {
                suggested_key: {
                    default: "Alt+S"
                },
                description: "글 목록 새로고침: 일시 비활성화"
            },
            stealthPause: {
                suggested_key: {
                    default: "Alt+P"
                },
                description: "스텔스 모드: 일시 비활성화"
            }
        },
        browser_specific_settings: {
            gecko: {
                data_collection_permissions: {
                    required: ["none"]
                }
            }
        }
    }
});