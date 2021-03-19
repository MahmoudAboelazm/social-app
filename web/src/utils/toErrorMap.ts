import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  const error: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    error[field] = message;
  });
  return error;
};
