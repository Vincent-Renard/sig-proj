var source_osm = new ol.source.OSM();
var source_agregat_rdc = new ol.source.TileWMS({
  url: '../geoserver/batiment-sig/wms',
  params: {LAYERS: 'batiment-sig:batiment-sig-rdc', TILED: true, tilesOrigin: 1.93260718901831 + "," + 47.8469484265681}
});
var source_agregat_etage = new ol.source.TileWMS({
  url: '../geoserver/batiment-sig/wms',
  params: {LAYERS: 'batiment-sig:batiment-sig-etage', TILED: true, tilesOrigin: 1.93260718901831 + "," + 47.8469484265681}
});
var source_salles_rdc = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: function () {
    return "../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:salles-rdc&outputFormat=application/json";
  }
});
var source_salles_etage = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: function () {
    return "../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:salles-etage&outputFormat=application/json";
  }
});

var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      name:'open Street Map',
      source: source_osm
    }),
    new ol.layer.Tile({
      name: 'agregat-rdc',
      source: source_agregat_rdc
    }),
    new ol.layer.Tile({
      name: 'agregat-etage',
      source: source_agregat_etage
    }),
    new ol.layer.Vector({
      name: 'vector-salles-rdc',
      source: source_salles_rdc
    }),
      new ol.layer.Vector({
        name: 'vector-salles-etage',
        source: source_salles_etage
    }),
  ],
  view: new ol.View({
    projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 0,
    maxZoom:20,
    maxResolution: 0.703125
  })
});

// initialisation projection visuel sur le batiment
var bounds = [1.93260718901831, 47.8469484265681,
    1.93423142774884, 47.8479779084475];
map.getView().fit(bounds, map.getSize());

// Variable globale pour la gestion de l'affichage des étages
var etage_courant;

// Fonction de switch d'affichage entre les étages
function switchEtage(){
  if(etage_courant === 'rdc'){
    map.getLayers().getArray()[1].setVisible(false);
    map.getLayers().getArray()[2].setVisible(true);

    etage_courant = 'etage';
  } else {
    map.getLayers().getArray()[1].setVisible(true);
    map.getLayers().getArray()[2].setVisible(false);

    etage_courant = 'rdc';
  }
}

// Fonction qui sert lors de l'initialisation/chargement de page
function initialisation(etage){
  // No vector by default
  map.getLayers().getArray()[3].setVisible(false);
  map.getLayers().getArray()[4].setVisible(false);
  //Gestion etage
  etage_courant = etage;
  switchEtage();
}

// Tests
(function() {
  initialisation('etage');

  map.getLayers().getArray()[3].setVisible(true);

  var featurething = new ol.Feature({
      name: "Thing",
      geometry: new ol.geom.Point([2,20])
  });
  source_salles_rdc.addFeature( featurething );
})();

  /*
  map.getView().fit(bounds, map.getSize());

  console.log(map.getLayers().getArray()[1]);



  function updateFilter(){
    if (!supportsFiltering) {
      return;
    }
    var filterType = document.getElementById('filterType').value;
    var filter = document.getElementById('filter').value;
    // by default, reset all filters
    var filterParams = {
      'FILTER': null,
      'CQL_FILTER': null,
      'FEATUREID': null
    };
    if (filter.replace(/^\s\s, '').replace(/\s\s*$/, '') != "") {
      if (filterType == "cql") {
        filterParams["CQL_FILTER"] = filter;
      }
      if (filterType == "ogc") {
        filterParams["FILTER"] = filter;
      }
      if (filterType == "fid")
        filterParams["FEATUREID"] = filter;
      }
      // merge the new filter definitions
      map.getLayers().forEach(function(lyr) {
        lyr.getSource().updateParams(filterParams);
      });
    }

  map.getLayers().getArray()
  .filter(layer => layer.get('name') === 'agregat')
  .filter(layer => layer.get('name') === 'salle')
  .filter(layer => layer.get('etage') === 1)
  .forEach(layer => map.removeLayer(layer));
*/
