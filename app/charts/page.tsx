'use client'

import React from "react";
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";

export default function Charts() {
    const { currentStock } = useAppContext();

    if (currentStock == null)
        return (
            <div className={styles.page}>
                <div className={styles.pageHeader}>
                    <h1>Charts</h1>
                    <h2>Search for a symbol to view charts</h2>
                </div>
            </div>
        );

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1>Charts Development In Progress</h1>
            </div>
        </div>
    );
};