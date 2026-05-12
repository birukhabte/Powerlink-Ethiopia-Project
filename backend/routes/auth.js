const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      userType, 
      phone,
      bpNumber,
      city,
      woreda,
      kebele,
      housePlotNumber,
      nearbyLandmark,
      accountType,
      organizationName,
      organizationType
    } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Determine role - default to 'customer' if not specified
    const role = userType || 'customer';

    // Generate username from email (part before @)
    const username = email.split('@')[0];

    // Construct full address from components
    const fullAddress = [city, woreda, kebele, housePlotNumber, nearbyLandmark]
      .filter(Boolean)
      .join(', ');

    // Insert new user with all fields
    const newUser = await pool.query(
      `INSERT INTO users (
        email, username, password_hash, first_name, last_name, role, phone,
        bp_number, city, woreda, kebele, house_plot_number, nearby_landmark, address,
        account_type, organization_name, organization_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
      RETURNING id, email, username, first_name, last_name, role`,
      [
        email, 
        username,
        passwordHash, 
        firstName, 
        lastName, 
        role, 
        phone || null,
        bpNumber || null,
        city || null,
        woreda || null,
        kebele || null,
        housePlotNumber || null,
        nearbyLandmark || null,
        fullAddress || null,
        accountType || 'individual',
        organizationName || null,
        organizationType || null
      ]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Server error during registration',
      details: error.message 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Find user by email or username
    console.log('Querying database...');
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [email]
    );

    console.log('Query result:', user.rows.length, 'users found');

    if (user.rows.length === 0) {
      console.log('No user found with email:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const userData = user.rows[0];
    console.log('User found:', userData.email, 'Role:', userData.role);

    // Check password
    console.log('Checking password...');
    const validPassword = await bcrypt.compare(password, userData.password_hash);
    console.log('Password valid:', validPassword);

    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { userId: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Server error during login',
      details: error.message 
    });
  }
});

module.exports = router;
