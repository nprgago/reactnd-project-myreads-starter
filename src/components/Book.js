import React from 'react'
import PropTypes from 'prop-types'
import cover from '../icons/cover.png'

class Book extends React.Component {
  
  static propTypes = {
    book: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    moveToShelf: PropTypes.func.isRequired
  }
  
  render () {
    
    const  { book, books, moveToShelf } = this.props

    let currentShelf = 'none'

    for (let item of books) {
      if (item.id === book.id) {
        currentShelf = item.shelf
        break
      }
    }
       
    return (
      <li key={book.id}>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : cover })`}}></div>
            <div className="book-shelf-changer">
              <select onChange={e => moveToShelf(book, e.target.value)} defaultValue={ currentShelf }>
                <option value="none" disabled>Move to...</option>
                <option value="currentlyReading" >Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
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
    )
  }
}

export default Book