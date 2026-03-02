# Disney Sea Trip Planner - 要件定義書

## 1. プロジェクト概要

### アプリ名
Sea Trip Planner（仮）

### 目的
カップル2人でディズニーシー旅行を共同で計画・管理するためのWebアプリケーション。リアルタイムで同期され、旅行前の準備から当日のスケジュール管理まで一貫して使えるツール。

### ターゲットユーザー
- 2人（カップル）での利用を想定
- スマートフォンでの利用がメイン（レスポンシブ対応必須）

### 技術スタック
- **フロントエンド**: Next.js (Pages Router) + TypeScript
- **UI**: MUI (Material UI) + Emotion
- **バックエンド/DB**: Firebase (Firestore + Authentication)
- **データ取得**: getDocs / getDoc（リアルタイム同期不要、CRUD後に手動refetch）
- **デプロイ**: Firebase Hosting
- **パッケージマネージャ**: pnpm

### Firebase を選定した理由
- Firestore の NoSQL 構造により、スキーマ定義不要で柔軟にデータ構造を変更可能
- getDocs/getDoc でシンプルにデータ取得、CRUD操作後はrefetchで再取得
- Firebase Authentication のセットアップが簡潔
- 2人利用の小規模アプリなので、Firestore の無料枠内で十分運用可能

---

## 2. 機能一覧

### 2.1 認証機能
- Firebase Authentication によるメール/パスワード認証
- Google アカウントでのログイン（optional）
- ログイン / サインアップ画面
- 招待リンクによるトリップ共有（2人目のユーザーが参加可能）

### 2.2 トリップ管理
- トリップの作成（旅行名、旅行日を設定）
- 旅行日までのカウントダウン表示
- トリップの編集・削除
- 共有リンク生成（招待コードによるURL）

### 2.3 タイムライン機能（メイン機能）

#### 機能詳細
- タイムラインの一覧表示（sortOrder 順）
- すべてのフィールドをインライン編集可能
  - 開始時刻 / 終了時刻
  - タイトル / サブタイトル
  - アイコン（絵文字ピッカーまたは直接入力）
  - カテゴリ（移動 / 遊び / 食事）
  - メモ
- 完了/未完了のトグル
- 新しい予定の追加
- 予定の削除
- ドラッグ&ドロップによる並び替え（nice to have）
- カテゴリ別の色分け表示
  - transport（移動）: 青系
  - attraction（遊び）: オレンジ系
  - meal（食事）: ピンク/コーラル系
- **データ同期**: CRUD操作後にrefetchで最新データを取得

### 2.4 チェックリスト機能（予約管理）

#### 機能詳細
- 予約が必要なもののみに絞ったチェックリスト
- チェック状態のトグル（CRUD後refetch）
- 担当者の割り当て（ドロップダウンでトリップ参加者から選択）
- 進捗バー（完了数/全体数）
- 項目の追加・編集・削除

### 2.5 ホテル比較機能

#### 機能詳細
- ホテル候補のテーブル表示
- 日程ごとの料金比較
- ホテル候補の追加・編集・削除
- おすすめ表示（最安値ハイライトなど）

### 2.6 費用サマリー

#### 機能詳細
- 費用項目の一覧表示
- 合計金額の自動計算（レンジ表示対応）
- 項目の追加・編集・削除

---

## 3. 画面構成

### 3.1 認証画面
- `/login` - ログイン / サインアップ
- シンプルなフォーム（メール + パスワード）
- Google ログインボタン（optional）

### 3.2 トリップ一覧
- `/` - トリップ一覧（将来的に複数トリップ対応）
- トリップ作成ボタン

### 3.3 トリップ詳細（メイン画面）
- `/trip/[id]` - トリップ詳細
- ヘッダー: トリップ名、旅行日（常時編集可能）、カウントダウン、進捗サマリー
- タブ切り替え:
  - **タイムライン**: スケジュール管理
  - **予約チェック**: チェックリスト + ホテル比較 + 費用サマリー

