const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    userName: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 8,
    },
    age: {
      type: String,
      require: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
