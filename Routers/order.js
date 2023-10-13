const express = require('express');
const Router = express.Router();
const Order = require('../Models/order');
const OrderItem = require('../Models/order-item');

Router.get('/',async (req,res)=>{
    const orderList =await Order.find().populate('user').sort({'dateOredered':-1})
    if(!orderList){
        res.status(500).json();
    }
res.send(orderList)
})

Router.get('/:id',async (req,res)=>{
    const order =await Order.findById(req.params.id)
    .populate({path:'orderItems' , populate:'product'})

    if(!order){
        res.status(500).json();
    }
res.send(order)
})

Router.post('/',async (req, res)=>{

    const orderItemId=Promise.all(req.body.orderItems.map(async orderItem=>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem =await newOrderItem.save()
       

        return  newOrderItem._id
        
        }))

        const resolvedOrderItemId = await orderItemId;



    const order = new Order({
        orderItems:resolvedOrderItemId,
        name: req.body.name,
        ShippingAddress: req.body.ShippingAddress,
        phoneNumber:req.body.phoneNumber,
        city:req.body.city,
        status:req.body.status,
        totalPrice:req.body.totalPrice,
        user:req.body.user

    });
    order.save().then(createdOrder =>res.status(201).json(createdOrder))
    .catch(error =>res.send(error))

})

Router.put('/:id',async (req, res) =>{

    const order =await Order.findByIdAndUpdate(req.params.id,
        {
            status:req.body.status
        },
        {new:true}
        
        )

        if(!order){ return res.status(404).send('no order found')}

        res.send(order);

})

Router.delete('/:id',async (req,res)=>{
    const order =await Order.findByIdAndRemove(req.params.id)

    if(order){
        await order.orderItems.map(async (orderItem)=>{
            await OrderItem.findByIdAndRemove(orderItem)
        })
    }

    else{return res.status(404).send('no order found')}
})

module.exports = Router;