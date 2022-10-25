const utils = require('./config_utils');
const activity = require('../models/config_models').activity;
const fs = require('fs');


async function getActivitiesByModule(req, res) {
    utils.authenticateToken(req, res);

    if (req.email != null) {
        activity.getActivitiesByModule(req.body)
            .then(result => {
                const template = fs.readFileSync('./views/partials/activities.ejs', 'utf8');
                res.status(200).send({ data: result, template: template });
            })
            .catch(error => {
                return res.status(401).send({ message: JSON.stringify(error) });
            });
    };
};

async function getQuestionsByActivity(req, res) {
    utils.authenticateToken(req, res);

    if (req.email != null) {
        activity.getQuestionsByActivity(req.params.activity_id)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                return res.status(401).send({ message: JSON.stringify(error) });
            });
    };
};


module.exports = {
    getActivitiesByModule,
    getQuestionsByActivity,
};
