'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import pageStyles from '../page.module.css';

export default function Legal() {
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                const response = await fetch('/legal.md'); // Fetch the Markdown file from the public folder
                if (!response.ok) {
                    throw new Error(`Failed to fetch Markdown file: ${response.statusText}`);
                }
                const text = await response.text();
                setMarkdownContent(text);
            } catch (error) {
                console.error('Error fetching Markdown file:', error);
                setError('Failed to load legal information.');
            }
        };

        fetchMarkdown();
    }, []);

    return (
        <div className={pageStyles.page}>
            {error ? (
                <p>{error}</p> // Display error message if fetching fails
            ) : (
                <ReactMarkdown>{markdownContent}</ReactMarkdown> // Render Markdown content
            )}
        </div >
    );
}