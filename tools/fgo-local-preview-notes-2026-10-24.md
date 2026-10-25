# FGO本機比較圖：交接與來源界線

> 最新安排 2026-10-26 03:07:58 +08:00：使用者要求FGO也可隨網站發布，已轉assets/fgo/與正式index面板整合；本文件以下是10-24的私有預覽歷史，不能再套為現在的發布限制。private-media原檔仍是忽略的備份。技術可發布不等於取得素材公開使用授權；本輪未PUSH。

更新：2026-10-24 17:02:23 +08:00。本輪美索不達米亞原創98／98完成，FGO114圖項／111不同既有節點／106原圖，23頁。這是已核實且取得適當圖像的比較圖，不宣稱所有遊戲NPC或所有Fate作品全集。

## 隔離方式

- 正式index不載FGO、不寫入LIVE_EDITS；只有tools/preview.html在localhost或127.0.0.1載入private-media/fgo/overlay.js。
- private-media/整目錄Git忽略。manifest.json、overlay.js、原圖須另做專案外壓縮備份；換機或git clone不會帶來，需恢復本機備份。
- 外層預覽與overlay雙重限制localhost；圖片路徑限本機fgo/下png／jpg／webp、來源為明確白名單。使用DOM textContent，不把外部說明當HTML。
- openPanel／openYPanel先呼叫原函式再追加figure，保留原創與史料圖。群組可有多個成員附圖，非所有成員合照須寫明。
- 圖片只在詳情lazy載入，首頁／圖譜節點繼續只用256px原創圖，不把大圖加到數百節點背景。
- FGO原圖皆保留原檔，沒有裁掉官方文字；不是新生成的FGO模仿圖。
- 不宣稱私人使用等於取得授權。官方guidelines與個別截圖公告不能推導本網站概括授權；不得把私有圖片帶入PUSH、部署或匯出。

## 已接入（圖項／不同節點）

- japan：2／2；yamatotakeru、hoderi。
- yokai：6／6；tamamonomae、shutendoji、ibarakidoji、suzukagozen、momiji、osakabehime。
- mesopotamia：8／8；gilgamesh、enkidu、inanna、ereshkigal、tiamat、semiramis、siduri、dumuzi。
- greek：32／30；herakles、medusa、medeia、atalante、hektor、cheiron、achilleus、kirke、penthesileia、asklepios、jason、paris、europa、odysseus、theseus、andromeda、hippolyte、demeter、orion、artemis、minotauros、polydeukes、kastor、gorgones_note、gorgones_note、aphrodite、zeus、charon、persephone、apollon、zeus、daidalos。
- norse：7／6；thrud、valkyrjur_note、skadi、sigurd、brynhild、norns_note、norns_note。
- celtic：7／7；cu_chulainn、scathach、fergus、medb、diarmuid、fionn、manannan。
- arthurian：12／12；arthur、merlin、morgan、mordred、lancelot、gawain、gareth、bedivere、tristan、perceval、agravain、galahad。
- india：10／10；parvati、ganesha、durga、indra、rama、arjuna、karna、bhima、duryodhana、sita。
- buddhism：2／2；xuanzang、ashoka。
- china：3／3；jiang_ziya、nezha、huangfeihu_fengshen。
- demons：1／1；lilith。
- maya：2／2；my_kukulkan、my_camazotz。
- aztec：3／3；az_quetzalcoatl、az_tezcatlipoca、az_tlaloc。
- nibelungen：2／2；nb_siegfried、nb_kriemhild。
- roland：4／4；rl_charlemagne、rl_roland、rl_bradamante、rl_astolfo。
- beowulf：1／1；bw_beowulf。
- robinhood：1／1；rh_robin。
- tell：1／1；tl_tell。
- yoshitsune：2／2；ys_yoshitsune、ys_kiichi。
- kalevala：1／1；kv_louhi。
- ulster：4／4；ul_cu、ul_scathach、ul_medb、ul_fergus。
- fianna：2／2；fn_fionn、fn_diarmuid。
- angels：1／1；metatron。

## 出處類型

