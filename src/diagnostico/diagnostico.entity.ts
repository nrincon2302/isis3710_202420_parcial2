import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';

@Entity()
export class DiagnosticoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => PacienteEntity, paciente => paciente.diagnosticos)
    pacientes: PacienteEntity[];
}
