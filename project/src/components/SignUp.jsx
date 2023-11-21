import React from 'react';

const SignUp = () => {
  return (
    <div>
      <h2>Sign In</h2>
      <form>
        <label>
          User Name:
          <input
            type="text"
          />
        </label>
        <br />
        <label>
          Email:
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

export default SignUp;
