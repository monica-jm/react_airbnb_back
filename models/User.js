const mongoose = require("mongoose"); 
// Schema = Schema
const {Schema} = mongoose; 

const userSchema = new Schema(
    {
        //Cosas nuevas
        name:{
            type: String,
            required:[true,"Debes agregar un nombre"]
        },
        profile_picture:{
            type:String,
            default:"https://www.centraltrials.com/wp-content/uploads/2016/11/User-Default.jpg"
        },
        //
        email: {
            type:String, 
            required:[true, "Debes agregar un correo"],
            validate:{
                message:"Este correo ya tiene una cuenta asociada", 
                validator:async ( email ) => {
                    const items = await mongoose.models["User"].count({email})
                    return items < 1
                },
            },
        },
        role:{
            type:String,
            default:"USER",
            enum:["ADMIN", "USER"],
        },
        password: {
            type:String, 
            required: [true, "Debes agregar un password"],
        },
    },
    {timestamps:true}

); 

module.exports = mongoose.model("User", userSchema)