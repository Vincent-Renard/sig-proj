package fr.orleans.univ.imis.sig.server.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @autor Vincent
 * @date 08/12/2020
 */
@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Graphe bat - room error")
public class NotSuchConnectedRoomException extends Exception {
}
