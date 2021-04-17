import { Doctor } from '../models/doctor.interface';
import { DoctorFromCsv } from '../models/doctorFromCsv.interface';

let doctors: Doctor[] = [];

export const find = async (id: number): Promise<Doctor> => doctors.find((d) => d.id === id)!;

export const create = async (newDoctor: Doctor): Promise<Doctor> => {
    doctors.push({ ...newDoctor });
    if (newDoctor.active === true) {
        console.log(...newDoctor.name, ...newDoctor.facility);
    }
    return newDoctor;
};

export const checkCsvInputs = (doctors: DoctorFromCsv[])=>{
    let uniqueDoctors: Record<string, string> = {};
    for(let doc of doctors){
        let id = doc.ID;
        if(uniqueDoctors.id===undefined){
            uniqueDoctors[id] = `${doc.FamilyName} ${doc.GivenName}`
        }
    }
    for(let doc of doctors){
        if(uniqueDoctors[doc.ID] !== `${doc.FamilyName} ${doc.GivenName}`){

            console.log('id: ', doc.ID, `${uniqueDoctors[doc.ID]}`);
            console.log('id: ',doc.ID , `${doc.FamilyName} ${doc.GivenName}`);
            return false;
        }
    }
    return true;
}
