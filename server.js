const express = require("express");
const app = express();
const db = require("./src/models/");
const initRoutes = require("./src/routes/csv.routes");

global.__basedir = __dirname + "/";

app.use(express.urlencoded({ extended: true }));
//Route initializing here
initRoutes(app);

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

let port = 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
