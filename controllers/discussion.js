const utils = require('./config_utils');
const discussion = require('../models/config_models').discussion;


async function getDiscussionsByModule(req, res) {
    utils.authenticateToken(req, res);

    if (req.email != null) {
        discussion.getDiscussionsByModule(req.body)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                return res.status(401).send({ message: JSON.stringify(error) });
            });
    };
};

async function insertMessage(req, res) {
    utils.authenticateToken(req, res);

    if (!req.body) {
        const message = { message: 'Body cannot be empty.' };
        return res.status(400).send(message);
    };

    if (req.email != null) {
        discussion.insertMessage(req.body)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                console.log(error);
                return res.status(401).send({ message: JSON.stringify(error) });
            });
    };
};


module.exports = {
    getDiscussionsByModule,
    insertMessage,
};
