/**
 * dbConnection
 */

/* Node modules */

/* Third-party modules */

/* Files */

function Ctrl (connections, databaseList, $scope, $state, $stateParams, $translate) {

    const init = () => {

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

    this.connection = connections.get($stateParams.connection);
    this.controller = {
        query: true
    };
    this.database = $stateParams.db;
    this.databaseList = databaseList;
    this.tables = [];

    this.nav = [{
        active: this.controller.query,
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
