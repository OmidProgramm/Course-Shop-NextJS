import { models,model,Schema } from "mongoose";
import { unique } from "next/dist/build/utils";

const userSchema = new Schema({
    phone:{
        type: String,
        required: true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        default:null,
        lowercase:true,
        trim:true,
        unique:true,
    },
    name:{
        type:String,
        trim:true,
        default:'',
        maxLength:50
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    otp:{
        code:{type:String},
        expiresAt:{type:Date}
    },
    isVerified:{type:Boolean,default:false},
    purchasedCourses:{
        type:mongoose.Schema.Types.Object,
        ref:"Course",
        default:[]
    },
    lastLoginAt:{type:Date},
    refreshToken:{type:String},
},
{timestamps:true})

const User = models.User || model('User', userSchema)
export default User