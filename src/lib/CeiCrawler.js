const PositionCrawler = require('./PositionCrawler');
const AccountStatementCrawler = require('./AccountStatementCrawler');
const LastExecutionCrawler = require('./LastExecutionCrawler');
const typedefs = require("./typedefs");
const { CeiCrawlerError, CeiErrorTypes } = require('./CeiCrawlerError');
const CeiLoginService = require('./CeiLoginService');
const AxiosWrapper = require('./AxiosWrapper');
const StockTransactionsCrawler = require('./StockTransactionsCrawler');
const ProvisionedEventsCrawler = require('./ProvisionedEventsCrawler');
const IpoCrawler = require('./IpoCrawler');

class CeiCrawler {

    /** @type {boolean} */
    _isLogged = false;

    get username() { return this._username; }
    set username(username) { this._username = username; }

    get password() { return this._password; }
    set password(password) { this._password = password; }

    /** @type {typedefs.CeiCrawlerOptions} - Options for CEI Crawler and Fetch */
    get options() { return this._options; }
    set options(options) { this._options = options; }

    /** @type {CeiLoginService} */
    _ceiLoginService = null;

    /**
     *
     * @param {String} username - Username to login at CEI
     * @param {String} password - Password to login at CEI
     * @param {typedefs.CeiCrawlerOptions} options - Options for CEI Crawler and Fetch
     */
    constructor(username, password, options = {}) {
        this.username = username;
        this.password = password;
        this.options = options;
        this._setDefaultOptions();

        this._ceiLoginService = new CeiLoginService(username, password, this.options);
        AxiosWrapper.setup(this.options);

    }

    _setDefaultOptions() {
        if (!this.options.debug) this.options.debug = false;
        if (!this.options.navigationTimeout) this.options.navigationTimeout = 30000;
        if (!this.options.loginOptions) this.options.loginOptions = {};
        if (!this.options.loginOptions.timeout) this.options.loginOptions.timeout = 150000;
        if (!this.options.loginOptions.strategy) this.options.loginOptions.strategy = 'user-resolve';
    }

    async login() {
        this._isLogged = false;
        await this._login();
    }

    async _login() {
        if (this._isLogged) return;

        /* istanbul ignore next */
        if (this.options.debug)
            console.log(`Logging at CEI using ${this.options.loginOptions.strategy}...`);

        this.options.auth = await this._ceiLoginService.getToken();
        this.options.lastExecutionInfo = await LastExecutionCrawler.getLastExecutionInfo();
        this._isLogged = true;
    }

    /**
     * Returns the wallet position
     * @param {Date} [date] - The date of the position
     * @param {Number} [page=1] - The page of the data
     * @returns {Promise<typedefs.StockHistory[]>} - List of Stock histories
     */
    async getPosition(date = null, page = 1) {
        await this._login();
        return await PositionCrawler.getPosition(date, page, this.options);
    }

    /**
     * Returns the detail of a position given by CEI. The format of the position differs from type to type
     * @param {String} id - The UUID of the position given by CEI
     * @param {String} category - The category of the position
     * @param {String} type - The type of the position
     * @param {typedefs.CeiCrawlerOptions} options - Options for the crawler
     * @returns {Any}
     */
    async getPositionDetail(id, category, type) {
        await this._login();
        return await PositionCrawler.getPositionDetail(id, category, type, this.options);
    }

    /**
     * Returns the account statement
     * @param {Date} [startDate] - The start date to filter
     * @param {Date} [endDate] - The end date to filter
     * @param {Number} [page=1] - The page of the data
     * @returns {Promise<typedefs.StockHistory[]>} - List of Stock histories
     */
    async getAccountStatement(startDate = null, endDate = null, page = 1) {
        await this._login();
        return await AccountStatementCrawler.getAccountStatement(startDate, endDate, page, this.options);
    }

    /**
     * Returns the stock transactions
     * @param {Date} [startDate] - The start date to filter
     * @param {Date} [endDate] - The end date to filter
     * @param {Number} [page=1] - The page of the data
     * @returns {Promise<typedefs.StockHistory[]>} - List of Stock histories
     */
    async getStockTransactions(startDate = null, endDate = null, page = 1) {
        await this._login();
        return await StockTransactionsCrawler.getStockTransactions(startDate, endDate, page, this.options);
    }

    /**
     * Returns the provisioned events for the given date
     * @param {Date} [date] - The date for the provisioned events
     * @param {Number} [page=1] - The page of the data
     * @returns {Promise<typedefs.StockHistory[]>} - List of Stock histories
     */
    async getProvisionedEvents(date = null, page = 1) {
        await this._login();
        return await ProvisionedEventsCrawler.getProvisionedEvents(date, page, this.options);
    }

    /**
     * Returns the detail of a provisioned event
     * @param {String} id - The UUID of the provisioned event
     * @param {typedefs.CeiCrawlerOptions} options - Options for the crawler
     * @returns {Any}
     */
    async getProvisionedEventDetail(id) {
        await this._login();
        return await ProvisionedEventsCrawler.getProvisionedEventDetails(id, this.options);
    }

    /**
     * Returns the IPOs
     * @param {Date} [date] - The date for the provisioned events
     * @param {Number} [page=1] - The page of the data
     * @returns {Promise<typedefs.StockHistory[]>} - List of Stock histories
     */
     async getIPOs(date = null, page = 1) {
        await this._login();
        return await IpoCrawler.getIPOs(date, page, this.options);
    }

    /**
     * Returns the detail of an IPO
     * @param {String} id - The UUID of the IPO event
     * @param {typedefs.CeiCrawlerOptions} options - Options for the crawler
     * @returns {Any}
     */
    async getIPODetail(id) {
        await this._login();
        return await IpoCrawler.getIPODetail(id, this.options);
    }

}

module.exports = CeiCrawler;
