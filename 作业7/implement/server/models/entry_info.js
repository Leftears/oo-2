const EntryInfoSchema = require('../orm').EntryInfo;
const TypeInfoSchema = require('../orm').TypeInfo;
const ExamSpotSchema = require('../orm').ExamSpot;
const ScoreSchema = require('../orm').Score;
const BonusSchema = require('../orm').Bonus;
const SubjectSchema = require('../orm').Subject;

exports.getEntryInfos = params => {
    const {status} = params;
    return new Promise((resolve, reject) => {
        EntryInfoSchema.findAll({
            where: status === 'unchecked' ? { status: 'unchecked' }
                : status === 'checked' ? { status: 'checked' }
                    : { status: { $ne: 'unsubmitted' } },
            include: [
                {model: TypeInfoSchema, include: [SubjectSchema]},
                ExamSpotSchema, 
                BonusSchema, 
                {model: ScoreSchema, include: [SubjectSchema]}
            ]
        }).then(resolve, reject);
    });
};

exports.getEntryInfosByStudentId = studentId => {
    return new Promise((resolve, reject) => {
        EntryInfoSchema
            .findAll({
            where: {
                studentId: studentId
            }
        })
            .then(resolve, reject);
    });
};

exports.checkEntryInfoById = id => {
    return new Promise((resolve, reject) => {
        EntryInfoSchema
            .findOne({ where: { id: id } })
            .then(info => {
                if (info.status != 'unchecked') 
                    return reject('非法的操作：无权确认该状态下的报考信息');
                info.status = 'checked';
                info
                    .save()
                    .then(resolve, reject);
            }, reject);
    });
}

exports.updateEntryInfoByStudentId = (studentId, params) => {
    const { name, gender, from, graduatedFrom, typeId, submit, examSpotId } = params;

    return new Promise((resolve, reject) => {
        if (!typeId) 
            return reject('非法的操作：未指定报考类型');
        EntryInfoSchema
            .findOne({ where: { studentId: studentId, typeId: typeId } })
            .then(entryInfo => {
                if (!entryInfo) {
                    const e = { studentId, name, gender, from, graduatedFrom, typeId };
                    EntryInfoSchema
                        .create(e)
                        .then(resolve, reject);
                } else {
                    if (entryInfo.status == 'checked' && !entryInfo.examSpotId && examSpotId) {
                        entryInfo.examSpotId = examSpotId;
                        entryInfo.save().then(resolve, reject);
                    } else {
                        if (entryInfo.status != 'unsubmitted') 
                            return reject('非法的操作：修改已提交的报名信息');
                        if (submit) {
                            entryInfo.status = 'unchecked';
                        } else {
                            if (name && name !== entryInfo.name) 
                                entryInfo.name = name;
                            if (gender && gender !== entryInfo.gender) 
                                entryInfo.gender = gender;
                            if (from && from !== entryInfo.from) 
                                entryInfo.from = from;
                            if (graduatedFrom && graduatedFrom !== entryInfo.graduatedFrom) 
                                entryInfo.graduatedFrom = graduatedFrom;
                        }
                        entryInfo
                            .save()
                            .then(resolve, reject);
                    }
                }
            }, reject);
    });
};

exports.getFullEntryInfosByStudentId = studentId => {
    return new Promise((resolve, reject) => {
        EntryInfoSchema.findAll({
            where: {
                studentId: studentId
            },
            include: [
                {model: TypeInfoSchema, include: [SubjectSchema]},
                ExamSpotSchema, 
                BonusSchema, 
                {model: ScoreSchema, include: [SubjectSchema]}
            ]
        }).then(resolve, reject);
    });
};

exports.removeEntryInfoById = (id, studentId) => {
    console.log('####', id, studentId);
    return new Promise((resolve, reject) => {
        EntryInfoSchema
                .findOne({ where: { id: id } })
                .then(entryInfo => {
                    if (!entryInfo) {
                        return reject('找不到该信息')
                    } else if (entryInfo.studentId != studentId) {
                        return reject('非法的操作：无权取消该报名信息')
                    } else {
                        return entryInfo.destroy({ force: true });
                    }
                }).then(resolve);
    });
};