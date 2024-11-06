import React, { ChangeEvent } from 'react';
import InputField from '../../../shared/UI/InputFeild';

interface LabeledInputProps {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
}) => (
  <div className="w-[100%]">
    <div className="text-available-medium-16 text-text-light mb-[6px]">{label}</div>
    <InputField
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default LabeledInput;
