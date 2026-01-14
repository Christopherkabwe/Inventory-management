export const barNoLegend = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
};

const barOptionsNoLegend = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        datalabels: {
            display: true,
            anchor: "end",
            align: "top",
            offset: 4,
            color: "#374151", // gray-700
            font: {
                size: 11,
                weight: "500",
            },
            formatter: (value: number) =>
                value.toLocaleString(), // 1,234
        },
    },
};

export const barWithLegend = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true },
    },
};
