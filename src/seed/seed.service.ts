import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();

    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);

    return 'SEED executed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.usersRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];
    seedUsers.forEach((user) => {
      const { password, ...userData } = user;
      users.push(
        this.usersRepository.create({
          ...userData,
          password: bcrypt.hashSync(password, 10),
        }),
      );
    });

    const dbUsers = await this.usersRepository.save(users);
    // console.log({ seedUsers, users, dbUsers });

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];

    products.forEach((product) => {
      // Me funciona porque parece como el CreateProductDto
      insertPromises.push(this.productsService.create(product, user));
    });

    const results = await Promise.all(insertPromises);

    return true;
  }
}
