import './Auth.scss';

import { useState } from 'react';

import { Button, Container, Row, Col } from 'react-bootstrap';

import util from '../../util/helpers';
import services from '../../services';

const performLogin = (email, pass) => {
  // util.setLoggedIn("rahul.pillai03");
  // window.location = "/";
  services.getLogin(email, pass);
  // window.location = "/";
}
const createAccount = (firstname,lastname,email, pass) => {

  services.postCreateAccount(firstname,lastname,email, pass);

}

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  return (
    <div className="component-auth">
      <Container>
        <h1>{isSignUp ? 'Create Account' : 'Login'}</h1>
        {isSignUp &&
          <Row className='mt-2'>
            <Col><input onChange={ (e) => setFirstname(e.target.value) }  type="firstname" class="form-control" id="field-firstname" placeholder="First Name"></input></Col>
          </Row>
     
        
        }
        {isSignUp &&
          <Row className='mt-2'>
              <Col><input onChange={ (e) => setLastname(e.target.value) }  type="text" class="form-control" id="field-lastname" placeholder="Last Name"></input></Col>
        </Row>

        }
        <Row className='mt-4'>
          <Col><input onChange={ (e) => setEmail(e.target.value) } type="text" class="form-control" id="field-email" placeholder="Email"></input></Col>
        </Row>
        <Row className='mt-2'>
          <Col><input onChange={ (e) => setPass(e.target.value) } type="password" class="form-control" id="field-pass" placeholder="Password"></input></Col>
        </Row>
        {isSignUp &&
          <Row className='mt-2'>
            <Col><input type="password" class="form-control" id="field-pass-retype" placeholder="Re-type Password"></input></Col>
          </Row>
        }
        {!isSignUp &&
          <Row className='mt-2'>
            <Col><Button variant="link" onClick={ () => setIsSignUp(true) }>New user? Click here to sign up.</Button></Col>
          </Row>
        }
          {!isSignUp &&
        <Row className='mt-4'>
          <Col><Button onClick={() => performLogin(email, pass)}>Login</Button></Col>
        </Row>}
        {isSignUp &&
               <Row className='mt-4'>
               <Col><Button onClick={() => createAccount(firstname,lastname,email, pass)}>Signup</Button></Col>
             </Row>
        }
      </Container>
    </div>
  );
}

export default Auth;
