import { useAppContext } from "@/app/providers/AppProvider";
import {  SearchOutlined } from "@mui/icons-material";
import styles from './Analytics.module.css';
import { StyledTextField } from '@/app/components/Styled';
import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";
import { useState } from "react";
import { InputAdornment } from "@mui/material";


export default function Analytics() {
    const { currentStock, fetchStockData } = useAppContext();
    const [inputValue, setInputValue] = useState('');

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
                    <>
                        <div className={styles.containerRow}>
                            <div className={styles.wrapperRow}>
                                <div className={styles.leading}>
                                    <p>{currentStock.shortName?.toLocaleUpperCase()}</p>
                                    <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                                        ? currentStock.regularMarketChangePercent > 0
                                            ? styles.leadingPPos
                                            : styles.leadingPNeg
                                        : ''
                                    }
                                    >{
                                            currentStock.regularMarketPrice?.toFixed(2)
                                        }</p>
                                    {
                                        currentStock.currentPrice && (
                                            <p>{currentStock.currency}</p>
                                        )
                                    }
                                </div>
                                <div className={styles.leadingTwo}>
                                    <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                                        ? currentStock.regularMarketChangePercent > 0
                                            ? styles.leadingTwoPPos
                                            : styles.leadingTwoPNeg
                                        : ''
                                    }>{formatPlusMinus(currentStock.regularMarketChange)}</p>
                                    <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                                        ? currentStock.regularMarketChangePercent > 0
                                            ? styles.leadingTwoPPos
                                            : styles.leadingTwoPNeg
                                        : ''
                                    }>({formatPlusMinus(currentStock.regularMarketChangePercent)}%)</p>
                                    <p>{convertUnixTimestamp(currentStock.regularMarketTime)}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.trailing}>

                        </div>
                    </>
                )}
            </div >
        </>
    );
}    