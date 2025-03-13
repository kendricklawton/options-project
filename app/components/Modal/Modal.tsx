'use client'

import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { IconButton, Paper } from '@mui/material';
import { Close } from '@mui/icons-material';
import Account from './Views/Account';
import { useAppContext } from '../../providers/AppProvider';

export default function Modal() {
    const {  modalView, setModalView } = useAppContext();

    const renderView = () => {
        switch (modalView.toLowerCase()) {
            case 'account':
                return <Account />;
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
                <Paper className={styles.wrapper} elevation={8}>
                    <div className={styles.header}>
                        <div className={styles.headerLeading}>
                        </div>
                        <div className={styles.headerTrailing}>
                            <IconButton onClick={onClose}><Close /></IconButton>
                        </div>
                    </div>
                    {renderView()}
                </Paper>
            </div>
        )
    );
}
