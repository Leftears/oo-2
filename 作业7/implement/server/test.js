const Bonus = require('./models/bonus');

Bonus.updateBonusInfoByEntryInfoId({
    entryInfoId: 3,
    score: 20,
    description: '数学竞赛加分'
}).then(console.log, console.log);