import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks'

function Login(props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const {onChange, onSubmit, values} = useForm(addUserCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});


  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, {data: {login: userData}}){
      context.login(userData);
      navigate('/');
    },
    onError: (err) => {
      console.log(err);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function addUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label='Username'
          placeholder="Username.."
          type='text'
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label='Password'
          placeholder="Password.."
          type='password'
          name="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type='submit' primary>Submit</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className='list'>
            {Object.values(errors).map((value) => <li key={value}>{value}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login( $username: String!, $password: String! ) {
    login( username: $username, password: $password ) {
      id username email createdAt token
    }
  }
`;

export default Login;
