//importing dependencies
const mongoose = require("mongoose");
const { dbURI } = require("./credentials");
mongoose.set("strictQuery", true);

const connectDB = () => {
  mongoose
    .connect(dbURI, { useNewUrlParser: true })
    .then(() => console.log("db connected"))
    .catch((err) => console.log(err));
};

module.exports = { connectDB };
