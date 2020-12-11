package fr.orleans.univ.imis.sig.server.services;

import fr.orleans.univ.imis.sig.server.api.dtos.in.UserModifiedRoom;
import fr.orleans.univ.imis.sig.server.api.dtos.out.Salle;
import fr.orleans.univ.imis.sig.server.persistance.entities.Categorie;
import fr.orleans.univ.imis.sig.server.persistance.repos.SallesEtageRepository;
import fr.orleans.univ.imis.sig.server.persistance.repos.SallesRDCRepository;
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
    private SallesRDCRepository sallesRDCRepository;
    @Autowired
    private SallesEtageRepository sallesEtageRepository;

    @Override
    public Salle updateRoom(int idRoom, UserModifiedRoom userModifyRoom) throws NotSuchRoomException {
        sallesRDCRepository.findById(idRoom)
            .ifPresentOrElse(salleRDC -> {
                salleRDC.setFonction(userModifyRoom.getFonction());
                salleRDC.setCategorie(userModifyRoom.getType());
            }, () -> {
                var salleEtage = sallesEtageRepository.findById(idRoom).orElseThrow(NotSuchRoomException::new);
                salleEtage.setFonction(userModifyRoom.getFonction());
                salleEtage.setCategorie(userModifyRoom.getType());
            });
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
