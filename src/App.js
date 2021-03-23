import { useEffect, useRef } from "react";
import * as d3 from "d3";

const data = [
  { name: "A", value: 100 },
  { name: "B", value: 200 },
  { name: "C", value: 500 },
  { name: "D", value: 150 },
  { name: "E", value: 300 },
];

const margin = { top: 30, right: 0, bottom: 30, left: 40 };

const height = 250;

const width = 300;

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const x = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(data.y)
        );

    const xAxis = (g) =>
      g.attr("transform", `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .tickFormat((i) => data[i].name)
          .tickSizeOuter(0)
      );

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join(
        (enter) => enter.append("rect"),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("x", (d, i) => x(i))
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value))
      .attr("width", x.bandwidth());
  }, []);

  return <div ref={ref} />;
};

export default App;
