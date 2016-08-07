
function change_area(id, area) {
	console.log(area);
	var units = 'clp';

    // var f;
    // var f = 'json/' + area + '/topo_' + units + '.json';

    var f;

    if (area === 'uk') {
    	f = 'json/combined/clp_uk.json';
    } else if (area === 'sco') {
    	f = 'json/topo_sco.json';
    } else if (area === 'wal') {
    	f = 'json/topo_wales.json';
    } else if (area === 'eng') {
    	f = 'json/topo_eng.json';
    } else if (area === 'lon') {
    	f = 'json/topo_lon.json';
    }

    load_data(f, units, id);
}

change_area('#map', 'uk');

$(document).ready(function() {
	$("#area").on('change', function() {
		change_area('#map', $('#area').val());
	});
});
