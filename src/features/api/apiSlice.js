/*
  - notes
    - With RTK Query, the logic for managing cached data is centralized into a single "API slice" per application
    - but why is it other slice still exist like user slice?
      - userSlice.js used apiSlice.injectEndpoints to extend endpoints the is created here
*/



// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
/*
  - createApi
    - RTK Query's functionality is based on a single method, called createApi
    - It allows you to define a set of endpoints describe how to retrieve data from a series of endpoints
      - including configuration of how to fetch and transform that data
  - fetchBaseQuery
    - RTK Query includes fetchBaseQuery, A small wrapper around fetch that aims to simplify requests
    - Intended as the recommended baseQuery to be used in createApi for the majority of users
    - When we create a fetchBaseQuery instance, we can pass in the 
      - base URL of all future requests
      - as well as override behavior such as modifying request headers
      - eg. http://localhost:3000/fakeApi/post seen in console network tab
*/



// Define our single API slice object
export const apiSlice = createApi({

  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
/*
  - reducerPath
    - defines the expected top-level state slice field for the generated reducer
    - Here, createApi expects us to tell it where the cache state will exist when we add the cache reducer to the store.
    - If you don't provide a reducerPath option, it defaults to 'api', so all your RTKQ cache data will be stored under state.api
    - ??? i still dont get this
*/  



// All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
/*
  - baseQuery
    - baseQuery field is required when calling createApi
    - baseQuery and endpoints are required when calling createApi
    - a function that knows how to fetch data from the server
  - fetchBaseQuery
    - RTK Query includes fetchBaseQuery, A small wrapper around fetch that aims to simplify requests
    - Intended as the recommended baseQuery to be used in createApi for the majority of users
    - When we create a fetchBaseQuery instance, we can pass in the 
      - base URL of all future requests
      - as well as override behavior such as modifying request headers
      - eg. http://localhost:3000/fakeApi/post seen in console network tab
*/



  tagTypes: ['Post'],
/*
  - tagTypes: ['Post'], providesTags: ['Post'], invalidatesTags: ['Post']
    - this is to auto refresh the post in everywhere if we did something
    - notice the list will grey out then refresh
    - RTK Query lets us define relationships between queries and mutations to enable automatic data refetching, using "tags"
    - A "tag" is a string or small object that lets you name certain types of data, and invalidate portions of the cache
    - When a cache tag is invalidated, RTK Query will automatically refetch the endpoints that were marked with that tag
    - since these are use to auto refresh the data, might be better to just copy the code for settings rather than making our own.
  - tagTypes 
    - field in the API slice object, declaring an array of string tag names for data types 
  - providesTags
    - array in query endpoints, listing a set of tags describing the data in that query
  - invalidatesTags
    - array in mutation endpoints, listing a set of tags that are invalidated every time that mutation runs
*/



  endpoints: (builder) => ({
/*
  - endpoints
    - endpoints field is required when calling createApi
    - baseQuery and endpoints are required when calling createApi
    - a set of operations that we've defined for interacting with this server
    - Endpoints can be queries, which return data for caching, or mutations, which send an update to the server.
    - The endpoints are defined using a callback function that accepts a builder parameter
      - and returns an object containing endpoint definitions created with builder.query() and builder.mutation()
*/



    getPosts: builder.query({
      query: () => '/posts',
      providesTags: (result = [], error, arg) => [
        'Post',
        ...result.map(({ id }) => ({ type: 'Post', id })),
      ],
    }),
/*
  - getPosts
    - you can name this base on what you want eg getPostssssss
    - note that this will become "useGetPostsQuery" when we export it
      - The hooks are automatically named based on a standard convention:
        - use, the normal prefix for any React hook
        - The name of the endpoint, capitalized
        - The type of the endpoint, Query or Mutation
        - In this case, our endpoint is getPosts and it's a query endpoint, so the generated hook is useGetPostsQuery
    - this is called like useGetPostsQuery()
      - caller will destruct its result. See PostLists.js
        - eg
          const {
            data: posts = [],
            isLoading,
            isFetching,
            isSuccess,
            isError,
            error,
            refetch
          } = useGetPostsQuery()
  - builder.query
    - This method accepts many options for configuring how to make the request and process the response
  - builder.query, builder.mutation
    - this is how you make a query in rtk api
    - query for getting data
    - mutation for adding and updating data
  - tagTypes: ['Post'], providesTags: ['Post'], invalidatesTags: ['Post']
    - this is to auto refresh the post in everywhere if we did something
    - notice the list will grey out then refresh
    - RTK Query lets us define relationships between queries and mutations to enable automatic data refetching, using "tags"
    - A "tag" is a string or small object that lets you name certain types of data, and invalidate portions of the cache
    - When a cache tag is invalidated, RTK Query will automatically refetch the endpoints that were marked with that tag
    - since these are use to auto refresh the data, might be better to just copy the code for settings rather than making our own.
  - tagTypes 
    - field in the API slice object, declaring an array of string tag names for data types 
  - providesTags
    - array in query endpoints, listing a set of tags describing the data in that query
  - invalidatesTags
    - array in mutation endpoints, listing a set of tags that are invalidated every time that mutation runs    
*/



    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
    }),
/*
  - getPost
    - this is called like useGetPostQuery(postId)
      - caller will destruct its result. See SinglePostPage.js
        - eg
          const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)
*/



    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
/*
  - addNewPost
    - this is called like useAddNewPostMutation()
      - caller will destruct its result. See AddPostForm.js
        - eg
          const [addNewPost, { isLoading }] = useAddNewPostMutation()
*/



    editPost: builder.mutation({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
/*
  - editPost
    - this is called like useEditPostMutation()
      - caller will destruct its result. See EditPostForm.js
        - eg
          const [updatePost, { isLoading }] = useEditPostMutation()
*/



    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.postId },
      ],
    }),
/*
  - addReaction
    - this is called like useAddReactionMutation()
      - caller will destruct its result. See ReactionButtons.js
        - eg
          const [addReaction] = useAddReactionMutation()
*/



  }),
})







export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice
/*
  - export the auto generated renamed endpoints
*/