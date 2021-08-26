import cron from 'node-cron';
import { forkJoin, from } from 'rxjs';
import { first } from 'rxjs/operators';
import { consts, prisma } from '../../app.module.js';

async function findLateReceipts() {
	return await prisma.receipt.findMany({ where: { AND: [{ dateDue: { lte: new Date() } }, { pkReceiptStatus: { not: consts.RECEIPT_STATUS.Late } }] } });
}
async function findLateRents() {
	return await prisma.rent.findMany({ where: { AND: [{ rentTo: { lte: new Date() } }, { pkRentStatus: { not: consts.RENT_STATUS.Late } }] } });
}

export function findLateReceiptsCRON() {
	/**
	 * “At minute 30.”
	 */
	cron.schedule('30 * * * *', async () => {
		console.log('CRON: Find late receipts');
		const lateReceipts = await findLateReceipts();
		const nothing = () => {
			console.log('Found no late receipts!');
		};
		lateReceipts?.length
			? forkJoin(
					lateReceipts.map((lr) =>
						from(
							prisma.receipt.update({
								where: { pkReceipt: lr.pkReceipt },
								data: {
									receiptStatus: {
										connect: {
											pkReceiptStatus: consts.RECEIPT_STATUS.Late,
										},
									},
								},
							})
						)
					)
			  )
					.pipe(first())
					.subscribe((result) => {
						console.log(`Found ${JSON.stringify(lateReceipts)} receipts that are late!`);
					})
			: nothing();
	});
}

export function findLateRentsCRON() {
	/**
	 * “At minute 20.”
	 */
	cron.schedule('20 * * * *', async () => {
		console.log('CRON: Find late rents');
		const lateRents = await findLateRents();
		const nothing = () => {
			console.log('Found no late rents!');
		};
		lateRents?.length
			? forkJoin(
					lateRents.map((lr) =>
						from(
							prisma.rent.update({
								where: { pkRent: lr.pkRent },
								data: {
									rentStatus: {
										connect: {
											pkRentStatus: consts.RENT_STATUS.Late,
										},
									},
								},
							})
						)
					)
			  )
					.pipe(first())
					.subscribe((result) => {
						console.log(`Found ${JSON.stringify(lateRents)} receipts that are late!`);
					})
			: nothing();
	});
}

// export function findCompletedRentsAndFixStatusReceiptCRON() {
// 	/**
// 	 * “At minute 30.”
// 	 */
// 	cron.schedule('* * * * *', async () => {
// 		console.log('CRON: Find invalid receipt status for completed rent');
// 		const completeRents = await prisma.rent.findMany({ where: { pkRentStatus: consts.RENT_STATUS.Complete } });
// 		const nothing = () => {
// 			console.log('Found no invalid receipt status for completed rent!');
// 		};
// 		completeRents?.length
// 			? forkJoin(
// 					completeRents.map((lr) =>
// 						from(
// 							prisma.rent.update({
// 								where: { pkRent: lr.pkRent },
// 								data: {
// 									receipt: {
// 										update: {
// 											where: {pkReceipt: }
// 											data: {
// 												receiptStatus: {
// 													connect: {
// 														pkReceiptStatus: lr.rentTo < new Date() ? consts.RECEIPT_STATUS.Late : consts.RECEIPT_STATUS.Due,
// 													},
// 												},
// 											},
// 										},
// 									},
// 								},
// 							})
// 						)
// 					)
// 			  )
// 					.pipe(first())
// 					.subscribe((result) => {
// 						console.log(`Found ${JSON.stringify(completeRents)} receipts have statuses to be fixed!`);
// 					})
// 			: nothing();
// 	});
// }
