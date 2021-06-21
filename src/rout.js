// const mysqlServices = require('./services/MysqlConnect')
const prepareDataFile = require('./PrepareData')
const express = require('express');
const path = require('path');

const port = process.env.NODEJS_PORT || 8080;
const app = express();

// let mysql = new mysqlServices();
let prepareData = new prepareDataFile()

app.set('views', `${path.dirname(__dirname)}/templates`);
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    res.redirect('ads/1')
});

app.get('/ads/:page', async (req, res) => {
    let page = parseInt(req.params.page)
    let sortField = req.query?.field;
    let paramSort = req.query?.params;

    let information = prepareData.getTemplateInfo(req.query)
    let paginationLinks = prepareData.getPaginationLinks(req.query, page, '/ads')

    let adsList = await prepareData.getPaginationListAds(page, sortField, paramSort)

    if (adsList === null){
        res.send({'error':'Page not found'})
    }
    else {
        res.render('list',
            {
                'adsList': adsList,
                'currentPage': page,
                'paginationLinks': paginationLinks,
                'quantityPages': await prepareData.getQuantityPages(),
                'fieldSort': information.fieldSort,
                'paramSort': information.paramSort,
            })
    }
});

app.get('/list', async (req, res) => {
    res.send(await prepareData.getListAds());
});

app.listen(port);