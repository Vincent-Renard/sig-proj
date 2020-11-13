package fr.orleans.univ.imis.sig.server.persitance.repos;

import fr.orleans.univ.imis.sig.server.entities.Batiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @autor Vincent
 * @date 13/11/2020
 */
@Repository
public interface BatimentRepository extends JpaRepository<String, Batiment> {


}
