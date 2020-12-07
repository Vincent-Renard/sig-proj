package fr.orleans.univ.imis.sig.server.api.dtos.in;

import fr.orleans.univ.imis.sig.server.persistance.entities.TypeSalle;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * @autor Vincent
 * @date 23/11/2020
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class Room {

    long idBatiment;
    TypeSalle type;
    String nom;

}
