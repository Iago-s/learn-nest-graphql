import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import TestUtil from '../common/test/TestUtil';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  // Trabalhar com dados fakes de um banco
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  //Limpando os mocks
  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
    mockRepository.save.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search all Users', () => {
    it('should be list all users', async () => {
      const user = TestUtil.giveAMeAValidUser();
      // Mocando o resultado da busca no banco
      mockRepository.find.mockReturnValue([user, user]);

      const users = await service.findAllUsers();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search User by ID', () => {
    it('should find a existing user', async () => {
      const user = await TestUtil.giveAMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);

      const userFound = await service.findUserById('1');
      expect(userFound).toMatchObject({ name: user.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a exception does not find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findUserById('10')).rejects.toBeInstanceOf(NotFoundException)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  })

  describe('When create User', () => {
    it('should create a user', async () => {
      const user = await TestUtil.giveAMeAValidUser();
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(user);

      const savedUser = await service.createUser(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should return a exception does not create a user', async () => {
      const user = await TestUtil.giveAMeAValidUser();
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(null);

      await service.createUser(user).catch(e => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problema para criar um usuario'
        });
      });

      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('When update User', () => {
    it('should create a user', async () => {
      const user = await TestUtil.giveAMeAValidUser();
      const updatedUser = { name: 'Name updated' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const resultUser = await service.updateUser('1', {
        ...user,
        name: 'Updated Name'
      });

      expect(resultUser).toMatchObject(updatedUser);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledTimes(1);
    });
  });

  describe('When delete User', () => {
    it('should delete a existing user', async () => {
      const user = await TestUtil.giveAMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('should not delete a inexisting user', async () => {
      const user = await TestUtil.giveAMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(null);

      const deletedUser = await service.deleteUser('10');

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
