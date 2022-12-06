import { model, Schema, Model, Document, Types } from "mongoose";
import Post, { IPost } from "./Post";

const INTEREST_ARRAY_LENGTH: number = 5;
const FOLLOWING_ARRAY_LENGTH: number = 10;

// Interface
export interface IUser extends Document {
  email: string;
  password: string;
  following: string[];
  interests: string[];
  points: number;
  followers: number;
  favorite_posts: Types.ObjectId[];
  follow: (user: IUser) => void;
  not_interested: (post: IPost) => void;
  interact: (post: IPost, action: Actions, options?: Actions) => void;
  create_post: (text: string) => IPost;
}

export enum Actions {
  Downvote,
  Upvote,
  Favorite,
  Undo,
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
    favorite_posts: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    followers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (): Promise<void> {
  let points: number = 0;
  const posts = await Post.find({ author: this._id.toString() });

  posts.forEach((post) => {
    // add 5 points for every like
    // substract 5 points for every dislike
    // add 5 points for every favorite
    points +=
      (post.interacted[Actions.Upvote].length +
        post.interacted[Actions.Favorite].length) *
        5 -
      post.interacted[Actions.Downvote].length * 5;
  });
  // add 10 points for every follow
  points += this.followers * 10;

  this.points = points;
});

userSchema.methods.follow = async function (user: IUser): Promise<void> {
  try {
    user.followers += 1;
    await user.save();
    let following: Set<string> = new Set(this.following);
    if (following.has(user._id.toString())) {
      // O(1)
      following.delete(user._id.toString()); // If already following user, remove from the following array...
    }
    let temp: string[] = [...following]; // O(n)
    temp.unshift(user._id.toString()); // ...and add them to the beginning // O(n)

    if (temp.length > FOLLOWING_ARRAY_LENGTH) {
      let id = temp.pop(); // No longer intersted in the last following... remove them (first in first out)  // O(1)
      const author = await this.model("User").findById(id);
      author.followers -= 1;
      await author.save();
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
      if (post.main_word) {
        let interests: Set<string> = new Set(this.interests);
        if (interests.has(post.main_word)) {
          interests.delete(post.main_word);
        }
        let temp: string[] = [...interests];
        temp.unshift(post.main_word);
        if (temp.length > INTEREST_ARRAY_LENGTH) {
          temp.pop();
        }
        this.interests = temp;
      }
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
  action: Actions,
  options?: Actions
): Promise<void> {
  try {
    const author = await this.model("User").findById(post.author);

    switch (
      +action // Conversion from string to numbers https://stackoverflow.com/questions/27747437/typescript-enum-switch-not-working
    ) {
      case Actions.Downvote:
        for (let i = 0; i < post.interacted[Actions.Downvote].length; i++) {
          if (post.interacted[Actions.Downvote][i] == this._id.toString()) {
            return;
          }
        }
        post.interacted = [
          [...post.interacted[Actions.Downvote], this._id.toString()],
          [
            ...post.interacted[Actions.Upvote].filter(
              (user) => user != this._id.toString()
            ),
          ],
          [...post.interacted[Actions.Favorite]],
        ];
        break;
      case Actions.Upvote:
        for (let i = 0; i < post.interacted[Actions.Upvote].length; i++) {
          if (post.interacted[Actions.Upvote][i] == this._id.toString()) {
            return;
          }
        }
        post.interacted = [
          [
            ...post.interacted[Actions.Downvote].filter(
              (user) => user != this._id.toString()
            ),
          ],
          [...post.interacted[Actions.Upvote], this._id.toString()],
          [...post.interacted[Actions.Favorite]],
        ];
        if (post.main_word) {
          let interests: Set<string> = new Set(this.interests);
          if (interests.has(post.main_word)) {
            interests.delete(post.main_word);
          }
          let temp: string[] = [...interests];
          temp.unshift(post.main_word);
          if (temp.length > INTEREST_ARRAY_LENGTH) {
            temp.pop();
          }
          this.interests = temp;
        }
        break;
      case Actions.Favorite:
        let added_to_favorites: boolean = false;
        if (
          this.favorite_posts.length < post.interacted[Actions.Favorite].length
        ) {
          user_loop: for (let i = 0; i < this.favorite_posts.length; i++) {
            if (post._id.toString() == this.favorite_posts[i]) {
              added_to_favorites = true;
              break user_loop;
            }
          }
        } else {
          post_loop: for (
            let i = 0;
            i < post.interacted[Actions.Favorite].length;
            i++
          ) {
            if (post.interacted[Actions.Favorite][i] == this._id.toString()) {
              added_to_favorites = true;
              break post_loop;
            }
          }
        }
        if (added_to_favorites) {
          break;
        }

        this.favorite_posts = [...this.favorite_posts, post._id.toString()];
        post.interacted = [
          [...post.interacted[Actions.Downvote]],
          [...post.interacted[Actions.Upvote]],
          [...post.interacted[Actions.Favorite], this._id.toString()],
        ];

        break;
      case Actions.Undo:
        // Remove like/dislike/favorite
        if (options === Actions.Favorite) {
          post.interacted = [
            [...post.interacted[Actions.Downvote]],
            [...post.interacted[Actions.Upvote]],
            [
              ...post.interacted[Actions.Favorite].filter(
                (user) => user.toString() != this._id.toString()
              ),
            ],
          ];
          for (let i = 0; i < this.favorite_posts.length; i++) {
            if (this.favorite_posts[i] == post._id.toString()) {
              this.favorite_posts.splice(i, 1);
            }
          }
        } else {
          post.interacted = [
            [
              ...post.interacted[Actions.Downvote].filter(
                (user) => user != this._id.toString()
              ),
            ],
            [
              ...post.interacted[Actions.Upvote].filter(
                (user) => user != this._id.toString()
              ),
            ],
            [...post.interacted[Actions.Favorite]],
          ];
        }

        break;
    }

    post.likes =
      post.interacted[Actions.Upvote].length -
      post.interacted[Actions.Downvote].length;
    post.favorites = post.interacted[Actions.Favorite].length;
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