### 3.4 招待受理
- `/invite/[code]` - 招待リンクからの参加フロー

---

## 4. デザイン仕様

### カラーパレット
```
DEEP_NAVY:   #0A1628  -- ヘッダー背景、メインテキスト
DISNEY_GOLD: #C9A84C  -- アクセント、カウントダウン
SEA_TEAL:    #1A6B7A  -- セカンダリアクセント
WARM_SAND:   #F5F0E8  -- コンテンツ背景
CORAL:       #E8725C  -- 食事カテゴリ、強調
```

### フォント
- 見出し: Playfair Display (serif)
- 本文: Noto Sans JP
- 数値/時刻: JetBrains Mono (monospace)

### レスポンシブ
- モバイルファースト設計
- ブレークポイント: sm(640px), md(768px), lg(1024px)
- タブレット以上では2カラムレイアウトも検討

---

## 5. Firestore データ設計

### コレクション構造

```
trips/{tripId}
│
├── [ドキュメントフィールド]
│   ├── name: string                  // "ディズニーシー旅行"
│   ├── tripDate: string              // "2026-04-11" (ISO形式)
│   ├── inviteCode: string            // ランダム生成の招待コード
│   ├── createdBy: string             // Firebase Auth UID
│   ├── memberIds: string[]           // メンバーの UID 配列（セキュリティルール用）
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── members/{userId}                  // サブコレクション
│   ├── displayName: string           // "浩揮"
│   ├── role: string                  // "owner" | "member"
│   └── joinedAt: Timestamp
│
├── timeline/{itemId}                 // サブコレクション
│   ├── timeStart: string             // "07:24"
│   ├── timeEnd: string               // "09:36"
│   ├── title: string                 // "京都 → 東京"
│   ├── subtitle: string              // "のぞみ72号（指定席 ¥13,970/人）"
│   ├── icon: string                  // "🚄"
│   ├── category: string              // "transport" | "attraction" | "meal"
│   ├── note: string                  // 自由メモ
│   ├── isDone: boolean               // 完了チェック
│   ├── sortOrder: number             // 表示順
│   ├── createdBy: string             // UID
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── checklist/{itemId}                // サブコレクション
│   ├── text: string                  // "新幹線 往路（のぞみ72号 京都→東京）"
│   ├── detail: string                // "指定席 ¥13,970/人"
│   ├── isChecked: boolean
│   ├── assignee: string              // 担当者名（空文字可）
│   ├── sortOrder: number
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── hotels/{hotelId}                  // サブコレクション
│   ├── name: string                  // "ラ・ジェント・ホテル東京ベイ"
│   ├── note: string                  // "ドリンクバー無料・バリュー価格"
│   ├── prices: Map<string, string>   // { "4/11(土)": "¥35,000前後", "4/20(土)": "¥15,000前後" }
│   ├── sortOrder: number
│   └── createdAt: Timestamp
│
└── costs/{costId}                    // サブコレクション
    ├── label: string                 // "新幹線（往復2人分）"
    ├── amountMin: number             // 55880
    ├── amountMax: number | null      // null の場合は amountMin のみ表示
    ├── sortOrder: number
    └── createdAt: Timestamp
```

### 設計ポイント
- **サブコレクション方式**: トリップ配下にすべてのデータをサブコレクションとして配置。セキュリティルールがシンプルになり、`getDocs`/`getDoc` でコレクション単位のデータ取得が容易
- **memberIds 配列**: trips ドキュメントに `memberIds` を持たせることで、セキュリティルールで `request.auth.uid in resource.data.memberIds` の1行でアクセス制御可能
- **hotels の prices**: サブコレクションではなく Map フィールドとして保持。ホテル1件あたりの日程数は少ないため、ドキュメント内に収めるほうが効率的
- **sortOrder**: 並び替え用のフィールド。クエリで `orderBy("sortOrder")` を使用

---

