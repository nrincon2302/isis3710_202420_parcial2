import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;
  let pacientesList: PacienteEntity[];
  let diagnosticosList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  
  const seedDatabase = async () => {
    repository.clear();
    diagnosticoRepository.clear();

    pacientesList = [];
    diagnosticosList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.person.firstName(),
        genero: Math.random() < 0.5 ? "M" : "F"
      });
      pacientesList.push(paciente);

      const diagnostico: DiagnosticoEntity = await diagnosticoRepository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        pacientes: []
      });
      diagnosticosList.push(diagnostico);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a new patient', async () => {
    const paciente: PacienteEntity = await service.create({
      id: "",
      nombre: faker.person.firstName(),
      genero: Math.random() < 0.5 ? "M" : "F",
      medicos: [],
      diagnosticos: []
    });
    expect(paciente).not.toBeNull();
    expect(paciente).toBeDefined();

    const pacienteCreated: PacienteEntity = await repository.findOne({where: {id: paciente.id}});
    expect(pacienteCreated).not.toBeNull();
    expect(pacienteCreated.nombre).toEqual(paciente.nombre);
    expect(pacienteCreated.genero).toEqual(paciente.genero);
  });

  it('create should throw an error when the patient name is less than 3 characters', async () => {
    await expect(service.create({
      id: "",
      nombre: "ab",
      genero: Math.random() < 0.5 ? "M" : "F",
      medicos: [],
      diagnosticos: []
    })).rejects.toHaveProperty("message", "The patient name must be at least 3 characters long");
  });

  it('findAll should return all patients', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toBeDefined();
    expect(pacientes.length).toBeGreaterThan(0);
    expect(pacientes.length).toEqual(pacientesList.length);
  });

  it('findOne should return a patient by id', async () => {
    const paciente: PacienteEntity = await service.findOne(pacientesList[0].id);
    expect(paciente).not.toBeNull();
    expect(paciente).toBeDefined();
    expect(paciente.id).toEqual(pacientesList[0].id);
    expect(paciente.nombre).toEqual(pacientesList[0].nombre);
    expect(paciente.genero).toEqual(pacientesList[0].genero);
  });

  it('findOne should throw an error when the patient does not exist', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "The patient with the given id was not found");
  });

  it('delete should remove a patient', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    paciente.diagnosticos = [];
    await service.delete(pacientesList[0].id);
    const pacienteBorrado: PacienteEntity = await repository.findOne({where: {id: pacientesList[0].id}});
    expect(pacienteBorrado).toBeNull();
  });

  it('delete should throw an error when the patient does not exist', async () => {
    await expect(service.delete("0")).rejects.toHaveProperty("message", "The patient with the given id was not found");
  });

  it('delete should throw an error when the patient has associated diagnostics', async () => {
    const persistedPaciente: PacienteEntity = pacientesList[0];
    const paciente = await service.findOne(persistedPaciente.id);
    paciente.diagnosticos = [diagnosticosList[0]];
    await repository.save(paciente);

    await expect(service.delete(persistedPaciente.id)).rejects.toHaveProperty("message", "The patient cannot be deleted because it has diagnostics associated");
  });

});
