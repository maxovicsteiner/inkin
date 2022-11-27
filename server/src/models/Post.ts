import { model, Schema, Model, Document, Types } from "mongoose";
import { merge_sort, find_main_word } from "../utils";

export interface IPost extends Document {
  author: Types.ObjectId;
  text: string;
  main_word: string | null;
  likes: number;
  interacted: Types.ObjectId[][];
  configured: boolean;
}

// this is temporary - Load from https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt
enum Interest {
  Suicide,
  Ed,
  Sh,
  Bipolar,
  Disorder,
  Eating,
  Crisis,
}

const postSchema: Schema<IPost, Model<IPost>> = new Schema<IPost, Model<IPost>>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    main_word: {
      type: String,
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
    interacted: {
      type: [[Schema.Types.ObjectId]],
      default: [[], []],
    },
    configured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

postSchema.pre("save", function () {
  if (this.configured) return;
  let array: string[] = this.text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(" ");
  merge_sort(array);
  const map = new Map<string, number>([]);
  for (let i = 0; i < Object.keys(Interest).length; i++) {
    let current_target = Object.keys(Interest)[i].toLowerCase();
    let result: [string, number] = find_main_word(array, current_target);
    if (result[1] > 0) {
      map.set(...result);
    }
  }
  let theme: string | null = null;
  let occurrences = 0;
  map.forEach((value, key) => {
    if (value >= occurrences) {
      theme = key;
      occurrences = value;
    }
  });
  this.main_word = theme;
  this.configured = true;
});

const Post: Model<IPost> = model("Post", postSchema);
export default Post;
