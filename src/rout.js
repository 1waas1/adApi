const prepareDataFile = require('./PrepareData')
const express = require('express');
const path = require('path');

const port = process.env.NODEJS_PORT || 8080;
const app = express();

let prepareData = new prepareDataFile()

app.set('views', `${path.dirname(__dirname)}/templates`);
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    res.redirect('ads-list/1')
});

app.get('/ads-list/:page', async (req, res) => {
    let page = parseInt(req.params.page)
    let information = prepareData.getTemplateInfo(req.query)
    let adsList = await prepareData.getPaginationListAds(page, req.query?.field,  req.query?.params)

    if (adsList === null){
        res.send({'error':'Page not found'})
    }
    else {
        res.render('list',
            {
                'adsList': adsList,
                'currentPage': page,
                'paginationLinks': prepareData.getPaginationLinks(req.query, page, '/ads-list'),
                'quantityPages': await prepareData.getQuantityPages(),
                'fieldSort': information.fieldSort,
                'paramSort': information.paramSort,
            })
    }
});

app.get('/list', async (req, res) => {
    let allAdsList = await prepareData.getListAds()
    res.set('Cache-control', `no-store`);

    if (allAdsList === null){
        res.status(404)
            .type('application/json')
            .json({'error':'Entries not found'})
    }
    else {
        res.status(200)
            .type('application/json')
            .json(allAdsList)
    }
});

app.get('/ads/item/:id', async (req, res) => {
    let ad = await prepareData.getItemAds(parseInt(req.params.id))

    if (ad === null){
        res.status(404)
            .type('text/html')
            .send('<h3>Entries not found</h3>')
    }
    else {
        res.render('adsItem', ad)
    }

});

app.get('/ads/:id', async (req, res) => {
    let ad = await prepareData.getItemAds(parseInt(req.params.id))
    res.set('Cache-control', `no-store`)

    if (ad === null){
        res.status(404)
            .type('application/json')
            .json({'error':'Entries not found'})
    }
    else {
        res.status(200)
            .type('application/json')
            .json(ad);
    }
});

app.listen(port);