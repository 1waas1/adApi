const mysqlServices = require('../services/MysqlConnect');

class ItemAds {
    constructor() {
        this.mysql = new mysqlServices();
    }

    async getAd(id, additionalFields){
        let listFields = [...new Set(['id', 'title', 'images', 'price'].concat(additionalFields))].join(', ')

        let query = `SELECT ${listFields} FROM ads WHERE id = ?`;

        let ad = await this.mysql.mysqlQuery(query, id);

        if (ad.length){
            return ad[0]
        }

        return null
    }
}

module.exports = ItemAds