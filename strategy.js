/**
 * strategy
 */

"use strict";


/* Node modules */
const path = require("path");


/* Third-party modules */
const _ = require("lodash");
const mysql = require("mysql");


/* Files */


class Strategy {

    constructor (params, key) {

        this._connection = null;
        this._key = key;
        this._params = params;

    }


    get connectionData () {
        return this._params;
    }


    get icon () {
        return this._assetPath("img", "mysql.png");
    }


    get key () {
        return this._key;
    }


    get menubar () {
        return [{
            icon: this._assetPath("img", "terminal-icon.png"),
            name: "QUERY"
        }];
    }


    get name () {
        return this.connectionData.name;
    }


    _assetPath (...args) {
        return path.join(__dirname, "assets", ...args);
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


    connect () {
        this._connection = mysql.createPool(this._params);

        return this._getPoolConnection()
            .then(connection => this._releasePoolConnection(connection));
    }


    databases () {
        return this.query("SHOW DATABASES")
            .then(result => result.map(({ Database }) => Database));
    }


    disconnect () {
        return new Promise((resolve, reject) => {
            this._connection.end(err => err ? reject(err) : resolve());
        });
    }


    query (sql) {
        return this._getPoolConnection()
            .then(connection => new Promise((resolve, reject) => {
                connection.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
            })
                .then(result => this._releasePoolConnection(connection)
                    .then(() => result)));
    }


    tables (db) {
        return this.query(`SHOW TABLE in ${db}`);
    }


    static get connectForm () {

        return {
            type: "object",
            properties: {
                host: {
                    type: "string",
                    default: "localhost"
                },
                user: {
                    type: "string"
                },
                password: {
                    type: "string",
                    "x-schema-form": {
                        type: "password"
                    }
                },
                database: {
                    type: "string"
                },
                port: {
                    type: "integer",
                    default: 3306,
                    minimum: 0,
                    exclusiveMinimum: true
                }
            }
        };

    }


}



exports.Strategy = Strategy;
