import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';

@Injectable()
export class PacienteMedicoService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) {}

    async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne(
            {
                where: { id: pacienteId },
                relations: ['medicos', 'diagnosticos'],
            }
        );
        if (!paciente) 
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);

        const medico: MedicoEntity = await this.medicoRepository.findOne(
            {
                where: { id: medicoId }
            }
        );
        if (!medico) 
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);

        // Validar que sólo se agregue si hay menos de 5 médicos asociados
        if (paciente.medicos.length >= 5)
            throw new BusinessLogicException("The patient can't have more than 5 doctors associated", BusinessError.PRECONDITION_FAILED);

        paciente.medicos = [...paciente.medicos, medico];
        return await this.pacienteRepository.save(paciente);
    }
}
