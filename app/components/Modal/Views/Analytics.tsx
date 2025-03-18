'use client'

import { useEffect, useState } from 'react';
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
import { ArrowDropDownOutlined, CachedOutlined, SentimentSatisfied, SentimentVeryDissatisfied, SentimentVerySatisfied } from "@mui/icons-material";
import { StyledButton, 
    // StyledButtonTwo,
     StyledTextField } from "../../Styled";
// import { StyledButton } from "../../Styled";
// import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";

// const menuButtonStyle = {
//     borderRadius: '0px',
//     borderTop: 'none',
//     borderBottom: 'none',
//     border: 'none',
//     justifyContent: 'flex-start',
//     width: '7rem',
// }

export default function Analytics() {
    const {
        currentExpirationDate,
        optionChain,
        currentOptionOrder,
        updateOptionOrderByQuantity,
        updateOptionOrderByStrike } = useAppContext();
    const quantity = currentOptionOrder?.quantity || 0;

    const [inputValue, setInputValue] = useState<number | ''>(quantity);

    const strikesMenuButtonRef = React.useRef<HTMLButtonElement>(null);
    const strikesMenuRef = React.useRef<HTMLDivElement>(null);
    const [isStrikesMenuOpen, setIsStrikesMenuOpen] = React.useState(false);
    const strikes = optionChain?.strikes || [];

    const determineOptionType = (symbol: string): string => {
        // Traverse the symbol from right to left
        for (let i = symbol.length - 1; i >= 0; i--) {
            const char = symbol.charAt(i);

            // Check if the character is a non-numeric character (either 'C' or 'P')
            if (char === 'C') {
                return 'Call';
            } else if (char === 'P') {
                return 'Put';
            }

            // If it's a number, continue to the next character
            if (!/\d/.test(char)) {
                continue;
            }
        }

        // If no 'C' or 'P' found, throw an error
        // throw new Error('Invalid option contract symbol');
        return 'N/A';
    };

    const optionType = determineOptionType(currentOptionOrder?.option?.contractSymbol || '');
    const maxLoss = currentOptionOrder?.option?.ask ? currentOptionOrder?.option?.ask * 100 * quantity : 0;
    const contractSymbol = currentOptionOrder?.option?.contractSymbol;

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (strikesMenuRef.current && !strikesMenuRef.current.contains(event.target as Node)) {
                if (!strikesMenuButtonRef.current?.contains(event.target as Node)) {
                    setIsStrikesMenuOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUpdateStrike = (strike: number) => {
        console.log('strike', strike);
        if (!currentOptionOrder) {
            return;
        }
        if (strike === currentOptionOrder.option?.strike) {
            return;
        }
        updateOptionOrderByStrike(strike, currentOptionOrder, optionType as 'Call' | 'Put');
    };

    const handleUpdateQuantity = (quantity: number) => {

        // if(quantity < 1) {
        //     setInputValue(1);
        //     return;
        // }

        setInputValue(quantity);

       
        if (!currentOptionOrder) {
            return;
        }
        if (quantity === currentOptionOrder.quantity) {
            return;
        }       

        if(!quantity) {
            const prevQuantity = currentOptionOrder.quantity || 0;
            updateOptionOrderByQuantity(prevQuantity, currentOptionOrder);
            return;
        }

        updateOptionOrderByQuantity(quantity, currentOptionOrder);
    };


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
            {
                contractSymbol == '0' ?
                    (
                        <div className={styles.elementText}>
                            <p>
                                Option data not available for this strike. Please select another option. We are in early development and are using a limited dataset. Thank you for your patience.
                            </p>
                        </div>
                    )
                    :
                    <div className={styles.elementTwo}>
                        <div className={styles.elementTwoItem}>
                            <p>Ask:</p>
                            {currentOptionOrder?.option?.ask}
                        </div>
                        <div className={styles.elementTwoItem}>
                            <p>Bid:</p>
                            {currentOptionOrder?.option?.bid}
                        </div>
                        <div className={styles.elementTwoItem}>
                            <p>Type:</p>
                            {determineOptionType(currentOptionOrder?.option?.contractSymbol || '')}
                        </div>
                    </div>
            }
            <div className={styles.elementTwo}>
                <div className={styles.elementTwoItem}>
                    <p>Action </p>
                    <StyledButton endIcon={<CachedOutlined />}
                    >{currentOptionOrder?.action ? currentOptionOrder.action : 'Action'}</StyledButton>
                </div>
                <div className={styles.elementTwoItem}>
                    <p>Quantity</p>
                    <StyledTextField
                        sx={{ maxWidth: '7.6rem' }}
                        type="number"
                        value={inputValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!value ) {
                                // setInputValue('');
                                return;
                            } else {
                                if(parseInt(value) < 1) {
                                    return;
                                }
                                handleUpdateQuantity(parseInt(value));
                            }
                         
                        }}
                    ></StyledTextField>
                </div>
            </div>
            <div className={styles.elementTwo}>
                <div className={styles.elementTwoItem}>
                    <p>Expiration</p>
                    <StyledButton endIcon={<ArrowDropDownOutlined />}
                    >{currentExpirationDate}</StyledButton>
                </div>
                <div className={styles.elementTwoItem}>
                    <p>Strike</p>
                    {/* <StyledButton endIcon={<ArrowDropDownOutlined />}
                    >{currentOptionOrder?.option?.strike}</StyledButton> */}
                    <div className={styles.anchor}>
                        <StyledButton variant="contained"
                            onClick={() => setIsStrikesMenuOpen(prev => !prev)}
                            endIcon={<ArrowDropDownOutlined />}
                            ref={strikesMenuButtonRef}
                            sx={{
                                borderRadius: '0px',
                                backgroundColor: 'fff',
                                justifyContent: 'space-between',
                                minWidth: '7rem',
                                whiteSpace: 'nowrap',
                            }}>{currentOptionOrder?.option?.strike}</StyledButton>
                        {
                            isStrikesMenuOpen && (
                                <div className={styles.menu} ref={strikesMenuRef}>
                                    {strikes.map((strike, index) => (
                                        // <StyledButtonTwo variant="outlined" sx={menuButtonStyle} key={index} onClick={() => handleUpdateStrike(strike)}>{strike}</StyledButtonTwo>
                                        <div style={{
                                            paddingLeft: '1rem',
                                            width: '7rem',
                                            minHeight: '2rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'flex-start',
                                            cursor: 'pointer',
                                        }} key={index} onClick={() => handleUpdateStrike(strike)}>{strike}</div>
                                    ))}
                                </div >
                            )}
                    </div>
                </div>
            </div>
            <div className={styles.element}>
                <div className={styles.elementItem}>
                    <SentimentVerySatisfied sx={{ color: 'green' }} fontSize="large" /> <p>Max Profit: {maxProfit?.toFixed(2)}</p>
                </div>
            </div>
            <div className={styles.element}>
                <div className={styles.elementItem}>
                    <SentimentVeryDissatisfied sx={{
                        color: 'red',
                    }} fontSize="large" /> <p>Max Loss: {maxLoss.toFixed(2)}</p>
                </div>
            </div>
            <div className={styles.element}>
                <div className={styles.elementItem}>
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