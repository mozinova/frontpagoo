const _mainPageTools={
  "pay":{
    title:"Pagamentos",
    description:" pagamentos de forma rápida usando o pagoo",
    "template":`
  <div class="it-form">
    <div class="form-floating mb-3">
    <input type="number" placeholder="comerciante..." id="comerciante" class="form-control" ng-model="movData.contact">
    <label>id do comerciante</label>
    </div>
    <div class="form-floating mb-3">
    <input type="number" placeholder="valor..." id="value-to-pay" class="form-control" ng-model="movData.amount">
    <label>valor a pagar</label>
    </div>
    <b><label for="error" id="error-place" style="color:red">{{ movData.error }}</label></b>
    <ons-button class="form-control btn-primary" ng-click="transaction('pay')" {{ confirmButtonState }}>seguinte</ons-button>
  </div>`
  },
  "withdraw":{
    
    title:"levantar dinheiro",
    description:"levanta o dinheiro da sua carteira pagoo",
    "template":`<div class="it-form">
    <div class="form-floating mb-3">
    <input type="number" placeholder="agente..." id="agent" class="form-control" ng-model="movData.contact">
    <label>id do agente</label>
    </div>
    <div class="form-floating mb-3">
    <input type="number" placeholder="valor..." id="value-to-withdraw" class="form-control" ng-model="movData.amount">
    <label>valor a levantar</label>
    </div>
    
    <b><label for="error" id="error-place" style="color:red">{{ movData.error }}</label></b>
    <ons-button class="form-control btn-primary" ng-click="transaction('withdraw')"  {{ confirmButtonState }}>seguinte</ons-button>
  </div>`
  },
  "send_money":{
    
    "description":"envia dinheiro para qualquer conta do pagoo",
    "title":" transferir dinheiro",
    template:`<div class="it-form">
    <div class="form-floating mb-3">
    <input type="text" placeholder="destinatario..." id="dest" class="form-control" ng-model="movData.contact">
    <label>contacto do recipiente</label>
    </div>
    <div class="form-floating mb-3">
    <input type="number" placeholder="valor..." id="value" class="form-control" ng-model="movData.amount">
    <label>valor a Enviar</label>
    </div>
    <b><label for="error" id="error-place" style="color:red">{{ movData.error }}</label></b>
    <ons-button class="form-control btn-primary" ng-click="transaction('send_money')".{{ confirmButtonState }}>seguinte</ons-button>
  </div>`
  },
  "qr_code":{
    description:`faça movimentos mais rápidos, lendo códigos QR`,
    title:"ler código QR",
    template:`
   <center> <div id="qr"></div> </center>
   <div class="form-floating mb-3">
   <input type="number" class="form-control" ng-model="qr_code_data.value"/>
   <label>definir valor</label>
   </div>
   <ons-button class="form-control btn-primary" ng-click="setQrCode()" style="margin-top:0">
     <ons-icon icon="fa-money" size="large"></ons-icon>Definir valor
   </ons-button>`
  }
};

const mainPageList=[
  
  {
    img:"/static/wallet/icons/images (9).png",
    content:"Pedidos de pagamentos",
    click:"payRequests"
  },
  {
    img:"/static/wallet/icons/images (5).png",
    content:"Mudar palavra passe",
    click:"changePasswordPage"
  },
  {
    img:"/static/wallet/icons/images (11).png",
    content:"Ler código QR",
    click:"scanQrCode"
  },
 {
   img:"/static/wallet/icons/images (8).png",content :"Histórico da conta",
   click:'viewHistory'
 },
 {
   img:"/static/wallet/icons/images (6).png",
   content:"Terminar Sessão",
  click:"logout"
 }
  ];
  

const progressPage=document.getElementById("progressPage");
function showProgress(){
  progressPage.style.display="grid";
}
function hideProgress(){
  progressPage.style.display="none";
}
hideProgress();

const app_urls={
 
  change_password:"/user/change-password",
  baseurl:"https://itchy-sean-mozpay-889a750f.koyeb.app",
  history_url:'/user/history',
  login_url:"/auth",
  signup_url:"/auth/register",
  transaction:"/transaction",
  userdata_url:"/user/",
  prepare:"/query/",
  payment_request:'/transaction/list/payment-requests',
  request_payment:"/transaction/request-money",
  requestPayment_list:"/transaction/list/request-payment",
  payment_request_event_confirm:"/transaction/event/1",
  payment_request_event_cancel:"/transaction/event/0",
  get_url:(name)=>{
   
    if(!app_urls[name]){
      throw new Error("url not found :"+name)
      return false;
    }
    return app_urls.baseurl+""+app_urls[name];
  },
  options:{
    method:"POST",
    headers:{
      "Content-type":"application/json",
      "Authorization":"Ye0OGN2vhyAESLcwErGuQyV87SVHKZ+XgBYqEyQb0PU=zKSgHc1ENmWeyYfggYSAjiVxTyKwOvIB2BAWqScle1U="
    },
    body:""
  },
    put_body:(obj)=>{
      if(!typeof obj==="object"){
        throw new Error("Failed to parse body object");
        return false;
      }
      app_urls.options["body"]=JSON.stringify(obj);
    },
    request: function (url_name,body,callback){
      console.log(this.options)
      app_urls.put_body(body)
      var stat={};
      showProgress();
      fetch(app_urls.get_url(url_name),app_urls.options).then((res)=>{

        if(!res.ok){
          console.log(res.status+":"+res.statusText)
          throw new Error("Falha ao fazer requisição para a url: "+app_urls.get_url(url_name));
          callback({error:true,msg:"Falha ao se conectar!"});
          hideProgress()
          return;
        }
        return res.json();
      }).then((data)=>{
       callback(data);
       hideProgress();
      }).catch((err)=>{
        console.error(err);
        callback({error:true,msg:"Falha ao ligar!"});
        hideProgress();
      });
    
    }
  }