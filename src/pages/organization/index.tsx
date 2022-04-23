import * as React from 'react';
import {useRef, useState} from 'react';
import * as OrganizationAPI from './../../api/OrganizationAPI';

const Organization: React.FC = () => {
  const [repoData, setRepoData] = useState<Array<IRepoData>>([]);
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
    }).then((response) => {
      return response.json();
    }).then((responseJson) => {
      const responseData: OrganizationAPI.IGetReposResponseData =
       responseJson as OrganizationAPI.IGetReposResponseData;

      const repoDataList: Array<IRepoData> = responseData.map((data)=>({
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
      {
        repoData.map((data, index) => {
          const ele = (
            <div key={index}>
              <h3>
                <a href={data.url} >
                  {data.name}
                </a>
              </h3>
              <p>
                {data.description}
              </p>
            </div>
          );
          return ele;
        })
      }
    </div>
  );
};

export default Organization;

interface IRepoData {
  name: string;
  url: string;
  description: string;
}
