import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
const GaugeChart = ({ userFinanceKPIs, label }) => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        series: [0],
        options: {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#e7e7e7',
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2,
                        },
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            color: '#5A2C66',
                            fontWeight: '800',
                        },
                        value: {
                            show: true,
                            offsetY: -50,
                            color: '#5A2C66',
                            fontWeight: '800',
                            fontSize: '22px',
                            formatter(val) {
                                return outInPersentage(val);
                            },
                        },
                    },
                },
            },
            grid: {
                padding: {
                    top: -10,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 1,
                    type: 'vertical',
                    opacityFrom: 1,
                    opacityTo: 2,
                    colorStops: [
                        [
                            {
                                offset: 0,
                                color: '#9e2f56',
                                opacity: 1,
                            },
                            {
                                offset: 0.6,
                                color: '#9e2f56',
                                opacity: 50,
                            },
                            {
                                offset: 100,
                                color: '#9e2f56',
                                opacity: 1,
                            },
                        ],
                        [
                            {
                                offset: 0,
                                color: '#9E2654',
                                opacity: 1,
                            },
                            {
                                offset: 50,
                                color: '#9E2654',
                                opacity: 0.75,
                            },
                            {
                                offset: 100,
                                color: '#9E2654',
                                opacity: 1,
                            },
                        ],
                    ],
                },
            },
            labels: ['Credit Score'],
        },
    });
    const outInPersentage = (number) => {
        return number;
    };
    const getInPersent = (number) => {
        return number;
    };
    useEffect(() => {
        const realtime = userFinanceKPIs?.total ? [getInPersent(userFinanceKPIs?.total)] : [0];
        const onrequest = userFinanceKPIs?.totalCreditScore
            ? [getInPersent(userFinanceKPIs?.totalCreditScore)]
            : [0];
        setState(() => ({
            ...state,
            series: userFinanceKPIs?.total ? realtime : onrequest,
        }));
        setLoading(false);
    }, [userFinanceKPIs]);
    return (<div>
      {!loading ? (<ReactApexChart options={state.options} series={state.series} type="radialBar"/>) : ('')}
    </div>);
};
export default GaugeChart;
