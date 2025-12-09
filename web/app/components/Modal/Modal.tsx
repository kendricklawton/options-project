'use client'

import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Account from './Views/Account';
import Snapshot from './Views/Snapshot';
// import { useAppContext } from '../../providers/AppProvider';
import { useAppStore } from '@/app/stores/useAppStore';

export default function Modal() {
    // const {  modalView, setModalView } = useAppContext();
    const { modalView, setModalView} = useAppStore();

    const RenderView = () => {
        if (!modalView) return null;
        switch (modalView.toLowerCase()) {
            case 'account':
                return <Account />;
            case 'snapshot':
                return <Snapshot />;
            default:
                return null;
        }
    };

    const onClose = () => {
        setModalView('');
    };

    useEffect(() => {
        if (modalView) {
            document.body.classList.add('no-scroll');
        }
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [modalView]);

    return (
        modalView && (
            <div className={styles.modal}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <div className={styles.headerLeading}>
                            <h2>
                                {modalView === 'account' ? 'Account' : 'Snapshot'}
                            </h2>
                        </div>
                        <div className={styles.headerTrailing}>
                            <IconButton sx={{
                                color: 'gray'
                            }}onClick={onClose}><Close /></IconButton>
                        </div>
                    </div>
                    {RenderView()}
                </div>
            </div>
        )
    );
}
