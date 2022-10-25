const mysql = require('./config_sql');


function getUserByEmail(email) {
    let query = `SELECT * FROM user WHERE email = ?`;

    return mysql.query(query, [email]);
};

function registerUser(params) {
    let query = `INSERT INTO user (first_name, last_name, phone, email, hashed_email, password, confirmed, type_id) VALUES (?, ?, ?, ?, ?, ?, '0', '1')`;

    return mysql.query(query, params);
};

function activateUser(confirmationCode) {
    let query = `UPDATE user set confirmed = 1 WHERE hashed_email = ?`;

    return mysql.query(query, [confirmationCode]);
};

function deleteUser(email) {
    let query = `DELETE FROM user WHERE email = ?`;

    return mysql.query(query, [email])
};

module.exports = {
    getUserByEmail,
    registerUser,
    activateUser,
    deleteUser,
};
