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
        .controller(`${module}.DatabaseListCtrl`, function (currentConnection) {

            this.eg = "some input";

        })
        .factory(`${module}.databaseListTpl`, () => fs.readFileSync(`${__dirname}/views/dbList.html`))
        .controller(`${module}.MenubarCtrl`, function (currentConnection) {

            this.eg = "some input";

        })
        .factory(`${module}.menuBarTpl`, () => fs.readFileSync(`${__dirname}/views/menubar.html`))
        .controller(`${module}.ViewportCtrl`, function (currentConnection) {

            this.eg = "some input";

        })
        .factory(`${module}.ViewportTpl`, () => fs.readFileSync(`${__dirname}/views/viewport.html`))
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