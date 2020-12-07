package fr.orleans.univ.imis.sig.server.persistance.entities;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

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

    @OneToMany(mappedBy = "batiment")
    Set<Salle> salles = new HashSet<>();


    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Batiment{");
        sb.append("nom='").append(nom).append('\'');
        sb.append(", salles=").append(salles);
        sb.append('}');
        return sb.toString();
    }
}
