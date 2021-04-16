import { Doctor } from "../models/doctor.interface"


let doctors: Doctor[] = [];

export const find = async (id: number): Promise<Doctor> => doctors.find(d=>d.id===id)!;

export const create = async (newDoctor: Doctor): Promise<Doctor> => {
    doctors.push({...newDoctor});
    if(newDoctor.active===true){
        console.log(...newDoctor.name, ...newDoctor.facility)
    }
    return newDoctor;
};