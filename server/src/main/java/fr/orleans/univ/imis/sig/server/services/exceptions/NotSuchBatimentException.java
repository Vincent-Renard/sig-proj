package fr.orleans.univ.imis.sig.server.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @autor Vincent
 * @date 23/11/2020
 */
@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Batiment Unknown")
public class NotSuchBatimentException extends Exception {
}
