const mysqlServices = require('../services/MysqlConnect');

class ItemAds {
    constructor() {
        this.mysql = new mysqlServices();
    }

    async getAd(id){
        let ad = await this.mysql.mysqlQuery(`SELECT id, title, images, price FROM ads WHERE id = ?`, id);

        if (ad.length){
            return ad[0]
        }

        return null
    }
}

module.exports = ItemAds