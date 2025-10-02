import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { GoogleSearchService } from './services/google-search.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [SearchController],
  providers: [GoogleSearchService, DatabaseService],
  exports: [GoogleSearchService],
})
export class SearchModule {}
