import { Doctor } from "../models/doctor.interface"


let doctors: Doctor[] = [];

export const findAll = async (): Promise<Doctor[]> => doctors;

export const find = async (id: number): Promise<Doctor> => doctors.find(d=>d.id===id)!;

export const create = async (newDoctor: Doctor): Promise<Doctor> => {
    doctors.push({...newDoctor});
    return newDoctor;
};