/**
 * strategy
 */

"use strict";


/* Node modules */
const path = require("path");


/* Third-party modules */
const mysql = require("mysql");


/* Files */


module.exports = function () {

    return class MySQL {

        constructor (params) {
            this._params = params;
        }

        // get icon () {
        //     return this._assetPath("img", "mysql.png");
        // }
        //
        // _assetPath (...args) {
        //     return path.join(__dirname, "..", "assets", ...args);
        // }
        //
        _getPoolConnection () {
            return new Promise((resolve, reject) => {
                this._connection.getConnection((err, connection) => err ? reject(err) : resolve(connection));
            });

        }

        _releasePoolConnection (connection) {
            connection.release();
            return Promise.resolve();
        }

        close () {
            return new Promise((resolve, reject) => {
                this._connection.end(err => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve();
                });
            });
        }

        connect () {
            this._connection = mysql.createPool(this._params);

            return this._getPoolConnection()
                .then(connection => this._releasePoolConnection(connection));
        }

        dbList () {
            return this.query("SHOW DATABASES")
                .then(result => result.map(({ Database }) => Database));
        }

        getParam (param) {
            return this._params[param];
        }

        query (sql) {
            return this._getPoolConnection()
                .then(connection => new Promise((resolve, reject) => {
                    connection.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
                })
                    .then(result => this._releasePoolConnection(connection)
                        .then(() => result)));
        }

        setParam (param, value) {
            this._params[param] = value;
        }

        tableList (db) {
            return this.query(`SHOW FULL TABLES IN ${db}`)
                .then(result => result.map(table => {

                    return {
                        name: table[`Tables_in_${db}`],
                        type: table.Table_type
                    };

                }));
        }

    };

};