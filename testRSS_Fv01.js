// Google Chat Webhook URL
var WEBHOOK_URL = '';

// RSS feed URL
var RSS_URL = 'https://daily-gadget.net/feed/';

function postToGoogleChat() {
  var response = UrlFetchApp.fetch(RSS_URL);
  var xml = XmlService.parse(response.getContentText());
  var root = xml.getRootElement();
  var channel = root.getChild('channel', root.getNamespace());

  // Get the first (latest) item
  var item = channel.getChildren('item', root.getNamespace())[0];
  var title = item.getChild('title', root.getNamespace()).getText();
  var link = item.getChild('link', root.getNamespace()).getText();
  
  // Create message
  var message = {
    'text': title + ' ' + link
  };
  
  // Post message to Google Chat
  var options = {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    payload: JSON.stringify(message)
  };
  UrlFetchApp.fetch(WEBHOOK_URL, options);
}
