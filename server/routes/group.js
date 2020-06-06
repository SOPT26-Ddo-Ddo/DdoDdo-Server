var express = require('express');
var router = express.Router();

let util = require('../modules/util');
let statusCode = require('../modules/statusCode');
let resMessage = require('../modules/responseMessage');
let GroupModel = require('../models/group');

/* 특정 그룹 정보 조회 */
router.get('/:groupIdx', async (req, res) => {
  const groupIdx = req.params.groupIdx;
  const groupResult = await GroupModel.getGroupInfoRead(groupIdx);
  const userResult = await GroupModel.getGroupUserRead(groupIdx);
  console.log(userResult)

  // 해당 그룹 존재하지 않음
  if (groupResult.length == 0) {
    return res.status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_FAIL));
  }

  if (userResult.length == 0) {
    return res.status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_FAIL));
  }

  res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.GROUP_SUCCESS, {
      groupInfo: groupResult,
      groupUser: userResult
    }));
});

// /* 마니또 알고리즘 수행 */
// router.get('/:groupIdx/user/:userIdx', function (req, res, next) {
//   const groupIdx = req.params.groupIdx;

//   const groupResult = await GroupModel.getGroupInfoRead(groupIdx);
//   const userResult = await GroupModel.getGroupUserRead(groupIdx);

//   // 해당 그룹 존재하지 않음
//   if (result.length == 0) {
//     res.status(statusCode.BAD_REQUEST)
//       .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_FAIL));
//   }

//   res.status(statusCode.OK)
//     .send(util.success(statusCode.OK, resMessage.GROUP_SUCCESS, {
//       groupInfo: groupResult,
//       groupUser: userResult
//     }));
// });

module.exports = router;