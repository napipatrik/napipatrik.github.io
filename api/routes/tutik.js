const express = require('express');
const router = express.Router();

const tutikRepository = require('../repository/tutik');

router.get('/', async function (req, res) {
    res.json({
        tutik: tutikRepository.getTutik()
    });
});

module.exports = router;
