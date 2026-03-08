/**
 * Seeding script for Prashanthi Uniforms Firebase Database
 * 
 * Instructions:
 * 1. Ensure you have installed `firebase-admin` (npm install firebase-admin)
 * 2. Download your Firebase Admin SDK service account key JSON file from Firebase Console -> Project Settings -> Service Accounts.
 * 3. Place the JSON file in the same directory as this script and name it `serviceAccountKey.json`.
 * 4. Run `node seed.js`
 */

const admin = require('firebase-admin');

// IMPORTANT: Replace this path with the actual path to your service account key file
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const schools = [
  { schoolId: 'SCH001', schoolName: 'Vivekananda Vidyalaya Matric Hr Sec School', district: 'Tiruppur' },
  { schoolId: 'SCH002', schoolName: 'Sri Sakthi International School', district: 'Erode' },
  { schoolId: 'SCH003', schoolName: 'Little Flower Matriculation School', district: 'Tiruppur' },
  { schoolId: 'SCH004', schoolName: 'Kongu Vellalar Matriculation School', district: 'Erode' },
  { schoolId: 'SCH005', schoolName: 'Bharathi Vidya Bhavan Matric School', district: 'Tiruppur' },
  { schoolId: 'SCH006', schoolName: 'Erode Hindu Kalvi Nilayam', district: 'Erode' },
  { schoolId: 'SCH007', schoolName: 'Velalar Matriculation Higher Secondary School', district: 'Erode' },
  { schoolId: 'SCH008', schoolName: 'Infant Jesus Matriculation School', district: 'Tiruppur' },
];

const products = [
  { productId: 'PRD001', schoolId: 'SCH001', productName: 'Boys Uniform Set', category: 'Uniform', price: 1200, sizes: ['28', '30', '32', '34', '36'], color: 'White Shirt + Navy Blue Pant', stock: 50 },
  { productId: 'PRD002', schoolId: 'SCH001', productName: 'Girls Uniform Set', category: 'Uniform', price: 1300, sizes: ['28', '30', '32', '34', '36'], color: 'White Shirt + Navy Blue Skirt', stock: 45 },
  { productId: 'PRD003', schoolId: 'SCH002', productName: 'Sports Uniform', category: 'Uniform', price: 900, sizes: ['28', '30', '32', '34'], color: 'Red T-shirt + Black Shorts', stock: 60 },
  { productId: 'PRD004', schoolId: 'SCH003', productName: 'School Tie', category: 'Accessory', price: 150, sizes: [], color: 'Maroon', stock: 100 },
  { productId: 'PRD005', schoolId: 'SCH004', productName: 'School Belt', category: 'Accessory', price: 200, sizes: [], color: 'Black', stock: 80 },
  { productId: 'PRD006', schoolId: 'SCH005', productName: 'School Socks', category: 'Accessory', price: 120, sizes: [], color: 'White', stock: 150 },
  { productId: 'PRD007', schoolId: 'SCH006', productName: 'School Bag', category: 'Accessory', price: 750, sizes: [], color: 'Blue', stock: 40 },
  { productId: 'PRD008', schoolId: 'SCH007', productName: 'ID Card Belt', category: 'Accessory', price: 100, sizes: [], color: 'Red', stock: 120 },
];

async function seedData() {
  try {
    console.log('Seeding schools...');
    for (const school of schools) {
      await db.collection('schools').doc(school.schoolId).set(school);
    }
    console.log('Schools seeded successfully!');

    console.log('Seeding products...');
    for (const product of products) {
      await db.collection('products').doc(product.productId).set(product);
    }
    console.log('Products seeded successfully!');

    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();
