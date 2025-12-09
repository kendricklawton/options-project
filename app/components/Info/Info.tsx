'use client'

import React from 'react';
import styles from './Info.module.css';
import { CloseOutlined } from '@mui/icons-material';
import { useAuthContext } from '../../providers/AuthProvider';
import { IconButton } from '@mui/material';

export default function Info() {
    const { info, setInfo } = useAuthContext();

    const show = info.length > 0;

    const handleClose = () => {
        setInfo('');
    };

    return (
        show && (
            <div className={styles.wrapper}>
                <div className={styles.info}>
                    <div>
                        <p>{info}</p>
                    </div>
                    <IconButton
                        sx={{ color: '#ededed' }}
                        onClick={handleClose}
                    >
                        <CloseOutlined sx={{ color: '#ededed' }} />
                    </IconButton>
                </div>
            </div>
        )
    );
}
