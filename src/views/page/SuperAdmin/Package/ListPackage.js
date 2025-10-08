import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPackages } from "../../../../service/requestAPI";
import { formatCurrencyVND } from "../../../../util/func";
import { showToast } from "../../Admin/common";
import { NameBodyTemplate, TimeBodyTemplate } from "../Common/components/ColumnTemplates";
import { ColumnSelector, EmptyStateTemplate, TableHeader } from "../Common/components/DataTable";
import { EntityHeader } from "../Common/components/PageHeader";
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from "../Common/constants/dataTable";
import { useDataFilter } from "../Common/hooks/useDataFilter";
import { createGenericFilter } from "../Common/utils/filterHelpers";
import CreatePackageDialog from "./CreatePackageDialog";

const DEFAULT_VISIBLE_COLUMNS = ['id', 'name', 'description', 'features', 'amount', 'durationDay', 'public'];
const SORTABLE_COLUMNS = ['id', 'name', 'amount', 'durationDay'];
const PACKAGE_SEARCHABLE_FIELDS = ['id', 'name', 'description', 'features', 'amount', 'durationDay'];

const createEmptyPackage = () => ({
    name: '',
    description: '',
    features: '',
    amount: '',
    duration: ''
});

const filterPackages = createGenericFilter(PACKAGE_SEARCHABLE_FIELDS);

// Column Templates
const AmountBodyTemplate = ({ premium, amount }) => (
    <span className="text-right text-green-600 font-semibold">
        {premium ? (
            <span className="text-red-500">Liên hệ</span>
        ) : (
            formatCurrencyVND(amount)
        )}
    </span>
);

const StatusBodyTemplate = ({ public: isPublic }) => {
    const value = isPublic ? 'Công khai' : 'Riêng tư';
    const severity = isPublic ? 'success' : 'secondary';
    return <Badge value={value} severity={severity} />;
};

const FeaturesBodyTemplate = ({ id, features = [], onFeaturesClick }) => {
    const displayText = features.length > 2 
        ? `${features.slice(0, 2).join(", ")} (+${features.length - 2} khác)`
        : features.join(", ");

    return (
        <div className="flex align-items-center gap-2">
            <span className="text-overflow-ellipsis">{displayText}</span>
            {features.length > 0 && (
                <Button
                    id={`features-${id}`}
                    icon="pi pi-info-circle"
                    size="small"
                    text
                    rounded
                    severity="info"
                    onClick={(e) => onFeaturesClick(e, features)}
                    tooltip="Xem tất cả tính năng"
                    tooltipOptions={{ position: 'top' }}
                />
            )}
        </div>
    );
};

