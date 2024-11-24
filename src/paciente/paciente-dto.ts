import {IsNotEmpty, IsString} from 'class-validator';

export class PacienteDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    genero: string;
}
