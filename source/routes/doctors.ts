import express  from 'express';
import controller from '../controllers/doctors';
import { body, CustomValidator } from 'express-validator';
import * as DoctorService from '../services/doctors.service';

const router = express.Router();

// Custom validators 
const notDuplicate: CustomValidator = async (id) => {
    return await DoctorService.find(id).then((user) => {
        if (user) {
            return Promise.reject('Doctor already added');
        }
    });
};
const notPratitioner: CustomValidator = (resourceType) => {
    if(resourceType !== "Practitioner"){
        return Promise.reject('Only practitioners are allowed');
    }
}


router.post('/', 
    body('resourceType').notEmpty().custom(notPratitioner),
    body('id').notEmpty().custom(notDuplicate),
    body('active').notEmpty().isBoolean(),
    controller.addCsvOrJson
);

export = router;
