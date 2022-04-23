

// eslint-disable-next-line require-jsdoc
export async function getRepos(orgName: string, param?: IGetRepoParam): Promise<any> {
  return await fetch(`https://api.github.com/orgs/${orgName}/repos?` + new URLSearchParams({
    ...param && param.type ? {type: param.type} : {},
    ...param && param.sort ? {sort: param.sort} : {},
    ...param && param.direction ? {direction: param.direction} : {},
    ...param && param.perPage ? {per_page: param.perPage.toString()} : {},
    ...param && param.page ? {page: param.page.toString()} : {},
  }));
}

export interface IGetRepoParam {
  type?: RepoType | string;
  sort?: SortType | string;
  direction?: Direction | string;
  perPage?: number;
  page?: number;
}

export enum RepoType {
  ALL = 'all',
  PUBLIC = 'public',
  PRIVATE = 'private',
  FORKS = 'forks',
  SOURCES = 'sources',
  MEMBER = 'member'
}

export enum SortType {
  CREATED = 'created',
  UPDATED = 'updated',
  PUSHED = 'pushed',
  FULL_NAME = 'full_name'
}

export enum Direction {
  ASC = 'asc',
  DESC = 'desc',
}
