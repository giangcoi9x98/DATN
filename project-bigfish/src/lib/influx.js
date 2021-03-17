const Influx = require("influx");
const influx = new Influx.InfluxDB({
	host: "localhost",
	port: 8086,
	database: "coins",
});
module.exports = {
	influx,
	getInstance: () => influx,
};
