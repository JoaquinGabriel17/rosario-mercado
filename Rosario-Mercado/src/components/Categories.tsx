
export default function Categories(){
    return(
        <div className="flex items-center flex-col">
            <h1 className="text-3xl">Categorías</h1>
            <ul className="mt-4 border-2 rounded">
                <li className="px-10 py-2 border-b">Bebidas</li>
                <li className="px-10 py-2 border-b">Comidas</li>
                <li className="px-10 py-2">Combos</li>
            </ul>
        </div>
    )
}