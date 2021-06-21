const mysqlServices = require('../services/MysqlConnect');

class ListAds {
    constructor(quantityEntries) {
        this.quantityEntries = quantityEntries;
        this.mysql = new mysqlServices();
    }

    async paginationList(page, sortField = 'date', sortParam = 'ASC'){
        let startEntries = (page - 1) * this.quantityEntries
        let arrayAds = await this.mysql.mysqlQuery(
            `SELECT * FROM ads ORDER BY ${sortField} ${sortParam} LIMIT ${startEntries}, ${this.quantityEntries}`
        );

        if (!arrayAds.length){
            return null
        }

        return arrayAds
    }

    async allList(sortField = 'date', sortParam = 'ASC'){
        let arrayAds = await this.mysql.mysqlQuery(
            `SELECT * FROM ads ORDER BY ${sortField} ${sortParam}`
        );

        if (!arrayAds.length){
            return null
        }

        return arrayAds
    }
}

module.exports = ListAds