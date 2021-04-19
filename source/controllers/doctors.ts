import { Request, Response } from 'express';
import * as DoctorService from '../services/doctors.service';
import { Doctor } from '../models/doctor.interface';
import { Name } from '../models/name.interface';
import { Facility } from '../models/facility.interface';
import { validationResult} from 'express-validator';
import { DoctorWithHosp } from '../models/doctorWithHosp.interface';
import atob from 'atob';



const addCsv = async (req: Request, res: Response) => {
    let jwtString: string = req.headers['x-vamf-jwt'] !;
    let anonymus: string = atob(jwtString!);
    try {
        var token = JSON.parse(anonymus);
    } catch (error) {
        console.log(error);
    }
    

    console.log(token);
    if (req.headers['content-type']?.split(';')[0] === 'multipart/form-data') {
        if (!req.files) {
            return res.status(400).send('Please add a file');
        }
        if (req.files.file.mimetype !== 'text/csv') {
            return res.status(400).send('Please add a csv file');

        }
        let csvResults: any[] = [];
        const file = req.files.file;
        const fileName = file.name;
        csvResults = req.files.file.data.toString('utf8').split('\r\n').slice(1).map(r=>
               r.split(',').map(r=>r.trim()) 
            );
        if(!DoctorService.checkCsvInputs(csvResults)){
            return res.status(400).send('Csv has same id on different names');
        }
        let doctorsToPrint: DoctorWithHosp[] = [];
        for (let doc of csvResults) {
            let dctr: DoctorWithHosp = {
                ID: doc[0],
                Name: `${doc[1]} ${doc[2]}`,
                Names: [doc[5]],
            };
            let docFromList = doctorsToPrint.find((dc) => dc.ID === doc[0]);
            if (doc[6] === 'true' && docFromList) {
                doctorsToPrint.find((d)=>docFromList)?.Names.push(dctr.Names[0])
            } else if (doc[6]==='true'){
                doctorsToPrint.push(dctr);
            }    
        }
        doctorsToPrint.forEach((dc) => {
            console.log(`${ dc.ID} : ${dc.Name} : ${dc.Names}`);
        });
        res.status(201).json('File added');
    }
}
const addDoctor = async (req: Request, res: Response) => {
    if(req.headers['content-type']==='application/json'){
        const dr = req.body;
        const names: Name[] = [];
        const facilities: Facility[] = [];
        dr.name.forEach((n: Name) => {
            names.push({
                family: n.family,
                given: n.given,
                text: n.family + n.given
            });
        });
        dr.facility.forEach((f: Facility) => {
            facilities.push({
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
    }else {
        return res.status(400).send('Please set content type application/json');
    }
};

export default { addDoctor, addCsv };
