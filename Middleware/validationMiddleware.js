import { validationResult } from 'express-validator';
import APIError from '../utils/APIError.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return next(new APIError(errorMessages.join(', '), 400));
    }
    next();
};

export { validate };
