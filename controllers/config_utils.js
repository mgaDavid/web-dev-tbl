const jwt = require('jsonwebtoken');
const fs = require('fs');


function authenticateToken(req, res) {
    // console.log('Authorizing..');

    const cookies = req.cookies;
    const token = cookies.jwt;

    if (token == null) {
        console.log('Token is null');
        return res.sendStatus(401);
    };

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            req.email = data.name;

            res.cookie('jwt', token, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
            });
        };
    });
};

function getHome(req, res) {
    const template = fs.readFileSync('./views/partials/home.ejs', 'utf8');
    res.status(200).send({ template: template });
};


module.exports = {
    authenticateToken,
    getHome,
};
