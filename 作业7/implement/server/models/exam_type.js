const TypeInfoSchema = require('../orm').TypeInfo;
const SubjectSchema = require('../orm').Subject;

exports.getExamTypeById = id => TypeInfoSchema.findById(id);

exports.getExamTypes = params => {
    const {availableOnly} = params;
    const now = new Date();
    const p = {
        include: [SubjectSchema]
    };
    if (availableOnly) p.where = {startFrom: { $lte: now },endAt: { $gte: now }};
    return new Promise((resolve, reject) => {
        TypeInfoSchema.findAll(p).then(types => {
            resolve(types);
        }, error => {
            reject(error);
        });
    });
};

exports.addExamType = params => {
    const {name, startFrom, endAt, subjectIds} = params;
    return new Promise((resolve, reject) => {
        if (!name || !startFrom || !endAt) 
            return reject('No supposed field');
        const t = {name, startFrom, endAt};
        TypeInfoSchema
            .create(t)
            .then(type => {
                if (subjectIds && subjectIds.length != 0) {
                    SubjectSchema.findAll({where: {id: {$in: subjectIds}}}).then(subjects => {
                        type.setSubjects(subjects);
                        resolve(type);
                    }, reject);
                } else {
                    resolve(type);
                }
            }, reject);
    });
};

exports.updateExamTypeById = (id, params) => {
    const {name, startFrom, endAt, subjectIds} = params;

    const updateExamSubjects = type => new Promise((resolve, reject) => {
        if (subjectIds) {
            SubjectSchema.findAll({where: {id: {$in: subjectIds}}}).then(subjects => {
                type.setSubjects(subjects);
                resolve(type);
            }, reject);
        } else {
            resolve(type);
        }
    });

    return new Promise((resolve, reject) => {
        TypeInfoSchema
            .findOne({
            where: {
                id: id
            }
        })
            .then(type => {
                if (!type) {
                    reject('找不到该报考类型');
                } else {
                    if (name && name !== type.name) 
                        type.name = name;
                    if (startFrom && startFrom !== type.startFrom) 
                        type.startFrom = startFrom;
                    if (endAt && endAt !== type.endAt) 
                        type.endAt = endAt;
                    type
                        .save()
                        .then(type => {
                            updateExamSubjects(type).then(resolve, reject);
                        }, reject);
                }
            }, reject);
    });
};