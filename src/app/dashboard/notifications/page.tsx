'use client';

import { useState } from 'react';
import { Send, MessageSquare, CheckCircle, Clock, Search, Bell, Settings, BadgeAlert, Smartphone } from 'lucide-react';
import Link from 'next/link';

// Mock logs for frontend simulation
const initialLogs = [
    { id: 1, type: 'SMS', recipient: '+27 82 123 4567', message: 'Low stock alert: Paracetamol at Vuwani Clinic', status: 'Delivered', time: '10 mins ago' },
    { id: 2, type: 'WhatsApp', recipient: '+27 71 987 6543', message: 'Template: staff_allocation_update | Params: {"clinic": "Lusikisiki"}', status: 'Read', time: '25 mins ago' },
    { id: 3, type: 'SMS', recipient: '+27 83 555 1234', message: 'Mobile clinic route confirmed for Makhado', status: 'Delivered', time: '1 hour ago' },
];

export default function NotificationsPage() {
    const [logs, setLogs] = useState(initialLogs);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp'>('sms');
    const [sending, setSending] = useState(false);

    const handleSend = () => {
        if (!phoneNumber || !message) return;

        setSending(true);
        // Simulate API call
        setTimeout(() => {
            const newLog = {
                id: Date.now(),
                type: activeTab === 'sms' ? 'SMS' : 'WhatsApp',
                recipient: phoneNumber,
                message: activeTab === 'sms' ? message : `Template: ${message} (Simulated)`,
                status: 'Sent',
                time: 'Just now'
            };
            setLogs([newLog, ...logs]);
            setSending(false);
            setPhoneNumber('');
            setMessage('');
            alert(`${activeTab === 'sms' ? 'SMS' : 'WhatsApp'} sent successfully!`);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition">
                            <span className="text-2xl">←</span>
                            <span className="font-medium">Back to Dashboard</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100/50 rounded-xl flex items-center justify-center text-blue-600">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Notification Center</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Send Message Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-1 bg-gray-50 border-b border-gray-200 flex">
                                <button
                                    onClick={() => setActiveTab('sms')}
                                    className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'sms' ? 'bg-white text-black shadow-sm rounded-t-lg' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Smartphone className="w-4 h-4" />
                                    Send SMS
                                </button>
                                <button
                                    onClick={() => setActiveTab('whatsapp')}
                                    className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'whatsapp' ? 'bg-white text-black shadow-sm rounded-t-lg' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Send WhatsApp
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Number</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+27..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {activeTab === 'sms' ? 'Message Content' : 'Template ID'}
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={activeTab === 'sms' ? "Enter your urgent message..." : "e.g., stock_alert_v1"}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={sending}
                                    className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-white transition shadow-lg ${activeTab === 'sms' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                                        } ${sending ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {sending ? 'Sending...' : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            {activeTab === 'sms' ? 'Send SMS' : 'Send WhatsApp'}
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Simulates sending via {activeTab === 'sms' ? 'Twilio' : 'WhatsApp API'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <BadgeAlert className="w-4 h-4" />
                                Auto-Alerts Active
                            </h3>
                            <p className="text-sm text-blue-700">
                                System is automatically sending alerts for:
                            </p>
                            <ul className="list-disc list-inside text-sm text-blue-600 mt-1 ml-1">
                                <li>Critical Medicine Stockouts</li>
                                <li>Staff Shortage Warnings</li>
                            </ul>
                        </div>
                    </div>

                    {/* Logs Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900">Communication Logs</h2>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.type === 'SMS'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                        : 'bg-green-50 text-green-700 border-green-200'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                    {log.recipient}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                    {log.message}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        {log.status === 'Delivered' || log.status === 'Read' ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                        )}
                                                        <span className="text-sm text-gray-700">{log.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {log.time}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
