const ExamSpotSchema = require('../orm').ExamSpot;
const TypeInfoSchema = require('../orm').TypeInfo;

exports.getExamSpotById = id => ExamSpotSchema.findById(id);

exports.getExamSpots = params => {
    const {examTypeId} = params;
    const p = {
        include: [TypeInfoSchema]
    }
    if (examTypeId) p.where = {typeId: examTypeId}
    return new Promise((resolve, reject) => {
        ExamSpotSchema.findAll(p).then(resolve, reject);
    });
};

exports.addExamSpot = params => {
    const {province, city, campus, description, capacity, typeId} = params;
    return new Promise((resolve, reject) => {
        if (!typeId) 
            return reject('非法的操作：未指定报考类型');
        const s = {province, city, campus, description, capacity, typeId};
        ExamSpotSchema
            .create(s)
            .then(resolve, reject);
    });
};

exports.updateExamSpotById = (id, params) => {
    const {province, city, campus, description, capacity, typeId} = params;
    return new Promise((resolve, reject) => {
        ExamSpotSchema
            .findOne({
            where: {
                id: id
            }
        })
            .then(spot => {
                if (!spot) {
                    reject('找不到该考点');
                } else {
                    if (province && province !== spot.province) 
                        spot.province = province;
                    if (city && city !== spot.city) 
                        spot.city = city;
                    if (campus && campus !== spot.campus) 
                        spot.campus = campus;
                    if (description && campus !== spot.description) 
                        spot.description = description;
                    if (capacity && capacity !== spot.capacity) 
                        spot.capacity = capacity;
                    if (typeId && typeId !== spot.typeId) 
                        spot.typeId = typeId;
                    spot
                        .save()
                        .then(resolve, reject);
                }
            }, reject);
    });
};