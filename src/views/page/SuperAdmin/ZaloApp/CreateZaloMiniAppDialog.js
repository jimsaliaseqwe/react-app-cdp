import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import React from "react";

const FormNotice = ({ zaloAppId, partnerId }) => {
    return (
        <>
            {zaloAppId && partnerId ?
                <div className="p-3 bg-blue-50 border-round mb-3">
                    <p className="text-sm text-blue-700 m-0">
                        <i className="pi pi-info-circle mr-2"></i>
                        Tạo Mini App mới cho Zalo App ID: <strong>{zaloAppId}</strong>
                    </p>
                </div> :
                <div className="p-3 bg-red-50 border-round mb-3">
                    <p className="font-semibold text-red-700 m-0">
                        <i className="pi pi-exclamation-triangle mr-2"></i>
                        Chưa có Partner ID nên không thể tạo Mini App
                    </p>
                </div>
            }
        </>
    )
}

export default function CreateZaloMiniAppDialog({
    visible,
    onHide,
    newMiniApp,
    setNewMiniApp,
    loading,
    onSubmit,
    zaloAppId,
    partnerId
}) {
    function isFormValid() {
        return zaloAppId && partnerId;
    }

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header="Tạo Mini App mới"
            style={{ width: '50vw' }}
            modal
            draggable={false}
            resizable={false}
        >
            <form className="block pt-5" onSubmit={onSubmit}>
                <div className="flex flex-column gap-4">
                    <FormNotice zaloAppId={zaloAppId} partnerId={partnerId} />
                    <FloatLabel>
                        <InputText
                            id="txt-mini-app-id"
                            value={newMiniApp.id || ""}
                            required
                            className="w-full"
                            onChange={(e) => setNewMiniApp({...newMiniApp, id: e.target.value})}
                        />
                        <label htmlFor="txt-mini-app-oa-id">Mini App ID <span className="text-red-500">(*)</span></label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText
                            id="txt-mini-app-name"
                            value={newMiniApp.name || ""}
                            required
                            className="w-full"
                            onChange={(e) => setNewMiniApp({...newMiniApp, name: e.target.value})}
                        />
                        <label htmlFor="txt-mini-app-name">Tên Mini App <span className="text-red-500">(*)</span></label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText
                            id="txt-mini-app-oa-id"
                            value={newMiniApp.oaId || ""}
                            className="w-full"
                            onChange={(e) => setNewMiniApp({...newMiniApp, oaId: e.target.value})}
                        />
                        <label htmlFor="txt-mini-app-oa-id">OA ID</label>
                    </FloatLabel>
                    <div className="mt-5 text-center">
                        <Button
                            type="submit"
                            label="Tạo Mini App"
                            icon="pi pi-save"
                            className="p-button-success"
                            loading={loading}
                            disabled={!isFormValid()}
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
}
