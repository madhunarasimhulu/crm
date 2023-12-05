/* eslint-disable no-console */
export default function logError(err) {
  if (console && console.error) {
    console.error(err);
  }

  if (
    window.Rollbar &&
    window.Rollbar.error &&
    process &&
    process.env &&
    process.env.ROLLBAR_ENV &&
    process.env.ROLLBAR_ENV !== 'local-dev' &&
    process.env.ROLLBAR_ENV !== 'DEV'
  ) {
    window.Rollbar.error(err);
  }

  throw err;
}
