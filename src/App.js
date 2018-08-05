import React from 'react'
import { Route } from 'react-router-dom'
import * as API from './BooksAPI'
import Loader from './components/loader'
import Search from './components/search';
import { Link } from 'react-router-dom' 
import cover from './icons/cover.png'
import './App.css'

class BooksApp extends React.Component {
  
  state = {
    isLoading: true,
    books: []
  }

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
    
  moveToShelf = (e) => {
    const id = e.target.value
    const shelf = e.target.className
    this.setState(state => ({
      books: state.books.map(book => {
        if (book.id === id) {
          let newObj = book
          newObj.shelf = shelf
          return newObj
        }
        return book
      })
    }))
    API.update(id, shelf)
  }

  findId = (id) => {
    let found = false
    this.state.books.map(book => { 
      if (book.id === id) {
        found = true
        return found
      }
    })
    return found
  } 
  
  findShelf = (id, shelf) => {
    let found = false
    this.state.books.map(book => {
      if (book.id === id && book.shelf !== shelf) {
        found = true
        return found
      }
    })
    return found
  }

  addToShelf = (e) => {
    const id = e.target.value
    const shelf = e.target.className
    
    if (!this.findId(id)) {
      
      API.get(id).then( book => {
        book.shelf = shelf
        const newBooks = this.state.books
        newBooks.push(book)      
        this.setState({ books: newBooks })
      }).catch(err => console.log(err))

      API.update(id, shelf).catch(err => console.log(err))
    } else {
      
      if(this.findShelf(id, shelf)) {
        this.setState(state => ({
          books: state.books.map(book => {
            if (book.id === id) {
              let newObj = book
              newObj.shelf = shelf
              return newObj
            }
            return book
          })
        }))
        API.update(id, shelf)
      }
    }
  }  
  

  render() {
    return (
      <div className="app">
        <Route path='/search' render= {() => (
          <Search 
            isLoading = {this.state.isLoading}
            addToShelf = {this.addToShelf}
          />
        )} />

        <Route exact path='/' render= {() => (
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
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : cover })`}}></div>
                                <div className="book-shelf-changer">
                                  <select>
                                    <option value={book.id} disabled>Move to...</option>
                                    <option value={book.id} disabled={true}>Currently Reading</option>
                                    <option className='wantToRead' value={book.id} onClick={this.moveToShelf}>Want to Read</option>
                                    <option className='read' value={book.id} onClick={this.moveToShelf}>Read</option>
                                    <option className='none' value={book.id} onClick={this.moveToShelf}>None</option>
                                  </select>
                                </div>
                              </div>
                              <div className="book-title">{book.title ? book.title : 'No title available'}</div>                
                              {book.authors && book.authors.map( author => (
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
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : cover })`}}></div>
                                <div className="book-shelf-changer">
                                  <select>
                                    <option value={book.id} disabled>Move to...</option>
                                    <option className='currentlyReading' value={book.id} onClick={this.moveToShelf}>Currently Reading</option>
                                    <option value={book.id} disabled={true}>Want to Read</option>
                                    <option className='read' value={book.id} onClick={this.moveToShelf}>Read</option>
                                    <option className='none' value={book.id} onClick={this.moveToShelf}>None</option>
                                  </select>
                                </div>
                              </div>
                              <div className="book-title">{book.title ? book.title : 'No title available'}</div>
                              {book.authors && book.authors.map( author => (
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
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : cover })` }}></div>
                                <div className="book-shelf-changer">
                                  <select>
                                    <option value={book.id} disabled>Move to...</option>
                                    <option className='currentlyReading' value={book.id} onClick={this.moveToShelf}>Currently Reading</option>
                                    <option className='wantToRead' value={book.id} onClick={this.moveToShelf}>Want to Read</option>
                                    <option value={book.id} disabled={true}>Read</option>
                                    <option className='none' value={book.id} onClick={this.moveToShelf}>None</option>
                                  </select>
                                </div>
                              </div>
                              <div className="book-title">{book.title ? book.title : 'No title available'}</div>
                              {book.authors && book.authors.map( author => (
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
              <Link 
                to = "/search"
              >Add a book</Link>
            </div>
          </div>
        )} />

      </div>
    )
  }
}

export default BooksApp
