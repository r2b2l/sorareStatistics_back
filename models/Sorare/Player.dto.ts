import { IsNumber, IsString } from 'class-validator';

/**
 * Player Model Validation
 * used by @see validationMiddleware
 */
class PlayerDto {
    constructor(){
        console.log('constructor');
    }
    @IsString()
    public name: string;

    @IsNumber()
    public L5: number;
}

export default PlayerDto;