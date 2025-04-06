'use client'

import { useEffect, 
    // useState
 } from 'react';
import { useAppContext } from "@/app/providers/AppProvider";
// import { SearchOutlined } from "@mui/icons-material";
// import styles from './Analytics.module.css';
// import { StyledTextField } from '@/app/components/Styled';
// import { InputAdornment } from "@mui/material";
import React, { } from 'react';
import {
    //  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    //  TooltipProps 
} from 'recharts';
// import { ArrowDropDownOutlined, CachedOutlined, SentimentSatisfied, SentimentVeryDissatisfied, SentimentVerySatisfied } from "@mui/icons-material";
// import {
//     StyledButton,
//     StyledTextField
// } from "../../Styled";
import {
    // determineOptionExpirationDate, determineOptionType,
    // formatDate,
    // formatDate
} from '@/app/utils/utils';
// import { StyledButton } from "../../Styled";
// import { convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";

export default function Analytics() {
    const {
        // currentExpirationDate,
        // currentOptionOrder,
        // expirationDates,
        // optionChain,
        // setCurrentOptionOrder, 
    } = useAppContext();

  
    // const [inputValue, setInputValue] = useState<number | ''>(quantity);

    const strikesMenuButtonRef = React.useRef<HTMLButtonElement>(null);
    const strikesMenuRef = React.useRef<HTMLDivElement>(null);
    // const expirationMenuButtonRef = React.useRef<HTMLButtonElement>(null);
    // const expirationMenuRef = React.useRef<HTMLDivElement>(null);
    // const [isExpirationMenuOpen, setIsExpirationMenuOpen] = React.useState(false);
    // const [isStrikesMenuOpen, setIsStrikesMenuOpen] = React.useState(false);

    // let strikes: number[] = [];

    // if (currentExpirationDate && optionChain) {
    //     strikes = optionChain[currentExpirationDate]?.strikes || [];
    // }

    // const handleUpdateStrike = (strike: number) => {
    //     const updatedOption = currentExpirationDate 
    //         ? optionChain?.[currentExpirationDate]?.calls.find((option) => option.strike === strike) 
    //         : undefined;

    //     if (updatedOption == undefined) {
    //         console.log('updatedOption is undefined');
    //         return;
    //     }

    //     if (updatedOption) {
    //         setCurrentOptionOrder({
    //             ...currentOptionOrder,
    //             option: updatedOption,
    //         });
    //     }

    //     setIsStrikesMenuOpen(false);
    // };
    // const handleUpdateQuantity = (quantity: number) => {
    //     setCurrentOptionOrder({
    //         ...currentOptionOrder,
    //         quantity: quantity,
    //     })
    // };

    // console.log('currentOptionOrder', currentOptionOrder);
  
    // let breakEvenPrice: number | undefined;
    // let maxLoss: number | undefined;
    // let maxProfit: number | undefined;
    // const optionAsk = currentOptionOrder?.option?.ask || 0;
    // console.log('optionAsk', optionAsk);
    // const optionBid = currentOptionOrder?.option?.bid || 0;
    // console.log('optionBid', optionBid);
    // const optionStrike = currentOptionOrder?.option?.strike || 0;
    // console.log('optionStrike', optionStrike);
    // const optionType = determineOptionType(currentOptionOrder?.option?.contractSymbol || '');
    // console.log('optionType', optionType);
    // const quantity = currentOptionOrder?.quantity || 1;

    // if (optionType === 'Call') {
    //     breakEvenPrice = optionStrike + optionAsk;
    //     maxLoss = optionAsk * (quantity * 100);
    //     maxProfit = Infinity;
    // } else {
    //     breakEvenPrice = optionStrike - optionAsk;
    //     maxLoss = optionAsk * (quantity * 100);
    //     maxProfit = (optionStrike - optionAsk) * 100 * quantity;
    // }

    // console.log('optionType', optionType);
    // console.log('maxLoss', maxLoss);
    // const contractSymbol = currentOptionOrder?.option?.contractSymbol;
    // console.log('contractSymbol', contractSymbol);
    // const expirationDate = determineOptionExpirationDate(currentOptionOrder?.option?.contractSymbol || '');
    // console.log('expirationDate', expirationDate);

    // if(contractSymbol == '0') {
    //     maxLoss = 0;
    //     maxProfit = 0;
    //     breakEvenPrice = 0;
    // }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (strikesMenuRef.current && !strikesMenuRef.current.contains(event.target as Node)) {
                if (!strikesMenuButtonRef.current?.contains(event.target as Node)) {
                    // setIsStrikesMenuOpen(false);
                }
            }
            // if (expirationMenuRef.current && !expirationMenuRef.current.contains(event.target as Node)) {
            //     if (!expirationMenuButtonRef.current?.contains(event.target as Node)) {
            //         setIsExpirationMenuOpen(false);
            //     }
            // }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <h1>Analytics</h1>
            {/* <LineChart width={500} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            </LineChart> */}
        </div>
    );
    // return (
    //     <>
    //         {
    //             contractSymbol == '0' ?
    //                 (
    //                     <div className={styles.elementText}>
    //                         <p>
    //                             Option data not available for this strike. Please select another option. We are in early development and are using a limited dataset. Thank you for your patience.
    //                         </p>
    //                     </div>
    //                 )
    //                 :
    //                 <div className={styles.elementTwo}>
    //                     <div className={styles.elementTwoItem}>
    //                         <p>Ask:</p>
    //                         {/* {currentOptionOrder?.option?.ask?.toFixed(2)} */}
    //                     </div>
    //                     <div className={styles.elementTwoItem}>
    //                         <p>Bid:</p>
    //                         {/* {currentOptionOrder?.option?.bid?.toFixed(2)} */}
    //                     </div>
    //                     <div className={styles.elementTwoItem}>
    //                         <p>Type:</p>
    //                         {/* {determineOptionType(currentOptionOrder?.option?.contractSymbol || '')} */}
    //                     </div>
    //                 </div>
    //         }
    //         <div className={styles.elementTwo}>
    //             <div className={styles.elementTwoItem}>
    //                 <p>Action </p>
    //                 <StyledButton endIcon={<CachedOutlined />}
    //                 >
    //                     {/* {currentOptionOrder?.action ? currentOptionOrder.action : 'Action'} */}
    //                 </StyledButton>
    //             </div>
    //             <div className={styles.elementTwoItem}>
    //                 <p>Quantity</p>
    //                 <StyledTextField
    //                     sx={{ maxWidth: '7rem' }}
    //                     type="number"
    //                     value={quantity}
    //                     onChange={(e) => {
    //                         const value = e.target.value;
    //                         if (!value) {
    //                             // setInputValue('');
    //                             return;
    //                         } else {
    //                             if (parseInt(value) < 1) {
    //                                 return;
    //                             }
    //                             handleUpdateQuantity(parseInt(value));
    //                         }

    //                     }}
    //                 ></StyledTextField>
    //             </div>
    //         </div>
    //         <div className={styles.elementTwo}>
    //             <div className={styles.elementTwoItem}>
    //                 <p>Expiration</p>
    //                 <div className={styles.expirationInput}>
    //                     {formatDate(currentExpirationDate)}
    //                 </div>
    //                 {/* <div className={styles.anchor}>
    //                     <StyledButton variant="contained"
    //                         onClick={() => setIsExpirationMenuOpen(prev => !prev)}
    //                         endIcon={<ArrowDropDownOutlined />}
    //                         ref={expirationMenuButtonRef}
    //                         sx={{
    //                             justifyContent: 'space-between',
    //                             width: '9rem',
    //                             whiteSpace: 'nowrap',
    //                         }}>{expirationDate}</StyledButton>
    //                     {isExpirationMenuOpen && (
    //                         <div className={styles.menu} ref={expirationMenuRef}>
    //                             {expirationDates.map((date, index) => (
    //                                 <div className={styles.menuItem} key={index} onClick={() => handleUpdateExpirationDate(date)}>{
    //                                     // formatDate(date).toLocaleUpperCase()
    //                                     date.toLocaleUpperCase()
    //                                 }</div>
    //                             ))}
    //                         </div >
    //                     )}
    //                 </div> */}
    //             </div>
    //             <div className={styles.elementTwoItem}>
    //                 <p>Strike</p>
    //                 <div className={styles.anchor}>
    //                     <StyledButton variant="contained"
    //                         onClick={() => setIsStrikesMenuOpen(prev => !prev)}
    //                         endIcon={<ArrowDropDownOutlined />}
    //                         ref={strikesMenuButtonRef}
    //                         sx={{
    //                             borderRadius: '0px',
    //                             backgroundColor: 'fff',
    //                             justifyContent: 'space-between',
    //                             minWidth: '7rem',
    //                             whiteSpace: 'nowrap',
    //                         }}>
    //                             {/* {currentOptionOrder?.option?.strike} */}
    //                         </StyledButton>
    //                     {isStrikesMenuOpen && (
    //                         <div className={styles.menu} ref={strikesMenuRef}>
    //                             {strikes.map((strike, index) => (
    //                                 <div className={styles.menuItem}  // style={{ backgroundColor: 'red' }}
    //                                     key={index} 
    //                                     onClick={() => handleUpdateStrike(strike)}
    //                                     >
    //                                         {strike}
    //                                 </div>
    //                             ))}
    //                         </div >
    //                     )}
    //                 </div>
    //             </div>
    //         </div>
    //         <div className={styles.element}>
    //             <div className={styles.elementItem}>
    //                 <SentimentVerySatisfied sx={{ color: 'green' }} fontSize="large" /> <p>Max Profit: {maxProfit?.toFixed(2)}</p>
    //             </div>
    //         </div>
    //         <div className={styles.element}>
    //             <div className={styles.elementItem}>
    //                 <SentimentVeryDissatisfied sx={{
    //                     color: 'red',
    //                 }} fontSize="large" /> <p>Max Loss: {maxLoss.toFixed(2)}</p>
    //             </div>
    //         </div>
    //         <div className={styles.element}>
    //             <div className={styles.elementItem}>
    //                 <SentimentSatisfied sx={{
    //                     color: 'grey',
    //                 }} fontSize="large" /> <p>Break Even: {breakEvenPrice?.toFixed(2)}</p>
    //             </div>
    //         </div>
    //         {/* <p>Quantity: {quantity}</p> */}
    //         {/* <p>Option Ask Price: {currentOptionOrder?.option?.ask}</p> */}
    //         {/* <p>Option Total Cost: {cost}</p> */}
    //     </>
    // );
}