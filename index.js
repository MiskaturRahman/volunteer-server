const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const password = "424wotDDSDHO1ssE"
const userid = "volunteer"

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.grz5f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5500

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const AllActivityCollection = client.db("volunteerActivity").collection("activities");
    const AllRegistrationCollection = client.db("volunteerActivity").collection("registration");

    app.post('/allActivities', (req, res) => {
        const programs = req.body;
        AllActivityCollection.insertMany(programs)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            })
    })

    app.get('/allProgram', (req, res) => {
        AllActivityCollection.find({}).limit(20)
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/programRegistration', (req, res) => {
        const registration = req.body;
        AllRegistrationCollection.insertOne(registration)
            .then(result => {

                res.send(result.insertedCount > 0);
            })
    })


    app.get('/registrationHistory', (req, res) => {
        AllRegistrationCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

})

app.listen(port)