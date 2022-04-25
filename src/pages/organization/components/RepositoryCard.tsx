import * as React from 'react';
import {Card, CardContent, Link} from '@mui/material';
import IF from './../../../components/IF';

const RepositoryCard: React.ForwardRefRenderFunction<HTMLDivElement, IRepositoryCardProps> = (props, ref) => {
  const {name, url, description, visibility, updatedTime,
    language, forksCount, openIssuesCount, stargazersCount} = props;
  return (
    <Card ref={ref} variant='outlined'>
      <CardContent>
        <h3>
          <Link href={url} target='_blank' rel="noreferrer">
            {name}
          </Link>
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
      </CardContent>
    </Card>
  );
};

const areEqual = (prevProps: Readonly<IRepositoryCardProps>, nextProps: Readonly<IRepositoryCardProps>) => {
  if (prevProps.id === nextProps.id) {
    return true;
  } else {
    return false;
  }
};

export default React.memo(React.forwardRef(RepositoryCard), areEqual);

export interface IRepositoryCardProps {
  id: number;
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
