const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");


// Register
router.post("/register", async(req,res)=>{

    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"All fields required"
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password,10);

        const user = new User({
            email,
            password:hashedPassword
        });

        await user.save();

        res.status(201).json({
            message:"Registered Successfully"
        });

    }
    catch(err){
        res.status(500).json(err);
    }
});


// Login
router.post("/login", async(req,res)=>{

    try{

        const {email,password} = req.body;

        const user =
            await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"Invalid Email"
            });
        }

        const isMatch =
          await bcrypt.compare(
            password,
            user.password
          );

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Password"
            });
        }

        res.json({
            message:"Login Successful"
        });

    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;