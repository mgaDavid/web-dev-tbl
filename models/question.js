const mysql = require('./config_sql');


function getQuestionsByActivity(params) {
    let query = `
        SELECT 
            Q.question_id, Q.statement, Q.answer_1_text, Q.answer_2_text, Q.answer_3_text, 
            Q.answer_4_text, Q.answer_5_text, Q.correct_answer, AST.answer 
        FROM question Q 
        INNER JOIN activity_question AQ ON Q.question_id = AQ.question_id AND AQ.activity_id = ? 
        LEFT JOIN activity_answer_student AST ON AQ.activity_id = AST.activity_id AND Q.question_id = AST.question_id AND AST.user_id = ?
            AND AST.from_group_activity = 0`;

    return mysql.query(query, [params.activity_id, params.user_id]);
};

function getQuestionsByGroupActivity(params) {
    let query = `
        SELECT
            Q.question_id, Q.statement, Q.answer_1_text, Q.answer_2_text, Q.answer_3_text,
            Q.answer_4_text, Q.answer_5_text, Q.correct_answer, AST.answer, SG.group_id
        FROM question Q
        INNER JOIN activity_question AQ ON Q.question_id = AQ.question_id AND AQ.activity_id = ?
        LEFT JOIN activity_answer_student AST ON AQ.activity_id = AST.activity_id AND Q.question_id = AST.question_id AND AST.from_group_activity = 1
        CROSS JOIN (SELECT group_id FROM student_group WHERE user_id = ? AND course_id = ?) SG
        WHERE (AST.user_id IN (SELECT SG2.user_id FROM student_group SG2 WHERE SG2.group_id = SG.group_id) OR AST.user_id IS NULL)`;

    return mysql.query(query, [params.activity_id, params.user_id, params.course_id]);
};

function submitActivity(params) {
    // Insert answers
    let query = `INSERT INTO activity_answer_student (question_id, answer, activity_id, from_group_activity, user_id) VALUES`;
    let arrayOfParameters = [];

    params.questions.forEach(question => {
        query += ` (?, ?, ?, ?, ?),`;
        arrayOfParameters.push(question[0], question[1], params.activity_id, params.from_group_activity, params.user_id);
    });

    query = query.slice(0, -1);
    mysql.query(query, arrayOfParameters);

    // Create record for completed activity
    if (params.from_group_activity == 0) {
        query = `INSERT INTO activity_done_student (activity_id, user_id) VALUES (?, ?)`;
        mysql.query(query, [params.activity_id, params.user_id]);
    } else {
        query = `INSERT INTO activity_done_group (activity_id, user_id, group_id) VALUES (?, ?, ?)`;
        mysql.query(query, [params.activity_id, params.user_id, params.group_id]);

        // Insert achievements for all students within the group
        query = `INSERT INTO student_achievement (user_id, module_id) SELECT user_id, ? FROM student_group WHERE course_id = ? AND group_id  = ?`;
        mysql.query(query, [params.module_id, params.course_id, params.group_id]);
    };

    // Update statistics of activity
    return updateGrade(params);
};

function updateGrade(params) {
    let table = 'activity_done_student';

    if (params.from_group_activity == 1) {
        table = 'activity_done_group'
    };

    let query = `
        UPDATE ${table} ADS SET total_score = (
            SELECT SUM(Q.correct_answer = AST.answer) / count(Q.correct_answer) AS grade
            FROM question Q
            INNER JOIN activity_question AQ ON Q.question_id = AQ.question_id AND AQ.activity_id = ?
            INNER JOIN activity_answer_student AST ON AQ.activity_id = AST.activity_id AND Q.question_id = AST.question_id AND AST.user_id = ?
            WHERE AST.from_group_activity = ?
        ) * 100 WHERE ADS.activity_id = ? AND ADS.user_id = ?;`;

    return mysql.query(query, [params.activity_id, params.user_id, params.from_group_activity, params.activity_id, params.user_id]);
};


module.exports = {
    getQuestionsByActivity,
    getQuestionsByGroupActivity,
    submitActivity,
};
