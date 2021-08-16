const ERRORS = {
	Unauthorized: {
		name: 'Unauthorized',
		message: 'Unauthorized',
		status: 401,
	},
	InvalidCredentials: {
		name: 'InvalidCredentials',
		message: 'Invalid Credentials',
		status: 401,
	},
	NotFound: {
		name: 'NotFound',
		message: 'Route not registered',
		status: 404,
	},
	MissingRequiredProperties: {
		name: 'MissingRequiredProperties',
		message: 'You have missing required properties',
		status: 600,
	},
};

const handleNumeric = (input) => {
	if (+input) {
		return +input;
	}
	return null;
};
const isNumber = (n) => {
	return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};
const useQueryParser = (req, res, next) => {
	// console.log(req.query, res.locals, req.user, Object.keys(req.query));
	Object.keys(req.query)?.length &&
		Object.keys(req.query).forEach((key) => {
			if ('true' == req.query[key]) {
				req.query[key] = true;
				return;
			}
			if ('false' == req.query[key]) {
				req.query[key] = false;
				return;
			}
			if ('null' == req.query[key]) {
				req.query[key] = null;
				return;
			}
			if ('undefined' == req.query[key]) {
				req.query[key] = undefined;
				return;
			}
			if ('NaN' == req.query[key]) {
				req.query[key] = NaN;
				return;
			}
			if ('[]' == req.query[key]) {
				req.query[key] = [];
				return;
			}
			if ('{}' == req.query[key]) {
				req.query[key] = {};
				return;
			}
			if (isNumber(req.query[key])) {
				req.query[key] = +req.query[key];
				return;
			}
		});
	next();
};

const VEHICLE_STATUS = {
	Service: 1,
	Available: 2,
	Rented: 3,
	NotAvailable: 4,
};
/**
 * 
 * @param {*} str 
 * @returns {string}
 */
function toTitleCase(str) {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

export default { ERRORS, handleNumeric, useQueryParser, isNumber, VEHICLE_STATUS, toTitleCase };
