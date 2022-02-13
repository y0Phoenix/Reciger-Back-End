class System {
    constructor() {
        this.token = '',
        this.hour = -1
    }
    /**
     * @param  {string} token
     * @param  {number} hour
     * @returns {System} the whole system object
     */
    setTokenHour(token, hour) {
        this.token = token;
        this.hour = hour
        return this
    }
    /**
     * @returns {string} the current access token
     */
    getToken() {
        return this.token;
    }
    /**
     * @returns {number} the current hour prop
     */
    getHour() {
        return this.hour
    }
}

module.exports = System;