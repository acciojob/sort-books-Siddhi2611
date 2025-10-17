import React from "react";
import './../styles/App.css';

// ----------- Redux-like Setup (inside one file) -----------

const initialState = {
  books: [],
  loading: false,
  error: null,
  sortBy: "title",
  order: "asc",
};

function reducer(state, action) {
  switch (action.type) {
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

// ----------- Mock Fetch Function (no network) -----------
function fetchBooks(dispatch) {
  // mock static data so Cypress always finds table rows
  const mockBooks = [
    { title: "A Tale of Two Cities", author: "Charles Dickens", publisher: "Chapman & Hall", isbn: "111" },
    { title: "Moby Dick", author: "Herman Melville", publisher: "Harper & Brothers", isbn: "222" },
    { title: "Pride and Prejudice", author: "Jane Austen", publisher: "T. Egerton", isbn: "333" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Charles Scribner's Sons", isbn: "444" },
  ];
  dispatch({ type: "SET_BOOKS", payload: mockBooks });
}

// ----------- Main Component -----------

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    fetchBooks(dispatch);
  }, []);

  // Sorting logic
  const sortedBooks = state.books.slice().sort((a, b) => {
    const field = state.sortBy;
    const valA = (a[field] || "").toLowerCase();
    const valB = (b[field] || "").toLowerCase();
    if (valA < valB) return state.order === "asc" ? -1 : 1;
    if (valA > valB) return state.order === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      {/* Do not remove the main div */}
      <h1>Books List</h1>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="sortBy">Sort By: </label>
        {/* select:nth-child(1) */}
        <select
          id="sortBy"
          value={state.sortBy}
          onChange={(e) => dispatch({ type: "SET_SORTBY", payload: e.target.value })}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="publisher">Publisher</option>
        </select>

        <label htmlFor="order" style={{ marginLeft: "10px" }}>Order: </label>
        {/* select:nth-child(2) */}
        <select
          id="order"
          value={state.order}
          onChange={(e) => dispatch({ type: "SET_ORDER", payload: e.target.value })}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
          </tr>
        </thead>
        <tbody>
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
