// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
const fs = require('fs');
    const path = require('path');
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

// router.post("/transfer", authMiddleware, async (req, res) => {
//     const session = await mongoose.startSession();

//     session.startTransaction();
//     const { amount, to } = req.body;

//     // Fetch the accounts within the transaction
//     const account = await Account.findOne({ userId: req.userId }).session(session);

//     if (!account || account.balance < amount) {
//         await session.abortTransaction();
//         return res.status(400).json({
//             message: "Insufficient balance"
//         });
//     }

//     const toAccount = await Account.findOne({ userId: to }).session(session);

//     if (!toAccount) {
//         await session.abortTransaction();
//         return res.status(400).json({
//             message: "Invalid account"
//         });
//     }

//     // Perform the transfer
//     await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
//     await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

//     // Commit the transaction
//     await session.commitTransaction();
//     res.json({
//         message: "Transfer successful"
//     });
// });


router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;
    

    // Find the account for the authenticated user
    const account = await Account.findOne({ userId: req.userId });

    if (!account || account.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    // Find the recipient's account
    const toAccount = await Account.findOne({ userId: to });

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid recipient account"
        });
    }

    // Perform the transfer: Deduct from the sender's account and add to the recipient's
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } });
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } });

    // Fetch updated account balances
    const updatedSenderAccount = await Account.findOne({ userId: req.userId });
    const updatedRecipientAccount = await Account.findOne({ userId: to });

    // Create transaction log entry
    const transactionLog = `${new Date().toISOString()} - Transfer: ${amount} from ${req.userId} (balance: ${updatedSenderAccount.balance}) to ${to} (balance: ${updatedRecipientAccount.balance})\n`;

    // Write to transaction.txt file
    const logFilePath = path.join(__dirname, '..', 'transaction.txt');
    fs.appendFile(logFilePath, transactionLog, (err) => {
        if (err) {
            console.error('Error writing to transaction log:', err);
        }
    });

    res.json({
        message: "Transfer successful"
    });
});


module.exports = router;