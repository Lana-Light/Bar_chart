let req = new XMLHttpRequest();
req.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  true
);
req.send();
req.onload = function() {
  let json = JSON.parse(req.responseText);
  let dataset = json.data;
  let data = [];
  dataset.forEach(val => {
    data.push(val[0]);
  });
  data = data.map(val => {
    switch (val[6]) {
      case "1":
        val = parseFloat(val.slice(0, 4) + ".0");
        break;
      case "4":
        val = parseFloat(val.slice(0, 4) + ".25");
        break;
      case "7":
        val = parseFloat(val.slice(0, 4) + ".50");
        break;
      case "0":
        val = parseFloat(val.slice(0, 4) + ".75");
        break;
    }
    return val;
  });
  let tool = document.querySelector("#tooltip");
  const w = 1000;
  const h = 1000;
  const padding = 100;
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d), d3.max(data, d => d)])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([h - padding, padding]);
  const yScale2 = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([0, h - padding * 2]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d => d);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3
    .select("main")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  let text = [["green", "GDP increase"], ["red", "GDP decrease"]];
  let colors = svg
    .selectAll(".color")
    .data(text)
    .enter()
    .append("rect")
    .attr("x", (d, i) => w / 2 + i * 200)
    .attr("y", "10")
    .attr("width", "20px")
    .attr("height", "20px")
    .attr("class", "color")
    .style("fill", (d, i) => text[i][0]);
  let textVals = svg
    .selectAll(".text-val")
    .data(text)
    .enter()
    .append("text")
    .attr("x", (d, i) => w / 2 + i * 200 + 30)
    .attr("y", "25")
    .attr("width", "120px")
    .attr("height", "20px")
    .attr("class", "text-val")
    .style("stroke", (d, i) => text[i][0])
    .text((d, i) => text[i][1]);

  svg
    .selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", (d, i) => xScale(data[i]))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", (w - padding * 2) / data.length)
    .attr("height", d => yScale2(d[1]))
    .attr("class", (d, i) => {
      if (i == 0) {
        return "bar green";
      } else {
        if (dataset[i][1] > dataset[i - 1][1]) {
          return "bar green";
        } else {
          return "bar red";
        }
      }
    })
    .on("mouseover", function(e) {
      tool.setAttribute("data-date", this.getAttribute("data-date"));
      tool.innerHTML = e[0] + "<br>" + e[1];
      tool.style.display = "block";
      tool.style.top = d3.event.pageY + 15 + "px";
      tool.style.left = d3.event.pageX + 15 + "px";
      console.log(this);
    })
    .on("mouseout", function(e) {
      tool.style.display = "none";
    });

  svg
    .append("g")
    .attr("transform", `translate(0,${h - padding})`)
    .attr("id", "x-axis")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `translate(${padding},0)`)
    .attr("id", "y-axis")
    .call(yAxis);
};
