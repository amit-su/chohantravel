import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Spin, message, Space, Result, Divider, Tag } from 'antd';
import { WhatsAppOutlined, LogoutOutlined, SyncOutlined, CheckCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

const { Title, Text, Paragraph } = Typography;

const WhatsAppConfig = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_APP_API;

    const fetchStatus = async () => {
        try {
            const response = await axios.get(`${apiUrl}/whatsapp/status`);
            setStatus(response.data.data);
        } catch (error) {
            console.error("Failed to fetch WhatsApp status:", error);
            // message.error("Failed to load WhatsApp status");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setActionLoading(true);
        try {
            await axios.post(`${apiUrl}/whatsapp/initialize`);
            message.info("WhatsApp re-initialization started...");
            fetchStatus();
        } catch (error) {
            message.error("Failed to re-initialize WhatsApp");
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Poll status every 5 seconds to catch QR updates or ready state
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        setActionLoading(true);
        try {
            await axios.post(`${apiUrl}/whatsapp/logout`);
            message.success("Logged out successfully");
            fetchStatus();
        } catch (error) {
            message.error("Failed to logout");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && !status) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading WhatsApp Settings..." />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
            <Card 
                className="w-full shadow-lg border-0 rounded-2xl overflow-hidden"
                title={
                    <Space>
                        <WhatsAppOutlined style={{ color: '#25D366', fontSize: '24px' }} />
                        <span className="text-xl font-bold">WhatsApp Configuration</span>
                    </Space>
                }
            >
                {!status?.isReady ? (
                    <div className="text-center py-8">
                        {!status.isReady && (
                            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                                {status.isAuthenticated ? (
                                    <>
                                        <Title level={4} style={{ color: '#1890ff' }}>Connecting...</Title>
                                        <Paragraph>
                                            WhatsApp is authenticated but still initializing chats. Please wait...
                                        </Paragraph>
                                        <Spin size="large" />
                                        <Text type="secondary" className="block mt-2">
                                            Taking too long? You can logout and try scanning again.
                                        </Text>
                                        <Button 
                                            danger 
                                            icon={<LogoutOutlined />} 
                                            onClick={handleLogout}
                                            loading={actionLoading}
                                            className="mt-4"
                                        >
                                            Force Logout & Reset
                                        </Button>
                                    </>
                                ) : status.lastQr ? (
                                    <>
                                        <Title level={4}>Scan to Connect</Title>
                                        <Paragraph>
                                            Please scan the QR code using your WhatsApp mobile app
                                        </Paragraph>
                                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <QRCodeCanvas value={status.lastQr} size={256} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Title level={4}>Disconnected</Title>
                                        <Paragraph>
                                            {status.isInitializing ? "Generating QR code..." : "WhatsApp is not connected."}
                                        </Paragraph>
                                        <Spin size="large" />
                                        <Button 
                                            className="mt-4" 
                                            icon={<SyncOutlined />} 
                                            onClick={handleRefresh}
                                            loading={actionLoading}
                                        >
                                            {status.isInitializing ? "Starting..." : "Start Service / Refresh"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <Result
                        status="success"
                        icon={<CheckCircleFilled style={{ color: '#25D366' }} />}
                        title="WhatsApp is Connected"
                        subTitle={
                            <div className="flex flex-col items-center gap-2">
                                <Text className="text-lg">Your account is linked and ready to send messages.</Text>
                                {status.user && (
                                    <Tag color="blue" className="text-base px-4 py-1 rounded-full border-0 shadow-sm">
                                        Active: <b>{status.user.name || "WhatsApp User"}</b> ({status.user.number})
                                    </Tag>
                                )}
                            </div>
                        }
                        extra={[
                            <Button 
                                danger 
                                icon={<LogoutOutlined />} 
                                loading={actionLoading}
                                onClick={handleLogout}
                                key="logout"
                                size="large"
                            >
                                Logout WhatsApp
                            </Button>
                        ]}
                    />
                )}

                <Divider />

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Title level={5}>Connection Status</Title>
                    <Space direction="vertical" className="w-full">
                        <div className="flex justify-between items-center">
                            <Text>Service Initialization:</Text>
                            <Tag color={status?.clientInitialized ? "green" : "red"}>
                                {status?.clientInitialized ? "Active" : "Inactive"}
                            </Tag>
                        </div>
                        <div className="flex justify-between items-center">
                            <Text>Authentication:</Text>
                            <Tag color={status?.isReady ? "green" : "orange"}>
                                {status?.isReady ? "Connected" : "Waiting for Login"}
                            </Tag>
                        </div>
                    </Space>
                </div>
            </Card>
        </div>
    );
};

export default WhatsAppConfig;
