require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const { createConnection, consumeEvent } = require("./utils/rabbitmq");
const app = express();
const searchRoutes = require("./routes/search-routes");
const { handleSearchEvent } = require("./eventHandlers/search-eventhandler");
const PORT = process.env.PORT || 3004;
// Middleware
app.use(express.json());
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));


// Start the server
app.use(helmet());
app.use(cors());
// Routes
app.use("/api/search", searchRoutes);
async function startServer() {
    try {
    await createConnection();      
      await consumeEvent("post.created",handleSearchEvent);
      app.listen(PORT, () => {
        logger.info(`Post service running on port ${PORT}`);
      });
    } catch (error) {
      logger.error("Failed to connect to server", error);
      process.exit(1);
    }
  }
  startServer();