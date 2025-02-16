import React, { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './index.css'
import { useDispatch } from 'react-redux';
import { setLoginData } from '../../store/store';
import Register from '../register'
import ForgotPassword from '../forgotPassword'

const LoginBox = ({ switchComponent }) => {
    const [username, setUsername] = useState('');
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const [password, setPassword] = useState('');
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const dispatch = useDispatch();

    const submitLogin = async () => {
        try {
            // 调用 form.validateFields() 触发表单验证
            await form.validateFields();
            dispatch(setLoginData({ username, password }));
            message.success('校验通过，数据已存储')
        } catch (error) {
            console.log(error)
        }
    }

    return <div className='login_box'>
        <div style={{ 'fontSize': '28px', 'textAlign': 'center', 'marginTop': '60px' }}>登录</div>
        <div style={{ 'width': '280px', 'margin': '20px auto' }}>
            <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                <Form.Item name='usernmae' rules={[{
                    required: true,
                    message: '请输入用户名'
                },
                {
                    pattern: /^[a-zA-Z0-9]{1,6}$/,
                    message: '用户名不超过6位数,可以为数字，字母，特殊字符',
                }]} validateTrigger='onBlur'>
                    <Input value={username} onChange={handleUsernameChange} placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item name='password' rules={[{
                    required: true,
                    message: '请输入密码'
                },
                {
                    pattern: /\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&amp;*.? ])\S*/,
                    message: '密码最少6位，包含至少1个大写字母，1个小写字母，1个数字，1个特殊字符'
                }]} validateTrigger='onBlur'>
                    <Input.Password value={password} onChange={handlePasswordChange} placeholder="请输入密码" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                </Form.Item>
            </Form>
        </div>
        <div style={{ 'width': '280px', 'margin': '20px auto' }}>
            <Button type='primary' style={{ 'width': '280px' }} onClick={submitLogin}>登录</Button>
        </div>
        <div style={{ 'width': '280px', 'margin': '0 auto', 'display': 'flex', 'justifyContent': 'space-between' }}>
            <Button type="link" style={{ 'padding': '0' }} onClick={() => switchComponent(3)}>忘记密码</Button>
            <div>
                <span style={{ 'fontSize': '14px' }}>没有账号?</span>
                <Button type="link" style={{ 'padding': '0' }} onClick={() => switchComponent(2)}>快速注册</Button>
            </div>
        </div>
    </div>
}

export default function Login() {
    const [activeComponent, setActiveComponent] = useState(1); // 默认为第一个组件

    const switchComponent = (componentId) => {
        setActiveComponent(componentId); // 更新当前显示的组件
    };

    return <>
        {activeComponent == 1 && <LoginBox switchComponent={switchComponent}></LoginBox>}
        {activeComponent == 2 && <Register switchComponent={switchComponent}></Register>}
        {activeComponent == 3 && <ForgotPassword switchComponent={switchComponent}></ForgotPassword>}
    </>
}