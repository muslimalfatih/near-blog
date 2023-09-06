import React, { useState } from 'react';

export function SignInPrompt({greeting, onClick}) {
  return (
    <main>
      <h1>
        Near Blog
      </h1>
      <br/>
      <p style={{ textAlign: 'center' }}>
        <button onClick={onClick}>Sign in with NEAR Wallet</button>
      </p>
    </main>
  );
}

export function SignOutButton({accountId, onClick}) {
  return (
    <button style={{ float: 'right' }} onClick={onClick}>
      Sign out {accountId}
    </button>
  );
} 

export function Posts({ posts, likePost }) {
  return (
    <>
      <h2>All Posts</h2>
      {
        posts ? posts.map((post, index) => {
          return (
            <Post post={post} key={index} likePost={likePost}/>
          ) 
        }) : "No Post" 
      }
    </>
  )
}

export function Post({ post, likePost }) {
  const { id, title, description, image, authorId, tags, likedBy } = post[1]


  return (
    <> 
      <h3>{title}</h3>
      <p>{description}</p>
      <img src={image} alt={title}/>
      <p>Post by: { authorId }</p>
      {
        tags ? tags.map((tag, idx) => {
          return (
            <p key={idx}>#{tag}</p>
          )
        }) : ""
      }
      <p>Liked By:</p> 
      {
        likedBy ? likedBy.map((like, idx) => {
          return (
            <span>{like}</span>
          )
        }) : ""
      }
      <button onClick={(e) => likePost(e, id)}> ❤️ Like this post</button>
    </>
  ) 
} 

export function AddPost({ createPost }) {
  const [uiPleaseWait, setUiPleaseWait] = useState(false)
  
  function handleSubmitPost(e) {
    e.preventDefault()
    setUiPleaseWait(true)
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const tags = document.getElementById('tags').value
    const image = document.getElementById('image').value
    
    createPost(title, description, title, tags, image)
  }

   
   return (
    <>
      <form onSubmit={handleSubmitPost}>
        <label>Title</label> <br/>
        <input placeholder="title" id="title"/><br/>
        <label>Description</label><br/>
        <input placeholder="Description" id="description"/><br/>
        <label>Tags</label> <br/>
        <input placeholder="Tag" id="tags"/><br/>
        <label>Image</label> <br/>
        <input placeholder="Image" id="image"/><br/>
        <button>Submit Post</button>
      </form>
    </>
   )
}
 
export function PostByTag({ getPostsByTag }) {
  
  function handleSearchTag(e) {
    e.preventDefault();
    const value = document.getElementById("searchTag").value

    getPostsByTag(value)
  }
  return ( 
    <>
      <h2>Get Post By Tag</h2>
      <form onSubmit={handleSearchTag}>
        <label>Tag</label>
        <input placeholder='tag' id="searchTag"/>
        <button>Get Post By Tag</button>
      </form>
    </>
  )
}
