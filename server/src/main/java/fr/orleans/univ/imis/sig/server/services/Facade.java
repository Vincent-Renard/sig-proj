package fr.orleans.univ.imis.sig.server.services;

import fr.orleans.univ.imis.sig.server.api.dtos.in.Room;
import fr.orleans.univ.imis.sig.server.persistance.entities.Salle;
import fr.orleans.univ.imis.sig.server.services.exceptions.NotSuchBatimentException;
import fr.orleans.univ.imis.sig.server.services.exceptions.NotSuchRoomException;

/**
 * @autor Vincent
 * @date 23/11/2020
 */
public interface Facade {


    Salle addRoom(Room r) throws NotSuchBatimentException;

    Salle updateRoom(long idRoom, Room r) throws NotSuchRoomException;

}
