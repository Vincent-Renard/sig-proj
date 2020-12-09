package fr.orleans.univ.imis.sig.server.persistance.entities;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import javax.persistence.*;
import java.util.Objects;

/**
 * @autor Vincent
 * @date 17/11/2020
 */

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@NoArgsConstructor
@Entity
public class Porte {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    Long idPorte;// on ne mettra pas id = (salleIn.id + salleOut.id) car pour la porte principale (salleIn = Null)

    int numero;


    @Setter
    @ManyToOne
    Salle salle1;
    @Setter
    @ManyToOne
    Salle salle2;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Porte)) return false;
        Porte porte = (Porte) o;
        return Objects.equals(getIdPorte(), porte.getIdPorte()) &&
                Objects.equals(getSalle1(), porte.getSalle1()) &&
                Objects.equals(getSalle2(), porte.getSalle2());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getIdPorte(), getSalle1(), getSalle2());
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Porte{");
        sb.append("idPorte=").append(idPorte);
        sb.append(", salleIn=").append(salle1.getNumero());
        sb.append(", salleOut=").append(salle2.getNumero());
        sb.append('}');
        return sb.toString();
    }
}
