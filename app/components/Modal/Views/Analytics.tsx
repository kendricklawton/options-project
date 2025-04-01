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
import {
    StyledButton,
    // StyledButtonTwo,
    StyledTextField
} from "../../Styled";
import { determineOptionExpirationDate, determineOptionType, formatDate } from '@/app/utils/utils';
import { Button } from '@mui/material';
// import { StyledButton } from "../../Styled";
// import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";

const menuItemStrikes = {
    borderRadius: '0px',
    borderTop: 'none',
    borderBottom: 'none',
    border: 'none',
    justifyContent: 'flex-start',
    width: '6rem',
}

const menuItemExpirationDates = {
    borderRadius: '0px',
    borderTop: 'none',
    borderBottom: 'none',
    border: 'none',
    justifyContent: 'flex-start',
    width: '8rem',
};

export default function Analytics() {
    const {
        currentExpirationDate,
        currentOptionOrder,
        expirationDates,
        optionChain } = useAppContext();

    const quantity = currentOptionOrder?.quantity || 0;
    const [inputValue, setInputValue] = useState<number | ''>(quantity);

    const strikesMenuButtonRef = React.useRef<HTMLButtonElement>(null);
    const strikesMenuRef = React.useRef<HTMLDivElement>(null);
    const expirationMenuButtonRef = React.useRef<HTMLButtonElement>(null);
    const expirationMenuRef = React.useRef<HTMLDivElement>(null);
    const [isExpirationMenuOpen, setIsExpirationMenuOpen] = React.useState(false);
    const [isStrikesMenuOpen, setIsStrikesMenuOpen] = React.useState(false);

    let strikes: number[] = [];

    if (currentExpirationDate && optionChain) {
        strikes = optionChain[currentExpirationDate]?.strikes || [];
    }


    console.log('currentOptionOrder', currentOptionOrder);
    const optionType = determineOptionType(currentOptionOrder?.option?.contractSymbol || '');
    console.log('optionType', optionType);
    const maxLoss = currentOptionOrder?.option?.ask ? currentOptionOrder?.option?.ask * 100 * quantity : 0;
    console.log('maxLoss', maxLoss);
    const contractSymbol = currentOptionOrder?.option?.contractSymbol;
    console.log('contractSymbol', contractSymbol);
    const expirationDate = determineOptionExpirationDate(currentOptionOrder?.option?.contractSymbol || '');

    ;


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
            if (expirationMenuRef.current && !expirationMenuRef.current.contains(event.target as Node)) {
                if (!expirationMenuButtonRef.current?.contains(event.target as Node)) {
                    setIsExpirationMenuOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUpdateOrder = (strike: number) => {
        console.log('strike', strike);
        if (!currentOptionOrder) {
            return;
        }
        if (strike === currentOptionOrder.option?.strike) {
            return;
        }

    };

    const handleUpdateDate = (date: string) => {
        if (!currentOptionOrder) {
            return;
        }
        if (date === currentExpirationDate) {
            return;
        }

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

        if (!quantity) {
            // const prevQuantity = currentOptionOrder.quantity || 0;
            // updateOptionOrderByQuantity(prevQuantity, currentOptionOrder);
            return;
        }

        // updateOptionOrderByQuantity(quantity, currentOptionOrder);
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
                            if (!value) {
                                // setInputValue('');
                                return;
                            } else {
                                if (parseInt(value) < 1) {
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
                    {/* <StyledButton endIcon={<ArrowDropDownOutlined />}
                    >{currentExpirationDate}</StyledButton> */}
                    <div className={styles.anchor}>
                        <StyledButton variant="contained"
                            onClick={() => setIsExpirationMenuOpen(prev => !prev)}
                            endIcon={<ArrowDropDownOutlined />}
                            ref={expirationMenuButtonRef}
                            sx={{
                                borderRadius: '0px',
                                backgroundColor: 'fff',
                                justifyContent: 'space-between',
                                width: '8rem',
                                whiteSpace: 'nowrap',
                            }}>{expirationDate}</StyledButton>
                        {isExpirationMenuOpen && (
                            <div className={styles.menu} ref={expirationMenuRef}>
                                {expirationDates.map((date, index) => (
                                    <Button component="div" variant="outlined" sx={menuItemExpirationDates} key={index} onClick={
                                        () => handleUpdateDate(date)
                                    }>{formatDate(date).toLocaleUpperCase()}</Button>
                                    // <div className={styles.menuItemDates} key={index} onClick={() => handleUpdateDate(date)}>{formatDate(date).toLocaleUpperCase()}</div>
                                ))}
                            </div >
                        )}
                    </div>
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
                                minWidth: '6rem',
                                whiteSpace: 'nowrap',
                            }}>{currentOptionOrder?.option?.strike}</StyledButton>
                        {isStrikesMenuOpen && (
                            <div className={styles.menu} ref={strikesMenuRef}>
                                {strikes.map((strike, index) => (
                                    <Button component="div" variant="outlined" sx={menuItemStrikes} key={index} onClick={() => handleUpdateOrder(strike)}>{strike}</Button>
                                    // <div className={styles.menuItemStrikes}  // style={{ backgroundColor: 'red' }}
                                    //     key={index} onClick={() => handleUpdateOrder(strike)}>{strike}
                                    // </div>
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