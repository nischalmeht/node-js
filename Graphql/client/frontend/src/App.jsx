import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery, gql } from '@apollo/client';
const query=gql`
 query ExampleQuery {
  getTodos {
    id,
    user {
     id,
    name
    }
  }
 
}

`
function App() {
const {data,loading}=useQuery(query);
if (loading) return <h1>Loading...</h1>;

  return (
    <>
    {JSON.stringify(data)}
    </>
  )
}

export default App
