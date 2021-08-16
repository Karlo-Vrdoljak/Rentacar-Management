import cron from 'node-cron';
import { forkJoin, from } from 'rxjs';
import { first } from 'rxjs/operators';
import { consts, prisma } from '../../app.module.js';

async function findLateReceipts() {
	return await prisma.receipt.findMany({ where: { AND: [{ dateDue: { lte: new Date() } }, { pkReceiptStatus: { not: consts.RECEIPT_STATUS.Late } }] } });
}

export default function findLateReceiptsCRON() {
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
						console.log(`Found ${lateReceipts} receipts that are late!`);
					})
			: nothing();
	});
}
