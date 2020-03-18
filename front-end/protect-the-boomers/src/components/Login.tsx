// This file is adapted from Suraj Sharma's react-material-ui-login example.
// https://github.com/creativesuraj/react-material-ui-login

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import MaterialUiPhoneNumber from 'material-ui-phone-number';
import { logIn } from '../server-api';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  }),
);

const Login = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (username.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [username, password]);

  const handleLogin = async () => {
    let response = await logIn(username, password);
    if (response.kind === "success") {
        setError(false);
        setHelperText('Login was successful! Session token: ' + response.session_token);
    }
    else if (response.kind === "invalid-credentials") {
      setError(true);
      setHelperText('Incorrect phone number or password.');
    }
    else {
      setHelperText('Could not log in due to error contacting server.');
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleLogin();
    }
  };

  return (
    <React.Fragment>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Login" />
          <CardContent>
            <div>
              <MaterialUiPhoneNumber
                error={error}
                fullWidth
                id="username"
                type="tel"
                label="Phone Number"
                placeholder="Phone Number"
                margin="normal"
                onChange={(e: any)=>setUsername(e)}
                onKeyPress={(e: any)=>handleKeyPress(e)}
                defaultCountry='us'
              />
              <TextField
                error={error}
                fullWidth
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                margin="normal"
                helperText={helperText}
                onChange={(e)=>setPassword(e.target.value)}
                onKeyPress={(e)=>handleKeyPress(e)}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={classes.loginBtn}
              onClick={()=>handleLogin()}
              disabled={isButtonDisabled}>
              Login
            </Button>
          </CardActions>
        </Card>
      </form>
    </React.Fragment>
  );
}

export default Login;
