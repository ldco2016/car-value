import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === user.email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('someemail@email.com', 'dfghjk');

    expect(user.password).not.toEqual('dfghjk');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async (done) => {
    await service.signup('someemail@email.com', 'dfghjk');
    try {
      await service.signup('someemail@email.com', 'dfghjk');
    } catch (error) {
      done();
    }
  });

  it('throws if signin is called with an unused email', async (done) => {
    try {
      await service.signin('pablo@alunacare.com', 'ghjkl');
    } catch (error) {
      done();
    }
  });

  it('throws if an invalid password is provided', async (done) => {
    await service.signup('pablo@alunacare.com', 'asdfgh');
    try {
      await service.signin('pablo@alunacare.com', 'passoword');
    } catch (error) {
      done();
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('anyemail@email.com', 'mypassword');

    const user = await service.signin('anyemail@email.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
