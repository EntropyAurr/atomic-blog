import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import { PostProvider, usePosts } from "./PostContext";
import Test from "./Test";

function createRandomPost() {
  return { title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`, body: faker.hacker.phrase() };
}

export default function App() {
  const [isFakeDark, setIsFakeDark] = useState(false);

  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

  return (
    <section>
      <button onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)} className="btn-fake-dark-mode">
        {isFakeDark ? "☀️" : "🌙"}
      </button>

      <PostProvider>
        <Header />
        <Main />
        <Archive />
        <Footer />
      </PostProvider>
    </section>
  );
}

function Header() {
  // 3) CONSUMING THE CONTEXT VALUE
  const { onClearPosts } = usePosts();

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>

      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePosts();

  return <input className="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search posts..." />;
}

function Results() {
  const { searchedPosts } = usePosts();

  return <p>🚀 {searchedPosts.length} atomic posts found</p>;
}

function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
}

function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}

function FormAddPost() {
  const { onAddPosts } = usePosts();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();

    if (!title || !body) return;

    onAddPosts({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Post body" />
      <button>Add post</button>
    </form>
  );
}

function List() {
  const { searchedPosts } = usePosts();

  return (
    <>
      <ul>
        {searchedPosts.map((post, i) => (
          <li key={i}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      {/* <Test /> */}
    </>
  );
}

function Archive() {
  const { onAddPosts } = usePosts();

  const [post] = useState(() => Array.from({ length: 77 }, () => createRandomPost()));
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick

  const [showArchive, setShowArchive] = useState(false);

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((show) => !show)}>{showArchive ? "Hide archive posts" : "Show archive posts"}</button>

      {showArchive && (
        <ul>
          {post.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPosts(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by Aurora.</footer>;
}
