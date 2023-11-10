import express from 'express';
import * as bodyParser from 'body-parser';
import 'dotenv/config';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error.middleware';
import verifyTokenMiddleware from './middleware/verifiyToken.middleware';
import audit from 'express-requests-logger';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(errorMiddleware);
    this.app.use(verifyTokenMiddleware);
    // this.app.use(audit()); // Logger
    // Maybe use validation Middleware to protect models
    /** @see https://wanago.io/2018/12/17/typescript-express-error-handling-validation/ */
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      if (controller.path !== '/login' || controller.path !== '/resetPassword') {
        this.app.use('/', controller.router);
      }
      // If route is /login, don't attach token verification middleware, even if already check '/login'
      this.app.use(controller.router);
    });
  }

  public connectDatabase() {
    mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + process.env.MONGO_PATH + '/?retryWrites=true&w=majority');
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Erreur de connexion a la base de base de donnees'));
    db.once('open', () => {
      console.log('Connecte a la base de donnees');
    })
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;