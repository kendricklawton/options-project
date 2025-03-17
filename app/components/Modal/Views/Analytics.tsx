'use client'

import { useAppContext } from "@/app/providers/AppProvider";
import { SearchOutlined } from "@mui/icons-material";
import styles from './Analytics.module.css';
import { StyledTextField } from '@/app/components/Styled';
import { InputAdornment } from "@mui/material";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    //  TooltipProps 
    } from 'recharts';
import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";


export default function Analytics() {
    const {
        //  currentExpirationDate,
          currentStock, currentOption, fetchStockData } = useAppContext();
    const [inputValue, setInputValue] = useState('');


    const stockPrices = [];
    const currentStockPrice = currentStock?.regularMarketPrice || 0;
    const roundedStockPrice = Math.round(currentStockPrice);
    const priceBottom = roundedStockPrice - (roundedStockPrice / 2);
    const priceTop = roundedStockPrice + 40;

    for (let price = priceBottom; price <= priceTop; price += 0.01) {
        stockPrices.push(parseFloat(price.toFixed(2)));
    }

    let breakEvenPrice;
    const maxLoss = currentOption?.ask ? currentOption?.ask * 100 : 0;

    if(currentOption?.strike && currentOption?.ask) {
        breakEvenPrice = currentOption?.strike + currentOption?.ask;
    }
    
    const profitAtExpirationData = stockPrices.map(price => {
        const intrinsicValue = Math.max(0, price - (currentOption?.strike || 0));
        const profitLoss = intrinsicValue * 100 - maxLoss;
        return { price, profitLossTwo: profitLoss };
    });

    const handleFetchStockData = async () => {
        if (inputValue.length === 0) return;
        if (currentStock?.symbol?.toLowerCase() == inputValue.toLowerCase()) return;
        try {
            await fetchStockData(inputValue);
            setInputValue('');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className={styles.headerElement}>
                <div>
                    <StyledTextField
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
                    </StyledTextField>
                    {currentStock && (
                        <p>{currentStock.shortName}</p>
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

            <p>Max Loss: {maxLoss}</p>
            <p>Break-even Price: {breakEvenPrice}</p>
            
            <ResponsiveContainer width={400} height={300}>
                <LineChart>
                    <XAxis dataKey="price" tickLine={false} type="number" domain={[currentOption?.strike || 0, priceTop]} />
                    <YAxis orientation="right" tickLine={false} type="number" domain={[-maxLoss, 'maxData']} />
                    <Tooltip/>
                    <Line
                        dot={false}
                        type="monotone"
                        dataKey="profitLossTwo"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        data={profitAtExpirationData}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>

    );
}