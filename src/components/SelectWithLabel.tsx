import * as React from 'react';
import {FormControl, InputLabel, Select, MenuItem, SelectChangeEvent} from '@mui/material';

const SelectWithLabel: React.FC<ISelectWithLabelProps> = (props) => {
  const {options, currentOption, label, labelId, onOptionChange, style} = props;
  const handleSelectChange = (e: SelectChangeEvent) => {
    if (onOptionChange!==undefined) {
      onOptionChange(e.target.value);
    }
  };
  return (
    <FormControl style={style}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={currentOption}
        onChange={handleSelectChange}
      >
        {
          options.map((option, index)=>(
            <MenuItem key={index} value={option}>{option}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};

export default SelectWithLabel;

export interface ISelectWithLabelProps {
    options: Array<string>;
    currentOption: string;
    label: string;
    labelId: string;
    onOptionChange?(option: string): void;
    style?: React.CSSProperties;
}
