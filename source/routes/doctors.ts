import express from 'express';
import controller from '../controllers/doctors';

const router = express.Router();

router.get('/ping', controller.serverHealthCheck);

export = router;
