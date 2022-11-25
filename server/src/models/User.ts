import { model, Schema, Model, Document } from "mongoose";
import Post, { IPost } from "./Post";

// Interface
export interface IUser extends Document {
  email: string;
  password: string;
  following: string[];
  interests: string[];
  points: number;
  follow: (user: IUser) => void;
  not_interested: (post: IPost) => void;
  interact: (post: IPost, action: Actions) => void;
  create_post: (text: string) => IPost;
}

export enum Actions {
  Upvote,
  Downvote,
}

const userSchema: Schema<IUser, Model<IUser>> = new Schema<IUser, Model<IUser>>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.methods.follow = async function (user: IUser): Promise<void> {
  try {
    user.points += 10;
    await user.save();
    let following: Set<string> = new Set(this.following);
    if (following.has(user._id.toString())) {
      // O(1)
      following.delete(user._id.toString()); // If already following user, remove from the following array...
    }
    let temp: string[] = [...following]; // O(n)
    temp.unshift(user._id.toString()); // ...and add them to the beginning // O(n)

    if (temp.length > 10) {
      temp.pop(); // No longer intersted in the last following... remove them (first in first out)  // O(1)
    }
    this.following = temp;
    await this.save();
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.create_post = async function (
  text: string
): Promise<IPost | unknown> {
  try {
    const post = await Post.create({ author: this._id, text });
    if (post) {
      this.points += 20;
      await this.save();
      return post;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

userSchema.methods.interact = async function (
  post: IPost,
  action: Actions
): Promise<void> {
  try {
    const author = await this.model("User").findById(post.author);
    if (action === Actions.Downvote) {
      post.likes--;
      author.points -= 5;
    } else if (action === Actions.Upvote) {
      post.likes++;
      author.points += 5;
      if (post.main_word) {
        let interests: Set<string> = new Set(this.interests);
        if (interests.has(post.main_word)) {
          interests.delete(post.main_word);
        }
        let temp: string[] = [...interests];
        temp.unshift(post.main_word);
        if (temp.length > 5) {
          temp.pop();
        }
        this.interests = temp;
      }
    }
    await post.save();
    await author.save();
    await this.save();
  } catch (error: any) {
    console.log(error.message);
  }
};

userSchema.methods.not_interested = async function (
  post: IPost
): Promise<void> {
  try {
    if (post.main_word) {
      let interests: Set<string> = new Set(this.interests);
      let following: Set<string> = new Set(this.following);
      if (interests.has(post.main_word)) {
        interests.delete(post.main_word);
      }
      if (following.has(post.author.toString())) {
        following.delete(post.author.toString());
      }

      let temp1: string[] = [...interests];
      let temp2: string[] = [...following];
      this.interests = temp1;
      this.following = temp2;
      await this.save();
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

const User: Model<IUser> = model("User", userSchema);
export default User;
