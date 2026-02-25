#!/usr/bin/env node

/**
 * Pre-Deployment Checklist Script
 * Run this before deploying to verify everything is ready
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🚀 PowerLink Ethiopia - Pre-Deployment Check\n');
console.log('='.repeat(50));

let allChecksPassed = true;

// Check 1: API Config File Exists
console.log('\n📋 Checking API Configuration...');
const apiConfigPath = path.join(__dirname, 'src', 'config', 'api.js');
if (fs.existsSync(apiConfigPath)) {
  console.log('✅ API config file exists');
  
  // Check if it contains the right structure
  const apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
  if (apiConfig.includes('VITE_API_URL') && apiConfig.includes('API_ENDPOINTS')) {
    console.log('✅ API config structure is correct');
  } else {
    console.log('❌ API config structure is incorrect');
    allChecksPassed = false;
  }
} else {
  console.log('❌ API config file not found');
  allChecksPassed = false;
}

// Check 2: Environment Files
console.log('\n📋 Checking Environment Files...');
const envExamplePath = path.join(__dirname, '.env.example');
const envLocalPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envExamplePath)) {
  console.log('✅ .env.example exists');
} else {
  console.log('⚠️  .env.example not found (optional)');
}

if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local exists');
} else {
  console.log('⚠️  .env.local not found (will use defaults)');
}

// Check 3: Vercel Configuration
console.log('\n📋 Checking Vercel Configuration...');
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  console.log('✅ vercel.json exists');
  
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
    console.log('✅ SPA routing configured');
  } else {
    console.log('⚠️  SPA routing not configured');
  }
} else {
  console.log('❌ vercel.json not found');
  allChecksPassed = false;
}

// Check 4: Package.json Scripts
console.log('\n📋 Checking Build Scripts...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ Build script exists');
  } else {
    console.log('❌ Build script not found');
    allChecksPassed = false;
  }
  
  if (packageJson.scripts && packageJson.scripts.preview) {
    console.log('✅ Preview script exists');
  } else {
    console.log('⚠️  Preview script not found (optional)');
  }
} else {
  console.log('❌ package.json not found');
  allChecksPassed = false;
}

// Check 5: Documentation
console.log('\n📋 Checking Documentation...');
const docs = [
  'DEPLOYMENT_GUIDE.md',
  'DEPLOYMENT_CHECKLIST.md',
  'QUICK_DEPLOY.md'
];

docs.forEach(doc => {
  const docPath = path.join(__dirname, doc);
  if (fs.existsSync(docPath)) {
    console.log(`✅ ${doc} exists`);
  } else {
    console.log(`⚠️  ${doc} not found`);
  }
});

// Check 6: Key Components
console.log('\n📋 Checking Key Components...');
const components = [
  'src/Auth/Login.jsx',
  'src/Auth/Register.jsx',
  'src/RolePages/Customer/CustDashboard.jsx',
  'src/RolePages/Admin/NoticeAndAlerts.jsx',
  'src/RolePages/Supervisor/DocValidation.jsx'
];

let componentsOk = true;
components.forEach(comp => {
  const compPath = path.join(__dirname, comp);
  if (fs.existsSync(compPath)) {
    const content = fs.readFileSync(compPath, 'utf8');
    if (content.includes('API_ENDPOINTS') || content.includes('api.js')) {
      console.log(`✅ ${comp} - API config imported`);
    } else {
      console.log(`⚠️  ${comp} - API config might not be imported`);
      componentsOk = false;
    }
  } else {
    console.log(`❌ ${comp} not found`);
    componentsOk = false;
  }
});

if (componentsOk) {
  console.log('✅ All key components updated');
}

// Check 7: Git Status
console.log('\n📋 Checking Git Status...');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (gitStatus.trim() === '') {
    console.log('✅ No uncommitted changes');
  } else {
    console.log('⚠️  You have uncommitted changes:');
    console.log(gitStatus);
    console.log('   Consider committing before deployment');
  }
} catch (error) {
  console.log('⚠️  Could not check git status (not a git repo?)');
}

// Final Summary
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('\n✅ All critical checks passed!');
  console.log('\n🚀 You are ready to deploy!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run build');
  console.log('2. Test: npm run preview');
  console.log('3. Deploy to Vercel');
  console.log('\nSee QUICK_DEPLOY.md for detailed instructions.');
} else {
  console.log('\n❌ Some checks failed!');
  console.log('\nPlease fix the issues above before deploying.');
  process.exit(1);
}

console.log('\n' + '='.repeat(50) + '\n');
