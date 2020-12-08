package fr.orleans.univ.imis.sig.server.services;

import fr.orleans.univ.imis.sig.server.api.dtos.in.UserDefinitedHouse;
import fr.orleans.univ.imis.sig.server.api.dtos.in.UserDefinitedRoom;
import fr.orleans.univ.imis.sig.server.api.dtos.in.UserModifiedRoom;
import fr.orleans.univ.imis.sig.server.persistance.entities.Batiment;
import fr.orleans.univ.imis.sig.server.persistance.entities.Porte;
import fr.orleans.univ.imis.sig.server.persistance.entities.Salle;
import fr.orleans.univ.imis.sig.server.persistance.entities.TypeSalle;
import fr.orleans.univ.imis.sig.server.persistance.repos.BatimentRepository;
import fr.orleans.univ.imis.sig.server.persistance.repos.SalleRepository;
import fr.orleans.univ.imis.sig.server.services.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @autor Vincent
 * @date 08/12/2020
 */
@Service
public class FacadeImpl implements Facade {

    @Autowired
    private BatimentRepository bats;

    @Autowired
    private SalleRepository salles;


    @Transactional
    @Override
    public Salle addRoom(UserDefinitedRoom userDefinitedRoom) throws NotSuchBatimentException, NotSuchConnectedRoomException, FloorOverFlowException {


        if (userDefinitedRoom.getConnectedRooms().stream().anyMatch(id -> !salles.existsById(id)))
            throw new NotSuchConnectedRoomException();


        var optbatiment = bats.findById(userDefinitedRoom.getNameBatiment());
        if (optbatiment.isEmpty()) {
            throw new NotSuchBatimentException();
        }

        Batiment batiment = optbatiment.get();

        Salle s = new Salle();
        if (userDefinitedRoom.getFloor() > batiment.getEtages())
            throw new FloorOverFlowException();

        s.setEtage(userDefinitedRoom.getFloor());

        s.setNom(userDefinitedRoom.getName());
        s.setType(userDefinitedRoom.getType());


        s.setBatiment(batiment);

        List<Porte> portes = new ArrayList<>(userDefinitedRoom.getConnectedRooms().size());
        for (long idr : userDefinitedRoom.getConnectedRooms()) {
            Porte p = new Porte();

            Salle r = salles.getOne(idr);

            p.setSalleIn(r);
            p.setSalleOut(s);

            s.getPortes().add(p);
            r.getPortes().add(p);

        }


        s = salles.save(s);
        return s;

    }

    @Override
    public Salle updateRoom(long idRoom, UserModifiedRoom userModifyRoom) throws NotSuchRoomException {

        var optRoom = salles.findById(idRoom);
        Salle s = optRoom.orElseThrow(NotSuchRoomException::new);

        if (userModifyRoom.getType() != null)
            s.setType(userModifyRoom.getType());

        if (userModifyRoom.getName() != null)
            s.setNom(userModifyRoom.getName());


        s = salles.save(s);
        return s;

    }


    @Override
    public Batiment addBatiment(UserDefinitedHouse udh) throws SuchBatimentNameExistsException {

        if (bats.existsById(udh.getName())) {
            throw new SuchBatimentNameExistsException();
        }
        Batiment b = new Batiment();
        b.setEtages(udh.getFloors());
        b.setNom(udh.getName());
        //todo addRooms ?

        b = bats.save(b);

        return b;
    }

    @Override
    public List<Salle> getSallesOfBat(String nomBat, TypeSalle ts) throws NotSuchBatimentException {

        var optBat = bats.findById(nomBat);

        Batiment b = optBat.orElseThrow(NotSuchBatimentException::new);
        List<Salle> s = b.getSalles();
        if (ts != null) {
            s = s.stream().filter(r -> r.getType().equals(ts)).collect(Collectors.toList());
        }

        return s;
    }
}
