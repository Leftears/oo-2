import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    Card,
    Icon,
    Image,
    Form,
    Button,
    Checkbox,
    Divider
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
            id: '',
            password: '',
            submitted: false
        };
    }

    submitLogin(isAdmin) {
        this.setState({submitted: true});
        timeoutPromise(5000, '请求超时', fetch('/login', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                id: this.state.id,
                password: this.state.password,
                authorization: isAdmin ? 'admin' : 'student'
            }),
            headers: {'Content-Type': 'application/json'}
        })).then(res => {
            if (res.ok)
                window.location.href = isAdmin ? '/admin_main' : '/student_main';
            else
                this.setState({submitted: false});
        }, info => {
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
                    }}>账户登录</h3>
                    <Card.Content>
                        <Form loading={this.state.submitted}>
                            <Form.Field>
                                <label>ID</label>
                                <input
                                    placeholder='请输入您的ID'
                                    onChange={event => {
                                    this.setState({id: event.target.value});
                                }}/>
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
                                <Checkbox label='保持登录状态'/>
                            </Form.Field>
                            <Form.Field>
                                <Button.Group fluid>
                                    <Button
                                        positive
                                        onClick={e => {
                                        e.preventDefault();
                                        this.submitLogin(false);
                                    }}>学生登录</Button>
                                    <Button.Or text='or'/>
                                    <Button
                                        onClick={e => {
                                        e.preventDefault();
                                        this.submitLogin(true);
                                    }}>考务登录</Button>
                                </Button.Group>
                                <Divider horizontal>或者</Divider>
                                <Link prefetch href='/student_register'>
                                    <a>
                                        <Button primary fluid>注册学生账户</Button>
                                    </a>
                                </Link>
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
