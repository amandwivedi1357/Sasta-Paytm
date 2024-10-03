const express = require('express');
const router = express.Router();
const zod = require("zod");
const bcrypt = require("bcrypt");  // Add bcrypt for password hashing
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

// Validation schemas
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)  // Add minimum password length
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

// Signup route
router.post("/signup", async (req, res) => {
    const parseResult = signupBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).json({
            message: "Email already taken"
        });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,  // Store hashed password
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});

// Signin route
router.post("/signin", async (req, res) => {
    const parseResult = signinBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    // Check if the password matches
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json({
            message: "Incorrect password"
        });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
        token: token
    });
});

// Update route
router.put("/", authMiddleware, async (req, res) => {
    const parseResult = updateBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    // Hash new password if it's being updated
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    });
});

// Bulk fetch route
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstName: { "$regex": filter, "$options": "i" } },  // Case-insensitive search
            { lastName: { "$regex": filter, "$options": "i" } }
        ]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

// Get current user route
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Fetch the user's account to get the balance
        const account = await Account.findOne({ userId: user._id });
        
        res.json({
            firstName: user.firstName,
            id: user._id,
            balance: account ? account.balance : 0  // Include balance in response
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


module.exports = router;
