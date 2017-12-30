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
        return Promise.resolve()
            .then(() => {
                connection.release();

                return undefined;
            });
    }

    query (query, { db = 'mydb', values = [] } = {}) {
        return this.connect()
            .then(connection => new Promise((resolve, reject) => {
                if (db) {
                    query = `USE ??; ${query}`;
                    values.unshift(db);
                }

                connection.query(query, values, (err, data, fields) => {
                    if (err) {
                        return reject(err);
                    }

                    if (db) {
                        fields = fields[1];
                        data = data[1];
                    }

                    resolve({
                        data,
                        fields,
                    });
                });
            }))
            .then(({ data, fields }) => data.map(item => fields.map(field => {
                const name = field.name;

                return {
                    default: field.default,
                    name,
                    value: item[name],
                };
            })));
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
