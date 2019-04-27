const express = require('express');
const moment = require('moment');
const router = express.Router();

const tutikRepository = require('../repository/tutik');

router.get('/', async function (req, res) {
    const offset = moment().year() * moment().dayOfYear();
    const tutik = tutikRepository.getTutik();
    const index = offset % tutik.length;
    res.json(tutik[index]);
});

router.get('/random', async function (req, res) {
    const tutik = tutikRepository.getTutik();
    const index = Math.floor(Math.random() * tutik.length);
    res.json(tutik[index]);
});

module.exports = router;
