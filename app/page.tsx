'use client'

import React from "react";
import pageStyles from "./page.module.css";
import { useAppContext } from "./providers/AppProvider";

export default function Options() {

  const { isPageExt } = useAppContext();

  return (
    <div className={isPageExt ? pageStyles.pageExt : pageStyles.page}>
      <div className={pageStyles.pageHeader}>
        <h1>Welcome to Options Project</h1>
        <h2>An easy to use options analytical tool.</h2>
        <h2>Search a symbol to get started.</h2>
      </div>
    </div>
  );
};