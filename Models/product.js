const mongoose = require('mongoose');

const productSchema= mongoose.Schema({
   
    name : String,
    image : String,
    countInStock : Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
       
    },
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


const Product = mongoose.model('product',productSchema);

module.exports = Product;