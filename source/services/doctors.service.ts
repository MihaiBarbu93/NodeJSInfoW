import { Doctor } from '../models/doctor.interface';
import { Request, Response } from 'express';
import { Name } from '../models/name.interface';
import { Facility } from '../models/facility.interface';
import { validationResult } from 'express-validator';
import { DoctorWithHosp } from '../models/doctorWithHosp.interface';


let doctors: Doctor[] = [];

export const find = async (id: number): Promise<Doctor> => doctors.find((d) => d.id === id)!;

export const addJson = (req: Request, res: Response, token: Object) => {
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
        if (token.facility.includes(f.value)) {
            facilities.push({
                value: f.value,
                system: f.system,
                name: f.value + f.system
            });
        }
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
    doctors.push({ ...doctor });
    if (doctor.active === true) {
        console.log('name: ', ...doctor.name, '\nfacilities: ', ...doctor.facility);
    }
    return doctor;
};

export const addCsv = async (req: Request, res: Response, token: Object) =>{
    if (!req.files) {
        return res.status(400).send('Please add a file');
    }
    if (req.files.file.mimetype !== 'text/csv') {
        return res.status(400).send('Please add a csv file');
    }
    let csvResults: any[] = [];
    const file = req.files.file;
    csvResults = file.data
        .toString('utf8')
        .trim()
        .split('\r\n')
        .slice(1)
        .map((row) => row.split(',').map((row) => row.trim()));
    if (!checkCsvInputs(csvResults)) {
        return res.status(400).json('Csv has same id on different names');
    }
    let doctorsToPrint: DoctorWithHosp[] = [];
    for (let doc of csvResults) {
        let dctr: DoctorWithHosp = {
            ID: doc[0],
            Name: `${doc[1]} ${doc[2]}`,
            Names: [doc[5]]
        };
        let docFromList = doctorsToPrint.find((dc) => dc.ID === doc[0]);
        if (doc[6] === 'true' && docFromList && token.facility.includes(doc[3])) {
            doctorsToPrint.find((d) => docFromList)?.Names.push(dctr.Names[0]);
        } else if (doc[6] === 'true' && token.facility.includes(doc[3])) {
            doctorsToPrint.push(dctr);
        }
    }
    doctorsToPrint.forEach((dc) => {
        console.log(`${dc.Name} : ${dc.Names.join(', ')}`);
    });
}

export const checkCsvInputs = (csvData: any[])=>{
    let uniqueDoctors: Record<string, string> = {};
    for(let doc of csvData){
        let id = doc[0];
        if(uniqueDoctors.id===undefined){
            uniqueDoctors[id] = `${doc[1]} ${doc[2]}`
        }
    }
    for(let doc of csvData){
        if(uniqueDoctors[doc[0]] !== `${doc[1]} ${doc[2]}`){
            console.log('id: ', doc[0], `${uniqueDoctors[doc[0]]}`);
            console.log('id: ',doc[0] , `${doc[1]} ${doc[2]}`);
            return false;
        }
    }
    return true;
}
