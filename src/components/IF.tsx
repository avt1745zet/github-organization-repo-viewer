import * as React from 'react';

const IF: React.FC<IIFProps> = (props) => {
  const {condition, children} = props;
  let result: JSX.Element = null;
  if (condition) {
    result = (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }
  return result;
};

export default IF;

export interface IIFProps {
    condition: boolean;
    children?: React.ReactNode;
}
