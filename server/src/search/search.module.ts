import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { GoogleSearchService } from './services/google-search.service';

@Module({
  controllers: [SearchController],
  providers: [GoogleSearchService],
  exports: [GoogleSearchService],
})
export class SearchModule {}
