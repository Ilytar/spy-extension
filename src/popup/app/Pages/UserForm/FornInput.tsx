import { TextField } from "@mui/material";
import { useState } from "react";

interface FormInputProps {
  initialValue?: string;
  id: string;
  label: string;
  type?: string;
  onChangeHandler: (id?: string, value?: string) => void;
}

export const FormInput = ({
  id,
  label,
  initialValue,
  type,
  onChangeHandler,
}: FormInputProps) => {
  const [value, setValue] = useState<string | undefined>(initialValue);

  const onChange = (value: string | undefined) => {
    onChangeHandler(id, value);
  };
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id={id}
      label={label}
      name={id}
      type={type}
      autoFocus
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={() => {
        onChange(value);
      }}
    />
  );
};
