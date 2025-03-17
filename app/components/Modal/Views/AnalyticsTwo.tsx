// 'use client'

// import { useAppContext } from "@/app/providers/AppProvider";
// import { SearchOutlined } from "@mui/icons-material";
// import styles from './Analytics.module.css';
// import { StyledTextField } from '@/app/components/Styled';
// import { blackScholesCall, convertUnixTimestamp, formatPlusMinus } from "@/app/utils/utils";
// import { InputAdornment } from "@mui/material";
// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';





// // const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
// //     if (active && payload && payload.length) {


// //         return (
// //             <div style={{
// //                 top: '0',
// //                 position: 'absolute',
// //             }}>
// //                 <p>{`Price: ${label}`}</p>
// //                 <p>{`Current: ${payload[0]?.value && payload[0].value.toFixed(2)}`}</p>
// //                 <p>{`Expiration: ${payload[1]?.value && payload[1].value.toFixed(2)}`}</p>

// //             </div>
// //         );
// //     }

// //     return null;
// // };

// export default function Analytics() {
//     const { currentExpirationDate, currentStock, currentOption, fetchStockData } = useAppContext();
//     const [inputValue, setInputValue] = useState('');


//     // console.log('currentOption: ', currentOption);

//     const strikePrice = currentOption?.strike || 0; // Example strike price for AAPL call option
//     const volatility = currentOption?.impliedVolatility || 0; // Implied volatility (26.64%)
//     const riskFreeRate = 0.05; // Risk-free rate (5%)

//     // const convertTimeToExpiration = (date: string) => {
//     //     // Get the timestamp for the input date and current date
//     //     const dateToNumber = new Date(date).getTime();
//     //     const currentDate = new Date().getTime();

//     //     // Check if the date is valid
//     //     if (isNaN(dateToNumber)) {
//     //         console.error("Invalid date format");
//     //         return NaN;
//     //     }

//     //     // Calculate the difference in milliseconds
//     //     const timeDifference = dateToNumber - currentDate;

//     //     // Convert milliseconds to days (1 day = 1000 * 60 * 60 * 24 ms)
//     //     const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

//     //     // Convert days difference to fraction of a year (365 days in a year)
//     //     const fractionOfYear = daysDifference / 365;

//     //     console.log('fractionOfYear: ', fractionOfYear);

//     //     return fractionOfYear;
//     // };


//     // const timeToExpiration = convertTimeToExpiration(currentExpirationDate || ''); // Time to expiration in years (3 months)
//     const strikePricePlusOptionCost = (currentOption?.strike || 0) + (currentOption?.ask || 0); // Stock price + option cost
//     console.log('stockPricePlusOptionCost: ', strikePricePlusOptionCost);
//     const optionCost = (currentOption?.ask || 0) * 100; // Mark price of the option (midpoint between bid/ask)

//     const stockPrices = [];
//     const currentStockPrice = currentStock?.regularMarketPrice || 0;
//     const roundedStockPrice = Math.round(currentStockPrice);
//     const priceBottom = roundedStockPrice - 40;
//     const priceTop = roundedStockPrice + 40;

//     for (let price = priceBottom; price <= priceTop; price += 0.01) {
//         stockPrices.push(parseFloat(price.toFixed(2)));
//     }

//     const optionsQuantity = 10; // Number of options (100 options)
//     const maxLoss = optionCost * optionsQuantity; // Maximum loss is the premium paid for the options

//     // const currentExpirationData = stockPrices.map(price => {
//     //     const optionValue = blackScholesCall(price, strikePrice, timeToExpiration, riskFreeRate, volatility);
//     //     const profitLoss = optionValue * optionsQuantity - maxLoss;
//     //     return { price, profitLossOne: profitLoss };
//     // });

//     // Profit/Loss calculation at expiration date (American-style approximation)
//     const expirationDateData = stockPrices.map(price => {
//         const intrinsicValue = Math.max(0, price - strikePrice);
//         const profitLoss = intrinsicValue * optionsQuantity - maxLoss;
//         // console.log('price: ', price);
//         // console.log('profitLoss: ', profitLoss);
//         return { price, profitLossTwo: profitLoss };
//     });

