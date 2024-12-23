import * as routing from "../models/userModel.js";
import pool from "../config/db.js";


const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

// export const createUser = async (req, res, next) => {
//     const { name, email, password } = req.body;
//     try {
//         const newUser = await routing.createUserService(name, email, password);
//         handleResponse(res, 201, "User created successfully", newUser);
//     } catch (error) {
//         next(error);
//     }
// };

export const createUser = async (req, res, next) => {
        const { name, email, password } = req.body;
        
        try {
          const checkResult = await pool.query("SELECT * FROM users WHERE name = $1", [
            name,
          ]);
      
          if (checkResult.rows.length > 0) {
            res.redirect("/");
          } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
              if (err) {
                console.error("Error hashing password:", err);
              } else {
                const result = await pool.query(
                  "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
                  [name, email,hash]
                );
                const user = result.rows[0];
              
                  res.redirect("/");
                
              }
            });
          }
        } catch (err) {
          console.error(err);
          res.render("signup",{error:"There is something wrong. Please try again"})
        }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await routing.getAllUsersService();
        handleResponse(res, 200, "Users found successfully", users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await routing.getUserByIdService(req.params.id);
        if (!user) {
            return handleResponse(res, 404, "User not found");
        }
        handleResponse(res, 200, "User found successfully", user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const { name, email } = req.body;
    try {
        const updatedUser = await routing.updateUserService(req.params.id, name, email);
        if (!updatedUser) {
            return handleResponse(res, 404, "User not found");
        }
        handleResponse(res, 200, "User updated successfully", updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await routing.deleteUserService(req.params.id);
        if (!deletedUser) {
            return handleResponse(res, 404, "User not found");
        }
        handleResponse(res, 200, "User deleted successfully", deletedUser);
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        const result = await routing.userLoginService(email, password);
        if (!result) {
            return handleResponse(res, 404, "User not found");
        }
        handleResponse(res, 200, "User login successful", result);
    } catch (error) {
        next(error);
    }
};

export const uploadFile = async (req, res, next) => {
    const { user_id } = req.body;
    const file = req.file;
    if (!user_id || !file) {
        return handleResponse(res, 400, "User ID and file are required");
    }
    try {
        const uploadedFile = await routing.uploadFileService(user_id, file);
        handleResponse(res, 201, "File uploaded successfully", uploadedFile);
    } catch (error) {
        next(error);
    }
};

export const getUserFiles = async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const files = await routing.getUserFilesService(user_id);
        if (files.length === 0) {
            return handleResponse(res, 404, "No files found for this user");
        }
        handleResponse(res, 200, "Files retrieved successfully", files);
    } catch (error) {
        next(error);
    }
};
