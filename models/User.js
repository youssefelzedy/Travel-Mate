const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");

const UserSchema = new Schema(
{
    fullname: {
        type: String,
        required: [true, { english: "Please add a name", arabic: "يرجى إضافة اسم" }],
    },
    email:{
        type:String,
        required: [true, { english: "Please add a email", arabic: "يرجى إضافة بريد الكتروني" }],
        unique:true,
        validate:[validator.isEmail,{
            message:{
                english:"Please add a valid email",
                arabic:"بريد الكتروني غير صالح"
            }
        }]
    },
    password:{
        type:String,
        required: [true, { english: "Please add a password", arabic: "يرجى إضافة كلمة المرور" }],
        select:false
    },
    passwordConfirm:{
        type:String,
        required: [true, { english: "Please add a confirm password", arabic: "يرجى إضافة تأكيد كلمة المرور" }],
        validate:{
            validator:function(el){
                return el === this.password
            },
            message:{
                english:"Passwords are not the same",
                arabic:"كلمات المرور غير متطابقة"
            }
        }
    },
    photo :{
        type:String,
        default:"default.jpg"
    },
    role:{
        type:String,
       enum:["user","admin"],
       default:"user"
    },
    verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
  },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date
},
{
    timestamps:true
}
);

UserSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });

//method to encrypt password 
UserSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

UserSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };

const User = mongoose.model("User",UserSchema);
module.exports = User