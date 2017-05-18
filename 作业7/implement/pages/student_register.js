import React from 'react';
import Head from 'next/head';
import {
    Card,
    Icon,
    Image,
    Form,
    Button,
    Checkbox,
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

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            gender: 'male',
            password: '',
            repeatPassword: '',
            from: '',
            graduatedFrom: ''
        };
    
    }

    submitLogin(isAdmin) {
        this.setState({submitted: true});
        timeoutPromise(5000, '请求超时', fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            body: {
                id: this.state.id,
                password: this.state.password
            },
            mode: 'no-cors'
        })).then(res => {
            console.log(res);
            this.setState({submitted: false});
        }, info => {
            console.log(info);
            this.setState({submitted: false});
        });
    }

    render() {
        const dateString = new Date().toLocaleDateString();
        return (
            <div style={{
                padding: 20
            }}>
                <Card
                    centered
                    style={{
                    width: 800,
                    padding: 10
                }}>
                    <h1 style={{
                        margin: '5px auto'
                    }}>自主招生报名系统</h1>
                    <h3
                        style={{
                        margin: '8px auto',
                        color: 'grey'
                    }}>学生账户注册</h3>
                    <Card.Content>
                        <Form loading={this.state.submitted}>
                            <Form.Field>
                                <label>姓名</label>
                                <input
                                    placeholder='请输入您的真实姓名'
                                    onChange={event => {
                                    this.setState({id: event.target.value});
                                }}/>
                            </Form.Field>
                            <Form.Field>
                                <label>性别</label>
                                <Radio
                                    label='男'
                                    name='genderPicker'
                                    value='male'
                                    checked={this.state.gender === 'male'}
                                    onChange={(e, {value}) => this.setState({gender: value})}
                                    style={{paddingRight: 50}}/>
                                <Radio
                                    label='女'
                                    name='genderPicker'
                                    value='female'
                                    checked={this.state.gender === 'female'}
                                    onChange={(e, {value}) => this.setState({gender: value})}/>
                            </Form.Field>
                            <Form.Field>
                                <label>密码</label>
                                <input 
                                    type='password'
                                    placeholder='请输入您的密码'
                                    onChange={event => {
                                    this.setState({password: event.target.value});
                                }}/>
                            </Form.Field>
                            <Form.Field>
                                <label>重复密码</label>
                                <input
                                    type='password'
                                    placeholder='请再次输入您的密码'
                                    onChange={event => {
                                    this.setState({repeatPassword: event.target.value});
                                }}/>
                            </Form.Field>
                            <Form.Field>
                                <label>生源地</label>
                                <input
                                    placeholder='请输入您的生源地'
                                    onChange={event => {
                                    this.setState({from: event.target.value});
                                }}/>
                            </Form.Field>
                            <Form.Field>
                                <label>毕业学校</label>
                                <input
                                    placeholder='请输入您的毕业学校'
                                    onChange={event => {
                                    this.setState({graduatedFrom: event.target.value});
                                }}/>
                            </Form.Field>
                            <Divider horizontal>完成</Divider>
                            <Form.Field>
                                <Button fluid positive>注册学生账户</Button>
                            </Form.Field>
                        </Form>
                    </Card.Content>
                    <Card.Content
                        extra
                        style={{
                        textAlign: 'right'
                    }}>
                        <a>
                            <Icon name='time'/> {dateString}
                        </a>
                    </Card.Content>
                </Card>
            </div>
        );
    }
}
