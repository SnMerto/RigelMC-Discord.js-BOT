const Discord = require('discord.js');
const client = new Discord.Client();
const { ip, port, prefix, supportCategory, supportTakeChannel, autoRoleID, girisCikisID } = require('./config.json');
var url = 'http://mcapi.us/server/status?ip=' + ip + '&port=' + port;
const request = require('request');
const token = 'NjE4MTQ0MDQ4NzcwODQyNjg1.XY0d9A.7rFq8yITQUkkACN2rN7xK0M_0CI';

client.on('ready', () => {
  console.log(`${client.user.tag} Çalışıyor!`);
  client.setInterval(update,20000);
  update();
  const channelofStartingSupport = client.channels.find(ch => ch.id === supportTakeChannel);
  var msgNewSupport = "```Merhaba\nBu kanaldan destek/şikayet talebinde bulunabilirsin.```\n\n```Yapman gereken direk konuyu yazmak!```\n\n" 
  + "```html\nUNUTMAYIN: DESTEK AÇTIĞINIZDA YÖNETİCİLER SİZDEN ŞİFRENİZİ İSTEMEZ! LÜTFEN ŞİFRENİZİ KİMSEYLE PAYLAŞMAYIN!```";
  channelofStartingSupport.bulkDelete(100, true);
  channelofStartingSupport.send(msgNewSupport);


});

client.on('message', message => {
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();


  if (!message.content.startsWith(prefix) || message.author.bot) return;
  else if (command === 'temizle') {
    if (message.member.permissions.has('ADMINISTRATOR')){
      if (!args.length) {
        return message.channel.send(`> Herhangi bir sayı belirtmedin ${message.author} Lütfen: **r!temizle <sayı>** kullan.`);
      }
      else if (args.length === 1){
        if (!isNaN(args[0])){
          if (args[0] > 100 && args[0] < 1000){
            loopCount = args[0]/100;
            for (i = 0; i < Math.round(loopCount); i++){
              message.channel.bulkDelete(100, true).catch(err => {
                console.error(err);
                message.channel.send('> Bir hata oldu ve silinemedi!');});}
          } else if (args[0] > 1000) return;
          else {
          message.channel.bulkDelete(args[0], true).catch(err => {
            console.error(err);
            message.channel.send('> Bir hata oldu ve silinemedi!');});}
        } else return;

      }
      else {
        return message.channel.send(`> Yanlış kullanım ${message.author} Lütfen: **r!temizle <sayı>** kullan.`)
      }
  } else {return message.channel.send('> YETKIN YOK!');}
  }
  else if (command === 'ip'){
    message.channel.send('**HEMEN KATIL!**' + '\n' + ip);
  }
  else if (command === 'ping') {
    message.channel.send(`İŞTE PING!`).then(m => {
    m.edit((m.createdTimestamp - message.createdTimestamp) + `ms, Pingin var ve Client Ping: ` + Math.round(client.ping) + `ms.`);
    });
}
    
});
function update() {

  request(url, function(err, response, body) {
    if(err) {
        console.log(err);
    }
    body = JSON.parse(body);
    var status = 'Sunucu çevrim dışı';
    if(body.online) {
      status = ip + ' ';
      if(body.players.now) {
          status += body.players.now + ' Çevrim içi';

      } else {
          status += '*Sunucu boş hemen katıl!*';
      }
    } else {
      client.user.setStatus('idle')
      .catch(console.error);

    }
    let statuses = [
      `🔥 Hybrit Sykblock 🔥 ` + status,
      `⏳ Hemen KATIL ⏳ ` + status,
    ]
    let statusx = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(statusx, {type: "STREAMING", url: "https://www.twitch.tv/solderlord00" });
});
}

