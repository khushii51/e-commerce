import joi from "joi";

export const registerValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
    role: joi.string().valid("admin", "customer"), 
  });
  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
    role: joi.string().valid("admin", "customer").required(),
  });
  return schema.validate(data);
};
