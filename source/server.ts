import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logging from './config/logging';
import config from './config/config';
import sampleRoutes from './routes/doctors';

const NAMESPACE = 'Server';
const router = express();

router.use(helmet());
router.use(cors());
router.use(express.json());
/** Routes go here */
router.use('/api/doctors', sampleRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));
