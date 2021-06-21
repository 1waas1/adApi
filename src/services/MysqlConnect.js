const mysqlLib = require('mysql')

class MysqlConnect{
    constructor(){
        this.mysql = mysqlLib.createConnection({
            host: process.env.MYSQL_HOST || '127.0.0.1',
            user:  process.env.MYSQL_USER || 'root',
            password:  process.env.MYSQL_PASSWORD || 'root',
            database:  process.env.MYSQL_DATABASE || 'ads_api'
        });
        this.mysql.connect();
    }

    async mysqlQuery(query, ...params){
        return new Promise((resolve, reject) => {
            this.mysql.query(query, params, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    closeConnection(){
        this.mysql.end()
    }
}

module.exports = MysqlConnect