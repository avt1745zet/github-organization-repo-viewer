import * as React from 'react';
import {useEffect, useState} from 'react';
import * as OrganizationAPI from './../../api/OrganizationAPI';
import RepositoryCardList from './components/RepositoryCardList';
import {IRepositoryData} from './../../interfaces/repository';
import IF from '../../components/IF';

const DEFAULT_SEARCH_ORG_NAME: string = 'github';
const PAGES_PER_LOAD: number = 20;

const Organization: React.FC = () => {
  const [repoListData, setRepoListData] = useState<Array<IRepositoryData>>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [orgName, setOrgName] = useState<string>(DEFAULT_SEARCH_ORG_NAME);
  const [searchString, setSearchString] = useState<string>(DEFAULT_SEARCH_ORG_NAME);
  const [repoType, setRepoType] = useState<string>(OrganizationAPI.RepoType.ALL);
  const [sortType, setSortType] = useState<string>(OrganizationAPI.SortType.CREATED);
  const [direction, setDirection] = useState<string>(OrganizationAPI.Direction.ASC);

  const [isDataFetching, setIsDataFetching] = useState<boolean>(false);
  const [isTryingLoodMore, setIsTryingLoodMore] = useState<boolean>(false);
  const [isOrgHasMoreRepo, setIsOrgHasMoreRepo] = useState<boolean>(true);

  /** Effect for load first page. */
  useEffect(()=>{
    // clear error message.
    setErrorMessage(undefined);
    const fetchData = async () => {
      setIsDataFetching(true);
      const response: Response = await OrganizationAPI.getRepos(orgName, {
        type: repoType,
        sort: sortType,
        direction: direction,
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
  }, [orgName, repoType, sortType, direction]);

  /** Effect for load more page. */
  useEffect(()=>{
    if (isTryingLoodMore) {
      if (isOrgHasMoreRepo &&!isDataFetching ) {
        const fetchData = async () => {
          setIsDataFetching(true);
          const response: Response = await OrganizationAPI.getRepos(orgName, {
            type: repoType,
            sort: sortType,
            direction: direction,
            perPage: PAGES_PER_LOAD,
            page: currentPage + 1,
          });
          setIsDataFetching(false);
          setIsTryingLoodMore(false);
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
        setIsTryingLoodMore(false);
      }
    }
  // Only fetch data when isTryingLoodMore changed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTryingLoodMore]);

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

  /** Effect for search organization. */
  useEffect(()=>{
    // Update org name after typing (delay 0.5s).
    const timer = setTimeout(()=>{
      setOrgName(searchString);
    }, 500);
    return ()=>{
      clearTimeout(timer);
    };
  }, [searchString]);

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setSearchString(e.target.value);
  };
  const handleRepoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRepoType(e.target.value);
  };
  const handleSortTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
  };
  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDirection(e.target.value);
  };
  const handleLastCardIntoScreen = () => {
    setIsTryingLoodMore(true);
  };

  return (
    <div>
      <form>
        <input value={searchString} onChange={handleSearchValueChange}></input>
        <select value={repoType} onChange={handleRepoTypeChange}>
          {
            Object.values(OrganizationAPI.RepoType).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
        <select value={sortType} onChange={handleSortTypeChange}>
          {
            Object.values(OrganizationAPI.SortType).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
        <select value={direction} onChange={handleDirectionChange}>
          {
            Object.values(OrganizationAPI.Direction).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
      </form>
      <div>
        <IF condition={repoListData!==undefined}>
          <RepositoryCardList repoListData={repoListData} onLastCardIntoScreen={handleLastCardIntoScreen}/>
        </IF>
        <IF condition={errorMessage!==undefined}>
          <h3>{errorMessage}</h3>
        </IF>
      </div>
    </div>
  );
};

export default Organization;
