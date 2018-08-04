import React from 'react'
import * as API from './BooksAPI'
import Loader from './components/loader'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import './App.css'

class BooksApp extends React.Component {
  
  state = {
    isLoading: true,
    books: [],
    query: '',
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  }

  // 

  componentDidMount() {
    // When Loading 
    if(this.state.isLoading) { 
      // Get All Books 
      this.getBooks()
    }
  }
  
  getBooks = () => {
    API.getAll().then( (books) => this.setState({
      books,
      isLoading: false
    })).catch(err => console.log(err))
  }  
  
  currentReading = (e) => {
    const id = e.target.value
    this.setState(state => ({
      books: state.books.map(book => {
        if (book.id === id) {
          let newObj = book
          newObj.shelf = 'currentlyReading'
          return newObj
        }
        return book        
      })
    }))
    
    API.update(id, 'currentlyReading')
  } 

  wantToRead = (e) => {
    const id = e.target.value
    this.setState(state => ({
      books: state.books.map(book => {
        if (book.id === id) {
          let newObj = book
          newObj.shelf = 'wantToRead'
          return newObj
        }
        return book        
      })
    }))
    
    API.update(id, 'wantToRead')
  }

  read = (e) => {
    const id = e.target.value
    this.setState(state => ({
      books: state.books.map(book => {
        if (book.id === id) {
          let newObj = book
          newObj.shelf = 'read'
          return newObj
        }
        return book        
      })
    }))
    
    API.update(id, 'read')
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  render() {
    
    let showingBooks 
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      showingBooks = this.state.books.filter(book => match.test(book.title))
    } else {
      showingBooks = this.state.books
    }

    showingBooks.sort(sortBy('title'))
    
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={(e) => this.updateQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                  {this.state.isLoading
                    ? <Loader />
                    : showingBooks.map(book => (
                      <li key={book.id}>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value={book.id} disabled>Move to...</option>
                                <option value={book.id} onClick={this.wantToRead}>Currently Reading</option>
                                <option value={book.id} onClick={this.wantToRead}>Want to Read</option>
                                <option value={book.id} onClick={this.read}>Read</option>
                                <option value={book.id} disabled>None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">{book.title}</div>
                          {book.authors.length < 1 
                            ? <div className="book-authors">{book.authors[0]}</div>
                            : book.authors.map( author => (
                              <div className="book-authors">{author}</div>
                            ))                             
                          }
                        </div>
                      </li>
                    ))
                  }                  
                </ol> 
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.isLoading
                        ? <Loader />
                        : this.state.books.filter(book => book.shelf === 'currentlyReading').map(book => (
                          <li key={book.id}>
                            <div className="book">
                              <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                <div className="book-shelf-changer">
                                  <select>
                                    <option value={book.id} disabled>Move to...</option>
                                    <option value={book.id} disabled={true}>Currently Reading</option>
                                    <option value={book.id} onClick={this.wantToRead}>Want to Read</option>
                                    <option value={book.id} onClick={this.read}>Read</option>
                                    <option value={book.id}>None</option>
                                  </select>
                                </div>
                              </div>
                              <div className="book-title">{book.title}</div>
                              {book.authors.length < 1 
                                ? <div className="book-authors">{book.authors[0]}</div>
                                : book.authors.map( author => (
                                  <div className="book-authors">{author}</div>
                                ))                             
                              }
                            </div>
                          </li>
                        ))
                      }
                    </ol>
                  </div>
                </div>

                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.isLoading
                        ? <Loader />
                        : this.state.books.filter(book => book.shelf === 'wantToRead').map(book => (
                          <li key={book.id}>
                            <div className="book">
                              <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                <div className="book-shelf-changer">
                                  <select>
                                    <option value={book.id} disabled>Move to...</option>
                                    <option value={book.id} onClick={this.currentReading}>Currently Reading</option>
                                    <option value={book.id} disabled={true}>Want to Read</option>
                                    <option value={book.id} onClick={this.read}>Read</option>
                                    <option value={book.id}>None</option>
                                  </select>
                                </div>
                              </div>
                              <div className="book-title">{book.title}</div>
                              {book.authors.length < 1 
                                ? <div className="book-authors">{book.authors[0]}</div>
                                : book.authors.map( author => (
                                  <div className="book-authors">{author}</div>
                                ))                             
                              }                              
                            </div>
                          </li>
                        ))
                      }
                    </ol>
                  </div>
                </div>
                
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.isLoading
                        ? <Loader />
                        : this.state.books.filter(book => book.shelf === 'read').map(book => (
                          <li key={book.id}>
                            <div className="book">
                              <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                <div className="book-shelf-changer">
                                  <select>
                                    <option value={book.id} disabled>Move to...</option>
                                    <option value={book.id} onClick={this.currentReading}>Currently Reading</option>
                                    <option value={book.id} onClick={this.wantToRead}>Want to Read</option>
                                    <option value={book.id} disabled={true}>Read</option>
                                    <option value={book.id}>None</option>
                                  </select>
                                </div>
                              </div>
                              <div className="book-title">{book.title}</div>
                              {book.authors.length < 1 
                                ? <div className="book-authors">{book.authors[0]}</div>
                                : book.authors.map( author => (
                                  <div className="book-authors">{author}</div>
                                ))                             
                              }                              
                            </div>
                          </li>
                        ))
                      }
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
