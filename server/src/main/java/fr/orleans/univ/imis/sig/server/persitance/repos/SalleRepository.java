package fr.orleans.univ.imis.sig.server.persitance.repos;

import fr.orleans.univ.imis.sig.server.entities.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @autor Vincent
 * @date 13/11/2020
 */

@Repository
public interface SalleRepository extends JpaRepository<Long, Salle> {
}
