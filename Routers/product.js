const express = require('express');
const productRouter =express.Router();
const Product = require('../Models/product')
const multer = require('multer');

const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isvalid =FILE_TYPE_MAP[file.mimetype];
        let uploadError= new Error ('invalid file type')

        if (isvalid){
            uploadError=null;
        }
        
      cb(uploadError, 'puplic/uploads')
    },
    filename: function (req, file, cb) {
      const filename = file.originalname.replace(' ','-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null,`${filename}-${Date.now()}.${extension}`)
    }
  })

  const upload = multer({ storage: storage })




productRouter.get('/',async(req,res)=>{
    const productList =await Product.find()
    if(!productList){
        res.status(500).json();
    }
    res.send(productList);
})
productRouter.get('/:id',async(req, res) => {
    const product =await Product.findById(req.params.id)
    if(!product){
        res.status(500).json();
    }
    res.send(product);
})

productRouter.get('/get/count',async(req, res) => {
    const productCount = await Product.countDocuments()

    if(!productCount){
        res.status(500).json({seuccess: false});
    }
    res.send({productCount : productCount});
})




productRouter.post('/',upload.single('image'),(req,res)=>{

    const file = req.file;
    if(!file){return res.status(404).send('no image found');}

    const fileName = req.file.filename
    const baseUrl = `${req.protocol}://${req.get('host')}/puplic/uploads/`
   const product =new Product({
    name : req.body.name,
    image:`${baseUrl}${fileName}`,
    countInStock: req.body.countInStock
   })

   product.save().then(createdProduct =>res.status(201).json(createdProduct))
   .catch(error =>res.send(error))

})

productRouter.put('/:id', async (req, res) =>{

    const product =await Product.findByIdAndUpdate(req.params.id,
        {
            name : req.body.name,
            image: req.body.image,
            countInStock: req.body.countInStock
        },
        {new:true}
        
        )

        if(!product){ return res.status(404).send('no order found')}

        res.send(product);

})

productRouter.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "product not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports =productRouter;