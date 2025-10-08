import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { createZaloApp, getZaloApps } from "../../../../service/requestAPI";
import { showToast } from "../../Admin/common";
import { NameBodyTemplate, TimeBodyTemplate } from "../Common/components/ColumnTemplates";
import { ColumnSelector, EmptyStateTemplate, TableHeader } from "../Common/components/DataTable";
import { EntityHeader } from "../Common/components/PageHeader";
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from "../Common/constants/dataTable";
import { useDataFilter } from "../Common/hooks/useDataFilter";
import { createGenericFilter } from "../Common/utils/filterHelpers";
import CreateZaloAppDialog from "./CreateZaloAppDialog";
import ListZaloMiniApp from "./ListZaloMiniApp";

const DEFAULT_VISIBLE_COLUMNS = ['id', 'partnerId', 'name', 'description', 'actions'];
const SORTABLE_COLUMNS = ['id', 'partnerId', 'name'];
const ZALO_APP_SEARCHABLE_FIELDS = ['id', 'name', 'description', 'partnerId'];

const createEmptyZaloApp = () => ({
    id: '',
    name: '',
    description: ''
});

const filterZaloApps = createGenericFilter(ZALO_APP_SEARCHABLE_FIELDS);

const PartnerIdBodyTemplate = ({ partnerId }) => (
    <span>{partnerId || 'Chưa có'}</span>
);

const ActionBodyTemplate = ({ onViewMiniApps }) => (
    <div className="flex gap-2 justify-content-center align-items-center">
        <Button
            size="small"
            severity="info"
            label="Mini Apps"
            className="p-button-success"
            onClick={onViewMiniApps}
            tooltip="Xem danh sách Mini Apps"
            tooltipOptions={{ position: 'top' }}
        />
    </div>
);

