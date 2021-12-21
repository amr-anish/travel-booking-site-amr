
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';



const StarRating = () => {
    const [rating, setRating] = useState(null);  //using state to set the rating
    const [hover, setHover] = useState(null);  //using state to set the hover 


    return (
        <div>
            {[...Array(5)].map((star, i) => { //empty array of 5 undefined elements
                const ratingValue = i + 1;

                return (
                    <label>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                        />
                        <FaStar
                            className="star"
                            color={ratingValue <= (hover || rating) ? "yellow" : "gray"}
                            size={80}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                )
            })}
            <p><b>The Rating is :{rating}</b></p>
        </div>
    )
}

export default StarRating;