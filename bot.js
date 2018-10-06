require('dotenv').config()

const formGroups = require('./randomGrouping')
const Bot = require('slackbots');
const User = require('./models/UserModel')
const Leader = require('./models/LeaderModel')
const selectLeaderFromArrays = require('./leaderSelector')

//intialize empty leader array 
const leadersArray = new Leader(
    { wereLeaders: [] }
)

leadersArray.save()
    .then(() => console.log('leadersArraySaved'))
    .catch((e) => console.log(e))

// create a bot
let settings = {
    token: process.env.TOKEN,
    name: 'niggabot'
};

let bot = new Bot(settings);
//seed
bot.on('start', function () {

    bot.included = [];
    bot.previousLeaders = [];

    bot.postMessageToChannel('general', 'Yall wann hotwings???!!');
});

// Messages
bot.on('message', data => {
    if (data.type !== 'message') {
        return
    }
    console.log(data)
    messageHandler(data.text, data.user, data.channel)
})

function messageHandler(message, user, channel) {

    if (message.includes(' include me')) {
        if (!bot.included.indexOf(`${user}`) !== -1) {
            bot.included.push(user)
            bot.postMessage(channel, `<@${user}> Mah NIG, Welcome to the gang! ${bot.included}`)
        } else {
            console.log(bot.included);
            bot.postMessage(channel, `<@${user}> Mah NIG, u already a homie! ${bot.included}`)
        }
    }

    if (message.includes(' declude me')) {
        let i = bot.included.indexOf(`${user}`)
        bot.included.splice(i, 1)
        console.log(bot.included);
        bot.postMessage(channel, `<@${user}> U out of the gang! ${bot.included}`)
    }

    if (message.includes(' i want pizza')) {
        bot.postMessage(channel, `<@${user}> was i mentioned?`)
    }

    //call 11pm
    if (message.includes(' send groups')) {
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
                    console.log(wereLeaders, 'were leaders')
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
                        bot.postMessage(channel, message)
                    })
            })
            .catch(e => console.log(e))





        //display groups and leaders

    }
}
