module.exports = app => {
    var router = require('express').Router();
    const controller = require('../controllers/config_controllers');

    // @http-verb : get
    router.get('/home', controller.configUtils.getHome);

    // @http-verb : post
    // @table : User
    // @body : expects { 'email': string, 'password': string }
    router.post('/users/login', controller.user.login);

    // @http-verb : post
    // @table : User
    // @body : expects { 'first_name': string, 'last_name': string, 'phone': string, 'email': string, 'password': string }
    router.post('/users/register', controller.user.register);

    // @http-verb : get
    // @table : User
    router.get('/users/auth/confirm/:confirmationCode', controller.user.verifyUser);

    // @http-verb : get
    // @table : CourseGroup
    // @header : expects Authorization Bearer
    router.get('/courses/assigned', controller.course.getStudentCourses);

    // @http-verb : get
    // @table : Course
    // @header : expects Authorization Bearer
    router.get('/courses/all', controller.course.getAllCourses);

    // @http-verb : post
    // @table : Course
    // @header : expects Authorization Bearer
    // @body : expects { 'name': string, 'image_path': string }
    router.post('/courses/create', controller.course.createCourse);

    // @http-verb : patch
    // @table : Course
    // @header : expects Authorization Bearer
    // @body : expects { 'name': string, 'image_path': string }
    router.patch('/courses/update/:Course_PK', controller.course.updateCourse);

    // @http-verb : post
    // @table : Module
    // @header : expects Authorization Bearer
    // @body : expects { 'user_id': user_id, 'course_id': course_id }
    router.post('/courses/modules', controller.courseModule.getModulesByCourse);

    // @http-verb : post
    // @table : ModuleDiscussion
    // @header : expects Authorization Bearer
    // @body : expects { 'group_id': group_id, 'module_id': module_id }
    router.post('/courses/modules/discussions', controller.discussion.getDiscussionsByModule);

    // @http-verb : post
    // @table : ModuleDiscussion
    // @header : expects Authorization Bearer
    // @body : expects { 'author_user_id': author_user_id, 'module_id': module_id, 'comment': comment }
    router.post('/courses/modules/discussions/create', controller.discussion.insertMessage);

    // @http-verb : post
    // @table : Activity
    // @header : expects Authorization Bearer
    // @body : expects { 'user_id': user_id, 'module_id': module_id }
    router.post('/courses/modules/activities', controller.activity.getActivitiesByModule);

    // @http-verb : post
    // @table : Question
    // @header : expects Authorization Bearer
    // @body : expects { 'user_id': user_id, 'activity_id': activity_id }
    router.post('/courses/modules/activities/questions', controller.question.getQuestionsByActivity);

    // @http-verb : post
    // @table : activity_answer_student, activity_done_student
    // @header : expects Authorization Bearer
    // @body : expects { 'user_id': user_id, 'activity_id': activity_id, 'from_group_activity': from_group_activity, 'total_score': total_score, 'questions': [[question_id, answer]] }
    router.post('/courses/modules/activities/submit', controller.question.submitActivity);

    app.use('/api', router);
};
