var express = require('express');
var router = express.Router();

//Importo cosas importantes
const Property = require("../models/Properties");
const {veryToken} =require("../utils/auth");

/* GET property page. 
    C = Create /
    R = Read /
    U = Update
    D = Delete

    obtener todas las propiedades
    crear la propiedad
    eliminar la propiedad

*/

//app.user("/api/property")
//localhost:3000/api/property

// Ruta para crear = C
router.post("/", veryToken, (req, res, next)=>{
    //Voy a sacar el de la persona loggeada
    //para crear una propiedad (Casa)
    const { _id: _owner } = req.user

                    // ({ title, address, description, etc..})
    Property.create({...req.body, _owner})
    .then((property)=>{
        res.status(201).json({result:property});
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal, error"});
    });
});

// Ruta para leer

// Con filtro dinámico, puede buscar cualquier atributo
router.get("/", veryToken, (req, res, next)=>{
                // req.query = {key:"value"}
    Property.find(req.query)
        .populate("_owner","email name profile_picture") //<----- Populate
        .then((properties)=>{
        res.status(200).json({result:properties})
    })
    .catch((error)=>{
        res.status(400).json({msg:"Algo salió mal", error});
    });
});

// Traer uno solo, por id 
router.get("/:id", veryToken, (req, res, next)=>{

    // :id = "7ewjhvc7sw53tkbfw97"
    // req.params = {id:"7ewjhvc7sw53tkbfw97"}
    const { id } = req.params; 

    Property.findById(id)
        .populate("_owner","email name profile_picture") //<----- Populate
        .then((property)=>{
            res.status(200).json({result:property})
    })
    .catch((error)=>{
        res.status(400).json({msg:"ALgo salió mal", error})
    }); 
});

// Editar (Update)
// Post pide todos los keys de un objeto
// Patch puede usar solo una Key del objeto
router.patch("/:id", veryToken,(req,res, next)=>{
    const { id } = req.params; 
    Property.findByIdAndUpdate(id,req.body, { new:true })
        .populate("_owner","email name profile_picture") //<----- Populate
        .then((property)=>{
            res.status(200).json({result:property})
    })
        .catch((error)=>{
            res.status(400).json({msg:"Algo salio mal", error})
        })
}); 

// Eliminar (D)
router.delete("/:id", veryToken,(req,res, next)=>{
    const { id } = req.params; 
    Property.findByIdAndRemove(id)
        .then((property)=>{
            res.status(200).json({msg:"Se borro la propiedad"})
        })
        .catch((error)=>{
            res.status(400).json({msg:"Algo salio mal", error})
        })
}); 




module.exports = router;
