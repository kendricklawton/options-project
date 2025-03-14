'use client'

import React from "react";
import styles from "./page.module.css";
import OptionChain from "./components/OptionChain/OptionChain";

export default function Home() {
  return (
    <div className={styles.page}>
      {OptionChain()}
    </div>
  );
};