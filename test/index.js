require("@babel/polyfill"); // polyfill for phantomjs

const unitTestsContext = require.context("./unit", true, /.+\.js$/);
unitTestsContext.keys().map(unitTestsContext);

const functionalTestsContext = require.context("./functional", true, /.+\.js$/);
functionalTestsContext.keys().map(functionalTestsContext);
