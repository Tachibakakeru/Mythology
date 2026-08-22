# World Mythology Genealogy — AGENTS.md

## 專案概覽

單一 HTML 檔案 (`index.html`) 的世界神話族譜視覺化工具，無建置系統。
- **入口**: `D:\YiHsiang\程式\Mythology\index.html`
- **本地伺服器**: port 7788
- **技術**: 純 HTML + CSS + JS（Embedded），無框架

---

## 架構

### 節點資料格式
```js
[id, name, kana_subtitle, role, col, row, desc, isNote?, tag?]
// 索引 0-6 必填；col/row 必為 number；role 必為 string（常見漏填錯誤）
```

### 神話體系註冊
```js
const PANTHEONS = {
  key: { title, defs, groups, unions, names, seed, storage, ... }
}
```

### CSS z-index 層級
| 層 | z-index |
|---|---|
| svg#edges | 1 |
| .node | 3 |
| .groupbox | 5 |
| .node.highlight | 6 |
| .edge-label | 7 |
| topbar | 10 |
| panel | 15 |
| searchResults | 20 |
| groupPickerList | 25 |
| regionFilterList | 30 |
| imgLightbox | 200 |

---

## 首頁 UI

- **3D CSS 旋轉木馬**（`transform-style: preserve-3d`, `rotateY`, `translateZ`）
- `allWheelCards`（全部卡牌）vs `wheelCards`（過濾後可見）
- `rebuildWheel()` 重算旋轉木馬排列、dots、角度

### 地區過濾器
- `data-region` 屬性在 `.myth-icon` 上
- 可選地區：`east_asia` / `south_asia` / `europe` / `middle_east` / `africa` / `modern` / `other`
- 持久化：`localStorage('mythRegionFilter')`（儲存隱藏地區的 JSON 陣列）
- 勾選／取消後清單必須維持開啟；**僅**點擊外部、Esc、或 toggle 按鈕才關閉
- 清單底部必須同時提供「全部顯示」與「全部取消」；允許所有地區被取消，旋轉木馬需安全處理零張可見卡牌，不能自行恢復顯示。
- 首頁與地區篩選清單的捲軸僅隱藏外觀、不得關閉原生滾動；Firefox／舊 Edge 與 WebKit 均需覆蓋。
- 騎士王／亞瑟王傳說屬於 `other`（其他傳說），不屬於 `europe`
- 印度神話屬於 `south_asia`（南亞），不可歸入 `other`（其他傳說）或 `east_asia`（東亞）。

---

## 邊線 / 關係線

### 點擊偵測
- 隱形 14px 寬 `path` 元素（`data-uid`）供點擊
- `.edge-label` 需 `pointer-events:auto; z-index:7`（必須高於 `.node.highlight` 的 6）
- Stage 委派點擊：`e.target.closest('.edge-label')` → `highlightUnion(uid)`

### 拖曳防護
```js
wrap.addEventListener('mousedown', e => {
  if (e.target.closest('.node, .edge-label')) return; // 防止背景拖曳
  dragging = true; ...
});
```
- Touch：`touchMoved` flag + 6px `TOUCH_DRAG_THRESHOLD`
- 主系譜畫布：`applyTransform()` 必須先執行 `clampGraphView()`；畫布小於視窗時固定置中，畫布大於視窗時四邊最多保留 40px 空白，禁止無限拖曳。

---

## 已收錄神話體系

| key | 名稱 | 節點數 |
|-----|------|--------|
| japan | 日本神話 | 262 |
| india | 印度神話 | 95（含神獸、神器、聖典與宇宙事件群組） |

印度神話資料規則：以《羅摩衍那》、《摩訶婆羅多》、往世書及吠陀傳統為分層來源；十化身、女神形態與神祇親屬若有教派／地域異說，必須在節點描述中標明，不能寫成唯一正統。事件、師徒與政治同盟一律用 `partner` 與清楚標籤，不得偽裝成婚姻或血緣。
神性父系與人間母系同時存在時，必須各自保留一條 `parent` 關係；例如迦爾納同時連結蘇利耶與昆蒂，不得因事件敘事而漏掉任一血緣。

