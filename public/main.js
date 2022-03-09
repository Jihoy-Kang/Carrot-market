const firebaseConfig = {
  apiKey: "AIzaSyDmIQyg7V3jnmnTD8CzRIhg4ix2KImtxcg",
  authDomain: "my-carrot-market.firebaseapp.com",
  projectId: "my-carrot-market",
  storageBucket: "my-carrot-market.appspot.com",
  messagingSenderId: "1074709395330",
  appId: "1:1074709395330:web:6916ff597401d3d974419b"
};


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

db.collection("product")
  .get()
  .then((result)=>{
    result.forEach((doc)=>{
      let itemTemplate = `
      <div class="product">
          <div class="thumbnail"><img src ="${doc.data().url}"></div>
          <div class="flex-grow-1 p-4">
              <h5 class="title">${doc.data().title}</h5>
              <p class="date">${doc.data().date}</p>
              <p class="price">${doc.data().price}원</p>
              <p class="float-end">♥0</p>
          </div>
      </div>`
      $('.list').append(itemTemplate) // html에넣는 jquery
    })
  })


  //db.collection("product").doc('상품3').set({제목 : '변기'}) // set은 id를 지정하여 데이터베이스에 저장
  //db.collection("product").add({제목 : '변기'}) // add는 id를 임의로 지정하여 데이터베이스에 저장.

$('#send').click(function uploadData(){
  let file = document.querySelector('#image').files[0];
  let storageRef = storage.ref();
  let storageURL = storageRef.child('image/' + file.name);
  let stoagePath = storageURL.put(file);
  
  stoagePath.on( 'state_changed', 
    // 변화시 동작하는 함수 
    null, 
    //에러시 동작하는 함수
    (error) => {
      console.error('실패사유는', error);
    }, 
    // 성공시 동작하는 함수
    () => {
      stoagePath.snapshot.ref.getDownloadURL().then((url) => {
        console.log('업로드된 경로는', url);

        let itemList ={
          title : $('#title').val(),
          price : Number($('#price').val()),
          content : $('#content').val(),
          date : new Date(), 
          url : url,
        }
      
        db.collection("product").add(itemList)
          .then((result)=>{ 
            //성공 후 실행할 코드입력
            console.log(result)
            window.location.href = "/index.html" //  위치 변경 명령어
          })
          .catch((err)=>{
            //실패 할시 실행할 코드
            console.log(err)
          })
      });
    }
);
})

$('#register').click(function(){

  let email = $('#email-new').val()
  let password =  $('#pw-new').val()

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((result)=>{
    console.log(result)
    console.log(result.user)
  })
  .catch()

})
