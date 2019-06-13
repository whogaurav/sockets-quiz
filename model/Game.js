const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    name: String,
    groupId: String,
    totalScore: Number,
    time: Number,
    answers: [
      {
        quesNo: String,
        ans: String
      }
    ]
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = mongoose.model("Game", gameSchema);
