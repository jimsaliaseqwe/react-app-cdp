import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useCallback, useState } from "react";
import FileUploadImage from "../../../Component/Widget/FileUploadImage";

const RequiredLabel = ({ htmlFor, label, required = true }) => {
    return (
        <label htmlFor={htmlFor}>{label} {required && <span className="text-red-500">(*)</span>}</label>
    );
};

const FloatLabelCustom = ({ htmlFor, label, children, required = false }) => {
    return (
        <FloatLabel htmlFor={htmlFor} className="mt-3">
            {children}
            <RequiredLabel htmlFor={htmlFor} label={label} required={required} />
        </FloatLabel>
    );
};

const InputTextCustom = ({ id, value, className, required = false, onChange}) => {
    const [isEditing, setIsEditing] = useState(false);
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };
    const handleChange = (e) => {
        if (e.target.value !== '' && !isEditing) {
            setIsEditing(true);
        }
        onChange(e);
    };
    return (
        <div className="flex align-items-center justify-content-between gap-2 w-full relative">
            <InputText
                id={id}
                value={value || ''}
                className={`w-full ${className || ''}`}
                style={ value ? { paddingRight: '25px' } : {}}
                onChange={handleChange}
                required={required}
                disabled={value && !isEditing}
            />
            {value && 
                <i 
                    className={`pi text-green-500 ${isEditing ? 'pi-check' : 'pi-pencil'} cursor-pointer`} 
                    style={{position: 'absolute', right: '10px'}}
                    onClick={handleEdit} 
                />
            }
        </div>
    );
};

