const express = require("express"),
app = express(),
nodeml = require("./controllers/nodeml.cf"),
layouts = require("express-ejs-layouts"),
mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/sooljari",
  {useNewUrlParser : true}
);

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB connected.")
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(layouts);

app.use(
express.urlencoded({
  extended: false
})
);
app.use(express.json());

app.use((req, res, next) => {
console.log(`request made to: ${req.url}`);
next();
});

app.get("/", (req, res) => res.render("index"));
app.get("/:userId", nodeml.recommendation);

app.listen(app.get("port"), () => {
console.log(`Server running at http://localhost:${app.get("port")}`);
});
