const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();

const axiosBase = require("axios"); // どこかに書いておく。
const url = process.env.GAS_URL; // gasのドメイン以降のurl（/macros/s/～）
//const data = {"key" : "value"}; // 送信するデータ
const axios = axiosBase.create({
    baseURL: "https://script.google.com", // gas以外の場合はそれぞれ書き換え
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    responseType: "json",
});

http.createServer(function(req, res){
  if (req.method == 'POST'){
    var data = "";
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if(!data){
        res.end("No post data");
        return;
      }
      var dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if(dataObject.type == "wake"){
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  }
  else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
  }
}).listen(3000);

client.on('ready', message =>{
  console.log('Bot準備完了～');
  client.user.setPresence({
    status: "online",
    activity: {
        name: "ねこ",
        type: "PLAYING"
    }
  });
});


client.on('message', message =>{
  if (message.author.id == client.user.id || message.author.bot){
    return;
  }

//576036150427516939  test
  if (message.channel.id == "759471494299385916"){
    //console.log(message)
    console.log("予定告知")
    axios.post(url, {
      'type': 'notice',
      'name': message.author.username,
      'content': message.content
    }).then(async function (response) {
        const responsedata = response.data; // 受け取ったデータ一覧(object)
    })
    .catch(function (error) {
        console.log("ERROR!! occurred in Backend.");
        console.log(error);
    });
    return;
  }
});


client.on('voiceStateUpdate', (oldGuildMember, newGuildMember) =>{
  if(newGuildMember.streaming && !oldGuildMember.streaming){
    //576036150427516942  test
    if (newGuildMember.channelID == "757571926825762820") {
      const user = client.users.cache.find(user => user.id === newGuildMember.id)
      console.log(user)
      console.log("配信開始")
      axios.post(url, {
        'type': 'start',
        'name': user.username
      }).then(async function (response) {
        const responsedata = response.data; // 受け取ったデータ一覧(object)
    })
    .catch(function (error) {
        console.log("ERROR!! occurred in Backend.");
        console.log(error);
    });
    }
  }
});

if(process.env.DISCORD_BOT_TOKEN == undefined){
 console.log('DISCORD_BOT_TOKENが設定されていません。');
 process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );

function sendReply(message, text){
  message.reply(text)
    .then(console.log("リプライ送信: " + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option={}){
  client.channels.get(channelId).send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}
