const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', (req, res) => {
    res.json('Welcome to my Product Look Up page');
});

let keyWord = 'apple';
let products = [];
let searchFor = 'apple';

app.get('/products/:keyWords', async (req, res) => {
    searchFor = req.params.keyWords;
    axios.get('https://pricespy.co.nz/search?search=' + searchFor)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            //  Uppercase first character of word
            const upperCaseSearchFor = searchFor.charAt(0).toUpperCase() + searchFor.slice(1);

            $('a:contains(' + upperCaseSearchFor + ')', html).each(function () {
                const title = $(this).attr('aria-label');
                const url = 'https://pricespy.co.nz/' + $(this).attr('href');
                const price = $(this).find('.dErWSy').text();
                if (title) {
                    products.push({
                        title,
                        url,
                        price
                    });
                }
            });

            res.json(products);
        }).catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));