import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { PacienteDto } from './paciente-dto';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) {}

    @Get()
    async findAll(): Promise<PacienteDto[]> {
        return await this.pacienteService.findAll();
    }

    @Get(':pacienteId')
    async findOne(@Param('pacienteId') pacienteId: string): Promise<PacienteDto> {
        return await this.pacienteService.findOne(pacienteId);
    }

    @Post()
    async create(@Body() pacienteDto: PacienteDto): Promise<PacienteDto> {
        const paciente: PacienteEntity = plainToInstance(PacienteEntity, pacienteDto);
        return await this.pacienteService.create(paciente);
    }

    @Delete(':pacienteId')
    @HttpCode(204)
    async delete(@Param('pacienteId') pacienteId: string) {
        return await this.pacienteService.delete(pacienteId);
    }
}
