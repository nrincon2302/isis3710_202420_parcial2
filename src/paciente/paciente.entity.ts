import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity';

@Entity()
export class PacienteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    genero: string;

    @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
    medicos: MedicoEntity[];

    @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
    diagnosticos: DiagnosticoEntity[];
}
