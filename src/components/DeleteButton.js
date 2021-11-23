import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import gql from "graphql-tag";

import { FETCH_GET_POSTS } from "../util/graphqlQuery";

const DeleteButton = ({ postId, commentId, callback}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const navigate = useNavigate();

  const [deleteOrMutatePost] = useMutation(mutation, {
    variables: {postId, commentId},
    update(proxy) {
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_GET_POSTS
        });
        let copyData = [...data.getPosts];
        proxy.writeQuery({
          query: FETCH_GET_POSTS,
          data: {
            getPosts: copyData.filter( e => e.id !== postId )
          }})
          navigate('/');
      }
    },
    onError(err) {
      console.log(err);
    }
  })

  function deleteOrMutatePostCallback() {
    setConfirmOpen(false);
    deleteOrMutatePost();
  }

  return (
    <>
      <Popup
        content={commentId ? 'Delete this comment' : "Delete this post"}
        trigger={
            <Button
              color='red'
              floated='right'
              onClick={() => setConfirmOpen(true)}
            >
              <Icon fitted name="trash"/>
            </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteOrMutatePostCallback}
      />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      commentsCount
      comments {
        id body username createdAt
      }
    }
  }
`;

export default DeleteButton;
