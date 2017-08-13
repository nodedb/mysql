/**
 * mysql
 */

/* Node modules */

/* Third-party modules */
const mysql = require('mysql');

/* Files */

exports.default = class SQL {

  get connectForm () {

    return ({ validators, i18n }) => {
      return [{
        default: 'localhost',
        label: i18n.t('connect:HOSTNAME'),
        model: 'host',
        placeholder: i18n.t('connect:HOSTNAME'),
        type: 'input',
        required: true,
        validator: [
          validators.required,
        ]
      }, {
        label: i18n.t('connect:USERNAME'),
        model: 'user',
        placeholder: i18n.t('connect:USERNAME'),
        type: 'input',
        default: 'root',
      }, {
        label: i18n.t('connect:PASSWORD'),
        model: 'password',
        placeholder: i18n.t('connect:PASSWORD'),
        type: 'input',
        inputType: 'password',
        default: 'q1w2e3r4',
      }, {
        default: 32774,
        label: i18n.t('connect:PORT'),
        model: 'port',
        placeholder: i18n.t('connect:PORT'),
        type: 'input',
        inputType: 'number',
      }];
    };

  }

  get id () {
    return 'mysql';
  }

  get name () {
    return 'MySQL';
  }

  connect (params) {
    const connection = mysql.createConnection(params);

    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  // static get drivers () {
  //   return [{
  //     // name: 'MS-SQL',
  //     // id: 'mssql',
  //     // port: 1433,
  //   // }, {
  //     name: 'MySQL',
  //     id: 'mysql',
  //     port: 3306,
  //   }, {
  //     name: 'Oracle',
  //     id: 'oracle',
  //     port: 1521,
  //   }, {
  //     name: 'PostgreSQL',
  //     id: 'pg',
  //     port: 5432,
  //   }, {
  //     name: 'SQLite3',
  //     id: 'sqlite3',
  //     connectForm: ({ validators, i18n }) => [{
  //       label: i18n.t('connect:FILENAME'),
  //       model: 'filename',
  //       placeholder: i18n.t('connect:FILENAME'),
  //       type: 'input',
  //       inputType: 'file',
  //       required: true,
  //       validator: [
  //         validators.required,
  //       ],
  //     }],
  //   }];
  // }

  static load () {
    // const client = SQL.drivers.find(({ id }) => driver === id);
    //
    // if (!client) {
    //   throw new Error(`Unknown driver type: ${driver}`);
    // }
    //
    // if (!client.connectForm) {
    //   client.connectForm = SQL.defaultForm(client);
    // }

    return new SQL();
  }

};
