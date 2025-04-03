import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return { title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`, body: faker.hacker.phrase() };
}

export default function App() {
  const [posts, setPosts] = useState(() => Array.from({ length: 30 }, () => createRandomPost()));

  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);

  const searchedPosts = searchQuery.length > 0 ? posts.filter((post) => `${post.title} ${post.body}`.toLowerCase().includes(searchQuery.toLowerCase())) : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]); // an updater function
  }

  function handleClearPosts() {
    setPosts([]);
  }

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
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

      <Header searchedPosts={searchedPosts} onClearPosts={handleClearPosts} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Main searchedPosts={searchedPosts} onAddPosts={handleAddPost} />
      <Archive onAddPosts={handleAddPost} />
      <Footer />
    </section>
  );
}

function Header({ searchedPosts, onClearPosts, searchQuery, setSearchQuery }) {
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>

      <div>
        <Results searchedPosts={searchedPosts} />
        <SearchPosts searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts({ searchedPosts, setSearchQuery }) {
  return <input className="search" value={searchedPosts} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search posts..." />;
}

function Results({ searchedPosts }) {
  return <p>🚀 {searchedPosts.length} atomic posts found</p>;
}

function Main({ searchedPosts, onAddPosts }) {
  return (
    <main>
      <FormAddPost onAddPosts={onAddPosts} />
      <Posts searchedPosts={searchedPosts} />
    </main>
  );
}

function Posts({ searchedPosts }) {
  return (
    <section>
      <List searchedPosts={searchedPosts} />
    </section>
  );
}

function FormAddPost({ onAddPosts }) {
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
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post tile" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Post body" />
      <button>Add post</button>
    </form>
  );
}

function List({ searchedPosts }) {
  return (
    <ul>
      {searchedPosts.map((post, i) => (
        <li key={i}>
          <h3>{searchedPosts.title}</h3>
          <p>{searchedPosts.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive({ onAddPosts }) {
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
