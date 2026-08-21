# World Mythology Genealogy — CLAUDE.md

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
- 可選地區：`east_asia` / `europe` / `middle_east` / `africa` / `modern` / `other`
- 持久化：`localStorage('mythRegionFilter')`（儲存隱藏地區的 JSON 陣列）
- **不用滾輪關閉**，僅點擊外部、Esc、或 toggle 按鈕才關閉

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

---

## 已收錄神話體系

| key | 名稱 | 節點數 |
|-----|------|--------|
| japan | 日本神話 | ~80+ |
| greek | 希臘神話 | ~80+ |
| norse | 北歐神話 | ~60+ |
| mesopotamia | 美索不達米亞神話 | ~70+ |
| persia | 波斯祆教 | ~40+ |
| celtic | 凱爾特神話 | 73+ |
| cthulhu | 克蘇魯神話 | 107 |
| egypt | 埃及神話 | ~50+ |

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
