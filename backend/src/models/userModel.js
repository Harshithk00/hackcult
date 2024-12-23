// import pool from "../config/db.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import multer from "multer";

// // Multer setup
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Services
// export const getAllUsersService = async () => {
//     try {
//         const result = await pool.query("SELECT * FROM users");
//         return result.rows;
//     } catch (error) {
//         throw error;
//     }
// };

// export const getUserByIdService = async (id) => {
//     try {
//         const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };

// export const updateUserService = async (id, name, email) => {
//     try {
//         const result = await pool.query(
//             "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
//             [name, email, id]
//         );
//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };

// export const deleteUserService = async (id) => {
//     try {
//         const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };

// export const createUserService = async (name, email, password) => {
//     const salt = await bcrypt.genSalt(10);
//     const hashpass = await bcrypt.hash(password, salt);
//     try {
//         const result = await pool.query(
//             "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
//             [name, email, hashpass]
//         );
//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };

// export const userLoginService = async (email, password) => {
//     try {
//         const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//         if (result.rows.length === 0) {
//             throw new Error("User not found");
//         }

//         const user = result.rows[0];
//         const storedPassword = user.password_hash;

//         const isPasswordValid = await bcrypt.compare(password, storedPassword);
//         if (!isPasswordValid) {
//             throw new Error("Invalid password");
//         }

//         const token = jwt.sign(
//             { id: user.id, email: user.email },
//             process.env.JWT_SECRET_KEY,
//             { expiresIn: "1h" }
//         );

//         return { user, token };
//     } catch (error) {
//         throw error;
//     }
// };

// // File upload service
// export const uploadFileService = async (userId, file) => {
//     try {
//         const result = await pool.query(
//             "INSERT INTO files (filename, file_data, user_id) VALUES ($1, $2, $3) RETURNING *",
//             [file.originalname, file.buffer, userId]
//         );
//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };

// export const getUserFilesService = async (userId) => {
//     try {
//         const result = await pool.query("SELECT * FROM files WHERE user_id = $1", [userId]);
//         return result.rows;
//     } catch (error) {
//         throw error;
//     }
// };

// // Multer APIs
// export const uploadFile = upload.single("file");

// export const handleFileUpload = async (req, res, next) => {
//     const { user_id } = req.body;
//     const file = req.file;

//     if (!user_id || !file) {
//         return res.status(400).json({ message: "User ID and file are required" });
//     }

//     try {
//         const uploadedFile = await uploadFileService(user_id, file);
//         res.status(201).json({ message: "File uploaded successfully", file: uploadedFile });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getUserFiles = async (req, res, next) => {
//     const { user_id } = req.params;

//     try {
//         const files = await getUserFilesService(user_id);
//         if (files.length === 0) {
//             return res.status(404).json({ message: "No files found for this user" });
//         }
//         res.status(200).json({ files });
//     } catch (error) {
//         next(error);
//     }
// };


