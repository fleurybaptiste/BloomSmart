/** @format */

import '../styles/App.css';
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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Graphique',
        },
    },
};

const data = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
    datasets: [
        {
            label: 'Humidité',
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Température',
            data: [22, 19, 23, 24, 20, 25, 26],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

const labels = Array.from({ length: 60 }, (_, i) => `${i} min`);

const humidityData = {
    labels,
    datasets: [
        {
            label: 'Humidité',
            data: Array.from({ length: 60 }, () => Math.random() * 100),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

const temperatureData = {
    labels,
    datasets: [
        {
            label: 'Température',
            data: Array.from({ length: 60 }, () => Math.random() * 30),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

function App() {
    return (
        <>
            <div>
                <h1 className="module_title">VMC</h1>
                <Line options={options} data={data} />
            </div>

            <div>
                <h2>Humidité par Minute</h2>
                <Line
                    options={{ ...options, title: { ...options.title, text: 'Humidité par Minute' } }}
                    data={humidityData}
                />
            </div>
            <div>
                <h2>Température par Minute</h2>
                <Line
                    options={{ ...options, title: { ...options.title, text: 'Température par Minute' } }}
                    data={temperatureData}
                />
            </div>
        </>
    );
}

export default App;
