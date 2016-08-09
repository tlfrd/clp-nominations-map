// get the width of the area we're displaying in
var width;
// but we're using the full window height
var height;

var nominations;

var leadership_election_year;

// variables for map drawing
var projection, svg, path, g;
var boundaries, units;

function compute_size() {
    var margin = 50;
    width = parseInt(d3.select("#map").style("width"));
    height = window.innerHeight - 2*margin;
}

compute_size();
// initialise the map
init(width, height);


// remove any data when we lose selection of a map unit
function deselect(id) {
    d3.selectAll(".selected")
        .attr("class", "area");

    $(".constituency")
        .html("");
    $(".2015__nomination")
        .html("");
    $(".2015__title")
        .hide();
    $(".2016__nomination")
        .html("");
    $(".2016__title")
        .hide();

    if (id) {
        var new_id = "#" + id;
        set_colour_for_area(new_id, nominations[id]["nomination_" + leadership_election_year]);
    }
}


function init(width, height, id) {

    // pretty boring projection
    projection = d3.geo.albers()
        .rotate([0, 0]);

    path = d3.geo.path()
        .projection(projection);

    // create the svg element for drawing onto
    svg = d3.select(id).append("svg")
        .attr("width", width)
        .attr("height", height);

    // graphics go here
    g = svg.append("g");

    // add a white rectangle as background to enable us to deselect a map selection
    g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#fff")
        .on('click', deselect);
}

// create a HTML table to display any properties about the selected item
function create_table(properties) {
    var keys = Object.keys(properties);

    table_string = "<table>";
    table_string += "<th>Property</th><th>Value</th>";
    for (var i = 0; i < keys.length; i++) {
        table_string += "<tr><td>" + keys[i] + "</td><td>" + properties[keys[i]] + "</td></tr>";
    }
    table_string += "</table>";
    return table_string;
}

// select a map area
function select(d) {
    // get the id of the selected map area
    var id = "#" + d.id;
    // remove the selected class from any other selected areas
    d3.selectAll(".selected")
        .attr("class", "area");
    // and add it to this area
    d3.select(id)
        .attr("class", "selected area")
    // add the area properties to the data_table section
    $(".constituency")
        .html(nominations[d.id]["constituency"]);
    if (nominations[d.id]["nomination_2016"] != "") {     
        $(".2016__title")
            .show();
        $(".2016__nomination")
            .html(nominations[d.id]["nomination_2016"]);
    }
    if (nominations[d.id]["nomination_2015"] != "") {     
        $(".2015__title")
            .show();
        $(".2015__nomination")
            .html(nominations[d.id]["nomination_2015"]);
    }
}

// draw our map on the SVG element
function draw(boundaries) {

    projection
        .scale(1)
        .translate([0,0]);

    // compute the correct bounds and scaling from the topoJSON
    var b = path.bounds(topojson.feature(boundaries, boundaries.objects[units]));
    var s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    
    projection
        .scale(s)
        .translate(t);

    // add an area for each feature in the topoJSON
    g.selectAll(".area")
        .data(topojson.feature(boundaries, boundaries.objects[units]).features)
        .enter().append("path")
        .attr("class", "area")
        .attr("id", function(d) {return d.id})
        .attr("properties_table", function(d) {return create_table(d.properties)})
        .attr("d", path)
        .on("mouseover", function(d) {return select(d)})
        .on("mouseout", function(d) {return deselect(d.id)});

    // add a boundary between areas
    g.append("path")
        .datum(topojson.mesh(boundaries, boundaries.objects[units], function(a, b){ return a !== b }))
        .attr('d', path)
        .attr('class', 'boundary');

    colour_map();
}

// called to redraw the map - removes map completely and starts from scratch
function redraw(id) {
    compute_size();
    //width = parseInt(d3.select("#map").style("width"));
    //height = window.innerHeight - margin;

    d3.select("svg").remove();

    init(width, height, id);
    draw(boundaries);
}

function colour_map() {
    var f = "json/nominations/clp_nominations.json";

    d3.json(f, function(error, n) {
        if (error) return console.error(error);
        nominations = n;

        for (x in nominations) {
            var id = "#" + x;

            var nomination;
            if (leadership_election_year === "2015") {
                nomination = nominations[x]["nomination_2015"];
            } else if (leadership_election_year === "2016") {
                nomination = nominations[x]["nomination_2016"];
            }

            set_colour_for_area(id, nomination);
        }
    });
}

function set_colour_for_area(id, nomination) {
    if (nomination === "Jeremy Corbyn") {
        d3.select(id).attr("class", "jeremy");
    } else if (nomination === "Andy Burnham") {
        d3.select(id).attr("class", "andy");
    } else if (nomination === "Liz Kendall") {
        d3.select(id).attr("class", "liz");
    } else if (nomination === "Yvette Cooper") {
        d3.select(id).attr("class", "yvette");
    } else if (nomination === "Owen Smith") {
        d3.select(id).attr("class", "owen");
    }
}

// loads data from the given file and redraws the map
function load_data(filename, u, id, year) {
    // clear any selection
    deselect();

    units = u;
    leadership_election_year = year;
    var f = filename;

    d3.json(f, function(error, b) {
        if (error) return console.error(error);
        boundaries = b;
        redraw(id, year);
    });    
}

// when the window is resized, redraw the map
window.addEventListener('resize', redraw('#map'));


