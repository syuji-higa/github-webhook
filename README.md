# GitHub WebHook

## 開発起動
```bash
$ HOSTNAME=localhost PORT=8080 node app/main.js
```

## テスト

### push
```bash
$ bash sh/post_push.sh
```

### delete
```bash
$ bash sh/post_delete.sh
```

## 機能

### push 時にオートデプロイ
events: Push

### ブランチ削除時に対応したブランチのディレクトリを削除
events: Delete

### リポジトリ削除時に全ブランチのディレクトリを削除
events: Repository
