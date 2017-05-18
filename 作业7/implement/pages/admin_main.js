import React from 'react';
import update from 'react-addons-update';
import Head from 'next/head';
import {
    Table,
    Card,
    Icon,
    Header,
    Button,
    Menu,
    Modal,
    Input,
    Dropdown,
    Form,
    Divider,
    Radio
} from 'semantic-ui-react';


function timeoutPromise(timeout, err, promise) {
    return new Promise((resolve, reject) => {
        promise.then(resolve, reject);
        setTimeout(reject.bind(null, err), timeout);
    });
}

export default class extends React.Component {

    static async getInitialProps({req}) {
        return {};
    }

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            activeItem: 0,
            subjects: null,
            examSpots: null,
            examTypes: null,
            entryInfos: null,
            checkedEntryInfos: null,
            currentModal: null
        };

        this.handleItemClick = this
            .handleItemClick
            .bind(this);
    }


    componentDidMount() {
        this.syncSubjects();
    }

    syncSubjects() {
        timeoutPromise(5000, '请求超时', fetch(`/subjects`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            res.json().then(res => {
                this.setState({subjects: res.subjects});
            }, console.log);
        }, console.log);
    }

    syncExamSpots() {
        timeoutPromise(5000, '请求超时', fetch(`/exam_spots`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            res.json().then(res => {
                this.setState({examSpots: res.examSpots});
            }, console.log);
        }, console.log);
    }

    syncExamTypes() {
        timeoutPromise(5000, '请求超时', fetch(`/exam_types`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            res.json().then(res => {
                this.setState({examTypes: res.examTypes});
            }, console.log);
        }, console.log);
    }

    syncEntryInfos() {
        timeoutPromise(5000, '请求超时', fetch(`/entry_infos?status=unchecked`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            res.json().then(res => {
                this.setState({entryInfos: res.entryInfos});
            }, console.log);
        }, console.log);
    }

    syncCheckedEntryInfos() {
        timeoutPromise(5000, '请求超时', fetch(`/entry_infos?status=checked`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            res.json().then(res => {
                this.setState({checkedEntryInfos: res.entryInfos});
            }, console.log);
        }, console.log);
    }

    postEditSubject() {
        const {editSubject} = this.state;
        timeoutPromise(5000, '请求超时', fetch(`/subjects/${editSubject.id}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(editSubject),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }

    putAddSubject() {
        const {addSubject} = this.state;
        timeoutPromise(5000, '请求超时', fetch(`/subjects`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(addSubject),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }

    postEditExamSpot() {
        const {editExamSpot} = this.state;
        timeoutPromise(5000, '请求超时', fetch(`/exam_spots/${editExamSpot.id}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(editExamSpot),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }

    putAddExamSpot() {
        const {addExamSpot} = this.state;
        timeoutPromise(5000, '请求超时', fetch(`/exam_spots`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(addExamSpot),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }

    postEditExamType() {
        const {editExamType} = this.state;
        let target = {...editExamType};
        try{
            const tmp = JSON.parse(`[${target.rawSubjectIds}]`);
            target.subjectIds = tmp;
        } catch(e) {}
        timeoutPromise(5000, '请求超时', fetch(`/exam_types/${target.id}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(target),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }

    putAddExamType() {
        const {addExamType} = this.state;
        let target = {...addExamType};
        try{
            const tmp = JSON.parse(`[${target.rawSubjectIds}]`);
            target.subjectIds = tmp;
        } catch(e) {}
        timeoutPromise(5000, '请求超时', fetch(`/exam_types`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(target),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }

    postCheckEntryInfo(info) {
        timeoutPromise(5000, '请求超时', fetch(`/entry_infos/${info.id}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(info),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }

    postEditScore(score) {
        const target = {...score};
        if (target.absent) target.score = 0;
        timeoutPromise(5000, '请求超时', fetch(`/scores`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(target),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }

    putEditBonus() {
        const {editBonus} = this.state;
        timeoutPromise(5000, '请求超时', fetch(`/bonuses`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(editBonus),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) window.location.reload();
        }, console.log);
    }


    handleItemClick(e, {id}) {
        switch(id) {
            case 0:
                if (!this.state.subjects) this.syncSubjects(); break;
            case 1:
                if (!this.state.examSpots) this.syncExamSpots(); break;
            case 2:
                if (!this.state.examTypes) this.syncExamTypes(); break;
            case 3:
                if (!this.state.entryInfos) this.syncEntryInfos(); break;
            case 4:
                if (!this.state.checkedEntryInfos) this.syncCheckedEntryInfos(); break;
            default:
                break;
        }
        this.setState({activeItem: id});
    }

    showEditSubject(subject) {
        this.setState({
            modalOpen: true, 
            currentModal: 'editSubject',
            editSubject: {...subject}
        });
    }

    showAddSubject() {
        this.setState({
            modalOpen: true, 
            currentModal: 'addSubject',
            addSubject: {
                name: '',
                type: ''
            }
        });
    }

    showEditExamSpot(spot) {
        this.setState({
            modalOpen: true, 
            currentModal: 'editExamSpot',
            editExamSpot: {...spot}
        });
    }

    showAddExamSpot() {
        this.setState({
            modalOpen: true, 
            currentModal: 'addExamSpot',
            addExamSpot: {
                province: '',
                city: '',
                campus: '',
                description: '',
                capacity: 0,
                typeId: '',
                type_info: {
                    id: '',
                    name: ''
                }
            }
        });
    }

    showEditExamType(type) {
        this.setState({
            modalOpen: true, 
            currentModal: 'editExamType',
            editExamType: {...type, rawSubjectIds: ''}
        });
    }

    showAddExamType() {
        this.setState({
            modalOpen: true, 
            currentModal: 'addExamType',
            addExamType: {
                name: '',
                startFrom: new Date().toLocaleDateString(),
                endAt: new Date().toLocaleDateString(),
                rawSubjectIds: ''
            }
        });
    }

    showEditScore(info) {
        const scores = info.type_info.subjects.map(subject => {
            const s = info.scores && info.scores.find(i => i.subject.id === subject.id);
            const {id, name, type} = subject;
            return ({
                entryInfoId: info.id,
                subjectId: id, 
                name: name, 
                type: type, 
                score: s == null ? '无' : s.score,
                absent: s == null ? false : s.absent
            });
        });
        const bonus = info.bonus ? {...info.bonus, entryInfoId: info.id} : {
            entryInfoId: info.id,
            score: 0,
            description: ''
        };
        this.setState({
            modalOpen: true, 
            currentModal: 'editScore',
            editScore: scores,
            editBonus: bonus
        });
    }

    render() {
        const {subjects, examSpots, examTypes, entryInfos, checkedEntryInfos, 
            activeItem, modalOpen, currentModal, 
            editSubject, addSubject, 
            editExamSpot, addExamSpot,
            editExamType, addExamType,
            editScore, editBonus
        } = this.state;
        let content = null;
        let modalHeader = null;
        let modalContent = null;
        if (currentModal === 'editSubject') {
            modalHeader = '编辑考试科目';
            modalContent = (
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>名称</Table.HeaderCell>
                            <Table.HeaderCell>类型</Table.HeaderCell>
                            <Table.HeaderCell>操作</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>{editSubject.id}</Table.Cell>
                            <Table.Cell><Input 
                            onChange={e => {this.setState({editSubject: update(editSubject, {name: {$set: e.currentTarget.value}})})}}
                            value={editSubject.name} /></Table.Cell>
                            <Table.Cell><Dropdown placeholder='类型' search selection 
                            onChange={((e, d) => {this.setState({editSubject: update(editSubject, {type: {$set: d.value}})})})}
                            value={editSubject.type}
                            options={[
                                {key: 'literature', value: 'literature', text: 'literature'}, 
                                {key: 'special', value: 'special', text: 'special'}]} /></Table.Cell>
                            <Table.Cell collapsing>
                                <Button positive animated='vertical' size='mini'
                                onClick={() => {this.postEditSubject()}}>
                                    <Button.Content visible><Icon name='checkmark' /></Button.Content>
                                    <Button.Content hidden>提交</Button.Content>
                                </Button>
                            </Table.Cell>
                        </Table.Row>                            
                    </Table.Body>
                </Table>
            );
        } else if (currentModal === 'addSubject') {
            modalHeader = '添加考试科目';
            modalContent = (
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>名称</Table.HeaderCell>
                            <Table.HeaderCell>类型</Table.HeaderCell>
                            <Table.HeaderCell>操作</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell><Input 
                            onChange={e => {this.setState({addSubject: update(addSubject, {name: {$set: e.currentTarget.value}})})}}
                            value={addSubject.name} /></Table.Cell>
                            <Table.Cell><Dropdown placeholder='类型' search selection 
                            onChange={((e, d) => {this.setState({addSubject: update(addSubject, {type: {$set: d.value}})})})}
                            value={addSubject.type}
                            options={[
                                {key: 'literature', value: 'literature', text: 'literature'}, 
                                {key: 'special', value: 'special', text: 'special'}]} /></Table.Cell>
                            <Table.Cell collapsing>
                                <Button positive animated='vertical' size='mini'
                                onClick={() => {this.putAddSubject()}}>
                                    <Button.Content visible><Icon name='checkmark' /></Button.Content>
                                    <Button.Content hidden>提交</Button.Content>
                                </Button>
                            </Table.Cell>
                        </Table.Row>                            
                    </Table.Body>
                </Table>
            );
        } else if (currentModal === 'editExamSpot') {
            modalHeader = '编辑考点';
            modalContent = (
                <Form>
                    <Form.Field>
                        <label>ID</label>
                        <Input disabled
                            onChange={e => {this.setState({editExamSpot: update(editExamSpot, {province: {$set: e.currentTarget.value}})})}}
                            value={editExamSpot.id} />
                    </Form.Field>
                    <Form.Field>
                        <label>省</label>
                        <Input
                            onChange={e => {this.setState({editExamSpot: update(editExamSpot, {province: {$set: e.currentTarget.value}})})}}
                            value={editExamSpot.province} />
                    </Form.Field>
                    <Form.Field>
                        <label>市</label>
                        <Input
                            onChange={e => {this.setState({editExamSpot: update(editExamSpot, {city: {$set: e.currentTarget.value}})})}}
                            value={editExamSpot.city} />
                    </Form.Field>
                    <Form.Field>
                        <label>校园</label>
                        <Input
                            onChange={e => {this.setState({editExamSpot: update(editExamSpot, {campus: {$set: e.currentTarget.value}})})}}
                            value={editExamSpot.campus} />
                    </Form.Field>
                    <Form.Field>
                        <label>具体位置</label>
                        <Input
                            onChange={e => {this.setState({editExamSpot: update(editExamSpot, {description: {$set: e.currentTarget.value}})})}}
                            value={editExamSpot.description} />
                    </Form.Field>
                    <Form.Field>
                        <label>人数</label>
                        <Input
                            onChange={e => {this.setState({editExamSpot: update(editExamSpot, {capacity: {$set: e.currentTarget.value}})})}}
                            value={editExamSpot.capacity} />
                    </Form.Field>
                    <Form.Field>
                        <label>类型ID</label>
                        <Input
                            onChange={e => {this.setState({editExamSpot: update(editExamSpot, {typeId: {$set: e.currentTarget.value}})})}}
                            value={editExamSpot.typeId} />
                    </Form.Field>
                    <Form.Field>
                        <Button fluid positive animated='vertical'
                        onClick={e => {
                            e.preventDefault();
                            this.postEditExamSpot();
                        }}>
                            <Button.Content visible><Icon name='checkmark' /></Button.Content>
                            <Button.Content hidden>提交</Button.Content>
                        </Button>
                    </Form.Field>
                </Form>
            );
        } else if (currentModal === 'addExamSpot') {
            modalHeader = '添加考点';
            modalContent = (
                <Form>
                    <Form.Field>
                        <label>省</label>
                        <Input
                            onChange={e => {this.setState({addExamSpot: update(addExamSpot, {province: {$set: e.currentTarget.value}})})}}
                            value={addExamSpot.province} />
                    </Form.Field>
                    <Form.Field>
                        <label>市</label>
                        <Input
                            onChange={e => {this.setState({addExamSpot: update(addExamSpot, {city: {$set: e.currentTarget.value}})})}}
                            value={addExamSpot.city} />
                    </Form.Field>
                    <Form.Field>
                        <label>校园</label>
                        <Input
                            onChange={e => {this.setState({addExamSpot: update(addExamSpot, {campus: {$set: e.currentTarget.value}})})}}
                            value={addExamSpot.campus} />
                    </Form.Field>
                    <Form.Field>
                        <label>具体位置</label>
                        <Input
                            onChange={e => {this.setState({addExamSpot: update(addExamSpot, {description: {$set: e.currentTarget.value}})})}}
                            value={addExamSpot.description} />
                    </Form.Field>
                    <Form.Field>
                        <label>人数</label>
                        <Input
                            onChange={e => {this.setState({addExamSpot: update(addExamSpot, {capacity: {$set: e.currentTarget.value}})})}}
                            value={addExamSpot.capacity} />
                    </Form.Field>
                    <Form.Field>
                        <label>类型ID</label>
                        <Input
                            onChange={e => {this.setState({addExamSpot: update(addExamSpot, {typeId: {$set: e.currentTarget.value}})})}}
                            value={addExamSpot.typeId} />
                    </Form.Field>
                    <Form.Field>
                        <Button fluid positive animated='vertical'
                        onClick={e => {
                            e.preventDefault();
                            this.putAddExamSpot();
                        }}>
                            <Button.Content visible><Icon name='checkmark' /></Button.Content>
                            <Button.Content hidden>提交</Button.Content>
                        </Button>
                    </Form.Field>
                </Form>
            );
        } else if (currentModal === 'editExamType') {
            modalHeader = '编辑考试类型';
            modalContent = (
                <span>
                    <Table compact celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>名称</Table.HeaderCell>
                                <Table.HeaderCell>报名开始时间</Table.HeaderCell>
                                <Table.HeaderCell>报名截止时间</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>{editExamType.id}</Table.Cell>
                                <Table.Cell><Input 
                                onChange={e => {this.setState({editExamType: update(editExamType, {name: {$set: e.currentTarget.value}})})}}
                                value={editExamType.name} /></Table.Cell>
                                <Table.Cell><Input 
                                onChange={e => {this.setState({editExamType: update(editExamType, {startFrom: {$set: e.currentTarget.value}})})}}
                                value={editExamType.startFrom} /></Table.Cell>
                                <Table.Cell><Input 
                                onChange={e => {this.setState({editExamType: update(editExamType, {endAt: {$set: e.currentTarget.value}})})}}
                                value={editExamType.endAt} /></Table.Cell>
                            </Table.Row>                            
                        </Table.Body>
                    </Table>
                    <Divider horizontal>考试科目</Divider>
                    <Input fluid 
                    onChange={e => {
                        const tmp = e.currentTarget.value;
                        this.setState({editExamType: update(editExamType, {rawSubjectIds: {$set: tmp}})});
                    }}
                    value={editExamType.rawSubjectIds} label='编辑'/>
                    <Table compact celled selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>名称</Table.HeaderCell>
                                <Table.HeaderCell>类型</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {editExamType.subjects && editExamType.subjects.map(subject => <Table.Row key={subject.id}>
                                <Table.Cell>{subject.id}</Table.Cell>
                                <Table.Cell>{subject.name}</Table.Cell>
                                <Table.Cell>{subject.type}</Table.Cell>
                            </Table.Row>)}                                
                        </Table.Body>
                    </Table>
                    <Divider horizontal>操作</Divider>
                    <Button positive animated='vertical' fluid
                        onClick={() => {this.postEditExamType()}}>
                        <Button.Content visible><Icon name='checkmark' /></Button.Content>
                        <Button.Content hidden>提交</Button.Content>
                    </Button>
                </span>
            );
        } else if (currentModal === 'addExamType') {
            modalHeader = '添加考试类型';
            modalContent = (
                <span>
                    <Table compact celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>名称</Table.HeaderCell>
                                <Table.HeaderCell>报名开始时间</Table.HeaderCell>
                                <Table.HeaderCell>报名截止时间</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell><Input 
                                onChange={e => {this.setState({addExamType: update(addExamType, {name: {$set: e.currentTarget.value}})})}}
                                value={addExamType.name} /></Table.Cell>
                                <Table.Cell><Input 
                                onChange={e => {this.setState({addExamType: update(addExamType, {startFrom: {$set: e.currentTarget.value}})})}}
                                value={addExamType.startFrom} /></Table.Cell>
                                <Table.Cell><Input 
                                onChange={e => {this.setState({addExamType: update(addExamType, {endAt: {$set: e.currentTarget.value}})})}}
                                value={addExamType.endAt} /></Table.Cell>
                            </Table.Row>                            
                        </Table.Body>
                    </Table>
                    <Divider horizontal>考试科目</Divider>
                    <Input fluid 
                    onChange={e => {
                        const tmp = e.currentTarget.value;
                        this.setState({addExamType: update(addExamType, {rawSubjectIds: {$set: tmp}})});
                    }}
                    value={addExamType.rawSubjectIds} label='编辑'/>
                    <Divider horizontal>操作</Divider>
                    <Button positive animated='vertical' fluid
                        onClick={() => {this.putAddExamType()}}>
                        <Button.Content visible><Icon name='checkmark' /></Button.Content>
                        <Button.Content hidden>提交</Button.Content>
                    </Button>
                </span>
            );
        } else if (currentModal === 'editScore') {
            modalHeader = '编辑分数';
            modalContent = (
                <span>
                    <Table compact celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>科目ID</Table.HeaderCell>
                                <Table.HeaderCell>科目名称</Table.HeaderCell>
                                <Table.HeaderCell>科目类型</Table.HeaderCell>
                                <Table.HeaderCell>分数</Table.HeaderCell>
                                <Table.HeaderCell>缺考</Table.HeaderCell>
                                <Table.HeaderCell>操作</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {editScore && editScore.map((item, index) => <Table.Row key={item.subjectId}>
                                <Table.Cell>{item.subjectId}</Table.Cell>
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.type}</Table.Cell>
                                <Table.Cell><Input 
                                disabled={item.absent}
                                onChange={e => {this.setState({editScore: update(editScore, {[index]: {score: {$set: e.currentTarget.value}}})})}}
                                value={item.score} /></Table.Cell>
                                <Table.Cell collapsing><Radio slider 
                                onChange={e => {this.setState({editScore: update(editScore, {[index]: {absent: {$set: !item.absent}}})})}}
                                checked={item.absent}/></Table.Cell>
                                <Table.Cell collapsing>
                                    <Button positive animated='vertical' size='mini'
                                    onClick={() => {this.postEditScore(item)}}>
                                        <Button.Content visible><Icon name='checkmark' /></Button.Content>
                                        <Button.Content hidden>提交</Button.Content>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>)}                                 
                        </Table.Body>
                    </Table>
                    <Divider horizontal>加分</Divider>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label>加分</label>
                                <Input
                                    onChange={e => {this.setState({editBonus: update(editBonus, {score: {$set: e.currentTarget.value}})})}}
                                    value={editBonus.score} />
                            </Form.Field>
                            <Form.Field>
                                <label>说明</label>
                                <Input
                                    onChange={e => {this.setState({editBonus: update(editBonus, {description: {$set: e.currentTarget.value}})})}}
                                    value={editBonus.description} />
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <Button fluid positive animated='vertical'
                            onClick={e => {
                                e.preventDefault();
                                this.putEditBonus();
                            }}>
                                <Button.Content visible><Icon name='checkmark' /></Button.Content>
                                <Button.Content hidden>提交</Button.Content>
                            </Button>
                        </Form.Field>
                    </Form>
                </span>
            );
        }

        switch(activeItem) {
            case 0:
                content = (
                    <span>
                        <Button basic fluid size='big' animated='vertical'>
                            <Button.Content visible>
                                <Icon name='plus'/>
                            </Button.Content>
                            <Button.Content hidden
                            onClick={() => {this.showAddSubject()}}>
                                添加科目
                            </Button.Content>
                        </Button>
                        <Table compact celled selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>名称</Table.HeaderCell>
                                    <Table.HeaderCell>类型</Table.HeaderCell>
                                    <Table.HeaderCell>操作</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {subjects && subjects.map(subject => <Table.Row key={subject.id}>
                                    <Table.Cell>{subject.id}</Table.Cell>
                                    <Table.Cell>{subject.name}</Table.Cell>
                                    <Table.Cell>{subject.type}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button positive animated='vertical' size='mini'
                                        onClick={() => {this.showEditSubject(subject)}}>
                                            <Button.Content visible><Icon name='edit' /></Button.Content>
                                            <Button.Content hidden>修改</Button.Content>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>)}                                
                            </Table.Body>
                        </Table>
                    </span>
                ); break;
            case 1:
                content = (
                    <span>
                        <Button basic fluid size='big' animated='vertical'
                        onClick={() => {this.showAddExamSpot()}}>
                            <Button.Content visible>
                                <Icon name='plus'/>
                            </Button.Content>
                            <Button.Content hidden>
                                添加考点
                            </Button.Content>
                        </Button>
                        <Table compact celled selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>省</Table.HeaderCell>
                                    <Table.HeaderCell>市</Table.HeaderCell>
                                    <Table.HeaderCell>校园</Table.HeaderCell>
                                    <Table.HeaderCell>具体位置</Table.HeaderCell>
                                    <Table.HeaderCell>人数</Table.HeaderCell>
                                    <Table.HeaderCell>考试类型</Table.HeaderCell>
                                    <Table.HeaderCell>操作</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {examSpots && examSpots.map(spot => <Table.Row key={spot.id}>
                                    <Table.Cell>{spot.id}</Table.Cell>
                                    <Table.Cell>{spot.province}</Table.Cell>
                                    <Table.Cell>{spot.city}</Table.Cell>
                                    <Table.Cell>{spot.campus}</Table.Cell>
                                    <Table.Cell>{spot.description}</Table.Cell>
                                    <Table.Cell>{spot.capacity}</Table.Cell>
                                    <Table.Cell>{spot.type_info.name}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button positive animated='vertical' size='mini'
                                        onClick={() => {this.showEditExamSpot(spot)}}>
                                            <Button.Content visible><Icon name='edit' /></Button.Content>
                                            <Button.Content hidden>修改</Button.Content>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>)}                                
                            </Table.Body>
                        </Table>
                    </span>
                ); break;
            case 2:
                content = (
                    <span>
                        <Button basic fluid size='big' animated='vertical'
                        onClick={() => {this.showAddExamType()}}>
                            <Button.Content visible>
                                <Icon name='plus'/>
                            </Button.Content>
                            <Button.Content hidden>
                                添加考试类型
                            </Button.Content>
                        </Button>
                        <Table compact celled selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>名称</Table.HeaderCell>
                                    <Table.HeaderCell>报名开始时间</Table.HeaderCell>
                                    <Table.HeaderCell>报名截止时间</Table.HeaderCell>
                                    <Table.HeaderCell>考试科目</Table.HeaderCell>
                                    <Table.HeaderCell>操作</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {examTypes && examTypes.map(type => <Table.Row key={type.id}>
                                    <Table.Cell>{type.id}</Table.Cell>
                                    <Table.Cell>{type.name}</Table.Cell>
                                    <Table.Cell>{type.startFrom}</Table.Cell>
                                    <Table.Cell>{type.endAt}</Table.Cell>
                                    <Table.Cell>{type.subjects.reduce((a, b) => `${b.name} | ${a}`, '')}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button positive animated='vertical' size='mini'
                                        onClick={() => {this.showEditExamType(type)}}>
                                            <Button.Content visible><Icon name='edit' /></Button.Content>
                                            <Button.Content hidden>修改</Button.Content>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>)}                                
                            </Table.Body>
                        </Table>
                    </span>
                ); break;
            case 3:
                content = (
                    <span>
                        <Table compact celled selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>姓名</Table.HeaderCell>
                                    <Table.HeaderCell>性别</Table.HeaderCell>
                                    <Table.HeaderCell>生源地</Table.HeaderCell>
                                    <Table.HeaderCell>毕业学校</Table.HeaderCell>
                                    <Table.HeaderCell>类型</Table.HeaderCell>
                                    <Table.HeaderCell>操作</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {entryInfos && entryInfos.map(info => <Table.Row key={info.id}>
                                    <Table.Cell>{info.id}</Table.Cell>
                                    <Table.Cell>{info.name}</Table.Cell>
                                    <Table.Cell>{info.gender}</Table.Cell>
                                    <Table.Cell>{info.from}</Table.Cell>
                                    <Table.Cell>{info.graduatedFrom}</Table.Cell>
                                    <Table.Cell>{info.type_info.name}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button positive animated='vertical' size='mini'
                                        onClick={() => {this.postCheckEntryInfo(info)}}>
                                            <Button.Content visible><Icon name='checkmark' /></Button.Content>
                                            <Button.Content hidden>通过</Button.Content>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>)}                                
                            </Table.Body>
                        </Table>
                    </span>
                ); break;
            case 4:
                content = (
                    <span>
                        <Table compact celled selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>姓名</Table.HeaderCell>
                                    <Table.HeaderCell>性别</Table.HeaderCell>
                                    <Table.HeaderCell>生源地</Table.HeaderCell>
                                    <Table.HeaderCell>毕业学校</Table.HeaderCell>
                                    <Table.HeaderCell>类型</Table.HeaderCell>
                                    <Table.HeaderCell>操作</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {checkedEntryInfos && checkedEntryInfos.map(info => <Table.Row key={info.id}>
                                    <Table.Cell>{info.id}</Table.Cell>
                                    <Table.Cell>{info.name}</Table.Cell>
                                    <Table.Cell>{info.gender}</Table.Cell>
                                    <Table.Cell>{info.from}</Table.Cell>
                                    <Table.Cell>{info.graduatedFrom}</Table.Cell>
                                    <Table.Cell>{info.type_info.name}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button positive animated='vertical' size='mini'
                                        onClick={() => {this.showEditScore(info)}}>
                                            <Button.Content visible><Icon name='write' /></Button.Content>
                                            <Button.Content hidden>录入/修改</Button.Content>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>)}                                
                            </Table.Body>
                        </Table>
                    </span>
                ); break;
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
                    <Menu tabular>
                        <Menu.Item
                            name='管理考试科目'
                            id={0}
                            active={activeItem === 0}
                            onClick={this.handleItemClick}/>
                        <Menu.Item
                            name='管理考点'
                            id={1}
                            active={activeItem === 1}
                            onClick={this.handleItemClick}/>
                        <Menu.Item
                            name='管理考试类型'
                            id={2}
                            active={activeItem === 2}
                            onClick={this.handleItemClick}/>
                        <Menu.Item
                            name='确认报名信息'
                            id={3}
                            active={activeItem === 3}
                            onClick={this.handleItemClick}/>
                        <Menu.Item
                            name='管理成绩'
                            id={4}
                            active={activeItem === 4}
                            onClick={this.handleItemClick}/>
                    </Menu>
                    <div style={{
                        padding: 20
                    }}>
                        <Modal open={modalOpen} onClose={() => {this.setState({modalOpen: false})}}>
                            <Modal.Header>{modalHeader}</Modal.Header>
                            <Modal.Content>{modalContent}</Modal.Content>
                        </Modal>
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}