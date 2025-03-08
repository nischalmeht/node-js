require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const Redis = require("ioredis");
const proxy = require("express-http-proxy");
const { RedisStore } = require("rate-limit-redis");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");

const logger = require("./utils/logger");
app.use(helmet());
app.use(cors());
app.use(express.json());
// const redisClient = new Redis(process.env.REDIS_URL);
const redisClient = new Redis(process.env.REDIS_URL);
const ratelimit=rateLimit({
    max: 100,
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
  app.use(ratelimit);
  app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
  });
  const proxyOptions={
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, "/api");
      },
      proxyErrorHandler: (err, res, next) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({
          message: `Internal server error`,
          error: err.message,
        });
      }
  }
  app.use("/v1/auth",proxy(process.env.INDENTITY_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
      },
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(
          `Response received from Identity service: ${proxyRes.statusCode}`
        );
        console.log(proxyResData,'proxyResData')
        return proxyResData;
    }
  }))
app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
    logger.info(
        `Identity service is running on port ${process.env.IDENTITY_SERVICE_URL}`
      );
    logger.info(`API Gateway is running on port ${PORT}`);
})