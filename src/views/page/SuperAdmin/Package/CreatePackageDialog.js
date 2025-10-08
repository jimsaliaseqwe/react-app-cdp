import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";

const ComingSoon = () => {
    return (
        <div>
            <h1>Sắp Ra Mắt</h1>
        </div>
    )
}

// eslint-disable-next-line
const FormSubmit = ({ onSubmit, newPackage, setNewPackage, loading, onHide }) => {
    return (
        <form className="block pt-5" onSubmit={onSubmit}>
            <div className="flex flex-column gap-4">
                <FloatLabel>
                    <InputText
                        id="txt-package-name"
                        value={newPackage.name || ""}
                        required
                        className="w-full"
                        onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    />
                    <label htmlFor="txt-package-name">Tên gói</label>
                </FloatLabel>
                <FloatLabel>
                    <InputTextarea
                        id="txt-package-description"
                        value={newPackage.description || ""}
                        required
                        className="w-full"
                        rows={3}
                        onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                    />
                    <label htmlFor="txt-package-description">Mô tả</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText
                        id="txt-package-features"
                        value={newPackage.features || ""}
                        className="w-full"
                        onChange={(e) => setNewPackage({ ...newPackage, features: e.target.value })}
                    />
                    <label htmlFor="txt-package-features">Tính năng (phân cách bằng dấu phẩy)</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber
                        id="txt-package-amount"
                        value={newPackage.amount || 0}
                        required
                        className="w-full"
                        mode="currency"
                        currency="VND"
                        locale="vi-VN"
                        onChange={(e) => setNewPackage({ ...newPackage, amount: e.value })}
                    />
                    <label htmlFor="txt-package-amount">Giá</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber
                        id="txt-package-duration"
                        value={newPackage.duration || 0}
                        required
                        className="w-full"
                        min={1}
                        onChange={(e) => setNewPackage({ ...newPackage, duration: e.value })}
                    />
                    <label htmlFor="txt-package-duration">Thời gian sử dụng (ngày)</label>
                </FloatLabel>
                <div className="mt-5 text-right">
                    <Button
                        type="button"
                        size="small"
                        label="Hủy"
                        icon="pi pi-times"
                        severity="secondary"
                        onClick={onHide}
                        className="mr-2"
                    />
                    <Button
                        type="submit"
                        size="small"
                        label="Lưu"
                        icon="pi pi-save"
                        loading={loading}
                    />
                </div>
            </div>
        </form>
    )
}

export default function CreatePackageDialog({
    visible,
    onHide,
    newPackage,
    setNewPackage,
    loading,
    onSubmit
}) {
    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header="Tạo Gói mới"
            style={{ width: '50vw' }}
            modal
            draggable={false}
            resizable={false}
        >
            <ComingSoon />
        </Dialog>
    );
}
