const commandInfo = {
    "primaryName": "search",
    "possibleTriggers": ["search"],
    "help": "Gets top 10 search results from youtube.",
    "aliases": [],
    "usage": "[COMMAND] <search string>", // [COMMAND] gets replaced with the command and correct prefix later
    "category": "music"
}

async function runCommand(message, args, RM) {
    const queue2 = global.queue2;
    const queue3 = global.queue3;
    const queue = global.queue;
    const games = global.games

    let ops = {
        queue2: queue2,
        queue: queue,
        queue3: queue3,
        games: games
    }

    const Discord = RM.Discord;
    const client = RM.client;
    const { Util, MessageEmbed } = require('discord.js');
    const apis = [RM.process_env.GAPI, RM.process_env.GAPI2, RM.process_env.GAPI3, RM.process_env.GAPI4]
    const YouTube = require("simple-youtube-api");
    const youtube = new YouTube(apis[Math.floor(Math.random() * apis.length)]);
    const ytdl = require('ytdl-core');


    if (!args[0]) return message.channel.send("**Please Enter A Song Name!**")
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const searchString = args.slice(1).join(' ');

    const { channel } = message.member.voice;
    if (!channel) return message.channel.send("**You Are Not In A Voice Channel!**");


    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
        return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
    }
    if (!permissions.has('SPEAK')) {
        return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();

        for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id);
            await handleVideo(video2, message, channel, true);
        }
    }
    else {
        try {
            var video = await youtube.getVideo(url);
            console.log(video)
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(searchString, 10);
                let index = 0;
                const sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setFooter(message.member.displayName, message.author.avatarURL())
                    .setDescription(`
                    __**Song selection:**__\n
                    ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n').replace(new RegExp('&#39;', "g"), "'")}
                    \nPlease provide a value to select one of the search results ranging from 1-10.
                                    `)
                    .setTimestamp();
                message.channel.send(sembed).then(message2 => message2.delete({ timeout: 100000 }))
                try {
                    var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                        max: 1,
                        time: 100000,
                        errors: ['time']
                    });
                } catch (err) {
                    console.log(err);
                    return message.channel.send('❌ **Timeout!**')
                }
                const videoIndex = parseInt(response.first().content);
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                console.error(err);
                return message.channel.send(':x: | I could not obtain any search results.');
            }
        }
        return handleVideo(video, message, channel);

    }

    async function handleVideo(video, message, channel, playlist = false) {
        const serverQueue = ops.queue.get(message.guild.id);
        const song = {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: channel,
                connection: null,
                songs: [],
                volume: 3,
                playing: true,
                loop: false
            };
            ops.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            try {
                var connection = await channel.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0], message);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                ops.queue.delete(message.guild.id);
                return undefined;
            }

        } else {
            serverQueue.songs.push(song);
            if (playlist) return undefined;
            else {
                const embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Added To Queue")
                    .setThumbnail(song.thumbnail)
                    .setTimestamp()
                    .setDescription(`**${song.title}** has been added to queue!`)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL());
                message.channel.send(embed)
            }
        }
        return undefined;
    }
    async function play(guild, song, msg) {
        const serverQueue = ops.queue.get(guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave()
            ops.queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection.play(await ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 20, quality: "highestaudio" }))
            .on('finish', () => {
                if (serverQueue.loop) {
                    serverQueue.songs.push(serverQueue.songs.shift());
                    return play(guild, serverQueue.songs[0], msg)
                }
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0], msg)

            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle('Now Playing\n')
            .setThumbnail(song.thumbnail)
            .setTimestamp()
            .setDescription(`🎵 Now playing:\n **${song.title}** 🎵`)
            .setFooter(msg.member.displayName, msg.author.displayAvatarURL());
        serverQueue.textChannel.send(embed);

    };

}



function commandTriggers() {
    return commandInfo.possibleTriggers;
}
function commandPrim() {
    return commandInfo.primaryName;
}
function commandAliases() {
    return commandInfo.aliases;
}
function commandHelp() {
    return commandInfo.help;
}
function commandUsage() {
    return commandInfo.usage;
}
function commandCategory() {
    return commandInfo.category;
}
module.exports = {
    runCommand,
    commandTriggers,
    commandHelp,
    commandAliases,
    commandPrim,
    commandUsage,
    commandCategory
}
