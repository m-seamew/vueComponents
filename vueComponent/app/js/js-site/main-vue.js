const firebaseConfig = {
  apiKey: "AIzaSyAyBJA6eLY1amFa1FxRNQvk4t51eo4mu30",
  authDomain: "my-vue-project-52f12.firebaseapp.com",
  databaseURL: "https://my-vue-project-52f12.firebaseio.com",
  projectId: "my-vue-project-52f12",
  storageBucket: "my-vue-project-52f12.appspot.com",
  messagingSenderId: "324819722809",
  appId: "1:324819722809:web:18953d25602a67f514a3e8",
  measurementId: "G-HV67ZBN7QH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.database();

let messagesRef = database.ref('messages');

Vue.component('chat-main', {
  template: '#chat-main-template',
  data: function () {
    return {
      messages: [],
      messageText: '',
      nickname: 'hootlex',
      editingMessage: null,
    }
  },

  methods: {
    storeMessage() {
      messagesRef.push({ text: this.messageText, nickname: this.nickname });
      this.messageText = '';
    },
    deleteMessage(el) {
      messagesRef.child(el.id).remove();
    },
    editMessage(el) {
      this.editingMessage = el;
      this.messageText = el.text;
    },
    cancelMessage() {
      this.editingMessage = null;
      this.messageText = '';
    },
    updateMessage() {
      messagesRef.child(this.editingMessage.id).update({ text: this.messageText });
      this.cancelMessage();
    }
  },
 
  created() {

    messagesRef.on('child_added', shapshot => {
      this.messages.push({ ...shapshot.val(), id: shapshot.key });

      if (this.nickname !== shapshot.val().nickname) {
        nativeToast({
          message: `new message by ${shapshot.val().nickname}`,
          position: 'top',
          type: 'success'
        });
      }
    });

    messagesRef.on('child_removed', snapshot => {
      let removedItem = this.messages.find(el => el.id === snapshot.key);
      this.messages.splice(this.messages.indexOf(removedItem), 1);
    });
    messagesRef.on('child_changed', snapshot => {
      let updatedItem = this.messages.find(el => el.id === snapshot.key);
      updatedItem.text = snapshot.val().text;
    });
  }
});

Vue.component('login-form', {
  template: '#login-form-template',
  data: function () {
    return {
      email: '',
      password: '',
      authUser: '',
      userName: null,
      userPhoto: null,
      newPassword: null,
    }
  },
  methods: {
    register(){
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .catch(error => alert('Error:'+error.message));
    },
    login(){
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .catch(error => alert('Error:'+error.message));
    },
    signOut() {
      firebase.auth().signOut();
    },
    loginGoogle(){
      const provider = new firebase.auth.FacebookAuthProvider()

      firebase.auth().signInWithPopup(provider) 
      .catch(error => console.log('Error:'+error.message))
      .then(data => console.log(data.user, data.credential.accessToken))
    },
    changeUserData(){
      this.authUser.updateProfile({
        displayName: this.userName,
        photoURL: this.userPhoto,
      }) 
    },
    changeEmail(){
      this.authUser.updateEmail(this.email)
    },
    changePassword(){
      this.authUser.updatePassword(this.newPassword)
      .then(() => this.newPassword = '')
      .catch(error => alert('Error:'+error.message))
    },
    linkGoogle(){
      const provider = new firebase.auth.GoogleAuthProvider()
      this.authUser.linkWithPopup(provider)
      .catch(error => console.log('Error:'+error.message))
    },
    unlinkGoogle(){
      this.authUser.unlink('google.com')
    }
  },
  computed: {
    linkedGoogle(){
      return !!this.authUser.providerData.find(el => el.providerId === 'google.com');
    },
    linkedPasword(){
      return !!this.authUser.providerData.find(el => el.providerId === 'password');
    },
  },
  created(){
    firebase.auth().onAuthStateChanged(user => { 
      this.authUser = user;
      if(user){
      this.dispalyName = user.userName;
      this.photoUrl = user.userPhoto;}
    })
  }
});

new Vue({
  el: "#app",
})







