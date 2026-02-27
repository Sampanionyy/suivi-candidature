import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <Link to={"/login"}>
                <button>Se connecter</button>
            </Link>
            <Link to={"/register"}>
                <button>S'inscrire</button>
            </Link>
        </div>
    )
}

export default Home