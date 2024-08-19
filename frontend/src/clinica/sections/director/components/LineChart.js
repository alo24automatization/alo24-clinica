import React from 'react'
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

function LineChart({ arr, label }) {
    const { t } = useTranslation(['common'])

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Filler,
        Legend
    )

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: 'bottom'
            },
            datalabels: {
                display: false
            },
            title: {
                display: true,
                text: label,
                padding: {
                    bottom: 30
                },
                font: {
                    size: 16,
                    lineHeight: 2,
                },
                color: 'rgba(28, 28, 28, 0.7)'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        hover: {
            mode: 'index',
            intersect: false
        },
        scales: {
            y: {
                min: 0,
                ticks: {
                    callback: (value) => {
                        return value.toLocaleString('ru-Ru')
                    },
                    beginAtZero: true
                }
            }
        }
    }

    const months = [
        'Yanvar',
        'Fevral',
        'Mart',
        'Aprel',
        'May',
        'Iyun',
        'Iyul',
        'Avgust',
        'Sentabr',
        'Oktabr',
        'Noyabr',
        'Dekabr'
    ]
    const labels = months.slice(0, new Date().getMonth() + 1)

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                data: arr,
                borderColor: 'rgb(0,144,163)',
                backgroundColor: 'rgba(0, 180, 204, 0.5)'
            }
        ]
    }
    return (
        <Line options={options} data={data} />
    )
}

export default LineChart