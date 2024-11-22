import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  
  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.name.firstName(),
        genero: Math.random() < 0.5 ? "M" : "F"
      });
      pacientesList.push(paciente);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a new patient', async () => {
    const paciente: PacienteEntity = await service.create({
      id: "",
      nombre: faker.name.firstName(),
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
});
