const mysql = require('./config_sql');


function getDiscussionsByModule(params) {
    let query = `SELECT MD.message, DATE_FORMAT(MD.created_date, '%H:%i:%s %d-%m-%Y') AS created_date, U.first_name, U.last_name FROM module_discussion MD 
    INNER JOIN user U ON MD.user_id = U.user_id WHERE MD.module_id = ? AND MD.group_id = ? ORDER BY MD.discussion_id`;

    return mysql.query(query, [params.module_id, params.group_id]);
};

function insertMessage(params) {
    let query = `INSERT INTO module_discussion (module_id, message, user_id, group_id) VALUES (?, ?, ?, ?)`;
    console.log(params);

    return mysql.query(query, [params.module_id, params.message, params.user_id, params.group_id]);
};


module.exports = {
    getDiscussionsByModule,
    insertMessage,
};
