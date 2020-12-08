// Définitions des sources
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
var source_vector_draw = new ol.source.Vector({});

// Définitions des layers
var layer_osm = new ol.layer.Tile({
  name:'open-street-map',
  source: source_osm
});
var layer_agregat_rdc = new ol.layer.Tile({
  name: 'agregat-rdc',
  source: source_agregat_rdc
});
var layer_agregat_etage = new ol.layer.Tile({
  name: 'agregat-etage',
  source: source_agregat_etage
});
var layer_vector_salles_rdc = new ol.layer.Vector({
  name: 'vector-salles-rdc',
  source: source_salles_rdc
});
var layer_vector_salles_etage = new ol.layer.Vector({
  name: 'vector-salles-etage',
  source: source_salles_etage
});
var layer_vector_draw = new ol.layer.Vector({
  source: source_vector_draw
})

// Définition de la map
var map = new ol.Map({
  target: 'map',
  layers: [layer_osm,layer_agregat_rdc,
    layer_agregat_etage,layer_vector_salles_rdc,
    layer_vector_salles_etage,layer_vector_draw,],
  view: new ol.View({
    projection: 'EPSG:4326',
    center: [0, 0],
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
    //map.getLayers().getArray()[3].setVisible(false);
    //map.getLayers().getArray()[4].setVisible(true);

    etage_courant = 'etage';
  } else {
    map.getLayers().getArray()[1].setVisible(true);
    map.getLayers().getArray()[2].setVisible(false);
    //map.getLayers().getArray()[3].setVisible(true);
    //map.getLayers().getArray()[4].setVisible(false);

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

// Definitions of features collections
var collection_features_salles_rdc;
var collection_features_salles_etage;
var collection_features_portes_rdc;
var collection_features_portes_etage;

// Population of features collections
$.ajax({
  url : '../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:salles-rdc&outputFormat=application/json',
  type : 'GET',
  dataType : 'text',
  success : function(json, statut){
    collection_features_salles_rdc = new ol.format.GeoJSON().readFeatures(json);
  },
  error : function(resultat, statut, erreur){
    console.log("An error occured when fetching features : " + erreur + ", "+statut +". "+resultat);
  }
});
$.ajax({
  url : '../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:salles-etage&outputFormat=application/json',
  type : 'GET',
  dataType : 'text',
  success : function(json, statut){
    collection_features_salles_etage = new ol.format.GeoJSON().readFeatures(json);
  },
  error : function(resultat, statut, erreur){
    console.log("An error occured when fetching features : " + erreur + ", "+statut +". "+resultat);
  }
});
$.ajax({
  url : '../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:portes-rdc&outputFormat=application/json',
  type : 'GET',
  dataType : 'text',
  success : function(json, statut){
    collection_features_portes_rdc = new ol.format.GeoJSON().readFeatures(json);
  },
  error : function(resultat, statut, erreur){
    console.log("An error occured when fetching features : " + erreur + ", "+statut +". "+resultat);
  }
});
$.ajax({
  url : '../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:portes-etage&outputFormat=application/json',
  type : 'GET',
  dataType : 'text',
  success : function(json, statut){
    collection_features_portes_etage = new ol.format.GeoJSON().readFeatures(json);
  },
  error : function(resultat, statut, erreur){
    console.log("An error occured when fetching features : " + erreur + ", "+statut +". "+resultat);
  }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function AddPinRandom(){
  var index = getRandomInt(11);
  var x_local = getMoyenne(collection_features_portes_rdc[index].getGeometry().getCoordinates()[0][0][0],collection_features_portes_rdc[index].getGeometry().getCoordinates()[0][1][0]);
  var y_local = getMoyenne(collection_features_portes_rdc[index].getGeometry().getCoordinates()[0][0][1],collection_features_portes_rdc[index].getGeometry().getCoordinates()[0][1][1]);
  addPinOnMap(x_local,y_local);
}

function getMoyenne(x1,x2){
  return (x1+x2)/2;
}

function RemoveAll(){
  source_vector_draw.clear();
}

var style_pin = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    stroke: new ol.style.Stroke({
      color: 'white',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'red'
    })
  })
});

function addPinOnMap(x,y){
  var featurething = new ol.Feature({
    name: "Point",
    geometry: new ol.geom.Point([x,y])
  });
  featurething.setStyle(style_pin);
  source_vector_draw.addFeature(featurething);
}

// Tests
(function() {
  initialisation('etage');
})();
