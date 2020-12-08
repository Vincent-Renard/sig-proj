package fr.orleans.univ.imis.sig.server.api.dtos.in;

import fr.orleans.univ.imis.sig.server.persistance.entities.TypeSalle;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Collection;

/**
 * @autor Vincent
 * @date 23/11/2020
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class UserDefinitedRoom {

    String nameBatiment;
    int floor;
    TypeSalle type;
    String name;
    Collection<Long> connectedRooms;

}
