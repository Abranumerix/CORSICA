const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        // On va extraire le token du Header "Authorization"
        const token = req.headers.authorization.split(" ")[1];
        //on vérifie la validité du token
        jwt.verify(token, process.env.PRIVATE_KEY, (err, payload) => {
            if (err) {
                return res
                    .status(401)
                    .json({ status: 401, message: "Vous devez être connecté" })
            }
            req.payload = payload;
            next();
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
};

module.exports = auth;