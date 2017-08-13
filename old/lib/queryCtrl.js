/**
 * queryCtrl
 */

/* Node modules */

/* Third-party modules */

/* Files */

module.exports = function (connections, hotkeys, $scope, $stateParams, $translate) {

    ///////////////
    /// Actions ///
    ///////////////

    const init = () => {

        hotkeys.add({
            combo: "mod+enter",
            allowIn: [
                "TEXTAREA"
            ],
            description: $translate.instant("HELP.EXECUTE"),
            callback: () => this.submit()
        });

    };

    const submit = () => Promise.resolve()
        .then(() => {
            if (this.query) {
                return this.connection.query(`USE ${this.database}; ${this.query}`);
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

    ////////////
    /// Data ///
    ////////////

    this.connection = connections.get($stateParams.connection);

    this.database = $stateParams.db;

    this.error = null;

    this.output = {
        fields: [],
        result: []
    };

    this.query = "";

    this.submit = submit;

    /////////////////
    /// Listeners ///
    /////////////////

    init();

};
