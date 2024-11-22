import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { PacienteEntity } from './paciente.entity';

@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
    ) {}

    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteRepository.find({ relations: ['medicos', 'diagnosticos'] });
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne(
            {
                where: { id },
                relations: ['medicos', 'diagnosticos'],
            }
        );
        if (!paciente) 
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);
        
        return paciente;
    }

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        // Validar que el paciente tenga nombre con al menos 3 caracteres
        if (paciente.nombre.length < 3)
            throw new BusinessLogicException("The patient name must be at least 3 characters long", BusinessError.PRECONDITION_FAILED);

        return await this.pacienteRepository.save(paciente);
    }

    async delete(id: string): Promise<void> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne(
            {
                where: { id }
            }
        );
        if (!paciente) 
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);

        // Validar que no se puede eliminar si tiene diagnosticos
        if (paciente.diagnosticos.length > 0)
            throw new BusinessLogicException("The patient cannot be deleted because it has diagnostics associated", BusinessError.PRECONDITION_FAILED);

        await this.pacienteRepository.remove(paciente);
    }
}
