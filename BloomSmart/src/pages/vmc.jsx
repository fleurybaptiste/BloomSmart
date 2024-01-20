/** @format */

import { useState, useEffect } from 'react';
import '../styles/graph.css';
import axios from 'axios';
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
            text: 'Graphique',
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
                maxTicksLimit: 20,
                autoSkip: true,
                maxRotation: 45,
                minRotation: 45,
            },
        },
    },
};

function App() {
    const [sensorData, setSensorData] = useState({ temperatures: [], humidities: [], labels: [] });

    const fetchData = () => {
        axios
            .get('http://192.168.1.20:3000/api/data')
            .then((response) => {
                const data = response.data;
                const temperatures = data.map((item) => item.temperature);
                const humidities = data.map((item) => item.humidity);
                const labels = data.map((item) => new Date(item.createdAt).toLocaleTimeString());
                setSensorData({ temperatures, humidities, labels });
            })
            .catch((error) => console.error('Erreur lors de la récupération des données:', error));
    };

    useEffect(() => {
        fetchData(); // Charger les données initialement
        const interval = setInterval(fetchData, 5000); // Rafraîchir toutes les 5 secondes

        return () => clearInterval(interval); // Nettoyer l'intervalle quand le composant est démonté
    }, []);

    const lineData = {
        labels: sensorData.labels,
        datasets: [
            {
                label: 'Humidité',
                data: sensorData.humidities,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Température',
                data: sensorData.temperatures,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <>
            <div className="chart-container">
                <Line options={options} data={lineData} />
            </div>
        </>
    );
}

export default App;
