const bcrypt = require("bcrypt");

const User = require("../module/user");

const jwt = require('jsonwebtoken');

exports.userCreate =  (request , response , next ) => {
    bcrypt.hash(request.body.password , 10)
      .then( hash => {
        const user = new User({
            email : request.body.email,
            password : hash
        });
        user.save()
          .then(result => {
            response.status(201).send({
                message: 'User created!',
                result : result
            });
          })
          .catch(error => {
            response.status(500).send({
               message:"invalid authontication credentials!"
            });
          });
      });
}

exports.userLogin = async (request , response , next) => {
    let fetchUser;
    await User.findOne({email:request.body.email})
      .then(user => {
        if(!user){
          return response.status(401).send({
            message: "Invalid Email!"
          });
        }
        fetchUser = user;
        return bcrypt.compare(request.body.password , user.password);
      })
      .then(result => { 
        if(!result){
          return response.status(401).send({
            message: "Invalid pasword!"
          });
        }
        const token = jwt.sign(
          {email:fetchUser.email , userId:fetchUser._id},
          'secret_this_should_be_longer',
          {expiresIn : "1h"}
        );
        response.status(200).send({
          token: token,
          expiresIn:3600,
          userId: fetchUser._id
        });
      })
      .catch(error => {
        return response.status(401).send({
          message: "Authontication failed"
        });
      });
  }