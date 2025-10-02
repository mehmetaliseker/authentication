import { Controller, Get, Query, HttpException, HttpStatus, Req } from '@nestjs/common';
import { GoogleSearchService } from '../services/google-search.service';
import { ISearchResponse } from '../interfaces/search.interface';
import type { Request } from 'express';

@Controller('search')
export class SearchController {
  constructor(private readonly googleSearchService: GoogleSearchService) {}

  @Get()
  public async search(
    @Query('q') query: string,
    @Query('userId') userId?: string,
    @Req() req?: Request
  ): Promise<ISearchResponse> {
    if (!query || query.trim().length === 0) {
      throw new HttpException('Arama sorgusu gereklidir', HttpStatus.BAD_REQUEST);
    }

    if (query.length > 200) {
      throw new HttpException('Arama sorgusu çok uzun', HttpStatus.BAD_REQUEST);
    }

    try {
      const userIdNum = userId ? parseInt(userId, 10) : undefined;
      const ipAddress = req?.ip || req?.connection?.remoteAddress;
      const userAgent = req?.get('User-Agent');
      
      return await this.googleSearchService.search(
        query.trim(), 
        userIdNum, 
        ipAddress, 
        userAgent
      );
    } catch (error) {
      console.error('Search controller error:', error);
      const message = (error as Error).message || 'Arama işlemi sırasında bir hata oluştu';
      const isConnectivity = message.includes('bağlantı') || message.includes('İnternet') || message.includes('network');
      const status = isConnectivity ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }
}
