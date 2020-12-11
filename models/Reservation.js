// Opción 2: Destructuración de lo anterior
const {Schema, model} =require ("mongoose");

const reservationSchema = new Schema(
    {
        // Aquí van mis atributos
        _property:{
            type:Schema.Types.ObjectId, 
            ref:"Property", 
            required:true, 
        },
        _guest:{
            type:Schema.Types.ObjectId, 
            ref:"User", 
            required:true, 
        },
        _checkIn:{
            type:Date, 
            required:[true, "Debes indicar cuando iniciará la reservación"], 
        },
        _checkOut:{
            type:Date, 
            ref:"User", 
            required:[true, "Debes indicar cuando finalizará la reservación"], 
        },
        _guest_number:{
            type:Number, 
            min:[1, "El mínimo de personas por reservación es uno"],
        },
    },
    {timestamps:true}
);

//Esto es muy muy importante
//Opción 1 (arriba)
// module.exports = mongoose.model("Properties", propertySchema)

//Opción 2 (arriba)
module.exports = model("Reservation", reservationSchema)