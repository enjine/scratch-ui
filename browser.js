const App = require("./index");

const config = window.Scratch.config || {},
  fixtures = config.fixtures || {},
  options = config.options || {},
  app = new App(options.rootEl || "body", {
    fixtures: fixtures,
    options: options
  });

document.addEventListener("DOMContentLoaded", app.start.bind(app), false);
