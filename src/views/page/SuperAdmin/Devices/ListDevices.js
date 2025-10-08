import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { createDevice, getDevices } from "../../../../service/requestAPI";
import { showToast } from "../../Admin/common";
import { NameBodyTemplate, TimeBodyTemplate } from "../Common/components/ColumnTemplates";
import { ColumnSelector, EmptyStateTemplate, TableHeader } from "../Common/components/DataTable";
import { EntityHeader } from "../Common/components/PageHeader";
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from "../Common/constants/dataTable";
import { useDataFilter } from "../Common/hooks/useDataFilter";
import { createGenericFilter } from "../Common/utils/filterHelpers";
import CreateDeviceDialog from "./CreateDeviceDialog";

const DEFAULT_VISIBLE_COLUMNS = ['id', 'name', 'serialNumber', 'macAddress'];
const SORTABLE_COLUMNS = ['id', 'name', 'serialNumber', 'macAddress'];
const DEVICE_SEARCHABLE_FIELDS = ['id', 'name', 'serialNumber', 'macAddress'];

const createEmptyDevice = () => ({
    deviceId: '',
    name: '',
    serialNumber: '',
    macAddress: ''
});

const filterDevices = createGenericFilter(DEVICE_SEARCHABLE_FIELDS);

export default function ListDevices() {
    const [devices, setDevices] = useState([]);
    const [forceReload, setForceReload] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newDevice, setNewDevice] = useState(createEmptyDevice());
    const [searchTerm, setSearchTerm] = useState('');
    const [showColumns, setShowColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
    
    const opRef = useRef(null);
    const [masterToast] = useOutletContext();

    const filteredDevices = useDataFilter(devices, searchTerm, filterDevices);

    const allColumns = useMemo(() => [
        {
            field: "id",
            header: "ID",
            style: { width: "150px" }
        },
        {
            field: "name",
            header: "Tên thiết bị",
            style: { width: "250px" },
            body: (rowData) => <NameBodyTemplate {...rowData} />
        },
        {
            field: "serialNumber",
            header: "Số Serial",
            style: { width: "200px" }
        },
        {
            field: "macAddress",
            header: "Địa chỉ MAC",
            style: { width: "200px" }
        },
        {
            field: "time",
            header: "Thời gian tạo",
            style: { width: "180px" },
            align: "center",
            body: (rowData) => <TimeBodyTemplate {...rowData} />
        }
    ], []); // eslint-disable-line react-hooks/exhaustive-deps

    const visibleColumns = useMemo(
        () => allColumns.filter(col => showColumns.includes(col.field)),
        [showColumns, allColumns]
    );

    // Event Handlers
    const handleCreateDevice = useCallback(() => {
        setNewDevice(createEmptyDevice());
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

    const handleSubmitNewDevice = useCallback((e) => {
        e?.preventDefault();
        setLoading(true);
        
        createDevice(newDevice.deviceId, newDevice.name, newDevice.serialNumber, newDevice.macAddress)
            .then((response) => {
                const severity = response.status === 1 ? "success" : "error";
                const summary = response.status === 1 ? "Thành công" : "Cảnh báo";
                const message = response.status === 1 ? "Đã tạo thiết bị mới" : response.message || "Có lỗi xảy ra";
                showToast.call(masterToast, severity, summary, message);

                setShowCreateDialog(false);
                setNewDevice(createEmptyDevice());
                handleRefresh();
            })
            .catch((e) => {
                showToast.call(masterToast, "error", "Lỗi", e.message);
            })
            .finally(() => setLoading(false));
    }, [newDevice, masterToast, handleRefresh]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                setLoading(true);
                const response = await getDevices();
                if (response?.data) {
                    setDevices(response.data);
                }
            } catch (error) {
                showToast.call(masterToast, "error", "Lỗi", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, [forceReload, masterToast]);

    return (
        <div className="w-full p-3" style={{ minHeight: "100%" }}>
            <EntityHeader    
                title="Quản lý Thiết bị"
                subtitle="Quản lý danh sách các thiết bị trong hệ thống"
                onCreateClick={handleCreateDevice} 
                loading={loading} 
                icon="pi pi-desktop"
            />
            
            <div className="w-full border-round p-3 bg-white mb-3">
                <DataTable
                    value={filteredDevices}
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
                            onCreateClick={handleCreateDevice}
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

            <CreateDeviceDialog
                visible={showCreateDialog}
                onHide={() => setShowCreateDialog(false)}
                newDevice={newDevice}
                setNewDevice={setNewDevice}
                loading={loading}
                onSubmit={handleSubmitNewDevice}
            />
        </div>
    );
}