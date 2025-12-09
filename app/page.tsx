'use client';
import styles from './page.module.css';
import React, { useEffect } from 'react';
import Image from 'next/image';
import PageHeader from './components/PageHeader/PageHeader';
import { useAppStore } from './stores/useAppStore';
// import { ArrowDropDownOutlined } from '@mui/icons-material';

export default function Home() {
  const { fetchStockData } = useAppStore();

  useEffect(() => {
    fetchStockData(['^VIX','^GSPC','^DJI','^IXIC','^RUI','^RUT','^RUA']);
  }, [fetchStockData]);

  return (
    <div className={styles.page}>
      <PageHeader />
      <div className={styles.wrapperCentered}>
        <Image
          src="next.svg"
          width={200}
          height={60}
          alt=""
        />
        <h3 className={styles.h3}>Create trading projects and gain AI driven insights.</h3>
        <h3 className={styles.h3}>Or simply search a symbol to explore.</h3>
      </div>
    </div>
  );
}

