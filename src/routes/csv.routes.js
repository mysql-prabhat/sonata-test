const express = require("express");
const router = express.Router();
const csvController = require("../controller/csv.controller");
const upload = require("../middlewares/upload");

let routes = (app) => {console.log('aaa');
  router.post("/upload",upload.single("file"), csvController.upload);
  router.get("/csv", csvController.getcandidate);

  app.use("/api/csv", router);
};

module.exports = routes;
