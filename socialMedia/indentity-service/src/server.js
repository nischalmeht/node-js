require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
// const routes = require("./routes/identity-service");
const routes=require("../src/routes/indity-routes")
const helmet = require("helmet");
const app = express();
const { rateLimit } = require("express-rate-limit");
const logger = require("./utils/logger");
const PORT = process.env.PORT || 3001;
const Redis = require("ioredis");
const { RedisStore } = require('rate-limit-redis');
const { RateLimiterRedis } = require("rate-limiter-flexible");
const errorHandler = require("./middlewares/errorHandlers");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/socialmedia")
  .then(() => console.log("Connected to mongodb"))
  .catch((e) => console.log("Mongo connection error", e));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
  });
  const redisClient = new Redis(process.env.REDIS_URL);
  const rateLimiter= new RateLimiterRedis({
    storeClient:redisClient,
    keyPrefix:"middleware",
    points:10,
    duration:1
  })
  app.use((req,res,next)=>{
    rateLimiter.consume(req.ip).then(()=>next()).catch(()=>{
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    })
  })

  const sensitiveEndpointsLimiter=rateLimit({
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
  })
  app.use("/api/auth/register",sensitiveEndpointsLimiter);
  app.use("/api/auth",routes);
  app.use(errorHandler)
app.listen(PORT, () => {
    logger.info(`Example app listening on port ${PORT}`)
  })
  
//unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at", promise, "reason:", reason);
  });