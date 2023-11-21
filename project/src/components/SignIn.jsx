import React from 'react';

const SignIn = () => {
  return (
    <div>
      <h2>Sign In</h2>
      <form>
        <label>
          User Name:
          <input
            type="email"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
          />
        </label>
        <br />
        <button type="button">
          Sign In
        </button>
      </form>
    </div>
  );
};


export default SignIn;
