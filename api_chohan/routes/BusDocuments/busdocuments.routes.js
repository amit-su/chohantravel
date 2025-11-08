const express = require("express");
const multer = require("multer");
const {
  getbusdocuments,
  updatebusdocumentsdetails,
  deleteBusdoc,
  gateFile,
  gateAllPendingBusDocuments,
} = require("./busdocuments.controller");
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const BusdocRouter = express.Router();
BusdocRouter.get("/:id", getbusdocuments);
BusdocRouter.post("", upload.single("file"), updatebusdocumentsdetails);
BusdocRouter.delete("/:id", deleteBusdoc);
BusdocRouter.get("/file/:id", gateFile);
BusdocRouter.get("/", gateAllPendingBusDocuments);

module.exports = BusdocRouter;
