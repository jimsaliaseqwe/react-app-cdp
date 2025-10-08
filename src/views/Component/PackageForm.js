import { Card } from 'primereact/card';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { formatCurrencyVND, showToast } from '../../util/func';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getListPackage, projectChangePackage } from '../../service/requestAPI';
import { useParams } from 'react-router-dom';
import getResources from '../../service/serviceController';
import { Toast } from 'primereact/toast';

export default function ({ onSuccess, currentPackage = { id: '' } }) {
    const masterToast = useRef(null);
    const { projectId } = useParams();
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        getResources(getListPackage, ({ data }) => {
            if (data) {
                setPackages(
                    data.map((i) => ({
                        ...i,
                        active: i.id !== currentPackage.id,
                    })),
                );
            }
        });
    }, []);

    function Footer(pack) {
        return (
            <div>
                {!pack.premium && pack.id !== currentPackage.id && (
                    <div className="text-right">
                        <Button
                            disabled={pack.id === currentPackage.id}
                            type="button"
                            label="Chọn"
                            size="small"
                            onClick={() => onUpgrade(pack)}
                        />
                    </div>
                )}
                {pack.id === currentPackage.id && (
                    <div className="text-center text-green-500">
                        <em>Đang sử dụng</em>
                    </div>
                )}
            </div>
        );
    }

    function onUpgrade({ id, name, amount }) {
        confirmDialog({
            message: () => (
                <span>
                    {currentPackage.id !== 'free' && (
                        <em className="text-yellow-500">
                            Khi bạn đổi gói, gói hiện tại sẽ bị hủy và bạn sẽ
                            mua lại nếu muốn sử dụng lại.
                        </em>
                    )}
                    <br /> Bạn có chắc chắn muốn chuyển sang gói{' '}
                    <strong>{name}</strong> với giá{' '}
                    <strong>{formatCurrencyVND(amount)}</strong>?
                </span>
            ),
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Đồng ý',
            rejectLabel: 'Hủy bỏ',
            group: 'PackageForm',
            accept: () => {
                projectChangePackage(projectId, id)
                    .then(({ data }) => {
                        showToast.call(
                            masterToast,
                            'success',
                            'Thành công',
                            `Đã chuyển sang gói ${name}`,
                        );
                        onSuccess && onSuccess();
                    })
                    .catch((ex) => {
                        showToast.call(
                            masterToast,
                            'error',
                            'Thất bại',
                            ex.message || `Chuyển gói thất bại`,
                        );
                        //console.error(ex);
                    });
            },
        });
    }

    return (
        <div className="grid w-full">
            <ConfirmDialog group={'PackageForm'} />
            {packages.map((p, index) => (
                <div className="col-3 flex" key={`${p.id}-${index}`}>
                    <Card
                        className={`w-full hover:bg-black-alpha-10 ${p.id === currentPackage.id ? 'bg-black-alpha-10' : 'cursor-pointer'}`}
                        title={p.name}
                        key={`c-${p.id}-${index}`}
                        footer={() => (
                            <>
                                <Footer key={`f-${p.id}-${index}`} {...p} />
                            </>
                        )}
                    >
                        <p className="m-0">{p.description}</p>
                        <ul>
                            {p.allFeature &&
                                p.features &&
                                p.allFeature.map((f, subIndex) => (
                                    <li key={`${p.id}-${f}-${subIndex}`}>
                                        <span
                                            className={
                                                !p.features.includes(f)
                                                    ? 'line-through'
                                                    : ''
                                            }
                                        >
                                            {f}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                        <h5 className="text-center mt-7 mb-0">
                            {p.premium ? (
                                <strong>Liên hệ</strong>
                            ) : (
                                <strong>
                                    {p.amount === 0
                                        ? 'Miễn phí'
                                        : `${formatCurrencyVND(p.amount)} / ${p.durationDay} ngày`}
                                </strong>
                            )}
                        </h5>
                    </Card>
                </div>
            ))}

            <Toast ref={masterToast} />
        </div>
    );
}
