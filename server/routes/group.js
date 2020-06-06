var express = require('express');
var router = express.Router();

let util = require('../modules/util');
let statusCode = require('../modules/statusCode');
let resMessage = require('../modules/responseMessage');
let GroupModel = require('../models/group');
let UserModel = require('../models/user');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const jwt = require('../modules/jwt');

/* 특정 그룹 정보 조회 */
router.get('/:groupIdx', async (req, res) => {
  const groupIdx = req.params.groupIdx;
  const groupResult = await GroupModel.getGroupInfoRead(groupIdx);
  const userResult = await GroupModel.getGroupUserRead(groupIdx);

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
      groupInfo: groupResult[0],
      groupUser: userResult
    }));
});


/* 마니또 알고리즘 수행*/
router.get('/:groupIdx/manito', async (req, res) => {
  const groupIdx = req.params.groupIdx;
  const userResult = await GroupModel.getGroupUserRead(groupIdx); //특정 그룹 사용자 조회
  // 해당 그룹 존재하지 않음
  if (userResult.length == 0) {
    return res.status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, resMessage.MANITTO_FAIL));
  }

  // 마니또 뽑기
  let ind = []
  for(let user of userResult){
    ind.push(user.userIdx);
  }

  var manitos = {};
  let size = ind.length;

  for(let i in userResult){
    if (i == size-1)
      manitos[userResult[i].userIdx] = userResult[0].userIdx;
    manitos[userResult[i].userIdx] = userResult[i].userIdx+1;
  }

  // for(let user of userResult){
  //   let k = user.userIdx;
  //   let delete_index = 0; 
  //   while (k == user.userIdx){
  //     let i = Math.floor(Math.random() * size);
  //     k = ind[i];
  //     delete_index = i;
  //   }
  //   let manito = k;
  //   manitos[user.userIdx] = manito;
  //   ind.splice(delete_index, 1);
  //   size-=1;
  // }

  // manito 저장
  await GroupModel.setManito(groupIdx, manitos);



  // 유저 가져오기
  const token = req.headers.token;
  if (!token) {
      return res.json(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
  }
  const user = await jwt.verify(token);
  // idx, name, profileMsg 가져옴
  if (user === TOKEN_EXPIRED) {
      return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
  }
  if (user === TOKEN_INVALID) {
      return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
  }
  if (user.idx === undefined) {
      return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
  }
  const manitoUser = await UserModel.getUserByIdx(manitos[user.idx]);
  res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.MANITTO_SUCCESS, {
      'myManito': manitoUser[0]
    }));
});


module.exports = router;