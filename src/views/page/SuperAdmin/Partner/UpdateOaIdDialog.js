import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useCallback, useEffect, useState } from "react";

const RequiredLabel = ({ htmlFor, label }) => {
    return (
        <label htmlFor={htmlFor}>{label} <span className="text-red-500">(*)</span></label>
    );
};

const UpdateOaIdDialog = ({ visible, onHide, updatingOaId, setUpdatingOaId, loading, onSubmit }) => {
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (visible) {
            setValidationErrors({});
        }
    }, [visible]);

    const validateOaId = (oaId) => {
        if (!oaId) return false;
        return oaId.trim().length >= 1;
    };

    const validateField = useCallback((fieldName, value) => {
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'oaId':
                isValid = validateOaId(value);
                errorMessage = isValid ? '' : 'OA ID không được để trống';
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
        return validateOaId(updatingOaId.oaId);
    }, [updatingOaId]);

    const handleFieldChange = useCallback((field, value) => {
        setUpdatingOaId(prev => ({ ...prev, [field]: value }));
        validateField(field, value);
    }, [validateField, setUpdatingOaId]);

    return (
        <Dialog
            header={
                <div className="flex align-items-center gap-2">
                    <i className="pi pi-pencil text-primary"></i>
                    <span className="text-xl font-semibold">Cập nhật OA ID</span>
                </div>
            }
            visible={visible}
            onHide={onHide}
            style={{ width: '60vw', maxWidth: '800px' }}
        >
            <form onSubmit={onSubmit} className="p-fluid">
                <div className="grid p-4">
                    <div className="col-12">
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <FloatLabel className="mt-2">
                                    <InputText
                                        id="oaId"
                                        value={updatingOaId.oaId || ''}
                                        required
                                        className={`w-full ${validationErrors.oaId && !validationErrors.oaId.isValid ? 'p-invalid' : ''}`}
                                        onChange={(e) => handleFieldChange('oaId', e.target.value)}
                                    />
                                    <RequiredLabel htmlFor="oaId" label="OA ID" />
                                </FloatLabel>
                                {validationErrors.oaId && !validationErrors.oaId.isValid && (
                                    <small className="p-error">{validationErrors.oaId.errorMessage}</small>
                                )}
                            </div>
                            <div className="col-12">
                                <FloatLabel className="mt-4">
                                    <InputText
                                        id="name"
                                        value={updatingOaId.name}
                                        className="w-full"
                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                    />
                                    <label htmlFor="name">Tên</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12">
                                <FloatLabel className="mt-4">
                                    <InputTextarea
                                        id="description"
                                        value={updatingOaId.description}
                                        rows={4}
                                        className="w-full"
                                        onChange={(e) => handleFieldChange('description', e.target.value)}
                                    />
                                    <label htmlFor="description">Mô tả</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                <div className="flex justify-content-center gap-2 mt-4">
                    <Button
                        loading={loading}
                        type='submit'
                        label='Cập nhật OA ID'
                        className="p-button-success w-4"
                        onClick={onSubmit}
                        disabled={!isFormValid()}
                    />
                </div>
            </form>
        </Dialog>
    );
};

export default UpdateOaIdDialog;
