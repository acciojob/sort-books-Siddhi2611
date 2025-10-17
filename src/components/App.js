
import React from "react";
import './../styles/App.css';
// ----- Initial state -----
const initialState = {
  books: [],
  loading: false,
  error: null,
  sortBy: "title",
  order: "asc",
};

// ----- Reducer -----
function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_BOOKS":
      return { ...state, books: action.payload, loading: false, error: null };
    case "SET_SORTBY":
      return { ...state, sortBy: action.payload };
    case "SET_ORDER":
      return { ...state, order: action.payload };
    default:
      return state;
  }
}

// ----- Action creators -----
function setLoading(value) {
  return { type: "SET_LOADING", payload: value };
}
function setError(msg) {
  return { type: "SET_ERROR", payload: msg };
}
function setBooks(data) {
  return { type: "SET_BOOKS", payload: data };
}
function setSortBy(value) {
  return { type: "SET_SORTBY", payload: value };
}
function setOrder(value) {
  return { type: "SET_ORDER", payload: value };
}

// ----- Fetch Books action (no async/await) -----
function fetchBooks(dispatch) {
  dispatch(setLoading(true));

  fetch("https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=demo")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
    .then((data) => {
      const arr = data.results && data.results.books ? data.results.books : [];
      const mapped = arr.map((b) => ({
        title: b.title,
        author: b.author,
        publisher: b.publisher,
        isbn: b.primary_isbn13,
      }));
      dispatch(setBooks(mapped));
    })
    .catch((err) => {
      dispatch(setError(err.message));
    });
}

/////////////////////////////////////////////////////
// Main Component (BooksList + Redux simulation)
/////////////////////////////////////////////////////

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Fetch books once
  React.useEffect(() => {
    fetchBooks(dispatch);
  }, []);

  // Sorting logic
  const sortedBooks = state.books
    .slice()
    .sort((a, b) => {
      const field = state.sortBy;
      let valA = (a[field] || "").toLowerCase();
      let valB = (b[field] || "").toLowerCase();
      if (valA < valB) return state.order === "asc" ? -1 : 1;
      if (valA > valB) return state.order === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div>
      {/* Do not remove the main div */}
      <h2>Books</h2>

      {/* select:nth-child(1) */}
      <select
        value={state.sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value))}
      >
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="publisher">Publisher</option>
      </select>

      {/* select:nth-child(2) */}
      <select
        value={state.order}
        onChange={(e) => dispatch(setOrder(e.target.value))}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
          </tr>
        </thead>
        <tbody>
          {sortedBooks.length === 0 && !state.loading && !state.error && (
            <tr>
              <td colSpan="4">No books available</td>
            </tr>
          )}
          {sortedBooks.map((b, i) => (
            <tr key={i}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

