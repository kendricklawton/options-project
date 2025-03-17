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
import {  SentimentSatisfied, SentimentVeryDissatisfied, SentimentVerySatisfied } from "@mui/icons-material";
// import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";



export default function Analytics() {
    const {
        //  currentExpirationDate,
          currentStock, currentOption} = useAppContext();
    // const [inputValue, setInputValue] = useState('');
    // const [quantity, setQuantity] = useState(10);
    const quantity = 10;
    const maxLoss = currentOption?.ask ? currentOption?.ask * 100 * quantity : 0;
    let breakEvenPrice;
    if (currentOption?.strike && currentOption?.ask) {
        breakEvenPrice = currentOption?.strike + currentOption?.ask;
    }


    return (
        <>
            <div className={styles.headerElement}>
                <div>
                    {currentStock && (
                        <p>{currentStock.symbol} | Buy {quantity} Calls @ {currentOption?.ask} * 100</p>
                    )}
                </div>
            </div>

            <div className={styles.headerElement}>
                <p>Risk Reward at Expiration</p>
            </div>
            <div className={styles.headerElement}>
                <div>
                <SentimentVerySatisfied sx={{
                //    backgroundColor: 'green'
                color: 'green',
    
                }} fontSize="large"/> <p>Max Profit: {Infinity}</p>
                </div>
            </div>
            <div className={styles.headerElement}>
                <div>
                <SentimentVeryDissatisfied sx={{
                color: 'red',
                }} fontSize="large"/> <p>Max Loss: {maxLoss}</p>
                </div>
            </div>
            <div className={styles.headerElement}>
                <div>
                <SentimentSatisfied sx={{
                color: 'grey',
                }} fontSize="large"/> <p>Break Even: {breakEvenPrice}</p>
             
                </div>

            </div> 
            



            
        
  
            {/* <p>Quantity: {quantity}</p> */}
            {/* <p>Option Ask Price: {currentOption?.ask}</p> */}
            {/* <p>Option Total Cost: {cost}</p> */}
           
 
        </>
    );
}