import React, {Component} from 'react';
import {Button, Card, Form, Input, Typography} from "antd";
import './Login.css'
import request from "../common/request";
import {withRouter} from "react-router-dom";
import {LockOutlined, UserOutlined} from '@ant-design/icons';

const {Title} = Typography;

class LoginForm extends Component {

    formRef = React.createRef();

    state = {
        inLogin: false,
        height: window.innerHeight,
        width: window.innerWidth
    };

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                height: window.innerHeight,
                width: window.innerWidth
            })
        });
    }

    handleSubmit = async params => {
        this.setState({
            inLogin: true
        });

        try {
            let result = await request.post('/login', params);
            // 跳转登录
            localStorage.setItem('X-Auth-Token', result['token']);
            // this.props.history.push();
            window.location.href = "/"
        } finally {
            this.setState({
                inLogin: false
            });
        }
    };

    render() {
        return (
            <div className='login-bg'
                 style={{width: this.state.width, height: this.state.height, backgroundColor: '#F0F2F5'}}>
                <Card className='login-card' title={null}>
                    <div style={{textAlign: "center", margin: '15px auto 30px auto', color: '#1890ff'}}>
                        <Title level={1}>Kafka Map</Title>
                    </div>
                    <Form onFinish={this.handleSubmit} className="login-form">
                        <Form.Item name='username' rules={[{required: true, message: '请输入登录账号！'}]}>
                            <Input prefix={<UserOutlined/>} placeholder="登录账号"/>
                        </Form.Item>
                        <Form.Item name='password' rules={[{required: true, message: '请输入登录密码！'}]}>
                            <Input.Password prefix={<LockOutlined/>} placeholder="登录密码"/>
                        </Form.Item>
                        {/*<Form.Item name='remember' valuePropName='checked' initialValue={false}>*/}
                        {/*    <Checkbox>记住登录</Checkbox>*/}
                        {/*</Form.Item>*/}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button"
                                    loading={this.state.inLogin}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>

        );
    }
}

export default withRouter(LoginForm);