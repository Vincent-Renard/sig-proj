package fr.orleans.univ.imis.sig.server.api.dtos.in;

import fr.orleans.univ.imis.sig.server.persistance.entities.TypeSalle;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * @autor Vincent
 * @date 08/12/2020
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class UserModifiedRoom {
    TypeSalle type;
    String name;

}