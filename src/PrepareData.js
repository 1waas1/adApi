const mysqlServices = require('./services/MysqlConnect');
const apiAdsList = require('./api/ListAds');
const apiAdsItem = require('./api/ItemAds');

class PrepareData{
    constructor() {
        this.quantityEntries = 10;
        this.mysql = new mysqlServices();
        this.apiList = new apiAdsList(this.quantityEntries);
        this.apiItem = new apiAdsItem();
    }

    async getPaginationListAds(page, sortField = 'date', sortParam = 'ASC'){
        return this.apiList.paginationList(page, sortField, sortParam)
    }

    async getQuantityPages(page, sortField = 'date', sortParam = 'ASC'){
        let countEntry = await this.mysql.mysqlQuery('SELECT COUNT(*) as count FROM ads;');
        return Math.ceil(countEntry[0].count/this.quantityEntries)
    }

    async getListAds(sortField = 'date', sortParam = 'ASC'){
      return await this.apiList.allList(sortField, sortParam);
    }

    getTemplateInfo(requestParams){
        if (!Object.keys(requestParams).length){
            return {
                'fieldSort': {
                    'href': '?field=price&params=asc',
                    'name': 'По дате'
                },
                'paramSort': {
                    'href': '?field=date&params=desc',
                    'name': 'По возрастанию'
                }
            }
        }

        let linkFieldSort;
        let linkParamsSort;

        if (requestParams?.field === 'price'){
            linkFieldSort = '?field=date'
            linkParamsSort = '?field=price'
            switch (requestParams.params) {
                case 'asc':
                    linkFieldSort += '&params=asc';
                    linkParamsSort += '&params=desc';
                    break;
                case 'desc':
                    linkFieldSort += '&params=desc';
                    linkParamsSort += '&params=asc';
                    break;
            }
        }
        else if(requestParams?.field === 'date'){
            linkFieldSort = '?field=price';
            linkParamsSort = '?field=date'
            switch (requestParams.params) {
                case 'asc':
                    linkFieldSort += '&params=asc';
                    linkParamsSort += '&params=desc';
                    break;
                case 'desc':
                    linkFieldSort += '&params=desc';
                    linkParamsSort += '&params=asc';
                    break;
                default:
            }
        }

        return {
            'fieldSort': {
                'href': linkFieldSort ?? '?field=price&params=asc',
                'name': requestParams?.field === 'price' ? 'По цене' : 'По дате'
            },
            'paramSort': {
                'href': linkParamsSort ?? '?field=date&params=desc',
                'name': requestParams?.params === 'desc' ? 'По убиванию' : 'По возрастанию'
            }
        }
    }

    getPaginationLinks(requestParams, numberPage, partLink){
        let field = requestParams?.field ?? 'date';
        let params = requestParams?.params ?? 'asc';
        let nextPage = numberPage + 1
        let prevPage = numberPage - 1
        return {
            'next': `${partLink}/${nextPage}/?field=${field}&params=${params}`,
            'prev': `${partLink}/${prevPage}/?field=${field}&params=${params}`
        }
    }

    async getItemAds(id, additionalFields){
        if (!Number.isInteger(id)){
            return null
        }
        //
        // let listFields = await this.mysql.mysqlQuery('SHOW COLUMNS FROM ads;');
        //
        // if (additionalFields !== undefined){
        //     additionalFields = additionalFields.filter(item => {
        //         for (let item in listFields) {
        //             if (additionalFields.includes(item['Field'])){
        //                 return true
        //             }
        //         }
        //     })
        // }
        // console.log(additionalFields)

        return await this.apiItem.getAd(id, additionalFields)
    }
}

module.exports = PrepareData