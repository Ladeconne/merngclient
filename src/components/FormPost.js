import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { useForm } from '../util/hooks';
import { Button, Form, FormInput } from 'semantic-ui-react';
import { FETCH_GET_POSTS } from '../util/graphqlQuery';

function FormPost() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, { body: ''});

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_GET_POSTS
      });
      proxy.writeQuery({
        query: FETCH_GET_POSTS,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts]
        }})
      values.body = '';
    },
    onError: (err) => {
      console.log(err);
    },
    variables: values
  });


  function createPostCallback() {
    createPost();
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <FormInput
          placeholder= "Enter your text here"
          name="body"
          value={values.body}
          onChange={onChange}
          error={error ? true : false}
          />
          <Button type="submit" color="teal">Submit</Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message error-message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION= gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id body username createdAt likesCount commentsCount
        likes {
          id createdAt username
        }
        comments {
          id body username createdAt
        }
    }
  }
`;
export default FormPost;
