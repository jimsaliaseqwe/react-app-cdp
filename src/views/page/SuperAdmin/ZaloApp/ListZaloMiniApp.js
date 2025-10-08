import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createZaloMiniApp } from "../../../../service/requestAPI";
import { showToast } from "../../Admin/common";
import { NameBodyTemplate, TimeBodyTemplate } from "../Common/components/ColumnTemplates";
import { ColumnSelector, EmptyStateTemplate } from "../Common/components/DataTable";
import { EntityHeader } from "../Common/components/PageHeader";
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from "../Common/constants/dataTable";
import { useDataFilter } from "../Common/hooks/useDataFilter";
import { createGenericFilter } from "../Common/utils/filterHelpers";
import CreateZaloMiniAppDialog from "./CreateZaloMiniAppDialog";

const DEFAULT_VISIBLE_COLUMNS = ['id', 'partnerId', 'name', 'group', 'oaId'];
const SORTABLE_COLUMNS = ['id', 'name', 'partnerId', 'oaId'];
const ZALO_MINI_APP_SEARCHABLE_FIELDS = ['id', 'name', 'group', 'oaId', 'partnerId'];

const createEmptyZaloMiniApp = () => ({
    id: '',
    name: '',
    oaId: ''
});

const filterZaloMiniApps = createGenericFilter(ZALO_MINI_APP_SEARCHABLE_FIELDS);

const PartnerIdBodyTemplate = ({ partnerId }) => (
    <span>{partnerId || 'Chưa có'}</span>
);

const TableHeader = ({ 
    searchTerm, 
    onSearchChange, 
    loading, 
    onColumnOptionsClick,
    opRef,
    zaloAppName 
}) => (
    <div className="flex justify-content-between align-items-center mb-3">
        <h5 className="text-base m-0">Danh sách Mini Apps: {zaloAppName}</h5>
        <div className="flex align-items-center gap-2">
            <span className="p-input-icon-left">
                <i className="pi pi-search ml-2" />
                <InputText
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Tìm kiếm..."
                    size="small"
                    style={{ width: '180px', paddingLeft: '2.5rem' }}
                />
            </span>
            <Button
                size="small"
                type="button"
                icon="pi pi-ellipsis-v"
                className="ml-1"
                text
                loading={loading}
                onClick={onColumnOptionsClick}
            />
        </div>
        <OverlayPanel ref={opRef} />
    </div>
);

export default function ListZaloMiniApp({ zaloApp, masterToast, onClose }) {
    const [miniApps, setMiniApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newMiniApp, setNewMiniApp] = useState(createEmptyZaloMiniApp());
    const [searchTerm, setSearchTerm] = useState('');
    const [showColumns, setShowColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
    
    const opRef = useRef(null);

    const filteredMiniApps = useDataFilter(miniApps, searchTerm, filterZaloMiniApps);

    const allColumns = useMemo(() => [
        {
            field: "id",
            header: "ID",
            style: { width: "200px" }
        },
        {
            field: "name",
            header: "Tên Mini App",
            style: { width: "300px" },
            body: (rowData) => <NameBodyTemplate {...rowData} />
        },
        {
            field: "partnerId",
            header: "Partner ID",
            style: { width: "250px" },
            body: (rowData) => <PartnerIdBodyTemplate {...rowData} />
        },
        {
            field: "oaId",
            header: "OA ID",
            style: { width: "200px" }
        },
        {
            field: "group",
            header: "Group",
            style: { width: "300px" }
        },
        {
            field: "time",
            header: "Thời gian tạo",
            style: { width: "180px" },
            body: (rowData) => <TimeBodyTemplate {...rowData} />
        }
    ], []); // eslint-disable-line react-hooks/exhaustive-deps

    const visibleColumns = useMemo(
        () => allColumns.filter(col => showColumns.includes(col.field)),
        [showColumns, allColumns]
    );

    // Event Handlers
    const handleCreateMiniApp = useCallback(() => {
        setNewMiniApp(createEmptyZaloMiniApp());
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

    const handleSubmitNewMiniApp = useCallback((e) => {
        e?.preventDefault();
        setLoading(true);
    
        createZaloMiniApp(
            zaloApp.partnerId,
            zaloApp.id,
            newMiniApp.id,
            newMiniApp.name,
            newMiniApp.oaId
        )
        .then((response) => {
            showToast.call(masterToast, "success", "Thành công", "Đã tạo mini app");
            setShowCreateDialog(false);
            setNewMiniApp(createEmptyZaloMiniApp());
            setMiniApps([...miniApps, response.data]);
        })
        .catch((e) => {
            showToast.call(masterToast, "error", "Lỗi", e.message);
        })
        .finally(() => setLoading(false));
    }, [zaloApp, newMiniApp, masterToast, miniApps]);

    useEffect(() => {
        if (zaloApp && zaloApp.zaloMiniApps) {
            setMiniApps(zaloApp.zaloMiniApps);
        }
    }, [zaloApp]);

    return (
        <div className="w-full h-full">
            <EntityHeader
                title="Quản lý Mini Apps"
                subtitle="Quản lý danh sách các mini apps"
                onCreateClick={handleCreateMiniApp}
                loading={loading}
                icon="pi pi-mobile"
            />
            
            <div className="w-full border-round p-3 bg-white">
                <DataTable
                    value={filteredMiniApps}
                    stripedRows
                    showGridlines
                    size="small"
                    rowHover
                    header={
                        <TableHeader
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            loading={loading}
                            onColumnOptionsClick={(e) => opRef.current?.toggle(e)}
                            opRef={opRef}
                            zaloAppName={zaloApp?.name}
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
                            onCreateClick={handleCreateMiniApp}
                            icon="pi pi-mobile"
                            entityName="Mini App"
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

            <CreateZaloMiniAppDialog
                visible={showCreateDialog}
                onHide={() => setShowCreateDialog(false)}
                newMiniApp={newMiniApp}
                setNewMiniApp={setNewMiniApp}
                loading={loading}
                onSubmit={handleSubmitNewMiniApp}
                zaloAppId={zaloApp?.id}
                partnerId={zaloApp?.partnerId}
            />
        </div>
    );
}
