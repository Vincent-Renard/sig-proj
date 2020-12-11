package fr.orleans.univ.imis.sig.server.persistance.entities;

import lombok.AccessLevel;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@ToString
@Table(name = "\"portes-etage\"")
public class PortesEtage {
    @Id
    int id;
    int numero;
    int salle1;
    int salle2;
    int etage;
}
