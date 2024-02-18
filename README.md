# 課題 07 - 暗号資産管理アプリ Part4 -

## ① 課題内容（どんな作品か）

- bitBank の API を使用した暗号通貨資産管理アプリ
- bitBank から取引価格（Public API）と保有資産（Private API）を取得し、手動インポートした履歴 csv から購入平均額などを計算して表示。その情報を基に売買・履歴自動更新まで行える
- 普段スプレッドシート + Google Apps Script で作って使っていたツールを React アプリに落とすのが目的

### 実装した機能（これまで）

- Public API から通貨ごとの取引価格を取得して表示
- Private API から通貨ごとの保有数を取得して表示
- 取引履歴をインポートし、統計情報を集計して表示
  - 統計情報は DB に保存してアップデートするよう改良
  - 履歴を追加する際、重複するデータや不正なデータを排除
- 認証機能
- 通信量削減のため、集計した統計情報を DB に保存してそこから取得
- 通貨詳細画面作成
- 詳細画面に売買機能追加
  - ポップアップを出して取引金額を指定
  - 売買後、約定履歴を取得して 取引履歴 DB と統計情報 DB を更新
  - 取引価格だけでなく、正確な購入価格と売却価格を API から取得して表示
- その他
  - ロード直後の表示情報取得前に中途半端な状態で画面表示されないよう制御
  - 通信失敗した際に例外をキャッチして画面表示

### 実装した機能（new）

- 通貨ごとの icon 画像アップロード機能

## ② 工夫した点・こだわった点

- 統計情報を DB へ保存することで通信量削減
- ソースファイルの分割・整理（１ファイルが 150 行を超えないようにした）
- Warning 解消: Failed prop type: Invalid prop `children` supplied to `ForwardRef(Toolbar2)`, expected a ReactNode.→Material UI コンポーネント内での分岐をなくすことで解消
- ポップアップ表示の実装（ChatGPT に聞いたらできた）
- fetch が上手くいかなかったので axios を使用

## ③ 難しかった点・次回トライしたいこと(又は機能)

### 難しかった点

### 次回トライしたいこと

- 買い時と売り時を表示する機能
- 最小注文数量と最大注文数量による Validation を実装
- 注文失敗時の例外処理
- 履歴管理用のページを作成
  - 取引履歴と売買履歴のインポートに対応（上書きオプションをつける）
  - 統計情報再計算機能
- 詳細画面に履歴表示
- デプロイ

## ④ 質問・疑問・感想、シェアしたいこと等なんでも

- [質問]
- [感想]
- [参考記事]
  1.  https://qiita.com/kaketechjapan/items/da6696146adcdb631ab9
  2.  https://qiita.com/kaketechjapan/items/d6ae9a0630e949fcc517
  3.  https://github.com/bitbankinc/bitbank-api-docs/blob/master/rest-api_JP.md
  4.  https://gennull.com/blog/chrome-cors/
  5.  https://www.l08084.com/entry/2018/03/16/172809#%E5%8B%95%E4%BD%9C%E7%A2%BA%E8%AA%8D1-CORS%E3%81%8C%E5%87%BA%E3%81%A6%E5%A4%B1%E6%95%97%E3%81%99%E3%82%8B

## 起動方法

07_crud3_0827 配下で

```
npm run dev
```

を実行する。ブラウザは、開発環境では以下のコマンドで開く必要あり。（CORS エラー対策）

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\chromeTemp"
```

## typescript 固有の long 型定義エラー解消方法

以下を実行する

```
npm install long --save
npm install @types/long --save-dev
```

## 必要なライブラリ

```
npm i @mui/material
npm i @mui/icons-material
npm i react-router-dom
npm i crypto-js
npm i --save-dev @types/crypto-js
npm i firebase
npm i @emotion/styled
npm i axios
npm i dayjs
```
