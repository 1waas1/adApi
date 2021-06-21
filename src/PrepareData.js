const mysqlServices = require('./services/MysqlConnect');
const apiAdsList = require('./api/ListAds');

class PrepareData{
    constructor() {
        this.mysql = new mysqlServices();
        this.apiList = new apiAdsList();
        this.quantityEntries = 1;
    }

    async getPaginationListAds(page, sortField = 'date', sortParam = 'ASC'){
        return this.apiList.paginationList(page, sortField, sortParam)
    }

    async getQuantityPages(page, sortField = 'date', sortParam = 'ASC'){
        let countEntry = await this.mysql.mysqlQuery('SELECT COUNT(*) as count FROM ads;');
        return Math.ceil(countEntry[0].count/this.quantityEntries)
    }

    async getListAds(sortField = 'date', sortParam = 'ASC'){
        let allAdsList = await this.apiList.allList(sortField, sortParam);

        if (allAdsList === null){
            return {'error':'Entries not found'}
        }
        return allAdsList
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
}

module.exports = PrepareData