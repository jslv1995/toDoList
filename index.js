const express = require("express");
const app = express();
const dotenv = require("dotenv");
require("dotenv").config();
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/todoTask");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(() => {
  console.log("Connected to MongoDB Atlas successfully");
  app.listen(3000, () => console.log("Server Up and running on port 3000"));
});

// GET METHOD
app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({});
    res.render("todo.ejs", { todoTasks: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching tasks");
  }
});

//POST METHOD
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while saving the task");
  }
});

//UPDATE
app
  .route("/edit/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const tasks = await TodoTask.find({});
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while fetching tasks for edit");
    }
  })
  .post(async (req, res) => {
    const id = req.params.id;
    try {
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while updating the task");
    }
  });

//DELETE
app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndRemove(id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the task");
  }
});

// Express.js Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
