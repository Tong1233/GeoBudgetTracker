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
    Filler,
} from 'chart.js';

import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-moment';
import { Line } from 'react-chartjs-2';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler); // tree shakeable!!! 


const LineGraph = ({ rawdataexpenses }) => {

    const [processedExpenses, setprocessedExpenses] = useState([]);

    /*const rawdataexpenses = [
        { date: '11-20-2023', amount: 12 },
        { date: '11-20-2023', amount: 24 },
        { date: '11-16-2023', amount: 13 },
        { date: '11-17-2023', amount: 30 },
        { date: '11-18-2023', amount: 45 }];*/

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

    
    useEffect(() => {
        //console.log(rawdataexpenses.length);
        if (rawdataexpenses.length > 0) {
            setprocessedExpenses(processExpenses(rawdataexpenses));
        } else {
            setprocessedExpenses([{ date:'', amount: 0 }]);
        }
    }, [rawdataexpenses]);

    //const processedExpenses = processExpenses(rawdataexpenses);
    //console.log(processedExpenses);

    const data = {
        labels: processedExpenses.map((entry) => entry.date),
        /*labels: [
            new Date('11-14-2023'),
            new Date('11-15-2023'),
            new Date('2023-11-19T12:00:00Z'),
            new Date('2023-11-20T12:00:00Z'),
            new Date('2023-11-21T12:00:00Z'),
        ],*/
        datasets: [
            {
                //data: [30, 30, 45, 90, 50],
                data: processedExpenses.map((entry) => entry.amount),
                borderColor: 'black',
                borderWidth: 2,
                pointBackgroundColor: 'black',
                pointRadius: 4,
                tension: 0.3,
                fill: true,
                backgroundColor: (context) => {
                    if (!context || !context.chart || !context.chart.ctx || !context.chart.chartArea) {
                        // Return a default background color or handle the absence of context gracefully
                        return 'rgba(255, 0, 0, 0.3)';
                    }

                    const { ctx, chartArea } = context.chart;
                    const gradient = ctx.createLinearGradient(chartArea.left, chartArea.bottom, chartArea.left, chartArea.top);

                    gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
                    gradient.addColorStop(1, 'rgba(255, 0, 0, 0.4)');

                    return gradient;
                },
            },
        ],
    };

    const config = {
        maintainAspectRatio: false, 
        responsive: true, // Ensure responsiveness
        animation: {
            duration: 0  // Set duration to 0 to disable the loading animation
        },
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
        
        plugins: {
            legend: {
                display: false,
            },
        },

    };

    return (
        <div style={{ width: '50vw', height: '50vh', overflow: 'auto' }}>
            <Line data={data} options={config} />
        </div>
    );
}
export default LineGraph;
