import { useParams } from "react-router-dom";


const OAuth: React.FC = () => {

    const { code } = useParams();

    if(!code){
        return(
            <div>
                <h1>Error al obtener código de autorización. Por favor reintente nuevamente.</h1>
            </div>
        )
    }
    return(
        <div>
            <h1>Autorización</h1>
        </div>
    )
}

export default OAuth;