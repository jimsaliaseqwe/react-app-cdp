import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tag } from "primereact/tag";
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { createPartner, getListPartner, updateOaId, updatePartner } from "../../../../service/requestAPI";
import { showToast } from "../../Admin/common";
import { TimeBodyTemplate } from "../Common/components/ColumnTemplates";
import { ColumnSelector, EmptyStateTemplate, TableHeader } from "../Common/components/DataTable";
import { EntityHeader } from "../Common/components/PageHeader";
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from "../Common/constants/dataTable";
import { useDataFilter } from "../Common/hooks/useDataFilter";
import { createGenericFilter } from "../Common/utils/filterHelpers";
import CreatePartnerDialog from "./CreatePartnerDialog";
import EditPartnerDialog from "./EditPartnerDialog";
import UpdateOaIdDialog from "./UpdateOaIdDialog";
import ViewPartnerDialog from "./ViewPartnerDialog";

const DEFAULT_VISIBLE_COLUMNS = ['id', 'ownerId', 'companyName', 'contactPhone', 'contactName', 'contactEmail', 'balance', 'status', 'actions'];
const SORTABLE_COLUMNS = ['id', 'ownerId', 'companyName', 'contactPhone', 'contactName', 'contactEmail', 'balance', 'status'];
const PARTNER_SEARCHABLE_FIELDS = ['id', 'ownerId', 'contactPhone', 'contactName', 'contactEmail', 'companyName', 'balance'];

const createEmptyPartner = () => ({
    username: '',
    password: '',
    name: '',
    email: '',
    contactPhone: ''
});

const createEmptyEditingPartner = () => ({
    id: '',
    name: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    companyName: '',
    companyAddress: '',
    companyLogo: '',
    banner: '',
    miniAppLoyalty: '',
    cdpAccessToken: '',
    cdpRefreshToken: '',
    cdpAppId: '',
    cdpAppSecretKey: '',
    partnerAppId: '',
    partnerAppSecretKey: '',
    oaId: '',
    miniGameUrl: '',
    status: 1
});

const filterPartners = createGenericFilter(PARTNER_SEARCHABLE_FIELDS);

const initialState = {
    partners: [],
    loading: false,
    searchTerm: '',
    showColumns: DEFAULT_VISIBLE_COLUMNS,
    forceReload: 0,
    dialogs: {
        create: false,
        edit: false,
        view: false,
        updateOaId: false
    },
    formData: {
        newPartner: createEmptyPartner(),
        editingPartner: createEmptyEditingPartner(),
        originalPartner: null,
        viewingPartner: null,
        updatingOaId: null
    }
};

const usePartnerActions = (dispatch, masterToast) => {
    const handleSubmitNewPartner = useCallback((e, newPartner) => {
        e?.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        
        createPartner(newPartner.username, newPartner.password, newPartner.name, newPartner.email, newPartner.contactPhone)
            .then((response) => {
                const severity = response.status === 1 ? "success" : "error";
                const summary = response.status === 1 ? "Thành công" : "Cảnh báo";
                const message = response.status === 1 ? "Đã tạo partner mới" : response.message || "Có lỗi xảy ra";
                showToast.call(masterToast, severity, summary, message);

                dispatch({ type: 'SET_DIALOG', dialog: 'create', payload: false });
                dispatch({ type: 'RESET_FORM_DATA' });
                dispatch({ type: 'REFRESH' });
            })
            .catch((e) => {
                showToast.call(masterToast, "error", "Lỗi", e.message);
            })
            .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
    }, [dispatch, masterToast]);

    const handleSubmitEditPartner = useCallback((e, editingPartner) => {
        e?.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        
        updatePartner(
            editingPartner.id,
            editingPartner.name,
            editingPartner.contactName,
            editingPartner.contactPhone,
            editingPartner.contactEmail,
            editingPartner.companyName,
            editingPartner.companyAddress,
            editingPartner.companyLogo,
            editingPartner.banner,
            editingPartner.miniAppLoyalty,
            editingPartner.status,
            editingPartner.cdpAccessToken,
            editingPartner.cdpRefreshToken,
            editingPartner.cdpAppId,
            editingPartner.cdpAppSecretKey,
            editingPartner.partnerAppId,
            editingPartner.partnerAppSecretKey,
            editingPartner.oaId,
            editingPartner.miniGameUrl
        )
        .then((response) => {
            const severity = response.status === 1 ? "success" : "error";
            const summary = response.status === 1 ? "Thành công" : "Cảnh báo";
            const message = response.status === 1 ? "Đã cập nhật partner" : response.message || "Có lỗi xảy ra";
            showToast.call(masterToast, severity, summary, message);

            dispatch({ type: 'SET_DIALOG', dialog: 'edit', payload: false });
            dispatch({ type: 'RESET_FORM_DATA' });
            dispatch({ type: 'REFRESH' });
        })
        .catch((e) => {
            showToast.call(masterToast, "error", "Lỗi", e.message);
        })
        .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
    }, [dispatch, masterToast]);

    const handleSubmitUpdateOaId = useCallback((e, updatingOaId) => {
        e?.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        
        updateOaId(
            updatingOaId.id, 
            updatingOaId.oaId, 
            updatingOaId.name, 
            updatingOaId.description
        )
        .then((response) => {
            const severity = response.status === 1 ? "success" : "error";
            const summary = response.status === 1 ? "Thành công" : "Cảnh báo";
            const message = response.status === 1 ? "Đã cập nhật OA ID" : response.message || "Có lỗi xảy ra";
            showToast.call(masterToast, severity, summary, message);

            dispatch({ type: 'SET_DIALOG', dialog: 'updateOaId', payload: false });
            dispatch({ type: 'SET_FORM_DATA', field: 'updatingOaId', payload: null });
            dispatch({ type: 'REFRESH' });
        })
        .catch((e) => {
            showToast.call(masterToast, "error", "Lỗi", e.message);
        })
        .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
    }, [dispatch, masterToast]);

    return {
        handleSubmitNewPartner,
        handleSubmitEditPartner,
        handleSubmitUpdateOaId
    };
};

const stateReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        
        case 'SET_PARTNERS':
            return { ...state, partners: action.payload };
        
        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };
        
        case 'SET_SHOW_COLUMNS':
            return { ...state, showColumns: action.payload };
        
        case 'TOGGLE_COLUMN':
            return {
                ...state,
                showColumns: state.showColumns.includes(action.payload)
                    ? state.showColumns.filter(f => f !== action.payload)
                    : [...state.showColumns, action.payload]
            };
        
        case 'TOGGLE_ALL_COLUMNS':
            return {
                ...state,
                showColumns: state.showColumns.length === action.allColumns.length
                    ? DEFAULT_VISIBLE_COLUMNS
                    : action.allColumns.map(c => c.field)
            };
        
        case 'SET_DIALOG':
            return {
                ...state,
                dialogs: { ...state.dialogs, [action.dialog]: action.payload }
            };
        
        case 'SET_FORM_DATA':
            return {
                ...state,
                formData: { ...state.formData, [action.field]: action.payload }
            };
        
        case 'RESET_FORM_DATA':
            return {
                ...state,
                formData: {
                    newPartner: createEmptyPartner(),
                    editingPartner: createEmptyEditingPartner(),
                    originalPartner: null,
                    viewingPartner: null,
                    updatingOaId: null
                }
            };
        
        case 'REFRESH':
            return { ...state, forceReload: state.forceReload + 1 };
        
        default:
            return state;
    }
};

// Column Templates
const StatusBodyTemplate = ({ status }) => (
    <Tag
        value={status === 1 ? 'Hoạt động' : 'Không hoạt động'}
        severity={status === 1 ? 'success' : 'danger'}
    />
);

const BalanceBodyTemplate = ({ balance }) => (
    <span className="text-right text-green-600">{balance?.toLocaleString()} VNĐ</span>
);

const ActionBodyTemplate = ({ onView, onEdit, onUpdateOaId }) => (
    <div className="flex gap-2 justify-content-center align-items-center">
        <Button
            icon="pi pi-eye"
            size="small"
            severity="help"
            text
            onClick={onView}
            tooltip="Xem chi tiết"
            tooltipOptions={{ position: 'top' }}
        />
        <Button
            icon="pi pi-pencil"
            size="small"
            severity="info"
            text
            onClick={onEdit}
            tooltip="Chỉnh sửa"
            tooltipOptions={{ position: 'top' }}
        />
        <Button
            label="OAID"
            severity="info"
            size="small"
            onClick={onUpdateOaId}
            className="text-sm"
        />
    </div>
);

