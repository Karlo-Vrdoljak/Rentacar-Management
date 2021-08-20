import { forkJoin, from } from 'rxjs';
import { first } from 'rxjs/operators';
import { consts, express, prisma, security } from '../../app.module.js';

const router = express.Router();

router.get('/email', async (req, res) => {
	const { email } = req.query;
	res.send((await prisma.user.findUnique({ where: { email } })) ?? {});
});

router.get('/pk', async (req, res) => {
	const { pkUser } = req.query;

	if (pkUser) {
		res.send((await prisma.user.findUnique({ where: { pkUser: pkUser } })) ?? {});
	} else {
		res.send({});
	}
});

router.get('/one', async (req, res) => {
	const { pkUser } = req.query;

	if (pkUser) {
		res.send((await prisma.user.findUnique({ where: { pkUser: pkUser } })) ?? {});
	} else {
		res.send({});
	}
});

router.get('/stats', async (req, res) => {
	const { pkUser } = req.query;

	const [stats] = await prisma.$queryRaw`
		select distinct u.pkUser, count(r.pkRent) rentCount, count(rt.pkReceipt) receiptCount, sum(rt.isPaid) receiptsPaidCount, sum(rt.price) priceTotal, sum(rt.currentlyPaid) paidTotal from rent r 
		left join receipt rt on rt.pkRent = r.pkRent
		left join user u on r.pkUserRented = u.pkUser
		where pkUser = ${pkUser}
		group by u.pkUser
		`;

	res.send(stats);
});

router.get('/all', async (req, res) => {
	res.send((await prisma.user.findMany()) ?? []);
});

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(consts.ERRORS.InvalidCredentials);
	}
	const user = (await prisma.user.findUnique({ where: { email } })) ?? null;
	if (!user) {
		return next(consts.ERRORS.InvalidCredentials);
	}
	const isMatched = await security.checkHash(password, user.password);
	if (isMatched) {
		res.send({ jwt: security.signJwt(user) });
	} else {
		return next(consts.ERRORS.InvalidCredentials);
	}
});

router.get('/rents/pk', async (req, res) => {
	const { pkUser } = req.query;
	if (pkUser) {
		const mapRents = (ur) => {
			return from(
				new Promise(async (resolve) => {
					resolve(await prisma.rent.findUnique({ where: { pkRent: ur.pkRent }, include: { receipt: true, rentStatus: true, vehicle: true } }));
				})
			);
		};
		let user = (await prisma.user.findUnique({ where: { pkUser: pkUser }, include: { rent_entry: true, rent_user: true } })) ?? null;
		forkJoin(user.rent_user.map((ur) => mapRents(ur)))
			.pipe(first())
			.subscribe((data) => {
				user.rent_user = data;
				res.send(user);
			});
	} else {
		res.send({});
	}
});

router.post('/register', async (req, res, next) => {
	const { email, name, lastName, phone, address, password } = req.body;
	if (!email || !password) {
		return res.status(consts.ERRORS.MissingRequiredProperties.status).send(consts.ERRORS.MissingRequiredProperties);
	}
	try {
		const user = await prisma.user.create({
			data: {
				email,
				...(name && { name }),
				...(lastName && { lastName }),
				...(phone && { phone }),
				...(address && { address }),
				password: await security.hashString(password),
			},
		});
		res.send(user);
	} catch (error) {
		next(error);
	}
});

router.put('/update', async (req, res) => {
	const { pkUser, email, name, lastName, phone, address, claims } = req.body;
	try {
		const user = await prisma.user.update({
			where: { ...(email && { email }), ...(pkUser && { pkUser: pkUser }) },
			data: {
				...(name && { name }),
				...(lastName && { lastName }),
				...(phone && { phone }),
				...(address && { address }),
				...(claims && { claims }),
			},
		});
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.put('/password', async (req, res) => {
	const { pkUser, email, password } = req.body;
	try {
		const user = await prisma.user.update({
			where: { ...(email && { email }), ...(pkUser && { pkUser: pkUser }) },
			data: {
				...(password && { password: security.hashString(password) }),
			},
		});
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.delete('/delete', async (req, res, next) => {
	const { pkUser, email } = req.query;

	try {
		await prisma.user.delete({
			where: { ...(email && { email }), ...(pkUser && { pkUser: pkUser }) },
		});
		res.send({ pkUser, email });
	} catch (error) {
		next(error);
	}
});

export default router;
