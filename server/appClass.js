import express from 'express';
// my files
import router from './routes/index.js';
import config from './config/index.js';
import Database from './db/DataBase.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import Response from './lib/Response.js'; // Hata yakalama sınıfınız
// import createRateLimiter from './middleware/createRateLimiter.js';

class AppClass {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errorHandler(); // Hata yakalama middleware'ini ekleyin
    this.PORT = config.PORT;
    this.connectDatabase();
    this.init();
  }

  middlewares() {
    // const generalLimiter = createRateLimiter(100, 15 * 60 * 1000); // Genel limiter
    // const userLimiter = createRateLimiter(5, 15 * 60 * 1000); // User rotaları için limiter

    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cookieParser());
    this.server.use(
      cors({
        origin: async (origin, callback) => {
          const allowedOrigins = await this.perms();
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      })
    );
    this.server.use(
      mongoSanitize({
        replaceWith: '_',
      })
    );
    // this.server.use('/api/user', userLimiter);
    // this.server.use(generalLimiter);
  }

  routes() {
    this.server.use('/api', router);
  }

  errorHandler() {
    // Genel hata yakalama middleware'i
    this.server.use((err, req, res, next) => {
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const errorResponse = Response.errorResponse(err);
        return res.status(errorResponse.code).json(errorResponse);
      }
      const errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    });
  }

  async connectDatabase() {
    try {
      const db = new Database();
      await db.connect(config);
      console.log('db connect !');
    } catch (error) {
      console.error('connect error', error);
    }
  }

  async perms() {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']; // İzin verilen origin adresleri
    return allowedOrigins;
  }

  init() {
    this.server.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}

export default new AppClass().server;
/*
 const authLimitter = createRateLimiter(5, 15 * 60 * 1000);
    const generalLimiter = createRateLimiter(100);
    this.server.use('/api/login', authLimiter);
    this.server.use('/api/register', authLimiter);
*/
