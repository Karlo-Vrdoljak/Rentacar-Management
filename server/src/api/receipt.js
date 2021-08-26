import { consts, express, prisma } from '../../app.module.js';
const router = express.Router();

router.get('/one', async (req, res) => {
	const { pkReceipt } = req.query;
	res.send(await prisma.receipt.findUnique({ where: { pkReceipt }, include: { rent: true, receiptStatus: true } }));
});

router.get('/all', async (req, res) => {
	res.send(await prisma.receipt.findMany({ include: { rent: true, receiptStatus: true }, orderBy: { changedAt: 'desc' } }));
});

async function fetchLateReciepts() {
	return await prisma.receipt.findMany({ where: { AND: [{ dateDue: { lte: new Date() } }, { pkReceiptStatus: consts.RECEIPT_STATUS.Late }] } });
}

router.get('/late', async (req, res) => {
	res.send(await fetchLateReciepts());
});

router.get('/status', async (req, res) => {
	const { pkReceiptStatus } = req.query;
	res.send(await prisma.receipt.findMany({ where: pkReceiptStatus }));
});

router.delete('/one', async (req, res, next) => {
	const { pkReceipt } = req.query;
	try {
		await prisma.receipt.delete({ where: { pkReceipt } });
		res.send({ pkReceipt });
	} catch (error) {
		next(error);
	}
});

router.put('/update/status', async (req, res) => {
	const { pkReceipt, pkReceiptStatus } = req.body;
	res.send(
		pkRent
			? await prisma.receipt.update({
					where: { pkReceipt },
					data: {
						receiptStatus: {
							connect: { pkReceiptStatus },
						},
					},
			  })
			: {}
	);
});

router.post('/create', async (req, res) => {
	const { pkRent, price, dateDue, currentlyPaid } = req.body;
	const rent = await prisma.rent.findUnique({ where: { pkRent }, include: { rentStatus: true } });
	res.send(
		await prisma.receipt.create({
			data: {
				currencyCode: 'HR',
				price,
				currentlyPaid: currentlyPaid ?? '0.00',
				dateDue,
				rent: { connect: { pkRent } },
				receiptStatus: { connect: { pkReceiptStatus: rent.rentStatus.pkRentStatus == consts.RENT_STATUS.Complete ? consts.RECEIPT_STATUS.Due : consts.RECEIPT_STATUS.Waiting } },
			},
		})
	);
});

router.put('/edit', async (req, res) => {
	const { pkReceipt, price, dateDue, currentlyPaid } = req.body;
	res.send(
		await prisma.receipt.update({
			where: { pkReceipt },
			data: {
				price,
				dateDue,
				currentlyPaid,
			},
		})
	);
});

router.put('/update/deposit', async (req, res) => {
	const { pkReceipt, deposit } = req.body;
	const [mainDeposited, subDeposited] = consts.parseCurrency(deposit);

	const receipt = await prisma.receipt.findUnique({ where: { pkReceipt } });
	const [mainDue, subDue] = consts.parseCurrency(receipt.price);

	const [currPaid, currPaidSub] = consts.parseCurrency(receipt.currentlyPaid);
	receipt.currentlyPaid = consts.makeCurrencyString(currPaid + mainDeposited + (currPaidSub / 100 + subDeposited / 100));

	if (mainDue + subDue / 100 - (currPaid + currPaidSub / 100 + mainDeposited + subDeposited / 100) <= consts.PAY_TOLERANCE) {
		receipt.isPaid = 1;
	}

	delete receipt.pkReceipt;
	delete receipt.pkReceiptStatus;
	delete receipt.pkRent;
	let receiptStatus = null;
	if (receipt.isPaid) {
		receiptStatus = {
			connect: {
				pkReceiptStatus: consts.RECEIPT_STATUS.Paid,
			},
		};
	}
	const connections = {
		...(receiptStatus && { receiptStatus }),
	};

	res.send(
		await prisma.receipt.update({
			where: { pkReceipt },
			data: {
				...receipt,
				...connections,
			},
		})
	);
});

export default router;
