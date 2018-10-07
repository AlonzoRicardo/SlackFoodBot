require('dotenv').config()
const Bot = require('slackbots');
const User = require('./models/UserModel')
const Leader = require('./models/LeaderModel')
const formGroups = require('./src/randomGrouping')
const selectLeaderFromArrays = require('./src/leaderSelector')
const listPrint = require('./src/listPrint')
const ontime = require('ontime')

//intialize empty leader array 
const leadersArray = new Leader(
    { wereLeaders: [] }
)

//intialize leader in DB
leadersArray.save()
.catch((e) => console.log(e))

// create a bot
let settings = {
    token: process.env.TOKEN,
    name: 'foodbot'
};
let bot = new Bot(settings);

//Login the bot
bot.login()

//Start Time of the bot
ontime({
    cycle: ['10:00:00']
}, function (ot) {
    bot._events = bot.evs;
    bot.emit('start')
    ot.done()
    return
})

//Cloing time of the bot
ontime({
    cycle: ['12:00:00']
}, function (ot) {
    bot.emit('send groups')
    bot._events = {};
    ot.done()
    return
})

bot.on('start', () => {
    bot.included = [];
    bot.postMessageToChannel('general',
        '*Who wants to go for launch?* \n *write* @botname _help me_ *to see the list of posible commands* \n');
});

// Messages
bot.on('message', data => {
    if (data.type !== 'message') {
        return
    }
    messageHandler(data.text, data.user, data.channel)
})

function messageHandler(message, user, channel) {

    if (message.includes(' include me')) {
        if (bot.included.indexOf(`${user}`) === -1) {
            bot.included.push(user)
            let message = listPrint(bot.included, `<@${user}> You are now in the list \n list:`);
            bot.postMessage(channel, message)
        } else {
            let message = listPrint(bot.included, `<@${user}> You are already in the list \n list:`);
            bot.postMessage(channel, message)
        }
    }

    if (message.includes(' declude me')) {
        let i = bot.included.indexOf(`${user}`)
        bot.included.splice(i, 1)
        let message = listPrint(bot.included, `<@${user}> You are out of the list \n list:`);
        bot.postMessage(channel, message)
    }

    if (message.includes(' help me')) {
        let message = `*List of Commands* \n`;
        message += `1. @botname _include me_: Includes the user in the list \n`
        message += `2. @botname _declude me_: Removes the user from the current list \n`
        message += `3. @botname _help me_: Shows the list of posible commands`
        bot.postMessage(channel, message)
    }
}


//Gets called at closing time
bot.on('send groups', () => {
    //send included to DB
    let wereLeaders = [];
    let orderedGroups = [];
    let newLeaders = [];
    const newMongoGroups = new User(
        { userID: bot.included }
    )

    newMongoGroups.save()
        .then(() => console.log('saved'))
        .then(() => {
            Leader.findOne({}, {}, { sort: { 'created_at': -1 } }, function (err, post) {
                //find previous leaders in database
                wereLeaders = [...post.wereLeaders]
            }).then(() => {
                //forms groups
                let groups = bot.included.map(e => e)
                orderedGroups = formGroups(groups, wereLeaders)
            }).then(() => {
                //select Leaders
                newLeaders = selectLeaderFromArrays(orderedGroups, wereLeaders)
            })
                .then(() => {
                    //updates the leaders array
                    Leader.updateOne({ 'wereLeaders': wereLeaders }, { $set: { 'wereLeaders': newLeaders } })
                        .then(e => console.log(e))
                })
                .then(() => {
                    //prints groups and leaders to slack
                    let message = `Leaders are `;
                    newLeaders.map(e => {
                        message += `<@${e}> `
                    })
                    orderedGroups.map((e, i) => {
                        message += `\n Group ${i + 1} is `
                        e.map(e => {
                            message += `<@${e}>`
                        })
                    })
                    bot.postMessage(bot.general, message)
                })
        })
        .then(() => {
            bot.postMessageToChannel('general', 'Guten Apetit!!');
        })
        .catch(e => console.log(e))
})