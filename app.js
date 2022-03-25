const { text } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Schema = mongoose.Schema;

const tasksScheme = new Schema({
  name: String,
  present: Boolean,
  age: Number,
  country: String,
});

const Task = mongoose.model("tasks", tasksScheme);

const uri =
  "mongodb+srv://ElizavetaGorelova:gorelova123321@cluster0.zkrjo.mongodb.net/backend?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.get("/allTasksSort", (req, res) => {
  const age = req.body.age;
  const sortingDirection = req.query.sortingDirection;
  if (sortingDirection) {
    Task.find()
      .sort({ age: sortingDirection })
      .then((result) => {
        res.send({ data: result });
      });
  } else {
    Task.find()
      .sort({ age: 1 })
      .then((result) => {
        res.send({ data: result });
      });
  }
});

app.get("/field", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const ageFiltr = req.query.ageFiltr;
  const nameFiltr = req.query.nameFiltr;
  if (ageFiltr && nameFiltr) {
    Task.find({ age: ageFiltr, name: nameFiltr }).then((result) => {
      res.send({ data: result });
    });
  } else {
    res.send("All data must be entered. Not enough data");
  }
});

app.get("/pagination", (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;

  Task.find()
    .skip((page - 1) * 10)
    .limit(limit)
    .then((result) => {
      res.send({ data: result });
    });
});

app.get("/sortPagination", (req, res) => {
  const age = req.body.age;
  const ageSort = req.query.ageSort;
  const limit = req.query.limit;
  const page = req.query.page;
  if (ageSort) {
    Task.find()
      .sort({ age: ageSort })
      .skip((page - 1) * 10)
      .limit(limit)
      .then((result) => {
        res.send({ data: result });
      });
  } else {
    Task.find()
      .sort({ age: 1 })
      .skip((page - 1) * 10)
      .limit(limit)
      .then((result) => {
        res.send({ data: result });
      });
  }
});

app.get("/limitedfields", (req, res) => {
  const value = ["age", "name"];
  Task.find({}, value).then((result) => {
    res.send({ data: result });
  });
});

app.post("/createTasks", (req, res) => {
  const task = new Task(req.body);
  task.save().then((result) => {
    Task.find().then((result) => {
      res.send({ data: result });
    });
  });
});

app.delete("/delete", (req, res) => {
  if (req.query.id) {
    Task.deleteOne({ _id: req.query.id }).then(() => {
      Task.find().then((result) => {
        res.send({ data: result });
      });
    });
  }
});

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