印度節點面板必須使用 `IN_NODE_SOURCES` 與 `IN_SOURCE_LIBRARY` 顯示至少一項來源連結；吠陀神用《梨俱吠陀》，兩大史詩人物分別連到《羅摩衍那》或《摩訶婆羅多》，《薄伽梵歌》另附其專屬文本。
節點描述若明確援引兩種文本，來源面板也必須顯示兩者；例如摩訶缽特摩同時對應往世書的八大那伽脈絡與《摩訶婆羅多》蛇族名錄。
印度頁的物件、神獸與文獻必須以獨立群組呈現，也可同時出現在人物／史詩群組；不可因為是「非人物」而省略來源、敘事描述或關係標籤。
調整節點座標後，必須以 `COLW=185`、卡片寬 `NODE_W=150` 與實際卡片高度檢查碰撞；不得只憑格位不同就假設不會重疊。優先修正資料座標，非必要不改共用佈線或縮放邏輯。
搜尋命中節點時，視角置中必須扣除已開啟的右側資訊面板寬度；不得以整個 `canvasWrap` 置中而使目標被面板覆蓋。
圖譜平移邊界同樣要扣除右側面板寬度；只修正 `focusNode()` 不足以處理位於圖譜右緣的節點，因其置中結果會被共用邊界鉗制。
| greek | 希臘神話 | 322 |
| norse | 北歐神話 | 177 |
| mesopotamia | 美索不達米亞神話 | 98 |
| persia | 波斯祆教 | 71 |
| celtic | 凱爾特神話 | 80 |
| arthurian | 騎士王・亞瑟王傳說 | 45 |
| cthulhu | 克蘇魯神話 | 107 |
| egypt | 埃及神話 | 70 |

### 日本妖怪圖鑑

- 目前 93 個節點、14 個群組；以 `YOKAI_DEFS` 與 `YOKAI_GROUPS` 驅動，不納入 `PANTHEONS` 主系譜節點數。
- 「百鬼夜行・絵巻」是繪卷主題群組，而非固定的百名妖怪名冊；群組只收錄與付喪神／百鬼夜行圖像傳統有明確關聯的代表節點，避免把不同版本混作唯一名單。
- 橋姬僅保留一個 `hashihime` ID；其描述需保留橋神與嫉妒鬼女兩條傳承的差異，禁止重複定義同一 ID。

### 日本頁語言切換

- 語言切換只可出現在日本神話系譜與日本妖怪圖鑑；狀態以 `localStorage('japanLocale')` 保存，值為 `zh-TW` 或 `ja`，不得影響其他神話頁。
- `JP_UI` 管理日本頁工具列、搜尋、面板欄位與收藏等固定文字；`localGroupLabel()` 管理日本神話／妖怪群組的繁中、日文顯示名稱。切換後必須重繪目前頁面的群組與已開啟面板。
- 第一階段已完成介面及群組在地化。故事敘述採既有原文優先；新增另一語言敘述時應以獨立語言覆蓋資料保存，不得直接覆寫原始 `desc` 或使用者編輯。
- 敘述覆蓋分為 `JP_DESC_JA`（日文）與 `JP_DESC_ZH`（繁中）；`layoutNodes()` 依日本神話頁的目前語系選用對應覆蓋，且只有沒有 `ov.desc` 時才套用。使用者自訂敘述永遠優先，不得因切換語言遭覆寫。
- 日文覆蓋尚未逐筆展開時，必須使用 `japaneseFallbackDesc(name, role)` 產生可讀的日文說明，不能回退成繁中原文；逐筆的 `JP_DESC_JA` 仍優先，並應持續取代該通用回退。
- 妖怪頁以 `YOKAI_BASE_DESCS` 保留日文原始敘述，繁中逐筆覆蓋放在 `YOKAI_DESC_ZH`。`applyYokaiLocale()` 必須在開啟妖怪頁與切換語言時執行，且 `YOKAI_EDITS_LIVE[id].desc` 永遠優先；尚未逐筆翻譯的節點不可回退日文，使用 `yokaiFallbackZh()` 的中立中文並保留資料庫來源。
- 短敘述審核的下限為 40 個字元；`strengthenShortZh()` 對日文原文的繁中覆蓋及妖怪繁中覆蓋補上「版本差異＋面板出典」提示。不得改動 `ov.desc`，也不得拿此共用提示代替後續可查證的個別故事內容。
- 補譯須以節點面板的來源連結可追溯之內容為準；若來源僅能佐證共同神話段落，`PROGRESS.md` 必須如實標明為共同文本脈絡，不得寫成個別專條佐證。
- 經來源審核的日本神話節點以 `JP_NODE_SOURCES` 對應 `JP_SOURCE_LIBRARY`；`openPanel()` 將來源連結渲染至 `#p-sources`。來源 URL 必須指向原典或學術／典藏機構頁面，禁止用未驗證的概述網站替代。

