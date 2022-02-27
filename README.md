# Digimon Card App

## Setup

1. node v12
1. npm install

## Deck Construction App

## 起動方法

1. apps/deck-construction-desktop-app/src/assets 配下に下記を展開。  
   ※assets ファイルは digimon-card-data-fetch を利用して取得する
   - cardInfo
   - images
1. 下記コマンドを実行
   ```
   npx nx run deck-construction-desktop-app:serve
   ```

## VS App

1. apps/vs-desktop-app/.env ファイルを作成
   ```
   NX_PEER_SERVER_KEY=${値は別途共有}
   ```
1. apps/vs-desktop-app/src/assets 配下に下記を展開。  
   ※assets ファイルは digimon-card-data-fetch を利用して取得する
   - cardInfo
   - images
1. apps/vs-desktop-app/src/app/services/peer.service.ts の peer key を指定。
   ※指定する値は別途確認
1. 下記コマンドを実行
   ```
   npx nx run vs-desktop-app:serve
   ```

## ホスティング画像取得用 Credential 取得方法

下記コマンドを実行する

```
npx nx run api-get-credentials:serve
```
