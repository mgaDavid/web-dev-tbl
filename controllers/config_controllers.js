const user = require('./user');
const course = require('./course');
const courseModule = require('./course_module');
const activity = require('./activity');
const question = require('./question');
const discussion = require('./discussion');
const configUtils = require('./config_utils');


module.exports = {
    user,
    course,
    courseModule,
    activity,
    question,
    discussion,
    configUtils,
};
