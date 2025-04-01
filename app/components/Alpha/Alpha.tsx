'use client';

import React, { useState, useEffect } from 'react';
import styles from './Alpha.module.css';
import { CloseOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { StyledButton } from '../Styled';

export default function Alpha() {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [show, setShow] = useState<boolean>(true);

    useEffect(() => {
        // Default prompts to display on startup
        const defaultPrompts = [
            { sender: 'ai', text: 'Hello! How can I assist you today?' },
            { sender: 'ai', text: 'You can ask me about stock options or market trends.' },
            { sender: 'ai', text: 'Type your question below to get started!' },
        ];

        // Set default prompts on component mount
        setMessages(defaultPrompts);
    }, []);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        // Add user message to the chat
        const userMessage = { sender: 'user', text: inputValue };
        setMessages((prev) => [...prev, userMessage]);

        setInputValue(''); // Clear input field

        // Simulate AI response (replace this with an API call to your AI backend)
        const aiResponse = `You said: "${inputValue}"`;
        const aiMessage = { sender: 'ai', text: aiResponse };
        setMessages((prev) => [...prev, aiMessage]);
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            {
                show && (
                    <div className={styles.wrapper}>
                        <div className={styles.chatbox}>
                            {/* Chat Header */}
                            <div className={styles.header}>
                                <h3>Alpha Chatbox</h3>
                                <IconButton
                                    sx={{ color: '#ededed' }}
                                    onClick={handleClose}
                                >
                                    <CloseOutlined sx={{ color: '#ededed' }} />
                                </IconButton>
                            </div>

                            {/* Messages Display */}
                            <div className={styles.messages}>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={
                                            message.sender === 'user'
                                                ? styles.userMessage
                                                : styles.aiMessage
                                        }
                                    >
                                        {message.text}
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className={styles.inputArea}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className={styles.input}
                                />
                                <button onClick={handleSendMessage} className={styles.sendButton}>
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                ) 
            }

            <div className={styles.buttonWrapper}>
                <StyledButton
                    variant="contained"
                    onClick={() => setShow(true)}
                    className={styles.showButton}
                >
                    Alpha Bot
                </StyledButton>
            </div>
        </>
    )
}
