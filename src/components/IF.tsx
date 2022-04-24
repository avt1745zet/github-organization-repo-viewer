import * as React from 'react';

const IF: React.FC<IIFProps> = (props) => {
  const {condition, elseComponent, children} = props;
  if (condition) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  } else {
    return elseComponent && (
      <React.Fragment>
        {elseComponent}
      </React.Fragment>
    );
  }
};

export default IF;

export interface IIFProps {
    condition: boolean;
    elseComponent?: React.ReactNode;
    children?: React.ReactNode;
}
