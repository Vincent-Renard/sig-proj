package fr.orleans.univ.imis.sig.server.services;

import fr.orleans.univ.imis.sig.server.api.dtos.in.UserModifiedRoom;
import fr.orleans.univ.imis.sig.server.api.dtos.out.Salle;
import fr.orleans.univ.imis.sig.server.persistance.entities.Categorie;
import fr.orleans.univ.imis.sig.server.services.exceptions.NotSuchRoomException;

import java.util.List;

/**
 * @autor Vincent
 * @date 23/11/2020
 */
public interface Facade {

    Salle updateRoom(int id, UserModifiedRoom userModifyRoom) throws NotSuchRoomException;

    List<Salle> getAllSalles(Categorie ts);

}
