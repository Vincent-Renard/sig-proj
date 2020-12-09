package fr.orleans.univ.imis.sig.server.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @autor Vincent
 * @date 07/12/2020
 */
@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Room Unknown")
public class NotSuchRoomException extends Exception {
}
