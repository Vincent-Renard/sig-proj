package fr.orleans.univ.imis.sig.server.controller;

import fr.orleans.univ.imis.sig.server.api.dtos.in.UserDefinitedHouse;
import fr.orleans.univ.imis.sig.server.api.dtos.in.UserDefinitedRoom;
import fr.orleans.univ.imis.sig.server.api.dtos.in.UserModifiedRoom;
import fr.orleans.univ.imis.sig.server.persistance.entities.Batiment;
import fr.orleans.univ.imis.sig.server.persistance.entities.Salle;
import fr.orleans.univ.imis.sig.server.persistance.entities.TypeSalle;
import fr.orleans.univ.imis.sig.server.services.Facade;
import fr.orleans.univ.imis.sig.server.services.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @autor Vincent
 * @date 09/12/2020
 */

@RestController
@RequestMapping("sig/")
public class Controler {
    @Autowired
    Facade base;

    @GetMapping("batiments/{name}")
    public ResponseEntity<Batiment> getBatiment(@PathVariable(name = "name") String nom) throws NotSuchBatimentException {
        return ResponseEntity.ok(base.getBatiment(nom));
    }

    @GetMapping("batiments/{name}/rooms")
    public ResponseEntity<List<Salle>> getRoomsOfBat(@PathVariable(name = "name") String nom, @RequestParam(required = false, name = "type") TypeSalle typeOfRoom) throws NotSuchBatimentException {
        return ResponseEntity.ok(base.getSallesOfBat(nom, typeOfRoom));
    }

    @PatchMapping("rooms/{idRoom}")
    public ResponseEntity<Salle> updateRoomOfBat(@PathVariable(name = "idRoom") long idroom, @RequestBody UserModifiedRoom userModifiedRoom) throws NotSuchBatimentException, NotSuchRoomException {
        return ResponseEntity.ok(base.updateRoom(idroom, userModifiedRoom));
    }

    @PostMapping("batiments/")
    public ResponseEntity<Batiment> addBat(@RequestBody UserDefinitedHouse udh) throws SuchBatimentNameExistsException {
        return ResponseEntity.status(HttpStatus.CREATED).body(base.addBatiment(udh));
    }

    @PostMapping("rooms/")
    public ResponseEntity<Salle> addRoom(@RequestBody UserDefinitedRoom udr) throws FloorOverFlowException, NotSuchConnectedRoomException, NotSuchBatimentException {
        return ResponseEntity.status(HttpStatus.CREATED).body(base.addRoom(udr));
    }

}
