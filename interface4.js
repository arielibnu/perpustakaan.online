const ctx = document.getElementById("ratingChart").getContext("2d");

const ratingChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["3726 Mdpl", "Negeri 5 Menara"],
    datasets: [{
      label: "Rating Buku",
      data: [4.7, 4.3, 4.5, 4.6, 4.2],
      backgroundColor: "#3399ff",
      borderRadius: 5
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Rating Buku Populer",
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});

