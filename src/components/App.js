import React, { useEffect, useState } from "react";
import "./../styles/App.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetch(
      "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=demo"
    )
      .then((res) => res.json())
      .then((data) => {
        var bookList = (data && data.results && data.results.books) || [];
        bookList = sortBooks(bookList, "title", "asc");
        setBooks(bookList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function sortBooks(list, key, ord) {
    var sorted = list.slice().sort(function (a, b) {
      var valA = (a[key] || "").toLowerCase();
      var valB = (b[key] || "").toLowerCase();
      if (valA < valB) return ord === "asc" ? -1 : 1;
      if (valA > valB) return ord === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }

  function handleSortChange(e) {
    var newSortBy = e.target.value;
    setSortBy(newSortBy);
    setBooks(sortBooks(books, newSortBy, order));
  }

  function handleOrderChange(e) {
    var newOrder = e.target.value;
    setOrder(newOrder);
    setBooks(sortBooks(books, sortBy, newOrder));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Do not remove the main div */}
      <h1>Books List</h1>

      <div>
        <label>Sort by:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="publisher">Publisher</option>
        </select>

        <label>Order:</label>
        <select value={order} onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
          </tr>
        </thead>
        <tbody>
          {books.map(function (b, i) {
            return (
              <tr key={i}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.publisher}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default App;
