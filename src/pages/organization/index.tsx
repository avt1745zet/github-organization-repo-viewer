import * as React from 'react';
import {useRef, useState} from 'react';
import {Direction, getRepos, RepoType, SortType} from './../../api/organization';

const Organization: React.FC = () => {
  const [repoData, setRepoData] = useState([]);
  const searchInput = useRef<HTMLInputElement>();
  const repoTypeSelect = useRef<HTMLSelectElement>();
  const sortTypeSelect = useRef<HTMLSelectElement>();
  const directionSelect = useRef<HTMLSelectElement>();

  const handleSearchButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const orgName: string = searchInput.current ? searchInput.current.value : '';
    getRepos(orgName, {
      type: repoTypeSelect.current.value,
      sort: sortTypeSelect.current.value,
      direction: directionSelect.current.value,
    }).then((response) => {
      return response.json();
    }).then((jsonData) => {
      setRepoData(jsonData);
      console.log(jsonData);
    });
  };
  return (
    <div>
      <form>
        <input ref={searchInput} defaultValue={'github'}></input>
        <select ref={repoTypeSelect}>
          {
            Object.values(RepoType).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
        <select ref={sortTypeSelect}>
          {
            Object.values(SortType).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
        <select ref={directionSelect}>
          {
            Object.values(Direction).map((value, index)=>(
              <option key={index} value={value}>{value}</option>
            ))
          }
        </select>
        <button onClick={handleSearchButtonClick}>Search</button>
      </form>
      {
        repoData.map((data, index) => (
          <div key={index}>
            <h3>
              <a href={data.html_url} >
                {data.name}
              </a>
            </h3>
            <p>
              {data.description}
            </p>
          </div>
        ))
      }
    </div>
  );
};

export default Organization;
