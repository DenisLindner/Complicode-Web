export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Fails the boot early when the environment is misconfigured.
    await import('./lib/server/env');
  }
}
