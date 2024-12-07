import { ObjectId } from "mongodb";

function stringToObjectId(string:string) {
  if (ObjectId.isValid(string)) {
    return new ObjectId(string);
  } else {
    throw new Error('Invalid ObjectId string');
  }
}

export {stringToObjectId};