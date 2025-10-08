import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import { Tag } from "primereact/tag";
import React, { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { getPartnerInfo } from "../../../../service/requestAPI";

const FieldCopy = ({ value, onClick }) => {
    return (
        <div className="flex align-items-center justify-content-between gap-2" style={{ position: 'relative' }}>
            <p className="text-600 font-mono text-sm break-all bg-gray-100 p-2 border-round flex-grow-1 m-0 w-full">{value || 'N/A'}</p>
            {value !== 'N/A' && <i className="pi pi-copy text-lg cursor-pointer"
                style={{ position: 'absolute', right: '4px' }}
                onClick={onClick}
                title="Copy to clipboard"
            />}
        </div>
    )
}   

const ViewPartnerDialog = ({ visible, onHide, partnerId }) => {
    const [partnerData, setPartnerData] = useState(null);
    const [membershipData, setMembershipData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPartnerData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPartnerInfo(partnerId);
            if (response.data && response.data.partner) {
                setPartnerData(response.data.partner);
                if (response.data.memberShip) {
                    setMembershipData(response.data.memberShip);
                }
            } else {
                setError('Không tìm thấy thông tin partner');
            }
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi tải thông tin partner');
            console.error('Error fetching partner data:', err);
        } finally {
            setLoading(false);
        }
    }, [partnerId]);

    useEffect(() => {
        if (visible && partnerId !== null) {
            fetchPartnerData();
        }
    }, [visible, partnerId, fetchPartnerData]);

    const headerContent = (
        <div className="flex align-items-center justify-content-between w-full">
            <div className="flex align-items-center gap-3">
                <div className="flex align-items-center justify-content-center bg-primary-50 border-round" style={{ width: '40px', height: '40px' }}>
                    <i className="pi pi-building text-primary text-xl"></i>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-900 m-0">Chi tiết Partner</h3>
                    <p className="text-600 text-sm m-0">Thông tin chi tiết và cấu hình</p>
                </div>
            </div>
        </div>
    )

    const basicInfomation = () => {
        return (
            <div className="col-12">
                <div className="surface-card border-round-lg p-5 mb-4 shadow-2">
                    <div className="mb-5">
                        <div className="flex align-items-center gap-2 mb-3">
                            <div className="flex align-items-center justify-content-center bg-cyan-50 border-round" style={{ width: '28px', height: '28px' }}>
                                <i className="pi pi-user text-cyan-600 text-sm"></i>
                            </div>
                            <h5 className="text-md font-semibold text-900 m-0">Thông tin liên hệ</h5>
                        </div>
                        <div className="grid border-round-md p-3 bg-gray-50">
                            <div className="col-6">
                                <div className="field">
                                    <label className="font-semibold text-900">Họ và tên</label>
                                    <p className="text-600 mt-1">{partnerData.contactName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="field">
                                    <label className="font-semibold text-900">Số điện thoại</label>
                                    <p className="text-600 mt-1">{partnerData.contactPhone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="field">
                                    <label className="font-semibold text-900">Email</label>
                                    <p className="text-600 mt-1">{partnerData.contactEmail || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="field">
                                    <label className="font-semibold text-900">Access Token</label>
                                    <div className="mt-1">
                                        <Tag
                                            value={partnerData.accessTokenValid ? 'Valid' : 'Invalid'}
                                            severity={partnerData.accessTokenValid ? 'success' : 'danger'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex align-items-center gap-2 mb-3">
                            <div className="flex align-items-center justify-content-center bg-green-50 border-round" style={{ width: '28px', height: '28px' }}>
                                <i className="pi pi-building text-green-600 text-sm"></i>
                            </div>
                            <h5 className="text-md font-semibold text-900 m-0">Thông tin công ty</h5>
                        </div>
                        <div className="grid border-round-md p-3 bg-gray-50">
                            <div className="col-12">
                                <div className="field">
                                    <label className="font-semibold text-900">Tên công ty</label>
                                    <p className="text-600 mt-1">{partnerData.companyName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="field">
                                    <label className="font-semibold text-900">Địa chỉ công ty</label>
                                    <p className="text-600 mt-1">{partnerData.companyAddress || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const applicationInformation = () => {
        return (
            <div className="col-12">
                <div className="surface-card border-round-lg p-5 mb-4 shadow-2">
                    <div className="flex align-items-center gap-3 mb-4">
                        <div className="flex align-items-center justify-content-center bg-green-50 border-round" style={{ width: '36px', height: '36px' }}>
                            <i className="pi pi-mobile text-green-600"></i>
                        </div>
                        <h4 className="text-lg font-semibold text-900 m-0">Thông tin ứng dụng</h4>
                    </div>
                    <div className="grid">
                        <div className="col-6">
                            <div className="field">
                                <label className="font-semibold text-900">Mini App Loyalty</label>
                                <FieldCopy value={partnerData.miniAppLoyalty || 'N/A'} onClick={() => copyToClipboard(partnerData.miniAppLoyalty || '')} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="field">
                                <label className="font-semibold text-900">OA ID</label>
                                <FieldCopy value={partnerData.oaId || 'N/A'} onClick={() => copyToClipboard(partnerData.oaId || '')} />
                            </div>
                        </div>
                        {partnerData.miniGameUrl && (
                            <div className="col-12">
                                <div className="field">
                                    <label className="font-semibold text-900">Mini Game URL</label>
                                    <div className="mt-1">
                                        <a
                                            href={partnerData.miniGameUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary text-sm break-all"
                                        >
                                            {partnerData.miniGameUrl}
                                        </a>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-content-center">
                                            <div className="surface-100 border-round p-3">
                                                <QRCode
                                                    value={partnerData.miniGameUrl}
                                                    size={200}
                                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-600 text-sm text-center mt-2">
                                            Quét mã QR để truy cập Mini Game
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const cdpCredentials = () => {
        return (<div className="col-12">
            <div className="surface-card border-round-lg p-5 mb-4 shadow-2">
                <div className="flex align-items-center gap-3 mb-4">
                    <div className="flex align-items-center justify-content-center bg-orange-50 border-round" style={{ width: '36px', height: '36px' }}>
                        <i className="pi pi-key text-orange-600"></i>
                    </div>
                    <h4 className="text-lg font-semibold text-900 m-0">CDP Credentials</h4>
                </div>
                <div className="grid">
                    <div className="col-6">
                        <div className="field">
                            <label className="font-semibold text-900">CDP Access Token</label>
                            <div className="mt-1">
                                <FieldCopy value={partnerData.cdpAccessToken || 'N/A'} onClick={() => copyToClipboard(partnerData.cdpAccessToken || '')} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="field">
                            <label className="font-semibold text-900">CDP Refresh Token</label>
                            <div className="mt-1">
                                <FieldCopy value={partnerData.cdpRefreshToken || 'N/A'} onClick={() => copyToClipboard(partnerData.cdpRefreshToken || '')} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="field">
                            <label className="font-semibold text-900">CDP App ID</label>
                            <div className="mt-1">
                                <FieldCopy value={partnerData.cdpAppId || 'N/A'} onClick={() => copyToClipboard(partnerData.cdpAppId || '')} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="field">
                            <label className="font-semibold text-900">CDP App Secret Key</label>
                            <div className="mt-1">
                                <FieldCopy value={partnerData.cdpAppSecretKey || 'N/A'} onClick={() => copyToClipboard(partnerData.cdpAppSecretKey || '')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

    const partnerCredentials = () => {
        return (<div className="col-12">
            <div className="surface-card border-round-lg p-5 mb-4 shadow-2">
                <div className="flex align-items-center gap-3 mb-4">
                    <div className="flex align-items-center justify-content-center bg-purple-50 border-round" style={{ width: '36px', height: '36px' }}>
                        <i className="pi pi-shield text-purple-600"></i>
                    </div>
                    <h4 className="text-lg font-semibold text-900 m-0">Partner Credentials</h4>
                </div>
                <div className="grid">
                    <div className="col-6">
                        <div className="field">
                            <label className="font-semibold text-900">Partner App ID</label>
                            <div className="mt-1">
                                <FieldCopy value={partnerData.partnerAppId || 'N/A'} onClick={() => copyToClipboard(partnerData.partnerAppId || '')} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="field">
                            <label className="font-semibold text-900">Partner App Secret Key</label>
                            <div className="mt-1">
                                <FieldCopy value={partnerData.partnerAppSecretKey || 'N/A'} onClick={() => copyToClipboard(partnerData.partnerAppSecretKey || '')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

    const banner = () => {
        return (<>
            {partnerData.banner && (
                <div className="col-12">
                    <div className="surface-card border-round-lg p-5 mb-4 shadow-2">
                        <div className="flex align-items-center gap-3 mb-4">
                            <div className="flex align-items-center justify-content-center bg-pink-50 border-round" style={{ width: '36px', height: '36px' }}>
                                <i className="pi pi-image text-pink-600"></i>
                            </div>
                            <h4 className="text-lg font-semibold text-900 m-0">Banner</h4>
                        </div>
                        <div className="flex justify-content-center">
                            <img
                                src={partnerData.banner}
                                alt="Banner"
                                className="border-round"
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    height: '250px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}</>)
    }

    const membership = () => {
        return (
            <>
                {membershipData && (
                    <div className="col-12">
                        <div className="surface-card border-round-lg p-5 shadow-2">
                            <div className="flex align-items-center gap-3 mb-4">
                                <div className="flex align-items-center justify-content-center bg-cyan-50 border-round" style={{ width: '36px', height: '36px' }}>
                                    <i className="pi pi-users text-cyan-600"></i>
                                </div>
                                <h4 className="text-lg font-semibold text-900 m-0">Thông tin Membership</h4>
                            </div>
                            <div className="grid">
                                <div className="col-12">
                                    <div className="field">
                                        <label className="font-semibold text-900">Member Tags</label>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {membershipData.arrMemberTags?.map((tag, index) => (
                                                <Tag key={index} value={tag} severity="info" className="text-sm" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="field">
                                        <label className="font-semibold text-900">Tier hiện tại</label>
                                        <div className="mt-2">
                                            <Tag
                                                value={membershipData.tierNames?.[membershipData.typeTier] || 'N/A'}
                                                severity="success"
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="field">
                                        <label className="font-semibold text-900">Tỷ lệ đổi điểm</label>
                                        <p className="text-600 mt-1 font-bold">
                                            {membershipData.rateCashToPoint?.toLocaleString() || '0'} VND = 1 điểm
                                        </p>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="field">
                                        <label className="font-semibold text-900">Các cấp độ thành viên</label>
                                        <div className="mt-2">
                                            <div className="grid">
                                                {membershipData.tierNames?.map((tierName, index) => (
                                                    <div key={index} className="col-3">
                                                        <div className={`surface-100 border-round p-3 text-center ${index === membershipData.typeTier ? 'border-primary border-2' : ''
                                                            }`}>
                                                            <div className="font-semibold text-900">{tierName}</div>
                                                            <div className="text-600 text-sm">
                                                                Từ {membershipData.tierPoints?.[index]?.toLocaleString() || '0'} điểm
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {membershipData.tierDescription && membershipData.tierDescription[membershipData.typeTier] && (
                                    <div className="col-12">
                                        <div className="field">
                                            <label className="font-semibold text-900">Mô tả quyền lợi</label>
                                            <pre
                                                className="mt-2 p-3 surface-50 border-round text-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: membershipData.tierDescription[membershipData.typeTier]
                                                }}
                                                style={{ fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.5rem', wordBreak: 'break-word', textWrap: 'wrap' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <Dialog
            header={headerContent}
            visible={visible}
            onHide={onHide}
            style={{ width: '90vw', maxWidth: '1400px' }}
            className="p-fluid"
            modal
            draggable={false}
            resizable={false}
        >
            {loading && (
                <div className="flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="text-center">
                        <i className="pi pi-spin pi-spinner text-primary" style={{ fontSize: '3rem' }}></i>
                        <p className="text-600 mt-3">Đang tải thông tin partner...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex justify-content-center align-items-center" style={{ height: '300px' }}>
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle text-red-500" style={{ fontSize: '3rem' }}></i>
                        <p className="text-red-500 mt-3 text-lg">{error}</p>
                        <button
                            className="p-button p-button-outlined p-button-sm mt-3"
                            onClick={() => fetchPartnerData()}
                        >
                            <i className="pi pi-refresh mr-2"></i>
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {!loading && !error && partnerData && (
                <div>
                    <div className="surface-card border-round-lg p-6 mb-4">
                        <div className="flex align-items-center gap-4">
                            {partnerData.companyLogo ? (
                                <div className="flex-shrink-0">
                                    <img
                                        src={partnerData.companyLogo}
                                        alt="Logo"
                                        className="border-round shadow-4"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }}
                                    />
                                </div>
                            ) : (
                                <div className="flex-shrink-0">
                                    <div className="flex align-items-center justify-content-center bg-gray-100 border-round" style={{ width: '100px', height: '100px' }}>
                                        <i className="pi pi-building text-gray-600 text-2xl"></i>
                                    </div>
                                </div>
                            )}
                            <div className="flex-grow-1">
                                <div className="flex align-items-center justify-content-between mb-2">
                                    <h2 className="text-3xl font-bold text-900 m-0">
                                        {partnerData.name || partnerData.companyName || 'N/A'}
                                    </h2>
                                    <Tag
                                        value={partnerData?.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                        severity={partnerData?.status === 1 ? 'success' : 'danger'}
                                        className="text-sm ml-2"
                                    />
                                </div>
                                <div className="flex align-items-center mb-2">
                                    <span className="text-900 font-semibold">ID: {partnerData.id || 'N/A'}</span>
                                </div>
                                <div className="flex align-items-center mb-2">
                                    <span className="text-900 font-semibold">Owner: {partnerData.ownerId || 'N/A'}</span>
                                </div>
                                <div className="flex align-items-center mb-2">
                                    <span className="text-green-600 font-bold">
                                        Số dư: {partnerData.balance?.toLocaleString() || '0'} VND
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TabView>
                        <TabPanel header={
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-info-circle"></i>
                                <span>Thông tin cơ bản</span>
                            </div>
                        }>
                            <div className="grid">
                                {basicInfomation()}
                                {applicationInformation()}
                                {cdpCredentials()}
                                {partnerCredentials()}
                                {banner()}
                            </div>
                        </TabPanel>

                        <TabPanel header={
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-users"></i>
                                <span>Membership</span>
                            </div>
                        }>
                            <div className="grid">
                                {membership()}
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            )}
        </Dialog>
    );
};

export default ViewPartnerDialog;
