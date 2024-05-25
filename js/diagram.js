async function fetchCovidData() {
  const response = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
  const data = await response.json();
  const cases = Object.entries(data.cases).map(([date, count]) => ({ date, cases: count }));
  return cases;
}

async function createChart() {
  const covidData = await fetchCovidData();
  const labels = covidData.map(entry => entry.date);
  const caseData = covidData.map(entry => entry.cases);

  const ctx = document.getElementById('covidChart').getContext('2d');
  const chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Number of cases',
              data: caseData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

createChart();