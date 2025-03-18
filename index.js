const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
mongoose.connect("mongodb+srv://user:user@cluster0.qaool.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const userSchema = mongoose.Schema({
  teamName: String,
  bingoStatus: Number,
  solved: [Number],
  time: Date,
});

const userModel = mongoose.model("userModel", userSchema);

app.use(express.json());
app.use(cors());

app.get("/",async(req,res)=>{
    await userModel.deleteMany({})
})

app.post("/api/login", async (req, res) => {
    console.log(1);
    console.log(req.body);
    
    
  const { team_name } = req.body;
  if ((await userModel.findOne({ teamName: team_name })) == null) await userModel.insertMany([{ teamName: team_name, bingoStatus: 0, solved: [], time: new Date() }]);
  res.json({
    status: "success",
  });
});

app.post("/api/findUserDetails", async (req, res) => {
  const { team_name } = req.body;
  const result = await userModel.findOne({ teamName: team_name });
  res.json(result);
});

app.get("/api/allTeams", async (req, res) => {
  const result = await userModel.find({});
  res.json({
    data: result,
  });
});

app.post("/api/updateDetails", async (req, res) => {
  const { team_name, id, bingoStatus } = req.body;
  console.log(req.body);
  
  await userModel.updateOne({ teamName: team_name }, { $set: { bingoStatus, time: new Date() }, $push: { solved: id } });
});

app.listen(8080, () => {});
