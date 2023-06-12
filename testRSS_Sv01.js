function sendToGoogleChat() {
  var url = "https://www.publickey1.jp/atom.xml";
  var response = UrlFetchApp.fetch(url);
  var xml = response.getContentText();
  var document = XmlService.parse(xml);
  var root = document.getRootElement();
  var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  var entries = root.getChildren('entry', atom);

  // 前回取得した最新記事のリンクを取得
  var scriptProperties = PropertiesService.getScriptProperties();
  var lastLink = scriptProperties.getProperty('lastLink');

  // 最新記事を取得
  var latestEntry = entries[0];
  var latestLink = latestEntry.getChild('link', atom).getAttribute('href').getValue();

  // 前回の最新記事と現在の最新記事が異なる場合（= 新しい記事が追加されている場合）
  if (latestLink !== lastLink) {
    var title = latestEntry.getChild('title', atom).getText();

    // Google Chatにメッセージを送信
    var webhookUrl = ""; // Google ChatのWebhook URLを設定します。
    var payload = {
      "text": title + "\n" + latestLink
    };
    var options = {
      "method" : "post",
      "payload" : JSON.stringify(payload),
      "headers": {"Content-Type": "application/json; charset=UTF-8"}
    };
    UrlFetchApp.fetch(webhookUrl, options);

    // 現在の最新記事のリンクを保存
    scriptProperties.setProperty('lastLink', latestLink);
  }
}
