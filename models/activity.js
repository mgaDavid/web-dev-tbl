const mysql = require('./config_sql');


function getActivitiesByModule(params) {
    let query = `
        SELECT A.*, ADS.activity_done_student_id, ADS.total_score AS individual_score, 
            ADG.activity_done_group_id, ADG.total_score AS group_score, TC.pending_individual_activities, TC2.group_id
        FROM activity A 
        LEFT JOIN activity_done_student ADS ON A.activity_id = ADS.activity_id AND ADS.user_id = ?
        LEFT JOIN student_group SG ON ADS.user_id = SG.user_id AND SG.course_id = ?
        LEFT JOIN activity_done_group ADG ON SG.group_id = ADG.group_id
        CROSS JOIN (SELECT COUNT(*) AS pending_individual_activities
            FROM student_group SG 
            INNER JOIN student_group SG2 ON SG.group_id = SG2.group_id AND SG.user_id = ?
            INNER JOIN activity A ON A.module_id = ?
            LEFT JOIN activity_done_student AD ON SG2.user_id = AD.user_id AND A.activity_id = AD.activity_id
            WHERE SG.course_id = ? AND AD.activity_done_student_id is null) TC
        CROSS JOIN (SELECT group_id FROM student_group WHERE user_id = ? AND course_id = ?) TC2
        WHERE A.module_id = ?`;

    return mysql.query(query, [params.user_id, params.course_id, params.user_id, params.module_id, params.course_id, params.user_id, params.course_id, params.module_id]);
};

function getActivitiesByStudent(student_id) {
    let query = `SELECT DISTINCT A.activity_id, A.title, A.image_url, GS.group_id, GS.student_id FROM activity_group_student GS INNER JOIN activity_group G ON GS.group_id = G.group_id INNER JOIN activity A ON G.activity_id = A.activity_id WHERE GS.student_id = ?`;

    return mysql.query(query, [student_id]);
};

function getQuestionsByActivity(activity_id) {
    let query = `SELECT A.activity_id, A.title, Q.question_id, Q.statement, Q.answer_1_text, Q.answer_2_text, Q.answer_3_text, Q.answer_4_text, Q.answer_5_text, Q.correct_answer FROM activity_question AQ INNER JOIN activity A ON AQ.activity_id = A.activity_id INNER JOIN question Q ON AQ.question_id = Q.question_id WHERE A.activity_id = ?`;

    return mysql.query(query, [activity_id]);
};


module.exports = {
    getActivitiesByModule,
    getActivitiesByStudent,
    getQuestionsByActivity,
};
