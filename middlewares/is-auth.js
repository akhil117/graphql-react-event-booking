const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("req",req['Authorization']);  
  const authHeader = req.get('Authorization');
  if(!authHeader){
    req.isAuth = false;
   return next();
  }
  const token = authHeader.split(' ')[1];
  if(!token && token.trim().length<=0){
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  console.log("Entering to Decoding token")
  try{
    decodedToken = jwt.verify(token,"SECRET");
    console.log(decodedToken);
  }catch(err){
    console.log("Error",err);
    req.isAuth = false;
    return next();
  }

  if(!decodedToken){
    req.isAuth = false;
   return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};