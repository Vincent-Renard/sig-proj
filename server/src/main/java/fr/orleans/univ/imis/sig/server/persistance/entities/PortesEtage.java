package fr.orleans.univ.imis.sig.server.persistance.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "portes-etage")
public class PortesEtage {
    @Id
    private int id;
    private int numero;
    private int salle1;
    private int salle2;
    private int etage;
}
