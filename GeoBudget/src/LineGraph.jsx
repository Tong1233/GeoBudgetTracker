import React, { useEffect, useState } from 'react';

import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-moment';
import { Line } from 'react-chartjs-2';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend); // tree shakeable!!! 


const LineGraph = () => {
    const rawdataexpenses = [
        { date: '11-20-2023', amount: 12 },
        { date: '11-20-2023', amount: 24 },
        { date: '11-16-2023', amount: 13 },
        { date: '11-17-2023', amount: 30 },
        { date: '11-18-2023', amount: 45 }];

    function processExpenses(rawData) {
        const processedData = rawData.reduce((result, { date, amount }) => {
            // Convert the date string to a Date object
            const currentDate = new Date(date);

            // Check if the date already exists in the result array
            const existingEntry = result.find((entry) => entry.date.getTime() === currentDate.getTime());

            if (existingEntry) {
                // If the date exists, add the amounts together
                existingEntry.amount += amount;
            } else {
                // If the date doesn't exist, add a new entry to the result array
                result.push({ date: currentDate, amount });
            }

            return result;
        }, []);

        // Sort the processedData array by date in ascending order
        processedData.sort((a, b) => a.date - b.date);

        return processedData;
    }

    const processedExpenses = processExpenses(rawdataexpenses);
    console.log(processedExpenses);

    const data = {
        //labels: processedExpenses.map((entry) => entry.date),
        labels: [
            new Date('11-14-2023'),
            new Date('11-15-2023'),
            new Date('2023-11-19T12:00:00Z'),
            new Date('2023-11-20T12:00:00Z'),
            new Date('2023-11-21T12:00:00Z'),
        ],
        datasets: [
            {
                data: [30, 30, 45, 90, 50], //processedExpenses.map((entry) => entry.amount),
                fill: false,
                borderColor: 'black',
                borderWidth: 2,
                pointBackgroundColor: 'black',
                pointRadius: 2,
                tension: 0.3,
                backgroundColor: 'blue'
            },
        ],
    };

    const config = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM D yyyy',
                    },
                },
                title: {
                    display: true,
                    text: 'Date',
                    font: {
                        size: 16, // Adjust the font size
                        weight: 'bold', // Make the font bold
                    },
                },
                angleLines: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)', // Set the color of the diagonal lines
                },
                ticks: {
                    maxRotation: 45, // Set the maximum rotation angle for labels
                    minRotation: 20, // Set the minimum rotation angle for labels
                },
                grid: {
                    display: false, // Turn off the x-axis grid lines
                },
            },

            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '($) Expenses',
                    font: {
                        size: 16, // Adjust the font size
                        weight: 'bold', // Make the font bold
                    },
                },
                grid: {
                    display: false, // Turn off the x-axis grid lines
                },
            }
        },
        elements: {
            line: {
                fill: {
                    target: 'origin', // Fill the area under the line from the origin
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            filler: {
                propagate: true,
            },
        },

    };

    return (
        <div style={{ width: '37vw', height: '50vh' }}>
            <Line data={data} options={config} />
        </div>
    );
}
export default LineGraph;
