const jwt = require('jsonwebtoken');

function generateToken(userId, email, role) {
  const secret = 'powerlink_jwt_secret_local_dev_2024';
  return jwt.sign(
    { userId, email, role },
    secret,
    { expiresIn: '1h' }
  );
}

// These are assuming the IDs after seeding.
const techToken = generateToken(1, 'tech023@powerlink.com', 'technician');
const superToken = generateToken(2, 'supervisor@powerlink.com', 'supervisor');

console.log('TECH_TOKEN=' + techToken);
console.log('SUPER_TOKEN=' + superToken);
