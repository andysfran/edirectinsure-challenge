const express = require('express');
const router = express.Router();

// create the homepage route at '/'
router.get('/', (_, res) => {
    res.send('you just hit the home page\n');
});

// Routes
router.use('/api/', require('./users'));
router.use('/api/', require('./projects'));
router.use('/api/', require('./task'));

module.exports = router;
