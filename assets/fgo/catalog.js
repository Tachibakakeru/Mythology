// FGO遊戲／改編形象：來源與權利標示見各圖說，不代表神話史料。
const FGO_IMAGES = [
  {
    "key": "japan:yamatotakeru",
    "src": "assets/fgo/yamato_takeru.png",
    "name": "ヤマトタケル",
    "note": "遊戲中的日本武尊（Saber）；造型與設定屬FGO改編，不作古代形象證據。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2024/modal/2024_001.png"
  },
  {
    "key": "yokai:tamamonomae",
    "src": "assets/fgo/tamamo.png",
    "name": "玉藻の前（Caster）",
    "note": "FGO的玉藻前；遊戲性格、服裝與神靈設定不能回填為全部玉藻前傳說。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_060.png"
  },
  {
    "key": "yokai:shutendoji",
    "src": "assets/fgo/shuten.png",
    "name": "酒呑童子（Assassin）",
    "note": "FGO將酒吞童子改編為女性從者；不等同傳說所有版本。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_028.png"
  },
  {
    "key": "yokai:ibarakidoji",
    "src": "assets/fgo/ibaraki.png",
    "name": "茨木童子（Berserker）",
    "note": "FGO茨木童子；造型與性別為遊戲詮釋。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_033.png"
  },
  {
    "key": "yokai:suzukagozen",
    "src": "assets/fgo/suzuka.png",
    "name": "鈴鹿御前（Saber）",
    "note": "FGO鈴鹿御前；現代服裝等屬遊戲設定，非中世紀圖像。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2017/modal/2017_011.png"
  },
  {
    "key": "yokai:momiji",
    "src": "assets/fgo/momiji.png",
    "name": "鬼女紅葉（Berserker）",
    "note": "FGO鬼女紅葉；本圖為官方人物介紹中的人形造型，另有遊戲變化形態。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2020/modal/2020_008.png"
  },
  {
    "key": "yokai:osakabehime",
    "src": "assets/fgo/osakabe.png",
    "name": "刑部姫（Assassin）",
    "note": "FGO刑部姬；遊戲人物性格與蝙蝠等造型不當原傳說定論。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2017/modal/2017_036.png"
  },
  {
    "key": "mesopotamia:gilgamesh",
    "src": "assets/fgo/gilgamesh.png",
    "name": "ギルガメッシュ（Archer）",
    "note": "FGO吉爾伽美什；金色鎧甲與外貌為現代遊戲設定，不是烏魯克王的考古肖像。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_053.png"
  },
  {
    "key": "mesopotamia:enkidu",
    "src": "assets/fgo/enkidu.png",
    "name": "エルキドゥ（Lancer）",
    "note": "FGO恩奇都；遊戲以綠髮等形象詮釋，不取代史詩中的野人敘事。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_059.png"
  },
  {
    "key": "mesopotamia:inanna",
    "src": "assets/fgo/ishtar.png",
    "name": "イシュタル（Archer）",
    "note": "FGO伊絲塔為以人類作依代的擬似從者造型，不是所有蘇美／阿卡德傳統共用的女神外觀。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_057.png"
  },
  {
    "key": "mesopotamia:ereshkigal",
    "src": "assets/fgo/ereshkigal.png",
    "name": "エレシュキガル（Lancer）",
    "note": "FGO埃列什基伽勒採人類依代的擬似從者形象；金髮外貌與遊戲性格不作原典證據。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2017/modal/2017_044.png"
  },
  {
    "key": "mesopotamia:tiamat",
    "src": "assets/fgo/tiamat.png",
    "name": "ラーヴァ／ティアマト（Alter Ego）",
    "note": "FGO拉瓦／提亞馬特為遊戲特定分身與幼體形態；不是古巴比倫提亞馬特的公認圖像。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2023/modal/2023_008.png"
  },
  {
    "key": "mesopotamia:semiramis",
    "src": "assets/fgo/semiramis.png",
    "name": "セミラミス（Assassin）",
    "note": "FGO塞米拉米斯；長耳與服裝等為遊戲設計，空中花園關聯也須與史料及傳說區分。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2018/modal/2018_002.png"
  },
  {
    "key": "greek:herakles",
    "src": "assets/fgo/heracles.png",
    "name": "ヘラクレス（Berserker）",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_042.png",
    "note": "此為FGO的ヘラクレス（Berserker）遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:medusa",
    "src": "assets/fgo/medusa.png",
    "name": "メドゥーサ（Rider）",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_020.png",
    "note": "此為FGO的メドゥーサ（Rider）遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:medeia",
    "src": "assets/fgo/medea.png",
    "name": "メディア（Caster）",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_056.png",
    "note": "此為FGO的メディア（Caster）遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:atalante",
    "src": "assets/fgo/atalanta.png",
    "name": "アタランテ",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_054.png",
    "note": "此為FGO的アタランテ遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:hektor",
    "src": "assets/fgo/hector.png",
    "name": "ヘクトール",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_063.png",
    "note": "此為FGO的ヘクトール遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:cheiron",
    "src": "assets/fgo/chiron.png",
    "name": "ケイローン",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2018/modal/2018_009.png",
    "note": "此為FGO的ケイローン遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:achilleus",
    "src": "assets/fgo/achilles.png",
    "name": "アキレウス",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2018/modal/2018_010.png",
    "note": "此為FGO的アキレウス遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:kirke",
    "src": "assets/fgo/circe.png",
    "name": "キルケー",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2017/modal/2017_040.png",
    "note": "此為FGO的キルケー遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:penthesileia",
    "src": "assets/fgo/penthesilea.png",
    "name": "ペンテシレイア",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2017/modal/2017_019.png",
    "note": "此為FGO的ペンテシレイア遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:asklepios",
    "src": "assets/fgo/asclepius.png",
    "name": "アスクレピオス",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_014.png",
    "note": "此為FGO的アスクレピオス遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:jason",
    "src": "assets/fgo/jason.png",
    "name": "イアソン",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_019.png",
    "note": "此為FGO的イアソン遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:paris",
    "src": "assets/fgo/paris.png",
    "name": "パリス",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_020.png",
    "note": "此為FGO的パリス遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:europa",
    "src": "assets/fgo/europa.png",
    "name": "エウロペ",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_039.png",
    "note": "此為FGO的エウロペ遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:odysseus",
    "src": "assets/fgo/odysseus.png",
    "name": "オデュッセウス",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2020/modal/2020_003.png",
    "note": "此為FGO的オデュッセウス遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:theseus",
    "src": "assets/fgo/theseus.png",
    "name": "テセウス",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2023/modal/2023_028.png",
    "note": "此為FGO的テセウス遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:andromeda",
    "src": "assets/fgo/andromeda.png",
    "name": "アンドロメダ",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2024/modal/2024_005.png",
    "note": "此為FGO的アンドロメダ遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:hippolyte",
    "src": "assets/fgo/hippolyte.png",
    "name": "ヒッポリュテ",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2026/modal/2026_007.png",
    "note": "此為FGO的ヒッポリュテ遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:demeter",
    "src": "assets/fgo/demeter.png",
    "name": "デメテル",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2026/modal/2026_005.png",
    "note": "此為FGO的デメテル遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:orion",
    "src": "assets/fgo/super_orion.png",
    "name": "超人オリオン",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_038.png",
    "note": "此為FGO的超人オリオン遊戲改編形象；服裝、年齡、性格與設定不作古代史料或原典一致形象。"
  },
  {
    "key": "greek:artemis",
    "src": "assets/fgo/orion_artemis.png",
    "name": "オリオン（アルテミスが主に顕現）",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_058.png",
    "note": "官方名義為俄里翁，圖中主要女性為阿耳忒彌斯、玩偶為俄里翁；這是FGO特殊召喚設定，不是神話共同形象。"
  },
  {
    "key": "greek:minotauros",
    "src": "assets/fgo/asterios.png",
    "name": "アステリオス",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_050.png",
    "note": "FGO以阿斯忒里俄斯之名呈現迷宮中的彌諾陶洛斯；遊戲的人格與造型不代表全部古代版本。"
  },
  {
    "key": "greek:polydeukes",
    "src": "assets/fgo/dioscuri.png",
    "name": "ディオスクロイ",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2020/modal/2020_004.png",
    "note": "FGO以狄俄斯庫洛伊雙子共同登場；圖中兩位為卡斯托耳與波呂丟刻斯，不把共同角色圖當單一人的外貌。"
  },
  {
    "key": "greek:kastor",
    "src": "assets/fgo/dioscuri.png",
    "name": "ディオスクロイ",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2020/modal/2020_004.png",
    "note": "FGO以狄俄斯庫洛伊雙子共同登場；圖中兩位為卡斯托耳與波呂丟刻斯，不把共同角色圖當單一人的外貌。"
  },
  {
    "key": "norse:thrud",
    "src": "assets/fgo/valkyrie_thrud.png",
    "name": "スルーズ（Assassin）",
    "note": "此為FGO女武神斯露德，不是其餘女武神的共同形象；遊戲設定不等於所有北歐傳承。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2022/modal/2022_022.png"
  },
  {
    "key": "norse:valkyrjur_note",
    "src": "assets/fgo/valkyries.png",
    "name": "ワルキューレ",
    "note": "FGO女武神之一奧特琳德的代表圖；不是女武神全體成員的合照或北歐傳統的共同形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2018/modal/2018_017.png"
  },
  {
    "key": "norse:skadi",
    "src": "assets/fgo/skadi.png",
    "name": "スカサハ＝スカディ",
    "note": "FGO採斯卡塔赫外貌與斯卡蒂結合的特殊靈基；此圖不是北歐斯卡蒂的歷史形象，也不等同凱爾特斯卡塔赫本人。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2018/modal/2018_018.png"
  },
  {
    "key": "norse:sigurd",
    "src": "assets/fgo/sigurd.png",
    "name": "シグルド",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2018/modal/2018_016.png"
  },
  {
    "key": "norse:brynhild",
    "src": "assets/fgo/brynhildr.png",
    "name": "ブリュンヒルデ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_004.png"
  },
  {
    "key": "celtic:cu_chulainn",
    "src": "assets/fgo/cu_chulainn.png",
    "name": "クー･フーリン（Lancer）",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_014.png"
  },
  {
    "key": "celtic:scathach",
    "src": "assets/fgo/scathach.png",
    "name": "スカサハ（Lancer）",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_071.png"
  },
  {
    "key": "celtic:fergus",
    "src": "assets/fgo/fergus.png",
    "name": "フェルグス･マック･ロイ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_070.png"
  },
  {
    "key": "celtic:medb",
    "src": "assets/fgo/medb.png",
    "name": "女王メイヴ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_017.png"
  },
  {
    "key": "celtic:diarmuid",
    "src": "assets/fgo/diarmuid.png",
    "name": "ディルムッド･オディナ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_072.png"
  },
  {
    "key": "celtic:fionn",
    "src": "assets/fgo/fionn.png",
    "name": "フィン･マックール",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_005.png"
  },
  {
    "key": "celtic:manannan",
    "src": "assets/fgo/manannan.png",
    "name": "マナナン･マク･リール〔バゼット〕",
    "note": "FGO為以巴潔特作為依代的擬似從者，畫中人類外貌不代表愛爾蘭海神的古代形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2022/modal/2022_003.png"
  },
  {
    "key": "arthurian:arthur",
    "src": "assets/fgo/arthur.png",
    "name": "アーサー･ペンドラゴン〔プロトタイプ〕",
    "note": "此處採FGO《Prototype》系的男性亞瑟。FGO另有女性阿爾托莉雅版本；兩者都是遊戲改編，不能倒灌原典性別與家譜。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2017/modal/2017_008.png"
  },
  {
    "key": "arthurian:merlin",
    "src": "assets/fgo/merlin.png",
    "name": "マーリン",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_065.png"
  },
  {
    "key": "arthurian:morgan",
    "src": "assets/fgo/morgan.png",
    "name": "モルガン",
    "note": "FGO的摩根含異聞帶及遊戲獨有世界觀設定，不等同本頁所有亞瑟文本的綜合傳記。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2021/modal/2021_010.png"
  },
  {
    "key": "arthurian:mordred",
    "src": "assets/fgo/mordred.png",
    "name": "モードレッド",
    "note": "FGO將莫德雷德改編為女性；其造型、誕生與性格設定不能取代中世紀傳說。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_076.png"
  },
  {
    "key": "arthurian:lancelot",
    "src": "assets/fgo/lancelot.png",
    "name": "ランスロット（Saber）",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_035.png"
  },
  {
    "key": "arthurian:gawain",
    "src": "assets/fgo/gawain.png",
    "name": "ガウェイン",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_034.png"
  },
  {
    "key": "arthurian:gareth",
    "src": "assets/fgo/gareth.png",
    "name": "ガレス（Lancer）",
    "note": "FGO將加雷斯改編為女性，遊戲設定與本頁文學爵士人物分層閱讀。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_021.png"
  },
  {
    "key": "arthurian:bedivere",
    "src": "assets/fgo/bedivere.png",
    "name": "ベディヴィエール",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_036.png"
  },
  {
    "key": "arthurian:tristan",
    "src": "assets/fgo/tristan.png",
    "name": "トリスタン",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_037.png"
  },
  {
    "key": "arthurian:perceval",
    "src": "assets/fgo/percival.png",
    "name": "パーシヴァル",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2021/modal/2021_012.png"
  },
  {
    "key": "india:parvati",
    "src": "assets/fgo/parvati.png",
    "name": "パールヴァティー",
    "note": "FGO以人類間桐櫻為依代的擬似從者；不是印度寺院或經典一致認定的帕爾瓦蒂形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2017/modal/2017_030.png"
  },
  {
    "key": "india:ganesha",
    "src": "assets/fgo/ganesha.png",
    "name": "ジナコ＝カリギリ（大いなる石像神）",
    "note": "FGO以吉娜可為依代的伽內什擬似從者，圖中人形與遊戲石像設定不能直接當印度象頭神傳統圖像。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_012.png"
  },
  {
    "key": "india:durga",
    "src": "assets/fgo/durga.png",
    "name": "ドゥルガー",
    "note": "FGO遊戲的難近母靈基與依代外貌，不是印度宗教各派一致的杜爾迦形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2023/modal/2023_015.png"
  },
  {
    "key": "india:indra",
    "src": "assets/fgo/indra.png",
    "name": "インドラ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2025/modal/2025_010.png"
  },
  {
    "key": "india:rama",
    "src": "assets/fgo/rama.png",
    "name": "ラーマ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_014.png"
  },
  {
    "key": "india:arjuna",
    "src": "assets/fgo/arjuna.png",
    "name": "アルジュナ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_001.png"
  },
  {
    "key": "india:karna",
    "src": "assets/fgo/karna.png",
    "name": "カルナ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_002.png"
  },
  {
    "key": "india:bhima",
    "src": "assets/fgo/bhima.png",
    "name": "ビーマ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2023/modal/2023_013.png"
  },
  {
    "key": "india:duryodhana",
    "src": "assets/fgo/duryodhana.png",
    "name": "ドゥリーヨダナ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2023/modal/2023_014.png"
  },
  {
    "key": "buddhism:xuanzang",
    "src": "assets/fgo/xuanzang.png",
    "name": "玄奘三蔵",
    "note": "FGO將玄奘三藏改編為女性；遊戲取材含小說與創作，不能當歷史譯師玄奘的真實外貌與行旅史料。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_029.png"
  },
  {
    "key": "buddhism:ashoka",
    "src": "assets/fgo/ashoka.png",
    "name": "アショカ王",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2025/modal/2025_006.png"
  },
  {
    "key": "china:jiang_ziya",
    "src": "assets/fgo/taigongwang.png",
    "name": "太公望",
    "note": "FGO太公望是姜子牙傳說的遊戲改編，不以遊戲仙術設定當周初歷史或所有《封神》版本共識。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2021/modal/2021_030.png"
  },
  {
    "key": "china:nezha",
    "src": "assets/fgo/nezha.png",
    "name": "哪吒",
    "note": "FGO的哪吒遊戲造型，性別與身體設定不是《封神演義》與民間神像的一致形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2017/modal/2017_039.png"
  },
  {
    "key": "china:huangfeihu_fengshen",
    "src": "assets/fgo/huangfeihu.png",
    "name": "黄飛虎",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2022/modal/2022_032.png"
  },
  {
    "key": "demons:lilith",
    "src": "assets/fgo/lilith.png",
    "name": "リリス（Berserker）",
    "note": "FGO莉莉絲的遊戲改編外貌與人物設定，不是《以賽亞書》、中世紀或所有猶太傳承公認的形象；不回貼兩河莉莉圖。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2025/modal/2025_008.png"
  },
  {
    "key": "maya:my_kukulkan",
    "src": "assets/fgo/kukulkan.png",
    "name": "ククルカン",
    "note": "FGO庫庫爾坎取材瑪雅羽蛇神之名，但遊戲為異聞帶／ORT關聯的獨有設定；不等於基切古庫馬茲，也不當猶加敦神話史料。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2023/modal/2023_005.png"
  },
  {
    "key": "aztec:az_quetzalcoatl",
    "src": "assets/fgo/quetzalcoatl.png",
    "name": "ケツァル･コアトル",
    "note": "FGO的羽蛇神女性靈基與宇宙設定為遊戲改編，不當納瓦傳統定型神像。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_062.png"
  },
  {
    "key": "aztec:az_tezcatlipoca",
    "src": "assets/fgo/tezcatlipoca.png",
    "name": "テスカトリポカ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2023/modal/2023_003.png"
  },
  {
    "key": "aztec:az_tlaloc",
    "src": "assets/fgo/tlaloc.png",
    "name": "テノチティトラン（トラロック）",
    "note": "FGO遊戲把特諾奇蒂特蘭／特拉洛克等身分複合呈現，不是本頁雨神傳承或城市的史料圖像。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2023/modal/2023_004.png"
  },
  {
    "key": "nibelungen:nb_siegfried",
    "src": "assets/fgo/siegfried.png",
    "name": "ジークフリート",
    "note": "FGO齊格飛的遊戲設定；不把北歐西格爾德或遊戲齊格直接當《尼伯龍根之歌》的同一版本。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_006.png"
  },
  {
    "key": "nibelungen:nb_kriemhild",
    "src": "assets/fgo/kriemhild.png",
    "name": "クリームヒルト（Berserker）",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2022/modal/2022_012.png"
  },
  {
    "key": "roland:rl_charlemagne",
    "src": "assets/fgo/charlemagne.png",
    "name": "シャルルマーニュ",
    "note": "FGO偏重浪漫傳奇英雄面的查理曼，不作史傳皇帝肖像或歷史十二同儕名單佐證。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2022/modal/2022_010.png"
  },
  {
    "key": "roland:rl_roland",
    "src": "assets/fgo/roland.png",
    "name": "ローラン",
    "note": "FGO羅蘭的遊戲形象，法國武功歌與義大利浪漫史詩版本不能因此合成史實；不貼史傳羅蘭節點。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2022/modal/2022_011.png"
  },
  {
    "key": "roland:rl_bradamante",
    "src": "assets/fgo/bradamante.png",
    "name": "ブラダマンテ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2018/modal/2018_035.png"
  },
  {
    "key": "roland:rl_astolfo",
    "src": "assets/fgo/astolfo.png",
    "name": "アストルフォ（Rider）",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_011.png"
  },
  {
    "key": "beowulf:bw_beowulf",
    "src": "assets/fgo/beowulf.png",
    "name": "ベオウルフ",
    "note": "FGO主角貝奧武夫的改編圖；不貼丹麥王系中的Beow同名人物。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_006.png"
  },
  {
    "key": "robinhood:rh_robin",
    "src": "assets/fgo/robinhood.png",
    "name": "ロビンフッド",
    "note": "FGO以無名綠林英雄作為羅賓漢的遊戲詮釋，不是所有歌謠與小說版本一致的歷史人物。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_011.png"
  },
  {
    "key": "tell:tl_tell",
    "src": "assets/fgo/william_tell.png",
    "name": "ウィリアム･テル",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_011.png"
  },
  {
    "key": "yoshitsune:ys_yoshitsune",
    "src": "assets/fgo/ushiwakamaru.png",
    "name": "牛若丸（Rider）",
    "note": "FGO以女性牛若丸改編源義經少年形象，不當歷史人物真實外貌；不以平景清混合靈基取代義經。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_022.png"
  },
  {
    "key": "yoshitsune:ys_kiichi",
    "src": "assets/fgo/kiichi.png",
    "name": "鬼一法眼",
    "note": "FGO鬼一法眼的性別、天狗與身分解釋是遊戲設定，不取代《義經記》卷二法眼與鞍馬天狗的不同傳承。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2021/modal/2021_002.png"
  },
  {
    "key": "kalevala:kv_louhi",
    "src": "assets/fgo/louhi.png",
    "name": "ロウヒ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2024/modal/2024_025.png"
  },
  {
    "key": "ulster:ul_cu",
    "src": "assets/fgo/cu_chulainn.png",
    "name": "クー･フーリン（Lancer）",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_014.png"
  },
  {
    "key": "ulster:ul_scathach",
    "src": "assets/fgo/scathach.png",
    "name": "スカサハ（Lancer）",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_071.png"
  },
  {
    "key": "ulster:ul_medb",
    "src": "assets/fgo/medb.png",
    "name": "女王メイヴ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_017.png"
  },
  {
    "key": "ulster:ul_fergus",
    "src": "assets/fgo/fergus.png",
    "name": "フェルグス･マック･ロイ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_070.png"
  },
  {
    "key": "fianna:fn_fionn",
    "src": "assets/fgo/fionn.png",
    "name": "フィン･マックール",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2016/modal/2016_005.png"
  },
  {
    "key": "fianna:fn_diarmuid",
    "src": "assets/fgo/diarmuid.png",
    "name": "ディルムッド･オディナ",
    "note": "FGO的同名傳說／宗教人物改編；遊戲服裝、性別、年齡與設定不是原典或歷史人物定型。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_072.png"
  },
  {
    "key": "greek:gorgones_note",
    "src": "assets/fgo/stheno.png",
    "name": "ステンノ",
    "note": "FGO戈耳工姊妹之一的ステンノ；此為遊戲改編人物，不代表兩姊妹全部的共同形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_033.png"
  },
  {
    "key": "greek:gorgones_note",
    "src": "assets/fgo/euryale.png",
    "name": "エウリュアレ",
    "note": "FGO戈耳工姊妹之一的エウリュアレ；此為遊戲改編人物，不代表兩姊妹全部的共同形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2015/modal/2015_067.png"
  },
  {
    "key": "norse:norns_note",
    "src": "assets/fgo/urd.png",
    "name": "ウルズ（終末のアーチャー）",
    "note": "FGO取材諾恩之一烏爾德的遊戲角色；此圖僅為群組中的烏爾德，不是三位諾恩完整合照或古代共同形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2026/modal/2026_010.png"
  },
  {
    "key": "angels:metatron",
    "src": "assets/fgo/metatron_jeanne.png",
    "name": "メタトロン･ジャンヌ",
    "note": "FGO的梅塔特隆・貞德是天使與貞德相關的遊戲複合設定，不是純粹天使本尊的宗教圖像，亦不代表猶太神秘傳統公認形象。",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2025/modal/2025_007.png"
  },
  {
    "key": "greek:aphrodite",
    "src": "assets/fgo/aphrodite.png",
    "name": "アフロディーテ（異聞帶人形端末）",
    "note": "FGO異聞帶奧林帕斯機神的人形端末立繪，經TYPE-MOON Wiki轉載；不是希臘神話宗教定型或官方角色圖鑑原檔，未把遊戲機神家譜回填原典。",
    "source": "https://typemoon.fandom.com/wiki/Aphrodite_(Lostbelt)",
    "sourceLabel": "FGO原遊戲立繪（Wiki轉載）：",
    "imageSource": "https://static.wikia.nocookie.net/typemoon/images/c/c6/Aphrodite.png/revision/latest?cb=20250712204906"
  },
  {
    "key": "greek:zeus",
    "src": "assets/fgo/zeus_azusa.jpg",
    "name": "ゼウス（Azusa公開插畫）",
    "note": "宙斯設計者Azusa於2020-04-20公開的FGO賀圖，報導附原貼連結；這不是遊戲立繪截圖、不是古代神像。繪師：Azusa；原貼 https://twitter.com/Azusa1019/status/1252258471635898369 。",
    "source": "https://demonition.com/blog-entry-65572.html",
    "sourceLabel": "FGO繪師Azusa公開圖（報導附原貼）：",
    "imageSource": "https://demonition.com/wp/wp-content/uploads/2020/04/EWDp2SfUwAA7kgO.jpg"
  },
  {
    "key": "mesopotamia:siduri",
    "src": "assets/fgo/siduri_anime.png",
    "name": "シドゥリ（FGO改編動畫官方人設）",
    "note": "FGO改編動畫《絕對魔獸戰線巴比倫尼亞》官方人物圖，不是遊戲原立繪。FGO把史詩的酒館女主人改編為烏魯克祭司長／王的輔佐，不能把這一職分回填古代原典。",
    "source": "https://anime.fate-go.us/ep7-tv/character/?chara=siduri",
    "sourceLabel": "FGO動畫官方人設：",
    "rights": "©TYPE-MOON / FGO7 ANIME PROJECT",
    "imageSource": "https://anime.fate-go.us/ep7-tv/assets/img/character/stand/img_stand_siduri.png"
  },
  {
    "key": "japan:hoderi",
    "name": "海幸彦（NPC）",
    "src": "assets/fgo/umisachihiko_npc.jpg",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2022/03/183c62d21f6d78b101f1cd5dddbca313.jpg",
    "note": "FGO「踊るドラゴンキャッスル」中的海幸彥NPC；遊戲截圖片段，非古代形象。神話的兄弟排序與別名仍依原典分列，不回填遊戲設定。",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "mesopotamia:dumuzi",
    "name": "ドゥムジ（NPC）",
    "src": "assets/fgo/dumuzi_npc.webp",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2023/02/b9baaf1a802272aabda68682cf98ea3a.webp",
    "note": "FGO杜姆茲在第二部第七章出現的人形NPC；本圖為攻略站轉載遊戲截圖片段，不是其羊形全圖，也不作蘇美古代神像證據。",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "india:sita",
    "name": "シータ（NPC）",
    "src": "assets/fgo/sita_npc.webp",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2022/09/3829a0cb5b82636f0d3c55b1f8d6ccd2.webp",
    "note": "FGO悉多NPC的遊戲截圖片段；遊戲的羅摩與悉多設定不當成《羅摩衍那》各版本共識。",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "arthurian:agravain",
    "name": "アグラヴェイン（NPC）",
    "src": "assets/fgo/agravain_npc.webp",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2022/09/ffd9cd565c89e000ead07bbb8e04c774.webp",
    "note": "FGO阿格拉瓦因NPC的遊戲截圖片段；不是史傳人物肖像，遊戲與亞瑟文學的家譜或事蹟不能互相回填。",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "greek:charon",
    "name": "カロン（NPC）",
    "src": "assets/fgo/charon_npc.webp",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2023/12/90db01158511a2a0ad21dd1e71290157.webp",
    "note": "FGO卡戎NPC的遊戲截圖片段；冥河渡者Charon，非喀戎Chiron。造型為現代遊戲詮釋。",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "maya:my_camazotz",
    "name": "カマソッソ（NPC）",
    "src": "assets/fgo/camazotz_npc.webp",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2022/12/72b0d73a312e9cf21dbee1123282e9ee.webp",
    "note": "FGO卡馬索茨NPC的遊戲截圖片段；異聞帶角色經歷屬遊戲創作，不回填《波波爾・烏》蝙蝠屋故事。",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "greek:persephone",
    "name": "ペルセポネ（NPC）",
    "src": "assets/fgo/persephone_npc.webp",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2026/07/204755_yne7c.webp",
    "note": "FGO珀耳塞福涅NPC的遊戲截圖片段；攻略來源記錄2026活動登場，造型非古代希臘形象。",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "arthurian:galahad",
    "name": "ギャラハッド（NPC）",
    "src": "assets/fgo/galahad_npc.webp",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2025/02/114037_bkiys.webp",
    "note": "FGO加拉哈德NPC的遊戲截圖片段；圖中白髮青年為加拉哈德，不直接以瑪修形象替代他，也不把遊戲設定當成聖杯文學原典。",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "greek:apollon",
    "src": "assets/fgo/paris.png",
    "name": "アポロン（パリスと共に）",
    "source": "https://www.fate-go.jp/trajectory/servant/",
    "imageSource": "https://www.fate-go.jp/trajectory/assets/images/servant/2019/modal/2019_020.png",
    "note": "FGO阿波羅採少年帕里斯頭上的白羊形象；少年是帕里斯，不是阿波羅本人。此共同介紹圖的羊形化身屬遊戲設定，非古代希臘定型。",
    "identitySource": "https://typemoon.wiki.cre.jp/wiki/%E3%82%A2%E3%83%9D%E3%83%AD%E3%83%B3",
    "checkedAt": "2026-10-24 16:44:08 +08:00"
  },
  {
    "key": "greek:zeus",
    "name": "ゼウス（NPC・人型端末）",
    "src": "assets/fgo/zeus_npc.webp",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2022/09/b52190ac3080a7e8e78643999023a73f.webp",
    "note": "FGO宙斯人型端末的遊戲截圖片段；與Azusa公開賀圖分列，本圖不是機神本體全貌，也不是古代宙斯神像。",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "checkedAt": "2026-10-24 16:49:56 +08:00"
  },
  {
    "key": "norse:norns_note",
    "name": "ヴェルザンディ（NPC）",
    "src": "assets/fgo/verdandi_npc.webp",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2026/08/FGO_177.webp",
    "note": "FGO薇兒丹蒂（現在）的NPC遊戲截圖片段；只代表諾恩三女神的一位，不是三人合照。另圖烏爾德是另一位姊妹，遊戲活動設定不回填北歐原典。",
    "identitySource": "https://appmedia.jp/fategrandorder/80328025",
    "source": "https://appmedia.jp/fategrandorder/2427886",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "checkedAt": "2026-10-24 16:49:56 +08:00"
  },
  {
    "key": "greek:daidalos",
    "name": "ダイダロス（機械の巨腕）",
    "src": "assets/fgo/daidalos_npc.webp",
    "source": "https://appmedia.jp/fategrandorder/78312266",
    "sourceLabel": "AppMedia轉載・FGO遊戲截圖：",
    "imageSource": "https://appmedia.jp/wp-content/uploads/2024/11/204536_yfi3w.webp",
    "note": "FGO代達羅斯的機械巨臂NPC形象截圖；這個手臂才是代達羅斯的遊戲形態，不是侍從人偶娜烏克拉忒本人。此機械化設定不回填希臘工匠傳說。",
    "checkedAt": "2026-10-24 16:59:09 +08:00"
  }
];
const FGO_IMAGE_SOURCES=new Set(["https://www.fate-go.jp/trajectory/servant/","https://typemoon.fandom.com/wiki/Aphrodite_(Lostbelt)","https://demonition.com/blog-entry-65572.html","https://anime.fate-go.us/ep7-tv/character/?chara=siduri","https://appmedia.jp/fategrandorder/2427886","https://appmedia.jp/fategrandorder/78312266"]);
function appendFgoFigures(key,figs){
  if(!figs)return;
  const ja=(key.startsWith('japan:')||key.startsWith('yokai:'))&&japanLocale==='ja';
  for(const im of FGO_IMAGES.filter(item=>item.key===key&&/^[a-z]+:[a-z0-9_]+$/.test(item.key)&&/^assets\/fgo\/[a-z0-9_-]+\.(?:png|jpg|webp)$/.test(item.src)&&FGO_IMAGE_SOURCES.has(item.source))){
    const figure=document.createElement('figure'),image=document.createElement('img');
    figure.dataset.fgo='comparison';
    image.src=im.src;image.alt='Fate/Grand Order：'+im.name;image.loading='lazy';image.decoding='async';
    const rights=im.rights||'©TYPE-MOON / FGO PROJECT';
    image.dataset.cap=(ja?'FGOのゲーム内解釈・史料図像ではありません。':'FGO遊戲／改編形象・非史料。')+im.name+'｜'+rights;
    const caption=document.createElement('figcaption'),link=document.createElement('a');
    link.href=im.source;link.target='_blank';link.rel='noopener noreferrer';
    link.textContent=(ja?(im.sourceLabelJa||(im.sourceLabel?'FGO参照画像：':'FGO公式キャラクター紹介：')):(im.sourceLabel||'FGO官方角色介紹：'))+im.name;
    link.style.color='var(--blue,#66baff)';link.style.textDecoration='none';
    caption.append(link,document.createElement('br'),ja?'ゲームの設定は神話の原典とは異なります。':im.note,document.createElement('br'),rights);
    figure.append(image,caption);figs.append(figure);figs.style.display='flex';
    image.addEventListener('error',()=>figure.remove(),{once:true});
  }
}

