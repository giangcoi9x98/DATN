const path = require("path");
console.log(
	"path.resolve(__dirname, '../.env')",
	path.resolve(__dirname, "../../env-file")
);
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const moment = require("moment");
const tokenHelper = require("../lib/token");
const Langs = require("../lang/error.code");
const { MoleculerError } = require("moleculer").Errors;
const Redis = require("ioredis");
const redisConnect = require("./redis-connect");

// const forgotPWPrefix = 'FORGOT_PW_KEY_';
// const refreshTokenPrefix = 'RF_TOKEN_';
const accessTokenPrefix = "ACCESS_TOKEN_";
const bannedTokenPrefix = "BANNED_TOKEN_";
// const newDeviceTokenPrefix = 'NEW_DEVICE_TOKEN_';
// using arrow function here 'll make call/apply not affect

const PaymentPeriod = {
	Day: "Day",
	Month: "Month",
	Quarter: "Quarter",
	Semiannual: "Semiannual",
	Annual: "Annual",
	Year: "Year",
	End: "End",
};

const ShortPeriodTerm = {
	d: "d",
	w: "w",
	m: "m",
	y: "y",
};

const TimeShorthand = {
	Annual: "y",
	Quarter: "Q",
	Month: "M",
	Day: "d",
	Year: "y",
};
const PaymentPeriodShorthand = {
	Day: "d",
	Month: "m",
	Quarterly: "q",
	Semiannual: "s",
	Annually: "y",
	Year: "y",
	End: "e",
};
const SecondByPeriod = {
	d: 86400,
	m: 2628000,
	q: 7884000,
	s: 15778800,
	y: 31540000,
};
const DayByPeriod = {
	d: 1,
	m: 30.42,
	q: 91.25,
	s: 182.625,
	y: 365.25,
};
const BondStatus = {
	Created: "Created",
	Accepted: "Accepted",
	Actived: "Actived",
	Activated: "Activated",
	Cancelled: "Cancelled",
	Matured: "Matured",
};

const CouponPaymentType = {
	Interest: "Interest",
	FaceAmount: "FaceAmount",
};

/**
 *
 * @param Array<String> actions
 */
function require_actions(actions) {
	const actions_list = actions.map((action_path) =>
		require(`../actions/${action_path}.action.js`)
	);
	let actions_obj = {};
	actions_list.forEach((obj) => {
		actions_obj = Object.assign(actions_obj, obj);
	});
	return actions_obj;
}

