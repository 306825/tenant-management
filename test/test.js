const assert = require('assert');
const express = require('express');
var wagner = require('wagner');
require('dotenv').config();

describe('Tenant',()=>{

    let app = express();
    let Tenant;
    let models;
    let server;

    before(()=>{
        //start the server

        models = require('../models')(wagner);

        app.use(require('../api'));

        Tenant = models.Tenant;

        server = app.listen(3000);

    });

    it('should create a new teant on the server', (done)=>{
        assert
    })

    after(()=>{
        server.close();
    })
})