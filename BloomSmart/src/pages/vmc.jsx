/** @format */

import { useState, useEffect } from 'react';
import '../styles/graph.css';
import axios from 'axios';
import Spinner from '../components/spinner';
import { FaThermometerHalf } from 'react-icons/fa'; // Pour l'icône du thermomètre
import { MdOutlineWaterDrop } from 'react-icons/md';
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
    maintainAspectRatio: false,
    plugins: {
        legend: {
            // position: 'top',
            display: false,
        },
        title: {
            display: true,
            text: 'Salon',
        },
    },
    scales: {
        y: {
            beginAtZero: false,
            grid: {
                color: 'grey', // Rend le quadrillage de l'axe Y blanc
            },
            ticks: {
                stepSize: 0.5,
                // callback: function (value) {
                //     // Cette fonction détermine ce qui est affiché sur chaque étiquette de l'axe Y
                //     return value.toFixed(1); // Affiche une seule décimale
                // },
            },
        },
        x: {
            grid: {
                color: 'grey', // Rend le quadrillage de l'axe X blanc
            },
            ticks: {
                // maxTicksLimit: 100,
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
    const [averages, setAverages] = useState({
        avgTemperature: 0,
        avgHumidity: 0,
    });
    const [latestValues, setLatestValues] = useState({ temperature: 0, humidity: 0 });

    // Fonction pour calculer les moyennes
    const calculateAverages = (data) => {
        const totalTemperature = data.reduce((acc, curr) => acc + curr.temperature, 0);
        const totalHumidity = data.reduce((acc, curr) => acc + curr.humidity, 0);
        const avgTemperature = totalTemperature / data.length;
        const avgHumidity = totalHumidity / data.length;

        return { avgTemperature, avgHumidity };
    };

    useEffect(() => {
        setIsLoading(true);

        let fetchFunction = fetchDataLastHour;
        if (currentPeriod === 'day') {
            fetchFunction = fetchDataLastDay;
        } else if (currentPeriod === 'month') {
            fetchFunction = fetchDataLastMonth;
        }

        fetchFunction()
            .then((response) => {
                const data = response.data;
                const { avgTemperature, avgHumidity } = calculateAverages(data);
                const latest = data[data.length - 1] || { temperature: 0, humidity: 0 };
                setSensorData({
                    temperatures: data.map((item) => item.temperature),
                    humidities: data.map((item) => item.humidity),
                    labels: data.map((item) => new Date(item.createdAt).toLocaleTimeString()),
                });
                setAverages({ avgTemperature, avgHumidity });
                setLatestValues({ temperature: latest.temperature, humidity: latest.humidity });
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des données:', error);
            })
            .finally(() => {
                setIsLoading(false);
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '100vh',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', marginBottom: '20px' }}>
                    <div style={{ width: '45%' }}>
                        <h3>Temps Réel</h3>
                        <p>
                            <FaThermometerHalf style={{ color: 'red' }} /> {latestValues.temperature.toFixed(2)}°C
                        </p>
                        <p>
                            <MdOutlineWaterDrop style={{ color: 'lightblue' }} /> {latestValues.humidity.toFixed(2)}%
                        </p>
                    </div>

                    <div style={{ width: '45%' }}>
                        <h3>Moyennes</h3>
                        <p>
                            <FaThermometerHalf style={{ color: 'red' }} /> {averages.avgTemperature.toFixed(2)}°C
                        </p>
                        <p>
                            <MdOutlineWaterDrop style={{ color: 'lightblue' }} /> {averages.avgHumidity.toFixed(2)}%
                        </p>
                    </div>
                </div>

                <div className="chart-container" style={{ width: '90%' }}>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <Line options={options} data={lineData} />
                        </>
                    )}
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button onClick={() => setCurrentPeriod('hour')}>Dernière Heure</button>
                    <button onClick={() => setCurrentPeriod('day')}>Dernière Journée</button>
                    <button onClick={() => setCurrentPeriod('month')}>Dernier Mois</button>
                </div>
            </div>
        </>
    );
}

export default App;
