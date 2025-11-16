import LoginPage from '../LoginPage';

export default function LoginPageExample() {
  return (
    <LoginPage
      onLogin={(email, password, remember) => 
        console.log('Login:', { email, password, remember })
      }
    />
  );
}
