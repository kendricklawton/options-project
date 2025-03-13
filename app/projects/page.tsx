'use client'

import React from "react";
import pageStyles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";

export default function Projects() {
  const { currentStock, isPageExt } = useAppContext();

  if (currentStock == null)
    return (
      <div className={isPageExt ? pageStyles.pageExt : pageStyles.page}>
        <div className={pageStyles.pageHeader}>
          <h1>Trade Projects</h1>
          <h2>Search for a symbol to create a project</h2>
        </div>
      </div>
    );

  return (
    <div className={isPageExt ? pageStyles.pageExt : pageStyles.page}>
      <div className={pageStyles.pageHeader}>
        <h1>Projects Development In Progress</h1>
      </div>
    </div>
  );
};