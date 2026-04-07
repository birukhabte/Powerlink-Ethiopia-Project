const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING DATABASE ---');

  // Find or create a technician
  const technicianPassword = await bcrypt.hash('tech123', 10);
  const technician = await prisma.user.upsert({
    where: { username: 'tech023' },
    update: {},
    create: {
      username: 'tech023',
      email: 'tech023@powerlink.com',
      password_hash: technicianPassword,
      first_name: 'Biruk',
      last_name: 'Habte',
      role: 'technician',
      phone: '0911223344',
      is_active: true
    },
  });
  console.log('Technician created/found:', technician.username);

  // Find or create a supervisor
  const supervisorPassword = await bcrypt.hash('super123', 10);
  const supervisor = await prisma.user.upsert({
    where: { username: 'supervisor01' },
    update: {},
    create: {
      username: 'supervisor01',
      email: 'supervisor@powerlink.com',
      password_hash: supervisorPassword,
      first_name: 'Abebe',
      last_name: 'Bikila',
      role: 'supervisor',
      phone: '0988776655',
      is_active: true
    },
  });
  console.log('Supervisor created/found:', supervisor.username);

  // Create some service requests for the technician
  const requests = [
    {
      ticket_id: 'SR-1001',
      service_type: 'Outage Repair',
      full_name: 'Kebede Ayele',
      phone: '0900112233',
      city: 'Addis Ababa',
      woreda: 'Bole',
      kebele: '03',
      full_address: 'Bole, near Edna Mall',
      status: 'in_progress',
      priority: 'high',
      assigned_to: technician.id,
      scheduled_date: new Date()
    },
    {
      ticket_id: 'SR-1002',
      service_type: 'Meter Installation',
      full_name: 'Sara Tadesse',
      phone: '0944556677',
      city: 'Addis Ababa',
      woreda: 'Kirkos',
      kebele: '12',
      full_address: 'Kazanchis, block 4',
      status: 'assigned',
      priority: 'medium',
      assigned_to: technician.id,
      scheduled_date: new Date(Date.now() + 86400000) // Tomorrow
    }
  ];

  for (const req of requests) {
    await prisma.serviceRequest.upsert({
      where: { ticket_id: req.ticket_id },
      update: req,
      create: req,
    });
  }
  console.log('Assigned service requests created/updated');

  // Create some pending requests for the supervisor
  const pendingRequests = [
    {
      ticket_id: 'SR-1003',
      service_type: 'New Connection',
      full_name: 'Yilkal G.',
      phone: '0922334455',
      city: 'Addis Ababa',
      woreda: 'Yeka',
      kebele: '01',
      full_address: 'Megenagna area',
      status: 'pending',
      priority: 'high'
    },
    {
      ticket_id: 'SR-1004',
      service_type: 'Maintenance',
      full_name: 'Desta B.',
      phone: '0933445566',
      city: 'Addis Ababa',
      woreda: 'Arada',
      kebele: '10',
      full_address: 'Piazza',
      status: 'pending',
      priority: 'medium'
    }
  ];

  for (const req of pendingRequests) {
    await prisma.serviceRequest.upsert({
      where: { ticket_id: req.ticket_id },
      update: req,
      create: req,
    });
  }
  console.log('Pending service requests created/updated');

  console.log('--- SEEDING COMPLETED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
