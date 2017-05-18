const EntryInfoSchema = require('../orm').EntryInfo;
const BonusSchema = require('../orm').Bonus;

exports.updateBonusInfoByEntryInfoId = params => {
    const {entryInfoId, score, description} = params;
    return new Promise((resolve, reject) => {
        if (!entryInfoId) return reject('No supposed filed');
        EntryInfoSchema.findById(entryInfoId).then(info => {
            if (!info) return reject('Invalid entry_info id');
            info.getBonus().then(bonus => {
                if (bonus) {
                    if (score != null) bonus.score = score;
                    if (description != null) bonus.description = description;
                    bonus.save().then(resolve, reject);
                } else {
                    info.createBonus({score, description}).then(resolve, reject);
                }
            }, reject);
        }, reject);
    });
};