const FeaturesPanel = ({ featuresOpRef, features }) => (
    <OverlayPanel 
        ref={featuresOpRef} 
        style={{ width: '300px' }}
        dismissable
        appendTo="self"
    >
        <div className="p-3">
            {features.length > 0 ? (
                <div className="flex flex-column gap-2">
                    {features.map((feature, index) => (
                        <div key={index} className="flex align-items-center gap-2 p-2 border-round bg-blue-50">
                            <i className="pi pi-check-circle text-green-500" />
                            <span className="text-sm">{feature}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-3">
                    <i className="pi pi-info-circle text-2xl text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">Không có tính năng nào</p>
                </div>
            )}
        </div>
    </OverlayPanel>
);

const TableFooter = () => (
    <div className='mt-5'>
        <p className='text-sm'>Trạng thái <StatusBodyTemplate public={true} /> : Cho phép mua</p>
        <p className='text-sm'>Trạng thái <StatusBodyTemplate public={false} /> : Không hiển thị với đối tác</p>
    </div>
);

export default function ListPackage() {
    const [packages, setPackages] = useState([]);
    const [forceReload, setForceReload] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newPackage, setNewPackage] = useState(createEmptyPackage());
    const [searchTerm, setSearchTerm] = useState('');
    const [showColumns, setShowColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    
    const opRef = useRef(null);
    const featuresOpRef = useRef(null);
    const [masterToast] = useOutletContext();

    const filteredPackages = useDataFilter(packages, searchTerm, filterPackages);

    const allColumns = useMemo(() => [
        {
            field: "id",
            header: "ID",
            style: { width: "150px" }
        },
        {
            field: "name",
            header: "Tiêu đề",
            style: { width: "250px" },
            body: (rowData) => <NameBodyTemplate {...rowData} />
        },
        {
            field: "description",
            header: "Mô tả",
            style: { width: "300px" }
        },
        {
            field: "features",
            header: "Tính năng",
            body: (rowData) => <FeaturesBodyTemplate {...rowData} onFeaturesClick={handleFeaturesClick} />
        },
        {
            field: "amount",
            header: "Giá",
            style: { width: "150px" },
            align: "right",
            body: (rowData) => <AmountBodyTemplate {...rowData} />
        },
        {
            field: "durationDay",
            header: "Thời gian (ngày)",
            style: { width: "150px" },
            align: "center"
        },
        {
            field: "public",
            header: "Trạng thái",
            style: { width: "120px" },
            align: "center",
            body: (rowData) => <StatusBodyTemplate {...rowData} />
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
    const handleFeaturesClick = useCallback((e, features) => {
        e.preventDefault();
        e.stopPropagation();

        if (featuresOpRef.current?.isVisible()) {
            featuresOpRef.current?.hide();
        }

        setSelectedFeatures(features);
        featuresOpRef.current?.show(e, e.currentTarget);
    }, []);

    const handleCreatePackage = useCallback(() => {
        setNewPackage(createEmptyPackage());
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

    const handleSubmitNewPackage = useCallback((e) => {
        e?.preventDefault();
        setLoading(true);
        
        // TODO: Implement createPackage API call
        // When implemented, follow this pattern:
        // try {
        //     const response = await createPackage(newPackage);
        //     const severity = response.status === 1 ? "success" : "error";
        //     const summary = response.status === 1 ? "Thành công" : "Cảnh báo";
        //     const message = response.status === 1 ? "Đã tạo gói mới" : response.message || "Có lỗi xảy ra";
        //     showToast.call(masterToast, severity, summary, message);
        //     setShowCreateDialog(false);
        //     setNewPackage(createEmptyPackage());
        //     handleRefresh();
        // } catch (error) {
        //     showToast.call(masterToast, "error", "Lỗi", error.message);
        // } finally {
        //     setLoading(false);
        // }

        // Temporary implementation
        setShowCreateDialog(false);
        setNewPackage(createEmptyPackage());
        setLoading(false);
    }, [newPackage, masterToast]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const response = await getPackages();
                if (response?.data) {
                    setPackages(response.data);
                }
            } catch (error) {
                showToast.call(masterToast, "error", "Lỗi", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [forceReload, masterToast]);

    return (
        <div className="w-full p-3" style={{ minHeight: "100%" }}>
            <EntityHeader
                title="Quản lý Gói"
                subtitle="Quản lý danh sách các gói dịch vụ trong hệ thống"
                onCreateClick={handleCreatePackage}
                loading={loading}
                icon="pi pi-box"
            />
            
            <div className="w-full border-round p-3 bg-white mb-3">
                <DataTable
                    value={filteredPackages}
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
                    footer={<TableFooter />}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                    currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords}"
                    paginator
                    loading={loading}
                    rows={DEFAULT_ROWS_PER_PAGE}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    emptyMessage={
                        <EmptyStateTemplate 
                            searchValue={searchTerm}
                            onCreateClick={handleCreatePackage}
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

            <FeaturesPanel 
                featuresOpRef={featuresOpRef} 
                features={selectedFeatures} 
            />

            <CreatePackageDialog
                visible={showCreateDialog}
                onHide={() => setShowCreateDialog(false)}
                newPackage={newPackage}
                setNewPackage={setNewPackage}
                loading={loading}
                onSubmit={handleSubmitNewPackage}
            />
        </div>
    );
}