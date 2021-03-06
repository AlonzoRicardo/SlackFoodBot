const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose
  .connect(process.env.DBURL, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const userSchema = new Schema({
  userID: []
}, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  })

const User = mongoose.model("User", userSchema);

module.exports = User;