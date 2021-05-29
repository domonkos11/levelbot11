const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');

const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');


var stats = {};
if (fs.existsSync('stats.json')) {
    stats = jsonfile.readFileSync('stats.json');
}

bot.on('message', (message) => {
    if (message.channel.type === 'dm') return;
    if (message.author.bot) return;

    if (message.guild.id in stats === false) {
        stats[message.guild.id] = {};
    }

    const guildStats = stats[message.guild.id];
    if (message.author.id in guildStats === false) {
        guildStats[message.author.id] = {
            xp: 0,
            level: 0,
            last_message: 0
        };
    }

    const userStats = guildStats[message.author.id];
    userStats.xp += random.int(18, 20);
    userStats.last_message = Date.now();

    const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
    if (userStats.xp >= xpToNextLevel) {
        userStats.level++;
        userStats.xp = userStats.xp - xpToNextLevel;
        message.channel.send(message.author.username + ' has reached level ' + userStats.level);
    }

    jsonfile.writeFileSync('stats.json', stats)

    const parts = message.content.split(' ');
    if(parts[0] === '!help-levels'){
        message.channel.send(new Discord.MessageEmbed().setTitle("Help").setDescription("**Hey! You said that you want the commands, right? OK, here you are: ** \n  1. !rank-levels : view your current rank. \n  2. !testlevels-levels : test if the bot working or not. \n  3. !botinfo-levels : how many servers does the bot in? \n  4. !help-levels : this help. \n  5. !uptime-levels : View the bot's current uptime. \n  6. !ping-levels : View the bot's ping.").setColor("#3277a8"));
        message.channel.send("**INFO: The bot is in " + message.client.guilds.cache.size + " servers. Once it reaches 100, you can't use it anymore. Take it, or leave it :) So send it to your friends, and they can use the bot before we reach 100 servers!  **");
    }
    if(parts[0] === '!testlevels-levels') {
        message.reply('levels are working');
        message.channel.send("**INFO: The bot is in " + message.client.guilds.cache.size + " servers. Once it reaches 100, you can't use it anymore. Take it, or leave it :) So send it to your friends, and they can use the bot before we reach 100 servers!  **");
    }
    if(parts[0] === '!botinfo-levels'){
        message.reply("The bot is currently in " + message.client.guilds.cache.size + " servers. Hopefully it goes bigger! :)");
    }
    if(parts[0] === '!rank-levels'){
        message.reply("You are currently on level " + userStats.level + ". Good luck! :)");
    }
    if(parts[0] === '!uptime-levels'){
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, \n ${hours} hours, \n ${minutes} minutes, and \n ${seconds} seconds`;
        message.reply("I have been up for like \n" + uptime);
    }
    if(parts[0] === '!ping-levels'){
        message.reply("Pong!" + " And the ping is: " + bot.ws.ping);
    }
});

bot.login(config.token);