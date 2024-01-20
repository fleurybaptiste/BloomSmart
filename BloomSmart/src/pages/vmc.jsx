/** @format */

import { useState, useEffect } from 'react';
import '../styles/graph.css';
import axios from 'axios';
import Spinner from '../components/spinner';
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
import '../styles/App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
    responsive: true,
    maintainAspectRatio: false, // Ajoutez ceci pour maintenir l'aspect ratio
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Salon',
        },
    },
    scales: {
        y: {
            // Ajustements pour l'axe Y
            beginAtZero: true,
            ticks: {
                stepSize: 1, // Ajustez selon vos données
            },
        },
        x: {
            // Ajustements pour l'axe X
            ticks: {
                maxTicksLimit: 200,
                autoSkip: true,
                maxRotation: 45,
                minRotation: 45,
            },
        },
    },
};

const fetchDataLastHour = () => axios.get('http://192.168.1.20:3000/api/data/last-hour');
const fetchDataLastDay = () => axios.get('http://192.168.1.20:3000/api/data/last-day');
const fetchDataLastMonth = () => axios.get('http://192.168.1.20:3000/api/data/last-month');

function App() {
    const [sensorData, setSensorData] = useState({ temperatures: [], humidities: [], labels: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [currentPeriod, setCurrentPeriod] = useState('hour');

    useEffect(() => {
        setIsLoading(true); // Débute le chargement

        let fetchFunction = fetchDataLastHour; // Valeur par défaut
        if (currentPeriod === 'day') {
            fetchFunction = fetchDataLastDay;
        } else if (currentPeriod === 'month') {
            fetchFunction = fetchDataLastMonth;
        }

        fetchFunction()
            .then((response) => {
                const data = response.data;
                localStorage.setItem('sensorData', JSON.stringify(data));
                setSensorData({
                    temperatures: data.map((item) => item.temperature),
                    humidities: data.map((item) => item.humidity),
                    labels: data.map((item) => new Date(item.createdAt).toLocaleTimeString()),
                });
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des données:', error);
            })
            .finally(() => {
                setIsLoading(false); // Termine le chargement
            });
    }, [currentPeriod]);

    const lineData = {
        labels: sensorData.labels,
        datasets: [
            {
                label: 'Humidité',
                data: sensorData.humidities,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderWidth: 1,
            },
            {
                label: 'Température',
                data: sensorData.temperatures,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            <div>
                <button onClick={() => setCurrentPeriod('hour')}>Dernière Heure</button>
                <button onClick={() => setCurrentPeriod('day')}>Dernière Journée</button>
                <button onClick={() => setCurrentPeriod('month')}>Dernier Mois</button>
            </div>
            {isLoading ? (
                <Spinner /> // Affiche le spinner pendant le chargement
            ) : (
                <div className="chart-container">
                    <Line options={options} data={lineData} />
                </div>
            )}
        </>
    );
}

export default App;
