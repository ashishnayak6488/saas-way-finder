'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Lock, Mail, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { validateEmail, validatePassword, validateName } from '@/app/api/(auth)/validation/ValidationForm';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

const API_BASE_URL = 'http://127.0.0.1:8000';

function SettingsPage() {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailNotifications: false,
        twoFactor: false,
        pushNotifications: false,
        emailAlerts: false,
        profilePublic: false,
        activityStatus: false
    });

    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    useEffect(() => {
        // fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            setFormData(prev => ({
                ...prev,
                ...data
            }));
        } catch (error) {
            toast.error('Failed to fetch profile data');
        }
    };

    const validateForm = () => {
        const emailError = validateEmail(formData.email);
        if (emailError) {
            toast.error(emailError);
            return false;
        }

        const nameError = validateName(formData.firstName) || validateName(formData.lastName);
        if (nameError) {
            toast.error(nameError);
            return false;
        }

        if (formData.newPassword) {
            const passwordError = validatePassword(formData.newPassword);
            if (passwordError) {
                toast.error(passwordError);
                return false;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return false;
            }
        }

        toast.success('Validation successful');
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Updating settings...');

        try {
            if (!validateForm()) {
                toast.dismiss(loadingToast);
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/user/settings`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update settings');
            }

            toast.success('Settings updated successfully', { id: loadingToast });
        } catch (error) {
            toast.error(error.message || 'Failed to update settings', { id: loadingToast });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'phone' && value && !/^\d{0,10}$/.test(value)) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const clearForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            phone: '',
            email: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            emailNotifications: false,
            twoFactor: false,
            pushNotifications: false,
            emailAlerts: false,
            profilePublic: false,
            activityStatus: false
        });
    };

    return (
        <div className="min-h-screen bg-gray-0 p-2 rounded-lg">
            <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md border border-gray-300">
                    {/* Profile Section */}
                    <div className="p-4 border-b">
                        <div className="flex items-center mb-4">
                            <User className="text-gray-600 mr-2" />
                            <h2 className="text-xl font-semibold text-black">Profile Settings</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="firstName" value={formData.firstName} onChange={handleChange} label="First Name" type="text" placeholder="First Name" />
                            <Input name="lastName" value={formData.lastName} onChange={handleChange} label="Last Name" type="text" placeholder="Last Name" />
                            <Input name="username" value={formData.username} onChange={handleChange} label="Username" type="text" placeholder="Username" />
                            <Input name="phone" value={formData.phone} onChange={handleChange} label="Phone Number" type="tel" placeholder="Phone Number" maxLength={10} />
                            <Input name="email" value={formData.email} onChange={handleChange} label="Email" type="email" placeholder="Email" />
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="p-6 border-b">
                        <div className="flex items-center mb-4">
                            <Lock className="text-gray-600 mr-2" />
                            <h2 className="text-xl font-semibold text-black">Security</h2>
                        </div>
                        <div className="space-y-4">
                            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                                <div key={field} className="relative">
                                    <Input
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        label={field.replace(/([A-Z])/g, ' $1')}
                                        type={showPasswords[field] ? 'text' : 'password'}
                                        placeholder={field.replace(/([A-Z])/g, ' $1')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility(field)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mr-2 mt-2"
                                    >
                                        {showPasswords[field] ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
                            ))}
                            <div className="flex items-center">
                                <input type="checkbox" name="twoFactor" checked={formData.twoFactor} onChange={handleChange} id="twoFactor" className="mr-2" />
                                <label htmlFor="twoFactor" className="text-gray-600">Enable two-factor authentication</label>
                            </div>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="p-6 border-b">
                        <div className="flex items-center mb-4">
                            <Bell className="text-gray-600 mr-2" />
                            <h2 className="text-xl font-semibold text-black">Notification Preferences</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'pushNotifications', label: 'Push Notifications' },
                                { name: 'emailAlerts', label: 'Email Alerts' }
                            ].map(({ name, label }) => (
                                <div key={name} className="flex items-center">
                                    <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} id={name} className="mr-2" />
                                    <label htmlFor={name} className="text-gray-600">{label}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <Shield className="text-gray-600 mr-2" />
                            <h2 className="text-xl font-semibold text-black">Privacy</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'profilePublic', label: 'Make profile public' },
                                { name: 'activityStatus', label: 'Show activity status' }
                            ].map(({ name, label }) => (
                                <div key={name} className="flex items-center">
                                    <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} id={name} className="mr-2" />
                                    <label htmlFor={name} className="text-gray-600">{label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-between space-x-2">
                    <Button variant="secondary" className="w-1/2" onClick={clearForm}>Clear Form</Button>
                    <Button type="submit" variant="primary" className="w-1/2">Save Changes</Button>
                </div>
            </form>
        </div>
    );
}

export default SettingsPage;
