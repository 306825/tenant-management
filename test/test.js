const assert = require('assert');
const express = require('express');
var wagner = require('wagner-core');
const superagent = require('superagent');
const res = require('express/lib/response');
const mongoose = require('mongoose');
const setupAuth = require('./auth');

require('dotenv').config();

describe('tenant-management api', function () {
    this.timeout(8000)
    let app = express();
    let Tenant;
    let models;
    let server;
    const URL = 'localhost:3000'
    var Property;

    before(() => {
        //start the server
        app.use(express.json());
        app.use(require('body-parser').urlencoded({ extended: false }));
        models = require('../models')(wagner);


        User = models.User;

        setupAuth(User, app);

        app.use(require('../api')(wagner));

        Tenant = models.Tenant;
        Property = models.Property;

        server = app.listen(3000);


        Tenant.deleteMany({}, (err) => {
            assert.ifError(err);
        });

        Property.deleteMany({}, (err) => {
            assert.ifError(err);
        });


    });

    describe('Tenant', function () {
        this.timeout(8000);
        it('should create a new tenant and add them to a property', (done) => {

            const newTenant = {
                name: 'testname',
                surnme: 'testsurname',
                rent_amount: 2500
            }

            const myproperty3 = {
                name: 'testpropertyname',
                property_type: 'Cortage Set',
                max_number_of_tenants: 10,

            }

            Property.create(myproperty3, (error, propertydocument) => {
                assert.ifError(error);
                superagent.post(URL + '/addtenant/' + propertydocument._id).send(newTenant).end((err, res) => {
                    assert.ifError(err);
                    assert.ok(res.body);
                    assert.equal(res.body.tenants.length, 1);
                    done();
                });
            });

        });

        it('should should set the status of the client to inactive', () => {
            //superagent
            //done();
        })
    });

    describe('Property', function () {
        this.timeout(10000);
        const myproperty = {
            name: 'testpropertyname',
            property_type: 'Cortage Set',
            max_number_of_tenants: 10,

        }

        it('should add a property to the database', (done) => {
            superagent.post(URL + '/addproperty').send(myproperty).end((err, res) => {
                assert.ifError(err);
                assert.ok(res.body);
                assert.equal(res.body.max_number_of_tenants, 10);
                done();
            });
        });

        it('should not add a tenant if the maximum capacity has been reached', (done) => {

            const myproperty4 = {
                name: 'testpropertyname',
                property_type: 'Cortage Set',
                max_number_of_tenants: 3,
                tenants: [mongoose.Types.ObjectId(), mongoose.Types.ObjectId(), mongoose.Types.ObjectId()]
            }

            Property.create(myproperty, (err, propertydocument) => {
                if (err) {
                    assert.ifError(err);
                };
                superagent.get(URL + '/property/' + propertydocument._id).end((err, res) => {
                    assert.ifError(err);
                    assert.equal(res.text, 'Property capacity reached');
                    done();
                });
            });


        })

        it('shoul add a the _id of the tenant to the tenants array', (done) => {

            const myproperty1 = {
                name: 'testpropertyname',
                property_type: 'Cortage Set',
                max_number_of_tenants: 6,

            }

            Property.create(myproperty1, (err, propertydocument) => {
                if (err) {
                    return err;
                };
                superagent.get(URL + '/property/' + propertydocument._id).end((err, res) => {
                    assert.ifError(err);
                    assert.ok(res.body);
                    done();
                });

            });
        });

        it('should remove a tenant id from the teants array in property document', (done) => {

            const myproperty1 = {
                name: 'testpropertyname3',
                property_type: 'Cortage Set',
                max_number_of_tenants: 7,
                tenants: []

            }

            const myObjectId = mongoose.Types.ObjectId();

            myproperty1.tenants.push(mongoose.Types.ObjectId());
            myproperty1.tenants.push(myObjectId)

            myproperty1.tenants.push(mongoose.Types.ObjectId());
            myproperty1.tenants.push(mongoose.Types.ObjectId());
            myproperty1.tenants.push(mongoose.Types.ObjectId());

            assert.equal(myproperty1.tenants.length, 5);
            assert.notEqual(myproperty1.tenants.indexOf(myObjectId), -1);

            Property.create(myproperty1, (err, property_document) => {

                superagent.delete(URL + '/property/tenant/' + property_document._id + '/' + myObjectId).end((err, res) => {
                    assert.ifError(err);
                    assert.equal(res.body.tenants.indexOf(myObjectId), -1);
                    assert.equal(res.body.tenants.length, 4);
                    console.log(res.body.tenants);
                    console.log(myObjectId);
                    done();
                });
            });

        })
    })

    after(() => {
        server.close();
    })
})