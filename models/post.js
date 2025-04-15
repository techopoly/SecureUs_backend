const mongoConnect = require('../util/database');
const getDb = require('../util/database').getDb;


class Post {
    constructor(id, titele, content, author) {
        this.id = id;
        this.titele = titele;
        this.content = content;
        this.author = author;
    }

    save(){
        const db = getDb();
        db.collection('Posts').insertOne(this).then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
    }
}


exports.Post = Post;