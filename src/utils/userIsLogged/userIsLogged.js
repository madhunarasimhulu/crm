export default function userIsLogged(user) {
  return user && user.token && user.token.length > 1;
}
