'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './Snapshot.module.css';
import { AddOutlined, ArrowDropDownOutlined, CachedOutlined, SentimentSatisfied, SentimentVeryDissatisfied, SentimentVerySatisfied } from '@mui/icons-material';

import { determineOptionBreakEven, determineOptionCost, determineOptionExpirationDate, determineOptionMaxLoss, determineOptionMaxProfit, determineOptionType } from '@/app/utils/utils';
import { StyledButton, StyledTextField } from '../../Styled';
import { OptionOrderType, OptionType } from '@/app/types/types';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { useAppStore } from '@/app/stores/useAppStore';

export default function SnapshotModal() {
    const { currentStock, currentOptionOrder, setCurrentOptionOrder } = useAppStore();
    const { handleSetInfo } = useAuthContext();

    const [isStrikesMenuOpen, setIsStrikesMenuOpen] = useState(false);
    const [quantity, setQuantity] = useState<number>(10);

    const strikesMenuButtonRef = useRef<HTMLButtonElement>(null);
    const strikesMenuRef = useRef<HTMLDivElement>(null);

    // Functions To Handle Option Order Updates

    // Function to handle the update of the action (buy/sell) of the option order
    const handleUpdateAction = () => {
        if (!currentOptionOrder?.action) {
            console.error('Action is undefined');
            return;
        }

        let newAction: 'buy' | 'sell';

        if (currentOptionOrder.action === 'buy') {
            newAction = 'sell';
        } else {
            newAction = 'buy';
        }

        const newOption = currentOptionOrder?.option;
        const newOrderType = currentOptionOrder?.orderType;
        const newStrikes = currentOptionOrder?.strikes;

        if (!newOption) {
            console.error('Option is undefined');
            return;
        }

        const newOptionOrder: OptionOrderType = {
            action: newAction,
            option: newOption,
            orderType: newOrderType,
            strikes: newStrikes,
        };

        setCurrentOptionOrder(newOptionOrder);
        console.log('Updated Option Order: ', newOptionOrder);
    };

    // Function to handle the update of the option based on the option type (call/put)
    const handleUpdateOptionByType = () => {
        if (!currentOptionOrder || !currentStock) {
            if (!currentOptionOrder) {
                console.error('Option Order is undefined');
            }
            if (!currentStock) {
                console.error('Current Stock is undefined');
            }
            handleSetInfo('Error: Current Stock or Option Order is undefined');
            return;
        }

        const expirationDate = determineOptionExpirationDate(currentOptionOrder?.option?.contractSymbol || '');
        const currentOptionType = determineOptionType(currentOptionOrder?.option?.contractSymbol || '');

        let option: OptionType | undefined;

        if (currentOptionType === 'call') {
            option = currentStock.optionChain[expirationDate].puts.find((option: OptionType) => option.strike === currentOptionOrder?.option?.strike);
        } else if (currentOptionType === 'put') {
            option = currentStock.optionChain[expirationDate].calls.find((option: OptionType) => option.strike === currentOptionOrder?.option?.strike);
        }

        // Handles edge case where the option is not found
        if (!option?.contractSymbol) {
            if (currentOptionType === 'call') {
                handleSetInfo('Put option contract not available');
            } else {
                handleSetInfo('Call option contract not available');
            }
            return;
        }

        const updatedOptionOrder: OptionOrderType = {
            action: currentOptionOrder?.action,
            option: option,
            orderType: currentOptionOrder?.orderType,
            strikes: currentOptionOrder?.strikes,
        };

        setCurrentOptionOrder(updatedOptionOrder);
        console.log('Updated Option Order: ', updatedOptionOrder);
    };

    // Function to handle the update of a the option based on the selected strike
    const handleUpdateOptionByStrike = (strike: number) => {
        if (!currentOptionOrder || !currentStock) {
            if (!currentOptionOrder) {
                console.error('Option Order is undefined');
            }
            if (!currentStock) {
                console.error('Current Stock is undefined');
            }
            handleSetInfo('Error: Current Stock or Option Order is undefined');
            setIsStrikesMenuOpen(false);
            return;
        }

        const expirationDate = determineOptionExpirationDate(currentOptionOrder?.option?.contractSymbol || '');
        const currentOptionType = determineOptionType(currentOptionOrder?.option?.contractSymbol || '');

        let option: OptionType | undefined;

        if (currentOptionType === 'call') {
            option = currentStock.optionChain[expirationDate].calls.find((option: OptionType) => option.strike === strike);
        } else if (currentOptionType === 'put') {
            option = currentStock.optionChain[expirationDate].puts.find((option: OptionType) => option.strike === strike);
        }

        // Handles edge case where the option is not found
        if (!option?.contractSymbol) {
            handleSetInfo('Contract N/A');
            setIsStrikesMenuOpen(false);
            return;
        }

        const updatedOptionOrder: OptionOrderType = {
            action: currentOptionOrder?.action,
            option: option,
            orderType: currentOptionOrder?.orderType,
            strikes: currentOptionOrder?.strikes,
        };
        setCurrentOptionOrder(updatedOptionOrder);
        setIsStrikesMenuOpen(false);
        console.log('Updated Option Order: ', updatedOptionOrder);
    };

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

    return (
        <>
            <div className={styles.elementTwo}>
                <div className={styles.elementTwoItem}>
                    <p>Ask:</p>
                    {currentOptionOrder?.option?.ask?.toFixed(2)}
                </div>
                <div className={styles.elementTwoItem}>
                    <p>Bid:</p>
                    {currentOptionOrder?.option?.bid?.toFixed(2)}
                </div>
                <div className={styles.elementTwoItem}>
                    <p>Type</p>
                    <StyledButton variant="contained" endIcon={<CachedOutlined />} onClick={() => handleUpdateOptionByType()}
                        sx={{
                            borderRadius: '0px',
                            backgroundColor: 'fff',
                            justifyContent: 'space-between',
                            minWidth: '7rem',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {determineOptionType(currentOptionOrder?.option?.contractSymbol || '') === 'call' ? 'Call' : 'Put'}
                    </StyledButton>
                </div>
            </div>

            <div className={styles.elementTwo}>
                <div className={styles.elementTwoItem}>
                    <p>Action </p>
                    <StyledButton variant="contained" endIcon={<CachedOutlined />} onClick={() => handleUpdateAction()}
                        sx={{
                            borderRadius: '0px',
                            backgroundColor: 'fff',
                            justifyContent: 'space-between',
                            minWidth: '7rem',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {currentOptionOrder?.action === 'buy' ? 'Buy' : 'Sell'}
                    </StyledButton>
                </div>
                <div className={styles.elementTwoItem}>
                    <p>Quantity</p>
                    <StyledTextField
                        sx={{ maxWidth: '7rem' }}
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                                setQuantity(value);
                            } else {
                                return;
                            }
                        }}
                    ></StyledTextField>
                </div>
            </div>

            <div className={styles.elementTwo}>
                <div className={styles.elementTwoItem}>
                    <p>Expiration</p>
                    <div className={styles.expirationInput}>
                        {determineOptionExpirationDate(currentOptionOrder?.option?.contractSymbol || '')}
                    </div>
                </div>
                <div className={styles.elementTwoItem}>
                    <p>Strike</p>
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
                            }}>
                            {currentOptionOrder?.option?.strike}
                        </StyledButton>
                        {isStrikesMenuOpen && (
                            <div className={styles.menu} ref={strikesMenuRef}>
                                {
                                    currentOptionOrder?.strikes?.map((strike, index) => (
                                        <div className={styles.menuItem} key={index} onClick={() => handleUpdateOptionByStrike(strike)}>
                                            {strike}
                                        </div>
                                    ))
                                }
                            </div >
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.element}>
                <div className={styles.elementItem}>
                    <p>Estimated Total Cost: {determineOptionCost(
                        currentOptionOrder?.action,
                        currentOptionOrder?.option,
                        quantity
                    ).toFixed(2)}</p>
                </div>
            </div>

            <div className={styles.element}>
                <div className={styles.elementItem}>
                    <SentimentVerySatisfied sx={{ color: 'green' }} fontSize="large" /> <p>Max Profit: {determineOptionMaxProfit(
                        currentOptionOrder?.action,
                        currentOptionOrder?.option,
                        quantity
                    ).toFixed(2)}</p>
                </div>
            </div>

            <div className={styles.element}>
                <div className={styles.elementItem}>
                    <SentimentVeryDissatisfied sx={{
                        color: 'red',
                    }} fontSize="large" /> <p>Max Loss: {determineOptionMaxLoss(
                        currentOptionOrder?.action,
                        currentOptionOrder?.option,
                        quantity
                    ).toFixed(2)}</p>
                </div>
            </div>

            <div className={styles.element}>
                <div className={styles.elementItem}>
                    <SentimentSatisfied sx={{
                        color: 'grey',
                    }} fontSize="large" /> <p>Break Even Price: {
                        determineOptionBreakEven(
                            currentOptionOrder?.action,
                            currentOptionOrder?.option,
                        ).toFixed(2
                        )}</p>
                </div>
            </div>

            <div className={styles.elementTwo}>
                <StyledButton variant="contained">Alpha AI</StyledButton>
                <StyledButton variant="contained" endIcon={<AddOutlined/>}>Project</StyledButton>
            </div>
        </>
    );
}