import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DayProducts } from '@/modules/day-products/day-products.model';
import { Product } from '@/modules/product/product.model';
import { ProductService } from '@/modules/product';
import { Review } from '@/modules/review/review.model';
import { Features } from '@/modules/features/features.model';

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
    const percent = [10, 5, 15, 20];
    const p = product.map((i) => i);
    for (let i = 0; i < 3; i++) {
      const ind = Math.floor(Math.random() * p.length);
      const item = p[ind];
      const newProduct = product.find((p) => p.id === item.id);
      const discount = percent[Math.floor(Math.random() * percent.length)];
      newProduct.discount = discount;
      newProduct.oldPrice = item.price;
      newProduct.price = item.price - (item.price / 100) * discount;
      await newProduct.save();

      if (item && item.discount > 0) {
        dayProducts.push(p.splice(ind, 1)[0]);
      }
    }
    existingDayProducts.dayProducts = dayProducts;
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
      console.log(newProduct.id);
      newProduct.price = productsYesterday[i].oldPrice;
      newProduct.discount = 0;
      newProduct.oldPrice = 0;
      await newProduct.save();
    }
    return await existingDayProducts.save();
  }
  async getDayProducts() {
    return await this.dayProductsModel.findOne();
  }
}
