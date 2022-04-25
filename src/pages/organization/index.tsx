import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {CircularProgress, Container, TextField, Typography} from '@mui/material';
import * as OrganizationAPI from './../../api/OrganizationAPI';
import {IRepositoryData} from './../../interfaces/repository';
import IF from './../../components/IF';
import SelectWithLabel from './../../components/SelectWithLabel';
import RepositoryCardList from './components/RepositoryCardList';

const DEFAULT_SEARCH_ORG_NAME: string = 'github';
const PAGES_PER_LOAD: number = 20;

interface ISearchQueryData {
  orgName?: string;
  repoType?: string;
  sortType?: string;
  direction?: string;
}

const Organization: React.FC = () => {
  const [repoListData, setRepoListData] = useState<Array<IRepositoryData>>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState<ISearchQueryData>({
    orgName: DEFAULT_SEARCH_ORG_NAME,
    repoType: OrganizationAPI.RepoType.ALL,
    sortType: OrganizationAPI.SortType.CREATED,
    direction: OrganizationAPI.Direction.ASC,
  });

  const [isDataFetching, setIsDataFetching] = useState<boolean>(false);
  const [isTryingLoadMore, setIsTryingLoadMore] = useState<boolean>(false);
  const [isOrgHasMoreRepo, setIsOrgHasMoreRepo] = useState<boolean>(true);

  /** Effect for load first page. */
  useEffect(()=>{
    // clear error message and reset repo list.
    setErrorMessage(undefined);
    setRepoListData(undefined);
    const fetchData = async () => {
      setIsDataFetching(true);
      const response: Response = await OrganizationAPI.getRepos(searchQuery.orgName, {
        type: searchQuery.repoType,
        sort: searchQuery.sortType,
        direction: searchQuery.direction,
        perPage: PAGES_PER_LOAD,
        page: 1,
      });
      setIsDataFetching(false);
      if (response.ok) {
        const jsonData: OrganizationAPI.IGetReposResponseData = await response.json();
        setCurrentPage(1);
        const formatData: Array<IRepositoryData> = getFormatGetRepoAPIResponse(jsonData);
        setRepoListData(formatData);
        if (formatData.length < PAGES_PER_LOAD || formatData.length === 0) {
          setIsOrgHasMoreRepo(false);
        } else {
          setIsOrgHasMoreRepo(true);
        }
      } else {
        const jsonData: OrganizationAPI.IGetReposErrorResponseData = await response.json();
        setErrorMessage(jsonData.message);
        setRepoListData(undefined);
      }
    };
    fetchData();
  }, [searchQuery]);

  /** Effect for load more page. */
  useEffect(()=>{
    if (isTryingLoadMore) {
      if (isOrgHasMoreRepo &&!isDataFetching ) {
        const fetchData = async () => {
          setIsDataFetching(true);
          const response: Response = await OrganizationAPI.getRepos(searchQuery.orgName, {
            type: searchQuery.repoType,
            sort: searchQuery.sortType,
            direction: searchQuery.direction,
            perPage: PAGES_PER_LOAD,
            page: currentPage + 1,
          });
          setIsDataFetching(false);
          setIsTryingLoadMore(false);
          if (response.ok) {
            const jsonData: any = await response.json();
            setCurrentPage(currentPage + 1);
            const formatData: Array<IRepositoryData> = getFormatGetRepoAPIResponse(jsonData);
            setRepoListData([...repoListData, ...formatData]);
            if (formatData.length < PAGES_PER_LOAD || formatData.length === 0) {
              setIsOrgHasMoreRepo(false);
            } else {
              setIsOrgHasMoreRepo(true);
            }
          } else {
            const jsonData: OrganizationAPI.IGetReposErrorResponseData = await response.json();
            setErrorMessage(jsonData.message);
          }
        };
        fetchData();
      } else {
        setIsTryingLoadMore(false);
      }
    }
  // Only fetch data when isTryingLoodMore changed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTryingLoadMore]);

  const getFormatGetRepoAPIResponse = (responseData: OrganizationAPI.IGetReposResponseData) => {
    console.log(responseData);
    return responseData.map((data)=>({
      id: data.id,
      name: data.name,
      description: data.description,
      url: data.html_url,
      language: data.language?data.language: undefined,
      licenseName: data.license?data.license.name: undefined,
      updatedTime: new Date(data.updated_at),
      forksCount: data.forks_count,
      openIssuesCount: data.open_issues_count,
      stargazersCount: data.stargazers_count,
      topics: data.topics,
      visibility: data.visibility,
    } as IRepositoryData));
  };

  const handleSearchFormDataChange = useCallback((data: ISearchQueryData)=>{
    setSearchQuery({
      ...searchQuery,
      ...data,
    });
  }, [searchQuery]);

  const handleOrgNameChange = useCallback((value: string)=>{
    handleSearchFormDataChange({orgName: value});
  }, [handleSearchFormDataChange]);

  const handleRepoTypeChange = useCallback((value: string)=>{
    handleSearchFormDataChange({repoType: value});
  }, [handleSearchFormDataChange]);

  const handleSortTypeChange = useCallback((value: string)=>{
    handleSearchFormDataChange({sortType: value});
  }, [handleSearchFormDataChange]);

  const handleDirectionChange = useCallback((value: string)=>{
    handleSearchFormDataChange({direction: value});
  }, [handleSearchFormDataChange]);

  const handleLastCardIntoScreen = () => {
    setIsTryingLoadMore(true);
  };

  return (
    <Container>
      <div>
        <Typography variant='h3'>
            github-organization-repo-viewer
        </Typography>
      </div>
      <SearchForm
        orgName={searchQuery.orgName}
        repoType={searchQuery.repoType}
        sortType={searchQuery.sortType}
        direction={searchQuery.direction}
        onOrgNameChange={handleOrgNameChange}
        onRepoTypeChange={handleRepoTypeChange}
        onSortTypeChange={handleSortTypeChange}
        onDirectionChange={handleDirectionChange}
      />
      <div>
        <IF condition={repoListData!==undefined}>
          <RepositoryCardList repoListData={repoListData} onLastCardIntoScreen={handleLastCardIntoScreen}/>
        </IF>
        {/** If has errorMessage, show it on screen. */}
        <IF condition={errorMessage!==undefined}>
          <Typography variant='h5'>
            {errorMessage}
          </Typography>
        </IF>
        {/** If has repoListData and no more data need fetch, show the following message. */}
        <IF condition={repoListData&&repoListData.length>0&&!isOrgHasMoreRepo}>
          <Typography variant='h5'>
              All matched repositories are here.
          </Typography>
        </IF>
        {/** Space for loading progress */}
        <div style={{
          height: '50px',
        }}>
          <IF condition={isDataFetching}>
            <CircularProgress/>
          </IF>
        </div>
      </div>
    </Container>
  );
};

export default Organization;

const SearchForm: React.FC<ISearchFormProps> = (props) => {
  const [searchQuery, setSearchString] = useState<string>(DEFAULT_SEARCH_ORG_NAME);

  const {orgName, repoType, sortType, direction,
    onOrgNameChange, onRepoTypeChange, onSortTypeChange, onDirectionChange} = props;

  /** Effect for update org name. */
  useEffect(()=>{
    // Update org name after typing (delay 0.5s).
    const timer = setTimeout(()=>{
      if (orgName !== searchQuery) {
        onOrgNameChange(searchQuery);
      }
    }, 500);
    return ()=>{
      clearTimeout(timer);
    };
  // Only update org name when searchQuery changed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setSearchString(e.target.value);
  };
  const handleRepoTypeChange = useCallback((option: string) => {
    onRepoTypeChange(option);
  }, [onRepoTypeChange]);
  const handleSortTypeChange = useCallback((option: string) => {
    onSortTypeChange(option);
  }, [onSortTypeChange]);
  const handleDirectionChange = useCallback((option: string) => {
    onDirectionChange(option);
  }, [onDirectionChange]);

  return (
    <form style={{
      marginBlock: '12px',
    }}>
      <TextField value={searchQuery} onChange={handleSearchValueChange} label='Organization name'/>
      <SelectWithLabel
        options={Object.values(OrganizationAPI.RepoType)}
        currentOption={repoType}
        label='Type'
        labelId={'type-select-label'}
        onOptionChange={handleRepoTypeChange}
        style={{
          minWidth: '120px',
        }}
      />
      <SelectWithLabel
        options={Object.values(OrganizationAPI.SortType)}
        currentOption={sortType}
        label='Sort'
        labelId={'sort-select-label'}
        onOptionChange={handleSortTypeChange}
        style={{
          minWidth: '120px',
        }}
      />
      <SelectWithLabel
        options={Object.values(OrganizationAPI.Direction)}
        currentOption={direction}
        label='Direction'
        labelId={'direction-select-label'}
        onOptionChange={handleDirectionChange}
        style={{
          minWidth: '120px',
        }}
      />
    </form>
  );
};

interface ISearchFormProps {
  orgName: string;
  repoType: string;
  sortType: string;
  direction: string;
  onOrgNameChange(value: string): void;
  onRepoTypeChange(value: string): void;
  onSortTypeChange(value: string): void;
  onDirectionChange(value: string): void;
}
