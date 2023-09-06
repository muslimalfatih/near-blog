import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';

import './assets/global.css';

import { AddPost, Posts, PostByTag, SignInPrompt, SignOutButton } from './ui-components';


export default function App({ isSignedIn, contractId, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = useState();
  const [uiPleaseWait, setUiPleaseWait] = useState(true);
  const [allPosts, setAllPosts] = useState([])


  useEffect(() => {
    getAllPost()
      .then(setAllPosts) 
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setUiPleaseWait(false)
      })
  }, [])

  function getAllPost() {
    return wallet.viewMethod({ method: "getAllPosts", contractId })
  }

  function onCreatePost(title, description, tags, image) {
    wallet.callMethod({ 
      method: "createPost", 
      args: {
        title, description, tags, image
      }, contractId
    })
    .then(async () => { return getAllPost()})
    .then(setAllPosts)
    .finally(() => setUiPleaseWait(false))
  }

  function likePost(e, postId) {
    return wallet.callMethod({
      method: "likePost",
      args: {
        postId 
      }
    })
    .then(async () => { return getAllPost()})
    .then(setAllPosts)
    .finally(() => setUiPleaseWait(false))
  }

  function onGetPostsByTag(tag) {
    return wallet.viewMethod({
      method: "getPostsByTag",
      args: {
        tag
      }

    })
  }

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
  }

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>
          Blog NEAR Dapp
        </h1>
        <PostByTag getPostsByTag={onGetPostsByTag}/>
        <Posts posts={allPosts} likePost={likePost}/> 
        <br/><br/><br/><br/>
        <AddPost createPost={onCreatePost}/> 
      </main>
    </>
  );
}