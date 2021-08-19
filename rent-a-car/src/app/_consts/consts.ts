import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from '../_abstract/base.class';

export const ONE_SECOND = 1000;
export enum ELocalStorage {
	JWT = 'rentner_jwt',
}
export const MAX_LOADER_SHOW = 10000;

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
export interface Interaction {
	id: EInteractionReducer;
	args?: any;
}
export enum EInteractionReducer {
	logoff,
	loggedIn,
}
export interface DialogRef {
	ref: DynamicDialogRef;
	cfg: DynamicDialogConfig;
}

export interface User {
	address: string;
	changedAt: string;
	claims: string;
	createdAt: string;
	email: string;
	exp: Date;
	iat: Date;
	lastName: string;
	name: string;
	password: string;
	phone: string;
	pkUser: number;
}
