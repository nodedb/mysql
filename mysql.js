/**
 * mysql
 */

"use strict";


/* Node modules */


/* Third-party modules */
const angular = require("angular");


/* Files */


export const module = "vanilladb-mysql";
export const app = angular.module(module, []);


app.factory("vdbMysql", () => {

    return "hello";

});

