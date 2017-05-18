import React from 'react';
import {
    Table,
    Card,
    Icon,
    Button,
    Input
} from 'semantic-ui-react';

function timeoutPromise(timeout, err, promise) {
    return new Promise((resolve, reject) => {
        promise.then(resolve, reject);
        setTimeout(reject.bind(null, err), timeout);
    });
}

export default class EntryInfoForm extends React.Component {

    constructor(props) {
        super(props);
        const {typeId, typeName, name, gender, from, graduatedFrom, studentId} = props;
        this.state = {typeId, typeName, name, gender, from, graduatedFrom, studentId};
    }

    submitEntryInfo() {
        timeoutPromise(5000, '请求超时', fetch('/entry_info', {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(this.state),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok) {
                window.location.reload();
            }
        }, info => {
            
        });
    }

    render() {
        const {typeId, typeName, name, gender, from, graduatedFrom, studentId} = this.state;
        return (
            <Card fluid>
                <Card.Content>
                    <Card.Header>
                        提交/修改报名信息
                    </Card.Header>
                    <Table celled striped>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='file'/>
                                    报考类型
                                </Table.Cell>
                                <Table.Cell><Input fluid 
                                onChange={e => {this.setState({typeId: e.target.value})}}
                                value={typeId}/></Table.Cell>
                            </Table.Row>
                            
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='user'/>
                                    姓名
                                </Table.Cell>
                                <Table.Cell><Input fluid 
                                onChange={e => {this.setState({name: e.target.value})}}
                                value={name}/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='man'/>
                                    性别
                                </Table.Cell>
                                <Table.Cell><Input fluid 
                                onChange={e => {this.setState({gender: e.target.value})}}
                                value={gender}/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='point'/>
                                    生源地
                                </Table.Cell>
                                <Table.Cell><Input fluid 
                                onChange={e => {this.setState({from: e.target.value})}}
                                value={from}/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name='university'/>
                                    毕业学校
                                </Table.Cell>
                                <Table.Cell><Input fluid 
                                onChange={e => {this.setState({graduatedFrom: e.target.value})}}
                                value={graduatedFrom}/></Table.Cell>
                            </Table.Row>

                        </Table.Body>
                    </Table>
                </Card.Content>
                <Button.Group fluid>
                    <Button positive
                    onClick={this.submitEntryInfo.bind(this)}>确认</Button>
                    <Button.Or/>
                    <Button>清空</Button>
                </Button.Group>
            </Card>
        );
    }
}