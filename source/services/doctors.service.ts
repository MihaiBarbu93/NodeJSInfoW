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

export const checkCsvInputs = (doctors: any[])=>{
    let uniqueDoctors: Record<string, string> = {};
    for(let doc of doctors){
        let id = doc[0];
        if(uniqueDoctors.id===undefined){
            uniqueDoctors[id] = `${doc[1]} ${doc[2]}`
        }
    }
    for(let doc of doctors){
        if(uniqueDoctors[doc[0]] !== `${doc[1]} ${doc[2]}`){

            console.log('id: ', doc[0], `${uniqueDoctors[doc[0]]}`);
            console.log('id: ',doc[0] , `${doc[1]} ${doc[2]}`);
            return false;
        }
    }
    return true;
}
