    const express =require('express');
    const bodyParser =  require('body-parser');
    const ForumRoutes =  require('./routes/forum');
    const UserRoutes = require('./routes/user_route');
    const Database = require('./util/database');


    const app = express();
    app.use(express.json());  
    app.use(bodyParser.urlencoded({extended:true}));
    
    Database.mongoConnect(() => {
        app.listen(5000);
    })

    app.use(ForumRoutes);
    app.use(UserRoutes)


    