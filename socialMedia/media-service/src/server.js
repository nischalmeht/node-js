require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("../../post-service/src/middleware/errorHandler");
const app = express();
const mediaRoutes = require("./routes/media-routes"); 
const helmet = require("helmet");
const logger = require("./utils/logger");
const PORT = process.env.PORT || 3003;
const bodyParser = require('body-parser'); 
const { createConnection } = require("./utils/rabbitmq");

//connect to mongodb
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));


  app.use(cors());
  app.use(helmet());
  
// app.use(bodyParser.json());
  app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
  });

  
app.use("/api/media", mediaRoutes);

app.use(errorHandler);
async function startServer() {
    try {
      await createConnection();
      app.listen(PORT, () => {
        logger.info(`Post service running on port ${PORT}`);
      });
    } catch (error) {
      console.log(error)
      logger.error("Failed to connect to server", error);
      process.exit(1);
    }
  }
  startServer();
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at", promise, "reason:", reason);
  });