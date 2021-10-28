/*
  - notes
    - With RTK Query, the logic for managing cached data is centralized into a single "API slice" per application
*/


// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
/*
  - createApi
    - It allows you to define a set of endpoints describe how to retrieve data from a series of endpoints
      - including configuration of how to fetch and transform that data
  - fetchBaseQuery
    - A small wrapper around fetch that aims to simplify requests
    - Intended as the recommended baseQuery to be used in createApi for the majority of users
*/



// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/posts',
      providesTags: ['Post']
    }),
    getPost: builder.query({
      query: postId => `/posts/${postId}`
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        // Include the entire post object as the body of the request
        body: initialPost
      }),
      invalidatesTags: ['Post']
    })    
  })
})
/*
  - baseQuery, endpoints
    - these two fields are required when calling createApi
  - baseQuery
    - a function that knows how to fetch data from the server
    - RTK Query includes fetchBaseQuery, a small wrapper around the standard fetch() function that handles typical processing of requests and responses
      - fetchBaseQuery
        - When we create a fetchBaseQuery instance, we can pass in the base URL of all future requests, as well as override behavior such as modifying request headers
  - endpoints
    - a set of operations that we've defined for interacting with this server
    - Endpoints can be queries, which return data for caching, or mutations, which send an update to the server.
    - The endpoints are defined using a callback function that accepts a builder parameter and returns an object containing endpoint definitions created with builder.query() and builder.mutation()
  - reducerPath
    - defines the expected top-level state slice field for the generated reducer
  - tagTypes: ['Post'], providesTags: ['Post'], invalidatesTags: ['Post']
    - this is to auto refresh the post list after adding a post
    - notice the list will grey out then refresh
    - RTK Query lets us define relationships between queries and mutations to enable automatic data refetching, using "tags"
    - A "tag" is a string or small object that lets you name certain types of data, and invalidate portions of the cache
    -  When a cache tag is invalidated, RTK Query will automatically refetch the endpoints that were marked with that tag
*/



// Export the auto-generated hook for the `getPost` query endpoint
export const { 
  useGetPostsQuery, 
  useGetPostQuery,   
  useAddNewPostMutation 
} = apiSlice