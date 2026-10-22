# 日本妖怪圖鑑下批製圖清單（2026-10-21）

> 2026-10-22更新：以下33張歷史待辦已全部完成生成／縮圖／透明與逐圖目視、接入NODE_PORTRAITS。現有日本269／269、妖怪93／93，無剩餘缺圖；本輪新作未PUSH。提示與原圖對照見portrait-yokai-resume-prompts-2026-10-22.md，驗證結果以PROGRESS最新段為準。以下保留舊交接，勿當未完成清單。

## 交接狀態

- 日本主圖269／269有原創圖；妖怪圖鑑60／93有原創圖，尚缺以下33。此為現有節點覆蓋、非日本民間傳承全集。
- 本輪已新增日本27＋妖怪60＝87張。上一輪已PUSH f62b7d83a92992d2ad300dc7441bdfacc40da299；本輪新作先不再次PUSH。
- 內建image_gen回覆HTTP429 usage_limit_reached而停止。Codex五小時額度當時52%，不可混稱工作額度全用完。服務回報圖片恢復時間臺北2026-10-21 20:34:15（Unix1792586055），不是保證解鎖。
- 不繞過圖片限額、不改走CLI/API/其他付費或重置。三個在製佇列皆已結束；沒有必須等待的生成工作。
- 成功原圖以各批提示檔ledger為準；四至六批的生成loop因例外未完整保存functions store，已從逐圖輸出檔名追回21個成功原檔、縮256px透明並目視接入。原檔保留在同一generated_images工作目錄。
- 繼續只需依下表，先確認圖片服務恢復，再使用對應批次完整共用提示＋Subject。未生成項沒有先登記NODE_PORTRAITS，仍維持原本卡片與史料。
- 所有合格圖：256px RGBA透明四角、逐張目視、每圖<300KB、唯一hash；使用yokai命名空間。不要把原創圖說稱史料、不要取代使用者圖片或現有來源。

## 未完成33張（按現有批次順序）

|批次|節點ID|名稱|
|---|---|---|
|4|`kawahime`|川姬|
|4|`ushioni`|牛鬼|
|4|`nureonna`|濡女|
|4|`zashikiwarashi`|座敷童子|
|4|`noppera_bo`|野箆坊|
|4|`kudan`|件|
|4|`ryu`|龍|
|5|`kameosa`|瓶長|
|5|`mokumokuren`|目目連|
|5|`tenjoname`|天井嘗|
|5|`osakabehime`|刑部姬|
|5|`honeonna`|骨女|
|5|`hashihime`|橋姫|
|5|`hitodama`|人魂|
|5|`kasha`|火車|
|5|`wanyudo`|輪入道|
|5|`mikoshinyudo`|見越入道|
|5|`azukiarai`|小豆洗|
|6|`nuppeppo`|肉塊怪|
|6|`mujina`|貉|
|6|`nozuchi`|野槌|
|6|`ippondatara`|一本蹈鞴|
|6|`gagoze`|元興寺|
|6|`jakotsubabaa`|蛇骨婆|
|6|`omukade`|大蜈蚣|
|6|`okuriinu`|送り犬|
|6|`satori`|覺|
|6|`yamajiji`|山爺|
|6|`kijimuna`|木魅|
|6|`otoroshi`|恐怪|
|6|`amikiri`|網切|
|6|`yamatanoorochi_y`|八岐大蛇|
|6|`tsuchigumo`|土蜘蛛|

## 下批驗收要點

八岐大蛇需確實辨識八頭；土蜘蛛只畫後世妖怪、不將古代族群畫成害蟲。無固定形象者用非史料的意象設計（人魂、小豆洗等），不杜撰故事。不畫虐待、斷頭、出產／屍體獵奇。原創衣著與道具不宣稱文物復原。

沿用tools/prepare-portrait.py確定性縮圖、tests/portraits.test.py與tests/entry-performance.mjs。後者會逐張驗日本／妖怪映射、史料並存、雙語／編碼／燈箱／收藏／搜尋，390px逐張檢查有圖卡片不壓字／星號；測試為桌機Chromium裝置模擬，不是實體手機測速。

