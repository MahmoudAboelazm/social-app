import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  textarea,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {!textarea ? (
        <Input {...field} {...props} />
      ) : (
        <Textarea {...field} {...props} />
      )}

      {error ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
};
