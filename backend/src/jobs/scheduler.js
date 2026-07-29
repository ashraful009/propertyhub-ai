const { runAutoCancelInactiveBookings } = require('./autoCancelInactiveBookings');

const ONE_DAY_MS    = 24 * 60 * 60 * 1000;
const STARTUP_DELAY = 30 * 1000; 

let dailyTimer = null;

const safeRun = async (label, fn) => {
  try {
    await fn();
  } catch (err) {
    console.error(` Scheduled job "${label}" crashed:`, err.message);
  }
};

const startScheduler = () => {
  if (process.env.DISABLE_CRON === 'true') {
    console.log('⏸️  Cron scheduler disabled via DISABLE_CRON=true');
    return;
  }

  setTimeout(() => {
    safeRun('auto-cancel-inactive-bookings', runAutoCancelInactiveBookings);
  }, STARTUP_DELAY);

  dailyTimer = setInterval(() => {
    safeRun('auto-cancel-inactive-bookings', runAutoCancelInactiveBookings);
  }, ONE_DAY_MS);

  console.log('️  Daily policy scheduler started (auto-cancellation scan).');
};

const stopScheduler = () => {
  if (dailyTimer) clearInterval(dailyTimer);
  dailyTimer = null;
};

module.exports = { startScheduler, stopScheduler };
