YouTube API Keyの取得方法を説明します：

## 📋 YouTube Data API v3 キー取得手順

### 1. Google Cloud Console にアクセス
- [Google Cloud Console](https://console.cloud.google.com/) にアクセス
- Googleアカウントでログイン

### 2. プロジェクト作成・選択
```
1. 画面上部の「プロジェクトを選択」をクリック
2. 「新しいプロジェクト」を選択
3. プロジェクト名を入力（例：ad-app-youtube）
4. 「作成」をクリック
```

### 3. YouTube Data API v3 を有効化
```
1. 左メニュー「APIとサービス」→「ライブラリ」
2. 検索欄に「YouTube Data API v3」と入力
3. 「YouTube Data API v3」を選択
4. 「有効にする」をクリック
```

### 4. 認証情報を作成
```
1. 左メニュー「APIとサービス」→「認証情報」
2. 「+ 認証情報を作成」→「APIキー」を選択
3. APIキーが生成される
4. 「キーを制限」をクリック（推奨）
```

### 5. APIキーを制限（セキュリティ向上）
```
■ アプリケーションの制限：
- HTTPリファラー（ウェブサイト）を選択
- あなたのドメインを追加

■ API の制限：
- 「キーを制限」を選択
- 「YouTube Data API v3」のみチェック
```

### 6. 環境変数に設定
```bash
# .env.local
YOUTUBE_API_KEY=AIzaSyD-your-actual-api-key-here
```

**💡 重要ポイント：**
- API使用量制限：1日10,000 units
- 1回の検索 ≈ 100 units
- 本番環境では請求先アカウント設定が必要な場合あり