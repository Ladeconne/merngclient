import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Grid, Image, Card, Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';

import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

const SinglePost = () => {
  const { user } = useContext(AuthContext);
  const { id: postId } = useParams();
  const [comment, setComment] = useState('');

  // Get post
  const { data } = useQuery(FETCH_GET_POST, {
    variables: {
      postId
    },
    onError(err) {
      console.log(err);
    }
  });

  // Create comment
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: { postId, body: comment},
    update(){
      setComment('');
    }
  })


  let postMarkup;
  if(!data){
    postMarkup = <p>Loading post...</p>
  } else {
    const { getPost } = data;
    const { username, id, body, createdAt, likes, likesCount, comments, commentsCount} = getPost;

    postMarkup = (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
            <Image
              size="small"
              src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
            />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
              <Card.Description>{body}</Card.Description>
              <div>
                <LikeButton user={{user}} post={{id, likes, likesCount}}/>
                <Button
                  basic
                  color='blue'
                  icon='comments'
                  label={{
                    basic: true,
                    color: 'blue',
                    pointing: 'left',
                    content: commentsCount,
                  }}
                />
                {user && user.username === username && (
                  <DeleteButton postId={id}/>
                )}
              </div>
            </Card.Content>
          </Card>
          { user && (
            <Card fluid>
              <Card.Content>
                <p>Post a comment</p>
                <Form>
                  <div className="ui action input fluid">
                    <input
                      type="text"
                      placeholder='Comment...'
                      name='comment'
                      value={comment}
                      onChange= {event => setComment(event.target.value)}
                    />
                    <button
                      type='submit'
                      className='ui button teal'
                      disabled={comment.trim() === ''}
                      onClick={submitComment}
                    >
                    Submit
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </Card>
          )}
          { comments ? comments.map(comment =>
            <Card key={comment.id} fluid>
              <Card.Content>
                {user && user.username === comment.username && (
                  <DeleteButton postId={id} commentId={comment.id} />
                )}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{comment.body}</Card.Description>
              </Card.Content>
            </Card>
            ) : ''
          }
        </Grid.Column>
      </Grid.Row>
    </Grid>)
  }

  return postMarkup;
}

const FETCH_GET_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      username
      createdAt
      likes {
        createdAt
      }
      likesCount
      comments {
        body
        createdAt
        id
        username
      }
      commentsCount
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentsCount
      comments {
        id
        body
        createdAt
        username
      }
    }
  }
`;

export default SinglePost;
