import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let pacientesList: PacienteEntity[];
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();
    pacientesList = [];
    medicosList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await pacienteRepository.save({
        nombre: faker.person.firstName(),
        genero: Math.random() < 0.5 ? "M" : "F",
        medicos: [],
        diagnosticos: []
      });
      pacientesList.push(paciente);
    }
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number()
      });
      medicosList.push(medico);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a doctor to a patient', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    const medico: MedicoEntity = medicosList[0];
    const pacienteUpdated: PacienteEntity = await service.addMedicoToPaciente(paciente.id, medico.id);
    expect(pacienteUpdated).not.toBeNull();
    expect(pacienteUpdated).toBeDefined();
    expect(pacienteUpdated.medicos).not.toBeNull();
    expect(pacienteUpdated.medicos).toBeDefined();
    expect(pacienteUpdated.medicos.length).toEqual(1);
    expect(pacienteUpdated.medicos[0].id).toEqual(medico.id);
    expect(pacienteUpdated.medicos[0].nombre).toEqual(medico.nombre);
    expect(pacienteUpdated.medicos[0].especialidad).toEqual(medico.especialidad);
    expect(pacienteUpdated.medicos[0].telefono).toEqual(medico.telefono);
  });

  it('addMedicoToPaciente should throw an error when the patient does not exist', async () => {
    await expect(service.addMedicoToPaciente("0", medicosList[0].id)).rejects.toHaveProperty('message', 'The patient with the given id was not found');
  });

  it('addMedicoToPaciente should throw an error when the doctor does not exist', async () => {
    await expect(service.addMedicoToPaciente(pacientesList[0].id, "0")).rejects.toHaveProperty('message', 'The doctor with the given id was not found');
  });

  it('addMedicoToPaciente should throw an error when the patient has more than 5 doctors associated', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = medicosList[i];
      paciente.medicos = [...paciente.medicos, medico];
    }
    await pacienteRepository.save(paciente);

    const nuevoMedico = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number()
    });
    medicosList.push(nuevoMedico);
    await expect(service.addMedicoToPaciente(paciente.id, medicosList[5].id)).rejects.toHaveProperty('message', "The patient can't have more than 5 doctors associated");
  });
});
