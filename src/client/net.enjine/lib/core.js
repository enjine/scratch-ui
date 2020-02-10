import Mustache from "mustache";
import Evt from "./event/Registry";
import axios from "axios";
import Cookies from "cookies-js";

export const net = {
  http: {
    /**
     * Base NET request function
     * returns an A+ promise
     * @param options
     * @returns {*}
     */
    exec: function(url, options) {
      //console.info('EXEC', this, url, options);
      options.url = url;
      options.onDownloadProgress =
        options.onDownloadProgress ||
        function(e) {
          this.emit(Evt.DOWNLOAD_PROGRESS, e);
        }.bind(this);
      options.onUploadProgress =
        options.onUploadProgress ||
        function(e) {
          this.emit(Evt.UPLOAD_PROGRESS, e);
        }.bind(this);
      this.emit(Evt.BEFORE_XHR, options);
      return axios.request(options);
    },
    /**
     * GET, POST, PUT, DELETE methods
     * @param String url
     * @param Object options
     * @returns native promises
     */

    getJSON: function(url, options) {
      Object.assign(options, {
        method: "GET",
        headers: Object.assign(options.headers || {}, {
          Accept: "application/json",
          "Content-Type": "application/json"
        })
      });
      return net.http.exec.call(this, url, options);
    },

    postJSON: function(url, data, options) {
      Object.assign(options, {
        method: "POST",
        headers: Object.assign(options.headers || {}, {
          Accept: "application/json",
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(data)
      });
      return net.http.exec.call(this, url, options);
    },

    get: function(url, options) {
      options.method = "GET";
      return net.http.exec.call(this, url, options);
    },

    post: function(url, options) {
      options.method = "POST";
      return net.http.exec.call(this, url, options);
    },

    put: function(url, options) {
      options.method = "PUT";
      return net.http.exec.call(this, url, options);
    },

    del: function(url, options) {
      options.method = "DELETE";
      return net.http.exec.call(this, url, options);
    }
  }
};

export const storage = {
  cookie: Cookies
};

export const jst = {
  templates: {},

  getFromDOM: name => {
    let template = document.getElementById(name);
    if (template) {
      return template.innerText;
    }
    throw new ReferenceError("No such elementId: " + name);
  },

  compile: (templateStr, data, partials) => {
    return Mustache.render(templateStr, data, partials);
  },

  compileToDOM: (templateStr, data, partials) => {
    try {
      let parser = new DOMParser();
      return parser.parseFromString(
        jst.compile(templateStr, data, partials),
        "text/html"
      ).body.firstElementChild;
    } catch (e) {
      throw Error("Unable to parse string to DOM", e.message);
    }
  }
};

export default { net, storage, jst };
