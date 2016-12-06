/**
 * mysql
 */

"use strict";


/* Node modules */
const fs = require("fs");


/* Third-party modules */


/* Files */


module.exports = angular => {

    const module = "nodedb-mysql";
    const app = angular.module(module, []);

    app
        .controller(`${module}.DbConnectionCtrl`, function (currentConnection, databaseList) {

            this.databaseList = databaseList;

        })
        .factory(`${module}.dbConnectionResolve`, () => {

            return currentConnection => currentConnection.dbList()
                .then(result => {

                    const databases = [];

                    return result.reduce((thenable, database) => thenable
                        .then(() => currentConnection.tableList(database))
                        .then(tables => {
                            databases.push({
                                database,
                                tables
                            });
                        }), Promise.resolve())
                            .then(() => databases);

                });

        })
        .factory(`${module}.dbConnectionTpl`, () => fs.readFileSync(`${__dirname}/views/dbConnection.html`))
        .factory(`${module}.strategy`, require("./lib/strategy"))
        .factory(`${module}.connectForm`, () => {

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

        });

    return {
        app,
        module
    };

};