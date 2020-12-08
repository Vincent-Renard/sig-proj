package fr.orleans.univ.imis.sig.server.persistance.repos;

import fr.orleans.univ.imis.sig.server.persistance.entities.Batiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @autor Vincent
 * @date 13/11/2020
 */
@Repository
public interface BatimentRepository extends JpaRepository<Batiment, String> {

}
