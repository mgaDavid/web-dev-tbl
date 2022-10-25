const utils = require('./config_utils');
const question = require('../models/config_models').question;
const fs = require('fs');


async function getQuestionsByActivity(req, res) {
    utils.authenticateToken(req, res);
    let questionsSource = question.getQuestionsByActivity;

    if (req.email != null) {
        if (req.body.from_group_activity == 1) {
            questionsSource = question.getQuestionsByGroupActivity;
        };

        questionsSource(req.body)
            .then(result => {
                const template = fs.readFileSync('./views/partials/activity.ejs', 'utf8');
                res.status(200).send({ data: result, template: template });
            })
            .catch(error => {
                return res.status(401).send({ message: JSON.stringify(error) });
            });
    };
};

async function submitActivity(req, res) {
    utils.authenticateToken(req, res);

    if (req.email != null) {
        question.submitActivity(req.body)
            .then(result => {
                res.status(200).send({ data: result });
            })
            .catch(error => {
                return res.status(401).send({ message: JSON.stringify(error) });
            });
    };
};


module.exports = {
    getQuestionsByActivity,
    submitActivity,
};
