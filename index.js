const express = require('express');
const app = express();
const port = 1234;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient; const {
  ObjectId
} = require('mongodb');

app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqdvo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {

  const opportunitiesCollection = client.db("volunteer-network").collection("opportunities");
  const regCollection = client.db("volunteer-network").collection("reg");

  // All Opportunities Get Api
  app.get('/opportunities', (req, res) => {
    opportunitiesCollection.find({})
      .toArray((err, docx) => {
        res.send(docx)
      })
  })

  // One Opportunity Get Api
  app.get('/opportunity/:ro', (req, res) => {
    opportunitiesCollection.findOne({
      url: req.params.ro
    })
      .then(result => {
        res.send(result)
      })
      .catch(error => {
        res.send("Request Error")
      })
  })

  // Add Registration Form
  app.post('/addRegForm', (req, res) => {
    regCollection.insertOne(req.body)
      .then(result => {
        if (result.insertedCount === 1) {
          res.send("Adding Successful...")
        }
      })
  })

  // Get All registration data with email
  app.get("/registrations", (req, res) => {
    regCollection.find({
      email: req.query.email
    })
      .toArray((err, docx) => {
        res.send(docx)
      })
  })

  // Get Only registration library with email
  app.get("/registrationz", (req, res) => {
    regCollection.find({
      email: req.query.email
    })
      .toArray((err, docx) => {
        res.send(docx.email)
      })
  })

  // Get registration data with email & library
  app.get("/registration", (req, res) => {
    regCollection.findOne({
      email: req.query.email,
      library: req.query.library
    })
      .then(result => {
        res.send(result)
      })
  })

  // Get All registration data without validation
  app.get("/allRegistration", (req, res) => {
    regCollection.find({})
      .toArray((err, docx) => {
        res.send(docx)
      })
  })

  // Delete one registration data with _id
  app.delete("/registrationDelete", (req, res) => {
    regCollection.deleteOne({
      _id: ObjectId(req.query.id)
    })
      .then(result => {
        if (result.deletedCount) {
          res.send("Delete Successful....")
        }
      })
  })

  // Get Opportunities data with many url
  app.post("/opportunityByMUrl", (req, res) => {
    opportunitiesCollection.find({ url: { $in: req.body.library } })
      .toArray((err, docx) => {
        res.send(docx)
        console.log(req.body)
      })
  })

  // app.get('/OpportunitiesAdd', (req, res) => {
  //   opportunitiesCollection.insertMany(opportunities)
  //   .then(result => {
  //     res.send("Added...")
  //   })
  // })
})

app.get('/', (req, res) => {
  res.send('Loading.....')
})

app.listen(port)