const mysqlServices = require('../services/MysqlConnect');

class ListAds {
    constructor(quantityEntries) {
        this.quantityEntries = quantityEntries;
        this.mysql = new mysqlServices();
    }

    async paginationList(page, sortField = 'date', sortParam = 'ASC'){
        try{
            let startEntries = (page - 1) * this.quantityEntries
            let arrayAds = await this.mysql.mysqlQuery(
                `SELECT id, title, images FROM ads ORDER BY ${sortField} ${sortParam} LIMIT ${startEntries}, ${this.quantityEntries}`
            );

            if (!arrayAds.length){
                return null
            }

            return arrayAds
        }
        catch{
            return null
        }

    }
}

module.exports = ListAds