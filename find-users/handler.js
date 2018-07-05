"use strict"

const MongoClient = require('mongodb').MongoClient

var clientsDB; // Cached connection-pool for further requests.

module.exports = (event, context) => {
    prepareDB()
        .then((users) => {
            const record = {
                "name": event.body
            };
            users.collection("users")
                .find().limit(50).toArray((err, docs) => {
                    if (err) {
                        return context.fail(err.toString());
                    }
                    context
                        .status(200)
                        .succeed(docs)
                });
        }).catch(err => {
            context.fail(err.toString());
        });
}
const prepareDB = () => {
    const url = "mongodb://" + process.env.mongo + ":27017/clients"

    return new Promise((resolve, reject) => {
        if(clientsDB) {
            console.error("DB already connected.");
            return resolve(clientsDB);
        }

        console.error("DB connecting");

        MongoClient.connect(url, (err, database) => {
            if(err) {
                return reject(err)
            }
    
            clientsDB = database.db("clients");
            return resolve(clientsDB)
        });
    });
}