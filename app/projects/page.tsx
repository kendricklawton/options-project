'use client'

import React from "react";
import pageStyles from "../page.module.css";
import styles from "./page.module.css";
import { StyledButton, StyledIconButton } from "../components/Styled";
import { AddOutlined, ArrowDropDownOutlined, MoreVertOutlined } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useAppStore } from "../stores/useAppStore";
import PageHeader from "../components/PageHeader/PageHeader";

export default function Projects() {

    // App context
    const {
      projects,
      createProject
    } = useAppStore();
  

  const handleCreateProject = async ()=> {
    try {
      const project = {
        createdDate: '',
        id: '',
        title: 'Testing Title',
        resources: [],
        trades: [],
        tickers: [],
        notes: [],

      }
      await createProject(project);
    } catch (error) {
      throw error;
    }    
  }

  return (
    <div className={pageStyles.page}>
      <PageHeader />
      <div className={pageStyles.wrapper}>
        <h2>Projects</h2>
        <div className={styles.controls}>
          <div className={styles.leading}>
            <StyledButton variant="contained" endIcon={
              <AddOutlined />
            } onClick={handleCreateProject}>Create new</StyledButton>
          </div>
          <div className={styles.trailing}>
            <StyledButton variant="contained" endIcon={
              <ArrowDropDownOutlined />
            }>Most Recent</StyledButton>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.element}>
            <div className={styles.elementLeading}>
              <p>Title</p>
            </div>
            <div className={styles.elementCenter}>
              <p>Tickers</p>
            </div>
            <div className={styles.elementCenter}>
              <p>Trades</p>
            </div>
            <div className={styles.elementCenter}>
              <p>Created</p>
            </div>
            <StyledIconButton disabled sx={{
              opacity: 0
            }}> 
              <MoreVertOutlined />
            </StyledIconButton>
          </div>
          {/* <Divider/>
          <div className={styles.element}>
            <div className={styles.elementLeading}>
              <p>Testing Project</p>
            </div>
            <div className={styles.elementCenter}>
              <p>0 Trades</p>
            </div>
            <div className={styles.elementCenter}>
              <p>1 Ticker</p>
            </div>
            <div className={styles.elementCenter}>
              <p>Apr 1, 2025</p>
            </div>
            <StyledIconButton>
              <MoreVertOutlined />
            </StyledIconButton>
          </div> */}
          {/* {
            (currentStock?.news as ArticleType[])?.map((article, index) => (
              <div key={index}>
                <Divider />
                <div className={styles.element}>
                  <div className={styles.elementLeading}>
                    <p>{article.content.title}</p>
                  </div>
                </div>
              </div>
            ))
          } */}
          {
            projects.map((project, index) => (
              <div key={index}>
                <Divider />
                <div className={styles.element}>
                  <div className={styles.elementLeading}>
                    <div className={styles.elementLeading}>
                      <p>{project.title}</p>
                    </div>
                    <div className={styles.elementCenter}>
                      <p>{project.tickers?.length} {project.trades?.length === 1 ? 'Ticker' : 'Tickers'}</p>
                    </div>
                    <div className={styles.elementCenter}>
                      <p>{project.trades?.length} {project.trades?.length === 1 ? 'Trade' : 'Trades'}</p>
                    </div>
                    <div className={styles.elementCenter}>
                      <p>Apr 1, 2025</p>
                    </div>
                    <StyledIconButton>
                      <MoreVertOutlined />
                    </StyledIconButton>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        
      </div>
    </div>
  );
};