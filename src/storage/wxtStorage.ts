// ===== 차단 (Block) =====

export const BLOCK_TYPES: RefresherBlockType[] = [
    "NICK",
    "ID",
    "IP",
    "TITLE",
    "TEXT",
    "COMMENT",
    "DCCON",
    "TAB"
];

export const MEMO_TYPES: RefresherMemoType[] = ["UID", "NICK", "IP"];

export const blockStorage = BLOCK_TYPES.reduce((acc, type) => {
    acc[type] = storage.defineItem<RefresherBlockValue[]>(`local:refresher:block:${type}`, {
        defaultValue: []
    });
    return acc;
}, {} as Record<RefresherBlockType, ReturnType<typeof storage.defineItem<RefresherBlockValue[]>>>);

export const DEFAULT_BLOCK_DETECT_MODE: RefresherBlockDetectMode = "CONTAIN";

export const blockModeStorage = BLOCK_TYPES.reduce((acc, type) => {
    acc[type] = storage.defineItem<RefresherBlockDetectMode>(`local:refresher:block:${type}:mode`, {
        defaultValue: DEFAULT_BLOCK_DETECT_MODE
    });
    return acc;
}, {} as Record<RefresherBlockType, ReturnType<typeof storage.defineItem<RefresherBlockDetectMode>>>);

// ===== 메모 (Memo) =====

export const memoStorage = MEMO_TYPES.reduce((acc, type) => {
    acc[type] = storage.defineItem<Record<string, RefresherMemoValue>>(`local:refresher:memo:${type}`, {
        defaultValue: {}
    });
    return acc;
}, {} as Record<RefresherMemoType, ReturnType<typeof storage.defineItem<Record<string, RefresherMemoValue>>>>);

// ===== 모듈 (Module) =====

// 모듈 활성화 상태 (모듈별 개별 key)
export const moduleEnableStorage = (module: string) =>
    storage.defineItem<boolean | null>(`local:refresher:module:${module}:enable`, {defaultValue: null});

// 모듈 data (모듈별 개별 key)
export const moduleDataStorage = (module: string) =>
    storage.defineItem<Record<string, unknown> | null>(`local:refresher:module:${module}:data`, {defaultValue: null});

// 모듈 설정값 (모듈/키별 개별 key)
export const moduleSettingStorage = (module: string, key: string) =>
    storage.defineItem<string | number | boolean | null>(`local:refresher:module:${module}:setting:${key}`, {
        defaultValue: null
    });

// ===== UI =====

export const popupLastTabStorage = storage.defineItem<number>("local:refresher:popup:lastTab", {
    defaultValue: 0
});

export const updateStorage = {
    lastCheck: storage.defineItem<number>("local:refresher:update:lastCheck", {defaultValue: 0}),
    latestVersion: storage.defineItem<string>("local:refresher:update:latestVersion", {defaultValue: ""}),
    updateAvailable: storage.defineItem<boolean>("local:refresher:update:available", {defaultValue: false}),
    chromeDownloadUrl: storage.defineItem<string>("local:refresher:update:chromeUrl", {defaultValue: ""}),
    releaseUrl: storage.defineItem<string>("local:refresher:update:releaseUrl", {defaultValue: ""}),
    checkError: storage.defineItem<string>("local:refresher:update:error", {defaultValue: ""})
};

// ===== 데이터베이스 (IP/Ban) =====

export const databaseStorage = {
    ip: storage.defineItem<Record<string, string>>("local:refresher:database:ip", {defaultValue: {}}),
    ban: storage.defineItem<Record<string, string[]>>("local:refresher:database:ban", {defaultValue: {}}),
    version: storage.defineItem<string>("local:refresher:database:version", {defaultValue: ""}),
    lastUpdate: storage.defineItem<number>("local:refresher:database:lastUpdate", {defaultValue: 0})
};