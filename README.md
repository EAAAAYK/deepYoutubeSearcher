# deepYoutubeSearcher
<br>&nbsp;
<br>\# 🌊 YouTube深海発掘機 (Deep YouTube Searcher) 
<br>&nbsp;
<br>再生回数5,000回以下の埋もれた思考・教養・個人アーカイブ動画を発掘するためのWebアプリケーションです。 アルゴリズムでおすすめされるメジャー動画のノイズを排し、個人発信の深い思考やマニアックな知の地層にアクセスできます。 
<br>&nbsp;

<br>&nbsp;
## 🚀 デモ・動作確認
<br>&nbsp;
<br><br>- \*\*Webデモ版（API不要）\*\*: [デモ版のページが開きます](https://eaaaayk.github.io/deepYoutubeSearcher/) 
<br>※APIキーなしでUI動作やソナー探査演出、ブックマーク機能を体験できます。 
<br>- \*\*GAS版コード\*\*: \`/gas\` ディレクトリ内に格納（Google Apps Script + YouTube Data API v3 連動） 
<br>&nbsp;

<br>&nbsp;
 ## ✨ 主な機能 
<br>&nbsp;
<br>- \*\*再生数・動画長フィルタリング\*\*: 再生回数5,000回以下、10分以上の長尺動画に限定して抽出 
<br>- \*\*ノイズカット機能\*\*: 公式チャンネルや切り抜き集などの商業コンテンツを自動除外 
<br>- \*\*ワードプール自動記憶\*\*: 検索キーワードをブラウザ（\`localStorage\`）に保存・蓄積 
<br>- \*\*キープ（ブックマーク）機能\*\*: 気に入った発掘動画をブラウザ内に保存 
<br>- \*\*レスポンシブ・サイバーUI\*\*: Dark Mode / Tailwind CSS による近未来ソナー風デザイン 
<br>&nbsp;

<br>&nbsp;
## 🛠 技術スタック 
<br>- \*\*フロントエンド\*\*: HTML5, Tailwind CSS (CDN), JavaScript (ES6+) 
<br>- \*\*バックエンド (本番環境)\*\*: Google Apps Script (GAS) 
<br>- \*\*外部API\*\*: YouTube Data API v3 
<br>- \*\*アイコン\*\*: Phosphor Icons 
<br>&nbsp;

<br>&nbsp;
## 📂 ディレクトリ構成
```text 
├── index.html # スタンドアロンWebデモ版（ポートフォリオ展示用） 
└── GAS版/ 
     ├── Code.gs # GASバックエンド処理（YouTube API呼び出し・データ整形）  
     └── Index.html # GASウェブアプリ用フロントエンドHTML
```
