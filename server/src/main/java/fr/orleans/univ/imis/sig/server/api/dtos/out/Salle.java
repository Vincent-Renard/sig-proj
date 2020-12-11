package fr.orleans.univ.imis.sig.server.api.dtos.out;

import fr.orleans.univ.imis.sig.server.persistance.entities.Categorie;
import lombok.AccessLevel;
import lombok.Data;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

/**
 * @autor Vincent
 * @date 11/12/2020
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@ToString
public class Salle {
    final int id;
    final int etage;
    final String fonction;
    final Categorie categorie;
}
