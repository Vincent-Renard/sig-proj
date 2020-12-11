package fr.orleans.univ.imis.sig.server.persistance.entities;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "\"salles-etage\"")
public class SallesEtage {
    @Id
    private int id;
    private int etage;
    private String fonction;
    @Enumerated(EnumType.STRING)
    private Categorie categorie;
}
