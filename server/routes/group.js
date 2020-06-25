var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const groupController = require('../controllers/group');

/* 그룹 만들기 */
router.post('/', authUtil.checkToken, groupController.createGroup);

/* 유저->그룹 들어가기 */
router.get('/:groupIdx/in', authUtil.checkToken, groupController.getInGroup);

/* 특정 그룹 정보 조회 */
router.get('/:groupIdx', groupController.getGroup);

/* 마니또 알고리즘 수행*/
router.get('/:groupIdx/manito', authUtil.checkToken, groupController.setManito);


module.exports = router;