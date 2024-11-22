import { Injectable } from '@nestjs/common';
import { MedicoEntity } from './medico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) {}

    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({ relations: ['pacientes'] });
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne(
            {
                where: { id },
                relations: ['pacientes'],
            }
        );
        if (!medico) 
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);
        
        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        // Validar que el médico tenga nomrbe y especialidad
        if (medico.nombre.length === 0 || medico.especialidad.length === 0)
            throw new BusinessLogicException("The doctor must have a name and a specialty", BusinessError.PRECONDITION_FAILED);
        
        return await this.medicoRepository.save(medico);
    }

    async delete(id: string): Promise<void> {
        const medico: MedicoEntity = await this.medicoRepository.findOne(
            {
                where: { id }
            }
        );
        if (!medico) 
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);

        // Validar que no se pueda eliminar si tiene pacientes asociados
        if (medico.pacientes.length > 0)
            throw new BusinessLogicException("The doctor has associated patients", BusinessError.PRECONDITION_FAILED);

        await this.medicoRepository.remove(medico);
    }
}
