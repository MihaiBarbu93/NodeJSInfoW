import { ResourceType } from "./enums/resourceType";
import { Facility } from "./facility.interface";
import { Name } from "./name.interface";

export interface Doctor {
    resourceType: ResourceType;
    id: number;
    name: Name[];
    facility: Facility[];
    active: Boolean;
}
