import * as React from 'react';
import {useEffect, useRef} from 'react';
import {IRepositoryData} from './../../../interfaces/repository';
import RepositoryCard from './RepositoryCard';

const RepositoryCardList: React.FC<IRepositoryCardListProps> = (props) => {
  const {repoListData, onLastCardIntoScreen} = props;
  const lastRepoCard = useRef<HTMLDivElement>();

  useEffect(()=>{
    if (onLastCardIntoScreen !== undefined ) {
      const observerOptions: IntersectionObserverInit = {
        threshold: 0,
      };

      const observerCallback: IntersectionObserverCallback = (entries)=>{
        entries.forEach((entrie)=>{
          if (entrie.isIntersecting) {
            onLastCardIntoScreen();
          }
        });
      };

      const observer: IntersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
      const lastRepoCardElement = lastRepoCard.current;
      if (lastRepoCardElement) {
        observer.observe(lastRepoCardElement);
      }

      return ()=>{
        if (lastRepoCardElement) {
          observer.unobserve(lastRepoCardElement);
        }
      };
    }
  }, [repoListData, onLastCardIntoScreen]);

  return (
    <div>
      {
        repoListData.map((data, index)=>(
          <RepositoryCard
            key={index}
            name={data.name}
            description={data.description}
            url={data.url}
            visibility={data.visibility}
            updatedTime={data.updatedTime}
            language={data.language}
            forksCount={data.forksCount}
            openIssuesCount={data.openIssuesCount}
            stargazersCount={data.stargazersCount}
            ref={lastRepoCard}
          />
        ))
      }
    </div>
  );
};

const areEqual = (prevProps: Readonly<IRepositoryCardListProps>, nextProps: Readonly<IRepositoryCardListProps>) => {
  if (prevProps.repoListData.length !== nextProps.repoListData.length) {
    return false;
  } else {
    for (let i: number = 0; i < prevProps.repoListData.length; i++) {
      if (prevProps.repoListData[i] !== nextProps.repoListData[i]) {
        return false;
      }
    }
    return true;
  }
};

export default React.memo(RepositoryCardList, areEqual);

export interface IRepositoryCardListProps {
    repoListData: Array<IRepositoryData>;
    onLastCardIntoScreen?(): void;
}
