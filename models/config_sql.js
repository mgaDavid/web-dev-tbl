const mysql = require('mysql2/promise');
require('dotenv').config();


function connect() {
    const config = {
        db: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        listPerPage: process.env.DB_LIST_PER_PAGE,
    }
    return new Promise((resolve, reject) => {
        if (!global.connection || global.connection.state == 'disconnected') {
            mysql.createConnection(config.db)
                .then((connection) => {
                    global.connection = connection;
                    console.log('New connection to mySQL');
                    resolve(connection);
                })
                .catch((error) => {
                    console.log('Error while connecting to MySQL...');
                    console.log(error);
                    reject(error.code);
                });
        } else {
            connection = global.connection;
            resolve(connection);
        }
    });
};

function query(statement, params) {
    return new Promise((resolve, reject) => {
        connect()
            .then((conn) => {
                conn
                    .execute(statement, params)
                    .then(([result]) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error.sqlMessage);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
}


module.exports = {
    connect,
    query,
};
