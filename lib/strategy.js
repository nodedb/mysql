/**
 * strategy
 */

"use strict";


/* Node modules */
const path = require("path");


/* Third-party modules */
const mysql = require("mysql");


/* Files */


module.exports = function (Strategy) {

    return class MySQL extends Strategy {

        get icon () {
            return this._assetPath("img", "mysql.png");
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

        connect () {
            this._connection = mysql.createPool(this._params);

            return this._getPoolConnection()
                .then(connection => this._releasePoolConnection(connection));
        }

    };

};