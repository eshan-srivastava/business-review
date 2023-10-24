import { useState } from 'react'
import './App.css'
import { gql, useQuery } from '@apollo/client'
import BusinessResults from './BusinessResults';

//get business query that returns list of businesses, with fragment containing actual data to be returned by the query
const BUSINESS_DETAILS_FRAGMENT = gql(`
  fragment businessDetails on Business {
    businessId
      name
      address
      categories {
        name
      }
  }
`);

const GET_BUSINESSES = gql(`
  query BussinessesByCategory($selectedCategory: String!){
    businesses(where: {categories_SOME: {name_CONTAINS: $selectedCategory}}) {
      ...businessDetails
      isStarred @client
    }
  }
  ${BUSINESS_DETAILS_FRAGMENT}
`);

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  //fetch business data by hook and add on-user-interaction cache updation
  const { loading, error, data, refetch } = useQuery(GET_BUSINESSES, {
    variables: { selectedCategory },
  });

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
        <input type="button" value="Refetch" onClick={() => refetch}/>
      </form>

      <BusinessResults businesses={data.businesses} />
    </div>
  )
}

export default App
