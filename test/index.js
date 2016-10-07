require('es6-promise'); // polyfill for phantomjs

const modulesContext = require.context('./modules', true, /.+\.js$/);
modulesContext.keys().forEach(modulesContext);

//const unitContext = require.context('./unit/com.e750', true, /.+\.js$/);
//unitContext.keys().forEach(unitContext);

const sourceContext = require.context('../src/client', true, /.+\.js$/);
sourceContext.keys().forEach(sourceContext);

