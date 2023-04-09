import { MongoClient} from "mongodb";

let dbConnection

export const connectToDB = (cb) => {
    MongoClient.connect('mongodb://127.0.0.1:27017/test_app')
    .then(client => {
        dbConnection = client.db()
        return cb()
    })
    .catch(err => {
        console.log(err)
        return cb(err)
    })
}

export const getDB = () => dbConnection
