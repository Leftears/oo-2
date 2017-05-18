const Sequelize = require('sequelize');
const sequelize = new Sequelize('oo', 'root', '20120916', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306'
});

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    authorization: {
        type: Sequelize.ENUM('student', 'admin'),
        defaultValue: 'student'
    }
});

const TypeInfo = sequelize.define('type_info', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    startFrom: {
        type: Sequelize.DATE,
        allowNull: false
    },
    endAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

const EntryInfo = sequelize.define('entry_info', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.ENUM('male', 'female')
    },
    from: {
        type: Sequelize.STRING
    },
    graduatedFrom: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM('unsubmitted', 'unchecked', 'checked'),
        defaultValue: 'unsubmitted'
    }
});

const ExamSpot = sequelize.define('exam_spot', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    province: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    campus: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

const Score = sequelize.define('score', {
    score: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    absent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

const Bonus = sequelize.define('bonus', {
    score: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    name: {
        singular: 'bonus',
        plural: 'bonuses',
    }
});

const Subject = sequelize.define('subject', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.ENUM('literature', 'special'),
        allowNull: false
    }
});

User.hasMany(EntryInfo, {foreignKey: 'studentId', as: 'EntryInfos'});
EntryInfo.belongsTo(TypeInfo, {foreignKey: 'typeId'});
EntryInfo.belongsTo(ExamSpot, {foreignKey: 'examSpotId'});
ExamSpot.belongsTo(TypeInfo, {foreignKey: 'typeId'});

EntryInfo.hasMany(Score, {foreignKey: 'entryInfoId'});
Score.belongsTo(Subject, {foreignKey: 'subjectId'});
EntryInfo.belongsTo(Bonus, {foreignKey: 'bonusId'});

TypeInfo.belongsToMany(Subject, {through: 'type_subject'});
Subject.belongsToMany(TypeInfo, {through: 'type_subject'});


exports.orm = sequelize;
exports.User = User;
exports.EntryInfo = EntryInfo;
exports.TypeInfo = TypeInfo;
exports.ExamSpot = ExamSpot;
exports.Score = Score;
exports.Bonus = Bonus;
exports.Subject = Subject;
