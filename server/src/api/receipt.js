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

router.put('/update/deposit', async (req, res) => {
	const { pkReceipt, deposit } = req.body;
	const [mainDeposited, subDeposited] = consts.parseCurrency(deposit);

	const receipt = await prisma.receipt.findUnique({ where: { pkReceipt } });
	const [mainDue, subDue] = consts.parseCurrency(receipt.price);

	if (mainDue + subDue / 100 - (mainDeposited + subDeposited / 100) <= consts.PAY_TOLERANCE) {
		receipt.isPaid = 1;
	}
	const [currPaid, currPaidSub] = consts.parseCurrency(receipt.currentlyPaid);
	receipt.currentlyPaid = consts.makeCurrencyString(currPaid + mainDeposited + (currPaidSub / 100 + subDeposited / 100));

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
		pkRent
			? await prisma.receipt.update({
					where: { pkReceipt },
					data: {
						...receipt,
						...connections,
					},
			  })
			: {}
	);
});

export default router;
