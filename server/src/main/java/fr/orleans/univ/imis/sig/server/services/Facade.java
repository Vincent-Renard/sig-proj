package fr.orleans.univ.imis.sig.server.services;

import fr.orleans.univ.imis.sig.server.api.dtos.in.UserDefinitedHouse;
import fr.orleans.univ.imis.sig.server.api.dtos.in.UserDefinitedRoom;
import fr.orleans.univ.imis.sig.server.api.dtos.in.UserModifiedRoom;
import fr.orleans.univ.imis.sig.server.persistance.entities.Batiment;
import fr.orleans.univ.imis.sig.server.persistance.entities.Salle;
import fr.orleans.univ.imis.sig.server.persistance.entities.TypeSalle;
import fr.orleans.univ.imis.sig.server.services.exceptions.*;

import java.util.List;

/**
 * @autor Vincent
 * @date 23/11/2020
 */
public interface Facade {

    Batiment addBatiment(UserDefinitedHouse udh) throws SuchBatimentNameExistsException;

    Salle addRoom(UserDefinitedRoom udr) throws NotSuchBatimentException, NotSuchConnectedRoomException, FloorOverFlowException;

    Salle updateRoom(long id, UserModifiedRoom userModifyRoom) throws NotSuchRoomException;

    List<Salle> getSallesOfBat(String nomBat, TypeSalle ts) throws NotSuchBatimentException;

    Batiment getBatiment(String nomBat) throws NotSuchBatimentException;
}
