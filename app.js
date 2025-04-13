    const express =require('express');
    const bodyParser =  require('body-parser');
    const ForumRoutes =  require('./routes/forum');


    const app = express();

    app.use(ForumRoutes);



    app.listen(5000);