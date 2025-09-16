import { Injectable } from '@nestjs/common';
import { ISearchService, ISearchResponse } from '../interfaces/search.interface';

@Injectable()
export class GoogleSearchService implements ISearchService {
  private readonly apiKey: string;
  private readonly searchEngineId: string;
  private readonly baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor() {
    this.apiKey = process.env.SEARCH_ENGINE_API_KEY || '';
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '017576662512468239146:omuauf_lfve';
    
    if (!this.apiKey) {
      console.warn('SEARCH_ENGINE_API_KEY environment variable is missing');
      throw new Error('Google Search API key yapılandırması eksik. Lütfen .env dosyasını kontrol edin.');
    }
    if (!this.searchEngineId) {
      console.warn('GOOGLE_SEARCH_ENGINE_ID environment variable is missing');
      throw new Error('Google Search Engine ID yapılandırması eksik. Lütfen .env dosyasını kontrol edin.');
    }
  }

  public async search(query: string): Promise<ISearchResponse> {
    try {
      const url = this.buildSearchUrl(query);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.formatResponse(data);
    } catch (error) {
      console.error('Google Search API error:', error);
      
      if (error.message?.includes('API key')) {
        throw new Error('Google API key hatası. Lütfen API key\'inizi kontrol edin.');
      }
      if (error.message?.includes('quota')) {
        throw new Error('Google API kullanım kotası aşıldı. Lütfen daha sonra tekrar deneyin.');
      }
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error('İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin.');
      }
      
      throw new Error('Arama işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  private buildSearchUrl(query: string): string {
    const params = new URLSearchParams({
      key: this.apiKey,
      cx: this.searchEngineId,
      q: query,
      num: '10',
      safe: 'active'
    });

    return `${this.baseUrl}?${params.toString()}`;
  }

  private formatResponse(data: any): ISearchResponse {
    return {
      items: data.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink
      })) || [],
      searchInformation: {
        totalResults: data.searchInformation?.totalResults || '0',
        searchTime: data.searchInformation?.searchTime || 0
      }
    };
  }
}
