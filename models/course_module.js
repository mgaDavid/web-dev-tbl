const mysql = require('./config_sql');


function getModulesByCourse(params) {
    let query = `
        SELECT M.*, SA.user_id
        FROM module M
        LEFT JOIN student_achievement SA ON M.module_id = SA.module_id AND SA.user_id = ? 
        WHERE M.course_id = ?`;

    return mysql.query(query, [params.user_id, params.course_id]);
};


module.exports = {
    getModulesByCourse,
};