client.on('guildMemberAdd', member => {
  const role = member.guild.roles.find(role => role.id === autoRoleID);
  member.addRole(role);
  const channel = member.guild.channels.find(ch => ch.id === girisCikisID);
  if (channel == null) return;
  else {
    embed = new Discord.RichEmbed().setTitle("Aramıza katılan yeni birisi var!")
      .setDescription(member + " aramıza katıldı!")
      .setColor("#3FBD1E");
      channel.send(embed);
  }
});
client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.find(ch => ch.id === girisCikisID);
  if (channel == null) return;
  else {
    embed = new Discord.RichEmbed().setTitle("Birisi aramızdan ayrıldı!")
      .setDescription(member + " aramızdan ayrıldı!")
      .setColor("#FF0000");
      channel.send(embed);
  }
});

client.on("message", (message) => {
const channel2 = message.guild.channels.find(ch => ch.id === supportTakeChannel);
if (channel2 == null) return;
else {
  if (message.channel.id=== supportTakeChannel){
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith(`yardım`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: RigelMC ~ Destek Talebi`)
    .setColor(0xCF40FA)
    .setDescription(`Selam! RigelMC'nin destek botuyum. Sana yardım etmek için burdayım.`)
    .addField(`Destek oluşturma`, `Destek bildirimini oluşturmak > Kanala desteğinizi içeren mesajı yazın!\n[${prefix}kapat]() > Desteği kapatır!`)
    .addField(`Diğer`, `[yardım]() > yardım menüsünü gösterir.\n[${prefix}ping]() > Discord API ping değerini gösterir.`);
    message.channel.send({ embed: embed });
  }
  else {
    message.delete();
    const reason = message;
    if (!message.guild.roles.find(role => role.name === "Rehber")) return message.channel.send(`Bu Sunucuda '**Destek Ekibi**' rolünü bulamadım bu` 
        + ` yüzden ticket açamıyorum \nEğer sunucu sahibisen, Destek Ekibi Rolünü oluşturabilirsin.`);
    if (message.guild.channels.find(n => n.name === 'destek-' + message.author.id))
    return message.channel.send(`> Zaten açık durumda bir ticketin var.`).then((m) => {
      message.channel.awaitMessages(response => response, {
        max: 1,
        time: 5000,
        errors: ['time'],})
        .then((collected) => {
          m.delete();
        }).catch(() => {
          m.delete();
        })})
    
    var category = message.guild.channels.find(c => c.id === supportCategory && c.type == "category");
    if (category == null) return;
    message.guild.createChannel('destek-' + message.author.id, { type: "text" }).then(c => {
        c.setParent(category.id);
        let role = message.guild.roles.find(role => role.name === "Rehber");
        let role2 = message.guild.roles.find(role => role.name === "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`> :white_check_mark: Ticket Kanalın oluşturuldu, <#${c.id}>.`)
        .then((m) => {
          message.channel.awaitMessages(response => response, {
            max: 1,
            time: 5000,
            errors: ['time'],})
            .then((collected) => {
              m.delete();
            }).catch(() => {
              m.delete();
            })})
        
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .setTitle(`:mailbox_with_mail: RigelMC - Destek`)
        .addField(`Selam ${message.author.username}!`, `Destek talebiniz başarılı bir şekilde açıldı, En kısa sürede yanıt vereceğiz.`)
        .addField(`Şikayet:`, reason);
        c.send({ embed: embed });
    }).catch(console.error);
  }
} else {
  if (message.content.toLowerCase().startsWith(prefix + `kapat`)) {
    var timerID = 0;
    if (!message.channel.name.startsWith(`destek-`)) return message.channel.send(`> Bu komutu kullanamazsın destek kanalında olman gerekir.`);
  
      message.channel.send(`> Destek talebini kapatmayı onaylıyor musun? Onaylıyorsanız **evet** yazın.`)
      .then((m) => {
        message.channel.awaitMessages(response => response.content === 'evet', {
          max: 1,
          time: 10000,
          errors: ['time'],
        })
        .then((collected) => {
            message.channel.delete();
          })
          .catch(() => {
            m.edit('> Ticket Kapatma isteğin zaman aşımına uğradı.').then(m2 => {
                timerID = setInterval(function (){
                    m2.delete();
                    clearInterval(timerID);
                }, 3000)
            }, 3000);
          });});}
}
}
});
  

client.login(token);
