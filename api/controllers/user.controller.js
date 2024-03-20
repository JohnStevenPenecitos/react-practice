const UserModel = require("../model/UserModel.js");
const bcrypt = require("bcrypt");
const generateTokenAndSetCookie = require("../utils/generateToken.js");

// const userSignUp = async (req, res) => {
//   try {
//     const { firstName, lastName, userName, confirmpassword, password, age } =
//       req.body;

//     // if (password !== confirmpassword) {
//     //   return res.status(400).json({ error: "Password do not match!" });
//     // }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const defaultPicApi = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;

//     const user = await UserModel.findOne({ userName });

//     if (user) {
//       return res.status(400).json({ error: "Username already exists!" });
//     }

//     const newUser = new UserModel({
//       firstName,
//       lastName,
//       userName,
//       password: hashedPassword,
//       age,
//       profilePhoto: defaultPicApi,
//     });

//     if (newUser) {
//       generateTokenAndSetCookie(newUser._id, res);
//       await newUser.save();

//       // Respond with a success message
//       res.status(201).json({ message: "Sign up successfully!" });
//     }
//   } catch (error) {
//     // next(error);
//     console.log("Error in signup controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const userSignUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, confirmpassword, password, age } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !confirmpassword ||
      !password ||
      !age
    ) {
      return res.status(400).json({ error: "Please fill in all fields!" });
    }

    // Check if passwords match
    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Passwords do not match!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultPicApi = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;

    const user = await UserModel.findOne({ userName });

    if (user) {
      return res.status(400).json({ error: "Username already exists!" });
    }

    const newUser = new UserModel({
      firstName,
      lastName,
      userName,
      password: hashedPassword,
      age,
      profilePhoto: defaultPicApi,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      const userData = {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userName: newUser.userName,
        profilePhoto: newUser.profilePhoto,
      };

      res.status(201).json({
        message: "Sign up successfully!",
        user: userData,
      });
    }

    // Respond with a success message
    // return res.status(201).json({ message: "Sign up successfully!" });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await UserModel.findOne({ userName });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchUser = async (req, res) => {
  try {
    const { firstName } = req.query;

    const users = await UserModel.find({
      firstName: { $regex: new RegExp(firstName, "i") },
    });

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    const result = users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhoto: user.profilePhoto,
      _id: user._id,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { userSignUp, loginUser, logout, searchUser };
