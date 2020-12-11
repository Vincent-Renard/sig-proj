// Définitions des sources

var source_osm = new ol.source.OSM();
var source_agregat_rdc = new ol.source.TileWMS({
    url: '../geoserver/batiment-sig/wms',
    params: { LAYERS: 'batiment-sig:batiment-sig-rdc', TILED: true, tilesOrigin: 1.93260718901831 + "," + 47.8469484265681 }
});
var source_agregat_etage = new ol.source.TileWMS({
    url: '../geoserver/batiment-sig/wms',
    params: { LAYERS: 'batiment-sig:batiment-sig-etage', TILED: true, tilesOrigin: 1.93260718901831 + "," + 47.8469484265681 }
});
var source_vector_draw_rdc = new ol.source.Vector({});
var source_vector_draw_etage = new ol.source.Vector({});

// Définitions des layers
var layer_osm = new ol.layer.Tile({
    name: 'open-street-map',
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
var layer_vector_draw_rdc = new ol.layer.Vector({
    source: source_vector_draw_rdc
})
var layer_vector_draw_etage = new ol.layer.Vector({
    source: source_vector_draw_etage
})

// Définition de la map
var map = new ol.Map({
    target: 'map',
    layers: [layer_osm, layer_agregat_rdc,
        layer_agregat_etage, layer_vector_draw_rdc,
        layer_vector_draw_etage
    ],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [0, 0],
        maxZoom: 20,
        maxResolution: 0.703125
    })
});

// initialisation projection visuel sur le batiment
var bounds = [1.93260718901831, 47.8469484265681,
    1.93423142774884, 47.8479779084475
];
map.getView().fit(bounds, map.getSize());

// Variable globale pour la gestion de l'affichage des étages
var etage_courant;

// Fonction de switch d'affichage entre les étages
function switchEtage() {
    if (etage_courant === 'rdc') {
        displayEtage();
    } else {
        displayRDC();
    }
}

function displayRDC() {
    map.getLayers().getArray()[1].setVisible(true);
    map.getLayers().getArray()[2].setVisible(false);
    map.getLayers().getArray()[3].setVisible(true);
    map.getLayers().getArray()[4].setVisible(false);

    etage_courant = 'rdc';
}

function displayEtage() {
    map.getLayers().getArray()[1].setVisible(false);
    map.getLayers().getArray()[2].setVisible(true);
    map.getLayers().getArray()[3].setVisible(false);
    map.getLayers().getArray()[4].setVisible(true);

    etage_courant = 'etage';
}


// Fonction qui sert lors de l'initialisation/chargement de page
function initialisation() {
    // No vector by default
    map.getLayers().getArray()[3].setVisible(false);
    map.getLayers().getArray()[4].setVisible(false);
    map.getLayers().getArray()[1].setVisible(false);
    map.getLayers().getArray()[2].setVisible(false);

    centrer(porteStartLocalisation);
}

// Definitions of features collections
var collection_features_salles_rdc;
var collection_features_salles_etage;
var collection_features_portes_rdc;
var collection_features_portes_etage;

// Population of features collections
var populate_salles_rdc = $.ajax({
    url: '../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:salles-rdc&outputFormat=application/json',
    type: 'GET',
    dataType: 'text',
    success: function(json, statut) {
        collection_features_salles_rdc = new ol.format.GeoJSON().readFeatures(json);
    },
    error: function(resultat, statut, erreur) {
        console.log("An error occured when fetching features : " + erreur + ", " + statut + ". " + resultat);
    }
});
var populate_salles_etage = $.ajax({
    url: '../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:salles-etage&outputFormat=application/json',
    type: 'GET',
    dataType: 'text',
    success: function(json, statut) {
        collection_features_salles_etage = new ol.format.GeoJSON().readFeatures(json);
    },
    error: function(resultat, statut, erreur) {
        console.log("An error occured when fetching features : " + erreur + ", " + statut + ". " + resultat);
    }
});
var populate_portes_rdc = $.ajax({
    url: '../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:portes-rdc&outputFormat=application/json',
    type: 'GET',
    dataType: 'text',
    success: function(json, statut) {
        collection_features_portes_rdc = new ol.format.GeoJSON().readFeatures(json);
    },
    error: function(resultat, statut, erreur) {
        console.log("An error occured when fetching features : " + erreur + ", " + statut + ". " + resultat);
    }
});
var populate_portes_etage = $.ajax({
    url: '../geoserver/batiment-sig/wfs?request=GetFeature&typename=batiment-sig:portes-etage&outputFormat=application/json',
    type: 'GET',
    dataType: 'text',
    success: function(json, statut) {
        collection_features_portes_etage = new ol.format.GeoJSON().readFeatures(json);
    },
    error: function(resultat, statut, erreur) {
        console.log("An error occured when fetching features : " + erreur + ", " + statut + ". " + resultat);
    }
});

