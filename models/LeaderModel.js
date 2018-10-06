const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

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