class ResponseData {
	/**
	 * response data constructor
	 * @param {Boolean} success
	 * @param {String} msg
	 * @param {Object} data
	 * @param {String} type
	 */
	constructor(
		success,
		msg,
		data = undefined,
		metadata = undefined,
		code = undefined
	) {
		this.success = success;
		this.msg = msg;
		this.data = data;
		this.metadata = metadata;
		this.code = code;
	}
}

module.exports = ResponseData;
