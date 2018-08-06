import React from 'react'
import PropTypes from 'prop-types'
import Book from './Book'
import Loader from './loader'

class Shelf extends React.Component {

  static propTypes = {
    books: PropTypes.array.isRequired,
    moveToShelf: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    shelf: PropTypes.string.isRequired
  }

  render() {
    
    const { books, moveToShelf, isLoading, shelf } = this.props
 
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelf}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {isLoading
              ? <Loader />
              : books.filter(book => book.shelf === shelf).map(book => (
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
    )
  }
}

export default Shelf