import React from 'react'
import * as API from '../BooksAPI'
import Loader from './loader'
import { Link } from 'react-router-dom' 
import { Debounce } from 'react-throttle'
import cover from '../icons/cover.png'

class Search extends React.Component {

  state = {
    query: '',
    isLoading: false,
    search: []
  }
  
  updateQuery = (query) => {
    this.setState({ 
      query: query,
      isLoading: true 
    })
    
    if (query) {
      console.log(query)
      API.search(query.trim()).then( books => {
        books.length > 0 ? this.setState({ search : books, isLoading: false }) : this.setState({ search: [], isLoading: false })
      }).catch(err => console.log(err))

    } else {
      this.setState({ search: [], isLoading: false })
    }

  }
  
  render() {
    return (
      <div>
        <div className="search-books">
          <div className="search-books-bar">
            <Link 
              to = "/"
              className="close-search" 
            >Close</Link>
            <div className="search-books-input-wrapper">
              <Debounce time="800" handler="onChange">
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
                {this.state.isLoading
                  ? <Loader />
                  : this.state.search.map(book => (
                    <li key={book.id}>
                      <div className="book">
                        <div className="book-top">
                          <div className="book-cover" 
                            style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : cover })`}}></div>
                          <div className="book-shelf-changer">
                            <select>
                              <option value={book.id} disabled>Move to...</option>
                              <option 
                                className = 'currentlyReading'
                                value={book.id} 
                                onClick={this.props.addToShelf}
                              >Currently Reading</option>
                              <option
                                className = 'wantToRead' 
                                value={book.id}
                                onClick={this.props.addToShelf}
                              >Want to Read</option>
                              <option 
                                className = 'read'
                                value={book.id}
                                onClick={this.props.addToShelf}
                              >Read</option>
                              <option value={book.id} disabled>None</option>
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
    )
  }
}

export default Search