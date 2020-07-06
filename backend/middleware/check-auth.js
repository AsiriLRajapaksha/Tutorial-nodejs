const jwt = require("jsonwebtoken");

module.exports = (request , respose , next ) => {
    try{
        const token = request.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token , "secret_this_should_be_longer");
        request.userData = {email: decodedToken.email , userId: decodedToken.userId};
        next();
    }catch{
        respose.status(401).send({message:"You are not authonticated!"});
    }
};