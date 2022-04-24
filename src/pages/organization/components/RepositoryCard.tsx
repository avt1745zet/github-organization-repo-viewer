import * as React from 'react';

const RepositoryCard: React.ForwardRefRenderFunction<HTMLDivElement, IRepositoryCardProps> = (props, ref) => {
  const {name, url, description, ...others} = props;
  return (
    <div ref={ref} {...others}>
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

export default React.forwardRef(RepositoryCard);

export interface IRepositoryCardProps {
  name: string;
  url: string;
  description: string;
}
