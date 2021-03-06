

/**
 * Get github organization repository data.
 * API reference: https://docs.github.com/en/rest/repos/repos#list-organization-repositories
 * @param {string} orgName Organization name.
 * @param {IGetRepoParam} param API parameters.
 * @return {Promise<Response>}
 */
export async function getRepos(orgName: string, param?: IGetRepoParam): Promise<Response> {
  return await fetch(`https://api.github.com/orgs/${orgName}/repos?` + new URLSearchParams({
    ...param && param.type !== undefined ? {type: param.type} : {},
    ...param && param.sort !== undefined ? {sort: param.sort} : {},
    ...param && param.direction !== undefined ? {direction: param.direction} : {},
    ...param && param.perPage !== undefined ? {per_page: param.perPage.toString()} : {},
    ...param && param.page !== undefined ? {page: param.page.toString()} : {},
  }), {
    method: 'GET',
  });
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

export interface IGetReposResponseData extends Array<IRepoResponseData> {}

export interface IRepoResponseData {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean
  };
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  };
  allow_forking: boolean;
  is_template: boolean;
  topics: Array<string>;
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
}

export interface IGetReposErrorResponseData {
  documentation_url: string;
  message: string;
}
