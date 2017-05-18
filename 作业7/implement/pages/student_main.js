import React from 'react';
import Head from 'next/head';
import {
    Table,
    Card,
    Icon,
    Header,
    Button,
    Menu,
    Modal
} from 'semantic-ui-react';

import EntryInfoForm from '../components/entry_info_form';

function timeoutPromise(timeout, err, promise) {
    return new Promise((resolve, reject) => {
        promise.then(resolve, reject);
        setTimeout(reject.bind(null, err), timeout);
    });
}

function getScoreInfo(info) {
    const scores = {
        literature: [],
        special: [],
        bonus: info.bonus,
        score1: 0,
        score2: 0
    };
    info.scores.forEach(score => {
        const {name, type} = score.subject;
        const {id, absent} = score;
        const s = {id: id, subjectName: name, score: score.score, absent: absent};
        if (type == 'special') scores.special.push(s);
        else scores.literature.push(s);
        scores.score1 += s.score;
    });
    scores.score2 = scores.score1 + (scores.bonus ? scores.bonus.score : 0);
    return scores;
};

export default class extends React.Component {

    static async getInitialProps({req}) {
        const {entryInfos} = req;
        return {entryInfos};
    }

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            examSpots: [],
            activeItem: props.entryInfos && props.entryInfos.length > 0
                ? 0
                : -1,
            toBeUpdated: {}
        };
        this.handleItemClick = this
            .handleItemClick
            .bind(this);
    }

    handleItemClick(e, {id}) {
        this.setState({activeItem: id, toBeUpdated: {}});
    }

    submitEntryInfo(info) {
        info.submit = true;
        timeoutPromise(5000, '请求超时', fetch('/entry_info', {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(info),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) {
                window.location.reload();
            }
        }, info => {});
    }

    chooseExamSpot(info, examSpotId) {
        info.examSpotId = examSpotId;
        timeoutPromise(5000, '请求超时', fetch('/entry_info', {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(info),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) {
                window.location.reload();
            }
        }, console.log);
    }

    getExamSpots(id) {
        timeoutPromise(5000, '请求超时', fetch(`/exam_spots?examTypeId=${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            res.json().then(res => {
                this.setState({examSpots: res.examSpots});
            }, console.log);
            
        }, console.log);
    }

    render() {
        const {entryInfos} = this.props;
        const {activeItem, toBeUpdated, modalOpen, examSpots} = this.state;
        let content = null;
        if (activeItem >= 0) {
            const info = entryInfos[activeItem];
            const scores = getScoreInfo(info);
            const entryInfoAction = info.status === 'unsubmitted'
                ? <Button.Group fluid>
                        <Button positive
                        onClick={() => {
                            this.submitEntryInfo(info);
                        }}>确认</Button>
                        <Button.Or/>
                        <Button primary
                        onClick={() => {
                            this.setState({activeItem: -1, toBeUpdated: info});
                        }}>修改</Button>
                    </Button.Group>
                : info.status === 'checked'
                    ? !info.exam_spot ? <Button fluid primary onClick={() => {
                        this.setState({modalOpen: true});
                        this.getExamSpots(info.type_info.id);
                    }}>选择考点</Button>
                    : <Button fluid primary >导出报名表</Button> : null;
            content = <Card fluid>
                <Card.Content>
                    <Card.Header>
                        报名信息
                    </Card.Header>
                    <Card.Meta>
                        {info.status}
                    </Card.Meta>
                    <Table celled striped>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='file'/>
                                    报考类型
                                </Table.Cell>
                                <Table.Cell>{info.type_info.name}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='info'/>
                                    ID
                                </Table.Cell>
                                <Table.Cell>{info.id}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='user'/>
                                    姓名
                                </Table.Cell>
                                <Table.Cell>{info.name}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='man'/>
                                    性别
                                </Table.Cell>
                                <Table.Cell>{info.gender}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='point'/>
                                    生源地
                                </Table.Cell>
                                <Table.Cell>{info.from}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='university'/>
                                    毕业学校
                                </Table.Cell>
                                <Table.Cell>{info.graduatedFrom}</Table.Cell>
                            </Table.Row>

                        </Table.Body>
                    </Table>
                    {entryInfoAction}
                </Card.Content>

                <Card.Content>
                    <Card.Header>
                        考点信息
                    </Card.Header>
                    <Card.Meta>
                        尚未分配
                    </Card.Meta>
                    <Table celled striped>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    考场号
                                </Table.Cell>
                                <Table.Cell>{info.exam_spot && info.exam_spot.id}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    省份
                                </Table.Cell>
                                <Table.Cell>{info.exam_spot && info.exam_spot.province}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    城市
                                </Table.Cell>
                                <Table.Cell>{info.exam_spot && info.exam_spot.city}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    学校
                                </Table.Cell>
                                <Table.Cell>{info.exam_spot && info.exam_spot.campus}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    具体位置
                                </Table.Cell>
                                <Table.Cell>{info.exam_spot && info.exam_spot.description}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    人数
                                </Table.Cell>
                                <Table.Cell>{info.exam_spot && info.exam_spot.capacity}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Card.Content>

                <Card.Content>
                    <Card.Header>
                        成绩信息
                    </Card.Header>
                    <Card.Meta>
                        尚无成绩
                    </Card.Meta>
                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='2'>
                                    文化课成绩
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {scores
                                .literature
                                .map(item => <Table.Row key={item.id}>
                                    <Table.Cell collapsing>
                                        {item.subjectName}
                                    </Table.Cell>
                                    <Table.Cell>{item.absent
                                            ? '缺考'
                                            : item.score}</Table.Cell>
                                </Table.Row>)}
                        </Table.Body>
                    </Table>
                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='2'>
                                    专项成绩
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {scores
                                .special
                                .map(item => <Table.Row key={item.id}>
                                    <Table.Cell collapsing>
                                        {item.subjectName}
                                    </Table.Cell>
                                    <Table.Cell>{item.absent
                                            ? '缺考'
                                            : item.score}</Table.Cell>
                                </Table.Row>)}
                        </Table.Body>
                    </Table>
                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='2'>
                                    总分
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    卷面总分
                                </Table.Cell>
                                <Table.Cell>{scores.score1}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    加分
                                </Table.Cell>
                                <Table.Cell>{scores.bonus
                                        ? `${scores.bonus.score}(${scores.bonus.description})`
                                        : '无'}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    最终总分
                                </Table.Cell>
                                <Table.Cell>{scores.score2}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Card.Content>
            </Card>;
        } else {
            content = <EntryInfoForm {...toBeUpdated}/>
        }
        return (
            <div>
                <div
                    style={{
                    padding: 30,
                    background: '#333333'
                }}>
                    <Header
                        as='h1'
                        style={{
                        color: 'white'
                    }}>
                        <Icon name='student'/>
                        <Header.Content>
                            自主招生报名系统
                        </Header.Content>
                    </Header>
                </div>
                <div style={{
                    padding: 20
                }}>
                    <Menu pointing>
                        {entryInfos.map((info, index) => <Menu.Item
                            key={info.id}
                            name={info.type_info.name}
                            id={index}
                            active={activeItem === index}
                            onClick={this.handleItemClick}/>)}
                        <Menu.Menu position='right'>
                            <Menu.Item
                                name='新建报名'
                                id={-1}
                                active={activeItem === -1}
                                onClick={this.handleItemClick}/>
                        </Menu.Menu>
                    </Menu>
                    <Modal open={modalOpen} onClose={() => {this.setState({modalOpen: false})}}>
                        <Modal.Header>选择一个考点</Modal.Header>
                        <Modal.Content>
                            <Table compact celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>ID</Table.HeaderCell>
                                        <Table.HeaderCell>省</Table.HeaderCell>
                                        <Table.HeaderCell>市</Table.HeaderCell>
                                        <Table.HeaderCell>校园</Table.HeaderCell>
                                        <Table.HeaderCell>具体位置</Table.HeaderCell>
                                        <Table.HeaderCell>人数</Table.HeaderCell>
                                        <Table.HeaderCell>选择</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {examSpots.map(spot => <Table.Row key={spot.id}>
                                        <Table.Cell>{spot.id}</Table.Cell>
                                        <Table.Cell>{spot.province}</Table.Cell>
                                        <Table.Cell>{spot.city}</Table.Cell>
                                        <Table.Cell>{spot.campus}</Table.Cell>
                                        <Table.Cell>{spot.description}</Table.Cell>
                                        <Table.Cell>{spot.capacity}</Table.Cell>
                                        <Table.Cell collapsing>
                                            <Button positive animated='vertical' size='mini'
                                            onClick={() => {this.chooseExamSpot(entryInfos[activeItem], spot.id)}}>
                                                <Button.Content hidden><Icon name='checkmark' /></Button.Content>
                                                <Button.Content visible>
                                                    选择
                                                </Button.Content>
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>)}                                
                                </Table.Body>
                            </Table>
                        </Modal.Content>
                    </Modal>
                    {content}
                </div>
            </div>
        );
    }
}
