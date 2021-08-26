import { express, prisma, consts } from '../../app.module.js';
const router = express.Router();

router.get('/pk', async (req, res) => {
	const { pkVehicle } = req.query;
	res.send(await prisma.vehicle.findUnique({ where: { pkVehicle }, include: { vehicleStatus: true } }));
});

router.get('/all', async (req, res) => {
	res.send(await prisma.vehicle.findMany({ include: { vehicleStatus: true }, orderBy: { createdAt: 'desc' } }));
});

router.get('/public/one', async (req, res) => {
	const { pkVehicle } = req.query;
	res.send(await prisma.vehicle.findUnique({ where: { pkVehicle }, include: { vehicleStatus: true } }));
});

router.get('/public/available', async (req, res) => {
	res.send(await prisma.vehicle.findMany({ where: { pkStatus: consts.VEHICLE_STATUS.Available }, include: { vehicleStatus: true } }));
});

router.get('/user/vehicles', async (req, res) => {
	const { pkUser } = req.query;
	res.send(await prisma.rent.findMany({ where: { pkUserRented: pkUser }, include: { vehicle: { include: { vehicleStatus: true } }, receipt: true, rentStatus: true }, orderBy: { pkRentStatus: 'asc' } }));
});

router.get('/vehicles/rent', async (req, res) => {
	const { pkRent } = req.query;
	res.send(await prisma.rent.findMany({ where: { pkVehicle: pkRent }, include: { vehicle: { include: { vehicleStatus: true } }, receipt: true, rentStatus: true }, orderBy: { pkRentStatus: 'asc' } }));
});

router.put('/update/status', async (req, res) => {
	const { pkVehicle, pkVehicleStatus } = req.body;
	res.send(
		pkVehicle
			? await prisma.vehicle.update({
					where: { pkVehicle },
					data: {
						vehicleStatus: {
							connect: { pkVehicleStatus },
						},
					},
			  })
			: {}
	);
});


router.post('/upsert', async (req, res) => {
	const { pkVehicle, manufacturer, model, dateOfManufacture, startingKilometers, currentKilometers, gasType, color, code } = req.body;
	const latestVehicle = (await prisma.vehicle.findFirst({ where: { manufacturer: { startsWith: manufacturer }, model: { startsWith: model } }, orderBy: { pkVehicle: 'desc' } })) ?? null;
	let nextCode = latestVehicle?.code;
	if (nextCode) {
		nextCode = nextCode.slice(0, 2) + (+nextCode.slice(2) + 1);
	} else {
		nextCode = consts.toTitleCase(manufacturer)[0].toUpperCase() + consts.toTitleCase(model)[0].toUpperCase() + 1;
	}
	res.send(
		pkVehicle
			? await prisma.vehicle.update({
					where: { pkVehicle },
					data: {
						manufacturer: consts.toTitleCase(manufacturer),
						model: consts.toTitleCase(model),
						dateOfManufacture,
						startingKilometers,
						currentKilometers,
						gasType,
						color,
					},
			  })
			: await prisma.vehicle.create({
					data: {
						manufacturer: consts.toTitleCase(manufacturer),
						model: consts.toTitleCase(model),
						dateOfManufacture,
						startingKilometers,
						currentKilometers,
						gasType,
						color,
						code: nextCode,
						vehicleStatus: {
							connect: { pkVehicleStatus: consts.VEHICLE_STATUS.Available },
						},
					},
			  })
	);
});

router.delete('/one', async (req, res, next) => {
	const { pkVehicle } = req.query;
	try {
		await prisma.vehicle.delete({ where: { pkVehicle } });
		res.send({ pkVehicle });
	} catch (error) {
		next(error);
	}
});

export default router;
