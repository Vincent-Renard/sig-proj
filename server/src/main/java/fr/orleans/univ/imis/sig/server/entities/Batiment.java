package fr.orleans.univ.imis.sig.server.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * @autor Vincent
 * @date 13/11/2020
 */
@Entity
public class Batiment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String nom;
    //coordonées géometriques = srid en 4326 (log/lat)

}
