export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return

  try {
    const stored = localStorage.getItem('player')

    // If a player exists and we are on the login page, send them home
    if (stored && to.path === '/login') {
      return navigateTo('/')
    }

    // If no player exists and we are NOT already on login, send to login
    if (!stored && to.path !== '/login') {
      return navigateTo('/login')
    }
  } catch (error) {
    // If localStorage is unavailable for some reason, fail open to avoid lockout
    console.error('Player middleware error', error)
  }
})
