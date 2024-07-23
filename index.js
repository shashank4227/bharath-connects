const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
var methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.set("/css", express.static(path.join(__dirname, "/public/css")));
app.set("/js", express.static(path.join(__dirname, "/public/js")));
app.set("/img", express.static(path.join(__dirname, "/public/img")));

let posts = [
  {
    id: uuidv4(),
    username: "username here",
    content: "content here",
  },
];

app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/posts/new", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  let newPost = { id, username, content };
  posts.push(newPost);
  res.redirect("/");
});

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("see.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("edit.ejs", { post });
});

app.patch("/posts/:id/edit", (req, res) => {
  let { content } = req.body;
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  post.content = content;
  res.redirect("/");
});

app.delete("/posts/:id/delete", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
