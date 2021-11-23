import gql from 'graphql-tag';

export const FETCH_GET_POSTS = gql`
  {
    getPosts {
      id username body likesCount createdAt
      likes {
        id username createdAt
      }
      commentsCount
      comments {
        id username body createdAt
      }
    }
  }
`;
