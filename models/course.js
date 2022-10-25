const mysql = require('./config_sql');


function getStudentCourses(email) {
    let query = "SELECT C.course_id, C.name, C.image_path FROM course C WHERE C.course_id IN (SELECT CG.course_id FROM course_group CG INNER JOIN user U ON CG.student_id = U.user_id WHERE U.email = ?)";

    return mysql.query(query, [email]);
};

function getAllCourses() {
    let query = "SELECT * FROM course";

    return mysql.query(query);
};

function createCourse(params) {
    let query = "INSERT INTO Course (Course_PK, Name, ImagePath) VALUES (NULL,?,?)";

    return mysql.query(query, [params.name, params.image_path]);
};

function updateCourse(params) {
    let query = "UPDATE course SET name = ?, image_path = ? WHERE course_id = ?";

    return mysql.query(query, [params.name, params.image_path, params.course_id]);
};


module.exports = {
    getStudentCourses,
    getAllCourses,
    createCourse,
    updateCourse,
};
