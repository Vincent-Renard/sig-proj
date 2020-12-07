package fr.orleans.univ.imis.sig.server.persistance.entities;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * @autor Vincent
 * @date 13/11/2020
 */

@Entity
public class Salle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long numero;

    @ManyToOne
    Batiment batiment;


    String nom;

    @Enumerated(value = EnumType.STRING)
    TypeSalle type;

    int etage;

    @OneToMany
    Set<Porte> portes = new HashSet<>();

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Salle{");
        sb.append("numero=").append(numero);
        sb.append(", nom='").append(nom).append('\'');
        sb.append(", type=").append(type);
        sb.append(", etage=").append(etage);
        sb.append(", portes= [");
        for (var p : portes)
            sb.append(p.getIdPorte());
        sb.append('}');
        return sb.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Salle)) return false;
        Salle salle = (Salle) o;
        return Objects.equals(numero, salle.numero);
    }

    @Override
    public int hashCode() {
        return Objects.hash(numero);
    }
}
