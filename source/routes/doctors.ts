import express , { Request, Response } from 'express';
import controller from '../controllers/doctors';
import { body, validationResult, CustomValidator } from 'express-validator';
import * as DoctorService from '../services/doctors.service';

const router = express.Router();
const notDuplicate: CustomValidator = async (id) => {
    return DoctorService.find(id).then((user) => {
        if (user) {
            return Promise.reject('Doctor already added');
        }
    });
};
const notPratitioner: CustomValidator = async (resourceType) => {
    if(resourceType !== "Practitioner"){
        return Promise.reject('Only practitioners are allowed');
    }
}
router.post('/', 
    body('resourceType').notEmpty().custom(notPratitioner),
    body('id').notEmpty().custom(notDuplicate),
    body('active').notEmpty().isBoolean(),
    controller.addDoctor
);
router.put('/', controller.addCsv)

export = router;
