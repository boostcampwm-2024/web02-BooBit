import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ type, name, placeholder, value, onChange }) => {
  return (
    <input
      className="w-[100%] h-[3.5rem] px-[2rem] mb-[1rem] border-[1px] border-border-default rounded-[5px] text-available-medium-16 text-text-light bg-surface-default"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;
