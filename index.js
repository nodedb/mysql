/**
 * index
 */

/* Node modules */
const path = require('path');

/* Third-party modules */
const mysql = require('mysql');

/* Files */

export default class MySQL {
    constructor ({ host, password, port, user }) {
        this.connection = mysql.createConnection({
            host,
            password,
            port,
            user,
            multipleStatements: true
        });
    }

    connect () {
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }

    static get connection () {
        return [{
            label: 'HOST',
            key: 'host',
            type: 'text',
            default: 'localhost'
        }, {
            label: 'PORT',
            key: 'port',
            type: 'number',
            default: 3306
        }, {
            label: 'USERNAME',
            key: 'user',
            type: 'text',
            default: 'root'
        }, {
            label: 'PASSWORD',
            key: 'password',
            type: 'password',
            default: 'q1w2e3r4'
        }];
    }

    static get logo () {
        return path.join(__dirname, 'logo.png');
    }

    static get name () {
        return 'MySQL';
    }
};
