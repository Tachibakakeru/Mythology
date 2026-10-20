# 日本原創節點插畫續作提示集（2026-10-20）

使用內建 image_gen，非 API／CLI。每個提示產生一張獨立圖；風格參考為 `assets/portraits/japan/takemikazuchi.png`，只參考畫風、不替換人物臉或共用圖。原圖保存在內建生成目錄，網頁資產只作LANCZOS等比例縮圖至256×256，不自行重畫、不破壞alpha。

## 共用規格

Use case: stylized-concept. ONE original Japanese mythology node portrait. Reference is STYLE ONLY, not the subject. Match crisp polished chibi fantasy game illustration, an elaborate thin blue-and-gold circular medallion, recognizable at 64px, centered bust, whole frame contained in square. This original artistic design is not a historical or universally canonical appearance. Genuine transparent alpha outside the circle, cool colored scene only inside. Every ornament contained inside the rim. No text, lettering, watermark, checkerboard or square backdrop.

## 角色提示

- `kanayamahiko` 透明修訂提示：Change ONLY transparent area OUTSIDE gold circular frame; remove stray nearly transparent pixels／haze, exactly zero alpha outside and at all four corners; keep portrait identity, expression, hammer, ingot, pose, colors and forge scene unchanged; add a little transparent padding so 256px downscale has transparent corners. 內建編輯原圖exec-969c3618-4b70-4419-8d6b-55d8c29935e9.png，接kanayamahiko-v2.png；先前小圖保留生成目錄kanayamahiko-256-v1.png。
- `torinoiwakusufune`: Torinowakusufune / Ame no Torifune divine ship, carved wooden boat with prominent bird-shaped prow, not humanoid; pale cloud curls, blue waves and soft golden celestial path; no passengers, engines, labeled sails, rockets or weapons. 原圖exec-88323ed2-5b29-46f1-aed7-6590d66d4ad2.png，已目視並落地。
- `sugawara_michizane`: Sugawara no Michizane, Tenjin, a gentle scholarly Heian court poet, distinct from the warrior reference. Black eboshi cap, plum-purple and midnight-blue layered court robes, holding a writing brush and small scroll, small plum blossoms and a single white ox silhouette as secondary symbolic motifs behind him. Calm wise expression, no weapon, no samurai armor, no modern items. Original concept, not a historical reconstruction. 生成原圖 `exec-0b42a858-2aac-4fe3-92c2-79d6277ec70d.png`；目視筆卷、梅、牛可辨，RGBA／透明角落合格，已接入。
- `shinatsuhiko`: Shinatsuhiko, kami of wind: original youthful male wind spirit with flowing pale teal and ivory robes, streaming dark hair, a large airy billowing scarf swept into a spiral, maple leaves lifted by the breeze. Defining element is transparent wind ribbons, not lightning. No lightning drums, no Raijin or Fujin sack copied from another deity. 製作中，未計入完成。
- `kukunochi`: Kukunochi, kami of trees: original gentle youthful masculine tree spirit, dark brown tied hair, robes in deep forest green and bark brown, branch staff with fresh leaves and a small young tree beside him, huge ancient tree trunk and soft woodland light behind. No antlers, no Celtic runes, no invented specific sacred weapon. 製作中，未計入完成。
