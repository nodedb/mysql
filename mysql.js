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
        .controller("query", function (connections, hotkeys, $scope, $stateParams, $translate) {

            this.connection = connections.get($stateParams.connection);
            this.database = $stateParams.db;
            this.query = "";
            this.output = {
                fields: [],
                result: []
            };

            this.submit = () => Promise.resolve()
                .then(() => {
                    if (this.query) {
                        return this.connection.query(`USE ${this.database}; ${this.query}`)
                    } else {
                        return {
                            fields: [],
                            result: []
                        };
                    }
                })
                .then(({ fields, result }) => {
                    this.output.fields = fields;
                    this.output.result = result;

                    $scope.$apply();
                })
                .catch(err => {
                    console.error(err);
                });

            hotkeys.add({
                combo: "mod+enter",
                allowIn: [
                    "TEXTAREA"
                ],
                description: $translate.instant("HELP.EXECUTE"),
                callback: () => this.submit()
            });

        })
        .controller(`${module}.DbConnectionCtrl`, require("./lib/dbConnection"))
        .factory(`${module}.dbConnectionResolve`, () => currentConnection => currentConnection.strategy.dbList())
        .factory(`${module}.dbConnectionTpl`, () => fs.readFileSync(`${__dirname}/views/dbConnection.html`))
        .factory(`${module}.strategy`, require("./lib/strategy"))
        .factory(`${module}.connectForm`, ($translate) => {

            return {
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
            };

        });

    return {
        app,
        module
    };

};
