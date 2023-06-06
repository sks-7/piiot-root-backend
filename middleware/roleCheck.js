const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization'];


  if (authHeader) {
   
    const token = authHeader.split(' ')[1];


    jwt.verify(token, process.env.secretKey, (err, payload) => {
      if (err) {
        return res.sendStatus(403);
      }

    
      req.user = { role: payload.role };

      // Proceed to the next middleware
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = authenticateToken;