//     const handleFetchStockData = async () => {
//         if (inputValue.length === 0) return;
//         if (currentStock?.symbol?.toLowerCase() == inputValue.toLowerCase()) return;
//         try {
//             await fetchStockData(inputValue);
//             setInputValue('');
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // Maximum loss is the premium paid for the options
//     const CustomTooltip = ({ label }: TooltipProps<number, string>) => {
//         // const strikePrice = currentOption?.strike || 0; // Example strike price for AAPL call option
//         // const volatility = currentOption?.impliedVolatility || 0; // Implied volatility (26.64%)
//         // const riskFreeRate = 0.05; // Risk-free rate (5%
//         // const timeToExpiration = convertTimeToExpiration(currentExpirationDate || ''); // Time to expiration in years (3 months)



//         // const price = parseFloat(label);
//         // const optionValueCurrent = blackScholesCall(price, strikePrice, timeToExpiration, riskFreeRate, volatility);
//         // const profitLossCurrent = optionValueCurrent * optionsQuantity - maxLoss;

//         // const intrinsicValue = Math.max(0, price - strikePrice);
//         // const profitLossExpiration = intrinsicValue * optionsQuantity - maxLoss;

//         return (
//             <div style={{
//                 top: '0',
//                 width: '300px',
//                 position: 'absolute',
//             }}>

//                 <p>{`Price: ${label}`}</p>
//                 {/* <p>{`Current: ${profitLossCurrent.toFixed(2)}`}</p>
//                 <p>{`Expiration: ${profitLossExpiration.toFixed(2)}`}</p> */}
//             </div>
//         );
//     };

//     return (
//         <>
//             <div className={styles.headerElement}>
//                 <div>
//                     <StyledTextField
//                         sx={{
//                             maxWidth: '7.6rem',
//                             margin: '0',
//                             padding: '0',
//                         }}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         value={inputValue.toUpperCase()}
//                         placeholder={currentStock?.symbol ? currentStock.symbol : 'SYMBOL'}
//                         autoComplete="off"
//                         slotProps={{
//                             input: {
//                                 endAdornment: (
//                                     <InputAdornment position="end" sx={{
//                                         touchAction: 'none',
//                                         padding: 0,
//                                         margin: 0
//                                     }}>
//                                         <SearchOutlined onClick={handleFetchStockData}
//                                             sx={{
//                                                 cursor: 'pointer',
//                                                 color: 'grey',
//                                             }} />
//                                     </InputAdornment>
//                                 )
//                             }
//                         }}>
//                     </StyledTextField>
//                     {currentStock && (
//                         <p>{currentStock.shortName}</p>
//                     )}
//                 </div>
//             </div>
//             <div className={styles.headerElement}>
//                 {currentStock && (
//                     <div>
//                         <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
//                             ? currentStock.regularMarketChangePercent > 0
//                                 ? styles.post
//                                 : styles.leadingPNeg
//                             : ''
//                         }
//                         >{
//                                 currentStock.regularMarketPrice?.toFixed(2)
//                             }</p>

//                         <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
//                             ? currentStock.regularMarketChangePercent > 0
//                                 ? styles.positive
//                                 : styles.negative
//                             : ''
//                         }>{formatPlusMinus(currentStock.regularMarketChange)}</p>
//                         <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
//                             ? currentStock.regularMarketChangePercent > 0
//                                 ? styles.positive
//                                 : styles.negative
//                             : ''
//                         }>({formatPlusMinus(currentStock.regularMarketChangePercent)}%)</p>
//                         <p>{convertUnixTimestamp(currentStock.regularMarketTime)}</p>
//                     </div>
//                 )}
//             </div>

//             {/* <p>Max Loss {maxLoss}</p> */}

//             <ResponsiveContainer width="100%" height={300}>
//                 <LineChart>
//                     <XAxis dataKey="price" tickLine={false} minTickGap={5} type="number" domain={['dataMin', 'dataMax']} />
//                     <YAxis orientation="right" tickLine={false} minTickGap={5} type="number" />
//                     <Tooltip
//                         isAnimationActive={true}
//                         content={<CustomTooltip />}
//                     />
//                     {/* <Line
//                         dot={false}
//                         type="monotone"
//                         dataKey="profitLossOne"
//                         stroke="#82ca9d"
//                         activeDot={{ r: 8 }}
//                         data={currentExpirationData}
//                     /> */}
//                     <Line
//                         dot={false}
//                         type="monotone"
//                         dataKey="profitLossTwo"
//                         stroke="#8884d8"
//                         activeDot={{ r: 8 }}
//                         data={expirationDateData}
//                     />
//                 </LineChart>

//             </ResponsiveContainer>
//         </>

//     );
// }