export default function ListPartner() {
    const [state, dispatch] = useReducer(stateReducer, initialState);
    const opRef = useRef(null);
    const [masterToast] = useOutletContext();
    
    const { handleSubmitNewPartner, handleSubmitEditPartner, handleSubmitUpdateOaId } = usePartnerActions(dispatch, masterToast);
    const filteredPartners = useDataFilter(state.partners, state.searchTerm, filterPartners);

    const allColumns = useMemo(() => [
        {
            field: "id",
            header: "ID Partner",
            style: { width: "150px" }
        },
        {
            field: "ownerId",
            header: "ID Owner",
            style: { width: "120px" }
        },
        {
            field: "companyName",
            header: "Tên công ty",
            style: { width: "200px" }
        },
        {
            field: "contactPhone",
            header: "Số điện thoại",
            style: { width: "150px" }
        },
        {
            field: "contactName",
            header: "Họ và tên",
            style: { width: "200px" }
        },
        {
            field: "contactEmail",
            header: "Email",
            style: { width: "250px" }
        },
        {
            field: "balance",
            header: "Số dư",
            style: { width: "100px" },
            align: "right",
            body: (rowData) => <BalanceBodyTemplate {...rowData} />
        },
        {
            field: "status",
            header: "Trạng thái",
            style: { width: "120px" },
            align: "center",
            body: (rowData) => <StatusBodyTemplate {...rowData} />
        },
        {
            field: "time",
            header: "Thời gian",
            style: { width: "120px" },
            align: "center",
            body: (rowData) => <TimeBodyTemplate {...rowData} />
        },
        {
            field: "actions",
            header: "Hành động",
            style: { width: "250px" },
            align: "center",
            body: (rowData) => (
                <ActionBodyTemplate 
                    {...rowData} 
                    onView={() => handleViewPartner(rowData)}
                    onEdit={() => handleEditPartner(rowData)}
                    onUpdateOaId={() => handleUpdateOaId(rowData)}
                />
            )
        }
    ], []); // eslint-disable-line react-hooks/exhaustive-deps

    const visibleColumns = useMemo(
        () => allColumns.filter(col => state.showColumns.includes(col.field)),
        [state.showColumns, allColumns]
    );

    // Event Handlers
    const handleViewPartner = useCallback((partner) => {
        dispatch({ type: 'SET_FORM_DATA', field: 'viewingPartner', payload: partner });
        dispatch({ type: 'SET_DIALOG', dialog: 'view', payload: true });
    }, []);

    const handleEditPartner = useCallback((partner) => {
        const originalPartner = {
            id: partner.id || '',
            name: partner.name || '',
            ownerId: partner.ownerId || '',
            contactName: partner.contactName || '',
            contactPhone: partner.contactPhone || '',
            contactEmail: partner.contactEmail || '',
            companyName: partner.companyName || '',
            companyAddress: partner.companyAddress || '',
            companyLogo: partner.companyLogo || '',
            banner: partner.banner || '',
            miniAppLoyalty: partner.miniAppLoyalty || '',
            cdpAccessToken: partner.cdpAccessToken || '',
            cdpRefreshToken: partner.cdpRefreshToken || '',
            cdpAppId: partner.cdpAppId || '',
            cdpAppSecretKey: partner.cdpAppSecretKey || '',
            partnerAppId: partner.partnerAppId || '',
            partnerAppSecretKey: partner.partnerAppSecretKey || '',
            oaId: partner.oaId || '',
            miniGameUrl: partner.miniGameUrl || '',
            status: partner.status !== null ? partner.status : 1
        };
        
        dispatch({ type: 'SET_FORM_DATA', field: 'editingPartner', payload: partner });
        dispatch({ type: 'SET_FORM_DATA', field: 'originalPartner', payload: originalPartner });
        dispatch({ type: 'SET_DIALOG', dialog: 'edit', payload: true });
    }, []);

    const handleCreatePartner = useCallback(() => {
        dispatch({ type: 'SET_FORM_DATA', field: 'newPartner', payload: createEmptyPartner() });
        dispatch({ type: 'SET_DIALOG', dialog: 'create', payload: true });
    }, []);

    const handleUpdateOaId = useCallback((partner) => {
        dispatch({ type: 'SET_FORM_DATA', field: 'updatingOaId', payload: {id: partner.id, oaId: partner.oaId, name: "", description: ""} });
        dispatch({ type: 'SET_DIALOG', dialog: 'updateOaId', payload: true });
    }, []);

    const handleToggleColumn = useCallback((field) => {
        dispatch({ type: 'TOGGLE_COLUMN', payload: field });
    }, []);

    const handleToggleAllColumns = useCallback(() => {
        dispatch({ type: 'TOGGLE_ALL_COLUMNS', allColumns });
    }, [allColumns]);

    const handleRefresh = useCallback(() => {
        dispatch({ type: 'REFRESH' });
    }, []);

    const handleSubmitNewPartnerWrapper = useCallback((e) => {
        handleSubmitNewPartner(e, state.formData.newPartner);
    }, [handleSubmitNewPartner, state.formData.newPartner]);

    const handleSubmitEditPartnerWrapper = useCallback((e) => {
        handleSubmitEditPartner(e, state.formData.editingPartner);
    }, [handleSubmitEditPartner, state.formData.editingPartner]);

    const handleSubmitUpdateOaIdWrapper = useCallback((e) => {
        handleSubmitUpdateOaId(e, state.formData.updatingOaId);
    }, [handleSubmitUpdateOaId, state.formData.updatingOaId]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                const response = await getListPartner();
                if (response?.data) {
                    dispatch({ type: 'SET_PARTNERS', payload: response.data });
                }
            } catch (error) {
                showToast.call(masterToast, "error", "Lỗi", error.message);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        fetchPartners();
    }, [state.forceReload, masterToast]);

    return (
        <div className="w-full p-3" style={{ minHeight: "100%" }}>
            <EntityHeader
                title="Quản lý Partner"
                subtitle="Quản lý danh sách các đối tác trong hệ thống"
                onCreateClick={handleCreatePartner}
                loading={state.loading}
                icon="pi pi-users"
            />
            
            <div className="w-full border-round p-3 bg-white mb-3">
                <DataTable
                    value={filteredPartners}
                    stripedRows
                    showGridlines
                    size="small"
                    rowHover
                    header={
                        <TableHeader
                            searchTerm={state.searchTerm}
                            onSearchChange={(value) => dispatch({ type: 'SET_SEARCH_TERM', payload: value })}
                            loading={state.loading}
                            onRefresh={handleRefresh}
                            onColumnOptionsClick={(e) => opRef.current?.toggle(e)}
                            opRef={opRef}
                        />
                    }
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                    currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords}"
                    paginator
                    loading={state.loading}
                    rows={DEFAULT_ROWS_PER_PAGE}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    emptyMessage={
                        <EmptyStateTemplate 
                            searchValue={state.searchTerm}
                            onCreateClick={handleCreatePartner}
                        />
                    }
                    loadingIcon="pi pi-spinner"
                    tableStyle={{ tableLayout: 'fixed', width: '100%' }}
                >
                    {visibleColumns.map((col) => (
                        <Column 
                            {...col} 
                            key={col.field} 
                            sortable={SORTABLE_COLUMNS.includes(col.field)} 
                        />
                    ))}
                </DataTable>
            </div>

            <OverlayPanel ref={opRef}>
                <ColumnSelector
                    allColumns={allColumns}
                    showColumns={state.showColumns}
                    onToggleColumn={handleToggleColumn}
                    onToggleAll={handleToggleAllColumns}
                />
            </OverlayPanel>

            <CreatePartnerDialog
                visible={state.dialogs.create}
                onHide={() => dispatch({ type: 'SET_DIALOG', dialog: 'create', payload: false })}
                newPartner={state.formData.newPartner}
                setNewPartner={(partner) => dispatch({ type: 'SET_FORM_DATA', field: 'newPartner', payload: partner })}
                loading={state.loading}
                onSubmit={handleSubmitNewPartnerWrapper}
            />

            <EditPartnerDialog
                visible={state.dialogs.edit}
                onHide={() => dispatch({ type: 'SET_DIALOG', dialog: 'edit', payload: false })}
                editingPartner={state.formData.editingPartner}
                setEditingPartner={(partner) => dispatch({ type: 'SET_FORM_DATA', field: 'editingPartner', payload: partner })}
                loading={state.loading}
                onSubmit={handleSubmitEditPartnerWrapper}
                originalPartner={state.formData.originalPartner}
            />

            {state.formData.viewingPartner && (
                <ViewPartnerDialog
                    visible={state.dialogs.view}
                    onHide={() => dispatch({ type: 'SET_DIALOG', dialog: 'view', payload: false })}
                    partnerId={state.formData.viewingPartner?.id}
                />
            )}

            {state.formData.updatingOaId && (
                <UpdateOaIdDialog
                    visible={state.dialogs.updateOaId}
                    onHide={() => dispatch({ type: 'SET_DIALOG', dialog: 'updateOaId', payload: false })}
                    updatingOaId={state.formData.updatingOaId}
                    setUpdatingOaId={(oaId) => dispatch({ type: 'SET_FORM_DATA', field: 'updatingOaId', payload: oaId })}
                    loading={state.loading}
                    onSubmit={handleSubmitUpdateOaIdWrapper}
                />
            )}
        </div>
    );
}
