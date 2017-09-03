/**
 * strategy
 */

"use strict";

/* Node modules */
const fs = require("fs");
const path = require("path");


/* Third-party modules */
const mysql = require("mysql");


/* Files */


module.exports = function ($stateParams) {

    const alphabetise = (a, b) => {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    };

    class MySQL {

        constructor (params = {}) {
            params.multipleStatements = true;

            this._params = params;
        }

        get icon () {
            return this._assetPath("img", "mysql.png");
        }

        get nav () {

            const module = "nodedb-mysql";

            return [{
                controller: `${module}.contentCtrl`,
                disabled: !$stateParams.table,
                stack: [
                    "fa-square fa-stack-2x color--black",
                    "fa-list fa-stack-1x fa-inverse"
                ],
                title: "CONTENT",
                template: fs.readFileSync(`${__dirname}/../views/content.html`, "utf8")
            }, {
                controller: `${module}.queryCtrl`,
                stack: [
                    "fa-square fa-stack-2x color--black",
                    "fa-terminal fa-stack-1x fa-inverse"
                ],
                title: "QUERY",
                template: fs.readFileSync(`${__dirname}/../views/query.html`, "utf8")
            }];

        }

        _assetPath (...args) {
            return path.join(__dirname, "..", "assets", ...args);
        }

        _getPoolConnection () {
            return new Promise((resolve, reject) => {
                this._connection.getConnection((err, connection) => err ? reject(err) : resolve(connection));
            });

        }

        _releasePoolConnection (connection) {
            connection.release();
            return Promise.resolve();
        }

        about () {
            return {
                database: "DATABASE",
                tables: "TABLES"
            };
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
                .then(({ result }) => result.map(({ Database }) => Database))
                .then(databases => databases.sort(alphabetise));
        }

        // getParam (param) {
        //     return this._params[param];
        // }

        query (sql) {
            return this._getPoolConnection()
                .then(connection => new Promise((resolve, reject) => {
                    const query = connection.query(sql);

                    const output = {
                        _id: null,
                        fields: null,
                        info: null,
                        result: []
                    };

                    query
                        .on("error", err => reject(err))
                        .on("fields", (fields, index) => {
                            output.fields = fields;
                            output._id = index;
                        })
                        .on("result", (row, index) => {
                            if (output._id === index) {
                                output.result.push(row);
                            } else {
                                output.info = row;
                            }
                        })
                        .on("end", () => {
                            resolve(output)
                        });
                })
                    .then(result => this._releasePoolConnection(connection)
                        .then(() => result)));
        }

        // setParam (param, value) {
        //     this._params[param] = value;
        // }

        tableList (db) {
            return this.query(`SHOW FULL TABLES IN ${db}`)
                .then(({ result }) => result.map(table => ({
                    type: table.Table_type,
                    value: table[`Tables_in_${db}`]
                })))
                .then(tables => tables.sort((a, b) => alphabetise(a.value, b.value)));
        }

    }

    return MySQL;

};
