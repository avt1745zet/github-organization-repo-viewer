import * as React from 'react';
import {FC} from 'react';

const RepositoryCard: FC<IRepositoryCardProps> = (props) => {
  const {name, url, description, ...others} = props;
  return (
    <div {...others}>
      <h3>
        <a href={url} >
          {name}
        </a>
      </h3>
      <p>
        {description}
      </p>
    </div>
  );
};

export default RepositoryCard;

export interface IRepositoryCardProps {
  name: string;
  url: string;
  description: string;
}
