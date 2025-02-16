import React, { useState, useEffect } from 'react';
import './index.css';
import { Button, Input, Form, Space, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setRegisterData } from '../../store/store';

export default function Register({ switchComponent }) {
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    const validatePhoneNumber = (phone) => {
        return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/.test(phone); // 中国手机号验证
    };

    const [username, setUsername] = useState('');
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const [phone, setPhone] = useState('');
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        setIsPhoneValid(!validatePhoneNumber(e.target.value));
    };

    const [captcha, SetCaptcha] = useState('');
    const handleCaptchaChange = (e) => {
        SetCaptcha(e.target.value);
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

    // 发送验证码并启动倒计时
    const sendVerificationCode = () => {
        setCountdown(30); // 设置倒计时 30s
        setIsCounting(true); // 启动倒计时
        message.success('验证码已发送至 ' + phone);
    };

    const [countdown, setCountdown] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    // 倒计时逻辑
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer); // 清除定时器，防止内存泄漏
        } else {
            setIsCounting(false); // 倒计时结束，按钮恢复
        }
    }, [countdown]);

    const dispatch = useDispatch();

    const submitRegisterPassword = async () => {
        try {
            // 调用 form.validateFields() 触发表单验证
            await form.validateFields();
            dispatch(setRegisterData({ phone, username, captcha, password }));
            message.success('校验通过，数据已存储')
        } catch (error) {
            console.log(error)
        }
    }

    return <div className='register_box'>
        <div style={{ 'fontSize': '24px', 'textAlign': 'center', 'marginTop': '60px' }}>用户注册</div>
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
                <Form.Item name='phone' rules={[{
                    required: true,
                    message: '请输入手机号'
                },
                {
                    pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
                    message: '手机号非法',
                }]} validateTrigger='onBlur'>
                    <Input value={phone} onChange={handlePhoneChange} placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item name='captcha' rules={[{
                    required: true,
                    message: '请输入验证码'
                },
                {
                    pattern: /^\d{6}$/,
                    message: '验证码必须为6位数字'
                }]} validateTrigger='onBlur'>
                    <Space direction="horizontal">
                        <Input value={captcha} onChange={handleCaptchaChange} placeholder="请输入验证码" />
                        <Button type='primary' disabled={isPhoneValid || isCounting} onClick={sendVerificationCode}>{ isCounting ? `${countdown}s后重新获取` : "获取验证码" }</Button>
                    </Space>
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
        <div style={{ 'width': '280px', 'margin': '20px auto' }}><Button type='primary' style={{ 'width': '280px' }} onClick={submitRegisterPassword}>立刻注册</Button></div>
        <div style={{ 'width': '280px', 'margin': '0 auto', 'display': 'flex', 'justifyContent': 'space-between' }}>
            <Button type="link" style={{ 'padding': '0' }} onClick={() => switchComponent(3)}>忘记密码</Button>
            <div>
                <span style={{ 'fontSize': '14px' }}>已有账号?</span>
                <Button type="link" style={{ 'padding': '0' }} onClick={() => switchComponent(1)}>马上登录</Button>
            </div>
        </div>
    </div>;
}