import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';
 
function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties })
      .then(errors => {
        if (errors.length > 0) {
          const message = 'Validation failed. Errors : ' + errors;
          next(new HttpException(400, message));
        } else {
          next();
        }
      });
  };
}
 
export default validationMiddleware;