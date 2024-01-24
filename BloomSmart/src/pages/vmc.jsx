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

const API_URL = 'http://192.168.1.27:3000/api/data';
const deviceNames = {
    '5C:CF:7F:53:BE:F5': 'Salon',
    'B4:E6:2D:15:D8:A5': 'Grenier',
    'DC:4F:22:2E:ED:1E': 'Chambre Parents',
    'EC:FA:BC:1D:48:A4': 'Chambre Jules',
    // ... autres dispositifs ...
};

function App() {
    const [sensorData, setSensorData] = useState({ temperatures: [], humidities: [], labels: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [currentPeriod, setCurrentPeriod] = useState('hour');
    const [selectedSensor, setSelectedSensor] = useState('5C:CF:7F:53:BE:F5');
    const sensorList = ['5C:CF:7F:53:BE:F5', 'B4:E6:2D:15:D8:A5', 'DC:4F:22:2E:ED:1E', 'EC:FA:BC:1D:48:A4'];

    const [averages, setAverages] = useState({ avgTemperature: 0, avgHumidity: 0 });
    const [latestValues, setLatestValues] = useState({ temperature: 0, humidity: 0 });

    const getChartOptions = () => {
        const deviceName = deviceNames[selectedSensor] || 'Unknown Device';
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    // position: 'top',
                    display: false,
                },
                title: {
                    display: true,
                    text: deviceName,
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#011323np', // Rend le quadrillage de l'axe Y blanc
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
                        color: '#011323', // Rend le quadrillage de l'axe X blanc
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
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let url = `${API_URL}/`;
                switch (currentPeriod) {
                    case 'hour':
                        url += 'last-hour';
                        break;
                    case 'day':
                        url += 'last-day';
                        break;
                    case 'month':
                        url += 'last-month';
                        break;
                    default:
                        url += 'last-hour'; // valeur par défaut si aucun cas ne correspond
                }
                url += `?deviceId=${selectedSensor}`;

                const response = await axios.get(url);
                const data = response.data;
                const averages = calculateAverages(data);
                const latest = data[data.length - 1] || { temperature: 0, humidity: 0 };

                setSensorData({
                    temperatures: data.map((item) => item.temperature),
                    humidities: data.map((item) => item.humidity),
                    labels: data.map((item) => new Date(item.createdAt).toLocaleTimeString()),
                });
                setAverages(averages);
                setLatestValues(latest);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentPeriod, selectedSensor]);

    const calculateAverages = (data) => {
        const totalTemperature = data.reduce((acc, curr) => acc + curr.temperature, 0);
        const totalHumidity = data.reduce((acc, curr) => acc + curr.humidity, 0);
        return {
            avgTemperature: totalTemperature / data.length,
            avgHumidity: totalHumidity / data.length,
        };
    };

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
    const handleSensorChange = (event) => {
        setSelectedSensor(event.target.value);
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
                            <FaThermometerHalf style={{ color: 'crimson' }} /> {latestValues.temperature.toFixed(2)}°C
                        </p>
                        <p>
                            <MdOutlineWaterDrop style={{ color: 'lightblue' }} /> {latestValues.humidity.toFixed(2)}%
                        </p>
                    </div>

                    <div style={{ width: '45%' }}>
                        <h3>Moyennes</h3>
                        <p>
                            <FaThermometerHalf style={{ color: 'crimson' }} /> {averages.avgTemperature.toFixed(2)}°C
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
                            <Line options={getChartOptions()} data={lineData} />
                        </>
                    )}
                </div>

                <div style={{ marginTop: '20px' }}>
                    {/* Sélecteur de capteur */}
                    <select value={selectedSensor} onChange={handleSensorChange}>
                        {sensorList.map((sensor) => (
                            <option key={sensor} value={sensor}>
                                {deviceNames[sensor] || 'Unknown Device'}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => setCurrentPeriod('hour')}>Dernière Heure</button>
                    <button onClick={() => setCurrentPeriod('day')}>Dernière Journée</button>
                    <button onClick={() => setCurrentPeriod('month')}>Dernier Mois</button>
                </div>
            </div>
        </>
    );
}

export default App;
