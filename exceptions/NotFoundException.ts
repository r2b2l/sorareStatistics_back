import HttpException from "./HttpException";

class NotFoundException extends HttpException {
    constructor(className, id) {
        super(404, className + ' with id ' + id + ' not found');
    }
}

export default NotFoundException;