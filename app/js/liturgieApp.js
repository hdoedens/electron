var log = require('electron-log')
// log.transport.file = false;
log.transports.console.level = 'warning';
/** 
 * Set output format template. Available variables:
 * Main: {level}, {text}
 * Date: {y},{m},{d},{h},{i},{s},{ms}
 */
log.transports.console.format = '{h}:{i}:{s} {text}';
 
// Set a function which formats output 
// log.transports.console.format = (msg) => msg.text;

angular.module('liturgieApp', ['ui.bootstrap', 'typeAhead', 'pouchdb'])
angular.module('liturgieApp').value('log', log)