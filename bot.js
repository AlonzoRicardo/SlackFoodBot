require('dotenv').config()
const people = require('./seed.json')
const arrayHandler = require('./randomGrouping')
const Bot = require('slackbots');
const User = require('./models/UserModel')


// create a bot
let settings = {
    token: process.env.TOKEN,
    name: 'niggabot',
};

let bot = new Bot(settings);
//seed

bot.on('start', function() {
    
    bot.included = [];
    people.map(e => bot.included.push(e.userID))
    bot.previousLeaders = [];
    
    //bot.postMessageToChannel('general', 'Yall wann hotwings???!!');
    
});

// Messages
bot.on('message', data => {
    
    if(data.type !== 'message'){
        return
    }
    
    messageHandler(data.text, data.user, data.channel)
})

    function messageHandler (message, user, channel) {

        if (message.includes(' include me')) {
            if(bot.included.indexOf(`${user}`) !== -1) {
                console.log(bot.included);
                bot.postMessage(channel, `<@${user}> Mah NIG, u already a homie! ${bot.included}`)    
            } else {
                bot.included.push(user)
                
                bot.postMessage(channel, `<@${user}> Mah NIG, Welcome to the gang! ${bot.included}`) 
            }
        }

        if (message.includes(' declude me')) {
            let i = bot.included.indexOf(`${user}`)
            bot.included.splice(i,1)
            console.log(bot.included);
            bot.postMessage(channel, `<@${user}> U out of the gang! ${bot.included}`)
        }

        if (message.includes(' i want pizza')) {
             bot.postMessage(channel, `<@${user}> was i mentioned?`)
        }

        //call 11pm
        if (message.includes(' show groups')) {
            //send random array to DB
            const newMongoGroups = new User (
                {userID: bot.included}
                )
            newMongoGroups.save()
                .then(() => console.log('saved'))
                .catch((e) => {console.log(e)})

            //forms groups
            let groups = bot.included.map(e => e)
            let orderedGroups = arrayHandler(groups)
            //select Leaders


            //display groups and leaders
            orderedGroups.forEach((e,i) => 
               bot.postMessage(channel, `Group ${i+1} is ${e}`)
            )


        }
    }
   