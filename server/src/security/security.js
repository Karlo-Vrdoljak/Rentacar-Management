import { bcrypt, jwt, expressJwt, consts } from '../../app.module.js';

export default class Security {
	constructor() {
		this.saltRounds = +process.env.SALT_ROUNDS;
		this.jwtConfig = {
			secret: process.env.JWT_SECRET,
			expiresIn: process.env.JWT_EXPIRES_IN,
		};
	}
	hashString(password) {
		return bcrypt.hash(password, this.saltRounds);
	}
	checkHash(password, hash) {
		return bcrypt.compare(password, hash);
	}
	signJwt(payload) {
		return jwt.sign(payload, this.jwtConfig.secret, { expiresIn: this.jwtConfig.expiresIn });
	}
	verifyJwt(token) {
		try {
			const decoded = jwt.verify(token, this.jwtConfig.secret);
			return decoded;
		} catch (error) {
			return undefined;
		}
	}

	useJwtMiddleware() {
		return expressJwt({
			secret: this.jwtConfig.secret,
			// requestProperty: 'locals.user',
			algorithms: ['HS256'],

			getToken: function fromHeaderOrQuerystring(req) {
				if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
					return req.headers.authorization.split(' ')[1];
				} else if (req.query && req.query.token) {
					return req.query.token;
				}
				return null;
			},
		}).unless({ path: ['/user/login', '/user/register', /\/*test*/] });
	}
	useErrorHandler() {
		return (err, req, res, next) => {
			console.log({ err });
			if (err.name in consts.ERRORS) {
				return res.status(err?.status || 500).send(err);
			}
			return res.status(500).send(err);
		};
	}
}
