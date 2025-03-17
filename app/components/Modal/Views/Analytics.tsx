'use client'

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
import { SentimentSatisfied, SentimentVeryDissatisfied, SentimentVerySatisfied } from "@mui/icons-material";
import { StyledButton } from "../../Styled";
// import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";



export default function Analytics() {
    const {
        currentExpirationDate,
        currentOption } = useAppContext();
    // const [inputValue, setInputValue] = useState('');
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

    const optionType = determineOptionType(currentOption?.contractSymbol || '');
    const quantity = 10;
    const maxLoss = currentOption?.ask ? currentOption?.ask * 100 * quantity : 0;

    let breakEvenPrice;
    let maxProfit;
    if (currentOption?.strike && currentOption?.ask) {
        if (optionType === 'Calls') {
            breakEvenPrice = currentOption?.strike + currentOption?.ask;
            maxProfit = Infinity;
        } else {
            breakEvenPrice = currentOption?.strike - currentOption?.ask;
            maxProfit = (currentOption?.strike - currentOption?.ask) * 100 * quantity;
        }
    }

    return (
        <>
            {/* <div className={styles.element}>
                <div>
                    {currentStock && (
                        <p>{currentStock.symbol} | Buy {quantity} {optionType} @ {currentOption?.ask} * 100</p>
                    )}
                </div>
            </div> */}
            <div className={styles.element}>
                <p>Risk Reward at Expiration</p>
            </div>
            <div className={styles.controls}>
                <div className={styles.controlsElement}>
        
                        <p>Action</p>
           
                        <StyledButton variant="contained"
                            sx={{
                                borderRadius: '0px',
                                width: 'fit-content',
                                height: '1.5rem',
                                whiteSpace:
                                    'nowrap',
                            }}>
                            BUY
                        </StyledButton>
          
                </div>

                <div className={styles.controlsElement}>
           
                        <p>Quantity</p>
     
                        <StyledButton variant="contained"
                            sx={{
                                borderRadius: '0px',
                                width: 'fit-content',
                                height: '1.5rem',
                                whiteSpace:
                                    'nowrap',
                            }}>
                            {quantity}
                        </StyledButton>
            
                </div>

                <div className={styles.controlsElement}>
   
                        <p>Expiration</p>
 
                        <StyledButton variant="contained"
                            sx={{
                                borderRadius: '0px',
                                width: 'fit-content',
                                height: '1.5rem',
                                whiteSpace:
                                    'nowrap',
                            }}>
                            {currentExpirationDate}
                        </StyledButton>

                </div>

                <div className={styles.controlsElement}>
  
                        <p>Strike</p>
    
                        <StyledButton variant="contained"
                            sx={{
                                borderRadius: '0px',
                                width: 'fit-content',
                                height: '1.5rem',
                                whiteSpace:
                                    'nowrap',
                            }}>
                            {currentOption?.strike}
                        </StyledButton>
           
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
            {/* <p>Option Ask Price: {currentOption?.ask}</p> */}
            {/* <p>Option Total Cost: {cost}</p> */}
        </>
    );
}