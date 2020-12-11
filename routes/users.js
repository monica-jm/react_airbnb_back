const express = require('express');
const router = express.Router();
// Importo las cosas importantes
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require("jsonwebtoken");
const { clearRes } = require("../utils/auth")

// POST signup 
router.post('/signup', (req, res, next) => {
  // Trabajaré todo mi código aquí

  // Destructuramos el user
  const {email, password, confirmPassword, name} = req.body;

  if(password !== confirmPassword) return res.status(403).json({msg:"Las contraseñas no coinciden"})

  bcrypt.hash(password,10).then((hashedPassword)=>{

    const user = {email, password:hashedPassword,name};

    User.create(user).then(()=>{
      res.status(200).json({msg:"Usuario creado con éxito"});
    }).catch((error)=>{
      res.status(400).json({msg:"Hubo un error", error});
    })

  })


});

// POST login 
router.post('/login', (req, res, next) => {
  // Trabajaré todo mi código aquí

  // Destructuramos el user
  const {email, password} = req.body;
                // email:email
  User.findOne({email})
    .then((user)=>{

      if (user === null) return res.status(404).json({msg:"¡Épale! no existe este correo"})

      bcrypt.compare(password, user.password).then((match)=>{
        if(match){
          // Borramos password al devolver el objeto al usuario
          // Primera forma
          // const withoutPass = user.toObject();
          // delete withoutPass.password

          // Con utils
          const newUser = clearRes(user.toObject())   

          // Esto genera un token mezclando un valor (Id) + la palabra secreta y tiene una duración de 1 día!!!
          const token = jwt.sign({id:user._id}, process.env.SECRET, {
            expiresIn:"1d",
          })

          res.cookie("token",token, {
            expires:new Date(Date.now + 86400000), 
            secure:false,
            httpOnly:true,
          }).json({user:newUser, code:200})
        }else{
          return res.status(401).json({msg:"¡Épale esa no es tu contraseña!"})
        }
      })

    })
    .catch((error)=>{
      res.status(400).json({msg:"Hubo un errror", error});
    })

});

// POST Logout
router.post("/logout",(req, res)=>{
  res.clearCookie("token").json({msg:"Vuelve pronto"})
})

module.exports = router;
