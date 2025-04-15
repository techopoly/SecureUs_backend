const mongodb = require('mongodb');
const MongoClient =  mongodb.MongoClient;

let _db;


const mongoConnect = (callback) => {
    MongoClient.connect(
        'mongodb+srv://ishmam:500miles@cluster1.cj1eras.mongodb.net/Forum?retryWrites=true&w=majority&appName=Cluster1'

    ).then(client =>{
        console.log('Ishmam has Connected the database!');
        _db = client.db();
        callback(client);
    
    }).catch(err =>{
        console.log(err);
    })
    
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


