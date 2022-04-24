export interface IRepositoryData {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
  licenseName: string;
  updatedTime: Date;
  forksCount: number;
  openIssuesCount: number;
  stargazersCount: number;
  topics: Array<string>;
  visibility: string;
}
