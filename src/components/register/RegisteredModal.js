"use client";

import { useRouter } from "next/navigation";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const RegisteredModal = ({ isOpen, setIsModalOpen, recoveryKey }) => {
    const router = useRouter();

    const handleModalClose = () => {
        setIsModalOpen(false);
        router.push("/login");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleModalClose}
            title="Kaydınız oluşturuldu"
            closeOnOverlayClick={false}
        >
            <p className="text-sm text-neutral-500">
                Bu kodu saklayın. Hesap bilgilerinizi unutmanız durumunda bu kod sizden istenecektir.
            </p>

            <code className="select-all break-all rounded bg-neutral-100 px-4 py-3 text-center font-mono text-lg tracking-wider text-neutral-900">
                {recoveryKey}
            </code>

            <Button onClick={handleModalClose} className="w-full">
                Tamam
            </Button>
        </Modal>
    );
};

export default RegisteredModal;