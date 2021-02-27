function doPost(e) {

  var parameter = JSON.parse(e.postData.getDataAsString());
  var twitterService = getService();
  var twMethod = { method:"POST" };
  
  if (parameter.type == "notice"){
    twMethod.payload = { status: "【" + parameter.name + "の配信予定告知】\n" + parameter.content };
    var response = twitterService.fetch("https://api.twitter.com/1.1/statuses/update.json", twMethod);
  }
  else if (parameter.type == "start"){
    twMethod.payload = { status: "【配信開始】\n" + parameter.name + "が配信を開始しました。" };
    var response = twitterService.fetch("https://api.twitter.com/1.1/statuses/update.json", twMethod);
  }
}
