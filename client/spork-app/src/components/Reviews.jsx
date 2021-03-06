import React, { Component } from 'react'
import { createComment, deleteComments, updateComments } from "../services/recipes"
import EditButton from "./EditButton"
import BeautyStars from "beauty-stars"
import { withRouter, Link } from "react-router-dom"
import CondensedHeader from './shared/CondensedHeader'
import UpdateReview from "./UpdateReview"
import "../css/Reviews.css"

class Reviews extends Component {
  constructor(props) {
    super(props)
    this.state = {
      review: {
        name: "",
        comment: "",
        starRating: 0
      },

      allReviews: null,
      isEmptyState: true
    }
  }




  componentDidMount = async () => {
    const filteredRecipe = await this.props.commentData.find((recipe) => recipe._id === this.props.match.params.id)
    this.setState({ allReviews: filteredRecipe.comments })
  }

  handleNameChange = (e) => {
    this.setState({
      review: {
        ...this.state.review,
        name: e.target.value
      }
    })
  }

  handleCommentChange = (e) => {
    this.setState({
      review: {
        ...this.state.review,
        comment: e.target.value
      }
    })
  }

  handleRatingChange = (e) => {
    this.setState({
      review: {
        ...this.state.review,
        starRating: e.target.value
      }
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    let { id } = this.props.match.params
    const created = await createComment(id, this.state.review)
    this.setState(prevState => ({
      allReviews: [...prevState.allReviews, created]
    }))

    console.log(this.state.allReviews)
  }
  handleDelete = async (id) => {
    // e.preventDefault()
    // let { id } = this.state.allReviews._id 
    const deleted = await deleteComments(id)
    const allReviews = this.state.allReviews.filter(review => {
      return id !== review._id
    })
    this.setState({
      allReviews: allReviews
    })
  }

  handleUp= async (id, comments) => {
    // e.preventDefault()
    // let { id } = this.state.allReviews._id
    let update = await updateComments(id, this.state.review)
    const allReviews = this.state.allReviews.map(review => (
      review._id === id ? update : review
    ))
    // console.log(allReviews)
    this.setState({
      allReviews: allReviews
    })
  }


  triggerAddTripState = () => {
    this.setState({
      ...this.state,
      isEmptyState: false,
      isAddTripState: true
    })
  }

  // handleUpdate = async (id) => {
  //   // e.preventDefault()
  //   // let { id } = this.state.allReviews._id 
  //   const updated = await updateComments(id)
  //   const allReviews = this.state.allReviews.filter(review => {
  //     return id !== review._id
  //   })
  //   this.setState({
  //     review: updated
  //   })
  //   console.log(this.state.review)
  // }


  render() {
    const filteredRecipe = this.props.commentData.find((recipe) => recipe._id === this.props.match.params.id)

    return (
      <div>
        {filteredRecipe &&
          <Link to={`/search/${this.props.inputValue}/${filteredRecipe._id}`}><CondensedHeader /></Link>
        }




        <div className="header">Reviews</div>
        <div className="reviewAndForm">
          <h2>Submit a Review</h2>
          <form className="reviewForm" onSubmit={this.handleSubmit}>
            <input className="reviewInput" type="text" placeholder="Name" onChange={this.handleNameChange} value={this.state.review.name}/>
            <input className="reviewInput commentInput" type="text" placeholder="Comment" onChange={this.handleCommentChange} value={this.state.review.comment}/>
            <input className="reviewInput" type="number" placeholder="Star rating" onChange={this.handleRatingChange} value={this.state.review.starRating}/>


            <button className="reviewButton" >Submit</button>
          </form>


          <div>
            {this.state.isEmptyState && <editButton addTrip={this.triggerAddTripState} />}

            {this.state.isAddTripState && <UpdateReview props={this.state} />}
          </div>

          <h1>Reviews for:</h1>
          {filteredRecipe &&
            <div>{filteredRecipe.dishName}</div>}

          {/* //review itself  */}

          {this.state.allReviews && this.state.allReviews.map(review =>
            <div className="reviewDiv">

              <h3>{review.name}</h3>
              <BeautyStars value={review.starRating} size="10px" />
              <h3>{review.comment}</h3>
              {/* <button onClick={() => this.handleUpdate(review._id)}> grab review</button>
            <EditButton addTrip={this.triggerAddTripState} /> */}
              <button onClick={() => this.handleUp(review._id)}>Edit Review</button>
              <button onClick={() => this.handleDelete(review._id)}>Delete</button>
              <hr />
            </div>

          )
          }

        </div>
      </div>
    )
  }
}
export default withRouter(Reviews) 