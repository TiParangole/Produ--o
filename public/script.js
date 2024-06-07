var canvas = document.getElementById("myChart");
var data = {
  labels: [],
  datasets: [
    {
      label: "Jeans",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      data: [],
    },
    {
      label: "Tecido",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(255, 105, 97, 0.4)",
      data: [],
    },
  ],
};

const socket = io();

const form = document.getElementById("recordForm");

if (!form) {
  var option = {
    showLines: true,
  };
  var myLineChart = new Chart(canvas, {
    type: "line",
    data: data,
    options: option,
  });

  socket.on("update", (record) => {
    const timestamp = new Date().toLocaleTimeString();

    // Adiciona o novo timestamp aos labels
    myLineChart.data.labels.push(timestamp);

    if (record.tipo === "jeans") {
      // Insere o valor no dataset 0 e repete o último valor do dataset 1
      myLineChart.data.datasets[0].data.push(record.valor);
      const lastValue = myLineChart.data.datasets[1].data.slice(-1)[0] || 0;
      myLineChart.data.datasets[1].data.push(lastValue);
    } else {
      // Insere o valor no dataset 1 e repete o último valor do dataset 0
      const lastValue = myLineChart.data.datasets[0].data.slice(-1)[0] || 0;
      myLineChart.data.datasets[0].data.push(lastValue);
      myLineChart.data.datasets[1].data.push(record.valor);
    }

    myLineChart.update();
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("recordInput");
    const select = document.getElementById("recordSelect").value;
    const data = { valor: parseFloat(input.value), tipo: select }; // Converte o valor para número
    console.log(data);
    socket.emit("new_record", data);

    input.value = "";
  });
}
