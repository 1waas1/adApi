const mysqlServices = require('../services/MysqlConnect');

class CreateAds {
    constructor() {
        this.mysql = new mysqlServices();
    }

    async setAds(data){
        try {
            return await this.mysql.mysqlQuery(
                `INSERT INTO ads SET ?`, data).then(value => {
                return value.insertId
            });
        }
        catch{
            return null
        }
    }
}

module.exports = CreateAds