import { Checkbox } from "primereact/checkbox";

export const ColumnSelector = ({ allColumns, showColumns, onToggleColumn, onToggleAll }) => {
    const allChecked = showColumns.length === allColumns.length;

    return (
        <div className="p-fluid" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <div className="p-field-checkbox py-2">
                <Checkbox
                    inputId="__all_columns"
                    checked={allChecked}
                    onChange={onToggleAll}
                />
                <label htmlFor="__all_columns" className="ml-2">Tất cả cột</label>
            </div>
            {allColumns.map((col) => (
                <div key={col.field} className="p-field-checkbox py-2">
                    <Checkbox
                        inputId={col.field}
                        checked={showColumns.includes(col.field)}
                        onChange={() => onToggleColumn(col.field)}
                    />
                    <label htmlFor={col.field} className="ml-2">{col.header}</label>
                </div>
            ))}
        </div>
    );
};