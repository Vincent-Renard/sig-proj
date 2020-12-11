package fr.orleans.univ.imis.sig.server.persistance.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "salles-rdc")
public class SallesRDC {
    @Id
    private int id;
    private int etage;
    private String fonction;
    private Categorie categorie;
}
