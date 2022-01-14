import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'pablo@alunacare.com',
          password: 'password',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email: 'pablo@alunacare.com', password: 'password' } as User,
        ]);
      },
      // remove: (id: number) => {
      //   return Promise.resolve({ id } as User);
      // },
      // update: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      // signin: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('pablo@alunacare.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('pablo@alunacare.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    expect.assertions(1);
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
