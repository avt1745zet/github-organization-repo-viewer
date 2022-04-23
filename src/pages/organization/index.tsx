import * as React from 'react';
import {useRef, useState} from 'react';
import * as OrganizationAPI from './../../api/OrganizationAPI';
import RepositoryCard, {IRepositoryCardProps} from './components/RepositoryCard';

const PAGES_PER_LOAD: number = 10;

const Organization: React.FC = () => {
  const [repoData, setRepoData] = useState<Array<IRepositoryCardProps>>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const searchInput = useRef<HTMLInputElement>();
  const repoTypeSelect = useRef<HTMLSelectElement>();
  const sortTypeSelect = useRef<HTMLSelectElement>();
  const directionSelect = useRef<HTMLSelectElement>();

  const handleSearchButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const orgName: string = searchInput.current ? searchInput.current.value : '';
    OrganizationAPI.getRepos(orgName, {
      type: repoTypeSelect.current.value,
      sort: sortTypeSelect.current.value,
      direction: directionSelect.current.value,
      perPage: PAGES_PER_LOAD,
      page: currentPage + 1,
    }).then((response) => {
      return response.json();
    }).then((responseJson) => {
      const responseData: OrganizationAPI.IGetReposResponseData =
       responseJson as OrganizationAPI.IGetReposResponseData;

      setCurrentPage(currentPage + 1);

      const repoDataList: Array<IRepositoryCardProps> = responseData.map((data)=>({
        name: data.name,
        description: data.description,
        url: data.html_url,
      }));
      setRepoData(repoDataList);
      console.log(responseData);
    });
  };

  return (
    <div>
      <form>
        <input ref={searchInput} defaultValue={'github'}></input>
        <select ref={repoTypeSelect}>
          {
            Object.values(OrganizationAPI.RepoType).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
        <select ref={sortTypeSelect}>
          {
            Object.values(OrganizationAPI.SortType).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
        <select ref={directionSelect}>
          {
            Object.values(OrganizationAPI.Direction).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
        <button onClick={handleSearchButtonClick}>Search</button>
      </form>
      <div>
        {
          repoData.map((data, index) => (
            <RepositoryCard name={data.name} description={data.description} url={data.url} key={index}/>
          ))
        }
      </div>
    </div>
  );
};

export default Organization;
