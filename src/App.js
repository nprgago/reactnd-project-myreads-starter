import React from 'react'
import { Route } from 'react-router-dom'
import * as API from './BooksAPI'
import Search from './components/search'
import Shelf from './components/Shelf'
import { Link } from 'react-router-dom' 
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
    
  moveToShelf = (newBook, shelf) => {
    
    API.update(newBook.id, shelf).then( res => {
      newBook.shelf = shelf
      const updateBooks = this.state.books.filter( book => book.id !== newBook.id)

      updateBooks.push(newBook)
      this.setState({ books: updateBooks })
    })
  }

  render() {
    return (
      <div className="app">

        <Route path='/search' render= {() => (
          <Search 
            moveToShelf = {this.moveToShelf}
            books = {this.state.books}
          />
        )} />

        <Route exact path='/' render= {() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            
            <div className="list-books-content">
              <div>
                <Shelf 
                  books = {this.state.books}
                  moveToShelf = {this.moveToShelf}
                  isLoading = {this.state.isLoading}
                  shelf = "currentlyReading"
                />
                <Shelf 
                  books = {this.state.books}
                  moveToShelf = {this.moveToShelf}
                  isLoading = {this.state.isLoading}
                  shelf = "wantToRead"
                />
                <Shelf 
                  books = {this.state.books}
                  moveToShelf = {this.moveToShelf}
                  isLoading = {this.state.isLoading}
                  shelf = "read"
                />
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
