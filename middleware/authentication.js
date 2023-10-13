const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

    const excludedRoutes = ["/product", "/user/login","/puplic/uploads/"];

    // Check if the current route and method should be excluded from token verification
    const currentRoute = `${req.baseUrl}${req.path}`;
    if (excludedRoutes.includes(currentRoute) || currentRoute.startsWith('/puplic/uploads/')) {
      return next(); // Skip token verification for excluded routes/methods
    }

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;




// const expressJwt = require('express-jwt');

// function authjwt() {
//     const secret = process.env.secret;
//     return  expressJwt({
//         secret,
//         algorithms:['HS256']
//     })
// }

// module.exports = authjwt;   
