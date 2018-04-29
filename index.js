/**
 * index
 */

/* Node modules */
const path = require('path');

/* Third-party modules */

/* Files */
const Connection = require('./connection');

module.exports =  {

    createDriver() {
        return this;
    },

    createConnection(opts) {
        return new Connection(opts);
    },

    displayType: 'table',

    id: 'mysql',

    lang: 'text/x-mysql',

    loginForm: [{
        label: 'HOST',
        key: 'host',
        type: 'text',
        default: 'localhost',
        required: true
    }, {
        label: 'PORT',
        key: 'port',
        type: 'number',
        default: 13306,
        required: true
    }, {
        label: 'USERNAME',
        key: 'user',
        default: 'root',
        type: 'text',
    }, {
        label: 'PASSWORD',
        key: 'password',
        default: 'q1w2e3r4',
        type: 'password',
    }],

    logo: path.join(__dirname, 'logo.png'),

    name: 'MySQL-single',

};
