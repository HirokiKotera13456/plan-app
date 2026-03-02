export const INITIAL_TIMELINE = [
  { sortOrder: 1, timeStart: "07:24", timeEnd: "09:36", title: "京都 → 東京", subtitle: "のぞみ72号（指定席 ¥13,970/人）", icon: "🚄", category: "transport" },
  { sortOrder: 2, timeStart: "10:02", timeEnd: "10:16", title: "東京 → 舞浜", subtitle: "京葉線快速", icon: "🚃", category: "transport" },
  { sortOrder: 3, timeStart: "10:22", timeEnd: "10:31", title: "舞浜 → ディズニーシー", subtitle: "リゾートライン", icon: "🚝", category: "transport" },
  { sortOrder: 4, timeStart: "10:31", timeEnd: "12:30", title: "パーク入園 & アトラクション", subtitle: "フリータイム", icon: "🎢", category: "attraction" },
  { sortOrder: 5, timeStart: "12:30", timeEnd: "13:30", title: "ホライズンベイレストラン", subtitle: "ランチ（2人 約¥5,700〜7,700）", icon: "🍽️", category: "meal" },
  { sortOrder: 6, timeStart: "13:30", timeEnd: "18:30", title: "アトラクション & 散策", subtitle: "メインの時間帯", icon: "✨", category: "attraction" },
  { sortOrder: 7, timeStart: "18:30", timeEnd: "20:00", title: "レストラン櫻", subtitle: "ディナー（2人 約¥6,600〜9,400）", icon: "🌸", category: "meal" },
  { sortOrder: 8, timeStart: "20:00", timeEnd: "20:30", title: "パーク撤退 → ホテル", subtitle: "閉園21時のため余裕をもって", icon: "🏨", category: "transport" },
];

export const INITIAL_CHECKLIST = [
  { sortOrder: 1, text: "新幹線 往路（のぞみ72号 京都→東京）", detail: "指定席 ¥13,970/人" },
  { sortOrder: 2, text: "新幹線 復路", detail: "指定席 ¥13,970/人（往復合計 ¥27,940/人）" },
  { sortOrder: 3, text: "ディズニーシー パークチケット", detail: "公式サイトで事前購入" },
  { sortOrder: 4, text: "ホライズンベイレストラン 予約", detail: "1週間前から予約可 / 12:30〜" },
  { sortOrder: 5, text: "レストラン櫻 予約", detail: "1週間前から予約可 / 18:30〜" },
  { sortOrder: 6, text: "ホテル予約", detail: "候補比較して決定" },
];

export const INITIAL_HOTELS = [
  { sortOrder: 1, name: "ラ・ジェント・ホテル東京ベイ", prices: { "4/11(土)": "¥35,000前後", "4/20(土)": "¥15,000前後" }, note: "ドリンクバー無料・バリュー価格" },
  { sortOrder: 2, name: "東京ベイ舞浜ホテル ファーストリゾート", prices: { "4/11(土)": "¥35,000前後", "4/20(土)": "¥20,000前後" }, note: "オフィシャルホテル・ベイサイド駅近" },
];

export const INITIAL_COSTS = [
  { sortOrder: 1, label: "新幹線（往復2人分）", amountMin: 55880, amountMax: null },
  { sortOrder: 2, label: "パークチケット（2人分）", amountMin: 16000, amountMax: null },
  { sortOrder: 3, label: "ランチ（ホライズンベイ）", amountMin: 5700, amountMax: 7700 },
  { sortOrder: 4, label: "ディナー（レストラン櫻）", amountMin: 6600, amountMax: 9400 },
  { sortOrder: 5, label: "ホテル", amountMin: 15000, amountMax: 35000 },
];
