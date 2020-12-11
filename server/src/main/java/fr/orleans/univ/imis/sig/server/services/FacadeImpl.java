package fr.orleans.univ.imis.sig.server.services;

import fr.orleans.univ.imis.sig.server.api.dtos.in.UserModifiedRoom;
import fr.orleans.univ.imis.sig.server.api.dtos.out.Salle;
import fr.orleans.univ.imis.sig.server.persistance.entities.Categorie;
import fr.orleans.univ.imis.sig.server.persistance.entities.SallesEtage;
import fr.orleans.univ.imis.sig.server.persistance.entities.SallesRDC;
import fr.orleans.univ.imis.sig.server.persistance.repos.SallesEtageRepository;
import fr.orleans.univ.imis.sig.server.persistance.repos.SallesRDCRepository;
import fr.orleans.univ.imis.sig.server.services.exceptions.NotSuchRoomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
        Salle salle;

        var optSalleRDC = sallesRDCRepository.findById(idRoom);
        if (optSalleRDC.isPresent()) {
            var salleRDC = optSalleRDC.get();
            Optional.ofNullable(userModifyRoom.getFonction()).ifPresent(fonction -> salleRDC.setFonction(fonction));
            Optional.ofNullable(userModifyRoom.getCategorie()).ifPresent(categorie -> salleRDC.setCategorie(categorie));
            salle = getSalleFromSalleRDC(sallesRDCRepository.save(salleRDC));
        } else {
            var salleEtage = sallesEtageRepository.findById(idRoom).orElseThrow(NotSuchRoomException::new);
            Optional.ofNullable(userModifyRoom.getFonction()).ifPresent(fonction -> salleEtage.setFonction(fonction));
            Optional.ofNullable(userModifyRoom.getCategorie()).ifPresent(categorie -> salleEtage.setCategorie(categorie));
            salle = getSalleFromSalleEtage(sallesEtageRepository.save(salleEtage));
        }

        return salle;
    }


    @Override
    public List<Salle> getAllSalles(Categorie ts) {
        return Stream.concat(
            sallesRDCRepository.findAll()
                .stream()
                .filter(salleRDC -> ts == null || ts == salleRDC.getCategorie())
                .map(FacadeImpl::getSalleFromSalleRDC),
            sallesEtageRepository.findAll()
                .stream()
                .filter(salleEtage -> ts == null || ts == salleEtage.getCategorie())
                .map(FacadeImpl::getSalleFromSalleEtage)
        )
        .collect(Collectors.toList());
    }

    private static Salle getSalleFromSalleRDC(SallesRDC salleRDC) {
        return new Salle(
            salleRDC.getId(),
            salleRDC.getEtage(),
            salleRDC.getFonction(),
            salleRDC.getCategorie()
        );
    }

    private static Salle getSalleFromSalleEtage(SallesEtage salleEtage) {
        return new Salle(
            salleEtage.getId(),
            salleEtage.getEtage(),
            salleEtage.getFonction(),
            salleEtage.getCategorie()
        );
    }
}
