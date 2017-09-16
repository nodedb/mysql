/**
 * mysql
 */

/* Node modules */
const EventEmitter = require('events');
const path = require('path');

/* Third-party modules */
const _ = require('lodash');
const mysql = require('mysql');

/* Files */

exports.default = class MySQL extends EventEmitter {

  constructor () {
    super();

    this.connection = null;
    this.logger = null;
  }

  get iconPath () {
    return path.join(__dirname, 'assets', 'img', 'mysql.png');
  }

  get id () {
    return 'mysql';
  }

  get lang () {
    return 'sql';
  }

  get name () {
    return 'MySQL';
  }

  get params () {
    return this.dbParams || {};
  }

  set params (params) {
    params.multipleStatements = true;

    this.dbParams = params;
  }

  connect () {
    return this.getPooledConnection()
      .then(connection => this.releasePooledConnection(connection));
  }

  connectForm ({ validators, i18n }) {
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
      default: 3306,
      label: i18n.t('connect:PORT'),
      model: 'port',
      placeholder: i18n.t('connect:PORT'),
      type: 'input',
      inputType: 'number',
    }];
  }

  connectionString () {
    return `${this.params.user}@${this.params.host}:${this.params.port}`;
  }

  dbList () {
    return this.query(null, 'SHOW DATABASES')
      .then(({ result }) => result.map(({ Database }) => Database));
  }

  getPooledConnection () {
    if (!this.connection) {
      this.logger('trace', 'Created new MySQL pooled connection', {
        params: this.params,
      });

      this.connection = mysql.createPool(this.params);
    }

    return new Promise((resolve, reject) => {
      this.connection.getConnection((err, connection) => err ? reject(err) : resolve(connection));
    }).then((result) => {
      this.logger('trace', 'Connected to MySQL database');

      return result;
    }).catch((err) => {
      this.logger('warn', 'Error connecting to MySQL database', {
        err,
      });

      return Promise.reject(err);
    });
  }

  query (db, sql, values = []) {
    return this.getPooledConnection()
      .then(connection => new Promise((resolve, reject) => {
        if (db) {
          sql = `USE ??; ${sql};`;

          values.unshift(db);
        }

        const query = connection.query(sql, values);

        this.logger('trace', 'Executing new MySQL query', {
          sql: query.sql,
        });

        const output = {
          fields: [],
          id: null,
          info: null,
          result: []
        };

        query
          .on('error', err => reject(err))
          .on('fields', (fields, index) => {
            output.fields = fields.map(({ name }) => name);
            output.id = index;
          })
          .on('result', (row, index) => {
            if (output.id === index) {
              output.result.push(row);
            } else {
              output.info = row;
            }
          })
          .on('end', () => {
            resolve({
              fields: output.fields,
              result: output.result,
            })
          });
      }).then(result => this.releasePooledConnection(connection)
        .then(() => result)));
  }

  releasePooledConnection (connection) {
    connection.release();

    this.logger('trace', 'Released MySQL connection');

    return Promise.resolve();
  }

  tableOfContents () {
    return this.dbList()
      .then(dbList => dbList.map(db => ({
        name: db,
        icon: 'database',
        db,
        contents: () => [{
          name: 'Tables',
          icon: 'table',
          db,
          contents: () => this.query(null, 'SHOW TABLES FROM ??', [
            db
          ]).then(({ result }) => result.map(table => ({
            name: table[`Tables_in_${db}`],
            icon: 'table',
          }))),
        }, {
          name: 'Views',
          icon: 'eye',
          db,
          contents: () => this.query(null, 'SHOW FULL TABLES IN ?? WHERE TABLE_TYPE LIKE ?', [
            db,
            'VIEW'
          ]).then(({ result }) => result.map(table => ({
            name: table[`Tables_in_${db}`],
            icon: 'eye',
          }))),
        }, {
          name: 'Stored Procedures',
          icon: 'cog',
          db,
          contents: () => this.query(null, 'SHOW PROCEDURE STATUS WHERE Db = ?', [
            db,
          ]).then(({ result }) => result.map(table => ({
            name: table.Name,
            icon: 'cog',
          }))),
        }, {
          name: 'Functions',
          icon: 'exclamation',
          db,
          contents: () => this.query(null, 'SHOW FUNCTION STATUS WHERE Db = ?', [
            db,
          ]).then(({ result }) => result.map(table => ({
            name: table.Name,
            icon: 'exclamation',
          }))),
        }, {
          name: 'Triggers',
          icon: 'bolt',
          db,
          contents: () => this.query(null, 'SHOW TRIGGERS FROM ??', [
            db,
          ]).then(({ result }) => result.map(table => ({
            name: table.Trigger,
            icon: 'bolt',
          }))),
        }, {
          name: 'Events',
          icon: 'clock-o',
          db,
          contents: () => this.query('information_schema', 'SELECT * FROM ?? WHERE BINARY ?? = ? ORDER BY ??', [
            'EVENTS',
            'EVENT_SCHEMA',
            db,
            'EVENT_NAME',
          ]).then(({ result }) => result.map(table => ({
            name: table.EVENT_NAME,
            icon: 'clock-o',
          }))),
        }],
      })));
  }

  static load () {
    return new MySQL();
  }

};
