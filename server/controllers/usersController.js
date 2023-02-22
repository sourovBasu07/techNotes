const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//? GET ALL USERS
//? GET /users
//? ACCESS PRIVATE

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

//? CREATE NEW USER
//? POST /users
//? ACCESS PRIVATE

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //? CONFIRM DATA
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(404).json({ message: "All fields are required" });
  }

  //? CHECK FOR DUPLICATE
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Username already exists!" });
  }

  //? HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10); //? SALT ROUNDS

  const userObject = { username, password: hashedPassword, roles };

  //? CREATE AND STORE NEW USER
  const user = await User.create(userObject);

  if (user) {
    return res.status(201).json({ message: `New user ${username} created` });
  } else {
    return res.status(400).json({ message: "Invalid user data received" });
  }
});

//? UPDATE A USER
//? PATCH /users
//? ACCESS PRIVATE

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

//? DELETE A USER
//? DELTE /users
//? ACCESS PRIVATE

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  const note = await Note.findOne({ user: id });

  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result.id} deleted`;

  res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
