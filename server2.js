const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const objectId = require("mongodb").ObjectID;
const cors = require("cors");

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient(
  "mongodb+srv://atlas:antantayarik322@users1-5hw5p.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

let dbClient;

app.use(cors());
app.use(express.static(__dirname + "/public"));

mongoClient.connect((err, client) => {
  if (err) return console.log(err);
  dbClient = client;
  app.locals.collection = client.db("users1").collection("users");
  app.listen(8000, () => {
    console.log("-----------Success connecting to the server!-----------");
  });
});

app.get("/users", (req, res) => {
  let newObj = [];
  const collection = req.app.locals.collection;
  collection.find({}).toArray((err, users) => {
    if (err) return console.log(err);
    users.map(value => {
      newObj.push(Object.values(value)[1]);
    });
    res.send(newObj);
  });
});

app.post("/user", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const loginw = req.body.login;
  const db = req.app.locals.collection;
  db.findOne({ login: loginw }, (err, result) => {
    if (result != null) {
      delete result.pass;
      res.send(result);
    } else {
      res.sendStatus(400);
    }
  });
});

app.post("/edit", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const loginw = req.body.login;
  const db = req.app.locals.collection;
  const find = { login: loginw };
  const newInfo = {
    $set: {
      email: req.body.email,
      name: req.body.name,
      mobile: req.body.mobile,
      bday: req.body.bday,
      profession: req.body.profession,
      status: req.body.status
    }
  };
  db.updateOne(find, newInfo, (err, result) => {
    if (result != null) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  });
});

app.post("/users", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const loginq = req.body.login;
  const passq = req.body.pass;
  const db = req.app.locals.collection;
  db.findOne({ login: loginq }, (err, result) => {
    if (result != null && Object.values(result)[2] == passq) {
      console.log(loginq + " is now online");
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
});

app.post("/new", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  let usersCount =
    parseInt(fs.readFileSync("./src/assets/count.txt", "utf8")) + 1;
  const db = req.app.locals.collection;
  let myobj = {
    _id: usersCount,
    login: req.body.login,
    pass: req.body.pass,
    email: req.body.email,
    name: "",
    mobile: "",
    bday: "",
    profession: "",
    status: ""
  };

  db.findOne({ login: req.body.login }, (err, resLog) => {
    if (resLog == null) {
      db.findOne({ email: req.body.email }, (err, resEmail) => {
        if (resEmail == null) {
          db.insertOne(myobj, () => {
            console.log("New user register: " + req.body.login);
            res.sendStatus(200);
          });
          fs.writeFileSync("./src/assets/count.txt", usersCount);
        }
      });
    } else {
      res.sendStatus(403);
    }
  });
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
