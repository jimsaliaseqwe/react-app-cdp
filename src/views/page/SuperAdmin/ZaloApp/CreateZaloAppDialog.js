import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import React from "react";

export default function CreateZaloAppDialog({
    visible,
    onHide,
    newZaloApp,
    setNewZaloApp,
    loading,
    onSubmit
}) {
    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header="Tạo Zalo App"
            style={{ width: '50vw' }}
            modal
            draggable={false}
            resizable={false}
        >
            <form className="block pt-5" onSubmit={onSubmit}>
                <div className="flex flex-column gap-4">
                    <FloatLabel>
                        <InputText
                            id="txt-app-id"
                            value={newZaloApp.id || ""}
                            required
                            className="w-full"
                            onChange={(e) => setNewZaloApp({...newZaloApp, id: e.target.value})}
                        />
                        <label htmlFor="txt-app-id">ID <span className="text-red-500">(*)</span></label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText
                            id="txt-app-name"
                            value={newZaloApp.name || ""}
                            required
                            className="w-full"
                            onChange={(e) => setNewZaloApp({...newZaloApp, name: e.target.value})}
                        />
                        <label htmlFor="txt-app-name">Tên ứng dụng <span className="text-red-500">(*)</span></label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText
                            id="txt-app-description"
                            value={newZaloApp.description || ""}
                            className="w-full"
                            onChange={(e) => setNewZaloApp({...newZaloApp, description: e.target.value})}
                        />
                        <label htmlFor="txt-app-description">Mô tả</label>
                    </FloatLabel>
                    <div className="mt-5 text-center">
                        <Button
                            type="submit"
                            label="Tạo Zalo App"
                            className="p-button-success"
                            loading={loading}
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
}
