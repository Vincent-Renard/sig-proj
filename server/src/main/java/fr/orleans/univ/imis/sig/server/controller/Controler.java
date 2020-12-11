package fr.orleans.univ.imis.sig.server.controller;

import fr.orleans.univ.imis.sig.server.api.dtos.in.UserModifiedRoom;
import fr.orleans.univ.imis.sig.server.api.dtos.out.Salle;
import fr.orleans.univ.imis.sig.server.persistance.entities.Categorie;
import fr.orleans.univ.imis.sig.server.services.Facade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @autor Vincent
 * @date 09/12/2020
 */

@RestController
@RequestMapping(value = "sig/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class Controler {

    @Autowired
    Facade base;


    @GetMapping("/rooms")
    public ResponseEntity<List<Salle>> getRoomsOfBat(@RequestParam(required = false, name = "type") Categorie typeOfRoom) {
        return ResponseEntity.ok(base.getAllSalles(typeOfRoom));
    }

    @PatchMapping("rooms/{idRoom}")
    public ResponseEntity<Salle> updateRoomOfBat(@PathVariable(name = "idRoom") long idroom, @RequestBody UserModifiedRoom userModifiedRoom) NotSuchRoomException {
        return ResponseEntity.ok(base.updateRoom(idroom, userModifiedRoom));
    }




}
