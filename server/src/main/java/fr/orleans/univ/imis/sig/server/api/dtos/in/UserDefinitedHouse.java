package fr.orleans.univ.imis.sig.server.api.dtos.in;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * @autor Vincent
 * @date 08/12/2020
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class UserDefinitedHouse {

    String name;
    int floors;
}
