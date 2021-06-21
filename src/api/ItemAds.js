const mysqlServices = require('../services/MysqlConnect');

class ItemAds {
    constructor() {
        this.mysql = new mysqlServices();
    }

    async getAd(id, additionalFields){
        let query = `SELECT id, title, images, price FROM ads WHERE id = ?`;

        if (additionalFields !== undefined && additionalFields.includes('description')){
            query = `SELECT id, title, images, price, description FROM ads WHERE id = ?`;
        }

        let ad = await this.mysql.mysqlQuery(query, id);

        if (ad.length){
            return ad[0]
        }

        return null
    }
}

module.exports = ItemAds