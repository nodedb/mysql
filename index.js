/**
 * index
 */

/* Node modules */
const { EventEmitter } = require('events');
const path = require('path');

/* Third-party modules */
const mysql = require('mysql');

/* Files */

module.exports = class MySQL {
    constructor ({ host, password, port, user }) {
        this.connection = mysql.createPool({
            host,
            password,
            port,
            user,
            multipleStatements: true
        });
    }

    connect () {
        return new Promise((resolve, reject) => {
            this.connection.getConnection((err, connection) => {
                if (err) {
                    return reject(err);
                }

                resolve(connection);
            });
        });
    }

    disconnect (connection) {
        connection.release();
    }

    query (connection, query, values = []) {
        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, data, fields, ...args) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    data,
                    fields,
                });
            });
        })
        .then((result) => {
            // @todo - understand how mysql package does this properly
            const { data, fields } = result;

            const output = {
                data: [],
                fields: [],
                info: {},
            };

            if (Array.isArray(data) && Array.isArray(fields)) {
                /* Query result */
                output.data = data;
                output.fields = fields;
            } else {
                /* An insert/update or message */
                output.info = result;
            }

            return output;
        });
    }

    setDb (connection, db) {
        return this.query(connection, 'USE ??', [
            db,
        ]);
    }

    static get connection () {
        return [{
            label: 'HOST',
            key: 'host',
            type: 'text',
            default: 'localhost',
            required: true
        }, {
            label: 'PORT',
            key: 'port',
            type: 'number',
            default: 3306,
            required: true
        }, {
            label: 'USERNAME',
            key: 'user',
            default: 'root',
            type: 'text',
        }, {
            label: 'PASSWORD',
            key: 'password',
            default: 'q1w2e3r4',
            type: 'password',
        }];
    }

    static get logo () {
        return path.join(__dirname, 'logo.png');
    }

    static get name () {
        return 'MySQL';
    }
};
