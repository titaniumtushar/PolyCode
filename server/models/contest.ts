import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interfaces for the schema
interface IMeta {
  contest_name?: string;
  invitation_code?: string;
  question_set?: mongoose.Schema.Types.Mixed[];
  contest_type?: string;
  prize_distribution?: mongoose.Schema.Types.Mixed;
  active?: boolean;
  community_id?: string;
  start_time?: number;
  end_time?: number;
  happened?: boolean;
  _id?:boolean;
  description?:string;
}

interface IContest extends Document {
  meta: IMeta;
  rankings: mongoose.Schema.Types.Mixed[];
  submissions: mongoose.Schema.Types.Mixed[];
  start_time:Number;
  end_time:Number;
}

// Define the Meta Schema
const metaSchema = new Schema<IMeta>({
  contest_name: {
    type: String,
  },
  invitation_code: {
    type: String,

  },
  question_set: {
    type: [Schema.Types.Mixed],
    required:true
  },
  prize_distribution: {
    type:[Number],
    default:[],
  },
  community_id: {
    type: String,
  },
  start_time: {
    type: Number,
    required:true
  },
  end_time: {
    type: Number,
    required:true
  },
  description:{
    type:String,
    default:""

  },
  _id:false
  
  
  
});

// Define the Contest Schema
const contestSchema = new Schema<IContest>({
  meta: {
    type: metaSchema,
  },
  rankings: {
    type: [Schema.Types.Mixed],
    default: [],
  },
  submissions: {
    type: [Schema.Types.Mixed],
    default: [],
  },
  start_time: {
    type: Number,
    required:true
  },
  end_time: {
    type: Number,
    required:true
  },

});

// Create and export the Contest Model
const contestModel: Model<IContest> = mongoose.model<IContest>("contests", contestSchema);
export { contestModel, IContest, IMeta };