## 6. Firestore セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ヘルパー関数: トリップメンバーかどうか判定
    function isTripMember(tripId) {
      return request.auth != null
        && request.auth.uid in get(/databases/$(database)/documents/trips/$(tripId)).data.memberIds;
    }

    // ヘルパー関数: トリップオーナーかどうか判定
    function isTripOwner(tripId) {
      return request.auth != null
        && request.auth.uid == get(/databases/$(database)/documents/trips/$(tripId)).data.createdBy;
    }

    // trips コレクション
    match /trips/{tripId} {
      // メンバーは閲覧・編集可能
      allow read, update: if isTripMember(tripId);
      // 認証済みユーザーは作成可能
      allow create: if request.auth != null;
      // オーナーのみ削除可能
      allow delete: if isTripOwner(tripId);

      // サブコレクション共通: メンバーのみ CRUD 可能
      match /members/{memberId} {
        allow read: if isTripMember(tripId);
        allow write: if isTripMember(tripId);
      }

      match /timeline/{itemId} {
        allow read, write: if isTripMember(tripId);
      }

      match /checklist/{itemId} {
        allow read, write: if isTripMember(tripId);
      }

      match /hotels/{hotelId} {
        allow read, write: if isTripMember(tripId);
      }

      match /costs/{costId} {
        allow read, write: if isTripMember(tripId);
      }
    }

    // 招待コードによるトリップ検索用（inviteCode でクエリ可能にする）
    match /trips/{tripId} {
      allow list: if request.auth != null
        && request.query.limit <= 1
        && resource.data.inviteCode == request.query.filters.inviteCode;
    }
  }
}
```

---

## 7. Firebase 初期化・設定

### firebase.ts
```typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 環境変数 (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 8. データ取得パターン（getDocs ベース）

### カスタムフック例: useTimeline
```typescript
import { useCallback, useEffect, useState } from "react";
import {
  collection, query, orderBy, getDocs,
  doc, addDoc, updateDoc, deleteDoc, Timestamp
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { TimelineItem } from "@/src/lib/types";

export function useTimeline(tripId: string) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const ref = collection(db, "trips", tripId, "timeline");
    const q = query(ref, orderBy("sortOrder"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as TimelineItem[];
    setItems(data);
    setLoading(false);
  }, [tripId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = async (item: Omit<TimelineItem, "id">) => {
    const ref = collection(db, "trips", tripId, "timeline");
    await addDoc(ref, { ...item, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    await fetchItems(); // refetch
  };

  const updateItem = async (itemId: string, updates: Partial<TimelineItem>) => {
    const ref = doc(db, "trips", tripId, "timeline", itemId);
    await updateDoc(ref, { ...updates, updatedAt: Timestamp.now() });
    await fetchItems(); // refetch
  };

  const deleteItem = async (itemId: string) => {
    const ref = doc(db, "trips", tripId, "timeline", itemId);
    await deleteDoc(ref);
    await fetchItems(); // refetch
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}
```

### 他のサブコレクションも同様のパターンで実装
- `useChecklist(tripId)` → checklist サブコレクション
- `useHotels(tripId)` → hotels サブコレクション
- `useCosts(tripId)` → costs サブコレクション

---

## 9. 初期データ

トリップ作成時に以下のデフォルトデータを自動挿入する（`addDoc` でバッチ挿入）。

### タイムライン初期データ
| sortOrder | 開始 | 終了 | タイトル | サブタイトル | icon | カテゴリ |
|-----------|------|------|----------|-------------|------|---------|
| 1 | 07:24 | 09:36 | 京都 → 東京 | のぞみ72号（指定席 ¥13,970/人） | 🚄 | transport |
| 2 | 10:02 | 10:16 | 東京 → 舞浜 | 京葉線快速 | 🚃 | transport |
| 3 | 10:22 | 10:31 | 舞浜 → ディズニーシー | リゾートライン | 🚝 | transport |
| 4 | 10:31 | 12:30 | パーク入園 & アトラクション | フリータイム | 🎢 | attraction |
| 5 | 12:30 | 13:30 | ホライズンベイレストラン | ランチ（2人 約¥5,700〜7,700） | 🍽️ | meal |
| 6 | 13:30 | 18:30 | アトラクション & 散策 | メインの時間帯 | ✨ | attraction |
| 7 | 18:30 | 20:00 | レストラン櫻 | ディナー（2人 約¥6,600〜9,400） | 🌸 | meal |
| 8 | 20:00 | 20:30 | パーク撤退 → ホテル | 閉園21時のため余裕をもって | 🏨 | transport |

### チェックリスト初期データ
| sortOrder | テキスト | 詳細 |
|-----------|---------|------|
| 1 | 新幹線 往路（のぞみ72号 京都→東京） | 指定席 ¥13,970/人 |
| 2 | 新幹線 復路 | 指定席 ¥13,970/人（往復合計 ¥27,940/人） |
| 3 | ディズニーシー パークチケット | 公式サイトで事前購入 |
| 4 | ホライズンベイレストラン 予約 | 1週間前から予約可 / 12:30〜 |
| 5 | レストラン櫻 予約 | 1週間前から予約可 / 18:30〜 |
| 6 | ホテル予約 | 候補比較して決定 |

### ホテル候補初期データ
| ホテル名 | prices Map | メモ |
|---------|-----------|------|
| ラ・ジェント・ホテル東京ベイ | { "4/11(土)": "¥35,000前後", "4/20(土)": "¥15,000前後" } | ドリンクバー無料・バリュー価格 |
| 東京ベイ舞浜ホテル ファーストリゾート | { "4/11(土)": "¥35,000前後", "4/20(土)": "¥20,000前後" } | オフィシャルホテル・ベイサイド駅近 |

### 費用サマリー初期データ
| sortOrder | 項目 | amountMin | amountMax |
|-----------|------|-----------|-----------|
| 1 | 新幹線（往復2人分） | 55880 | null |
| 2 | パークチケット（2人分） | 16000 | null |
| 3 | ランチ（ホライズンベイ） | 5700 | 7700 |
| 4 | ディナー（レストラン櫻） | 6600 | 9400 |
| 5 | ホテル | 15000 | 35000 |

### 初期データ挿入処理
トリップ作成時に `writeBatch` を使って一括挿入する:
```typescript
import { writeBatch, collection, doc, Timestamp } from "firebase/firestore";

async function createTripWithSeedData(tripData, userId) {
  const batch = writeBatch(db);

  // トリップ本体
  const tripRef = doc(collection(db, "trips"));
  batch.set(tripRef, {
    ...tripData,
    createdBy: userId,
    memberIds: [userId],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  // メンバー
  const memberRef = doc(collection(db, "trips", tripRef.id, "members"), userId);
  batch.set(memberRef, { displayName: "浩揮", role: "owner", joinedAt: Timestamp.now() });

  // タイムライン初期データ
  for (const item of INITIAL_TIMELINE) {
    const ref = doc(collection(db, "trips", tripRef.id, "timeline"));
    batch.set(ref, { ...item, isDone: false, createdBy: userId, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  }

  // チェックリスト初期データ
  for (const item of INITIAL_CHECKLIST) {
    const ref = doc(collection(db, "trips", tripRef.id, "checklist"));
    batch.set(ref, { ...item, isChecked: false, assignee: "", createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  }

  // ホテル・費用も同様に挿入
  // ...

  await batch.commit();
  return tripRef.id;
}
```

---

## 10. プロジェクト構成

```
pages/
├── _app.tsx                        # ThemeProvider + AuthProvider
├── _document.tsx                   # Google Fonts
├── index.tsx                       # トリップ一覧
├── login.tsx                       # 認証画面
├── trip/
│   └── [id].tsx                    # トリップ詳細（メイン画面）
└── invite/
    └── [code].tsx                  # 招待リンク受理
src/
├── components/
│   ├── timeline/
│   │   ├── TimelineCard.tsx
│   │   ├── TimelineList.tsx
│   │   └── AddTimelineItem.tsx
│   ├── checklist/
│   │   ├── ChecklistItem.tsx
│   │   └── ChecklistSection.tsx
│   ├── hotel/
│   │   └── HotelCompare.tsx
│   ├── cost/
│   │   └── CostSummary.tsx
│   └── trip/
│       ├── TripHeader.tsx
│       └── TripTabs.tsx
├── lib/
│   ├── firebase.ts                 # Firebase 初期化（auth, db エクスポート）
│   ├── theme.ts                    # MUI テーマ設定
│   ├── types.ts                    # 型定義
│   ├── constants.ts                # 定数
│   └── seed-data.ts                # 初期データ定数
├── hooks/
│   ├── useAuth.ts                  # Firebase Auth 状態管理
│   ├── useTimeline.ts              # タイムラインの CRUD + getDocs + refetch
│   ├── useChecklist.ts             # チェックリストの CRUD + getDocs + refetch
│   ├── useHotels.ts                # ホテル比較の CRUD + getDocs + refetch
│   ├── useCosts.ts                 # 費用サマリーの CRUD + getDocs + refetch
│   └── useTrip.ts                  # トリップ情報の取得・更新
├── contexts/
│   └── AuthContext.tsx              # Firebase Auth の Context Provider
└── firestore.rules                 # セキュリティルール
```

---

## 11. 開発フェーズ

### Phase 1: 基盤構築
- [x] Next.js + TypeScript
- [x] Firebase プロジェクト作成（コンソール）
- [x] `firebase.ts` 初期化ファイル作成
- [x] Firebase Authentication 設定（メール/パスワード有効化）
- [x] AuthContext + useAuth フック実装
- [x] ログイン / サインアップ画面実装
- [x] 認証ガード（未認証ユーザーのリダイレクト）

### Phase 2: コア機能
- [x] トリップ作成（+ `writeBatch` による初期データ自動挿入）
- [x] トリップ一覧表示
- [x] タイムライン CRUD + インライン編集 + `getDocs` + refetch
- [x] チェックリスト CRUD + `getDocs` + refetch
- [x] TripHeader（旅行日編集、カウントダウン、進捗サマリー）
- [x] タブ切り替え（タイムライン / 予約チェック）

### Phase 3: 追加機能
- [x] ホテル比較テーブル CRUD
- [x] 費用サマリー CRUD + 合計自動計算
- [x] 招待リンク機能（inviteCode 生成 + 参加フロー）
- [x] Firestore セキュリティルールのデプロイ

### Phase 4: 仕上げ
- [x] レスポンシブ対応（モバイルファースト）
- [x] デザイン調整（プロトタイプ `disney-sea-planner.jsx` 準拠）
- [x] Firebase Hosting デプロイ + 環境変数設定
- [ ] PWA 対応（nice to have）

---

## 12. 参考プロトタイプ

プロトタイプ（React アーティファクト）は `disney-sea-planner.jsx` として作成済み。
デザイン・カラー・レイアウト・コンポーネント構成はこのプロトタイプに準拠すること。

---

## 13. 注意事項

- スマートフォンでの操作性を最優先に設計すること
- CRUD操作後は必ず `refetch()` で最新データを再取得すること
- Firestore セキュリティルールを必ず設定し、`memberIds` に含まれないユーザーのアクセスを拒否すること
- CRUD操作はFirestoreへの書き込み後にrefetchでUI更新する設計とすること
- 日本語UIで統一（英語ラベルはデザインアクセントとしてのみ使用）
- Firestore の書き込みは可能な限り `writeBatch` でまとめて実行すること（初期データ挿入時など）
- Next.js Pages Router を使用し、Firebase SDK はクライアントサイドでのみ使用すること