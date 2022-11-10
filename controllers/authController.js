const createAvatar = require("../helpers/createAvatar");
const tokenCreater = require("../helpers/createToken");
const {
  hashingPassword,
  comparePassword,
} = require("../helpers/handlerPassword");
const RequestError = require("../helpers/RequestError");

const {
  userSearch,
  createUser,
  signup,
  logout,
  updateStatus,
  updateUserAvatar,
} = require("../services/auth");
const { SECRET_KEY } = process.env;
const path = require("path");
const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userSearch(email);
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const hashedPass = await hashingPassword(password);
  const avatarURL = createAvatar(email);
  const result = await createUser(name, email, hashedPass, avatarURL);
  res.status(201).json({ email: result.email, password: result.password });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await userSearch(email);
  const passCompare = await comparePassword(password, user.password);

  if (!user || !passCompare) {
    throw RequestError(401, "Email or password is wrong");
  }

  const token = tokenCreater({ id: user._id }, SECRET_KEY);
  await signup(user._id, { token });
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      user: {
        email,
        subscription,
      },
    },
  });
};

const logoutController = async (req, res) => {
  const { _id } = req.user;
  await logout(_id, { token: null });
  res.status(204).json("No Content");
};

const updateSubController = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const user = await updateStatus(
    _id,
    { subscription },
    { runValidators: true }
  );
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      user: {
        email: user.email,
        subscription,
      },
    },
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const extention = originalname.split(".").pop();
  const filename = `${_id}.${extention}`;
  const resultUpload = path.join(avatarsDir, filename);
  Jimp.read(tempUpload)
    .then((_id) => {
      return _id.resize(250, 250).write(resultUpload);
    })
    .catch((err) => {
      console.log(err);
    });
  const avatarURL = path.join("avatars", filename);
  await updateUserAvatar(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
};

module.exports = {
  registerController,
  loginController,
  getCurrent,
  logoutController,
  updateSubController,
  updateAvatar,
};
