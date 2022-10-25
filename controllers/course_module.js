const utils = require('./config_utils');
const courseModule = require('../models/config_models').courseModule;
const fs = require('fs');


async function getModulesByCourse(req, res) {
    utils.authenticateToken(req, res);

    if (req.email != null) {
        courseModule.getModulesByCourse(req.body)
            .then(result => {
                const template = fs.readFileSync('./views/partials/modules.ejs', 'utf8');
                res.status(200).send({ data: result, template: template });
            })
            .catch(error => {
                return res.status(401).send({ message: JSON.stringify(error) });
            });
    };
};


module.exports = {
    getModulesByCourse,
};
