import { NearBindgen, near, call, view, UnorderedMap, Vector } from 'near-sdk-js';

class Post {
  id: string
  title: string
  description: string
  tags: Vector<string>
  image: string
  likedBy: string[]
  authorId?: string

  constructor(id: string, title: string, description: string, tags: Vector<string>, image: string) {
    this.id = id,
    this.title = title,
    this.description = description,
    this.tags = tags,
    this.image = image,
    this.likedBy = [],
    this.authorId = near.predecessorAccountId()
  }
}

@NearBindgen({})
class NearBlog {
  posts: UnorderedMap<Post>;
  numberOfPosts: number;
  likeByUserId: UnorderedMap<Post[]>;
  postsByTag: UnorderedMap<Post[]>;

  constructor() {
    this.posts = new UnorderedMap<Post>("p");
    this.numberOfPosts = 0;
    this.likeByUserId = new UnorderedMap("l");
    this.postsByTag = new UnorderedMap("t")
  }

  @call({})
  createPost({ title, description, tags, image }): Post {
    tags = tags.split(",")
    const id = this.numberOfPosts.toString();
    const post = new Post(id, title, description, tags, image);

    this.posts.set(id, post);
    this.numberOfPosts++;

    for(let i = 0; i < tags.length; i++) {
      let tag = tags[i];
      let postsForTag = [];

      if(this.postsByTag.get(tag) === null) {
        postsForTag = []
      } else {
        postsForTag = this.postsByTag.get(tag)
      } 
      postsForTag.push(post)
      this.postsByTag.set(tag, postsForTag)
    }

    return post; 
  }

  @view({})
  getAllPosts() {
    return this.posts.toArray()
  }

  @call({}) 
  likePost({ postId }): Post | null {
    const post = this.posts.get(postId.toString());
    const senderId = near.predecessorAccountId();

    if(!post) return null

    if(post.likedBy.includes(senderId)) return post

    post.likedBy.push(senderId);
    this.posts.set(postId, post);

    let likes = this.likeByUserId.get(senderId) || [];
    likes.push(post);
    this.likeByUserId.set(senderId, likes);

    return post
  }

  @call({})
  getLikePosts(): Post[] {
    const senderId = near.predecessorAccountId();

    return this.likeByUserId.get(senderId) || [];
  }

  @view({})
  getPostsByTag({ tag }): Post[] {
    return this.postsByTag.get(tag)
  }
}