function getMoyenne(x1, x2) {
    return (x1 + x2) / 2;
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

// Main function - callable by input
function Navigate() {
    source_vector_draw_rdc.clear();
    source_vector_draw_etage.clear();
    drawPinStart();

    //var porte_start = porteStartLocalisation;
    var porte_start = "6";
    var porte_end = document.getElementById("endNavigation").value;

    var collection_route = Route(porte_start, porte_end);
    collection_route.forEach(triple => { //start, end, layer
        Drawline(triple[0], triple[1], triple[2]);
    });
}

function distancePortes(feature_porte1, feature_porte2) {
    let porte1_x_local = getMoyenne(
        feature_porte1.getGeometry().getCoordinates()[0][0][0],
        feature_porte1.getGeometry().getCoordinates()[0][1][0]
    );
    let porte1_y_local = getMoyenne(
        feature_porte1.getGeometry().getCoordinates()[0][0][1],
        feature_porte1.getGeometry().getCoordinates()[0][1][1]
    );
    let porte2_x_local = getMoyenne(
        feature_porte2.getGeometry().getCoordinates()[0][0][0],
        feature_porte2.getGeometry().getCoordinates()[0][1][0]
    );
    let porte2_y_local = getMoyenne(
        feature_porte2.getGeometry().getCoordinates()[0][0][1],
        feature_porte2.getGeometry().getCoordinates()[0][1][1]
    );
    //Distance euclidienne
    return Math.sqrt(
        Math.pow(porte2_x_local - porte1_x_local, 2) +
        Math.pow(porte2_y_local - porte1_y_local, 2)
    );
}

// return a collection of triple for each etape of the route
// [[porte_1,porte_2,0],[porte_1,porte_2,1],...]
function Route(porte_start, porte_end) {
    var feature_porte_1;
    var feature_porte_2;

    var find1 = false;
    var find2 = false;
    while (!find1 || !find2) {
        collection_features_portes_rdc.forEach(function(element) {
            if (element.get('numero') === parseInt(porte_start)) {
                feature_porte_1 = element;
                find1 = true;
            }
            if (element.get('numero') === parseInt(porte_end)) {
                feature_porte_2 = element;
                find2 = true;
            }
        });
        collection_features_portes_etage.forEach(function(element) {
            if (element.get('numero') === parseInt(porte_start)) {
                feature_porte_1 = element;
                find1 = true;
            }
            if (element.get('numero') === parseInt(porte_end)) {
                feature_porte_2 = element;
                find2 = true;
            }
        });
    }

    // On parcours l'ensemble des possible porte à porte !
    // On stock dans une variable l'ensemble des routes possible
    // On ne passe pas deux fois par la même porte
    const chemins = [
        [
            [feature_porte_1], 0
        ]
    ];
    const bon_chemin = run(chemins, feature_porte_2);

    let res = [];
    for (let i = 0; i < bon_chemin.length - 1; i++) {
        const porte1 = bon_chemin[i];
        const porte2 = bon_chemin[i + 1];

        res.push([porte1, porte2, porte1.get("etage")]);
    }

    return res;
}

function run(init, porte_recherchee) {
    let chemins_precedents = init;
    let end = false;

    while (!end) {
        const nouveaux_chemins = Array.from(chemins_precedents);
        end = true;
        console.log(chemins_precedents);
        for (const [chemin, distance] of chemins_precedents) {
            const avant_derniere_porte = chemin[chemin.length - 2];
            const derniere_porte = chemin[chemin.length - 1];
            if (derniere_porte === porte_recherchee) {
                continue;
            }
            const salles = [derniere_porte.get("salle1"), derniere_porte.get("salle2")];
            for (const salle of salles) {
                if (avant_derniere_porte != null && [avant_derniere_porte.get("salle1"), avant_derniere_porte.get("salle2")].includes(salle)) {
                    continue;
                }
                for (const porte of find_portes(salle)) {
                    if (chemin.includes(porte)) {
                        continue;
                    }
                    nouveaux_chemins.pop(chemin);
                    nouveaux_chemins.push([chemin.concat([porte]), distance + distancePortes(derniere_porte, porte)]);
                    end = false;
                }
            }
        }
        chemins_precedents = nouveaux_chemins;
    }

    let maximum = 0;
    let res;
    for (const [chemin, distance] of chemins_precedents) {
        if (distance > maximum) {
            maximum = distance;
            res = chemin;
        }
    }
    return res;
}

function get_porte(num_porte) {
    return collection_features_portes_rdc
        .concat(collection_features_portes_etage)
        .find(features_porte => features_porte.get("numero") === num_porte);
}

function get_salle(num_salle) {
    return collection_features_salles_rdc
        .concat(collection_features_salles_etage)
        .find(features_salle => parseInt(features_salle.getId().split('.')[1]) === num_salle);
}

function find_portes(salle) {
    const num_salle = parseInt(salle);

    return collection_features_portes_rdc
        .concat(collection_features_portes_etage)
        .filter(features_porte => features_porte.get("salle1") === num_salle || features_porte.get("salle2") === num_salle);
}

var style_route = new ol.style.Style({
    fill: new ol.style.Fill({ color: '#00FF00', weight: 10 }),
    stroke: new ol.style.Stroke({ color: '#00FF00', width: 5 })
});

function Drawline(porte1, porte2, etage) {
    var porte1_x_local = getMoyenne(
        porte1.getGeometry().getCoordinates()[0][0][0],
        porte1.getGeometry().getCoordinates()[0][1][0]
    );
    var porte1_y_local = getMoyenne(
        porte1.getGeometry().getCoordinates()[0][0][1],
        porte1.getGeometry().getCoordinates()[0][1][1]
    );
    var porte2_x_local = getMoyenne(
        porte2.getGeometry().getCoordinates()[0][0][0],
        porte2.getGeometry().getCoordinates()[0][1][0]
    );
    var porte2_y_local = getMoyenne(
        porte2.getGeometry().getCoordinates()[0][0][1],
        porte2.getGeometry().getCoordinates()[0][1][1]
    );
    var points = [
        [porte1_x_local, porte1_y_local],
        [porte2_x_local, porte2_y_local]
    ];
    var featurething = new ol.Feature({
        geometry: new ol.geom.LineString(points)
    });
    featurething.setStyle(style_route);
    if (etage === 0) {
        source_vector_draw_rdc.addFeature(featurething);
    } else {
        source_vector_draw_etage.addFeature(featurething);
    }
}

function addPinOnMapLayered(x, y) {
    var featurething = new ol.Feature({
        geometry: new ol.geom.Point([x, y])
    });
    featurething.setStyle(style_pin);
    if (etage_courant == "rdc") {
        source_vector_draw_rdc.addFeature(featurething);
    } else {
        source_vector_draw_etage.addFeature(featurething);
    }
}

var x_local_start;
var y_local_start;

function addPinOnMapStart() {
    var start_feature = get_porte(porteStartLocalisation);
    var featurething = new ol.Feature({
        geometry: new ol.geom.Point([x_local_start, y_local_start])
    });
    featurething.setStyle(style_pin);
    if (start_feature.get("etage") == 0) {
        source_vector_draw_rdc.addFeature(featurething);
    } else {
        source_vector_draw_etage.addFeature(featurething);
    }
}

function drawPinStart() {
    //addPinOnMapStart();
}

function centrer(numero_porte) {
    var feature_porte = get_porte(numero_porte);
    x_local_start = getMoyenne(
        feature_porte.getGeometry().getCoordinates()[0][0][0],
        feature_porte.getGeometry().getCoordinates()[0][1][0]
    );
    y_local_start = getMoyenne(
        feature_porte.getGeometry().getCoordinates()[0][0][1],
        feature_porte.getGeometry().getCoordinates()[0][1][1]
    );
    map.getView().setCenter([x_local_start, y_local_start]);
    if (feature_porte.get('etage') === 0) {
        displayRDC();
    } else {
        displayEtage();
    }
    addPinOnMapLayered(x_local_start, y_local_start);
}

var porteStartLocalisation;

// population of the two select (start and end) and logique metier
$.when(populate_portes_rdc, populate_portes_etage, populate_salles_etage, populate_salles_rdc).done(function() {
    collection_features_portes_rdc.forEach(
        function(element) {
            var feature_tampon_salle1 = get_salle(parseInt(element.get("salle1")));
            var feature_tampon_salle2 = get_salle(parseInt(element.get("salle2")));
            document.getElementById("endNavigation").innerHTML += "<option value = '" +
                element.get("numero") + "'>" +
                "Porte au Rdc - num " + element.get("numero") + " - salles : " + feature_tampon_salle1.get("fonction") + "/" + feature_tampon_salle2.get("fonction")
            "</option>";
        }
    );
    collection_features_portes_etage.forEach(
        function(element) {
            var feature_tampon_salle1 = get_salle(parseInt(element.get("salle1")));
            var feature_tampon_salle2 = get_salle(parseInt(element.get("salle2")));
            document.getElementById("endNavigation").innerHTML += "<option value = '" +
                element.get("numero") + "'>" +
                "Porte à l'Etage - num " + element.get("numero") + " - salles : " + feature_tampon_salle1.get("fonction") + "/" + feature_tampon_salle2.get("fonction")
            "</option>";
        }
    );
    porteStartLocalisation = InterfaceAndroid.getPorte();
    initialisation();
});

function getSourceVisible() {
    if (etage_courant == "rdc") {
        return layer_agregat_rdc;
    } else {
        return layer_agregat_etage;
    }
}

var liste_categories = ['TD', 'TP', 'BUREAU', 'COULOIR', 'TOILETTES', 'LABO'];

var element_clicked_json;

map.on('singleclick', function(evt) {
    var view = map.getView();
    var viewResolution = view.getResolution();
    var source = getSourceVisible().getSource();
    var url = source.getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, view.getProjection(), { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
    if (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'text',
            success: function(json, statut) {
                var element_clicked = json
                element_clicked_json = JSON.parse(element_clicked)
                document.getElementById('identifiantClicked').innerHTML = element_clicked_json.features[0].id
                document.getElementById('etageClicked').innerHTML = element_clicked_json.features[0].properties.etage
                let select = document.getElementById('categorieClickedSelect')
                select.value = element_clicked_json.features[0].properties.categorie
                document.getElementById('fonctionClickedInput').value = element_clicked_json.features[0].properties.fonction
                document.getElementById('rowInit').hidden = true
                document.getElementById('rowLoading').hidden = true
                document.getElementById('rowData').hidden = false
            },
            error: function(resultat, statut, erreur) {
                console.log("An error occured when fetching features : " + erreur + ", " + statut + ". " + resultat);
            },
        });
    }
});

function editSalle() {
    let id_update = element_clicked_json.features[0].id.split('.')[1];
    let url_update = "ad-laptop:8081/sig/rooms/" + id_update + '/'
    let categorie_update = document.getElementById('categorieClickedSelect').value;
    let fonction_update = document.getElementById('fonctionClickedInput').value;
    let data_update = {
        "fonction": fonction_update,
        "categorie": categorie_update
    };
    let request_update = $.ajax({
        url: "http://" + url_update,
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify(data_update),
        processData: false,
        beforeSend: function() {
            document.getElementById('rowData').hidden = true
            document.getElementById('rowLoading').hidden = false
        },
        success: function(json, statut) {
            alert("La salle a été mise à jour !"); // alert not working with android web view !
            document.getElementById('rowData').hidden = true
            document.getElementById('rowUpdated').hidden = false
        },
        error: function(resultat, statut, erreur) {
            alert("Error when updating")
            console.log("An error occured when updating a feature : " + erreur + ", " + statut + ". " + resultat);
            document.getElementById('rowData').hidden = false
        },
        complete: function() {
            document.getElementById('rowLoading').hidden = true
        }
    });
}