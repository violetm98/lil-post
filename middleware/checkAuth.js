const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const access_token = req.headers.authorization.split(" ")[1];



    if (!access_token) {
        return res.status(401).send({ auth: false, message: "no token provided" });
    } else {

        jwt.verify(access_token, config.get('development.JWT_ACCESS_SECRET'),
            (err, decoded) => {
                //console.log(decoded);
                if (err) {
                    return res.status(401).send({ auth: false, message: "Invalid token" });
                } else {
                    //console.log('access token verify decoded', decoded)
                    req.userData = { _id: decoded._id };

                    next();
                }
            })
    }

}