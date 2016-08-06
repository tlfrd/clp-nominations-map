
function change_area(id) {
    var units = 'clp';

    // var top_level_select = document.getElementById('top_level');
    // var area = top_level_select.options[top_level_select.selectedIndex].value;

    // var f;
    // var f = 'json/' + area + '/topo_' + units + '.json';

    var f = 'json/combined/clp_uk.json';

    load_data(f, units, id);
}

change_area('#map');

