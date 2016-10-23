require('es6-promise'); // polyfill for phantomjs

const unitTestsContext = require.context('./unit', true, /.+\.js$/);
unitTestsContext.keys().forEach(unitTestsContext);

const functionalTestsContext = require.context('./functional', true, /.+\.js$/);
functionalTestsContext.keys().forEach(functionalTestsContext);

const sourceFilesContext = require.context('../src/client', true, /.+\.js$/);
sourceFilesContext.keys().forEach(sourceFilesContext);
