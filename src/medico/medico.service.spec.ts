import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PacienteEntity } from '../paciente/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicosList: MedicoEntity[];
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacienteRepository.clear();

    medicosList = [];
    pacientesList = [];

    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await repository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: []
      });
      medicosList.push(medico);

      const paciente: PacienteEntity = await pacienteRepository.save({
        nombre: faker.person.firstName(),
        genero: Math.random() < 0.5 ? "M" : "F",
        medicos: [],
        diagnosticos: []
      });
      pacientesList.push(paciente);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return a list of doctors', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toBeDefined();
    expect(medicos.length).toBeGreaterThan(0);
    expect(medicos.length).toEqual(medicosList.length);
  });

  it('findOne should return a doctor', async () => {
    const medico: MedicoEntity = medicosList[0];
    const medicoFound: MedicoEntity = await service.findOne(medico.id);
    expect(medicoFound).not.toBeNull();
    expect(medicoFound).toBeDefined();
    expect(medicoFound.id).toEqual(medico.id);
    expect(medicoFound.nombre).toEqual(medico.nombre);
    expect(medicoFound.especialidad).toEqual(medico.especialidad);
    expect(medicoFound.telefono).toEqual(medico.telefono);
  });

  it('findOne should throw an error when the doctor does not exist', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "The doctor with the given id was not found");
  });

  it('create should create a new doctor', async () => {
    const medico: MedicoEntity = await service.create({
      id: "",
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    });
    expect(medico).not.toBeNull();
    expect(medico).toBeDefined();

    const medicoCreated: MedicoEntity = await repository.findOne({where: {id: medico.id}});
    expect(medicoCreated).not.toBeNull();
    expect(medicoCreated.nombre).toEqual(medico.nombre);
    expect(medicoCreated.especialidad).toEqual(medico.especialidad);
    expect(medicoCreated.telefono).toEqual(medico.telefono);
  });

  it('create should throw an error when the doctor specialty is empty', async () => {
    await expect(service.create({
      id: "",
      nombre: faker.person.firstName(),
      especialidad: "",
      telefono: faker.phone.number(),
      pacientes: []
    })).rejects.toHaveProperty("message", "The doctor must have a name and a specialty");
  });

  it('delete should remove a doctor without associated patients', async () => {
    await service.delete(medicosList[0].id);
    const medico: MedicoEntity = await repository.findOne({where: {id: medicosList[0].id}});
    expect(medico).toBeNull();
  });

  it('delete should throw an error when the doctor does not exist', async () => {
    await expect(service.delete("0")).rejects.toHaveProperty("message", "The doctor with the given id was not found");
  });

  it('delete should throw an error when the doctor has associated patients', async () => {
    const medico: MedicoEntity = medicosList[0];
    medico.pacientes = pacientesList;
    await repository.save(medico);

    await expect(service.delete(medico.id)).rejects.toHaveProperty("message", "The doctor has associated patients");
  });
  
});
