import {updateStorage} from "@/storage/wxtStorage";

export const GITHUB_RELEASE_REPO = "Baegovda/DCRefresher-Reborn";
export const UPDATE_ALARM_NAME = "refresher-update-check";
export const UPDATE_CHECK_INTERVAL_MINUTES = 1;

export type ExtensionUpdateStatus = {
    currentVersion: string;
    latestVersion: string;
    updateAvailable: boolean;
    chromeDownloadUrl: string;
    releaseUrl: string;
    lastCheckedAt: number;
    error: string;
};

type GitHubReleaseAsset = {
    name: string;
    browser_download_url: string;
};

type GitHubReleaseResponse = {
    tag_name: string;
    html_url: string;
    assets: GitHubReleaseAsset[];
};

export const normalizeVersion = (version: string): string =>
    version.trim().replace(/^v/i, "").replace(/-dev$/i, "");

export const compareVersions = (left: string, right: string): number => {
    const a = normalizeVersion(left).split(".").map((part) => Number(part) || 0);
    const b = normalizeVersion(right).split(".").map((part) => Number(part) || 0);
    const length = Math.max(a.length, b.length);

    for (let i = 0; i < length; i++) {
        const diff = (a[i] ?? 0) - (b[i] ?? 0);
        if (diff !== 0) return diff > 0 ? 1 : -1;
    }

    return 0;
};

export const getCurrentExtensionVersion = (): string => browser.runtime.getManifest().version;

const fetchLatestRelease = async () => {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_RELEASE_REPO}/releases/latest`, {
        headers: {
            Accept: "application/vnd.github+json"
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub 릴리즈 조회 실패 (${response.status})`);
    }

    const data = (await response.json()) as GitHubReleaseResponse;
    const version = normalizeVersion(data.tag_name);
    const chromeAsset = data.assets.find((asset) => asset.name.endsWith("-chrome.zip"));

    if (!chromeAsset) {
        throw new Error("Chrome 설치 zip을 찾을 수 없습니다.");
    }

    return {
        version,
        chromeDownloadUrl: chromeAsset.browser_download_url,
        releaseUrl: data.html_url
    };
};

const buildStatus = async (currentVersion = getCurrentExtensionVersion()): Promise<ExtensionUpdateStatus> => {
    const [
        latestVersion,
        updateAvailable,
        chromeDownloadUrl,
        releaseUrl,
        lastCheckedAt,
        error
    ] = await Promise.all([
        updateStorage.latestVersion.getValue(),
        updateStorage.updateAvailable.getValue(),
        updateStorage.chromeDownloadUrl.getValue(),
        updateStorage.releaseUrl.getValue(),
        updateStorage.lastCheck.getValue(),
        updateStorage.checkError.getValue()
    ]);

    return {
        currentVersion: normalizeVersion(currentVersion),
        latestVersion,
        updateAvailable,
        chromeDownloadUrl,
        releaseUrl,
        lastCheckedAt,
        error
    };
};

export const getExtensionUpdateStatus = async (): Promise<ExtensionUpdateStatus> => buildStatus();

export const checkExtensionUpdate = async (force = false): Promise<ExtensionUpdateStatus> => {
    const currentVersion = getCurrentExtensionVersion();
    const lastCheckedAt = await updateStorage.lastCheck.getValue();
    const elapsed = Date.now() - lastCheckedAt;

    if (!force && elapsed < UPDATE_CHECK_INTERVAL_MINUTES * 60_000) {
        return buildStatus(currentVersion);
    }

    const wasAvailable = await updateStorage.updateAvailable.getValue();

    try {
        const latest = await fetchLatestRelease();
        const updateAvailable = compareVersions(latest.version, currentVersion) > 0;

        await Promise.all([
            updateStorage.lastCheck.setValue(Date.now()),
            updateStorage.latestVersion.setValue(latest.version),
            updateStorage.updateAvailable.setValue(updateAvailable),
            updateStorage.chromeDownloadUrl.setValue(latest.chromeDownloadUrl),
            updateStorage.releaseUrl.setValue(latest.releaseUrl),
            updateStorage.checkError.setValue("")
        ]);

        if (updateAvailable && !wasAvailable) {
            void browser.notifications.create({
                type: "basic",
                iconUrl: browser.runtime.getURL("/icons/128.png"),
                title: "DCRefresher 업데이트",
                message: `새 버전 ${latest.version}이 있습니다.`
            });
        }

        return buildStatus(currentVersion);
    } catch (error) {
        const message = error instanceof Error ? error.message : "업데이트 확인 실패";
        await updateStorage.checkError.setValue(message);
        return buildStatus(currentVersion);
    }
};

export const applyExtensionUpdate = async (): Promise<{ok: boolean; error?: string}> => {
    const status = await buildStatus();

    if (!status.updateAvailable) {
        return {ok: false, error: "설치할 새 버전이 없습니다."};
    }

    if (!status.chromeDownloadUrl) {
        return {ok: false, error: "다운로드 주소를 찾을 수 없습니다."};
    }

    try {
        await browser.downloads.download({
            url: status.chromeDownloadUrl,
            filename: `dcrefresher-reborn-${status.latestVersion}-chrome.zip`,
            saveAs: false
        });

        await browser.tabs.create({url: status.releaseUrl});

        return {ok: true};
    } catch (error) {
        const message = error instanceof Error ? error.message : "업데이트 다운로드 실패";
        return {ok: false, error: message};
    }
};

export const scheduleUpdateChecks = () => {
    void browser.alarms.create(UPDATE_ALARM_NAME, {
        periodInMinutes: UPDATE_CHECK_INTERVAL_MINUTES
    });

    void checkExtensionUpdate(false);

    browser.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name !== UPDATE_ALARM_NAME) return;
        void checkExtensionUpdate(true);
    });

    browser.notifications.onClicked.addListener(() => {
        void (async () => {
            const releaseUrl = await updateStorage.releaseUrl.getValue();
            if (releaseUrl) await browser.tabs.create({url: releaseUrl});
        })();
    });
};
