import { Request, Response } from 'express';
import * as DoctorService from '../services/doctors.service';
import atob from 'atob';
import _  from 'underscore';

const addCsvOrJson = async (req: Request, res: Response) => {
    let roles: string[] = ["Admin", "Practitioner"];
    let token = {};
    try{
        let jwtString = req.headers['x-vamf-jwt'];
        let tokenString = atob(jwtString);

        token = JSON.parse(tokenString);
    } catch (error) {
        return res.status(403).send('Not authorize to accest this endpoint');
    }
    if(!_.intersection(token.roles, roles).length){
        return res.status(403).send('Not authorize to accest this endpoint');
    }

    if (req.headers['content-type']!.includes('multipart/form-data')) {
        const a = await DoctorService.addCsv(req, res, token);
        if(a===undefined){
            return res.status(201).json('File added');
        }
    }
    if (req.headers['content-type'] === 'application/json') {
        const newDoctor = DoctorService.addJson(req,res, token);
        return res.status(201).json(newDoctor);
    }
    return
};

export default { addCsvOrJson };
