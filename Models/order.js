const mongoose = require('mongoose');
const MongooseTypes = mongoose.Types; 


const orderSchema = mongoose.Schema({
    orderItems: [
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderItem",
        required: true,
        // name: { type: String, required: true },
        // quantity: { type: Number, required: true },
        // price: { type: Number, required: true }
    }
],

    shippingAddress: { type: String, required: true },

    city: { type: String },

    phoneNumber: { type: String, required: true },

    status:{ type: String, required: true , default: 'pending'},

    totalPrice:{ type: Number},
    

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    },

    dateOredered: {type: Date, default:Date.now},


});

orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

orderSchema.set('toJSON',{
    virtuals:true
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
