
function change_area(id, area, year) {
    console.log(year);

	var units = 'clp';
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

    load_data(f, units, id, year);
}

change_area('#map', 'uk', $('input[type=radio][name=year]:checked').val());

$(document).ready(function() {
	$("#area").on('change', function() {
		change_area('#map', $('#area').val());
	});

    $('input[type=radio][name=year]').change(function() {
        change_area('#map', $('#area').val(), this.value);
    });
});