function calculateNextCouponPaymentTimestamp(data) {
	let next_coupon_payment_timestamp;
	if (data.coupon_payment_period === PaymentPeriod.End) {
		if (data.term_by === "m") {
			data.term_by = "M";
		}
		next_coupon_payment_timestamp = moment
			.utc()
			.add(data.term, data.term_by);
	} else if (data.coupon_payment_period === PaymentPeriod.Semiannual) {
		next_coupon_payment_timestamp = moment.utc().add(6, "M").valueOf();
	} else {
		next_coupon_payment_timestamp = moment
			.utc()
			.add(1, TimeShorthand[data.coupon_payment_period])
			.valueOf();
	}

	return next_coupon_payment_timestamp;
}
async function checkIsAuthenticated(ctx, redis) {
	console.log(process.env);
	const publicKey = Buffer.from(
		process.env.AUTH_PUBLIC_KEY ||
			"LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEV2QzNHZWZ1RPNXUvOUFMaUpKRjF6UDlMNgpsVm1HU1dFZWN0ZWdsVHFZWDIySkx3aklrTmQySzBLVjUzTWVoY3J5dHlUR1FtdWYyZGQzMDl0Y2hBSGp0ZmV6Ck43Tkwzckcwek5ReDdBM3dJVi9IaDRlU0g4OWF1S2JJeFNxaWl2MFJ2a2ZYMmZ3N0ZDQzBlb0tsVWExM1NDb3oKZTJXNTJsaUZsU1M1RFRwT1d3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=",
		"base64"
	).toString("utf-8");
	const { token } = ctx.meta;
	if (ctx.meta.force_skip_check_authenticate) {
		return;
	}
	let decoded;
	if (ctx.action.attach_user) {
		try {
			decoded = await tokenHelper.verify(token, publicKey);
			ctx.user_id = decoded.id; // inject user_id to ctx
			ctx.meta.userId = decoded.id; // as well as inject userId to ctx.meta
			ctx.meta.user = decoded;
		} catch (error) {}
	}
	if (!ctx.action.authenticate) {
		return;
	}
	const { REDIS_HOST, REDIS_PORT } = process.env;
	redis = redis || redisConnect.getInstance();

	// if (ctx.broker) {
	//     ctx.broker.logger.info('authentication token: ', token);
	// }
	try {
		decoded = await tokenHelper.verify(token, publicKey);
		ctx.user_id = decoded.id; // inject user_id to ctx
		ctx.meta.userId = decoded.id; // as well as inject userId to ctx.meta

		ctx.meta.user = decoded;
		if (ctx.action.require_2fa_if_enable && this) {
			const isUserEnable2FA = await this.broker.call(
				"user.getIsUserEnable2FA",
				{
					user_id: decoded.id,
				}
			);
			if (isUserEnable2FA) {
				await this.broker.call("user.verify2FACode", {
					user_id: decoded.id,
					code: (ctx.params || {}).two_factor_code || null,
				});
			}
		}
	} catch (error) {
		if (ctx.broker)
			ctx.broker.logger.error("error when decode token: ", error);
		if (error.name === "TokenExpiredError") {
			throw new MoleculerError("Token expired", 401, Langs.TOKEN_EXPIRED);
		}
		if (error.type) {
			throw new MoleculerError(
				error.message,
				error.code || 500,
				error.type || Langs.INTERNAL_SERVER_ERROR,
				error.data
			);
		} else
			throw new MoleculerError(
				"Invalid token!",
				401,
				Langs.TOKEN_INVALID,
				[]
			);
	}
	const redisToken = await redis.get(
		`${accessTokenPrefix}${decoded.loginId}`
	);
	if (token !== redisToken) {
		throw new MoleculerError("Invalid Token", 401, Langs.TOKEN_INVALID);
	}
	const bannedTokenTime = Number(
		await redis.get(`${bannedTokenPrefix}${decoded.id}`)
	);
	if (!isNaN(bannedTokenTime)) {
		if (decoded.iat < bannedTokenTime) {
			throw new MoleculerError(
				"Invalid token!",
				401,
				Langs.TOKEN_INVALID,
				[]
			);
		}
	}
	return decoded;
}

const SocketRoom = {
	MARKET_DATA_PRICE: "market_data_price",
	CRYPTO_PRICE_UPDATE: "CRYPTO_PRICE_UPDATE", //same as the event name. To receive latest crypto currencies price updated by coin-exchange-rate service every minute
};
const SocketEvent = {
	CRYPTO_BALANCE_CHANGE: "CRYPTO_BALANCE_CHANGE",
	BOND_BALANCE_CHANGED: "BOND_BALANCE_CHANGED",
	NEW_DEPOSIT: "NEW_DEPOSIT",
	NEW_NOTIFICATION: "NEW_NOTIFICATION",
	NEW_COIN_DEPOSIT: "NEW_COIN_DEPOSIT",
	COIN_DEPOSIT_UPDATE: "COIN_DEPOSIT_UPDATE",
	WITHDRAW_UPDATE: "WITHDRAW_UPDATE",
};
const WithdrawStatus = {
	WAIT_FOR_MAIL_APPROVE: "WaitForMailApprove",
	PROCESSING: "Processing",
	COMPLETED: "Completed",
	CANCELLED: "Cancelled",
};

const FeeServiceName = {
	BOND_PURCHASE: "bond_purchase",
	INTEREST_PAYMENT: "interest_payment",
	LATE_FEE: "late_fee",
	ISSUE_FEE: "issue_fee",
	MATURE_RECEIVE_FEE: "mature_receive_fee",
};

const BondHistoryType = {
	AddFundToBillingCycle: "AddFundToBillingCycle",
	CouponReceive: "CouponReceive",
	CollateralDistributed: "CollateralDistributed",
	CollateralReturn: "CollateralReturn",
};

module.exports = {
	PaymentPeriod,
	BondStatus,
	ShortPeriodTerm,
	require_actions,
	TimeShorthand,
	PaymentPeriodShorthand,
	DayByPeriod,
	SecondByPeriod,
	calculateNextCouponPaymentTimestamp,
	checkIsAuthenticated,
	SocketRoom,
	WithdrawStatus,
	SocketEvent,
	FeeServiceName,
	BondHistoryType,
};
