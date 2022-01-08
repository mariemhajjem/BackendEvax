const mongoose = require('mongoose'); 

module.exports = async function () {

    try {
        await mongoose.connect("mongodb://localhost:27017/projet" 
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
