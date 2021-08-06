const commandInfo = {
	"primaryName": "give", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["give", "alias2", "alias3"], // These are all commands that will trigger this command.
	"help": "eats your cake!", // This is the general description of the command.
	"aliases": ["alias2", "alias3"], // These are command aliases that help.js will use
	"usage": "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdGive) {
		return message.channel.send(new RM.Discord.MessageEmbed()
			.setColor("RED")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
				"Command disabled by Administrators."
			)
			.setThumbnail(message.guild.iconURL())
			.setTitle("Command Disabled")
		)
	}

	message.channel.send(new RM.Discord.MessageEmbed().setDescription("<a:loading:869354366803509299> *Working on it...*")).then(async (m) => {
		const { connect } = require("../../../databasec")
		await connect()
		await connect.create("inventory")
		if (await connect.fetch("inventory", message.author.id) === null) {
			await connect.add("inventory", message.author.id)
		}
		if (!args[0]) {
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"You need to specify a user to give items to!"
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return await connect.end(true)
		}
		let amount;
		if (!args[1]) {
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"You need to specify an item id!"
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return await connect.end(true)
		}
		if (args[2]) {
			amount = parseInt(args[2])
		} else {
			amount = 1
		}
		let user =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) ||
			message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase()) ||
			null
		if (user == null) {
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"**Error:** User not found!"
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return await connect.end(true)
		}
		if (await connect.fetch("inventory", user.id) === null) {
			await connect.add("inventory", user.id)
		}
		const data1 = await connect.fetch("inventory", message.author.id)
		let authorInv = data1.items
		const data2 = await connect.fetch("inventory", user.id)
		let userInv = data2.items
		if (args[1] === "banknote") {
			if (authorInv.banknote === undefined || authorInv.banknote < amount) {
				m.edit(new RM.Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"You don't have enough banknotes!"
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Error")
				)
				return await connect.end(true)
			}
			authorInv.banknote -= amount
			if (authorInv.banknote === 0)
				delete authorInv.banknote
			if (userInv.banknote === undefined) {
				userInv.banknote = amount
			} else {
				userInv.banknote += amount
			}
			await connect.updateInv("inventory", message.author.id, authorInv)
			await connect.updateInv("inventory", user.id, userInv)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`You gave **\`${amount}\`** banknotes to **${user.user.username}**!`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Success")
			)
			return await connect.end(true)
		} else if (args[1] === "raybrain") {
			if (authorInv.raybrain === undefined || authorInv.raybrain < amount) {
				m.edit(new RM.Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"You don't have enough raybrains!"
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Error")
				)
				return await connect.end(true)
			}
			authorInv.raybrain -= amount
			if (authorInv.raybrain === 0)
				delete authorInv.raybrain
			if (userInv.raybrain === undefined) {
				userInv.raybrain = amount
			} else {
				userInv.raybrain += amount
			}
			await connect.updateInv("inventory", message.author.id, authorInv)
			await connect.updateInv("inventory", user.id, userInv)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`You gave **\`${amount}\`** raybrains to **${user.user.username}**!`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Success")
			)
			return await connect.end(true)
		} else if (args[1] === "padlock") {
			if (authorInv.padlock === undefined || authorInv.padlock < amount) {
				m.edit(new RM.Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"You don't have enough padlocks!"
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Error")
				)
				return await connect.end(true)
			}
			authorInv.padlock -= amount
			if (authorInv.padlock === 0)
				delete authorInv.padlock
			if (userInv.padlock === undefined) {
				userInv.padlock = amount
			} else {
				userInv.padlock += amount
			}
			await connect.updateInv("inventory", message.author.id, authorInv)
			await connect.updateInv("inventory", user.id, userInv)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`You gave **\`${amount}\`** padlocks to **${user.user.username}**!`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Success")
			)
			return await connect.end(true)
		} else if (args[1] === "lockpick") {
			if (authorInv.lockpick === undefined || authorInv.lockpick < amount) {
				m.edit(new RM.Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"You don't have enough lockpicks!"
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Error")
				)
				return await connect.end(true)
			}
			authorInv.lockpick -= amount
			if (authorInv.banknote === undefined || authorInv.lockpick === 0)
				delete authorInv.lockpick
			if (userInv.lockpick === undefined) {
				userInv.lockpick = amount
			} else {
				userInv.lockpick += amount
			}
			await connect.updateInv("inventory", message.author.id, authorInv)
			await connect.updateInv("inventory", user.id, userInv)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`You gave **\`${amount}\`** lockpicks to **${user.user.username}**!`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Success")
			)
			return await connect.end(true)
		} else if (args[1] === "landmine") {
			if (authorInv.landmine === undefined || authorInv.landmine < amount) {
				m.edit(new RM.Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"You don't have enough landmines!"
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Error")
				)
				return await connect.end(true)
			}
			authorInv.landmine -= amount
			if (authorInv.landmine === 0)
				delete authorInv.landmine
			if (userInv.landmine === undefined) {
				userInv.landmine = amount
			} else {
				userInv.landmine += amount
			}
			await connect.updateInv("inventory", message.author.id, authorInv)
			await connect.updateInv("inventory", user.id, userInv)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`You gave **\`${amount}\`** landmines to **${user.user.username}**!`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Success")
			)
			return await connect.end(true)
		} else {
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"Invalid item!"
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return await connect.end(true)
		}
	}).catch(async (err) => {
		console.log(err)
		message.channel.send("Error: " + err)
	})
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


/* */
/* */
/* */ /* */ /* */ /* */ /* */ /* */
/*
------------------[Instruction]------------------

1. Make a directory in commands/ with your command name
2. Inside that directory, make a "<command name>.js" file
3. Copy the contents of TEMPLATE.js and paste it in the <command name>.js file and modify it to your needs.
4. In index.js add to the top:
"const cmd<cmdNameHere> = require('./commands/<command name>/<command name>.js');" at the top.

-------------------------------------------------

To get all possible triggers, from index.js call
"cmd<cmdname>.commandTriggers()"

To call the command, from index.js call
"cmd<cmdname>.runCommand(message, arguments, requiredModules);"

To check if possible triggers has the command call
"cmd<cmdname>.commandTriggers().includes(command)"

------------------[Instruction]------------------
*/
/* */
/* */ /* */ /* */ /* */ /* */ /* */ /* */