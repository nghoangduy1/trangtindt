window.onload = async function () {
  const res = await fetch('https://api.openweathermap.org/data/2.5/forecast?q=An Giang&units=metric&appid=4aabef534d426073a54e9163fe76578d');
  const data = await res.json();

  if (!data.list) {
    console.error("Không có dữ liệu dự báo:", data);
    return;
  }

  // === Biểu đồ theo giờ hôm nay ===
  const today = new Date().toISOString().split('T')[0];
  const hourlyData = data.list.filter(item => item.dt_txt.startsWith(today));
  const hourLabels = hourlyData.map(item => new Date(item.dt * 1000).getHours() + ":00");
  const hourTemps = hourlyData.map(item => item.main.temp);

  const ctxHour = document.getElementById('weatherChartHour').getContext('2d');
  new Chart(ctxHour, {
    type: 'line',
    data: {
      labels: hourLabels,
      datasets: [{
        label: 'Nhiệt độ hôm nay (°C)',
        data: hourTemps,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Giờ' } },
        y: { title: { display: true, text: '°C' } }
      }
    }
  });

  // === Biểu đồ trung bình mỗi ngày ===
  const dayMap = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dayMap[date]) dayMap[date] = [];
    dayMap[date].push(item.main.temp);
  });

  const dayLabels = Object.keys(dayMap).slice(0, 5);
  const avgTemps = dayLabels.map(date => {
    const temps = dayMap[date];
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    return avg.toFixed(1);
  });

  const ctxDay = document.getElementById('weatherChartDay').getContext('2d');
  new Chart(ctxDay, {
    type: 'bar',
    data: {
      labels: dayLabels,
      datasets: [{
        label: 'Nhiệt độ trung bình (°C)',
        data: avgTemps,
        backgroundColor: '#c10000'
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Ngày' } },
        y: { title: { display: true, text: '°C' }, beginAtZero: false }
      }
    }
  });
};
