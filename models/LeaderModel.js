const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

mongoose
  .connect(process.env.DBURL, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const leaderSchema = new Schema({
  wereLeaders: Array,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Leader = mongoose.model("Leader", leaderSchema);

module.exports= Leader;