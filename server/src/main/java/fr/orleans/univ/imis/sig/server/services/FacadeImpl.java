package fr.orleans.univ.imis.sig.server.services;

import fr.orleans.univ.imis.sig.server.api.dtos.in.UserModifiedRoom;
import fr.orleans.univ.imis.sig.server.api.dtos.out.Salle;
import fr.orleans.univ.imis.sig.server.persistance.entities.Categorie;
import fr.orleans.univ.imis.sig.server.persistance.repos.SalleRepository;
import fr.orleans.univ.imis.sig.server.services.exceptions.NotSuchRoomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @autor Vincent
 * @date 08/12/2020
 */
@Service
public class FacadeImpl implements Facade {

    @Autowired
    private SalleRepository salles;



    @Override
    public Salle updateRoom(long idRoom, UserModifiedRoom userModifyRoom) throws NotSuchRoomException {

        var optRoom = salles.findById(idRoom);
        Salle s = optRoom.orElseThrow(NotSuchRoomException::new);

        if (userModifyRoom.getType() != null)
            s.setType(userModifyRoom.getType());

        if (userModifyRoom.getFonction() != null)
            s.setFonction(userModifyRoom.getFonction());


        s = salles.save(s);
        return s;

    }


    @Override
    public List<Salle> getAllSalles(Categorie ts) {


        List<Salle> s = salles.findAll();
        if (ts != null) {
            s = s.stream().filter(r -> r.getType().equals(ts)).collect(Collectors.toList());
        }

        return s;
    }

}
