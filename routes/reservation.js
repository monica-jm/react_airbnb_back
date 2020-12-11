var express = require('express');
var router = express.Router();

//Importo cosas importantes
const Reservation = require("../models/Reservation");
const {veryToken} =require("../utils/auth");

/* GET property page. 
    C = Create /
    R = Read /
    U = Update
    D = Delete
*/

// Ruta para crear una reservación 
router.post("/", veryToken, (req, res, next)=>{
    const { _id: _guest } = req.user; 
    const reservation = {...res.body, _guest} //Sprite operator

    Reservation.create(reservation)
        .then((reservation)=>{
            res.status(200).json({result:reservation});
        })
        .catch((error)=>{
            res.status(400).json({msg:"Algo salió mal", error});
        });
});


// Ruta para leer todas las reservaciones por usuario
router.get("/", veryToken, (req, res, next)=>{
    // Buscamos las reservaciones de un usuario
    const { _id } = req.user;

    // buscar en invitados, los que coincidan con el id 
    Reservation.find({ _guest: _id })
        .populate({ // <---- agegar todo este para hacer un populate anidado
            path:"property",
            populate:{
                path:"_owner",
                select: "name",
            },
        }) //<----- Populate

        .then((reservations)=>{
            res.status(200).json({result:reservations})
        })
        .catch((error)=>{
            res.status(400).json({msg:"Algo salio mal", error  })
        })
});

// Ruta para leer todas las reservaciones por propiedad
router.get("/property/:property_id", veryToken, (req, res, next)=>{
    // Buscamos las reservaciones de un usuario
    const { property_id } = req.params;

    // buscar en invitados, los que coincidan con el id 
    Reservation.find({ _property : property_id })
        .populate("_guest","name") //<----- Populate
        .then((reservations)=>{
            res.status(200).json({result:reservations})
        })
        .catch((error)=>{
            res.status(400).json({msg:"Algo salio mal", error  })
        })
});

// Editar una reservación (Update)
router.patch(":id", veryToken, (req, res, next)=>{
    const { id } = req.params;

    Reservation.findByIdAndUpdate(id, req.body, {new:true})
        .then((reservation)=>{
            res.status(200).json({result:reservation});
        })
        .catch((error)=>{
            res.status(400).json({msg:"Algo salió mal", error});
        });
});

// Eliminar reservación(D)
router.delete("/:id", veryToken,(req,res, next)=>{
    const { id } = req.params; 
    Property.findByIdAndDelete(id)
        .then((reservation)=>{
            res.status(200).json({msg:"Se borro la reservación"})
        })
        .catch((error)=>{
            res.status(400).json({msg:"Algo salio mal", error})
        })
}); 




module.exports = router;
