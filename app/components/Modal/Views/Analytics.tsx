'use client'

import { useAppContext } from "@/app/providers/AppProvider";
// import { SearchOutlined } from "@mui/icons-material";
import styles from './Analytics.module.css';
// import { StyledTextField } from '@/app/components/Styled';
// import { InputAdornment } from "@mui/material";
import React, {} from 'react';
import {
    //  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    //  TooltipProps 
    } from 'recharts';
import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";



export default function Analytics() {
    const {
        //  currentExpirationDate,
          currentStock, currentOption} = useAppContext();
    // const [inputValue, setInputValue] = useState('');
    // const [quantity, setQuantity] = useState(10);
    const quantity = 10;
    
    // const cost = currentOption?.ask ? currentOption?.ask * 100 * quantity : 0;
    let breakEvenPrice;
    const maxLoss = currentOption?.ask ? currentOption?.ask * 100 : 0;

    if(currentOption?.strike && currentOption?.ask) {
        breakEvenPrice = currentOption?.strike + currentOption?.ask;
    }

    return (
        <>
            <div className={styles.headerElement}>
                <div>
                    {/* <StyledTextField
                        sx={{
                            maxWidth: '7.6rem',
                            margin: '0',
                            padding: '0',
                        }}
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue.toUpperCase()}
                        placeholder={currentStock?.symbol ? currentStock.symbol : 'SYMBOL'}
                        autoComplete="off"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end" sx={{
                                        touchAction: 'none',
                                        padding: 0,
                                        margin: 0
                                    }}>
                                        <SearchOutlined onClick={handleFetchStockData}
                                            sx={{
                                                cursor: 'pointer',
                                                color: 'grey',
                                            }} />
                                    </InputAdornment>
                                )
                            }
                        }}>
                    </StyledTextField> */}
                    {currentStock && (
                        <p>{currentStock.symbol} | {currentStock.shortName}</p>
                    )}
                </div>
            </div>
            <div className={styles.headerElement}>
                {currentStock && (
                    <div>
                        <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                            ? currentStock.regularMarketChangePercent > 0
                                ? styles.post
                                : styles.leadingPNeg
                            : ''
                        }
                        >{
                                currentStock.regularMarketPrice?.toFixed(2)
                            }</p>

                        <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                            ? currentStock.regularMarketChangePercent > 0
                                ? styles.positive
                                : styles.negative
                            : ''
                        }>{formatPlusMinus(currentStock.regularMarketChange)}</p>
                        <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                            ? currentStock.regularMarketChangePercent > 0
                                ? styles.positive
                                : styles.negative
                            : ''
                        }>({formatPlusMinus(currentStock.regularMarketChangePercent)}%)</p>
                        <p>{convertUnixTimestamp(currentStock.regularMarketTime)}</p>
                    </div>
                )}
            </div>

            <div className={styles.headerElement}>
                <p>Buy {quantity} Calls ----- {currentOption?.ask} * 100</p>
            </div>
            <div className={styles.headerElement}>
                <p>Max Profit: {Infinity}</p>
            </div>
            <div className={styles.headerElement}>
                <p>Max Loss: {maxLoss}</p>
            </div>
            <div className={styles.headerElement}>
                <p>Break Even: {breakEvenPrice}</p>
            </div> 
            



            
        
  
            {/* <p>Quantity: {quantity}</p> */}
            {/* <p>Option Ask Price: {currentOption?.ask}</p> */}
            {/* <p>Option Total Cost: {cost}</p> */}
           
 
        </>
    );
}