
const Account = require('./models/account');
const EntryInfo = require('./models/entry_info');
const ExamType = require('./models/exam_type');
const ExamSpot = require('./models/exam_spot');
const Subject = require('./models/subject');
const Score = require('./models/score');

const {orm} = require('./orm');

const succ = () => {console.log('succ')};
const fail = error => {console.log('###fail\n', error)};

orm.sync({force: true}).then(() => {
    Account.register({username: '考生1', password: '00000000', authorization: 'student'}).then(succ, fail);
    Account.register({username: '考生2', password: '00000000', authorization: 'student'}).then(succ, fail);
    Account.register({username: '考务1', password: '11111111', authorization: 'admin'}).then(succ, fail);

    Subject.addSubject({name: '语文', type: 'literature'}).then(succ, fail);
    Subject.addSubject({name: '数学', type: 'literature'}).then(succ, fail);
    Subject.addSubject({name: '声乐', type: 'special'}).then(succ, fail);

    ExamType.addExamType({name: '类型1', startFrom: new Date(2017,1,1,0,0,0,0), endAt: new Date(2018,1,1,0,0,0,0), subjectIds:[1, 2]});
    ExamType.addExamType({name: '类型2', startFrom: new Date(2017,1,1,0,0,0,0), endAt: new Date(2018,1,1,0,0,0,0), subjectIds:[2, 3]});
    ExamType.addExamType({name: '类型3', startFrom: new Date(2017,1,1,0,0,0,0), endAt: new Date(2018,1,1,0,0,0,0), subjectIds:[2, 3]});
    ExamType.addExamType({name: '过期类型', startFrom: new Date(2017,1,1,0,0,0,0), endAt: new Date(2017,3,1,0,0,0,0), subjectIds:[1, 3]});
    ExamType.addExamType({name: '未开始类型', startFrom: new Date(2018,1,1,0,0,0,0), endAt: new Date(2018,3,1,0,0,0,0), subjectIds:[2]});

    EntryInfo.updateEntryInfoByStudentId(1, {
        name: '张三',
        gender: 'male',
        from: '北京',
        graduatedFrom: '人大附中',
        typeId: '1'
    }).then(succ, fail);

    EntryInfo.updateEntryInfoByStudentId(1, {
        name: '张三',
        gender: 'male',
        from: '北京',
        graduatedFrom: '人大附中',
        typeId: '2'
    }).then(() => {
        EntryInfo.updateEntryInfoByStudentId(1, {
            submit: true,
            typeId: '2'
        }).then(succ, fail);
    }, fail);

    EntryInfo.updateEntryInfoByStudentId(1, {
        name: '张三',
        gender: 'male',
        from: '北京',
        graduatedFrom: '人大附中',
        typeId: '3'
    }).then(() => {
        EntryInfo.updateEntryInfoByStudentId(1, {
            submit: true,
            typeId: '3'
        }).then(() => {
            EntryInfo.checkEntryInfoById(3).then(succ, fail);
        }, fail);
    }, fail);

    ExamSpot.addExamSpot({
        province: '河北', 
        city: '石家庄', 
        campus: '**大学', 
        description: '第一教学楼303', 
        capacity: 30, 
        typeId: 1
    }).then(succ, fail);

    ExamSpot.addExamSpot({
        province: '河南', 
        city: '郑州', 
        campus: '***大学', 
        description: '第三教学楼103', 
        capacity: 50, 
        typeId: 1
    }).then(succ, fail);

    ExamSpot.addExamSpot({
        province: '河南', 
        city: '郑州', 
        campus: '***大学', 
        description: '第三教学楼104', 
        capacity: 50, 
        typeId: 2
    }).then(succ, fail);

    ExamSpot.addExamSpot({
        province: '河南', 
        city: '郑州', 
        campus: '***大学', 
        description: '第三教学楼105', 
        capacity: 50, 
        typeId: 3
    }).then(succ, fail);

    Score.updateScoreByEntryInfoIdAndSubjectId({
        entryInfoId: 3, subjectId: 3, score: 30, absent: false
    }).then(succ, fail);

}, console.log);