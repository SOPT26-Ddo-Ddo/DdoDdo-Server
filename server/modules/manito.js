
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const getManito = async (userList, groupIdx) => {
    userIdxList = []
    for (var i = 0; i < userList.length; i++){        
        userIdxList.push(userList[i].userIdx);
    }

    // shuffle & deep copy
    tempList = shuffle(JSON.parse(JSON.stringify(userIdxList)));
    manito = {};
    for (var i = 0; i < userIdxList.length; i++){
        if (tempList.length == 2) {
            if (userIdxList[i] == tempList[0] || userIdxList[i + 1] == tempList[1]) {
                manito[userIdxList[i]] = tempList[1];
                manito[userIdxList[i+1]] = tempList[0];
            } else {
                manito[userIdxList[i]] = tempList[0];
                manito[userIdxList[i+1]] = tempList[1];
            }
            break;
        }

        for (var j = 0; j < tempList.length; j++){
            if (userIdxList[i] == tempList[j]) continue;
            manito[userIdxList[i]] = tempList[j];
            tempList.splice(j, 1);
            break;
        }
    }
    return manito;
};


module.exports = {
    getManito: getManito
};
