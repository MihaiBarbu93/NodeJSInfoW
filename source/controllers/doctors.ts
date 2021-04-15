import { NextFunction, Request, Response } from 'express';
import * as DoctorService from "../services/doctors.service"
import { Doctor } from '../models/doctor.interface';
import { Name } from '../models/name.interface';
import { Facility } from '../models/facility.interface';
import { body, validationResult, CustomValidator } from 'express-validator';



const addDoctor = async (req: Request, res: Response) => {
    try {
        const dr = req.body;
        const names : Name[] = [];
        const facilities: Facility[] = [];
        dr.name.forEach((n: Name) => {
            names.push(
            {
                family: n.family,
                given: n.given,
                text: n.family + n.given
            });
        });
        dr.facility.forEach((f: Facility) => {
            facilities.push(
            {
                value: f.value,
                system: f.system,
                name: f.value + f.system
            });
        });
        const doctor: Doctor = {
            resourceType: dr.resourceType,
            id: dr.id,
            name: names,
            facility: facilities,
            active: dr.active
        };
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newDoctor = await DoctorService.create(doctor);
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};

export default { addDoctor };
