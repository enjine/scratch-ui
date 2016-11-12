/**
 * exports.default = require('./src/client/main');
 *
 * this is the commonJS equivalent of an ES6 export default statement
 * when you do this the exported module will be available as the `.default` property on the imported module
 *
 * yields:
 *
 * in a browser with no loader:
 * <script type="text/javascript" src="myModule.js"></script>
 *
 * var imported = window.myModule.default
 *
 * with a loader
 *
 * var imported = require('myModule').default
 */

module.exports = require('./src/client/main');
