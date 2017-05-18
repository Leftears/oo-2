const ScoreSchema = require('../orm').Score;

exports.updateScoreByEntryInfoIdAndSubjectId = params => {
    const {entryInfoId, subjectId, score, absent} = params;
    
    return new Promise((resolve, reject) => {
        if (entryInfoId == null || subjectId == null) return reject('No supposed field');
        ScoreSchema.findOne({where: {entryInfoId: entryInfoId, subjectId: subjectId}}).then(s => {
            if (!s) {
                ScoreSchema.create({entryInfoId, subjectId, score, absent}).save().then(resolve, reject);
            } else {
                if (score != null) s.score = score;
                if (absent != null) s.absent = absent;
                s.save().then(resolve, reject);
            }
        }, reject);
    });
    
}