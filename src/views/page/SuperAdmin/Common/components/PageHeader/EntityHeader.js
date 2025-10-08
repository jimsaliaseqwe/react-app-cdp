import { Button } from "primereact/button";
import { Card } from "primereact/card";

export const EntityHeader = ({ 
    title, 
    subtitle, 
    icon = "pi pi-list",
    onCreateClick, 
    createLabel = "Tạo Mới",
    loading = false,
    showCreateButton = true,
    additionalActions = null
}) => (
    <Card unstyled className="mb-4">
        <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
            <div className="flex align-items-center gap-3">
                <div className="flex align-items-center justify-content-center bg-primary-100 text-primary border-round" 
                     style={{ width: '3rem', height: '3rem' }}>
                    <i className={`${icon} text-xl`} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-900 m-0">{title}</h2>
                    <p className="text-600 m-0">{subtitle}</p>
                </div>
            </div>
            <div className="flex gap-2">
                {additionalActions}
                {showCreateButton && (
                    <Button
                        onClick={onCreateClick}
                        label={createLabel}
                        icon="pi pi-plus"
                        className="p-button-success"
                        loading={loading}
                    />
                )}
            </div>
        </div>
    </Card>
);