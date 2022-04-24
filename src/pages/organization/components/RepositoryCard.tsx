import * as React from 'react';
import IF from './../../../components/IF';

const RepositoryCard: React.ForwardRefRenderFunction<HTMLDivElement, IRepositoryCardProps> = (props, ref) => {
  const {name, url, description, visibility, updatedTime,
    language, forksCount, openIssuesCount, stargazersCount, ...others} = props;
  return (
    <div ref={ref} {...others}>
      <h3>
        <a href={url} target='_blank' rel="noreferrer">
          {name}
        </a>
        <span
          style={{
            border: 'solid 2px cadetblue',
            borderRadius: '50%',
            marginLeft: '1rem',
            fontSize: '0.5rem',
          }}
        >
          {visibility}
        </span>
      </h3>
      <p>
        {description}
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <IF condition={language!==undefined}>{language}</IF>
        <div>forks: {forksCount}</div>
        <div>open issues: {openIssuesCount}</div>
        <div>stargazers: {stargazersCount}</div>
        <div>last update time: {updatedTime.toLocaleDateString()}</div>
      </div>
    </div>
  );
};

export default React.forwardRef(RepositoryCard);

export interface IRepositoryCardProps {
  name: string;
  url: string;
  description: string;
  visibility: string;
  updatedTime: Date;
  language?: string;
  forksCount: number;
  openIssuesCount: number;
  stargazersCount: number;
}
