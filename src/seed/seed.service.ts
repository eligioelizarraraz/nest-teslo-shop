import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'SEED executed';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];

    // products.forEach((product) => {
    //   // Me funciona porque parece como el CreateProductDto
    //   insertPromises.push(this.productsService.create(product));
    // });

    const results = await Promise.all(insertPromises);

    return true;
  }
}
