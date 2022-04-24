import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import * as OrganizationAPI from './../../api/OrganizationAPI';
import RepositoryCard, {IRepositoryCardProps} from './components/RepositoryCard';

const PAGES_PER_LOAD: number = 20;

const Organization: React.FC = () => {
  const [repoData, setRepoData] = useState<Array<IRepositoryCardProps>>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orgName, setOrgName] = useState<string>('github');

  const [searchString, setSearchString] = useState('github');
  const [repoType, setRepoType] = useState<string>(OrganizationAPI.RepoType.ALL);
  const [sortType, setSortType] = useState<string>(OrganizationAPI.SortType.CREATED);
  const [direction, setDirection] = useState<string>(OrganizationAPI.Direction.ASC);

  const lastRepoCard = useRef<HTMLDivElement>();

  useEffect(()=>{
    setRepoData([]);
    setCurrentPage(0);

    const fetchData = async () => {
      const response: Response = await OrganizationAPI.getRepos(orgName, {
        type: repoType,
        sort: sortType,
        direction: direction,
        perPage: PAGES_PER_LOAD,
        page: 1,
      });
      if (response.ok) {
        const jsonData: any = await response.json();
        processResponseData([], jsonData);
      } else {
        processResponseData([], []);
      }
    };
    fetchData();
  }, [orgName, repoType, sortType, direction]);


  const observerOptions: IntersectionObserverInit = {
    threshold: 0,
  };

  const [hasMoreRepo, setHasMoreRepo] = useState<boolean>(true);

  const processResponseData =
  (lastData: Array<IRepositoryCardProps>, responseData: OrganizationAPI.IGetReposResponseData) => {
    setCurrentPage(currentPage + 1);

    const repoDataList: Array<IRepositoryCardProps> = responseData.map((data)=>({
      name: data.name,
      description: data.description,
      url: data.html_url,
    }));
    setRepoData([...lastData, ...repoDataList]);
    console.log(responseData);

    if (responseData.length < PAGES_PER_LOAD || responseData.length === 0) {
      setHasMoreRepo(false);
    } else {
      setHasMoreRepo(true);
    }
  };

  const observerCallback: IntersectionObserverCallback = (entries, observer)=>{
    entries.forEach((entrie)=>{
      if (entrie.isIntersecting) {
        const fetchData = async () => {
          const response: Response = await OrganizationAPI.getRepos(orgName, {
            type: repoType,
            sort: sortType,
            direction: direction,
            perPage: PAGES_PER_LOAD,
            page: currentPage + 1,
          });
          const jsonData: any = await response.json();
          processResponseData(repoData, jsonData);
        };
        fetchData();
        observer.unobserve(lastRepoCard.current);
      }
    });
  };

  useEffect(()=>{
    if (hasMoreRepo) {
      const observer: IntersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
      if (lastRepoCard.current) {
        observer.observe(lastRepoCard.current);
      }
    }
  }, [repoData]);

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setSearchString(e.target.value);
  };

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setOrgName(searchString);
    }, 500);
    return ()=>{
      clearTimeout(timer);
    };
  }, [searchString]);

  const handleRepoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRepoType(e.target.value);
  };

  const handleSortTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDirection(e.target.value);
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
        {
          repoData.map((data, index)=>(
            <RepositoryCard
              name={data.name}
              description={data.description}
              url={data.url}
              key={index}
              ref={lastRepoCard}
            />
          ))
        }
      </div>
    </div>
  );
};

export default Organization;
