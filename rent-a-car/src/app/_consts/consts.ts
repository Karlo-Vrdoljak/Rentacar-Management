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

export interface ReceiptStatus {
	pkReceiptStatus: number;
	createdAt: Date;
	changedAt: Date;
	name: string;
	receipt: Receipt;
}
export interface Receipt {
	pkReceipt: number;
	createdAt: Date;
	changedAt: Date;
	pkRent: number;
	price: string;
	currencyCode: string;
	dateDue: Date;
	pkReceiptStatus: number;
	currentlyPaid: string;
	isPaid: 1 | 0;
	receiptStatus: string;
	rent: Rent;
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
	nameWithLastName?: string;
}

export enum VEHICLE_STATUS {
	Service = 1,
	Available = 2,
	Rented = 3,
	NotAvailable = 4,
	ServiceColor = 'red-400',
	AvailableColor = 'blue-400',
	RentedColor = 'green-400',
	NotAvailableColor = 'gray-500',
}
export enum RECEIPT_STATUS {
	Waiting = 1, // until rent complete
	Paid = 2,
	Late = 3,
	Due = 4, // imas lufta jos
	WaitingColor = 'gray-500',
	PaidColor = 'green-400',
	LateColor = 'red-400',
	DueColor = 'blue-400',
}

export enum RENT_STATUS {
	Queued = 1,
	Started = 2,
	Complete = 3,
	Late = 4,
	QueuedColor = 'gray-500',
	StartedColor = 'blue-400',
	CompleteColor = 'green-400',
	LateColor = 'red-400',
}

export interface UserRentStats {
	pkUser?: number;
	rentCount?: number;
	receiptCount?: number;
	receiptsPaidCount?: any;
	priceTotal?: any;
	paidTotal?: any;
}

export interface RentStatus {
	pkRentStatus: number;
	createdAt: Date;
	changedAt: Date;
	name: string;
}

export interface Rent {
	pkRent: number;
	createdAt: Date;
	changedAt: Date;
	pkVehicle: number;
	pkUserEntry: number;
	pkUserRented: number;
	pkRentStatus: number;
	rentFrom: Date;
	rentTo: Date;
	rentCompleteKilometers?: any;
	pickupLocation: string;
	dropOffLocation?: any;
	vehicle: Vehicle;
	rent_user?: User;
	rent_entry?: User;
	receipt: any[];
	rentStatus: RentStatus;
}

export enum EClaims {
	owner,
	user,
	employed,
	admin,
}

export const USER_ROLE = ['user'];
export const EMPLOYED_ROLE = ['employed'];
