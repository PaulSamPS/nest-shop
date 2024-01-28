import { Controller, Get } from '@nestjs/common';
import { DayProductsService } from '@/modules/day-products/day-products.service';

@Controller('day-products')
export class DayProductsController {
  constructor(private readonly dayProductsService: DayProductsService) {}

  @Get('/set')
  setDayProducts() {
    return this.dayProductsService.setDayProducts();
  }

  @Get('/get')
  getDayProducts() {
    return this.dayProductsService.getDayProducts();
  }
}
