// Opción 1
// const mongoose = require("mongoose"); 
// // Schema = Schema
// const {Schema} = mongoose; 

// Opción 2: Destructuración de lo anterior
const {Schema, model} =require ("mongoose");

const propertySchema = new Schema(
    {
        // title, address, description, price, images, owner (numberRooms...opcionales)
        _owner:{
            // Esto es para decirle que insertará un ID de un elemento de la base de datos 
            type:Schema.Types.ObjectId, 
            ref:"User", 
            required:[true, "La propiedad debe tener un dueño"], 
        },
        // Siguen los atributos normales
        title:{
            type:String, 
            required:[true, "Debes agregar un nombre a la propiedad"],
        }, 
        address:{
            type:String, 
            required:[true, "Debes agregar una dirección de la propiedad"],
        },
        description:{
            type:String, 
            minLength:[50, "La descripción es muy pequeña"],//esta es diferente ya que es con un mínimo
        },
        images:{
            type:[String], //["http://miImagen.com/casa.jpg","http://miImagen.com/casa2.jpg""]
            minLength:[1, "Debes agregar por lo menos una imagen"],//esta es diferente ya que es con un mínimo
        },
        price:{
            type:Number,
            min:[1, "El precio de la propiedad por noche es muy bajo"],
            required:[true,"Debes agregar el precio por noche de tu propiedad"], 
        },
        capacity:{
            type:Number,
            required:[true,"Debes agregar la capacidad de tu propiedad"], 
        },
    },
    {timestamps:true}
);

//Esto es muy muy importante
//Opción 1 (arriba)
// module.exports = mongoose.model("Properties", propertySchema)

//Opción 2 (arriba)
module.exports = model("Properties", propertySchema)