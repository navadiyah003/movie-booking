const mongoose = require("mongoose");

// databse url
const DV = process.env.MONGO_URL;

const connectToDb = () => {
    mongoose
        .connect(DV, {
            useNewUrlParser: true,
        })
        .then(() => {
            console.log("Database Connected..");
        })
        .catch((err) => {
            console.log(err);
        });
}
module.exports = connectToDb