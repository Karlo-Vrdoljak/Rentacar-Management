import { cors, bodyParser, consts, dotenv, express, rentApi, security, userApi, vehicleApi } from './app.module.js';
import findLateReceiptsCRON from './src/cron/findLateReceipts.js';

dotenv.config();

const app = express();
const port = process.env.PORT; // default port to listen

app.use(cors());

app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(security.useJwtMiddleware());

app.use((req, res, next) => consts.useQueryParser(req, res, next));

app.use('/user', userApi);
app.use('/vehicle', vehicleApi);
app.use('/rent', rentApi);

app.get('/test', async (req, res) => {
	const b = await security.hashString('asdfasdf');
	res.send({ a: 'asdfasdf', b, c: await security.checkHash('asdfasdf', b) });
});

app.use(security.useErrorHandler());

app.use((req, res, next) => {
	return res.status(consts.ERRORS.NotFound.status).send(consts.ERRORS.NotFound);
});

app.listen(port, () => {
	// tslint:disable-next-line:no-console
	console.log(`server started at http://localhost:${port}`);
});

findLateReceiptsCRON();
