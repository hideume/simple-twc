# simple-twc
すいません。日本語で失礼します。

twitter apiには、いろんな機能がありますが、一般的なweb clientではこれをうまく使っていないので作ってます。
まあ、expressとpugの勉強というべきものかもしれません。

# install
package.jsonはついているのですが、ちょっと適当です。
npm installで動くかどうかは保証の限りではありません。

node app.js
ブラウザでhttp://localhost:3000
で始まるとは思うのですが、まだこれから動くかどうかしらべます。

gitも始めてなので、moduleとかもはいってしまってこれから削除しようと思います。

# 初期設定
環境変数に

<pre>
  TWITTER_CONSUMER_KEY
  TWITTER_CONSUMER_SECRET
  TWITTER_ACCESS_TOKEN_KEY
  TWITTER_ACCESS_TOKEN_SECRET
  TWITTER_SCREEN_NAME
</pre>

の５つを設定してから起動してください。そうすると
起動できます。あとは、リンクのついたところをクリックしてください。

# install testの結果
とりあえず
<pre>
 npm install
 node app.js
</pre>

で、localhost:3000でブラウザで動作できているのをgit clone
で持ってきたのを起動できるのを確認しました。

開発はwindows7上でやってます。確認用にvmのubuntuで確認しました


