'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const flash = require('connect-flash');

const passport = require('./authorization');
const {orm} = require('./orm');

const Account = require('./models/account');
const EntryInfo = require('./models/entry_info');
const ExamType = require('./models/exam_type');
const ExamSpot = require('./models/exam_spot');
const Subject = require('./models/subject');
const Score = require('./models/score');
const Bonus = require('./models/bonus');

const next = require('next'); 
const accepts = require('accepts'); 
const app = next('.', { dev: true }); 
const handle = app.getRequestHandler();
app.prepare().then(() => {
    orm
    .sync()
    .then(() => {
        console.log('orm initialized.');

        const server = express();

        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({extended: false}));
        server.use(cookieParser());
        server.use(session({
            secret: 'keyboard cat',
            resave: true,
            saveUninitialized: false,
            store: new RedisStore(),
            cookie: {
                maxAge: 24 * 60 * 60 * 1000
            }
        }));
        server.use(passport.initialize());
        server.use(passport.session());

        const checkAuthentication = type => (req, res, next) => {
            if (!req.isAuthenticated()) {
                res
                    .status(401)
                    .send({message: '尚未登录'});
            } else {
                if (!type) 
                    next();
                else if (req.user.authorization !== type) {
                    res
                        .status(401)
                        .send({message: `用户${req.user.authorization}无权进行此操作`});
                } else {
                    next();
                }
            }
        };

        const handleError = res => error => {
            res
                .status(400)
                .send({message: error});
        };

        /**
         * authentication
         */
        server.post('/login', passport.authenticate('local'), (req, res) => {
            res.send({success: true});
        });

        server.post('/register', (req, res) => {
            Account
                .register(req.body)
                .then(user => {
                    res.send({success: true, user: user});
                }, handleError(res));
        });

        /**
         * entry infos
         */
        server.get('/entry_info', checkAuthentication('student'), (req, res) => {
            const {id} = req.user;
            EntryInfo
                .getEntryInfosByStudentId(id)
                .then(infos => {
                    res.send({success: true, entryInfos: infos});
                }, handleError(res));
        });

        server.put('/entry_info', checkAuthentication('student'), (req, res) => {
            const {id} = req.user;
            EntryInfo
                .updateEntryInfoByStudentId(id, req.body)
                .then(info => {
                    res.send({success: true, entryInfo: info});
                }, handleError(res));
        });

        server.get('/entry_infos', checkAuthentication('admin'), (req, res) => {
            EntryInfo
                .getEntryInfos(req.query)
                .then(infos => {
                    res.send({success: true, entryInfos: infos});
                }, handleError(res));
        });

        server.post('/entry_infos/:id', checkAuthentication('admin'), (req, res) => {
            EntryInfo.checkEntryInfoById(req.params.id).then(info => {
                res.send({success: true, entryInfo: info});
            }, handleError(res));
        });

        /**
         * exam types
         */
        server.get('/exam_types', checkAuthentication(), (req, res) => {
            ExamType
                .getExamTypes(req.query)
                .then(types => {
                    res.send({success: true, examTypes: types});
                }, handleError(res));
        });

        server.put('/exam_types', checkAuthentication('admin'), (req, res) => {
            ExamType
                .addExamType(req.body)
                .then(type => {
                    res.send({success: true, examType: type});
                }, handleError(res));
        });

        server.post('/exam_types/:id', checkAuthentication('admin'), (req, res) => {
            ExamType
                .updateExamTypeById(req.params.id, req.body)
                .then(type => {
                    res.send({success: true, examType: type});
                }, handleError(res));
        });

        /**
         * exam spots
         */
        server.get('/exam_spots', checkAuthentication(), (req, res) => {
            ExamSpot
                .getExamSpots(req.query)
                .then(spots => {
                    res.send({success: true, examSpots: spots});
                }, handleError(res));
        });

        server.put('/exam_spots', checkAuthentication('admin'), (req, res) => {
            ExamSpot
                .addExamSpot(req.body)
                .then(spot => {
                    res.send({success: true, examSpot: spot});
                }, handleError(res));
        });

        server.post('/exam_spots/:id', checkAuthentication('admin'), (req, res) => {
            ExamSpot
                .updateExamSpotById(req.params.id, req.body)
                .then(spot => {
                    res.send({success: true, examSpot: spot});
                }, handleError(res));
        });

        /**
         * subjects
         */
        server.get('/subjects', checkAuthentication(), (req, res) => {
            Subject
                .getSubjects(req.query)
                .then(subjects => {
                    res.send({success: true, subjects: subjects});
                }, handleError(res));
        });

        server.put('/subjects', checkAuthentication('admin'), (req, res) => {
            Subject
                .addSubject(req.body)
                .then(subject => {
                    res.send({success: true, subject: subject});
                }, handleError(res));
        });

        server.post('/subjects/:id', checkAuthentication('admin'), (req, res) => {
            Subject
                .updateSubjectById(req.params.id, req.body)
                .then(subject => {
                    res.send({success: true, subject: subject});
                }, handleError(res));
        });

        /**
         * scores
         */
         server.post('/scores', checkAuthentication('admin'), (req, res) => {
            Score
                .updateScoreByEntryInfoIdAndSubjectId(req.body)
                .then(score => {
                    res.send({success: true, score: score});
                }, handleError(res));
        });

        server.put('/bonuses', checkAuthentication('admin'), (req, res) => {
            Bonus.updateBonusInfoByEntryInfoId(req.body).then(bonus => {
                res.send({success: true, bonus: bonus});
            }, handleError(res));
        });


        server.get('/student_main', checkAuthentication('student'), (req, res) => {
            const {id} = req.user;
            EntryInfo.getFullEntryInfosByStudentId(id).then(infos => {
                req.entryInfos = infos;
                return handle(req, res);
            }, handleError(res));
        });

        server.get('/admin_main', checkAuthentication('admin'), (req, res) => {
            return handle(req, res);
        });

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000);

    }, error => {
        console.log(error);
    });

});
