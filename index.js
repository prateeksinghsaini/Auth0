// server.js

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json());

const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-fdzhuhkeczctb04h.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://dev-fdzhuhkeczctb04h.us.auth0.com/api/v2/',
  issuer: 'https://dev-fdzhuhkeczctb04h.us.auth0.com/',
  algorithms: ['RS256'],
});

const sendEmailToken = async (toEmail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'prateek1901267@gmail.com', 
        pass: 'hjig wcek fhxx dxfs',
      },
    });

    const mailOptions = {
      from: 'prateek1901267@gmail.com',
      to: toEmail,
      subject: 'Your Login Token',
      text: `Click the link to login: http://localhost:5173/auth/callback?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const authToken = jwt.sign(
      { email },
      'your_custom_secret_key',
      { expiresIn: '1h' }
    );

    await sendEmailToken(email, authToken);

    return res.status(200).json({ message: 'Authentication token sent to email' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/protected', checkJwt, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route', user: req.user });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
