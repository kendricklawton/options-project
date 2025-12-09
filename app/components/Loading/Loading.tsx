'use client';

import { CircularProgress } from '@mui/material';
import styles from './Loading.module.css';
import { useAuthContext } from '@/app/providers/AuthProvider';

export default function Loading() {
  const {
    isLoading
  } = useAuthContext();
    
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <CircularProgress className={styles.loading}/>
      </div>
    );
  }
};