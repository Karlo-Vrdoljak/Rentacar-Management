export const ONE_SECOND = 1000;
export enum ELocalStorage {
	JWT = 'rentner_jwt',
}

export interface VehicleStatus {
	changedAt: Date;
	createdAt: Date;
	name: string;
	pkVehicleStatus: number;
}
export interface Vehicle {
	changedAt: string;
	code: string;
	color: string;
	createdAt: string;
	currentKilometers: string;
	dateOfManufacture: string;
	gasType: string;
	manufacturer: string;
	model: string;
	pkStatus: number;
	pkVehicle: number;
	startingKilometers: string;
	vehicleStatus?: VehicleStatus;
}
