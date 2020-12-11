package fr.orleans.univ.imis.sig.server.api.dtos.in;

import fr.orleans.univ.imis.sig.server.persistance.entities.Categorie;
import lombok.AccessLevel;
import lombok.Data;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

/**
 * @autor Vincent
 * @date 08/12/2020
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@ToString
public class UserModifiedRoom {
    Categorie categorie;
    String fonction;

}