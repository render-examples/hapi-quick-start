"use strict";

const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0" // needed for Render deployment
});

server.route({
  method: "GET",
  path: "{path*}",
  handler: (request, h) => {
    return h.redirect(process.env.REDIRECT_TO + request.params.path).code(301);
  }
});

const init = async () => {

  await server.register([
    {
      plugin: require("@hapi/inert"),
      options: {}
    },
    {
      plugin: require("hapi-pino"),
      options: {
        prettyPrint: true,
        logEvents: ["response", "onPostStart"]
      }
    }]);

  server.route({
    method: "GET",
    path: "/hello",
    handler: (request, h) => {

      return h.file("./public/hello.html");
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {

  console.log(err);
  process.exit(1);
});

init();
