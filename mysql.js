/**
 * mysql
 */

/* Node modules */
const fs = require("fs");

/* Third-party modules */

/* Files */

module.exports = angular => {

    const module = "nodedb-mysql";
    const app = angular.module(module, []);

    app
        .controller(`${module}.contentCtrl`, require("./lib/contentCtrl"))
        .controller(`${module}.queryCtrl`, require("./lib/queryCtrl"))
        .factory(`${module}.strategy`, require("./lib/strategy"))
        .factory(`${module}.connectForm`, $translate => ({
            type: "object",
            properties: {
                host: {
                    title: $translate.instant("DB.HOST"),
                    type: "string",
                    default: "localhost"
                },
                user: {
                    title: $translate.instant("DB.USER"),
                    type: "string"
                },
                password: {
                    title: $translate.instant("DB.PASSWORD"),
                    type: "string",
                    "x-schema-form": {
                        type: "password"
                    }
                },
                database: {
                    title: $translate.instant("DB.DATABASE"),
                    type: "string"
                },
                port: {
                    default: 3306,
                    exclusiveMinimum: true,
                    minimum: 0,
                    title: $translate.instant("DB.PORT"),
                    type: "integer"
                }
            }
        }));

    return {
        app,
        module
    };

};
