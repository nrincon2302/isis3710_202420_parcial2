import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticosList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
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

  it('findAll should return a list of diagnostics', async () => {
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toBeDefined();
    expect(diagnosticos.length).toBeGreaterThan(0);
    expect(diagnosticos.length).toEqual(diagnosticosList.length);
  });

  it('findOne should return a diagnostic', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    const diagnosticoFound: DiagnosticoEntity = await service.findOne(diagnostico.id);
    expect(diagnosticoFound).not.toBeNull();
    expect(diagnosticoFound).toBeDefined();
    expect(diagnosticoFound.id).toEqual(diagnostico.id);
    expect(diagnosticoFound.descripcion).toEqual(diagnostico.descripcion);
  });

  it('findOne should throw an error when the diagnostic does not exist', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty('message', 'The diagnostic with the given id was not found');
  });

  it('create should create a new diagnostic', async () => {
    const diagnostico: DiagnosticoEntity = await service.create({
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      pacientes: [] 
    });
    expect(diagnostico).not.toBeNull();
    expect(diagnostico).toBeDefined();

    const diagnosticoCreated: DiagnosticoEntity = await repository.findOne({where: {id: diagnostico.id}});
    expect(diagnosticoCreated).not.toBeNull();
    expect(diagnosticoCreated.nombre).toEqual(diagnostico.nombre);
    expect(diagnosticoCreated.descripcion).toEqual(diagnostico.descripcion);
  });

  it('create should throw an error when the diagnostic description is more than 200 characters', async () => {
    await expect(service.create({
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraphs(5),
      pacientes: []
    })).rejects.toHaveProperty('message', 'The diagnostic description must be less than 200 characters');
  });

  it('delete should remove a diagnostic', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    await service.delete(diagnostico.id);
    const diagnosticoDeleted: DiagnosticoEntity = await repository.findOne({where: {id: diagnostico.id}});
    expect(diagnosticoDeleted).toBeNull();
  });
  
});
