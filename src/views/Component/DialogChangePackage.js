import PackageForm from './PackageForm';
import { Dialog } from 'primereact/dialog';
import { callVoidWithNewThread } from '../../util/func';

export default function ({
    dialog,
    header = 'Nâng cấp gói',
    onHide,
    currentPackage = { id: 'free' },
}) {
    const [showDialogPackage, setShowDialogPackage] = dialog;

    function onChangePackage() {
        setShowDialogPackage(true);
    }

    function onHideDialogPackage() {
        setShowDialogPackage(false);
        onHide && callVoidWithNewThread(onHide());
    }

    return (
        <Dialog
            header={header}
            visible={showDialogPackage}
            style={{ width: '80vw' }}
            onHide={onHideDialogPackage}
        >
            <PackageForm
                onSuccess={() => {
                    onHideDialogPackage();
                }}
                currentPackage={currentPackage}
            />
        </Dialog>
    );
}
