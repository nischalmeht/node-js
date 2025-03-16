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
const { validateToken } = require("./middleware/authMiddleware");
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
        console.log(err,'err')
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
        try {
          const parsedData = JSON.parse(proxyResData.toString('utf-8'));
          console.log(parsedData, 'Parsed proxyResData');
          return parsedData;
        } catch (error) {
          logger.error(`Error parsing JSON from Identity service: ${error.message}`);
          return { success: false, message: "Invalid response from Identity service" };
        }
    }
  }))
  app.use("/v1/posts",validateToken ,proxy(process.env.POST_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json";
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
        return proxyReqOpts;
      },
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(
          `Response received from Post service: ${proxyRes.statusCode}`
        );
        console.log(proxyResData,'proxyResData')
        return proxyResData;
    }
  }))
  
app.use(
  "/v1/media",
  validateToken,
  proxy(process.env.MEDIA_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      if (!srcReq.headers["content-type"].startsWith("multipart/form-data")) {
        proxyReqOpts.headers["Content-Type"] = "application/json";
      }

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from media service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
    parseReqBody: false,
  })
);
app.use(
  "/v1/search",
  validateToken,
  proxy(process.env.SEARCH_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from Search service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);
// app.use(error)

  app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
    logger.info(
        `Identity service is running on port ${process.env.IDENTITY_SERVICE_URL}`
      );
      logger.info(
        `Post service is running on port ${process.env.POST_SERVICE_URL}`
      );
      logger.info(
        `Post service is running on port ${process.env.POST_SERVICE_URL}`
      );
      logger.info(
        `Search service is running on port ${process.env.SEARCH_SERVICE_URL}`
      );
    logger.info(`API Gateway is running on port ${PORT}`);
  })