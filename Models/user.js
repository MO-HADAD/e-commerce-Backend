const mongoose = require('mongoose')

const userSchema= mongoose.Schema({
    name:{type:String, required:true},

    email:{type:String, required:true},

    passwordHash:{type:String, required:true},

    phone:{type:String, required:true},

    address:{type:String, required:true},

    isAdmin:{type:Boolean, required:true}
})

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

userSchema.set('toJSON',{
    virtuals:true
})

const User=mongoose.model('User',userSchema);
module.exports = User;