import { NextFunction, Request, Response } from 'express';
import * as DoctorService from "../services/doctors.service"
import { Doctor } from '../models/doctor.interface';

const addDoctor = async (req: Request, res: Response) => {
    try {
        const doctor: Doctor = req.body;
        const newDoctor = await DoctorService.create(doctor);
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};

export default { addDoctor };
