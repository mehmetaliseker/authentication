import { Injectable } from '@nestjs/common';
import { ISearchService, ISearchResponse } from '../interfaces/search.interface';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class GoogleSearchService implements ISearchService {
  private readonly apiKey: string;
  private readonly searchEngineId: string;
  private readonly baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor(private readonly databaseService: DatabaseService) {
    const apiKey = process.env.SEARCH_ENGINE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      throw new Error('Google Search API yapılandırması eksik. Lütfen .env dosyasında SEARCH_ENGINE_API_KEY ve GOOGLE_SEARCH_ENGINE_ID değerlerini ayarlayın.');
    }

    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
    
    console.log('Google Search servisi başarıyla yapılandırıldı');
  }

  public async search(query: string, userId?: number, ipAddress?: string, userAgent?: string): Promise<ISearchResponse> {
    try {
      console.log('Search başlatıldı:', { query, userId, ipAddress, userAgent });
      
      const url = this.buildSearchUrl(query);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      let response: Response | null = null;
      try {
        response = await fetch(url, { signal: controller.signal });
      } catch (err) {
        console.warn('Google fetch başarısız, DuckDuckGo fallback deneniyor...', err);
      } finally {
        clearTimeout(timeout);
      }

      if (!response || !response.ok) {
        // DuckDuckGo Instant Answer API fallback (JSON)
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
        const ddgResp = await fetch(ddgUrl);
        if (!ddgResp.ok) {
          throw new Error(`Google Search API error: ${response?.status} ${response?.statusText}`);
        }
        const ddgData = await ddgResp.json();
        const items = (ddgData.RelatedTopics || []).slice(0, 10).map((t: any) => ({
          title: t.Text || t.Result || 'Sonuç',
          link: t.FirstURL || '#',
          snippet: t.Text || '',
          displayLink: t.FirstURL ? new URL(t.FirstURL).hostname : 'Bağlantı Bulunamadı'
        }));
        const searchResponse: ISearchResponse = {
          items,
          searchInformation: {
            totalResults: String(items.length),
            searchTime: 0
          }
        };
        if (userId) {
          await this.saveSearchHistory(userId, query, items.length, ipAddress, userAgent);
        }
        return searchResponse;
      }
      
      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const searchResponse = this.formatResponse(data);
      
      console.log('Search response alındı:', { itemsCount: searchResponse.items.length });
      
      // Search history'yi kaydet
      if (userId) {
        console.log('Search history kaydedilecek:', { userId, query, resultsCount: searchResponse.items.length, ipAddress, userAgent });
        await this.saveSearchHistory(userId, query, searchResponse.items.length, ipAddress, userAgent);
      } else {
        console.log('Search history kaydedilmedi - userId yok');
      }
      
      return searchResponse;
    } catch (error) {
      console.error('Google Search API error:', error);
      
      const message = (error as Error).message || '';
      if (message.includes('API key')) {
        throw new Error('Google API key hatası. Lütfen API key\'inizi kontrol edin.');
      }
      if (message.includes('quota')) {
        throw new Error('Google API kullanım kotası aşıldı. Lütfen daha sonra tekrar deneyin.');
      }
      if (message.includes('network') || message.includes('fetch') || message.includes('aborted')) {
        // Ağ hatasında daha açıklayıcı mesaj ver ve 503 yüzeyi için iletilebilir kıl
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

  private async saveSearchHistory(
    userId: number, 
    query: string, 
    resultsCount: number, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<void> {
    try {
      console.log('Search history kaydediliyor:', { userId, query, resultsCount, ipAddress, userAgent });
      
      // Önce tabloyu kontrol et
      const checkSql = `SELECT column_name FROM information_schema.columns WHERE table_name = 'search_history'`;
      const checkResult = await this.databaseService.query(checkSql);
      console.log('Tablo kolonları:', checkResult.rows);
      
      const sql = `
        INSERT INTO search_history (user_id, user_name, search_query)
        VALUES ($1, $2, $3)
      `;
      
      const result = await this.databaseService.query(sql, [userId, 'Anonymous', query]);
      console.log('Search history kaydedildi:', result);
    } catch (error) {
      console.error('Search history kaydetme hatası:', error);
    }
  }
}
