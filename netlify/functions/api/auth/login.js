const { NextResponse } = require('next/server');

exports.handler = async (event, context) => {
  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    const user = {
      id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
    };

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        user,
        token: `token_${Date.now()}`,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `session=${JSON.stringify(user)}; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
      },
    };

    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
