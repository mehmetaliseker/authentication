import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleSearchService } from '../services/google-search.service';
import { ISearchResponse } from '../interfaces/search.interface';

@Controller('search')
export class SearchController {
  private readonly googleSearchService: GoogleSearchService;

  constructor() {
    this.googleSearchService = new GoogleSearchService();
  }

  @Get()
  public async search(@Query('q') query: string): Promise<ISearchResponse> {
    if (!query || query.trim().length === 0) {
      throw new HttpException('Arama sorgusu gereklidir', HttpStatus.BAD_REQUEST);
    }

    if (query.length > 200) {
      throw new HttpException('Arama sorgusu çok uzun', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.googleSearchService.search(query.trim());
    } catch (error) {
      console.error('Search controller error:', error);
      throw new HttpException(
        error.message || 'Arama işlemi sırasında bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
