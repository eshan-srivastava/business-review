import { starredVar } from "./main"

//categories is a list of business objects so it has another level of destructuring
interface Business{
    businessId: string,
    name: string,
    address: string,
    categories: {
        name: string
    }[],
    isStarred: boolean,
}

interface BusinessResultsProps {
    businesses: Business[]
}

function BusinessResults({ businesses }: BusinessResultsProps) {
    const starredItems = starredVar();
    return (
        <div>
            <h2>Results</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {businesses.map((biz, i: number) => (
                        <tr key={i}>
                            <td>
                                <button onClick={() => starredVar([...starredItems, biz.businessId])}
                                style={biz.isStarred ? {borderWidth: "5px"} : undefined}>⭐</button>
                            </td>
                            <td>{biz.name}</td>
                            <td>{biz.address}</td>
                            <td>
                                {biz.categories.reduce(
                                    (acc, cat, i) => acc + (i === 0 ? " " : ", ") + cat.name, ""
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
// {biz.categories.reduce((acc, c, i: number) => acc + (i===0 ? " " : ", ") + c.name, "")} for when categories are objects
export default BusinessResults;