const cors = require("cors");
const express = require("express");
const {
  computeAll,
  computeCosts,
  computeEvolution,
  computePowers,
  computeStationary
} = require("./markov");

function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (request, response) => {
    response.json({
      status: "ok",
      service: "Markov Chain Desktop Suite API"
    });
  });

  const route = (handler) => (request, response) => {
    try {
      response.json(handler(request.body));
    } catch (error) {
      response.status(400).json({
        error: error.message || "Unable to compute Markov chain result."
      });
    }
  };

  app.post("/compute/powers", route(computePowers));
  app.post("/compute/evolution", route(computeEvolution));
  app.post("/compute/stationary", route(computeStationary));
  app.post("/compute/costs", route(computeCosts));
  app.post("/compute/all", route(computeAll));

  return app;
}

function startApiServer(options = {}) {
  const host = options.host || "127.0.0.1";
  const port = Number(options.port ?? process.env.PORT ?? 3333);
  const app = createApp();

  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, () => {
      const address = server.address();
      const url = `http://${host}:${address.port}`;

      resolve({
        app,
        server,
        url,
        close: () => new Promise((done) => server.close(done))
      });
    });

    server.once("error", reject);
  });
}

if (require.main === module) {
  startApiServer()
    .then(({ url }) => {
      console.log(`Markov Chain Desktop Suite API listening at ${url}`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  createApp,
  startApiServer
};
