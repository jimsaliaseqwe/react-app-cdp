import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import React from "react";

export default function CreateDeviceDialog({
    visible,
    onHide,
    newDevice,
    setNewDevice,
    loading,
    onSubmit
}) {
    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header="Tạo Thiết bị mới"
            style={{ width: '50vw' }}
            modal
            draggable={false}
            resizable={false}
        >
            <form className="block pt-5" onSubmit={onSubmit}>
                <div className="flex flex-column gap-4">
                    <FloatLabel>
                        <InputText
                            id="txt-device-id"
                            value={newDevice.deviceId || ""}
                            required
                            className="w-full"
                            onChange={(e) => setNewDevice({...newDevice, deviceId: e.target.value})}
                        />
                        <label htmlFor="txt-device-id">Device ID <span className="text-red-500">(*)</span></label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText
                            id="txt-device-name"
                            value={newDevice.name || ""}
                            required
                            className="w-full"
                            onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                        />
                        <label htmlFor="txt-device-name">Tên thiết bị <span className="text-red-500">(*)</span></label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText
                            id="txt-device-serial"
                            value={newDevice.serialNumber || ""}
                            className="w-full"
                            onChange={(e) => setNewDevice({...newDevice, serialNumber: e.target.value})}
                        />
                        <label htmlFor="txt-device-serial">Số Serial</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText
                            id="txt-device-mac"
                            value={newDevice.macAddress || ""}
                            className="w-full"
                            onChange={(e) => setNewDevice({...newDevice, macAddress: e.target.value})}
                        />
                        <label htmlFor="txt-device-mac">Địa chỉ MAC</label>
                    </FloatLabel>
                    <div className="mt-5 text-center">
                        <Button
                            type="submit"
                            label="Tạo Mới"
                            icon="pi pi-save"
                            className="p-button-success"
                            loading={loading}
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
}
