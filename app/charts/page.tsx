'use client'

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem,
} from 'chart.js';
import styles from '../page.module.css';

// Register the necessary chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Error function approximation
const erf = (x: number) => {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
};

// Cumulative distribution function for the standard normal distribution
const cdf = (x: number) => {
    return (1.0 + erf(x / Math.sqrt(2))) / 2.0;
};

// Black-Scholes Formula for European Call Option
const blackScholesCall = (S: number, X: number, T: number, r: number, sigma: number) => {
    const d1 = (Math.log(S / X) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return S * cdf(d1) - X * Math.exp(-r * T) * cdf(d2);
};

export default function CurvedLineChart() {
    const strikePrice = 250; // Example strike price for AAPL call option
    const volatility = 0.2664; // Implied volatility (26.64%)
    const riskFreeRate = 0.05; // Risk-free rate (5%)
    const timeToExpiration = 0.25; // Time to expiration in years (3 months)
    const optionCost = 1.95; // Mark price of the option (midpoint between bid/ask)

    // Generate stock prices from 200 to 289 in increments of 0.01
    const stockPrices = [];
    for (let price = 200; price <= 289; price += 0.01) {
        stockPrices.push(parseFloat(price.toFixed(2)));
    }

    const optionsQuantity = 100; // Number of options (100 options)
    const maxLoss = optionCost * optionsQuantity; // Maximum loss is the premium paid for the options

    // Profit/Loss calculation at current time using Black-Scholes
    const currentExpirationData = stockPrices.map(price => {
        const optionValue = blackScholesCall(price, strikePrice, timeToExpiration, riskFreeRate, volatility);
        const profitLoss = optionValue * optionsQuantity - maxLoss;
        return profitLoss;
    });

    // Profit/Loss calculation at expiration date (Black-Scholes adjusted for European-style)
    const expirationDateData = stockPrices.map(price => {
        const profitLoss = price < strikePrice ? -maxLoss : (price - strikePrice) * optionsQuantity - maxLoss;
        return profitLoss;
    });

    const data = {
        labels: stockPrices, // X-axis: Stock prices
        datasets: [
            {
                label: 'Profit/Loss at Current Date',
                data: currentExpirationData, // Y-axis data for current date
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 1, // Ensure the line is always curved
                borderWidth: 1, // Initially hide the line
                pointRadius: 0, // Hide the dots
            },
            {
                label: 'Profit/Loss at Expiration Date',
                data: expirationDateData, // Y-axis data for expiration date
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 1, // Ensure the line is always curved
                borderWidth: 1, // Initially hide the line
                pointRadius: 0, // Hide the dots
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<'line'>) => {
                        const value = tooltipItem.raw as number;
                        return value > 0 ? `Max Profit: ${value}` : `Max Loss: ${value}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Stock Price',
                },
                grid: {
                    display: false,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Profit/Loss',
                },
                grid: {
                    display: false,
                },
                beginAtZero: true,
            },
        },
        hover: {
            mode: 'index' as const,
            intersect: false,
            onHover: (event: React.MouseEvent<HTMLCanvasElement>, chartElement: { index: number; datasetIndex: number }[]) => {
                if (chartElement.length) {
                    const index = chartElement[0].index;
                    const datasetIndex = chartElement[0].datasetIndex;
                    const profitLoss = data.datasets[datasetIndex].data[index];
                    setHoveredProfitLoss(profitLoss);

                    // Make the line visible on hover
                    data.datasets[datasetIndex].borderWidth = 2; // Show the line
                    data.datasets[datasetIndex].pointRadius = 5; // Show the dots when hovering
                } else {
                    // Reset line visibility when not hovering
                    data.datasets.forEach(dataset => {
                        dataset.borderWidth = 0; // Hide the line
                        dataset.pointRadius = 0; // Hide the dots
                    });
                    setHoveredProfitLoss(null);
                }
            },
        },
    };

    const [hoveredProfitLoss, setHoveredProfitLoss] = useState<number | null>(null);

    return (
        <div className={styles.page}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '70%' }}>
                    <h2>AAPL Call Option Profit/Loss at Current vs Expiration Date (100 Options)</h2>
                    <Line data={data} options={options} />
                </div>
                {hoveredProfitLoss !== null && (
                    <div style={{ marginLeft: '20px', textAlign: 'center' }}>
                        <h3>{hoveredProfitLoss > 0 ? `Max Profit: ${hoveredProfitLoss}` : `Max Loss: ${hoveredProfitLoss}`}</h3>
                    </div>
                )}
            </div>
        </div>
    );
};
