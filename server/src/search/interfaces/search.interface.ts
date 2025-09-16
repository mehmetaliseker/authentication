export interface ISearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export interface ISearchResponse {
  items: ISearchResult[];
  searchInformation: {
    totalResults: string;
    searchTime: number;
  };
}

export interface ISearchService {
  search(query: string): Promise<ISearchResponse>;
}
