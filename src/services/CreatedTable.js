const mysqlLib = require('./MysqlConnect')

class CreatedTable {
    constructor() {
        this.mysql = new mysqlLib()
    }

    async createAds(){
        await this.mysql.mysqlQuery(`create table if not exists ads
            (
                id          int auto_increment,
                title       varchar(200)                        not null,
                description varchar(1000)                       null,
                images      text                                null,
                price       int(6)    default 0                 not null,
                date        timestamp default CURRENT_TIMESTAMP not null,
                CONSTRAINT primary_id PRIMARY KEY (id),
                constraint announcements_id_uindex
                    unique (id)
            ) ENGINE=innoDB DEFAULT CHARSET=utf8;`
        ).then(() => {
            console.log('Done!')
        })
    }
}

let created = new CreatedTable();
created.createAds()