require("dotenv").config();
const mysql = require("mysql");
const config = {
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT || 3306,
	user: process.env.MYSQL_USER || "root",
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
	connectionLimit: 10,
};
const pool = mysql.createPool(config);
const logMySqlQuery = (sql, params) => {
	console.log(
		"sql: ",
		mysql
			.format(sql, params)
			.replace(/\r?\n|\r/g, " ") // xoá dấu xuống dòng
			.split(" ")
			.filter((e) => e !== "")
			.join(" ")
	); // loại bỏ khoảng trắng thừa kiểu như này 'SELECT     * FROM     WHERE   '
};

const query = (sql, params, connection) => {
	return new Promise((resolve, reject) => {
		if (connection) {
			logMySqlQuery(sql, params);
			connection.query(sql, params, (err, result) => {
				if (err) reject(err);
				else resolve(result);
			});
		} else {
			pool.query(sql, params, (err, result) => {
				if (err) reject(err);
				else resolve(result);
			});
		}
	});
};

const queryOne = (sql, params, connection) => {
	return new Promise((resolve, reject) => {
		if (connection) {
			logMySqlQuery(sql, params);
			connection.query(sql, params, (err, result) => {
				if (err) reject(err);
				else resolve(result[0]);
			});
		} else {
			pool.query(sql, params, (err, result) => {
				if (err) reject(err);
				else resolve(result[0]);
			});
		}
	});
};

const queryMulti = (sql, params, connection) => {
	return query(sql, params, connection);
};

const getConnection = async () =>
	new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				return reject(err);
			}
			return resolve(connection);
		});
	});

const beginTransaction = async () => {
	const connection = await getConnection();
	return new Promise((resolve, reject) => {
		connection.beginTransaction((err) => {
			if (err) {
				connection.release();
				console.log("Khong ket noi dc r");
				return reject(err);
			}
			console.log("ket noi dc r ne`");
			return resolve(connection);
		});
	});
};

const rollbackTransaction = async (connection) =>
	new Promise((resolve, reject) => {
		connection.rollback((err) => {
			console.log("Rollback transaction");
			connection.release();
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});

const commitTransaction = async (connection) =>
	new Promise((resolve, reject) => {
		connection.commit(async (errCommit) => {
			console.log("Rollback transaction");
			if (errCommit) {
				try {
					await rollbackTransaction(connection);
				} catch (errorRollback) {
					return reject(Object.assign(errCommit, { errorRollback }));
				}
				return reject(errCommit);
			}
			connection.release();
			return resolve();
		});
	});
const ROLES = ["admin", "user", "guest"];

module.exports = {
	query,
	queryOne,
	queryMulti,
	ROLES,
	getConnection,
	beginTransaction,
	rollbackTransaction,
	commitTransaction,
};
