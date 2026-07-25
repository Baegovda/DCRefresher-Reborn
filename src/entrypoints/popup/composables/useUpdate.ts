import {onMounted, reactive, ref} from "vue";
import {sendMessage} from "@/http/messaging";
import type {ExtensionUpdateStatus} from "@/core/updateCheck";

const emptyStatus = (): ExtensionUpdateStatus => ({
    currentVersion: browser.runtime.getManifest().version,
    latestVersion: "",
    updateAvailable: false,
    chromeDownloadUrl: "",
    releaseUrl: "",
    lastCheckedAt: 0,
    error: ""
});

export const useUpdate = () => {
    const status = reactive<ExtensionUpdateStatus>(emptyStatus());
    const checking = ref(false);
    const applying = ref(false);

    const syncStatus = async () => {
        const next = await sendMessage("getUpdateStatus");
        Object.assign(status, next);
    };

    const checkUpdate = async (force = true) => {
        checking.value = true;
        try {
            const next = await sendMessage("checkForUpdate", {force});
            Object.assign(status, next);
        } finally {
            checking.value = false;
        }
    };

    const applyUpdate = async () => {
        applying.value = true;
        try {
            const result = await sendMessage("applyUpdate");
            if (!result.ok) {
                alert(result.error ?? "업데이트에 실패했습니다.");
                return;
            }

            alert(
                [
                    "최신 버전 zip을 다운로드했습니다.",
                    "",
                    "1. chrome://extensions 에서 기존 확장을 제거",
                    "2. zip 압축 해제",
                    "3. manifest.json 폴더를 다시 로드",
                    "",
                    "릴리즈 페이지도 함께 열었습니다."
                ].join("\n")
            );
        } finally {
            applying.value = false;
        }
    };

    const lastCheckedLabel = () => {
        if (!status.lastCheckedAt) return "아직 확인하지 않음";
        return new Date(status.lastCheckedAt).toLocaleString("ko-KR");
    };

    onMounted(async () => {
        await syncStatus();
        if (!status.lastCheckedAt) {
            await checkUpdate(false);
        }
    });

    return {
        status,
        checking,
        applying,
        checkUpdate,
        applyUpdate,
        lastCheckedLabel
    };
};
