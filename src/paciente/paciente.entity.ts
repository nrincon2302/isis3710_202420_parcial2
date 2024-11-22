import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
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
    @JoinTable()
    medicos: MedicoEntity[];

    @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
    @JoinTable()
    diagnosticos: DiagnosticoEntity[];
}