const EditPartnerDialog = ({ visible, onHide, editingPartner, setEditingPartner, loading, onSubmit, originalPartner }) => {
    const [statusLoading, setStatusLoading] = useState(false);
    const [showStatusConfirm, setShowStatusConfirm] = useState(false);

    const togglePartnerStatus = useCallback(() => {
        setShowStatusConfirm(true);
    }, []);

    const handleLogoChange = useCallback((url) => {
        setEditingPartner({ ...editingPartner, companyLogo: url });
    }, [editingPartner, setEditingPartner]);

    const handleBannerChange = useCallback((url) => {
        setEditingPartner({ ...editingPartner, banner: url });
    }, [editingPartner, setEditingPartner]);

    const confirmStatusChange = useCallback(async () => {
        setStatusLoading(true);
        try {
            const newStatus = editingPartner.status === 1 ? 0 : 1;
            setEditingPartner({ ...editingPartner, status: newStatus });
        } catch (error) {
            console.error('Error toggling partner status:', error);
        } finally {
            setStatusLoading(false);
            setShowStatusConfirm(false);
        }
    }, [editingPartner, setEditingPartner]);

    const hasChanges = useCallback(() => {
        if (!originalPartner) return true;

        const fieldsToCompare = [
            'id', 'name', 'contactName', 'contactPhone', 'contactEmail',
            'companyName', 'companyAddress', 'companyLogo', 'status',
            'cdpAccessToken', 'cdpRefreshToken', 'cdpAppId', 'cdpAppSecretKey',
            'partnerAppId', 'partnerAppSecretKey', 'oaId', 'miniGameUrl', 'banner', 'miniAppLoyalty'
        ];

        return fieldsToCompare.some(field => {
            const originalValue = originalPartner[field] || '';
            const currentValue = editingPartner[field] || '';
            return originalValue !== currentValue;
        });
    }, [originalPartner, editingPartner]);

    const validatePhoneNumber = (phone) => {
        if (!phone) return true;
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email) => {
        if (!email) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateLogoUrl = (url) => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const getValidationErrors = () => {
        const errors = [];

        // Required field validations
        if (!editingPartner.name || editingPartner.name.trim() === '') {
            errors.push('Tên Partner là bắt buộc');
        }

        if (!editingPartner.contactName || editingPartner.contactName.trim() === '') {
            errors.push('Họ và tên là bắt buộc');
        }

        if (!editingPartner.contactEmail || editingPartner.contactEmail.trim() === '') {
            errors.push('Email là bắt buộc');
        }

        if (!editingPartner.contactPhone || editingPartner.contactPhone.trim() === '') {
            errors.push('Số điện thoại là bắt buộc');
        }

        // Format validations
        if (editingPartner.contactPhone && !validatePhoneNumber(editingPartner.contactPhone)) {
            errors.push('Số điện thoại không hợp lệ');
        }

        if (editingPartner.contactEmail && !validateEmail(editingPartner.contactEmail)) {
            errors.push('Email không hợp lệ');
        }

        if (editingPartner.companyLogo && !validateLogoUrl(editingPartner.companyLogo)) {
            errors.push('URL logo không hợp lệ');
        }

        if (editingPartner.miniGameUrl && !validateLogoUrl(editingPartner.miniGameUrl)) {
            errors.push('URL mini game không hợp lệ');
        }

        return errors;
    };

    const isFormValid = () => {
        return getValidationErrors().length === 0;
    };

    const headerContent = (
        <div className="flex justify-content-between align-items-center w-full border-bottom-1 border-200 pb-4">
            <div className="flex align-items-center gap-2">
                <i className="pi pi-pencil text-primary"></i>
                <span className="text-xl font-semibold">Chỉnh sửa Partner</span>
            </div>
            <div className="flex align-items-center gap-2">
                <Button
                    label={editingPartner.status === 1 ? "Hủy kích hoạt" : "Kích hoạt"}
                    icon={editingPartner.status === 1 ? "pi pi-pause" : "pi pi-play"}
                    severity={editingPartner.status === 1 ? "warning" : "success"}
                    size="small"
                    loading={statusLoading}
                    onClick={togglePartnerStatus}
                    className="text-sm"
                />
            </div>
        </div>
    );

    const footerContent = (
        <div className="flex justify-content-end gap-2 pt-3 border-top-1 border-200 pt-2">
            <Button
                type="button"
                label="Hủy"
                icon="pi pi-times"
                severity="secondary"
                onClick={onHide}
                size="small"
                outlined
            />
            <Button
                loading={loading}
                icon="pi pi-save"
                type="submit"
                label="Cập nhật"
                size="small"
                className="p-button-success"
                onClick={onSubmit}
                disabled={!hasChanges() || !isFormValid()}
            />
        </div>
    );

    const basicInfomations = (
        <div className="col-12">
            <Card className="mb-4">
                <div className="flex align-items-center gap-2 mb-4">
                    <i className="pi pi-info-circle text-primary"></i>
                    <h5 className="m-0 text-primary">Thông tin cơ bản</h5>
                </div>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <FloatLabelCustom htmlFor="editPartnerId" label="Partner ID" required={true}>
                            <InputText
                                id="editPartnerId"
                                value={editingPartner.id || ''}
                                required
                                disabled
                                className="w-full"
                                onChange={(e) => setEditingPartner({ ...editingPartner, id: e.target.value })}
                            />
                        </FloatLabelCustom>
                    </div>
                    <div className="col-12 md:col-6">
                        <FloatLabelCustom htmlFor="editName" label="Tên Partner" required={true}>
                            <InputText
                                id="editName"
                                value={editingPartner.name || ''}
                                required
                                className={`w-full ${(!editingPartner.name || editingPartner.name.trim() === '') ? 'p-invalid' : ''}`}
                                onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                            />
                        </FloatLabelCustom>
                        {(!editingPartner.name || editingPartner.name.trim() === '') && (
                            <small className="p-error">Tên Partner là bắt buộc</small>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );

    const contactInformation = (
        <div className="col-12">
            <Card className="mb-4">
                <div className="flex align-items-center gap-2 mb-4">
                    <i className="pi pi-user text-primary"></i>
                    <h5 className="m-0 text-primary">Thông tin liên hệ</h5>
                </div>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <FloatLabelCustom htmlFor="editContactName" label="Họ và tên" required={true}>
                            <InputText
                                id="editContactName"
                                value={editingPartner.contactName || ''}
                                required
                                className={`w-full ${(!editingPartner.contactName || editingPartner.contactName.trim() === '') ? 'p-invalid' : ''}`}
                                onChange={(e) => setEditingPartner({ ...editingPartner, contactName: e.target.value })}
                            />
                        </FloatLabelCustom>
                        {(!editingPartner.contactName || editingPartner.contactName.trim() === '') && (
                            <small className="p-error">Họ và tên là bắt buộc</small>
                        )}
                    </div>
                    <div className="col-12 md:col-6">
                        <FloatLabelCustom htmlFor="editContactPhone" label="Số điện thoại" required={true}>
                            <InputText
                                id="editContactPhone"
                                value={editingPartner.contactPhone || ''}
                                required
                                className={`w-full ${(!editingPartner.contactPhone || editingPartner.contactPhone.trim() === '') ? 'p-invalid' : ''} ${editingPartner.contactPhone && !validatePhoneNumber(editingPartner.contactPhone) ? 'p-invalid' : ''}`}
                                onChange={(e) => setEditingPartner({ ...editingPartner, contactPhone: e.target.value })}
                            />
                        </FloatLabelCustom>
                        {(!editingPartner.contactPhone || editingPartner.contactPhone.trim() === '') && (
                            <small className="p-error">Số điện thoại là bắt buộc</small>
                        )}
                        {editingPartner.contactPhone && !validatePhoneNumber(editingPartner.contactPhone) && (
                            <small className="p-error">Số điện thoại không hợp lệ</small>
                        )}
                    </div>
                    <div className="col-12">
                        <FloatLabelCustom htmlFor="editContactEmail" label="Email" required={true}>
                            <InputText
                                id="editContactEmail"
                                value={editingPartner.contactEmail || ''}
                                required
                                type="email"
                                className={`w-full ${(!editingPartner.contactEmail || editingPartner.contactEmail.trim() === '') ? 'p-invalid' : ''} ${editingPartner.contactEmail && !validateEmail(editingPartner.contactEmail) ? 'p-invalid' : ''}`}
                                onChange={(e) => setEditingPartner({ ...editingPartner, contactEmail: e.target.value })}
                            />
                        </FloatLabelCustom>
                        {(!editingPartner.contactEmail || editingPartner.contactEmail.trim() === '') && (
                            <small className="p-error">Email là bắt buộc</small>
                        )}
                        {editingPartner.contactEmail && !validateEmail(editingPartner.contactEmail) && (
                            <small className="p-error">Email không hợp lệ</small>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );

    const companyInformation = (
        <div className="col-12">
            <Card className="mb-4">
                <div className="flex align-items-center gap-2 mb-4">
                    <i className="pi pi-building text-primary"></i>
                    <h5 className="m-0 text-primary">Thông tin công ty</h5>
                </div>
                <div className="grid">
                    <div className="col-12">
                        <FloatLabelCustom htmlFor="editCompanyName" label="Tên công ty">
                            <InputText
                                id="editCompanyName"
                                value={editingPartner.companyName || ''}
                                className="w-full"
                                onChange={(e) => setEditingPartner({ ...editingPartner, companyName: e.target.value })}
                            />
                        </FloatLabelCustom>
                    </div>
                    <div className="col-12">
                        <FloatLabelCustom htmlFor="editCompanyAddress" label="Địa chỉ công ty">
                            <InputTextarea
                                id="editCompanyAddress"
                                value={editingPartner.companyAddress || ''}
                                className="w-full"
                                rows={3}
                                onChange={(e) => setEditingPartner({ ...editingPartner, companyAddress: e.target.value })}
                            />
                        </FloatLabelCustom>
                    </div>
                    <div className="col-12">
                        <Card className="p-3">
                            <div className="flex align-items-center gap-2 mb-3">
                                <i className="pi pi-image text-primary"></i>
                                <h6 className="m-0 text-primary">Logo công ty</h6>
                            </div>
                            <div className="grid">
                                <div className="col-12 md:col-4 m-auto">
                                    <FileUploadImage
                                        onChange={handleLogoChange}
                                        imageUrl={editingPartner.companyLogo || ''}
                                        emptyText="Tỉ lệ khuyến nghị: 1:1 (ví dụ: 200x200, 300x300...)"
                                    />
                                </div>
                                <div className="col-12">
                                    <div className="pl-3">
                                        <label className="text-sm font-medium text-600 mb-2 block">Hoặc nhập URL</label>
                                        <InputText
                                            id="editCompanyLogo"
                                            value={editingPartner.companyLogo || ''}
                                            placeholder="Nhập URL logo"
                                            className={`w-full ${editingPartner.companyLogo && !validateLogoUrl(editingPartner.companyLogo) ? 'p-invalid' : ''}`}
                                            onChange={(e) => setEditingPartner({ ...editingPartner, companyLogo: e.target.value })}
                                        />
                                        {editingPartner.companyLogo && !validateLogoUrl(editingPartner.companyLogo) && (
                                            <small className="p-error">URL logo không hợp lệ</small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12">
                        <Card className="p-3">
                            <div className="flex align-items-center gap-2 mb-3">
                                <i className="pi pi-images text-primary"></i>
                                <h6 className="m-0 text-primary">Banner</h6>
                            </div>
                            <div className="grid">
                                <div className="col-12 md:col-8 m-auto">
                                    <FileUploadImage
                                        onChange={handleBannerChange}
                                        imageUrl={editingPartner.banner || ''}
                                        emptyText="Tỉ lệ khuyến nghị: 2:1 hoặc 3:1 (ví dụ: 400x200, 600x200, 800x200...)"
                                    />
                                </div>
                                <div className="col-12">
                                    <div className="pl-3">
                                        <label className="text-sm font-medium text-600 mb-2 block">Hoặc nhập URL</label>
                                        <InputText
                                            id="editBanner"
                                            value={editingPartner.banner || ''}
                                            placeholder="Nhập URL banner"
                                            className={`w-full ${editingPartner.banner && !validateLogoUrl(editingPartner.banner) ? 'p-invalid' : ''}`}
                                            onChange={(e) => setEditingPartner({ ...editingPartner, banner: e.target.value })}
                                        />
                                        {editingPartner.banner && !validateLogoUrl(editingPartner.banner) && (
                                            <small className="p-error">URL banner không hợp lệ</small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    );

    const serviceInformation = (
        <div className="col-12">
            <Card className="mb-4">
                <div className="flex align-items-center gap-2 mb-4">
                    <i className="pi pi-shopping-cart text-primary"></i>
                    <h5 className="m-0 text-primary">Thông tin dịch vụ / sản phẩm</h5>
                </div>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <FloatLabelCustom htmlFor="editOaId" label="OA ID">
                            <InputText
                                id="editOaId"
                                value={editingPartner.oaId || ''}
                                className="w-full"
                                onChange={(e) => setEditingPartner({ ...editingPartner, oaId: e.target.value })}
                                disabled
                            />
                        </FloatLabelCustom>
                    </div>
                    <div className="col-12 md:col-6">
                        <FloatLabelCustom htmlFor="editMiniAppLoyalty" label="Mini App Loyalty">
                            <InputTextCustom
                                id="editMiniAppLoyalty"
                                value={editingPartner.miniAppLoyalty || ''}
                                className="w-full"
                                onChange={(e) => setEditingPartner({ ...editingPartner, miniAppLoyalty: e.target.value })}
                            />
                        </FloatLabelCustom>
                    </div>
                    <div className="col-12">
                        <FloatLabelCustom htmlFor="editMiniGameUrl" label="URL Mini Game">
                            <InputTextCustom
                                id="editMiniGameUrl"
                                value={editingPartner.miniGameUrl || ''}
                                className={`w-full ${editingPartner.miniGameUrl && !validateLogoUrl(editingPartner.miniGameUrl) ? 'p-invalid' : ''}`}
                                onChange={(e) => setEditingPartner({ ...editingPartner, miniGameUrl: e.target.value })}
                            />
                        </FloatLabelCustom>
                        {editingPartner.miniGameUrl && !validateLogoUrl(editingPartner.miniGameUrl) && (
                            <small className="p-error">URL mini game không hợp lệ</small>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );

    const credentialsSection = (
        <div className="col-12">
            <Card className="mb-4">
                <div className="flex align-items-center gap-2 mb-4">
                    <i className="pi pi-shield text-primary"></i>
                    <h5 className="m-0 text-primary">Thông tin xác thực</h5>
                </div>
                <div className="grid">
                    {/* Partner Credentials */}
                    <div className="col-12">
                        <Card title={
                            <h6 className="font-semibold text-primary">Partner</h6>
                        }>
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <FloatLabelCustom htmlFor="editPartnerAppId" label="App ID">
                                        <InputTextCustom
                                            id="editPartnerAppId"
                                            value={editingPartner.partnerAppId || ''}
                                            className="w-full"
                                            onChange={(e) => setEditingPartner({ ...editingPartner, partnerAppId: e.target.value })}
                                        />
                                    </FloatLabelCustom>
                                </div>
                                <div className="col-12 md:col-6">
                                    <FloatLabelCustom htmlFor="editPartnerAppSecretKey" label="App Secret Key">
                                        <InputTextCustom
                                            id="editPartnerAppSecretKey"
                                            value={editingPartner.partnerAppSecretKey || ''}
                                            className="w-full"
                                            onChange={(e) => setEditingPartner({ ...editingPartner, partnerAppSecretKey: e.target.value })}
                                        />
                                    </FloatLabelCustom>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* CDP Credentials */}
                    <div className="col-12">
                        <Card title={
                            <h6 className="font-semibold text-primary">CDP</h6>
                        }>
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <FloatLabelCustom htmlFor="editCdpAccessToken" label="Access Token">
                                        <InputTextCustom
                                            id="editCdpAccessToken"
                                            value={editingPartner.cdpAccessToken || ''}
                                            className="w-full"
                                            onChange={(e) => setEditingPartner({ ...editingPartner, cdpAccessToken: e.target.value })}
                                        />
                                    </FloatLabelCustom>
                                </div>
                                <div className="col-12 md:col-6">
                                    <FloatLabelCustom htmlFor="editCdpRefreshToken" label="Refresh Token">
                                        <InputTextCustom
                                            id="editCdpRefreshToken"
                                            value={editingPartner.cdpRefreshToken || ''}
                                            className="w-full"
                                            onChange={(e) => setEditingPartner({ ...editingPartner, cdpRefreshToken: e.target.value })}
                                        />
                                    </FloatLabelCustom>
                                </div>
                                <div className="col-12 md:col-6">
                                    <FloatLabelCustom htmlFor="editCdpAppId" label="App ID">
                                        <InputTextCustom
                                            id="editCdpAppId"
                                            value={editingPartner.cdpAppId || ''}
                                            className="w-full"
                                            onChange={(e) => setEditingPartner({ ...editingPartner, cdpAppId: e.target.value })}
                                        />
                                    </FloatLabelCustom>
                                </div>
                                <div className="col-12 md:col-6">
                                    <FloatLabelCustom htmlFor="editCdpAppSecretKey" label="App Secret Key">
                                        <InputTextCustom
                                            id="editCdpAppSecretKey"
                                            value={editingPartner.cdpAppSecretKey || ''}
                                            className="w-full"
                                            onChange={(e) => setEditingPartner({ ...editingPartner, cdpAppSecretKey: e.target.value })}
                                        />
                                    </FloatLabelCustom>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <>
            <Dialog
                header={headerContent}
                footer={footerContent}
                visible={visible}
                closable={false}
                style={{ width: '70vw', maxWidth: '1157px' }}
            >
                <form onSubmit={onSubmit} className="p-0">
                    <div className="grid">
                        {basicInfomations}
                        {contactInformation}
                        {companyInformation}
                        {serviceInformation}
                        {credentialsSection}
                    </div>
                </form>
            </Dialog>

            <ConfirmDialog
                visible={showStatusConfirm}
                onHide={() => setShowStatusConfirm(false)}
                message={
                    <>
                        <p className="mb-2 p-4">Bạn có chắc chắn muốn {editingPartner.status === 1 ? 'hủy kích hoạt' : 'kích hoạt'} partner "{editingPartner.name || 'Chưa có tên'}"?</p>
                    </>
                }
                header="Xác nhận thay đổi trạng thái"
                accept={confirmStatusChange}
                reject={() => setShowStatusConfirm(false)}
                acceptLabel="Xác nhận"
                rejectLabel="Hủy"
                acceptClassName="p-button-warning"
                rejectClassName="p-button-secondary"
            />
        </>
    );
};

export default EditPartnerDialog;