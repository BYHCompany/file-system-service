const Router = require('express').Router;
const fileController = require('./file-controller');

const router = new Router();

router.post('/saveFiles', fileController.saveFiles);
router.delete('/deleteFiles', fileController.deleteFiles);

module.exports = router;
