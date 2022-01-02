const mongoose = require('mongoose'); 

module.exports = async function () {

    try {
        await mongoose.connect("mongodb+srv://haikel:haikel@cluster0.catdk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" 
        , {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
        );
        console.log('Database is connected!')
    }
    catch (err) {
        console.log(`Cannot connect to database! error: ${err}`)
    }
}