**首頁 disabled（未完成）**: Angels & Demons（天使惡魔）

---

## 克蘇魯神話分組（17 組）

外神、舊日支配者、古神、長老神與舊神、地球原有的眾神、其他超自然生靈、
雙生舊日支配者、侍從種族、夢境國度生物、典籍與神器、重要地點、重要人物、
4 個故事群組、創作者群組

---

## 常見錯誤與防護

| 錯誤 | 症狀 | 預防 |
|------|------|------|
| 缺 role 欄位 | col/row 被字串佔用，所有座標錯位 | 驗證 `typeof d[3]==="string" && typeof d[4]==="number"` |
| `const PANTHEONS` 被吃掉 | 語法錯誤，頁面空白 | 插入時確認 `const PANTHEONS = {` 仍在 |
| edge-label z-index 過低 | 點擊高亮節點時無法選到文字框 | 保持 z-index:7 |
| mojibake（亂碼） | kana 欄位含西里爾/韓文字元 | 驗證腳本掃描非 ASCII |

### 驗證指令
```bash
node -e "/* 9-類驗證腳本 */"
# 檢查：語法、節點數、重複ID、欄位型別、壞group/union參照、重複座標、mojibake
```

---

## 更新規則

- 每次回答後即時更新此檔案（新增節點數、修正記錄）
- 若新增神話體系，在「已收錄神話體系」表格補一行
- 若修正 CSS/JS 關鍵邏輯，在對應章節更新範例

---

## AGENTS 工作規則

- 本檔案完整沿用 `CLAUDE.md` 的核心架構、UI 設計、資料格式、互動規則、驗證方式與更新規則；後續工作必須遵循。
- 除非使用者明確要求，禁止任意改動既有核心架構、UI 互動模式、z-index 層級、資料格式或單檔案架構。
- 若判斷有更好的架構、UI 設計或實作方式，先說明現況、替代方案與影響，等待使用者決定後才執行；不得自行套用。
- 每次完成任何程式、資料、CSS、JS 或 UI 改動後，都要同步更新 `AGENTS.md` 與 `PROGRESS.md`。
- `PROGRESS.md` 的修正記錄必須詳細描述：日期、改動檔案、改動位置或功能、問題／需求、採用方式、驗證結果，以及尚未完成或可能影響的事項。
- 若新增節點、神話體系、群組或關係線，必須同步更新對應數量、清單與進度狀態。
- 變更前先讀取相關程式區段與目前文件；變更後執行適當驗證，並在 `PROGRESS.md` 記錄結果。
- 保持最小變更範圍，不新增不必要的框架、依賴、建置系統或抽象層。
- 亞瑟王資料以傑弗里・蒙茅斯、法國羅曼史／散文循環與馬洛里《亞瑟之死》的綜合傳統為基礎；遇到血緣、人物身分、神器來源或事件結局有版本差異時，必須在節點描述中標示，而非寫成唯一史實。
- 「圓桌十二騎士」採目前資料的代表性十二人名單：亞瑟、凱、蘭斯洛特、加拉哈德、高文、加雷斯、阿格拉瓦因、伊凡、貝德維爾、帕西法爾、鮑斯、崔斯坦；此名單並非所有中世紀文本共通的固定名單，群組以黯淡其餘節點的模式呈現，不畫跨距外框。
- 現有資料補強優先順序：日本神話（早期短敘述最多）→ 希臘／北歐 → 埃及／美索不達米亞／波斯；補寫時維持既有 ID、座標、群組與關係線，優先擴充描述，不任意改動血緣結構。
- 全站關係審核（2026-08-22）確認既有 9 個體系沒有失效的 `parent`／`children`／`spouses` 參照。對概念、事件或傳承人物新增連線時，使用 `marriage:"partner"` 加註事件標籤，不能冒充正式婚姻或親子血緣。
