package fr.orleans.univ.imis.sig.server.persistance.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

/**
 * @autor Vincent
 * @date 13/11/2020
 */
@Entity
@Getter
@Setter
public class Batiment {
    @Id
    String nom;
    //coordonées géometriques = srid en 4326 (log/lat)

    @OneToMany(mappedBy = "batiment")
    List<Salle> salles = new ArrayList<>();


    int etages;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Batiment{");
        sb.append("nom='").append(nom).append('\'');
        sb.append(", salles=").append(salles);
        sb.append('}');
        return sb.toString();
    }
}
