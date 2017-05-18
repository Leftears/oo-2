const SubjectSchema = require('../orm').Subject;

exports.getSubjects = params => {
    const {examTypeId} = params;
    //TODO include here
    return new Promise((resolve, reject) => {
        SubjectSchema.findAll().then(resolve, reject);
    });
};

exports.addSubject = params => {
    const {name, type} = params;
    return new Promise((resolve, reject) => {
        SubjectSchema
            .create({name, type})
            .then(resolve, reject);
    });
};

exports.updateSubjectById = (id, params) => {
    const {name, type} = params;
    return new Promise((resolve, reject) => {
        SubjectSchema
            .findOne({
            where: {
                id: id
            }
        })
            .then(subject => {
                if (!subject) {
                    reject('找不到该科目');
                } else {
                    if (name && name !== subject.name) 
                        subject.name = name;
                    if (type && type !== subject.type) 
                        subject.type = type;
                    subject
                        .save()
                        .then(resolve, reject);
                }
            }, reject);
    });
};