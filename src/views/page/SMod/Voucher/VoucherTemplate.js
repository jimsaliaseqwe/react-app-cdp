import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import {
    createVoucherTemplate,
    getVoucherTemplate,
    getVoucherTemplateDetail,
    updateVoucherTemplate
} from "../../../../service/requestAPI";
import { callVoidWithNewThread } from "../../../../util/func";
import LabelRequired from "../../../Component/LabelRequired";
import { ResourceList, useComputeColumns, useFetchResources } from "../../../Component/Resources";
import FileUploadImage from "../../../Component/Widget/FileUploadImage";
import { showToast } from "../../Admin/common";
import { getTemplateTypeByValue, TEMPLATE_TYPE_WITHOUT_CLASSNAME } from "./index";

export default () => {
    const [masterToast] = useOutletContext();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [defaultTemplates, setDefaultTemplates] = useState([]);
    const [myTemplates, setMyTemplates] = useState([]);
    const [inactiveTemplates, setInactiveTemplates] = useState([]);
    const [forceReload, setForceReload] = useState(0);
    const [showDetail, setShowDetail] = useState(false);
    const [showTrash, setShowTrash] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(getDefaultTemplate());
    const [headerFormDetail, setHeaderFormDetail] = useState('Tạo Voucher Template');
    const partnerId = useSelector(({ auth: { userid } }) => userid);
    const [
        responseData = {
            data: {
                defaultTemplates: [],
                partnerTemplates: [],
                partnerTemplatesInactive: [],
            },
        },
        ,
        loading,
        setLoading,
    ] = useFetchResources(
        useCallback(
            getVoucherTemplate.bind(null, {
                partnerId,
            }),
            [],
        ),
        forceReload,
    );

    useEffect(() => {
        if (responseData?.data) {
            setDefaultTemplates(
                [...responseData.data.defaultTemplates].map((i) => ({
                    ...i,
                    id: i.id || i.templateId,
                })),
            );
            setMyTemplates(
                [...responseData.data.partnerTemplates].map((i) => ({
                    ...i,
                    id: i.id || i.templateId,
                })),
            );
            setInactiveTemplates(
                [...responseData.data.partnerTemplatesInactive].map((i) => ({
                    ...i,
                    id: i.id || i.templateId,
                })),
            );
        }
    }, [responseData]);

    useEffect(() => {
        const action = searchParams.get('voucherAction');
        switch (action) {
            case 'newVoucher':
                setHeaderFormDetail('Tạo Voucher mẫu');
                setShowDetail(true);
                break;
            case 'cloneVoucher':
                setHeaderFormDetail('Copy Voucher mẫu');
                setShowDetail(true);
                break;
            case 'editVoucher':
                setHeaderFormDetail('Cập nhật Voucher mẫu');
                setShowDetail(true);
                break;
            default:
                setHeaderFormDetail('');
                setShowDetail(false);
                break;
        }
    }, [searchParams]);

    const onSubmitSuccess = useCallback(() => {
        navigate('./');
        setForceReload((prev) => prev + 1);
    }, []);

    const onDeleteTemplate = useCallback(
        (template) => {
            return confirmDialog({
                group: 'voucherTemplate',
                message: `Bạn có chắc chắn muốn xoá Voucher mẫu "${template.name}" không?`,
                header: 'Xoá Voucher mẫu',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Xoá',
                rejectLabel: 'Huỷ',
                accept: () => {
                    setLoading(true);
                    updateVoucherTemplate({ ...template, status: 0 })
                        .then(() => {
                            showToast.call(
                                masterToast,
                                'success',
                                'Thành công',
                                `Xoá "${template.name}" thành công`,
                                'Bạn có thể tạo lại Template này nếu cần',
                            );
                            setForceReload((prev) => prev + 1);
                        })
                        .catch((error) => {
                            showToast.call(
                                masterToast,
                                'error',
                                'Lỗi',
                                error.message || 'Không thể xoá Template',
                                'Vui lòng kiểm tra lại thông tin',
                            );
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                },
            });
        },
        [defaultTemplates, myTemplates],
    );

    const onRestoreTemplate = useCallback(
        (template) => {
            return confirmDialog({
                group: 'voucherTemplate',
                message: `Bạn có chắc chắn muốn khôi phục mẫu "${template.name}" không?`,
                header: 'Khôi phục Voucher mẫu',
                icon: 'pi pi-restore',
                acceptLabel: 'Khôi phục',
                rejectLabel: 'Huỷ',
                accept: () => {
                    setLoading(true);
                    updateVoucherTemplate({ ...template, status: 1 })
                        .then(() => {
                            showToast.call(
                                masterToast,
                                'success',
                                'Thành công',
                                `Khôi phục mẫu "${template.name}" thành công`,
                                'Bạn có thể sử dụng mẫu này để phát hành Voucher',
                            );
                            setForceReload((prev) => prev + 1);
                        })
                        .catch((error) => {
                            showToast.call(
                                masterToast,
                                'error',
                                'Lỗi',
                                error.message || 'Không thể khôi phục',
                                'Vui lòng kiểm tra lại thông tin',
                            );
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                },
            });
        },
        [inactiveTemplates],
    );

    return (
        <div className="w-full p-3" style={{ minHeight: '100%' }}>
            <h2 className="text-2xl">Quản lý Voucher mẫu</h2>

            <div className="w-full border-round p-3 bg-white">
                <div className="mb-2 flex align-items-center justify-content-end bg-white">
                    <Button
                        icon="pi pi-plus"
                        label="Tạo Voucher mẫu mới"
                        severity="success"
                        onClick={() => {
                            navigate('./?voucherAction=newVoucher');
                        }}
                        size="small"
                    />

                    <Button
                        icon="pi pi-refresh"
                        label="Làm mới"
                        text
                        onClick={() => {
                            setForceReload((prev) => prev + 1);
                        }}
                        size="small"
                        className="px-2 py-1 ml-2"
                    />
                </div>

                <TabView pt={{ panelContainer: { className: 'px-0' } }}>
                    <TabPanel header="Voucher Template Mặc Định">
                        <TableDefaultTemplate
                            records={defaultTemplates}
                            onCloneTemplate={(rowData) =>
                                navigate(`?voucherAction=cloneVoucher&voucherTemplateId=${rowData.templateId}`)
                            }
                            loading={loading}
                            onRowClick={({ data }) =>
                                navigate(`?voucherAction=cloneVoucher&voucherTemplateId=${data.templateId}`)
                            }
                        />
                    </TabPanel>
                    <TabPanel header="Voucher mẫu của bạn">
                        <TablePartnerTemplate
                            records={myTemplates}
                            onDeleteTemplate={onDeleteTemplate}
                            loading={loading}
                            onRowClick={({ data }) =>
                                navigate(`?voucherAction=editVoucher&voucherTemplateId=${data.templateId}`)
                            }
                            onEditTemplate={(rowData) => {
                                navigate(`?voucherAction=editVoucher&voucherTemplateId=${rowData.templateId}`);
                            }}
                        />
                    </TabPanel>
                    <TabPanel header="Voucher mẫu đã hủy">
                        <TableInactiveTemplate
                            records={inactiveTemplates}
                            onRestoreTemplate={onRestoreTemplate}
                            loading={loading}
                        />
                    </TabPanel>
                </TabView>
            </div>

            <Dialog
                visible={showDetail}
                onHide={() => {
                    navigate('./');
                }}
                header={headerFormDetail}
                style={{ width: '85vw', height: '85vh' }}
            >
                <FormDetailTemplate onSuccess={onSubmitSuccess} />
            </Dialog>

            <ConfirmDialog group="voucherTemplate" />
        </div>
    );
};

function TableDefaultTemplate({ records, onCloneTemplate, loading, onRowClick }) {
    const navigate = useNavigate();
    const displayColumns = useCallback(() => {
        const r = allColumns.filter((i) => i.visibleDefault).map((i) => i.field);
        r.push({
            field: 'action',
            body: (rowData) => {
                return (
                    <div className="text-right">
                        <Button
                            size="small"
                            label="xem"
                            className="px-2 py-1"
                            onClick={(e) => {
                                onCloneTemplate && callVoidWithNewThread(() => onCloneTemplate(rowData));
                            }}
                        />
                    </div>
                );
            },
            visibleDefault: true,
            headerStyle: { width: '50px' },
        });
        return r;
    }, []);

    const [columns] = useComputeColumns({
        allColumns,
        records,
        displayColumns,
    });

    const emptyTemplate = () => {
        return (
            <div>
                <p className="text-gray-500 mb-0">Chưa có Template</p>
            </div>
        );
    };

    const headerTemplate = () => {
        return <div>{/*<h4 className="text-xl">Voucher Template Mặc Định</h4>*/}</div>;
    };

    return (
        <div>
            <ResourceList
                records={records}
                columns={columns}
                emptyTemplate={emptyTemplate}
                loading={loading}
                header={headerTemplate}
                onRowClick={onRowClick}
            />
        </div>
    );
}

function TablePartnerTemplate({ records, onDeleteTemplate, loading, onEditTemplate, onRowClick }) {
    const displayColumns = useCallback(() => {
        const r = allColumns.filter((i) => i.visibleDefault).map((i) => i.field);
        r.push({
            field: 'action',
            body: (rowData) => {
                return (
                    <div className="flex justify-content-between">
                        <Button
                            size="small"
                            className="px-2 py-1"
                            label="Sửa"
                            onClick={(e) => {
                                onEditTemplate && callVoidWithNewThread(() => onEditTemplate(rowData));
                            }}
                        />

                        <Button
                            size="small"
                            className="px-2 py-1"
                            severity="danger"
                            label="Xoá"
                            onClick={(e) => {
                                onDeleteTemplate && callVoidWithNewThread(() => onDeleteTemplate(rowData));
                            }}
                        />
                    </div>
                );
            },
            visibleDefault: true,
            headerStyle: { width: '105px' },
        });
        return r;
    }, []);

    const [columns] = useComputeColumns({
        allColumns,
        records,
        displayColumns,
    });

    const emptyTemplate = () => {
        return (
            <div>
                <p className="text-gray-500 mb-0">Chưa có Template</p>
            </div>
        );
    };

    const headerTemplate = () => {
        return <div></div>;
    };

    return (
        <>
            <ResourceList
                records={records}
                columns={columns}
                emptyTemplate={emptyTemplate}
                loading={loading}
                header={headerTemplate}
                onRowClick={onRowClick}
            />
        </>
    );
}

function TableInactiveTemplate({ records, onRestoreTemplate, loading }) {
    const displayColumns = useCallback(() => {
        const r = allColumns.filter((i) => i.visibleDefault).map((i) => i.field);
        r.push({
            field: 'action',
            body: (rowData) => {
                return (
                    <div className="text-right">
                        <Button
                            size="small"
                            label="Khôi phục"
                            className="px-2 py-1"
                            severity="success"
                            onClick={(e) => {
                                onRestoreTemplate(rowData);
                            }}
                        />
                    </div>
                );
            },
            visibleDefault: true,
            headerStyle: { width: '100px' },
        });
        return r;
    }, []);

    const [columns] = useComputeColumns({
        allColumns,
        records,
        displayColumns,
    });

    const emptyTemplate = () => {
        return (
            <div>
                <p className="text-gray-500 mb-0">Không có Voucher Template bị xóa</p>
            </div>
        );
    };

    const headerTemplate = () => {
        return <div></div>;
    };

    return (
        <>
            <ResourceList
                records={records}
                columns={columns}
                emptyTemplate={emptyTemplate}
                loading={loading}
                header={headerTemplate}
            />
        </>
    );
}

export function FormDetailTemplate({ onSuccess, onError, onFinally, readonly = false }) {
    const [masterToast] = useOutletContext();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [btnSubmitLabel, setBtnSubmitLabel] = useState("");
    const partnerId = useSelector(({auth: {userid}}) => userid);

    useEffect(() => {
        const action = searchParams.get('voucherAction');
        switch (action) {
            case 'newVoucher':
                setBtnSubmitLabel('Tạo Voucher mẫu');
                break;
            case 'cloneVoucher':
                setBtnSubmitLabel('Lưu thành mẫu của tôi');
                break;
            case 'editVoucher':
                setBtnSubmitLabel('Lưu cập nhật');
                break;
            default:
                setBtnSubmitLabel('');
        }

        if (action === 'editVoucher' || action === 'cloneVoucher') {
            if (searchParams.get('voucherTemplateId')) {
                setLoading(true);
                getVoucherTemplateDetail({
                    partnerId: action === 'cloneVoucher' ? '' : partnerId,
                    templateId: searchParams.get('voucherTemplateId'),
                })
                    .then((response) => {
                        if (response.data) {
                            setFormData(response.data);
                        } else {
                            setFormData(null);
                        }
                    })
                    .catch((e) => {})
                    .finally(() => setLoading(false));
            } else {
                setFormData(null);
            }
        } else if (action === 'newVoucher') {
            setFormData(getDefaultTemplate());
        } else {
            setFormData(null);
        }
    }, [searchParams]);

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setLoading(true);
            const action = searchParams.get('voucherAction');
            if (['newVoucher', 'cloneVoucher'].includes(action)) {
                const { templateId, ...newFormData } = formData;
                createVoucherTemplate(computeFormData({ ...newFormData, partnerId }))
                    .then((response) => {
                        showToast.call(
                            masterToast,
                            'success',
                            'Thành công',
                            'Tạo Template Voucher thành công',
                            'Bạn có thể sử dụng Template này để phát hành Voucher',
                        );
                        typeof onSuccess === 'function' && callVoidWithNewThread(() => onSuccess(response.data));
                    })
                    .catch((error) => {
                        showToast.call(
                            masterToast,
                            'error',
                            'Lỗi',
                            error.message || 'Không thể tạo Template Voucher',
                            'Vui lòng kiểm tra lại thông tin',
                        );
                        typeof onError === 'function' && callVoidWithNewThread(() => onError(error));
                    })
                    .finally(() => {
                        setLoading(false);
                        typeof onFinally === 'function' && callVoidWithNewThread(() => onFinally());
                    });
            } else {
                updateVoucherTemplate(computeFormData(formData))
                    .then((response) => {
                        showToast.call(
                            masterToast,
                            'success',
                            'Thành công',
                            'Cập nhật Template Voucher thành công',
                            'Bạn có thể sử dụng Template này để phát hành Voucher',
                        );
                        typeof onSuccess === 'function' && callVoidWithNewThread(() => onSuccess(response));
                    })
                    .catch((error) => {
                        showToast.call(
                            masterToast,
                            'error',
                            'Lỗi',
                            error.message || 'Không thể cập nhật Template Voucher',
                            'Vui lòng kiểm tra lại thông tin',
                        );
                        typeof onError === 'function' && callVoidWithNewThread(() => onError(error));
                    })
                    .finally(() => {
                        setLoading(false);
                        typeof onFinally === 'function' && callVoidWithNewThread(() => onFinally());
                    });
            }
        },
        [formData, searchParams],
    );

    const onChange = (field, val) => {
        setFormData((prev) => ({ ...prev, [field]: val }));
    };

    return (<form onSubmit={onSubmit} className="block w-full pt-5">
        {formData && <div className="grid">
            <div className="col-3">
                <Card className="surface-50">
                    <FileUploadImage imageUrl={formData.banner} readonly={readonly}
                                     onChange={(url) => onChange('banner', url)}
                                     emptyText="Tỉ lệ Dài:Cao: 1x1 (ví dụ: 100x100, 200x200...)"/>
                </Card>
                <Card className="mt-3">
                    <p className="text-900 font-semibold mb-2">Thông tin phát hành</p>
                    <p className="text-gray-500 mb-0">Số lượng đã đổi: <span className="text-red-500 font-semibold">{formData.issuedTotal || 0}</span></p>
                    <p className="text-gray-500 mb-0">Số lượng đã đổi trong ngày: <span className="text-red-500 font-semibold">{formData.issuedToday || 0}</span></p>
                    <p className="text-gray-500 mb-0">Số lượng còn lại: <span className="text-green-500 font-semibold">{formData.remainTotal || 0}</span></p>
                </Card>
            </div>
            <div className="col-9">
                <Card className="mb-3">
                    <p className="text-900 font-semibold mb-3">Thông tin cơ bản</p>
                    <div className="grid">
                        <div className="col-6">
                            <LabelRequired htmlFor="name">Tên template</LabelRequired>
                            <InputText id="name" className="w-full" required
                                       value={formData.name} readOnly={readonly}
                                       onChange={(e) => onChange('name', e.target.value)}/>
                        </div>
                        <div className="col-6">
                            <LabelRequired htmlFor="type">Loại</LabelRequired>
                            <Dropdown value={formData.type} options={TEMPLATE_TYPE_WITHOUT_CLASSNAME}
                                      className="w-full" inputId="type"
                                      onChange={(e) => onChange('type', e.target.value)}
                                      placeholder="Chọn loại" disabled={readonly}
                            />
                        </div>
                    </div>
                </Card>

                <Card className=" mb-3">
                    <p className="text-900 font-semibold mb-3">Thiết lập giá trị</p>
                    <div className="grid">
                        <div className="col-4">
                            <label htmlFor="txtValue">Giá trị</label>
                            <InputText className="w-full" value={formData.value} readOnly={readonly} id="txtValue"
                                       onChange={(e) => onChange('value', e.target.value)}/>
                        </div>
                        <div className="col-4">
                            <label htmlFor="txtMinValue">Giá trị đơn hàng tối thiểu</label>
                            <InputText className="w-full" value={formData.minOrderValue} readOnly={readonly}
                                       id="txtMinValue"
                                       onChange={(e) => onChange('minOrderValue', e.target.value)}/>
                        </div>
                        <div className="col-4">
                            <label htmlFor="requirePoint">Điểm đổi</label>
                            <InputText className="w-full" value={formData.requirePoint} readOnly={readonly}
                                       id="requirePoint" placeholder="Nhập số điểm cần để đổi voucher"
                                       onChange={(e) => onChange('requirePoint', e.target.value)}/>
                        </div>
                        {formData.type === "discount" && <div className="col-4">
                            <label htmlFor="maxDiscount">Giảm giá tối đa (VND)</label>
                            <InputText className="w-full" value={formData.maxDiscount} readOnly={readonly} id="maxDiscount"
                                onChange={(e) => onChange('maxDiscount', e.target.value)} />
                        </div>}
                    </div>
                    <p className="text-600 mt-1 mb-0"><small>Để trống để dùng giá trị mặc định</small></p>
                </Card>

                <Card className="mb-3">
                    <p className="text-900 font-semibold mb-3">Giới hạn số lượng</p>
                    <div className="grid">
                        <div className="col-4">
                            <label htmlFor="maxTotalQuantity">Tổng số lượng có thể phát</label>
                            <InputText className="w-full" value={formData.maxTotalQuantity} readOnly={readonly}
                                       id="maxTotalQuantity"
                                       onChange={(e) => onChange('maxTotalQuantity', e.target.value)}/>
                        </div>
                        <div className="col-4">
                            <label htmlFor="maxDailyQuantity">Số lượng phát trong ngày</label>
                            <InputText className="w-full" value={formData.maxDailyQuantity} readOnly={readonly}
                                       id="maxDailyQuantity"
                                       onChange={(e) => onChange('maxDailyQuantity', e.target.value)}/>
                        </div>
                        <div className="col-4">
                            <label htmlFor="usageLimit">Số lượng cho 1 User</label>
                            <InputText className="w-full" value={formData.usageLimit} readOnly={readonly} id="usageLimit"
                                       onChange={(e) => onChange('usageLimit', e.target.value)}/>
                        </div>
                    </div>
                </Card>

                {formData.type === "period" && <Card className="mb-3">
                    <p className="text-900 font-semibold mb-3">Hiệu lực</p>
                    <div className="grid">
                        <div className="col-4">
                            <label htmlFor="validDays">Số ngày có hiệu lực từ ngày phát hành</label>
                            <InputText className="w-full" value={formData.validDays} readOnly={readonly} id="validDays"
                                       onChange={(e) => onChange('validDays', e.target.value)}/>
                        </div>
                    </div>
                </Card>}

                <Card>
                    <p className="text-900 font-semibold mb-3">Nội dung</p>
                    <div className="grid">
                        <div className="col-6">
                            <label htmlFor="description">Mô tả</label>
                            <InputTextarea rows={3} id="description" className="w-full" value={formData.description}
                                           readOnly={readonly}
                                           onChange={(e) => onChange('description', e.target.value)}/>
                        </div>
                        <div className="col-6">
                            <label htmlFor="txtNote">Ghi chú</label>
                            <InputTextarea className="w-full" value={formData.note} readOnly={readonly} id="txtNote"
                                           rows={3}
                                           onChange={(e) => onChange('note', e.target.value)}/>
                        </div>
                    </div>
                </Card>
            </div>
        </div>}

        {!readonly && <div className="text-right mt-3">
            <Button icon='pi pi-save' label={btnSubmitLabel} size="small" type="submit" loading={loading}/>
        </div>}
    </form>)
}

const allColumns = [
    {
        field: 'templateId',
        header: 'ID',
        width: 100,
        visibleDefault: true,
        align: 'center',
    },
    { field: 'partnerId', header: 'ID Đối tác' },
    { field: 'name', header: 'Template', visibleDefault: true },
    {
        field: 'value',
        header: 'Giá trị',
        visibleDefault: false,
        align: 'right',
    },
    {
        field: 'type',
        header: 'Loại',
        visibleDefault: true,
        body({ type }) {
            const tempType = getTemplateTypeByValue(type);
            return <Badge className={tempType.className} value={tempType.label} />;
        },
    },
    {field: 'banner', header: 'Banner', visibleDefault: false},
    {field: 'description', header: 'Mô tả', visibleDefault: true},
    {field: 'minOrderValue', header: 'Giá trị đơn hàng tối thiểu'},
    {field: 'validDays', header: 'Số ngày hiệu lực'},
    {field: 'usageLimit', header: 'Số lần sử dụng'},
    {field: 'requirePoint', header: 'Điểm yêu cầu'},
    {field: 'note', header: 'Ghi chú'},
    {field: 'maxTotalQuantity', header: 'Số lượng tối đa'},
    {field: 'maxDailyQuantity', header: 'Số lượng tối đa hàng ngày'},
    {field: 'issuedTotal', header: 'Số lượng đã phát hành'},
    {field: 'issuedToday', header: 'Số lượng đã phát hành hôm nay', visibleDefault: true},
    {field: 'remainTotal', header: 'Số lượng còn lại', visibleDefault: true},
    {field: 'lastIssuedDay', header: 'Ngày phát hành cuối'}
];

function computeFormData(formData) {
    const intFields = [
        'minOrderValue',
        'validDays',
        'usageLimit',
        'requirePoint',
        'maxTotalQuantity',
        'maxDailyQuantity',
        'value',
        'lastIssuedDay',
        'issuedTotal',
        'issuedToday',
    ];
    const { remainTotal, remainToday, ...responseData } = { ...formData };
    for (const field of Object.keys(responseData)) {
        if (intFields.includes(field)) {
            try {
                responseData[field] = parseInt(responseData[field]) || 0;
            } catch (error) {
                responseData[field] = 0;
            }
        }
    }
    responseData['partnerId'] = responseData.partnerId;
    return responseData;
}

function getDefaultTemplate() {
    return {
        templateId: 0,
        partnerId: '',
        name: '',
        type: '',
        description: '',
        note: '',
        value: 0,
        minOrderValue: 0,
        validDays: 0,
        usageLimit: 0,
        requirePoint: 0,
        maxTotalQuantity: 0,
        maxDailyQuantity: 0,
        issuedTotal: 0,
        issuedToday: 0,
        lastIssuedDay: 0,
        status: 1,
    };
}
