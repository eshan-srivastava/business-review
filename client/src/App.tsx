import { useState } from 'react'
import './App.css'
import { gql, useQuery } from '@apollo/client'
import BusinessResults from './BusinessResults';

//get business query that returns list of businesses
const GET_BUSINESSES = gql(`
  query allBusinesses{
    businesses {
      businessId
      name
      address
      categories {
        name
      }
    }
  }
`);

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { loading, error, data } = useQuery(GET_BUSINESSES);

  if (error){
    return (
      <p>ERROR: {error.message} </p>
    );
  }
  if (loading){
    return (
      <p>Insert spinner here</p>
    );
  }
  return (
    <div>
      <h1>Business Search</h1>
      <form>
        <label>
          Select Business Category:
          <select 
          id="biz-select"
          value={selectedCategory}
          onChange={(event) => {setSelectedCategory(event.target.value)}}>
            <option value="All">All</option>
            <option value="Library">Library</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Car Wash">Car Wash</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>

      <BusinessResults businesses={data.businesses} />
    </div>
  )
}

export default App
