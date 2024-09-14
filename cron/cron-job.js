const pool = require('../config/database.js');

const cron = require('node-cron');
// Cron job to delete unverified users
cron.schedule('0 0 1 * *', async () => { // Runs at midnight on the first day of every month
  try {
    console.log('Running monthly cleanup...');

    // Delete unverified users older than 30 days
    await pool.query(`
      DELETE FROM users
      WHERE is_verified = false
      AND created_at < NOW() - INTERVAL '1 month'
    `);

    // Delete posts older than 1 month
    await pool.query(`
      DELETE FROM posts
      WHERE created_at < NOW() - INTERVAL '1 month'
    `);


    console.log('Cleanup completed successfully.');
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
});


// Daily cron job to clean up unverified users whose verification period has expired
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running daily cleanup of unverified users...');

    // Delete users whose email verification has expired and are older than 1 day
    await pool.query(`
      DELETE FROM users
      WHERE is_verified = false
      AND created_at < NOW() - INTERVAL '1 day'
    `);

    console.log('Daily cleanup completed successfully.');
  } catch (err) {
    console.error('Error during daily cleanup:', err);
  }
});
