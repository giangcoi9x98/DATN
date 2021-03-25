class ResponseData {
  /**
   * response data constructor
   * @param {Boolean} success
   * @param {String} msg
   * @param {Object} data
   * @param {String} type
   */
  constructor(success, msg, data = undefined, type = undefined,total=undefined,code=undefined) {
    this.success = success;
    this.msg = msg;
    this.data = data;
    this.type = type;
    this.total=total;
    this.code=code
  }
}

module.exports = ResponseData;
