package fr.orleans.univ.imis.sig.server.services;

import fr.orleans.univ.imis.sig.server.api.dtos.in.Room;
import fr.orleans.univ.imis.sig.server.entities.Salle;
import fr.orleans.univ.imis.sig.server.services.exceptions.NotSuchBatimentException;

/**
 * @autor Vincent
 * @date 23/11/2020
 */
public interface Facade {


    Salle addRoom(Room r ) throws NotSuchBatimentException;
}
