import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DayProducts } from '@/modules/day-products/day-products.model';
import { ProductService } from '@/modules/product';

// let dayProducts: Product[] = [];
@Injectable()
export class DayProductsService {
  constructor(
    @InjectModel(DayProducts)
    private dayProductsModel: typeof DayProducts,
    private readonly productService: ProductService,
  ) {}
  async setDayProducts() {
    const dayProductsModel = new DayProducts();
    const existingDayProducts = await this.dayProductsModel.findOne();
    const product = await this.productService.findAllWithReviewAndFeatures();
    // const dt = Date.now();
    // const now = Math.floor(dt / 1000);
    // const next = Math.ceil(dt / 1000 / 60 / 60 / 24) * 60 * 60 * 24;
    // const left = next - now;

    if (!existingDayProducts) {
      dayProductsModel.dayProducts = [];
      return await dayProductsModel.save();
    }
    const dayProducts = [];
    // размер скидки
    const percent = [10, 15, 20];

    const p = product.map((i) => i);

    for (let i = 0; dayProducts.length < 3; i++) {
      const ind = Math.trunc(Math.random() * p.length);
      const item = p[ind];
      const newProduct = product.find((p) => p.id === item.id);
      const discount = percent[Math.floor(Math.random() * percent.length)];
      const includeItems = existingDayProducts.productsYesterday.some(
        (o) => o.id === item.id,
      );
      if (!includeItems) {
        newProduct.discount = discount;
        newProduct.oldPrice = item.price;
        newProduct.price = item.price - (item.price / 100) * discount;
        await newProduct.save();
        dayProducts.push(p.splice(ind, 1)[0]);
      }
      existingDayProducts.dayProducts = dayProducts;
    }
    return await existingDayProducts.save();
  }

  async setYesterday() {
    const existingDayProducts = await this.dayProductsModel.findOne();
    const product = await this.productService.findAllWithReviewAndFeatures();

    existingDayProducts.productsYesterday = existingDayProducts.dayProducts;
    const productsYesterday = existingDayProducts.dayProducts.map((i) => i);
    for (let i = 0; i < 3; i++) {
      const item = productsYesterday[i].id;
      const newProduct = product.find((p) => p.id === item);
      newProduct.price = productsYesterday[i].oldPrice;
      newProduct.discount = 0;
      newProduct.oldPrice = 0;
      await newProduct.save();
    }
    return await existingDayProducts.save();
  }
  async getDayProducts() {
    const products = await this.dayProductsModel.findOne();
    return products.dayProducts;
  }

  async getOneDayProducts(productName: string) {
    const products = await this.dayProductsModel.findOne();
    return products.dayProducts.find((product) => product.name === productName);
  }

  async getYesterdayProducts() {
    const products = await this.dayProductsModel.findOne();
    return products.productsYesterday;
  }
}
