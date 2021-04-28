const mssql = require("mssql");
const config = {
	user: "sa",
	password: "gi@ng1998",
	server: "localhost",
	database: "test",
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
};
function connectDatabase() {
	const pool = new mssql.ConnectionPool(config);
	pool.on("error", (error) => {
		console.log("failed to connect to pg ", error);
	});
	pool.on("connect", () => {
		console.log("connected to postgres successfully !");
	});
	return pool.connect();
}
module.exports = {
	connectDatabase,
};
