export const TOKEN_KEY = 'fc_token'
export const USER_KEY = 'fc_user'

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  getUser: () => {
    const u = localStorage.getItem(USER_KEY)
    return u ? JSON.parse(u) : null
  },
  setUser: (u: { username: string }) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY) },
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
}
