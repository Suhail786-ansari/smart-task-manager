const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    // Check agar token aaya hai aur 'Bearer ' se shuru ho raha hai
    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1]; // 'Bearer TOKEN_STRING' mein se actual token nikalna
            
            // Token ko verify karna
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SecretKey123');
            
            // Request ke andar user ki ID attach kar dena taaki controller ise use kar sake
            req.user = decoded.id;
            
            next(); // Agle function (controller) par jao
        } catch (error) {
            return res.status(401).json({ message: "Galti: Token sahi nahi hai!" });
        }
    } else {
        return res.status(401).json({ message: "Galti: Token nahi mila, authorization denied!" });
    }
};

module.exports = protect;