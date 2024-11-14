import bcrypt from "bcrypt";

const hashedPassword = function createHash(password:string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const compare = function compareHash(raw:string, hash:string) {
  return bcrypt.compareSync(raw, hash);
};

export { hashedPassword, compare };
