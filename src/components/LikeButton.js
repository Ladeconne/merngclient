import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Icon, Button, Label, Popup } from 'semantic-ui-react';
import gql from "graphql-tag";
import { Link } from "react-router-dom";

const LikeButton = ({user, post: { id, likes, likesCount}}) => {
  const [liked, setLiked] = useState(false);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {postId: id },
    onError(err) {
      console.log(err);
    }
  })

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true)
    } else setLiked(false);
  }, [user, likes])

  const likeButton = user ? (
    liked ? (
      <Button color='teal'>
        <Icon name='heart'/>
      </Button>
      ) : (
      <Button color='teal' basic>
        <Icon name='heart'/>
      </Button>
      )
    ) : (
    <Button as={Link} to='/login' color='teal' basic>
      <Icon name='heart'/>
    </Button>
    );

  return (
    <Popup
      content={liked ? "Unlike this post" : "Like this post" }
      trigger={
        <Button as='div' labelPosition='right' onClick={likePost}>
          {likeButton}
          <Label basic color="teal" pointing="left">
            {likesCount}
          </Label>
        </Button>
      }
    />
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likesCount
    }
  }
`;

export default LikeButton;
