import express , { Request, Response } from 'express';
import controller from '../controllers/doctors';

const router = express.Router();

router.post('/addDoctor', controller.addDoctor);

export = router;
