// npm i mongoose
const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect( process.env.MONGODB_ATLAS_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false
        });

        console.log('base de datos conectada...');

    } catch (error) {
        console.log(error);
        throw new Error('Se ha producido un error a la hora de iniciar la base de datos');
    }

}

module.exports = {
    dbConnection,
}