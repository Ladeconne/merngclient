import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';

import { Grid, Transition } from 'semantic-ui-react';
import CardPost from '../components/CardPost';
import FormPost from '../components/FormPost';
import { FETCH_GET_POSTS } from '../util/graphqlQuery';
import { AuthContext } from '../context/auth';

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_GET_POSTS);
  let posts = [];
  if (data) {
    posts = data.getPosts;
  }
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title p1">
        <h1>Posts</h1>
      </Grid.Row>
      <Grid.Row className="p1">
        {user && (<FormPost />)}
      </Grid.Row>
      <Grid.Row>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Transition.Group>
            {posts && posts.map(post => {
              return(
                <Grid.Column key={post.id}>
                  <CardPost post={post}/>
                </Grid.Column>
              )
            })}
          </Transition.Group>
          )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
