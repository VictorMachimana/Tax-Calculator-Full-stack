const express = require("express");
const app = express();
const fileHandler = require("fs");
const bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(express.json());
const json = fileHandler.readFileSync("salaries.json");
const salaries = JSON.parse(json);

//show
app.get("/salaries", (req, res) => {
  fileHandler.readFile("salaries.json", (err, data) => {
    if (err) res.send("File not found");
    else res.send(data);
  });
});

//show by ID
app.get("/salaries/:id", (req, res) => {
  const data = salaries.find(t => t.id === parseInt(req.params.id));
  fileHandler.readFile("salaries.json", data, err => {
    if (err) res.send("File not found");
    else res.send(data);
  });
});

//create
app.post("/salaries", (req, res) => {
  const item = {
    id: salaries.length + 1,
    name: req.body.name,
    salary: req.body.salary,
    monthlyTax: req.body.monthlyTax
  };
  salaries.push(item);
  const data = JSON.stringify(salaries, null, 2);

  fileHandler.writeFile("salaries.json", data, err => {
    if (err) throw err;
    res.send("File created");
  });
});

//delete
app.delete("/salaries", (req, res) => {
  const item = salaries.find(t => t.id === parseInt(req.params.id));

  const index = salaries.indexOf(item);
  salaries.splice(index, 1);

  const data = JSON.stringify(salaries, null, 2);

  fileHandler.writeFile("salaries.json", data, err => {
    if (err) throw err;
    res.send("File created");
  });
});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
