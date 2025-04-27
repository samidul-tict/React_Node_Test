const express = require('express');
const meeting = require('./meeting');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, meeting.index)
router.post('/add', auth, meeting.add)
// router.post('/addMany', auth, meeting.addMany)
router.get('/view/:id', auth, meeting.view)
router.put('/edit/:id', auth, meeting.edit)
// router.put('/changeStatus/:id', auth, meeting.changeStatus)
router.delete('/delete/:id', auth, meeting.deleteData)
router.post('/deleteMany', auth, meeting.deleteMany)

module.exports = router