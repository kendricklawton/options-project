'use client'

import React from "react";
import pageStyles from "../page.module.css";
import styles from "./page.module.css";
import { StyledButton } from "../components/Styled";
import { AddOutlined, ArrowDropDownOutlined } from "@mui/icons-material";

export default function Projects() {
  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.wrapper}>
        <h1>Projects</h1>
        <div className={styles.projectContainer}>
          <div className={styles.projectContainerHeader}>
            <div className={styles.projectContainerHeaderLeading}>
              <StyledButton variant="contained" startIcon={
                <AddOutlined />
              }>Create new</StyledButton>
            </div>
            <div className={styles.projectContainerHeaderTrailing}>
              <StyledButton variant="contained" endIcon={
                <ArrowDropDownOutlined/>
              }>Most Recent</StyledButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};