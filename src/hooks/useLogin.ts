const userAtom = atomWithStorage<{
  name?: string
  avatar?: string
}>("user", {})

const jwtAtom = atomWithStorage("jwt", "")

const enableLoginAtom = atomWithStorage<{
  enable: boolean
  url?: string
}>("login", {
  enable: true,
})

enableLoginAtom.onMount = (set) => {
  myFetch("/enable-login").then((r) => {
    set(r)
  }).catch((e) => {
    if (e.statusCode === 506) {
      set({ enable: false })
      localStorage.removeItem("jwt")
    }
  })
}

export function useLogin() {
  return {
    loggedIn: false,
    userInfo: {},
    enableLogin: false,
    logout: () => {},
    login: () => {},
  }
}
