const express = require('express');
var wagner = require('wagner-core');
const api = require('./api');
var app = express();
var setupAuth = require('./auth');
require('dotenv').config();


setupAuth(User, app);

app.use((req, res)=>{
    if(!req.user){
        res.redirect('/login');
    }
});

app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: false }));


models = require('./models')(wagner);
var User = models.User;
setupAuth(User, app);


setupAuth(User, app);

app.use('/api/v1', require('./api')(wagner));

app.listen(3000, ()=>{
    console.log(` server started and listening on port 3000`);
});