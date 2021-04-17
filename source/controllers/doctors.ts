import { NextFunction, Request, Response } from 'express';
import * as DoctorService from '../services/doctors.service';
import { Doctor } from '../models/doctor.interface';
import { Name } from '../models/name.interface';
import { Facility } from '../models/facility.interface';
import { body, validationResult, CustomValidator } from 'express-validator';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import csv from 'csv-parser';
import * as fs from 'fs';
import { DoctorFromCsv } from '../models/doctorFromCsv.interface';
import { DoctorWithHosp } from '../models/doctorWithHosp.interface';



const addDoctor = async (req: Request, res: Response) => {
    let csvResults: DoctorFromCsv[] = [];
    try {
        if(req.headers['content-type']==='application.json'){
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
        }else if (req.headers['content-type']?.split(';')[0] === 'multipart/form-data') {
            if (!req.files) {
                return res.status(400).send('Please add a file');
            }
            if (req.files.file.mimetype !== 'text/csv') {
                return res.status(400).send('Please add a csv file');
            }
            const file = req.files.file;
            const fileName = file.name;

            file.mv(`./source/assets/csv-files/${fileName}`, async err =>{
                if(err){
                    console.error(err);
                    return res.status(500).send('Problem with file upload');
                }
                
            });
            
            debugger
            fs.createReadStream(`./source/assets/csv-files/${fileName}`)
                .pipe(
                    csv({
                        mapValues: ({ value }) => value.trim()
                    })
                )
                .on('data', (data: any) => csvResults.push(data))
                .on('end', () => {
                    let doctorsToPrint: DoctorWithHosp[] = [];
                    for (let doc of csvResults){
                        let dctr: DoctorWithHosp = {
                            Name: doc.FamilyName + ' ' + doc.GivenName,
                            Names: [doc.NameId],
                            Active: doc.Active == 'true'
                        };
                        if(doctorsToPrint.length === 0 && dctr.Active===true){
                            doctorsToPrint.push(dctr);
                        }else if (dctr.Active === true) {
                            for (let dc of doctorsToPrint) {
                                if (dc.Name === doc.FamilyName + ' ' + doc.GivenName) {
                                    if (!dc.Names.includes(doc.NameId)) {
                                        dc.Names.push(doc.NameId);
                                    }
                                } else {
                                    doctorsToPrint.push(dctr);
                                }
                            }
                        }
                    }
                   
                   
                    
                    doctorsToPrint.forEach(dc => {
                        console.log(`${dc.Name} : ${dc.Names}`);
                    });
                
                });
            res.status(201).json('File added');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export default { addDoctor };
