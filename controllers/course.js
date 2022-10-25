const utils = require('./config_utils');
const course = require('../models/config_models').course;
const user = require('../models/config_models').user;
const fs = require('fs');


async function getStudentCourses(req, res) {
    let tokenData = utils.authenticateToken(req.headers);
    if (tokenData === null) {
        const message = { message: 'You are not authorized to perform this action.' };
        return res.status(400).send(message);
    }
    course.getStudentCourses(tokenData)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            return res.status(401).send({ message: JSON.stringify(error) });
        })
};

async function getAllCourses(req, res) {
    utils.authenticateToken(req, res);

    if (req.email != null) {
        course.getAllCourses()
            .then(result => {
                const template = fs.readFileSync('./views/partials/courses.ejs', 'utf8');
                res.status(200).send({ data: result, template: template });
            })
            .catch(error => {
                return res.status(401).send({ message: JSON.stringify(error) });
            });
    };
};

async function createCourse(req, res) {
    let tokenData = utils.authenticateToken(req.headers);
    if (tokenData === null) {
        const message = { message: 'You are not authorized to perform this action.' };
        return res.status(400).send(message);
    }
    if (req.body === undefined || !req.body) {
        const message = { message: 'Body cannot be empty.' };
        return res.status(400).send(message);
    }
    // FIRST, WE NEED TO VERIFY IF LOGGED USER IS SYSTEM ADMINISTRATOR
    // PERFORM THIS QUERY, THEN DECIDE...
    user.getUserByEmail(tokenData.Email)
        .then(result => {
            // SYSTEM ADMINISTRATOR PROFILE IS type_id = 0
            if (result.type_id != 0) {
                // IF IT ISN'T, RETURN NOT AUTHORIZED.
                const message = { message: 'You are not authorized to perform this action.' };
                return res.status(400).send(message);
            } else {
                // IF IT IS, GET ALL COURSES
                course.createCourse(req.body)
                    .then(result => {
                        res.status(200).send(result);
                    })
                    .catch(error => {
                        return res.status(401).send({ message: JSON.stringify(error) });
                    })
            }
        })
        .catch(error => {
            return res.status(401).send({ message: JSON.stringify(error) });
        })
};

async function updateCourse(req, res) {
    let tokenData = utils.authenticateToken(req.headers);
    if (tokenData === null) {
        const message = { message: 'You are not authorized to perform this action.' };
        return res.status(400).send(message);
    }
    if (req.body === undefined || !req.body) {
        const message = { message: 'Body cannot be empty.' };
        return res.status(400).send(message);
    }
    // FIRST, WE NEED TO VERIFY IF LOGGED USER IS SYSTEM ADMINISTRATOR
    // PERFORM THIS QUERY, THEN DECIDE...
    user.getUserByEmail(tokenData.Email)
        .then(result => {
            // SYSTEM ADMINISTRATOR PROFILE IS type_id = 0
            if (result[0].type_id != 0) {
                // IF IT ISN'T, RETURN NOT AUTHORIZED.
                const message = { message: 'You are not authorized to perform this action.' };
                return res.status(400).send(message);
            } else {
                // IF IT IS, GET ALL COURSES
                course.updateCourse(req.params.course_id, req.body)
                    .then(result => {
                        res.status(200).send(result);
                    })
                    .catch(error => {
                        return res.status(401).send({ message: JSON.stringify(error) });
                    })
            }
        })
        .catch(error => {
            return res.status(401).send({ message: JSON.stringify(error) });
        })
};


module.exports = {
    getStudentCourses,
    getAllCourses,
    createCourse,
    updateCourse,
};
