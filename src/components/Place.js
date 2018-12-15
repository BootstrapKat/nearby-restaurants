import React, { Component } from "react";
import StarRatings from "react-star-ratings";
import AddReviewForm from "./AddReview";

export default class componentName extends Component {
  state = {
    place: {
      opening_hours: { weekday_text: [] }
    },
    reviews: [],
    addingReview: false,
    location: []
  };

  componentDidMount = () => {
    let map = new window.google.maps.Map(this.refs.map, {
      center: this.state.mapCenter,
      zoom: 13,
      mapTypeId: "roadmap"
    });

    let service = new window.google.maps.places.PlacesService(map);
    service.getDetails(
      { placeId: this.props.match.params.place_id },
      (place, status) => {
        const latLng = String(place.geometry.location)
          .replace(" ", "")
          .replace("(", "")
          .replace(")", "")
          .split(",");
        console.log("latLng", latLng);
        this.setState({
          location: latLng,
          place,
          reviews: place.reviews
        });
      }
    );
  };

  addReview = data => {
    console.log(data);
    this.setState({ reviews: [data, ...this.state.reviews] });
  };

  render() {
    const { place, reviews, location } = this.state;

    let photos = [];
    !!place.photos > 0 &&
      place.photos.map(photo =>
        photos.push(photo.getUrl({ maxWidth: 800, maxHeight: 800 }))
      );

    console.log("photos", photos);

    const hours = place.opening_hours.weekday_text.map((item, key) => (
      <li key={key}>{item}</li>
    ));

    return (
      <div className="container-fluid pt-5">
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6">
                <div ref="map" />
                <img
                  className="w-100 rounded"
                  src={`https://maps.googleapis.com/maps/api/streetview?location=${
                    location[0]
                  },${
                    location[1]
                  }&size=456x459&key=AIzaSyCm19G_ipl9S_6uUczqvDsqjHcSR2293zQ`}
                  alt=""
                />
              </div>
              <div className="col-md-6">
                <div
                  className="mt-3 mt-md-0 rounded"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(3, 1fr)",
                    height: "100%",
                    minHeight: "300px"
                  }}
                >
                  {photos.splice(0, 9).map((photo, key) => (
                    <a
                      href={`${photo}`}
                      key={key}
                      className="place-gallery"
                      style={{
                        background: `url('${photo}') center center no-repeat`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mainInfo p-3 mt-4 rounded border border-dark">
              <h2 className="text-black d-flex justify-content-between">
                {place.name}
                <StarRatings
                  rating={place.rating}
                  numberOfStars={5}
                  starRatedColor="orange"
                  starDimension="20px"
                  starSpacing="1px"
                />
              </h2>
              <hr className="border-dark"/>
              <p className="text-black lead">{place.formatted_address}</p>
              <p className="text-black lead">{place.formatted_phone_number}</p>
              
              <div class="row m-4">
              <div
                className="col-xs-12 col-md-4 p-4 rounded border border-dark"
                style={{
                  display: "inline-block"
                }}
              >
                <h3 className="text-black">Opening Hours</h3>
                <ul className="m-0 p-0" style={{ listStyle: "none" }}>
                  {hours}
                </ul>
              </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="col-xs-12 text-center reviewBtn"
              onClick={() =>
                this.setState({ addingReview: !this.state.addingReview })
              }
            >
              {this.state.addingReview ? "Cancel" : "Add Review"}
            </div>
            {this.state.addingReview && (
              <AddReviewForm submit={this.addReview} />
            )}
            <ul className="list-group">
              {reviews.map(review => (
                <li key={review.time} className="list-group-item">
                  <div>
                    <img
                      height="60"
                      className="float-left mr-3 mb-4"
                      src={review.profile_photo_url}
                      alt={review.author_name}
                    />
                    <h4 className="mb-0">{review.author_name}</h4>
                    <p className="mb-0">{review.relative_time_description}</p>
                    <StarRatings
                      rating={review.rating}
                      numberOfStars={5}
                      starRatedColor="orange"
                      starDimension="20px"
                      starSpacing="1px"
                    />
                  </div>
                  <br />
                  <div>
                    <p>{review.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
    
  }

  
}