import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";

export const TableHeader = ({ 
    title = "Danh sách",
    searchTerm, 
    onSearchChange, 
    loading, 
    onRefresh, 
    onColumnOptionsClick,
    opRef,
    showRefreshButton = true,
    searchPlaceholder = "Tìm kiếm...",
    searchWidth = "200px"
}) => (
    <div className="flex justify-content-between align-items-center">
        <h5 className="text-xl m-0">{title}</h5>
        <div className="flex align-items-center gap-2">
            <span className="p-input-icon-left">
                <i className="pi pi-search ml-2" />
                <InputText
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    size="small"
                    style={{ width: searchWidth, paddingLeft: '2.5rem' }}
                />
            </span>
            {showRefreshButton && (
                <Button
                    size="small"
                    type="button"
                    icon="pi pi-refresh"
                    className="ml-2"
                    text
                    title="Làm mới"
                    severity="success"
                    loading={loading}
                    onClick={onRefresh}
                />
            )}
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