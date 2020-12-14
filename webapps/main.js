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

    var porte_start = porteStartLocalisation;
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

/**
 * @param {number} porte_start Numéro de la porte de départ
 * @param {number} porte_end Numéro de la porte d'arrivée
 *
 * @returns {[Object, Object, number][]} Une liste de triplets décrivant le chemin : [[porte_1, porte_2, etage], [porte_2, porte_3, etage], ...]
 */
function Route(porte_start, porte_end) {
    // On récupère les objets porte depuis leur numéro
    const feature_porte_start = get_porte(parseInt(porte_start));
    const feature_porte_end = get_porte(parseInt(porte_end));

    // On initialise les chemins avec 2 chemins : chacun partant d'un côté de la porte de départ
    // Ils commencent avec une distance de 0
    let chemins = [
        [[[feature_porte_start.get("salle1"), feature_porte_start]], 0],
        [[[feature_porte_start.get("salle2"), feature_porte_start]], 0],
    ];
    // Tant qu'un chemin s'agrandit, on boucle
    let updated = true;
    while (updated) {
        updated = false;
        // Pour chaque chemin, on crée une liste de nouveaux chemins possibles (d'où le "flatMap" pour éviter les listes de listes)
        chemins = chemins.flatMap(([chemin, distance]) => {
            const [derniere_salle, derniere_porte] = chemin[chemin.length - 1];
            // Si le chemin arrive déjà à la porte souhaitée, on l'ignore mais on le garde (il ne s'agrandit juste pas)
            if (derniere_porte === feature_porte_end) {
                return [[chemin, distance]];
            }
            // On trouve quelle est la prochaine salle à visiter parmi les deux côtés de la porte (c'est du coup celle qui n'est pas la dernière visitée)
            const next_salle = [derniere_porte.get("salle1"), derniere_porte.get("salle2")].find(salle => salle !== derniere_salle);
            // On récupère toutes les portes de la salle à visiter et on filtre les portes déjà traversées
            // Si au moins une porte est récupérée, updated est mis à true car une nouvelle itération sera nécessaire
            // Pour toutes les portes récupérées, on crée un chemin identique à l'actuel auquel :
            // - on ajoute la nouvelle salle et la nouvelle porte traversées
            // - on augmente la distance en ajoutant celle entres les deux dernières portes traversées
            return find_portes(next_salle)
                .filter(next_porte => chemin.every(([, porte]) => porte !== next_porte))
                .map(next_porte => {
                    updated = true;
                    return [chemin.concat([[next_salle, next_porte]]), distance + distancePortes(derniere_porte, next_porte)];
                });
        });
    }

    // On récupère le chemin ayant la plus courte distance
    const [plus_court_chemin, ] = chemins.reduce(
        ([chemin_min, distance_min], [chemin, distance]) => {
            return distance < distance_min
                ? [chemin, distance]
                : [chemin_min, distance_min];
        },
        [null, Infinity],
    );

    // On tranforme le format de notre chemin
    // de [[salle_1, porte_1], [salle_2, porte_2], [salle_3, porte_3], ...]
    // à [[porte_1, porte_2, etage], [porte_2, porte_3, etage], ...]
    const res = [];
    for (let i = 0; i < plus_court_chemin.length - 1; i++) {
        const [, porte1] = plus_court_chemin[i];
        const [, porte2] = plus_court_chemin[i + 1];
        res.push([porte1, porte2, porte1.get("etage")]);
    }
    return res;
}

/**
 * @param {number} num_porte Numéro de la porte
 *
 * @returns {Object} L'objet porte depuis son numéro
 */
function get_porte(num_porte) {
    return collection_features_portes_rdc
        .concat(collection_features_portes_etage)
        .find(features_porte => features_porte.get("numero") === num_porte);
}

/**
 * @param {number} num_salle Numéro de la salle
 *
 * @returns {Object} L'objet salle depuis son numéro
 */
function get_salle(num_salle) {
    return collection_features_salles_rdc
        .concat(collection_features_salles_etage)
        .find(features_salle => parseInt(features_salle.getId().split('.')[1]) === num_salle);
}

/**
 * @param {number} salle Numéro de la salle
 *
 * @returns {Object[]} La liste des objets porte d'une salle depuis son numéro
 */
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
    addPinOnMapStart();
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
