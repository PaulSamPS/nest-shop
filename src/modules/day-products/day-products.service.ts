import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DayProducts } from '@/modules/day-products/day-products.model';
import { Product } from '@/modules/product/product.model';
import { ProductService } from '@/modules/product';

let dayProducts: Product[] = [];
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
    const dt = Date.now();
    const now = Math.floor(dt / 1000);
    const next = Math.ceil(dt / 1000 / 60 / 60 / 24) * 60 * 60 * 24;
    const left = next - now;

    if (!existingDayProducts) {
      dayProductsModel.dayProducts = [];
      dayProductsModel.dayProducts = [];
      return await dayProductsModel.save();
    }

    const setProducts = async () => {
      existingDayProducts.productsYesterday = existingDayProducts.dayProducts;
      dayProducts = [];
      const p = product.map((i) => i);
      for (let i = 0; i < 5; i++) {
        const ind = Math.floor(Math.random() * p.length);
        const item = p[ind];

        if (item && item.oldPrice > 0) {
          dayProducts.push(p.splice(ind, 1)[0]);
        }
      }
      existingDayProducts.dayProducts = dayProducts;
      return await existingDayProducts.save();
    };

    setInterval(async () => {
      await setProducts();
    }, left);
  }

  async getDayProducts() {
    return await this.dayProductsModel.findOne();
  }
}
