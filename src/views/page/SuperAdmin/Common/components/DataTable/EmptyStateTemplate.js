import { Button } from "primereact/button";

export const EmptyStateTemplate = ({ 
    searchValue, 
    onCreateClick,
    icon = "pi pi-inbox",
    emptyMessage = "Không có dữ liệu",
    notFoundMessage = "Không tìm thấy kết quả",
    createLabel = "Tạo Mới",
    showCreateButton = true
}) => {
    if (searchValue) {
        return (
            <div className="text-center p-4">
                <i className={`${icon} text-4xl text-gray-400 mb-3 block`} />
                <p className="text-gray-500 mb-2">
                    {notFoundMessage} với từ khóa "{searchValue}"
                </p>
            </div>
        );
    }

    return (
        <div className="text-center p-4">
            <i className={`${icon} text-4xl text-gray-400 mb-3 block`} />
            <p className="text-gray-500 mb-2">{emptyMessage}</p>
            {showCreateButton && (
                <Button
                    label={createLabel}
                    icon="pi pi-plus"
                    size="small"
                    onClick={onCreateClick}
                    className="mt-2"
                />
            )}
        </div>
    );
};