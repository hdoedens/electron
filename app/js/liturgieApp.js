// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

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