const mysqlServices = require('./services/MysqlConnect');
const apiAdsList = require('./api/ListAds');
const apiAdsItem = require('./api/ItemAds');
const apiCreateAds = require('./api/CreateAds');

class PrepareData{
    constructor() {
        this.quantityEntries = 10;
        this.mysql = new mysqlServices();
        this.apiList = new apiAdsList(this.quantityEntries);
        this.apiItem = new apiAdsItem();
        this.apiCreate = new apiCreateAds();
    }

    async getPaginationListAds(page, sortField = 'date', sortParam = 'ASC'){
        let paginationList = await this.apiList.paginationList(page, sortField, sortParam);

       for (let item in paginationList){
           paginationList[item].images = JSON.parse(paginationList[item].images)[0]
       }

       return paginationList
    }

    async getQuantityPages(page, sortField = 'date', sortParam = 'ASC'){
        let countEntry = await this.mysql.mysqlQuery('SELECT COUNT(*) as count FROM ads;');
        return Math.ceil(countEntry[0].count/this.quantityEntries)
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

    async getItemAds(id, additionalFields = []){
        if (!Number.isInteger(id)){
            return null
        }
        let listFields = await this.mysql.mysqlQuery('SHOW COLUMNS FROM ads;');
        let existFields = []

        for (let field in additionalFields){
            if (listFields.indexOf(field) !== -1){
                existFields.push(field)
            }
        }

        let adsItem = await this.apiItem.getAd(id, existFields);

        adsItem.images = JSON.parse(adsItem.images);

        if (!additionalFields.includes('images')){
            adsItem.images = adsItem.images[0];
        }

        return adsItem
    }

    async createAds(data){
        if (data?.images){
            data.images = data.images.split('; ');

            if (data.images.length > 3){
                return null
            }

            data.images = JSON.stringify(data.images);
        }
        return await this.apiCreate.setAds(data)
    }
}

module.exports = PrepareData