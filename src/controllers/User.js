import { validateEmail } from "../../utils/index.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  // recibe por body los strings name, email, password y role (opcional)
  try {
    //traemos las props del body
    const { name, email, password, role } = req.body;
    //iniciamos validaciones
    if (!name?.length)
      return res.status(400).json({ message: "Missing name field" });
    if (!email?.length)
      return res.status(400).json({ message: "Missing email field" });
    if (email.includes(" "))
      return res.status(200).json({ message: "Email cant contains spaces" });
    if (!validateEmail(email))
      return res.status(200).json({ message: "Email is not email type" });
    if (password.length < 8)
      return res.status(200).json({ message: "Password too short" });
    if (password.includes(" "))
      return res
        .status(200)
        .json({ message: "Password can not contain spaces" });
    if (role?.length && role !== "user" && role !== "admin")
      return res
        .status(200)
        .json({ message: "Defined role must be user or admin" });
    const exists = await User.findOne({ email }); //null si no encuentra
    if (exists) return res.status(409).json({ message: "User already exists" });
    //todas las validaciones check, pasamos a la logica de creacion
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({ name, email, role, password });
    await user.save();
    const objectUser = user.toObject();
    delete objectUser.password; //quitamos el pass para devolver el objeto
    return res.status(201).json(objectUser);
  } catch (error) {
    console.error("error createUser: ", error);
    res.status(500).json({
      message: "Server error, check API console if u are a dev",
    });
  }
};

export const getUser = async (req, res) => {
  //recibe por body el objeto user sin la prop password
  try {
    const user = await User.find().select("-password").lean(); //traer el user sin pass como objeto
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email?.length)
      return res.status(400).json({ message: "Email can not be empty" });
    if (!validateEmail(email))
      return res.status(404).json({ message: "Email must be email type" });
    const decodedEmail = decodeURIComponent(email); //decodificamos caracteres URL-encoded en caso de existir
    const foundUser = await User.findOne({ email: decodedEmail })
      .select("-password")
      .lean(); // ignoramos el campo password y lo transformamos en objeto
    if (!foundUser) return res.status(404).json({ message: "User not found" });
    res.json(foundUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
