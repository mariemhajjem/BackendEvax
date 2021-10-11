var jwt = require('jsonwebtoken'); 
//middleware function:handle all the authorization
function verifyToken(req, res, next) {
  if (!req.headers.authorization)
    return res.status(401).send('Unauthorized');


  if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer'){
   
    let token= req.headers.authorization.split(' ')[1];
    jwt.verify(token,'center_code', function(err, decoded) {
      if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
       
      req.userId = decoded.userId; 
      next();
    });
  }
  else
  {
    return res.status(401).send('no.');
  }
}
module.exports = verifyToken;