document.addEventListener("DOMContentLoaded", function (event) {
    // construct a mapping by year
    var decades = {};
    for (let row of data) {
        let decade = Math.floor(row.Year / 10) * 10;
        if (!decades[decade]) {
            decades[decade] = { "winter": [], "spring": [], "summer": [], "fall": [] }

        }

        if (row.DJF !== "NA") {
            decades[decade].winter.push(row.DJF);
        }
        if (row.MAM !== "NA") {
            decades[decade].spring.push(row.MAM);
        }
        if (row.JJA !== "NA") {
            decades[decade].summer.push(row.JJA);
        }
        if (row.SON !== "NA") {
            decades[decade].fall.push(row.SON);
        }
    }

    function tabulate(el, data) {
        var col = [];
        for (var i = 0; i < data.length; i++) {
            for (var key in data[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.createCaption();
        table.innerHTML = el;

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.


        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                let val = data[i][col[j]]
                tabCell.innerHTML = typeof val === "number" ? val.toFixed(2) : val;
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById(el);
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }


    let avg = function (arr) {
        let sum = arr.reduce(function (a, b) { return a + b; });
        return (sum / arr.length);
    }


    var plottable = [{ color: "blue", key: "winter", values: [] },
    { color: "green", key: "spring", values: [] },
    { color: "red", key: "summer", values: [] },
    { color: "orange", key: "fall", values: [] }];

    for (let decade in decades) {
        plottable[0].values.push({ x: decade, y: avg(decades[decade].winter) });
        plottable[1].values.push({ x: decade, y: avg(decades[decade].spring) });
        plottable[2].values.push({ x: decade, y: avg(decades[decade].summer) });
        plottable[3].values.push({ x: decade, y: avg(decades[decade].fall) });
    }


    // If you don't want decade bundling use this
    // for (let datum of data) {
    //     if (datum.DJF !== "NA") {
    //         plottable[0].values.push({ x: datum.Year, y: datum.DJF })
    //     }
    //     if (datum.MAM !== "NA") {
    //         plottable[1].values.push({ x: datum.Year, y: datum.MAM });
    //     }
    //     if (datum.JJA !== "NA") {
    //         plottable[2].values.push({ x: datum.Year, y: datum.JJA });
    //     }
    //     if (datum.SON !== "NA") {
    //         plottable[3].values.push({ x: datum.Year, y: datum.SON });
    //     }

    // }

    nv.addGraph(function () {
        tabulate('winter', plottable[0].values);
        tabulate('spring', plottable[1].values);
        tabulate('summer', plottable[2].values);
        tabulate('fall', plottable[3].values);
        chart = nv.models.lineChart()
            .options({
                duration: 300,
                useInteractiveGuideline: true
            })
            ;
        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis
            .axisLabel("Year")
            .staggerLabels(true)
            ;
        chart.yAxis
            .axisLabel('Temperature Deviation')
            .tickFormat(function (d) {
                if (d == null) {
                    return 'N/A';
                }
                return d3.format(',.2f')(d);
            })
            ;

        d3.select('#chart1').append('svg')
            .datum(plottable)
            .call(chart);
        nv.utils.windowResize(chart.update);

        return chart;
    });

});
