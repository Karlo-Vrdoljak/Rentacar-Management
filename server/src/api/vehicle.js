import { express, prisma, security, consts } from '../../app.module.js';
const router = express.Router();

router.get('/pk', async (req, res) => {
	const { pkVehicle } = req.query;
	res.send(await prisma.vehicle.findUnique({ where: { pkVehicle }, include: { vehicleStatus: true } }));
});

router.get('/all', async (req, res) => {
	res.send(await prisma.vehicle.findMany({ include: { vehicleStatus: true } }));
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
		await prisma.vehicle.upsert({
			where: { pkVehicle },
			create: {
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
			update: {
				manufacturer: consts.toTitleCase(manufacturer),
				model: consts.toTitleCase(model),
				dateOfManufacture,
				startingKilometers,
				currentKilometers,
				gasType,
				color,
			},
		})
	);
});

export default router;
