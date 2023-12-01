import avatar from './assets/Avatar.jpeg'
import './Card.css'

export default function Card() {
    return(
        <div className = "card-container">
            <div className = "name">
                <h1>Johna Doe</h1>
            </div>

            <div className = "avatar-image">
            <img src = {avatar}>
            </img>
            </div>  
        
            <div className = "bio">
                <h6>Hi! I'm John Doe. I'm a senior at the University of Washington studying Computer Science. I'm looking for a roommate to share a 2 bedroom apartment with. I'm a pretty chill guy and I like to play video games in my free time. I'm looking for a roommate who is clean and respectful.</h6>
            </div>
        </div>   
    )
}