- 92圖是FGO官方trajectory角色介紹PNG原圖：https://www.fate-go.jp/trajectory/servant/ 。
- 阿佛洛狄忒為遊戲NPC立繪的Wiki轉載：https://typemoon.fandom.com/wiki/Aphrodite_(Lostbelt) 。不得標成官方圖鑑檔。
- 宙斯為設計者Azusa2020-04-20公開賀圖，報導附原貼：https://demonition.com/blog-entry-65572.html ，原貼https://twitter.com/Azusa1019/status/1252258471635898369 。不是遊戲原立繪。
- 西杜莉為FGO改編動畫美國官方人設：https://anime.fate-go.us/ep7-tv/character/?chara=siduri ，©TYPE-MOON / FGO7 ANIME PROJECT，非遊戲原圖。
- 10張NPC遊戲截圖片段採AppMedia公開圖庫轉載：https://appmedia.jp/fategrandorder/2427886 。逐一對應海幸彥、杜姆茲人形、悉多、阿格拉瓦因、卡戎、卡馬索茨、珀耳塞福涅、加拉哈德、宙斯人型端末、薇兒丹蒂；不是官方圖鑑、不是全身立繪。杜姆茲人形另核對 https://appmedia.jp/fategrandorder/77185565 。
- 代達羅斯另採遊戲巨臂NPC截圖：https://appmedia.jp/fategrandorder/78312266 ，圖說明示巨臂本人，不誤認侍從人偶娜烏克拉忒；此來源亦加入獨立白名單。
- 阿波羅共用官方帕里斯介紹圖，明示頭上的白羊為阿波羅、少年為帕里斯；身份查證 https://typemoon.wiki.cre.jp/wiki/%E3%82%A2%E3%83%9D%E3%83%AD%E3%83%B3 。
- 每一筆原圖完整URL、當下核對時間、圖說與適用節點均在忽略的manifest，不把圖像複製進此文檔。

## 不硬貼／後續可查

- 神話天照不直接貼玉藻前或高揚斯卡婭；大國主不因日本習合就貼FGO大黑天神使；龍類群組的清姬異名不等於龍類全體。
- 蛇神八岐大蛇不直接貼伊吹童子；弟橘媛的Fate/Samurai Remnant登場不自動當FGO已登場。
- 金古不借恩奇都立繪；西杜莉祭司長是遊戲改編，原典酒館女主人照舊。
- 阿斯托爾福與齊格飛用正確人物；同名小齊格飛、丹麥王系Beow、史傳羅蘭不跟著貼主角FGO圖。
- 希臘海仙女加拉忒亞不是皮格馬利翁雕像；堤豐造物厄菲莫洛斯不是堤豐本人；愛神或其他複合靈基須先核實身分，不以名字片段強配。
- 北歐斯卡蒂與凱爾特斯卡塔赫分開，只有斯卡蒂圖說明遊戲結合靈基；諾恩圖分烏爾德與薇兒丹蒂、仍非全三人；女武神圖只奧特琳德代表。
- FGO牛若丸女性造型僅義經角色；未把平景清複合靈基直接當義經。FGO名義弁慶與常陸坊海尊的身分差異須先找可靠圖說，不直接貼真弁慶節點。
- 阿爾托莉雅與Prototype亞瑟不同遊戲版本，目前亞瑟節點先用Prototype男性版，不回填遊戲性別／家譜到原典。
- 梅塔特隆・貞德明示複合設定；玄奘／部分圓桌騎士性別改編明示；擬似從者的人類依代不是神的歷史形象。
- 波斯安格拉・曼紐不硬貼FGO同名被當惡神的人類從者（神與借名者不同）；印和闐不因相似譯音貼埃及法老；英靈與神明不可只靠名字聯想匹配。
- 其餘NPC金古、阿瑞斯、部分機神／神獸：若來源受402／403限制，不繞過；找公開合法可讀的替代來源並核實後再補，不能冒稱本批已全收錄。

## 驗證

- tests/portraits.test.py：783原創資產、兩河98全覆蓋、256pxRGBA／透明四角／無重複與孤立檔。
- LOCAL_FGO_TEST=1 node tests/entry-performance.mjs：私有manifest逐項載入、節點對應、來源／權利／雙語、原創保留、群組多圖、燈箱、390px與匯出不帶私有圖。可選MESO_SCREENSHOT保存自有測試截圖；不是APP實際截圖。
- 102圖項完整75767 exit0：首次新版本、真正新URL重載後284節點、首頁／妖怪保持、全附圖／手機／實際匯出隔離均通過。111版8091完整exit0；113版20864完整exit0；最後日本NPC日文來源標籤已修正，新增jaSource斷言，113最終92458完整exit0；最後新增代達羅斯114版39528完整exit0，114圖項、手機、實際匯出隔離與預覽重載全過。
- 原先55024／20379失敗的主因是測試只判query前綴，重載後可能先讀到舊文件284節點而提早結束等待，再於導航中讀到0；改比對完整目標URL後等284節點，不放寬節點斷言。另預覽去掉靜態src，避免首次無版本載入競態；忽略about:blank載入。

## 私有備份與復原

- 專案外備份：D:/YiHsiang/程式/Mythology-private-backups/fgo-local-20261024-114items-final.zip，20,317,869 bytes，114圖項、106圖檔＋manifest＋overlay共108檔。本最終版108檔已逐一SHA256核對與本機一致，不覆蓋舊備份。
- 復原時只將ZIP內fgo/放回private-media/fgo/，不得移至assets/。開localhost的tools/preview.html即可；正式index／git clone不會自帶私人圖片。
- 早期first13.zip保留可恢復，但不是本輪完整備份。
