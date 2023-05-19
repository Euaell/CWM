import mongoose from "mongoose";
import configs from './config/configs'
import app from './app'

// Surpress deprecation warnings
// strictQuery: false allows for queries like { status: 'active' } instead of { status: { $eq: 'active' } }
//                          and empty queries like {} in find() instead of { $and: [] }

mongoose.set('strictQuery', false);
mongoose.connect(`${configs.MONGO_URI}/${configs.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        console.log(`Connected to MongoDB at ${configs.MONGO_URI}/${configs.MONGO_DB}`)
        app.listen(configs.PORT, () => {
            console.log(`Server is running on ${configs.HOST}:${configs.PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    })
