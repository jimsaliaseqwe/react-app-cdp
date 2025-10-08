import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getVouchers } from '../../../../service/requestAPI';
import { formatDMYHIS } from '../../../../util/func';
import { useFetchResources } from '../../../Component/Resources';

export default function Voucher() {
    const partnerId = useSelector(({ auth: { userid } }) => userid);
    const [myVouchers, setMyVouchers] = useState([]);
    const [showColumns, setShowColumns] = useState(getShowColumnsDefault());
    const [forceReload, setForceReload] = useState(0);
    const opRef = useRef(null);
    const [paginator, setPaginator] = useState(false);
    const [page, setPage] = useState({
        current: 0,
        rows: ROWS_PER_PAGE_OPTIONS[2],
    });
    const [pageFirst, setPageFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(getFilterDefault());
    const [filterValues, setFilterValues] = useState({});
    const [
        responseData = {
            data: {
                vouchers: [],
                total: 0,
            },
        },
        ,
        loading,
        setLoading,
    ] = useFetchResources(
        useCallback(
            getVouchers.bind(null, {
                partnerId,
                limit: page.rows,
                page: page.current + 1,
                ...filterValues,
            }),
            [page, partnerId, filterValues],
        ),
        forceReload,
    );

    useEffect(() => {
        const newFilterValues = {};
        for (const filed of FILTER_FIELDS) {
            if (filters[filed].constraints[0].value) {
                newFilterValues[filed] = filters[filed].constraints[0].value;
            }
        }
        setFilterValues(newFilterValues);
    }, [filters]);

    const clearFilter = () => {
        setFilters(getFilterDefault());
    };

    useEffect(() => {
        if (responseData?.data && responseData.data.vouchers) {
            const { vouchers, total } = responseData.data;
            setMyVouchers(
                [...vouchers].map((i) => ({ ...i, id: i.voucherId })),
            );
            setTotalRecords(total);
            setPageFirst(page.current * page.rows);
            setPaginator(total > ROWS_PER_PAGE_OPTIONS[0]);
        }
    }, [responseData]);

    const toggleColumn = (field) => {
        setShowColumns((prev) =>
            prev.includes(field)
                ? prev.filter((f) => f !== field)
                : [...prev, field],
        );
    };

    const onPage = useCallback((e) => {
        setPage({ current: e.page, rows: e.rows });
    }, []);

    const allChecked = useMemo(
        () => showColumns.length === ALL_COLUMNS.length,
        [showColumns],
    );

    const toggleAll = () => {
        if (allChecked) {
            setShowColumns(getShowColumnsDefault());
        } else {
            setShowColumns(ALL_COLUMNS.map((c) => c.field));
        }
    };

    const getColumns = useCallback(() => {
        return ALL_COLUMNS.filter((i) => showColumns.includes(i.field));
    }, [showColumns]);

    const filteredTemplate = useCallback(() => {
        const keys = Object.keys(filterValues);
        if (keys.length === 0) {
            return null;
        }

        return (
            <div className="ml-auto flex align-items-center">
                <div className="mr-1">Tìm kiếm:</div>
                {keys.map((key) => {
                    let value = filterValues[key];
                    if (key === 'status') {
                        value =
                            STATUS_TYPE.find((i) => i.value === value)?.label ||
                            value;
                    } else if (key === 'type') {
                        value =
                            TEMPLATE_TYPE.find((i) => i.value === value)
                                ?.label || value;
                    }
                    const label = getColumnHeaderByField(key);
                    return (
                        <div key={key} className="mr-1">
                            <Chip
                                removable
                                label={`${label}: ${value}`}
                                onRemove={() => {
                                    setFilters((prevState) => {
                                        const newState = { ...prevState };
                                        newState[key].constraints[0].value =
                                            null;
                                        return newState;
                                    });
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }, [filterValues]);

    function TableHeader() {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="text-xl m-0">Danh sách Voucher</h5>
                {filteredTemplate()}
                <div>
                    <Button
                        size="small"
                        type="button"
                        icon="pi pi-refresh"
                        className="ml-2"
                        text
                        title="Làm mới"
                        severity="success"
                        loading={loading}
                        onClick={() => {
                            setForceReload((prev) => prev + 1);
                        }}
                    />
                    <Button
                        size="small"
                        type="button"
                        icon="pi pi-ellipsis-v"
                        className="ml-1"
                        text
                        loading={loading}
                        onClick={(e) => opRef.current.toggle(e)}
                    />
                </div>

                <OverlayPanel ref={opRef}>
                    <div
                        className="p-fluid"
                        style={{
                            maxHeight: '350px',
                            overflowY: 'auto',
                        }}
                    >
                        <div className="p-field-checkbox py-2">
                            <Checkbox
                                inputId="__all_columns"
                                checked={allChecked}
                                onChange={toggleAll}
                            />
                            <label htmlFor="__all_columns"></label>
                        </div>
                        {ALL_COLUMNS.map((col) => (
                            <div
                                key={col.field}
                                className="p-field-checkbox py-2"
                            >
                                <Checkbox
                                    inputId={col.field}
                                    checked={showColumns.includes(col.field)}
                                    onChange={() => toggleColumn(col.field)}
                                />
                                &nbsp;
                                <label htmlFor={col.field}>{col.header}</label>
                            </div>
                        ))}
                    </div>
                </OverlayPanel>
            </div>
        );
    }

    return (
        <div className="w-full p-3" style={{ minHeight: '100%' }}>
            <h2 className="text-2xl">Quản lý Voucher</h2>
            <div className="w-full border-round p-3 bg-white mb-3">
                <DataTable
                    value={myVouchers}
                    stripedRows
                    showGridlines
                    size="small"
                    rowHover
                    header={TableHeader}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                    currentPageReportTemplate="{first}-{last} ({totalRecords} Vouchers)"
                    filters={filters}
                    totalRecords={totalRecords}
                    lazy
                    paginator={paginator}
                    loading={loading}
                    rows={page.rows}
                    onPage={onPage}
                    first={pageFirst}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    onFilter={(e) => setFilters(e.filters)}
                    resizableColumns
                    tableStyle={{ tableLayout: 'fixed', width: '100%' }}
                >
                    {getColumns().map((props, i) => {
                        return <Column {...props} key={i} />;
                    })}
                </DataTable>
            </div>
        </div>
    );
}

export const TEMPLATE_TYPE = [
    { label: 'Giảm giá', value: 'discount', className: 'bg-green-500' },
    { label: 'Quà', value: 'gift', className: 'bg-blue-500' },
    { label: 'Điểm', value: 'point', className: 'bg-red-500' },
    { label: 'Phần trăm', value: 'percent', className: 'bg-orange-500' },
    { label: 'Miễn phí ship', value: 'shipping', className: 'bg-teal-500' },
    {
        label: 'Ưu đãi theo kỳ hạn',
        value: 'period',
        className: 'bg-indigo-500',
    },
];

export const TEMPLATE_TYPE_WITHOUT_CLASSNAME = TEMPLATE_TYPE.map((i) => {
    const { className, ...res } = i;
    return { ...res };
});

const STATUS_TYPE = [
    { label: 'Khả dụng', value: 'active', severity: 'success' },
    { label: 'Đã sử dụng', value: 'used', severity: 'primary' },
];

export function getTemplateTypeByValue(_value) {
    return (
        TEMPLATE_TYPE.find(({ value }) => value === _value) || {
            label: _value,
            severity: 'secondary',
        }
    );
}

function StatusItemTemplate({ label, severity }) {
    return <Badge value={label} severity={severity} />;
}

function StatusFilterTemplate(options) {
    return (
        <Dropdown
            value={options.value}
            options={STATUS_TYPE}
            size="small"
            onChange={(e) => options.filterCallback(e.value, options.index)}
            itemTemplate={StatusItemTemplate}
            placeholder="Chọn trại thái"
            className="p-column-filter"
        />
    );
}

function TypeItemTemplate({ label, itemClassName }) {
    return <Badge value={label} className={itemClassName} />;
}

function TypeFilterTemplate(options) {
    return (
        <Dropdown
            value={options.value}
            options={TEMPLATE_TYPE.map((i) => {
                const { className, ...r } = i;
                return { ...r, itemClassName: className };
            })}
            size="small"
            onChange={(e) => options.filterCallback(e.value, options.index)}
            itemTemplate={TypeItemTemplate}
            placeholder="Chọn loại"
            className="p-column-filter"
        />
    );
}

const ROWS_PER_PAGE_OPTIONS = [10, 15, 20, 50, 100];

const FILTER_FIELDS = ['userId', 'status', 'type', 'code', 'phone'];

const ALL_COLUMNS = [
    { field: 'id', header: 'ID', style: { width: '4rem' } },
    {
        field: 'code',
        header: 'Mã voucher',
        style: { width: '8rem' },
        body({ code }) {
            return <code>{code}</code>;
        },
        filter: true,
        filterPlaceholder: 'Tìm với Code Voucher',
        showFilterMatchModes: false,
        showFilterMenuOptions: false,
        filterApply({ filterApplyCallback }) {
            return (
                <Button
                    label="Tìm"
                    className="px-2 py-1"
                    onClick={filterApplyCallback}
                />
            );
        },
        filterClear({ filterClearCallback }) {
            return (
                <Button
                    label="Reset"
                    className="px-2 py-1"
                    text
                    onClick={filterClearCallback}
                />
            );
        },
    },
    {
        field: 'templateName',
        header: 'Voucher',
        style: {
            textOverflow: 'ellipsis',
        },
    },
    /*{field: "fullName", header: "Họ và tên"},*/
    {
        field: 'note',
        header: 'Ghi chú',
        style: {
            textOverflow: 'ellipsis',
        },
    },
    {
        field: 'templateType',
        header: 'Loại',
        style: { width: '9rem' },
        filter: true,
        filterPlaceholder: 'Tìm với Loại Voucher',
        showFilterMatchModes: false,
        showFilterMenuOptions: false,
        filterElement: TypeFilterTemplate,
        body({ templateType: type }) {
            const { label, className = '' } = TEMPLATE_TYPE.find(
                (i) => i.value === type,
            ) || {
                label: type,
                className: '',
            };
            return <Badge className={className} value={label} />;
        },
        filterApply({ filterApplyCallback }) {
            return (
                <Button
                    label="Tìm"
                    className="px-2 py-1"
                    onClick={filterApplyCallback}
                />
            );
        },
        filterClear({ filterClearCallback }) {
            return (
                <Button
                    label="Reset"
                    className="px-2 py-1"
                    text
                    onClick={filterClearCallback}
                />
            );
        },
    },
    { field: 'templateId', header: 'Template ID' },
    {
        field: 'userId',
        header: 'Khách hàng',
        body({ userId, fullName }) {
            return (
                <>
                    <span>{fullName}</span>&nbsp;
                    <small className="text-gray-500">
                        <code>({userId})</code>
                    </small>
                </>
            );
        },
        filter: true,
        filterPlaceholder: 'Tìm với ID khách hàng',
        showFilterMatchModes: false,
        showFilterMenuOptions: false,
        style: {
            textOverflow: 'ellipsis',
        },
        filterApply({ filterApplyCallback }) {
            return (
                <Button
                    label="Tìm"
                    className="px-2 py-1"
                    onClick={filterApplyCallback}
                />
            );
        },
        filterClear({ filterClearCallback }) {
            return (
                <Button
                    label="Reset"
                    className="px-2 py-1"
                    text
                    onClick={filterClearCallback}
                />
            );
        },
    },
    {
        field: 'phone',
        header: 'Số điện thoại',
        filter: true,
        filterPlaceholder: 'Tìm với SĐT khách hàng',
        showFilterMatchModes: false,
        showFilterMenuOptions: false,
        filterApply({ filterApplyCallback }) {
            return (
                <Button
                    label="Tìm"
                    className="px-2 py-1"
                    onClick={filterApplyCallback}
                />
            );
        },
        filterClear({ filterClearCallback }) {
            return (
                <Button
                    label="Reset"
                    className="px-2 py-1"
                    text
                    onClick={filterClearCallback}
                />
            );
        },
        style: { width: '9rem' },
    },
    /*{field: "partnerId", header: "Partner ID"},*/
    {
        field: 'status',
        header: 'Trạng thái',
        filter: true,
        style: { width: '8rem' },
        filterPlaceholder: 'Tìm theo Trạng Thái Voucher',
        showFilterMatchModes: false,
        showFilterMenuOptions: false,
        align: 'center',
        filterElement: StatusFilterTemplate,
        body({ status }) {
            const { label, severity } = STATUS_TYPE.find(
                (i) => i.value === status,
            ) || {
                label: status,
                severity: 'secondary',
            };
            return <Badge severity={severity} value={label} />;
        },
        filterApply({ filterApplyCallback }) {
            return (
                <Button
                    label="Tìm"
                    className="px-2 py-1"
                    onClick={filterApplyCallback}
                />
            );
        },
        filterClear({ filterClearCallback }) {
            return (
                <Button
                    label="Reset"
                    className="px-2 py-1"
                    text
                    onClick={filterClearCallback}
                />
            );
        },
    },
    {
        field: 'createdAt',
        header: 'Ngày tạo',
        body({ createdAt }) {
            return <span>{formatDMYHIS(new Date(createdAt * 1000))}</span>;
        },
        align: 'right',
        style: { width: '11rem' },
    },
    {
        field: 'expiredAt',
        header: 'Ngày hết hạn',
        body({ expiredAt }) {
            return <span>{formatDMYHIS(new Date(expiredAt * 1000))}</span>;
        },
    },
    { field: 'usedAt', header: 'Ngày sử dụng' },
    { field: 'usedOrderId', header: 'Mã đơn đã dùng' },
    { field: 'usedBy', header: 'Người sử dụng' },
];

function getShowColumnsDefault() {
    return [
        'id',
        'templateName',
        'phone',
        'templateType',
        'code',
        'userId',
        'status',
        'createdAt',
    ];
}

function getColumnHeaderByField(field) {
    return ALL_COLUMNS.find((i) => i.field === field)?.header || field;
}

function getFilterDefault() {
    const filterFields = {};
    for (const field of FILTER_FIELDS) {
        filterFields[field] = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        };
    }

    return filterFields;
}
