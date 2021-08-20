import { first, from } from 'rxjs';
import { express, prisma } from '../../app.module.js';
import { consts } from '/users/1karl/documents/github/rentacar-management/server/app.module.js';
const router = express.Router();

router.get('/pk', async (req, res) => {
	const { pkRent } = req.query;
	res.send(await prisma.rent.findUnique({ where: { pkRent }, include: { rentStatus: true, vehicle: true, receipt: true, rent_user: true, rent_entry: true } }));
});

router.get('/all', async (req, res) => {
	res.send(await prisma.rent.findMany({ include: { rentStatus: true, receipt: true, rent_user: true, vehicle: true, rent_entry: true }, orderBy: { changedAt: 'desc', createdAt: 'desc' } }));
});

router.put('/update/status', async (req, res) => {
	const { pkRent, pkRentStatus } = req.body;
	res.send(
		pkRent
			? await prisma.rent.update({
					where: { pkRent },
					data: {
						rentStatus: {
							connect: { pkRentStatus },
						},
					},
			  })
			: {}
	);
});

router.put('/update/vehicle', async (req, res) => {
	const { pkRent, pkVehicle } = req.body;
	res.send(
		pkRent
			? await prisma.rent.update({
					where: { pkRent },
					data: {
						vehicle: {
							connect: { pkVehicle },
						},
					},
			  })
			: {}
	);
});

router.put('/update/location', async (req, res) => {
	const { pkRent, dropOffLocation, pickupLocation } = req.body;
	const params = {
		...(dropOffLocation && { dropOffLocation }),
		...(pickupLocation && { pickupLocation }),
	};
	res.send(
		pkRent
			? await prisma.rent.update({
					where: { pkRent },
					data: params,
			  })
			: {}
	);
});

router.put('/update/rentCompleteKilometers', async (req, res) => {
	const { pkRent, rentCompleteKilometers } = req.query;
	const params = {
		...(rentCompleteKilometers && { rentCompleteKilometers }),
	};
	res.send(
		pkRent
			? await prisma.rent.update({
					where: { pkRent },
					data: params,
			  })
			: {}
	);
});

router.post('/public/upsert', async (req, res) => {
	const { pkRent, pkVehicle, pkUserRented, pkVehicleStatus, pkRentStatus, rentFrom, rentTo, pickupLocation, dropOffLocation } = req.body;
	console.log(req.body, req.user);
	const user = req.user;
	const params = {
		...(rentFrom && { rentFrom }),
		...(rentTo && { rentTo }),
		...(pickupLocation && { pickupLocation }),
		...(dropOffLocation && { dropOffLocation }),
		...(user && {
			rent_entry: {
				connect: { pkUser: user.pkUser },
			},
		}),
	};
	const maybeRented = await prisma.vehicle.findFirst({ where: { pkVehicle }, include: { vehicleStatus: true } });
	if (maybeRented?.vehicleStatus?.pkVehicleStatus != consts.VEHICLE_STATUS.Available ) {
		return res.status(600).send(consts.ERRORS.AlreadyRented);
	}
	// return res.send({});

	const createRent = () =>
		from(
			prisma.rent.create({
				data: {
					...params,
					vehicle: {
						connect: {
							pkVehicle,
						},
					},

					rent_user: {
						connect: { pkUser: pkUserRented },
					},
					rentStatus: {
						connect: { pkRentStatus },
					},
				},
			})
		);

	const updateRent = () =>
		from(
			prisma.rent.update({
				where: { pkRent },
				data: {
					...params,
					rentStatus: {
						connect: { pkRentStatus },
					},
				},
			})
		);

	const updateVehicleStatus = () =>
		from(
			prisma.vehicle.update({
				where: { pkVehicle },
				data: {
					vehicleStatus: {
						connect: { pkVehicleStatus },
					},
				},
			})
		);

	pkRent
		? updateRent()
		: createRent()
				.pipe(first())
				.subscribe((rent) =>
					updateVehicleStatus()
						.pipe(first())
						.subscribe((vehicle) => {
							res.send({ vehicle, rent });
						})
				);

	console.log(params);
});

router.delete('/one', async (req, res, next) => {
	const { pkRent } = req.query;
	try {
		await prisma.rent.delete({ where: { pkRent } });
		res.send({ pkRent });
	} catch (error) {
		next(error);
	}
});

export default router;
