import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return { title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`, body: faker.hacker.phrase() };
}

// 1) CREATE A NEW CONTEXT
const PostContext = createContext();

function PostProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(() => Array.from({ length: 30 }, () => createRandomPost()));
  const searchedPosts = searchQuery.length > 0 ? posts.filter((post) => `${post.title} ${post.body}`.toLowerCase().includes(searchQuery.toLowerCase())) : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]); // an updater function
  }

  function handleClearPosts() {
    setPosts([]);
  }

  const value = useMemo(() => {
    return {
      searchedPosts: searchedPosts,
      onAddPosts: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchQuery, searchedPosts]);

  return (
    // 2) PROVIDE VALUE TO THE CHILD COMPONENTS
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  return context;
}

export { PostProvider, usePosts };
