const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
const port = 3500;
app.use(cors());

const contractObject = [];

app.get("/", (req, res) => {
  res.send("Hello, Express.js!");
});

app.post("/postContract", (req, res) => {
  const address = req.body.address;
  const approved = req.body.approved;
  const arbiter = req.body.arbiter;
  const value = req.body.value;
  const beneficiary = req.body.beneficiary;

  console.log(approved);

  const object = {
    address,
    approved,
    arbiter,
    value,
    beneficiary,
  };

  contractObject.push(object);
  res.send("saved");
});

app.post("/changeApproved", (req, res) => {
  const address = req.body.address;
  const foundObject = contractObject.find((obj) => obj.address === address);

  // If the object is found, update the approved property to true
  if (foundObject) {
    foundObject.approved = true;
    res.send("done");
  }
});
app.get("/getContracts", (req, res) => {
  res.send(contractObject);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
