const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Education = require('../models/Education');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    console.log('🧹 Clearing existing collections...');

    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Education.deleteMany({});
    await PlacementDrive.deleteMany({});
    await Application.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('🌱 Creating default Users...');

    // 1. Admin — credentials come from .env (same as ensureAdmin uses)
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name:     (process.env.ADMIN_NAME   || 'College Placement Cell').trim(),
        email:    (process.env.ADMIN_EMAIL  || 'admin@yuvasetu.edu').toLowerCase().trim(),
        mobile:   (process.env.ADMIN_MOBILE || '9876543210').trim(),
        password: process.env.ADMIN_PASSWORD || 'Admin@YuvaSetu#2026',
        role: 'admin',
      });
    }

    // 2. Student 1 - Sara Sharma
    const student1 = await User.create({
      name: 'Sara Sharma',
      email: 'student@yuvasetu.edu',
      mobile: '9898989898',
      password: 'Student@123',
      role: 'student',
    });

    // 3. Student 2 - Rahul Verma
    const student2 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@yuvasetu.edu',
      mobile: '9123456789',
      password: 'Rahul@123',
      role: 'student',
    });

    console.log('🌱 Creating Student Profiles & Academics...');

    // Student 1 Profile
    const profile1 = await StudentProfile.create({
      user: student1._id,
      fullName: 'Sara Sharma',
      email: student1.email,
      mobile: student1.mobile,
      dob: new Date('2003-05-15'),
      gender: 'Female',
      address: 'Sector 62, Noida, Uttar Pradesh, 201301',
      skills: ['React', 'JavaScript', 'Node.js', 'Python', 'SQL', 'Data Structures', 'Git'],
      currentAcademic: {
        course: 'B.Tech - Computer Science & Engineering',
        college: 'Apex Institute of Technology',
        university: 'State Technical University',
        currentYear: '4th Year',
        currentSemester: '7th Semester',
        division: 'A',
        batch: '2023-2027',
        specialization: 'Artificial Intelligence & Software Systems',
        currentCgpa: 8.7,
        backlogs: 0,
        expectedGraduationYear: 2027,
      },
    });

    // Student 1 Education
    await Education.create({
      user: student1._id,
      tenth: {
        school: 'Delhi Public School',
        board: 'CBSE',
        passingYear: 2020,
        percentage: 92.4,
      },
      twelfth: {
        college: 'Delhi Public School',
        board: 'CBSE',
        passingYear: 2022,
        percentage: 89.6,
      },
      graduation: {
        degree: 'B.Tech CSE',
        college: 'Apex Institute of Technology',
        university: 'State Technical University',
        specialization: 'Computer Science',
        passingYear: 2027,
        cgpaOrPercentage: 8.7,
      },
    });

    // Student 2 Profile
    const profile2 = await StudentProfile.create({
      user: student2._id,
      fullName: 'Rahul Verma',
      email: student2.email,
      mobile: student2.mobile,
      dob: new Date('2002-11-20'),
      gender: 'Male',
      address: 'Civil Lines, Jaipur, Rajasthan, 302006',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'REST APIs', 'HTML/CSS'],
      currentAcademic: {
        course: 'B.Tech - Information Technology',
        college: 'Apex Institute of Technology',
        university: 'State Technical University',
        currentYear: '4th Year',
        currentSemester: '7th Semester',
        division: 'B',
        batch: '2023-2027',
        specialization: 'Cloud Computing & Enterprise Architecture',
        currentCgpa: 7.8,
        backlogs: 1,
        expectedGraduationYear: 2027,
      },
    });

    // Student 2 Education
    await Education.create({
      user: student2._id,
      tenth: {
        school: 'St. Xavier High School',
        board: 'ICSE',
        passingYear: 2019,
        percentage: 84.0,
      },
      twelfth: {
        college: 'St. Xavier Senior Secondary',
        board: 'CBSE',
        passingYear: 2021,
        percentage: 81.5,
      },
      graduation: {
        degree: 'B.Tech IT',
        college: 'Apex Institute of Technology',
        university: 'State Technical University',
        specialization: 'Information Technology',
        passingYear: 2027,
        cgpaOrPercentage: 7.8,
      },
    });

    console.log('🌱 Creating Placement Drives...');

    const drives = await PlacementDrive.create([
      {
        companyName: 'Google India',
        companyLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
        jobRole: 'Software Development Engineer (L3)',
        jobDescription:
          'Join Google Engineering to build world-scale distributed systems, machine learning pipelines, and high-performance web applications.',
        requiredSkills: ['Data Structures', 'Algorithms', 'Python', 'Java', 'Problem Solving'],
        eligibilityCriteria: 'B.Tech (CSE / IT / ECE) with minimum 8.0 CGPA and 0 active backlogs.',
        minCgpa: 8.0,
        minPercentage: 75,
        maxBacklogs: 0,
        salaryPackage: '28.5 LPA',
        location: 'Bengaluru / Hyderabad',
        driveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        driveStatus: 'Active',
        createdBy: admin._id,
      },
      {
        companyName: 'Microsoft Corporation',
        companyLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
        jobRole: 'Cloud Solution Associate',
        jobDescription:
          'Design and deploy Azure-based enterprise architectures, modernize legacy infrastructure, and collaborate with enterprise clients.',
        requiredSkills: ['Node.js', 'React', 'Cloud Basics', 'REST APIs', 'SQL'],
        eligibilityCriteria: 'Minimum 7.5 CGPA, 0 backlogs permitted.',
        minCgpa: 7.5,
        minPercentage: 70,
        maxBacklogs: 0,
        salaryPackage: '22.0 LPA',
        location: 'Hyderabad, India',
        driveDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        driveStatus: 'Active',
        createdBy: admin._id,
      },
      {
        companyName: 'TCS Digital',
        companyLogo: '',
        jobRole: 'Digital Systems Engineer',
        jobDescription:
          'Core development role in modern enterprise transformation, microservices, cloud migration, and data pipelines.',
        requiredSkills: ['Java', 'Python', 'SQL', 'Web Technologies'],
        eligibilityCriteria: 'Minimum 6.5 CGPA, up to 1 active backlog permitted.',
        minCgpa: 6.5,
        minPercentage: 60,
        maxBacklogs: 1,
        salaryPackage: '7.5 LPA',
        location: 'Pan-India',
        driveDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        driveStatus: 'Active',
        createdBy: admin._id,
      },
      {
        companyName: 'Zomato',
        companyLogo: '',
        jobRole: 'Product Frontend Engineer',
        jobDescription:
          'Craft silky-smooth user interfaces, interactive order tracking experiences, and high-performance merchant apps using React and modern CSS.',
        requiredSkills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Redux'],
        eligibilityCriteria: 'Minimum 7.0 CGPA, 0 backlogs permitted.',
        minCgpa: 7.0,
        minPercentage: 65,
        maxBacklogs: 0,
        salaryPackage: '14.0 LPA',
        location: 'Gurugram, Haryana',
        driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        driveStatus: 'Upcoming',
        createdBy: admin._id,
      },
    ]);

    console.log('🌱 Creating Applications...');

    // Fake resume in student1 profile for demo eligibility
    profile1.resume = {
      filePath: 'uploads/resumes/sample-sara-resume.pdf',
      originalName: 'Sara_Sharma_Resume.pdf',
      fileSize: 142000,
      uploadedAt: new Date(),
    };
    await profile1.save();

    // Student 1 applications
    await Application.create([
      {
        drive: drives[0]._id, // Google
        student: student1._id,
        status: 'Shortlisted',
        remarks: 'Excellent technical interview score in DSA round. Final round on Monday.',
      },
      {
        drive: drives[1]._id, // Microsoft
        student: student1._id,
        status: 'Applied',
        remarks: 'Application under initial screening.',
      },
      {
        drive: drives[2]._id, // TCS Digital
        student: student2._id,
        status: 'Shortlisted',
        remarks: 'Online assessment cleared with 88%.',
      },
    ]);

    console.log('🌱 Creating Activity Audit Logs...');

    await ActivityLog.create([
      {
        user: admin._id,
        userEmail: admin.email,
        userRole: 'admin',
        action: 'Placement Drive Creation',
        httpMethod: 'POST',
        endpoint: '/api/drives',
        statusCode: 201,
        ipAddress: '127.0.0.1',
        responseTime: 42,
        details: { company: 'Google India', role: 'SDE-1' },
        timestamp: new Date(Date.now() - 3600 * 1000 * 4),
      },
      {
        user: student1._id,
        userEmail: student1.email,
        userRole: 'student',
        action: 'Login',
        httpMethod: 'POST',
        endpoint: '/api/auth/login',
        statusCode: 200,
        ipAddress: '127.0.0.1',
        responseTime: 28,
        timestamp: new Date(Date.now() - 3600 * 1000 * 3),
      },
      {
        user: student1._id,
        userEmail: student1.email,
        userRole: 'student',
        action: 'Profile Update',
        httpMethod: 'PUT',
        endpoint: '/api/student/profile',
        statusCode: 200,
        ipAddress: '127.0.0.1',
        responseTime: 35,
        timestamp: new Date(Date.now() - 3600 * 1000 * 2),
      },
      {
        user: student1._id,
        userEmail: student1.email,
        userRole: 'student',
        action: 'Placement Application',
        httpMethod: 'POST',
        endpoint: `/api/applications/apply/${drives[0]._id}`,
        statusCode: 201,
        ipAddress: '127.0.0.1',
        responseTime: 51,
        details: { company: 'Google India' },
        timestamp: new Date(Date.now() - 3600 * 1000 * 1),
      },
      {
        user: admin._id,
        userEmail: admin.email,
        userRole: 'admin',
        action: 'Application Status Update',
        httpMethod: 'PUT',
        endpoint: '/api/applications/status',
        statusCode: 200,
        ipAddress: '127.0.0.1',
        responseTime: 22,
        details: { status: 'Shortlisted' },
        timestamp: new Date(Date.now() - 1800 * 1000),
      },
    ]);

    console.log('✅ YuvaSetu Demo Seed Completed Successfully!');
    console.log('--------------------------------------------------');
    console.log('🔑 Demo STUDENT Credentials:');
    console.log('   Email:    student@yuvasetu.edu');
    console.log('   Password: Student@123');
    console.log('--------------------------------------------------');
    console.log('ℹ️  Admin credentials are configured in .env');
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    if (require.main === module) {
      await disconnectDB();
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
