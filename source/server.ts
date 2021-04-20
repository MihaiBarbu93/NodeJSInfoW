import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logging from './config/logging';
import config from './config/config';
import doctorRoutes from './routes/doctors';
import { errorHandler } from './middleware/error';
import { notFoundHandler } from './middleware/not-found';
import fileUpload from 'express-fileupload';

const NAMESPACE = 'Server';
const router = express();

router.use(helmet());
router.use(cors());
router.use(express.json());
router.use(fileUpload());

router.use('/', doctorRoutes);

router.use(errorHandler);
router.use(notFoundHandler);

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));
