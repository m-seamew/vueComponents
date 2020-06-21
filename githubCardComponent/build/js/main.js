

let githubUserCard = {
  template: '#github-user-card-template',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userdata: {}
    }
  },
  created() {
    axios
    .get(`https://api.github.com/users/${this.username}`)
    .then(req => this.userdata = req.data)
  },
  computed: {
    joined: function () {
      let data = new Date(this.userdata.created_at);
      let text = 'Joined in ' + data.getFullYear();
      return text;
    },
  }
}

new Vue({
    el: '#app',
    components: {
      'github-user-card': githubUserCard,
    },
    data: {
      username: ['m-seamew', 'torvalds', 'hydra'],
    }
  })