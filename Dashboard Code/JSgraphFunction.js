/* 막대 그래프 초기화 함수 */
function barPlotInit() {
    // 그래프 크기 조정
    margin = { top: 5, right: 10, bottom: 40, left: 75 };
    width = 700 - margin.left - margin.right;
    height = 240 - margin.top - margin.bottom;

    svg = d3.select("#barplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X축 초기화
    x = d3.scaleBand().range([0, width]).padding(0.2);
    xAxis = svg.append("g").attr("transform", "translate(0," + height + ")");

    // Y축 초기화
    y = d3.scaleLinear().range([height, 0]);
    yAxis = svg.append("g");
    yGrid = svg.append("g").attr("class", "grid"); // Y축 그리드

    // X축 레이블
    svg.append("text").attr("text-anchor", "end")
        .attr("x", width).attr("y", height + margin.top + 30)
        .text("노선 번호");

    // Y축 레이블
    svg.append("text").attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20).attr("x", -margin.top)
        .text("승차 승객 수");
}

/* 막대 그래프 그리는 함수 */
function drawBarPlot(newNum, n1, n2) {
    var tmp = "https://raw.githubusercontent.com/annyoon/InformationDesign/master/Dataset/",
        url = tmp + newNum + "/compare" + newNum + ".csv";

    var tooltip = d3.select("#barplot").append("div")
        .attr("class", "tooltip-bar")
        .style("display", "none");

    d3.csv(url, function (data) {
        var sumstat = d3.nest()
            .key(function (d) { return d.bus; }) // 버스 그룹으로 묶기
            .rollup(function (leaves) {
                return {
                    "total": d3.sum(leaves, function (d) {
                        if (pad(d.time) >= pad(n1) && pad(d.time) <= pad(n2)) { return d.passenger }
                    })
                }
            }) // 승객 수 합을 새로운 값으로 넣어줌
            .entries(data);

        sumstat.sort(function (a, b) { return b.value.total - a.value.total; }) // 내림차순 정렬

        // 업데이트
        x.domain(sumstat.map(function (d) { return d.key; }))
        xAxis.call(d3.axisBottom(x))

        y.domain([0, d3.max(sumstat, function (d) { return +d.value.total })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));
        yGrid.transition().duration(1000)
            .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

        var u = svg.selectAll("rect").data(sumstat);

        u.enter()
            .append("rect")
            .merge(u)
            .on('mouseover', function () {
                d3.select(this).attr("fill", function (d) {
                    if (d.key == newNum) { return '#0068D0'; }
                    else return '#3B3B3B';
                })
                tooltip.style("display", null);
            })
            .on('mouseout', function () {
                d3.select(this).attr("fill", function (d) {
                    if (d.key == newNum) { return '#3399FF'; }
                    else return '#737373';
                })
                tooltip.style("display", "none");
            })
            .on('mousemove', function (d) {
                tooltip.style("top", (d3.event.pageY - 60) + "px");
                tooltip.style("left", (d3.event.pageX - 580) + "px");
                tooltip.text(d.key + ", value: " + d.value.total);
            })
            .transition().duration(1000)
            .attr("x", function (d) { return x(d.key); })
            .attr("y", function (d) { return y(+d.value.total); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(+d.value.total); })
            .attr("fill", function (d) {
                // 신규 노선만 색상 강조
                if (d.key == newNum) { return '#3399FF'; }
                else return '#737373';
            })

        u.exit().remove();
    })

    /* 자릿수 맞추는 함수 */
    function pad(num) {
        num = num + "";
        if (num.length == 1) { return "0" + num; }
        else return num
    }
}

/* 라인 그래프 초기화 함수 */
function linePlotInit() {
    // 그래프 크기 조정
    margin = { top: 5, right: 10, bottom: 40, left: 75 };
    width2 = 700 - margin.left - margin.right;
    height2 = 240 - margin.top - margin.bottom;

    svg2 = d3.select("#lineplot")
        .append("svg")
        .attr("width", width2 + margin.left + margin.right)
        .attr("height", height2 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X축 초기화
    x2 = d3.scaleLinear().domain([0, 23]).range([0, width2]);
    svg2.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x2).ticks(20));

    // X축 그리드
    svg2.append("g").attr("class", "grid")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x2).tickSize(-height2).tickFormat(""));

    // Y축 초기화
    y2 = d3.scaleLinear().range([height2, 0]);
    yAxis2 = d3.axisLeft().scale(y2);
    svg2.append("g").attr("class", "myYaxis2");
    yGrid2 = svg2.append("g").attr("class", "grid"); // Y축 그리드

    // X축 레이블
    svg2.append("text").attr("text-anchor", "end")
        .attr("x", width2).attr("y", height2 + margin.top + 30)
        .text("시간");

    // Y축 레이블
    svg2.append("text").attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20).attr("x", -margin.top)
        .text("승차 승객 수")
}

