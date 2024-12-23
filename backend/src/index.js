import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import bcrypt from "bcrypt";
import multer from "multer";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import verifyToken from "./verifyToken.js";
import e from "express";

dotenv.config();
const app = express();

// console.log(process.env.DB_DATABASE)
const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json({ limit: "500mb" })); // JSON payloads
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is: ${result.rows[0].current_database}`);
  } catch (error) {
    console.error("Error executing query:", error.stack);
    if (error.code === "ECONNRESET") {
      return res
        .status(500)
        .send("Database connection was reset. Please try again.");
    }
    res.status(500).send("Error querying the database.");
  }
});

const saltRounds = 10;

app.post("/api/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  // console.log(req.body)
  try {

    const checkResult = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [fullName]
    );

    if (checkResult.rows.length > 0) {
      res.redirect("/");
    } else {
      // Ensure password is provided
      if (!password) {
        console.error("Password is required");
        return res.status(400).send("Password is required");
      }

      // Hash the password using bcrypt
      const hash = await bcrypt.hash(password, saltRounds);
      
      const result = await pool.query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
        [fullName, email, hash]
      );

      const user = result.rows[0];

      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const storedPassword = user.password_hash;
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, storedPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure in production
      maxAge: 3600000, // 1 hour expiration
      sameSite: "Strict", // Allows cross-origin requests
    });

    return res.json({ status: 200, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//upload file
app.post("/api/upload", verifyToken, async (req, res) => {
  try {
    const { encryptedData, fileExtension, filename } = req.body;
    // console.log(encryptedData)

    const user_id = req.userId || 8;
    const ownerEmail = req.userEmail;
    const tempEmail = req.userEmail;

    console.log(1);
    if (!fileExtension || !ownerEmail || !encryptedData) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO files (filename, file_data, user_id, owner_email,temp_email, extention) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [filename, encryptedData, user_id, ownerEmail, tempEmail, fileExtension]
    );

    res
      .status(201)
      .json({ message: "File uploaded successfully", file: result.rows[0] });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/download", verifyToken, async (req, res) => {
  const { id } = req.body;

  const userId = req.userId;
  const userEmail = req.userEmail;

  // if(id != userId)return res.status(401).json({error: "You are not authorized to download this file"});

  // const id = 16;
  const result = await pool.query("SELECT * FROM files WHERE id = $1", [id]);
  res.send(result.rows[0].file_data);
});

app.post("/api/verify-token", verifyToken, async (req, res) => {
  const { userId, userEmail } = req.body;
  res.status(200).json({ userId, userEmail });
});

app.post("/api/files", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.userEmail;
    console.log(userId, userEmail);
    const result = await pool.query(
      "SELECT * FROM files WHERE user_id = $1 AND owner_email = $2",
      [userId, userEmail]
    );
    // console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/files/delete", verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const result = await pool.query("DELETE FROM files WHERE id = $1", [id]);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/files/share", verifyToken, async (req, res) => {
  try {
    const { id, tempEmail } = req.body;
    const result = await pool.query(
      "UPDATE files SET temp_email = $1 WHERE id = $2",
      [tempEmail, id]
    );
    res.status(200).json({ message: "File shared successfully" });
  } catch (error) {
    console.error("Error sharing file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/files/recieve", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.userEmail;
    const { receiveEmail, receiveFileName } = req.body;
    const result = await pool.query(
      "SELECT * FROM files WHERE owner_email = $1 AND filename = $2 AND temp_email = $3",
      [receiveEmail, receiveFileName, userEmail]
    );
    res.status(200).send(result.rows[0].file_data);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
