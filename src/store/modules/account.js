export default {
  state: {
    data: false,
  },
  getters: {},
  actions: {
    logout(context) {
      context.commit("updateAccount", false);
    },
  },
  mutations: {
    updateAccount(state, data) {
      return (state.data = data);
    },
  },
};
