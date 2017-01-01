/**
 * dbConnection
 */

/* Node modules */
const EventEmitter = require("events").EventEmitter;

/* Third-party modules */

/* Files */

const event = new EventEmitter();

function Ctrl (databaseList, $stateParams, $translate) {

    event.on("state", (...args) => {
        console.log(args);
    });

    this.controller = {
        query: true
    };
    this.currentDb = $stateParams.db;
    this.databaseList = databaseList;
    this.emitter = (status, params) => {
        event.emit("state", status, params);
    };

    this.nav = [{
        stack: [
            "fa-square fa-stack-2x color--black",
            "fa-terminal fa-stack-1x fa-inverse"
        ],
        title: $translate.instant("TABS.QUERY")
    }];

}

module.exports = Ctrl;