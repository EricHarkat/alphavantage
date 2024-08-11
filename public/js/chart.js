document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('priceChart').getContext('2d');
    const dates = JSON.parse(document.getElementById('chart-dates').textContent);
    const prices = JSON.parse(document.getElementById('chart-prices').textContent);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Prix de clôture',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });
});
