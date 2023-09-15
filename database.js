const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const LOCAL_URI = "mongodb://127.0.0.1:27017/loginproject";
mongoose
  .connect(LOCAL_URI)
  .then(() => {
    console.log("database connection established");
  })
  .catch((e) => {
    console.log(error);
  });

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

schema.methods.generateToken = async function () {
  try {
    const tokenuser = jwt.sign(
      { _id: this._id.toString() },
      "abcdefghijklmnopqrstuvwxyzabcdefghijkl"
    );
    this.tokens = this.tokens.concat({ token: tokenuser });
    await this.save();
    return tokenuser;
  } catch (error) {}
};

schema.pre("save", async function (next) {
  if(this.isModified("password")){
  this.password = await bcrypt.hash(this.password, 10);
   } next();
});

// model bn rha hai database me
const usermodel = mongoose.model("userdetails", schema);
module.exports = usermodel;
