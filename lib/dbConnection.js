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

        if (params.activeTable) {
            this.activeTable = params.activeTable;
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

        return $state.go(".", $stateParams, {
            reload: true
        });
    };

    this.changeTable = (status, item) => {
        if (status === "active") {

            const data = this.updateParams("activeTable", item.value);

            return $state.go(".", data, {
                notify: false
            });

        }
    };

    this.updateParams = (key, value = void 0) => {

        params[key] = value;

        $stateParams.params = JSON.stringify(params);

        return $stateParams;

    };

    this.activeTable = null;
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
        params: JSON.stringify({
            state: "list"
        }),
        stack: [
            "fa-square fa-stack-2x color--black",
            "fa-list fa-stack-1x fa-inverse"
        ],
        title: $translate.instant("TABS.CONTENT")
    }, {
        active: this.controller.query,
        params: JSON.stringify({
            state: "query"
        }),
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