/* 라인 그래프 그리는 함수 */
function drawLinePlot(newNum) {
    var tmp = "https://raw.githubusercontent.com/annyoon/InformationDesign/master/Dataset/",
        url = tmp + newNum + "/compare" + newNum + ".csv";

    d3.csv(url, function (data) {
        var sumstat = d3.nest() // 버스 그룹으로 묶기
            .key(function (d) { return d.bus; })
            .entries(data);

        // 업데이트
        y2.domain([0, d3.max(data, function (d) { return +d.passenger; })]);
        svg2.selectAll(".myYaxis2").transition().duration(1000).call(yAxis2);
        yGrid2.transition().duration(1000)
            .call(d3.axisLeft(y2).tickSize(-width2).tickFormat(""));

        var u = svg2.selectAll(".line").data(sumstat);

        u.enter()
            .append("path")
            .attr("class", "line")
            .merge(u)
            .on("mouseover", function (d) {
                svg2.append("text")
                    .attr("class", "line-text")
                    .text(d.key)
                    .attr("text-anchor", "middle")
                    .attr("x", (width2 + margin.left + margin.right) / 2)
                    .attr("y", 20);
                d3.selectAll('.line')
                    .style('opacity', 0.1);
                d3.select(this)
                    .style('opacity', 1)
                    .style("stroke-width", 4)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function () {
                svg2.select(".line-text").remove();
                d3.selectAll(".line")
                    .style('opacity', 1);
                d3.select(this)
                    .style("stroke-width", 2)
                    .style("cursor", "none");
            })
            .transition().duration(1000)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x2(d.time); })
                    .y(function (d) { return y2(+d.passenger); })
                    (d.values)
            })
            .attr("fill", "none")
            .attr("stroke", function (d) {
                // 신규 노선만 색상 강조
                if (d.key == newNum) { return "#3399FF"; }
                else return "#737373";
            })
            .attr("stroke-width", 2)
    })
}

/* 산점도 초기화 함수 */
function scatterPlotInit() {
    // 그래프 크기 조정
    margin = { top: 5, right: 10, bottom: 35, left: 55 };
    width3 = 400 - margin.left - margin.right;
    height3 = 340 - margin.top - margin.bottom;

    svg3 = d3.select("#scatterplot")
        .append("svg")
        .attr("width", width3 + margin.left + margin.right)
        .attr("height", height3 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X축 그리기
    x3 = d3.scaleLinear()
        .domain([46585 * 0.95, 934812 * 1.001])
        .range([0, width3]);
    svg3.append("g")
        .attr("transform", "translate(0," + height3 + ")")
        .call(d3.axisBottom(x3).tickSize(-height3 * 1.3).ticks(5))
        .select(".domain").remove();

    // Y축 그리기
    y3 = d3.scaleLinear()
        .domain([6 - 0.001, 22 * 1.01])
        .range([height3, 0]).nice();
    svg3.append("g")
        .call(d3.axisLeft(y3).tickSize(-width3 * 1.3).ticks(5))
        .select(".domain").remove();

    // 그래프 격자
    svg3.selectAll(".tick line").attr("stroke", "#CBCBCB");

    // X축 레이블
    svg3.append("text").attr("text-anchor", "end")
        .attr("x", width3).attr("y", height3 + margin.top + 25)
        .text("노선 총 승차 승객 수");

    // Y축 레이블
    svg3.append("text").attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20).attr("x", -margin.top)
        .text("배차 간격(분)");
}

/* 산점도 그리는 함수 */
function drawScatterPlot(newNum) {
    d3.csv("https://raw.githubusercontent.com/annyoon/InformationDesign/master/Dataset/bus_term.csv", function (data) {

        // 점 생성
        var u = svg3.append('g').selectAll("dot").data(data);

        u.enter()
            .append("circle")
            .attr("cx", function (d) { return x3(d.passenger); })
            .attr("cy", function (d) { return y3(d.term); })
            .attr("r", 3.5)
            .style("fill", function (d) {
                // 신규 노선만 색상 강조
                if (d.bus == newNum) { return "#3399FF"; }
                else return "#737373";
            });
    })
}