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
        .controller("query", function (connections, $scope, $stateParams) {

            this.connection = connections.get($stateParams.connection);
            this.database = "browserspy";
            this.query = null;
            this.output = {
                fields: [],
                result: []
            };

            console.log(`USE ${this.database}; ${this.query}`);

            this.submit = () => this.connection.query(`USE ${this.database}; ${this.query}`)
                .then(({ fields, result }) => {
                    this.output.fields = fields;
                    this.output.result = result;

                    $scope.$apply();
                })
                .catch(err => {
                    console.error(err);
                });

        })
        .controller(`${module}.DbConnectionCtrl`, require("./lib/dbConnection"))
        .factory(`${module}.dbConnectionResolve`, () => currentConnection => currentConnection.strategy.dbList()
            .then(result => {

                const databases = [];

                return result.reduce((thenable, database) => thenable
                    .then(() => currentConnection.strategy.tableList(database))
                    .then(tables => {

                        databases.push({
                            children: tables.map(({ name, type }) => ({
                                icon: "fa-table",
                                params: {
                                    database,
                                    table: name
                                },
                                value: name
                            })),
                            params: {
                                database
                            },
                            value: database
                        });

                    }), Promise.resolve())
                        .then(() => databases);

            }))
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