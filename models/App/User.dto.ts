import { IsEmail, IsNumber, IsStrongPassword } from "class-validator";

class UserDto {
    constructor(){
        console.log('constructor');
    }

    @IsEmail()
    public email: string;

    @IsStrongPassword() // Check if match 6+ char aBcd5%
    public password: string;

    @IsNumber()
    public role: number;
}

export default UserDto;