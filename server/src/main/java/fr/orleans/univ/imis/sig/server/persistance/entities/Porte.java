package fr.orleans.univ.imis.sig.server.persistance.entities;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

    @ManyToOne
    Salle salleIn;
    @ManyToOne
    Salle salleOut;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Porte)) return false;
        Porte porte = (Porte) o;
        return Objects.equals(getIdPorte(), porte.getIdPorte()) &&
                Objects.equals(getSalleIn(), porte.getSalleIn()) &&
                Objects.equals(getSalleOut(), porte.getSalleOut());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getIdPorte(), getSalleIn(), getSalleOut());
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Porte{");
        sb.append("idPorte=").append(idPorte);
        sb.append(", salleIn=").append(salleIn);
        sb.append(", salleOut=").append(salleOut);
        sb.append('}');
        return sb.toString();
    }
}
