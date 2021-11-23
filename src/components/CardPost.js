import React, { useContext } from 'react';
import { Button, Card, Image, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import moment from 'moment';

import {AuthContext} from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

function CardPost({post: {id, username, body, createdAt, likesCount, commentsCount, likes}}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid style={{ marginBottom: 20 }}>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>{body}</Card.Description>
        <div>
          <LikeButton user={user} post={{id, likes, likesCount}}/>
          <Popup
            content="Comment this post"
            trigger={
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
                as={Link}
                to={`/posts/${id}`}
              />
            }
          />
          {user && user.username === username && (
            <DeleteButton postId={id}/>
          )}
        </div>
      </Card.Content>
    </Card>
  )
}

export default CardPost;
