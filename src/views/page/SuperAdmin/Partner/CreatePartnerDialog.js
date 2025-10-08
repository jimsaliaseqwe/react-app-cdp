import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useState } from "react";

const RequiredLabel = ({ htmlFor, label }) => {
    return (
        <label htmlFor={htmlFor}>{label} <span className="text-red-500">(*)</span></label>
    );
};

const CreatePartnerDialog = ({ visible, onHide, newPartner, setNewPartner, loading, onSubmit }) => {
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (visible) {
            setValidationErrors({});
        }
    }, [visible]);

    const validateEmail = (email) => {
        if (!email) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone) => {
        if (!phone) return true;
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
        return phoneRegex.test(phone);
    };

    const validateUsername = (username) => {
        if (!username) return false;
        return username.length >= 3;
    };

    const validatePassword = (password) => {
        if (!password) return false;
        return password.length >= 6;
    };

    const validateName = (name) => {
        if (!name) return false;
        return name.trim().length >= 2;
    };

    const validateField = useCallback((fieldName, value) => {
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'username':
                isValid = validateUsername(value);
                errorMessage = isValid ? '' : 'Tên đăng nhập phải có ít nhất 3 ký tự';
                break;
            case 'password':
                isValid = validatePassword(value);
                errorMessage = isValid ? '' : 'Mật khẩu phải có ít nhất 6 ký tự';
                break;
            case 'name':
                isValid = validateName(value);
                errorMessage = isValid ? '' : 'Tên Partner phải có ít nhất 2 ký tự';
                break;
            case 'email':
                isValid = validateEmail(value);
                errorMessage = isValid ? '' : 'Email không hợp lệ';
                break;
            case 'contactPhone':
                isValid = validatePhoneNumber(value);
                errorMessage = isValid ? '' : 'Số điện thoại không hợp lệ';
                break;
            default:
                break;
        }

        setValidationErrors(prev => ({
            ...prev,
            [fieldName]: { isValid, errorMessage }
        }));

        return isValid;
    }, []);

    const isFormValid = useCallback(() => {
        const requiredFields = ['username', 'password', 'name', 'email', 'contactPhone'];
        return requiredFields.every(field => {
            const value = newPartner[field];
            if (!value) return false;
            
            switch (field) {
                case 'username':
                    return validateUsername(value);
                case 'password':
                    return validatePassword(value);
                case 'name':
                    return validateName(value);
                case 'email':
                    return validateEmail(value);
                case 'contactPhone':
                    return validatePhoneNumber(value);
                default:
                    return true;
            }
        });
    }, [newPartner]);

    const handleFieldChange = useCallback((field, value) => {
        setNewPartner(prev => ({ ...prev, [field]: value }));
        validateField(field, value);
    }, [validateField, setNewPartner]);
    
    return (
        <Dialog
            header={
                <div className="flex align-items-center gap-2">
                    <i className="pi pi-user-plus text-primary"></i>
                    <span className="text-xl font-semibold">Tạo Partner mới</span>
                </div>
            }
            visible={visible}
            onHide={onHide}
            style={{ width: '60vw', maxWidth: '800px' }}
        >
            <form onSubmit={onSubmit} className="p-fluid">
                <div className="grid">
                    <div className="col-12">
                        <Card
                            title={
                                <div className="flex align-items-center gap-2">
                                    <span>Thông tin đăng nhập</span>
                                </div>
                            }
                            className="mb-3"
                        >
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <FloatLabel className="mt-2">
                                        <InputText
                                            id="username"
                                            value={newPartner.username}
                                            required
                                            className={`w-full ${validationErrors.username && !validationErrors.username.isValid ? 'p-invalid' : ''}`}
                                            onChange={(e) => handleFieldChange('username', e.target.value)}
                                        />
                                        <RequiredLabel htmlFor="username" label="Tên đăng nhập" />
                                    </FloatLabel>
                                    {validationErrors.username && !validationErrors.username.isValid && (
                                        <small className="p-error">{validationErrors.username.errorMessage}</small>
                                    )}
                                </div>
                                <div className="col-12 md:col-6">
                                    <FloatLabel className="mt-2">
                                        <InputText
                                            id="password"
                                            value={newPartner.password}
                                            required
                                            type="password"
                                            className={`w-full ${validationErrors.password && !validationErrors.password.isValid ? 'p-invalid' : ''}`}
                                            onChange={(e) => handleFieldChange('password', e.target.value)}
                                        />
                                        <RequiredLabel htmlFor="password" label="Mật khẩu" />
                                    </FloatLabel>
                                    {validationErrors.password && !validationErrors.password.isValid && (
                                        <small className="p-error">{validationErrors.password.errorMessage}</small>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="col-12">
                        <Card
                            title={
                                <div className="flex align-items-center gap-2">
                                    <span>Thông tin Partner</span>
                                </div>
                            }
                            className="mb-3"
                        >
                            <div className="grid">
                                <div className="col-12">
                                    <FloatLabel className="mt-4">
                                        <InputText
                                            id="name"
                                            value={newPartner.name}
                                            required
                                            className={`w-full ${validationErrors.name && !validationErrors.name.isValid ? 'p-invalid' : ''}`}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                        />
                                        <RequiredLabel htmlFor="name" label="Tên Partner" />
                                    </FloatLabel>
                                    {validationErrors.name && !validationErrors.name.isValid && (
                                        <small className="p-error">{validationErrors.name.errorMessage}</small>
                                    )}
                                </div>
                                <div className="col-12 md:col-6">
                                    <FloatLabel className="mt-4">
                                        <InputText
                                            id="email"
                                            value={newPartner.email}
                                            required
                                            type="email"
                                            className={`w-full ${validationErrors.email && !validationErrors.email.isValid ? 'p-invalid' : ''}`}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                        />
                                        <RequiredLabel htmlFor="email" label="Email" />
                                    </FloatLabel>
                                    {validationErrors.email && !validationErrors.email.isValid && (
                                        <small className="p-error">{validationErrors.email.errorMessage}</small>
                                    )}
                                </div>
                                <div className="col-12 md:col-6">
                                    <FloatLabel className="mt-4">
                                        <InputText
                                            id="contactPhone"
                                            value={newPartner.contactPhone}
                                            required
                                            className={`w-full ${validationErrors.contactPhone && !validationErrors.contactPhone.isValid ? 'p-invalid' : ''}`}
                                            onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                                        />
                                        <RequiredLabel htmlFor="contactPhone" label="Số điện thoại" />
                                    </FloatLabel>
                                    {validationErrors.contactPhone && !validationErrors.contactPhone.isValid && (
                                        <small className="p-error">{validationErrors.contactPhone.errorMessage}</small>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <Divider />

                <div className="flex justify-content-center gap-2 mt-4">
                    <Button
                        loading={loading}
                        type='submit'
                        label='Tạo Partner'
                        className="p-button-success w-2"
                        onClick={onSubmit}
                        disabled={!isFormValid()}
                    />
                </div>
            </form>
        </Dialog>
    );
};

export default CreatePartnerDialog;
