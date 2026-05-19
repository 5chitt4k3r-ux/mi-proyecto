import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreateUsuarioDto {
    @IsString() @IsNotEmpty()
    nombre: string;
    @IsEmail() @IsNotEmpty()
    email: string;
    @IsString() @IsNotEmpty() @MinLength(6)
    password: string;
}