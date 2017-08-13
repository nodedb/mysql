/**
 * dbConnection
 */

/* Node modules */

/* Third-party modules */

/* Files */

function Ctrl (connections, databaseList, $scope, $state, $stateParams, $translate) {

    let params;
    try {
        params = JSON.parse($stateParams.params);
    } catch (err) {
        params = {};
    }

    const init = () => {

        if (!this.activeTable) {
            this.nav.forEach(nav => {
                // if (nav.state)
            });
        }

        this.connection.connect()
            .then(() => this.connection.strategy.tableList(this.database))
            .then(tables => tables.forEach(table => {
                this.tables.push({
                    icon: "fa-table",
                    value: table.name
                });
            }))
            .then(() => $scope.$apply());

    };

    this.changeDb = () => {
        $stateParams.db = this.database;

        const data = this.updateParams("activeTable");

        return $state.go(".", data, {
            reload: true
        });
    };

    this.changeTable = (status, item) => {
        if (status === "active") {
            this.activeTable = item.value;

            const data = this.updateParams("activeTable", this.activeTable);

            console.log(this.activeTable);

            return $state.go(".", data, {
            //     notify: false
            });
        }
    };

    this.updateParams = (key, value = void 0) => {
        if (value === void 0) {
            delete params[key];
        } else {
            params[key] = value;
        }

        $stateParams.params = JSON.stringify(params);

        return $stateParams;
    };

    this.activeTable = params.activeTable;
    this.connection = connections.get($stateParams.connection);
    this.controller = {
        list: params.state === "list",
        query: params.state === "query" || !params.state
    };
    this.database = $stateParams.db;
    this.databaseList = databaseList;
    this.tables = [];

    this.nav = [{
        active: this.controller.list,
        disabled: !this.activeTable,
        params: {
            activeTable: this.activeTable,
            state: "list"
        },
        stack: [
            "fa-square fa-stack-2x color--black",
            "fa-list fa-stack-1x fa-inverse"
        ],
        title: $translate.instant("TABS.CONTENT")
    }, {
        active: this.controller.query,
        params: {
            activeTable: this.activeTable,
            state: "query"
        },
        stack: [
            "fa-square fa-stack-2x color--black",
            "fa-terminal fa-stack-1x fa-inverse"
        ],
        title: $translate.instant("TABS.QUERY")
    }];

    if (!this.database) {
        this.database = this.databaseList[0];
        this.changeDb();
    }

    init();

}

module.exports = Ctrl;
