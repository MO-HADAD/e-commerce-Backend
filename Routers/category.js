const mongoose = require('mongoose');
const express = require('express');
const categoryRouter = express.Router();
const Category =require('../Models/category')

categoryRouter.get('/',async(req, res) => {
    const category =await Category.find();
    if(!category){
        res.status(404).json({message: 'faild find categories'})
    }else{
        res.send(category)
    }
})

categoryRouter.post('/',async(req, res) => {
    const category= new Category ({
        name:req.body.name,
        icon:req.body.icon,
        image:req.body.image
    })
    await category.save()
    .then((category) => {res.send(category)})
    .catch((error) =>{res.send(error)})

})

categoryRouter.put('/:id',async (req, res)=> {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            image: req.body.image,
        },
        { new: true}
    )

    if(!category)
    return res.status(400).send('the category cannot be created!')

    res.send(category);
})

categoryRouter.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category) {
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "category not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


module.exports = categoryRouter;

