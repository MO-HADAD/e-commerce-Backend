const mongoose = require('mongoose');
const express = require('express');
const userRouter=express.Router();
const User =require('../Models/user')
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

userRouter.get('/',async(req, res) => {
    const userList =await User.find().select('name phone email')
    if(!userList){
        res.status(500).json();
    }
    res.send(userList);
})

userRouter.get('/:id',async(req, res) => {
    const user =await User.findById(req.params.id)
    if(!user){
        res.status(500).json();
    }
    res.send(user);
})

userRouter.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.send({ userCount: userCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


userRouter.post('/',async(req, res) => {
    const user= new User ({
        name:req.body.name,
       email:req.body.email,
       passwordHash:bcrypt.hashSync(req.body.password,10),
       phone:req.body.phone,
       address:req.body.address,
       isAdmin:req.body.isAdmin
    })
    await user.save()
    .then((user) => {res.send(user)})
    .catch((user) =>{res.send(user)})

})

userRouter.post('/login', async(req, res) => {
    const user = await User.findOne({email:req.body.email})

    const secret= process.env.secret;



    if(!user){
        return res.status(400).send('no user found')
    }
    if(user&&bcrypt.compareSync(req.body.password,user.passwordHash)){

        const token=jwt.sign({
            email : user.email,
        }
        ,secret
        );

        return res.status(200).send({user:user.email , token : token})
    }
    
    else{
        return res.status(400).send('error password is incorrect')

    }
})

userRouter.post('/register',async(req, res) => {
    const user= new User ({
        name:req.body.name,
       email:req.body.email,
       passwordHash:bcrypt.hashSync(req.body.password,10),
       phone:req.body.phone,
       address:req.body.address,
       isAdmin:req.body.isAdmin
    })
    await user.save()
    .then((user) => {res.send(user)})
    .catch((user) =>{res.send(user)})

})

userRouter.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = userRouter

