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
            this.error = null;
            this.query = "";
            this.output = {
                fields: [],
                result: [{"id":1,"first_name":"tits"},{"id":2,"first_name":"more tits"},{"id":3,"first_name":"spank"}]
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
                    this.error = null;
                    this.output.fields = fields;
                    this.output.result = result;
                })
                .catch(err => this.error = err)
                .then(() => $scope.$apply());

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
