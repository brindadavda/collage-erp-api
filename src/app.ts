/* eslint-disable import/first */
import * as http from 'http';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mongoose from 'mongoose';

dotenv.config();
// Controllers (route handlers)
import ApplicationConfig from './application.routes';
import Config from './config';
import { log } from './utils/winston-logger';

const mongoUrl: string = Config.mongodb.url;
const PORT: string | number = Config.server.port;
class App {
	public app: express.Application;

	constructor() {
		this.app = express();
		const server = http.createServer(this.app);
		server.listen(PORT, () => {
			log.info('Server is running on port', PORT);
		});
		this.config();
		this.mongoSetup();
	}

	private config(): void {
		this.app.use(
			cors({
				origin: true,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
				allowedHeaders: [
					'Origin',
					' X-Requested-With',
					' Content-Type',
					' Accept ',
					' Authorization',
					'x-ms-bot-agent',
					'User-Agent',
				],
				credentials: true,
			}),
		);
		this.app.use(express.json({ limit: '50mb' }));
		this.app.use(
			express.urlencoded({
				limit: '50mb',
				extended: true,
				parameterLimit: 50000,
			}),
		);
		// extended: false, limit: 50 * 1000
		// Register Routers.
		ApplicationConfig.registerRoute(this.app);

		// Start static serving.
		this.app.use(express.static('public'));

    /**
     * Catch 404 routes
     */
    this.app.use((req, res, next) => {
      const err: any = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    /**
     * Error Handler
     */
    this.app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.json(err);
    });

	}

  /**
   * Establishes MongoDB connection
   */
	private mongoSetup(): void {
		mongoose.connection.on('connected', () => {
			log.info('DATABASE - Connected');
		});

		mongoose.connection.on('error', (err) => {
			log.error(`DATABASE - Error:${err}`);
		});

		mongoose.connection.on('disconnected', () => {
			log.warn('DATABASE - disconnected  Retrying....');
		});

		const dbOptions = {
			maxPoolSize: 5,
			useNewUrlParser: true,
		};
		mongoose.connect(mongoUrl, dbOptions);
	}
}

// Start Application.
new App();