export default function ListZaloApp() {
    const [zaloApps, setZaloApps] = useState([]);
    const [forceReload, setForceReload] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showMiniApps, setShowMiniApps] = useState(false);
    const [newZaloApp, setNewZaloApp] = useState(createEmptyZaloApp());
    const [selectedZaloApp, setSelectedZaloApp] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showColumns, setShowColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
    
    const opRef = useRef(null);
    const [masterToast] = useOutletContext();

    const filteredZaloApps = useDataFilter(zaloApps, searchTerm, filterZaloApps);

    const allColumns = useMemo(() => [
        {
            field: "id",
            header: "App ID",
            style: { width: "200px" }
        },
        {
            field: "partnerId",
            header: "Partner ID",
            style: { width: "250px" },
            body: (rowData) => <PartnerIdBodyTemplate {...rowData} />
        },
        {
            field: "name",
            header: "Tên ứng dụng",
            style: { width: "250px" },
            body: (rowData) => <NameBodyTemplate {...rowData} />
        },
        {
            field: "description",
            header: "Mô tả",
            style: { width: "300px" }
        },
        {
            field: "time",
            header: "Thời gian",
            style: { width: "150px" },
            align: "center",
            body: (rowData) => <TimeBodyTemplate {...rowData} />
        },
        {
            field: "actions",
            header: "Hành động",
            style: { width: "150px" },
            align: "center",
            body: (rowData) => <ActionBodyTemplate {...rowData} onViewMiniApps={() => handleViewMiniApps(rowData)} />
        }
    ], []); // eslint-disable-line react-hooks/exhaustive-deps

    const visibleColumns = useMemo(
        () => allColumns.filter(col => showColumns.includes(col.field)),
        [showColumns, allColumns]
    );

    // Event Handlers
    const handleViewMiniApps = useCallback((zaloApp) => {
        setSelectedZaloApp(zaloApp);
        setShowMiniApps(true);
    }, []);

    const handleCreateZaloApp = useCallback(() => {
        setNewZaloApp(createEmptyZaloApp());
        setShowCreateDialog(true);
    }, []);

    const handleToggleColumn = useCallback((field) => {
        setShowColumns(prev =>
            prev.includes(field) 
                ? prev.filter(f => f !== field) 
                : [...prev, field]
        );
    }, []);

    const handleToggleAllColumns = useCallback(() => {
        setShowColumns(prev =>
            prev.length === allColumns.length 
                ? DEFAULT_VISIBLE_COLUMNS 
                : allColumns.map(c => c.field)
        );
    }, [allColumns]);

    const handleRefresh = useCallback(() => {
        setForceReload(prev => prev + 1);
    }, []);

    const handleSubmitNewZaloApp = useCallback((e) => {
        e?.preventDefault();
        setLoading(true);
        
        createZaloApp(newZaloApp.id, newZaloApp.name, newZaloApp.description)
            .then((response) => {
                const severity = response.status === 1 ? "success" : "error";
                const summary = response.status === 1 ? "Thành công" : "Cảnh báo";
                const message = response.status === 1 ? "Đã tạo Zalo App mới" : response.message || "Có lỗi xảy ra";
                showToast.call(masterToast, severity, summary, message);

                setShowCreateDialog(false);
                setNewZaloApp(createEmptyZaloApp());
                handleRefresh();
            })
            .catch((e) => {
                showToast.call(masterToast, "error", "Lỗi", e.message);
            })
            .finally(() => setLoading(false));
    }, [newZaloApp, masterToast, handleRefresh]);

    useEffect(() => {
        const fetchZaloApps = async () => {
            try {
                setLoading(true);
                const response = await getZaloApps();
                if (response?.data) {
                    setZaloApps(response.data);
                }
            } catch (error) {
                showToast.call(masterToast, "error", "Lỗi", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchZaloApps();
    }, [forceReload, masterToast]);

    return (
        <div className="w-full p-3" style={{ minHeight: "100%" }}>
            <EntityHeader
                title="Quản lý Zalo App"
                subtitle="Quản lý danh sách các ứng dụng Zalo trong hệ thống"
                onCreateClick={handleCreateZaloApp}
                loading={loading}
                icon="pi pi-mobile"
            />
            
            <div className="w-full border-round p-3 bg-white mb-3">
                <DataTable
                    value={filteredZaloApps}
                    stripedRows
                    showGridlines
                    size="small"
                    rowHover
                    header={
                        <TableHeader
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            loading={loading}
                            onRefresh={handleRefresh}
                            onColumnOptionsClick={(e) => opRef.current?.toggle(e)}
                            opRef={opRef}
                        />
                    }
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                    currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords}"
                    paginator
                    loading={loading}
                    rows={DEFAULT_ROWS_PER_PAGE}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    emptyMessage={
                        <EmptyStateTemplate 
                            searchValue={searchTerm}
                            onCreateClick={handleCreateZaloApp}
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
                    showColumns={showColumns}
                    onToggleColumn={handleToggleColumn}
                    onToggleAll={handleToggleAllColumns}
                />
            </OverlayPanel>

            <CreateZaloAppDialog
                visible={showCreateDialog}
                onHide={() => setShowCreateDialog(false)}
                newZaloApp={newZaloApp}
                setNewZaloApp={setNewZaloApp}
                loading={loading}
                onSubmit={handleSubmitNewZaloApp}
            />

            <Sidebar
                visible={showMiniApps}
                onHide={() => setShowMiniApps(false)}
                position="right"
                style={{ width: '100vw' }}
                className="p-sidebar-full"
                closeIcon={true}
                header={() => (
                    <div className="flex justify-content-between align-items-center">
                        <Button
                            icon="pi pi-chevron-left"
                            className="p-button-text p-button-rounded"
                            onClick={() => setShowMiniApps(false)}
                            label="Quay về"
                            severity="secondary"
                            size="small"
                        />
                    </div>
                )}
            >
                {selectedZaloApp && (
                    <ListZaloMiniApp 
                        zaloApp={selectedZaloApp}
                        onClose={() => setShowMiniApps(false)}
                        masterToast={masterToast}
                    />
                )}
            </Sidebar>
        </div>
    );
}
