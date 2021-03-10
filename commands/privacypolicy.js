const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants')

module.exports = {
    description: "Provides link to Semblance's Privacy Policy",
    category: 'semblance',
    usage: {
        "":""
    },
    aliases: ['pp', 'privacy', 'policy'],
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle('Privacy Policy')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setURL("https://github.com/OfficialSirH/Semblance-bot/blob/master/Privacy%20Policy.md");
    message.channel.send(embed);
}