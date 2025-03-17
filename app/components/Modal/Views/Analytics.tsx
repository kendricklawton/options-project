'use client'

import { useState } from 'react';
import { useAppContext } from "@/app/providers/AppProvider";
// import { SearchOutlined } from "@mui/icons-material";
import styles from './Analytics.module.css';
// import { StyledTextField } from '@/app/components/Styled';
// import { InputAdornment } from "@mui/material";
import React, { } from 'react';
import {
    //  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    //  TooltipProps 
} from 'recharts';
import { CachedOutlined, SentimentSatisfied, SentimentVeryDissatisfied, SentimentVerySatisfied } from "@mui/icons-material";
import { StyledButton, StyledTextField } from "../../Styled";
// import { StyledButton } from "../../Styled";
// import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";



export default function Analytics() {
    const {
        currentExpirationDate,
        // currentOption,
        currentOptionOrder } = useAppContext();
    const [inputValue, setInputValue] = useState<number>(currentOptionOrder?.quantity || 0);
    // const [quantity, setQuantity] = useState(10);

    const determineOptionType = (symbol: string): string => {
        // Traverse the symbol from right to left
        for (let i = symbol.length - 1; i >= 0; i--) {
            const char = symbol.charAt(i);

            // Check if the character is a non-numeric character (either 'C' or 'P')
            if (char === 'C') {
                return 'Calls';
            } else if (char === 'P') {
                return 'Puts';
            }

            // If it's a number, continue to the next character
            if (!/\d/.test(char)) {
                continue;
            }
        }

        // If no 'C' or 'P' found, throw an error
        throw new Error('Invalid option contract symbol');
    };

    const optionType = determineOptionType(currentOptionOrder?.option?.contractSymbol || '');
    const quantity = 10;
    const maxLoss = currentOptionOrder?.option?.ask ? currentOptionOrder?.option?.ask * 100 * quantity : 0;

    let breakEvenPrice;
    let maxProfit;
    if (currentOptionOrder?.option?.strike && currentOptionOrder?.option?.ask) {
        if (optionType === 'Calls') {
            breakEvenPrice = currentOptionOrder?.option?.strike + currentOptionOrder?.option?.ask;
            maxProfit = Infinity;
        } else {
            breakEvenPrice = currentOptionOrder?.option?.strike - currentOptionOrder?.option?.ask;
            maxProfit = (currentOptionOrder?.option?.strike - currentOptionOrder?.option?.ask) * 100 * quantity;
        }
    }

    return (
        <>
            {/* <div className={styles.element}>
                <div>
                    {currentStock && (
                        <p>{currentStock.symbol} | Buy {quantity} {optionType} @ {currentOptionOrder?.option?.ask} * 100</p>
                    )}
                </div>
            </div> */}
            <div className={styles.element}>
                <p>Risk Reward at Expiration</p>
            </div>
      

                        <div className={styles.elementTwo}>
                            <div>
                                <p>Action </p>
                                <StyledButton   endIcon={<CachedOutlined />} 
                                >{currentOptionOrder?.action ? currentOptionOrder.action : 'Action'}</StyledButton>
                            </div>
                            <div>
                                <p>Quantity</p>
                                <StyledTextField
                                    className={styles.numberInput}
                                    type="number"   
                                    value={inputValue}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setInputValue(parseInt(value));
                                    }}
                                ></StyledTextField>
                                {/* <StyledButton endIcon={<CachedOutlined />}
                                >{currentOptionOrder?.quantity ? currentOptionOrder.quantity : 'Quantity'}</StyledButton> */}
                            </div>
                        </div>
                        <div className={styles.elementTwo}>
                            <div>
                                <p>Expiration: {currentExpirationDate}</p>
                            </div>
                            <div>
                                <p>Strike: {currentOptionOrder?.option?.strike}</p>
                            </div>
                        </div>
                    
           
            <div className={styles.element}>
                <div>
                    <SentimentVerySatisfied sx={{ color: 'green' }} fontSize="large" /> <p>Max Profit: {maxProfit?.toFixed(2)}</p>
                </div>
            </div>
            <div className={styles.element}>
                <div>
                    <SentimentVeryDissatisfied sx={{
                        color: 'red',
                    }} fontSize="large" /> <p>Max Loss: {maxLoss.toFixed(2)}</p>
                </div>
            </div>
            <div className={styles.element}>
                <div>
                    <SentimentSatisfied sx={{
                        color: 'grey',
                    }} fontSize="large" /> <p>Break Even: {breakEvenPrice?.toFixed(2)}</p>
                </div>
            </div>
            {/* <p>Quantity: {quantity}</p> */}
            {/* <p>Option Ask Price: {currentOptionOrder?.option?.ask}</p> */}
            {/* <p>Option Total Cost: {cost}</p> */}
        </>
    );
}