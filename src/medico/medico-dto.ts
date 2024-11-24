import {IsNotEmpty, IsString} from 'class-validator';

export class MedicoDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    especialidad: string;

    @IsNotEmpty()
    @IsString()
    telefono: string;
}
