import React from 'react'
import * as API from '../BooksAPI'
import Loader from './loader'
import { Link } from 'react-router-dom' 
import { Debounce } from 'react-throttle'
import PropTypes from 'prop-types'
import Book from './Book'

class Search extends React.Component {

  static propTypes = {
    moveToShelf: PropTypes.func.isRequired,
    books: PropTypes.array.isRequired
  } 

  state = {
    query: '',
    search: [],
    isLoading: false
  }
  
  updateQuery = (query) => {
    this.setState({ query: query, isLoading: true })
    
    if (query) {
      API.search(query).then( books => {
        books.length > 0 ? this.setState({ search : books, isLoading: false }) : this.setState({ search: [], isLoading: false })
      }).catch(err => console.log(err))

    } else { this.setState({ search: [], isLoading: false })}
  }
  
  render() {
    
    const { moveToShelf, books } = this.props
    const { isLoading, search } = this.state 

    return (
      <div>
        <div className="search-books">
          <div className="search-books-bar">
            <Link 
              to = "/"
              className="close-search" 
            >Close</Link>
            <div className="search-books-input-wrapper">
              <Debounce time="700" handler="onChange">
                <input 
                  type="text" 
                  placeholder="Search by title or author"
                  onChange={(e) => this.updateQuery(e.target.value)}
                />
              </Debounce>
            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
                {isLoading
                  ? <Loader />
                  : search.map(book => (
                    <Book
                      book = { book }
                      books = { books }
                      key = { book.id }
                      moveToShelf = { moveToShelf }
                    />
                  ))
                }                  
              </ol> 
          </div>
        </div>
      </div>
    )
  }
}

export default Search