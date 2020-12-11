// Esto nos va a servir para verificar si existe un usuario y un token 

const jwt =require("jsonwebtoken");
const User = require ("../models/User");

// Verifica si existe un token en todas las rutas
exports.veryToken = (req, res, next) => {

    const { token } = req.cookies;
    // Usamos verify para ver si existe un token 
    jwt.verify(token, process.env.SECRET,(error, decoded)=>{

        // Aquí va nuestro código
        if(error) return res.status(401).json({error});

        /* Esto va a buscar con el objeto decoded en la propiedad en la llave ID -- decoded === {id} o sea un objeto con la llave id (según lo que hayas guardado)*/
        User.findById(decoded.id)
        .then((user)=>{

            // Guardamos el usuario en el req.user para poder usarlo en cualquier lugar 

            req.user = user; 
            // Con el next le decimos ya puede seguir 
            next()
        })
    });
};

/* Hacemos un middleware para checar roles y un utils para limpiar respuesta de datos basura */
                    //["ADMIN", "USER"] || USER
exportscheckRole = (roles) => {
    return (req, res, next)=>{
        // {name: "Dylan", role:"USER"}
        const { role } = req.user;
        if(roles.includes(role)){
            return next()
        }else{
            return res.staus(403).json({msg:"¡Oye, oye! No tienes permiso para realizar esta acción"})
        }
    }    
}

// Midleware para limpiar el objeto
exports.clearRes = (data) => {

    /* Destructuramos el objeto "data" y retornamos un nuevo objeto unicamente con los datos requeridos para nuestro "desarrollador" = dev */
    const {password,__v, createdAt,updatedAt, ...cleanedData} = data;
    // {key:"value"}
    return cleanedData
} 