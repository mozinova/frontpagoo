const app=angular.module("mainapp",["ngRoute"]);
function goto(link){
  window.location.href="#!/".concat(link);
};
function qrcode(txt, reset = false) {
  var element = document.getElementById("qr");
  if (reset) {
    element.innerHTML= "";
  }
  if (!element.innerHTML.replace(/\s/g, "") == "") {
    return;
  }
  element.classList.remove("btn");
  element.classList.remove("btn-secondary");
  const qrcode = new QRCode(element, {
    height: 200,
    width: 200
  }).makeCode(txt);
}
function readCode(code){
 
  try{
    const data=JSON.parse(code);
   
    if(!data["t"] || data["t"]==""){
      
    swal("Erro","Esse código não é válido para o pagoo","error");
    return;
    }
    const injector=angular.element(document.querySelector("#app")).injector();
  const root=injector.get("$rootScope");
  root.$broadcast("signal",data);
    
  }
  catch(e){
    swal("Erro","Esse código não é válido para o pagoo","error");
  }
}
function _login(){
  const injector=angular.element(document.querySelector("#app")).injector();
  console.log(injector )
  const root=injector.get("$rootScope");
  root.$broadcast("makeByPass","Daniel")
}
document.addEventListener('DOMContentLoaded', function() {
   //alert("Olá Mundo")
});
function useBiometric(){
  if(typeof Android!=="undefined"){
    Android.useBiometric("_login();");
  }
}

app.controller("mainCtrl",($scope) =>{
  
  
  $scope.$on("makeByPass",(event,data)=>{
    
    var l_p=localStorage.getItem("last_used_contact"),last_pss=localStorage.getItem("l_u_p");
    $scope.user_auth.contact=l_p;
    $scope.user_auth.password=last_pss;
    $scope.login();
  });
  
  $scope.goto=(link)=>{
   goto(link);
 };
 $scope.$on("signal",(event,data)=>{
  
   if(typeof data!=="object"){
     
    swal("Erro","Esse código não é válido para o pagoo","error");
     return;
   }
  
   if(data.c!="" && data.v!==undefined){
     $scope.movData.contact=data.c;
  $scope.movData.amount=data.v;
  $scope.transaction(data.t);
  return;
   }
   
   else{
     if(data.c!=""){
       $scope.movData.contact=data.c;
       $scope.setToolState(data.t,true);
       return ;
     }
   }
 });
  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
    var url=current.$$route.originalPath;
    var token=window.sessionStorage.getItem('token');
 
    if (url!="/login" && (token==null || token=="")){
      $scope.goto('login');
    }
  if (current.$$route.originalPath === "/" && previous.$$route.originalPath!="/login" ) {
     $scope.initHome();
    // Recarregar sempre ao retornar ao menu principal
  }
  if(url=="/login" && token!=null){
    $scope.goto("");
  }else{
    
    var l_p=localStorage.getItem("last_used_contact"),last_pss=localStorage.getItem("l_u_p");
  $scope.canUseBiometric=typeof Android!=="undefined" && l_p!=null && l_u_p!=null?"block":"none";
  
  }
  if(url=="/confirm" && !$scope.data_to_send._value){
    $scope.goto("");
  }
});

  $scope.imgDone="/wallet/t_s.png";
  $scope.alert_state="none";  

 
$scope.confirmPlaceState="block";
$scope.transactionDetailsState="none";
$scope.userData={};
 $scope.initHome=()=>{
 $scope.alert_state="none";
 app_urls.request("userdata_url",{token:window.sessionStorage.getItem('token')},(data)=>{
   if(data.userData){
     $scope.userData=JSON.parse(data
    .userData);
    $scope.userData.cash=parseFloat($scope.userData.cash).toFixed(2);
    $scope.$apply();
    localStorage.setItem("userData",data.userData);
    if($scope.userData._type=="business" && mainPageList[mainPageList.length-1]["click"]=="logout"){
      mainPageList.push({
        content:"Solicitar pagamento",
        img:"/wallet/icons/transferir (4).jpeg",
        click:"requestPayment"
      });
    }
    else if (!mainPageList[mainPageList.length-1]["click"]=="logout"){
      mainPageList.pop();
      
    }
    $scope.$apply();
   }
   else{
     $scope.goto("login");
   }
 });
 }
 $scope.movData={
   contact:"",
   amount:"",
   error:""
 };
 $scope.confirmButtonState="";
 $scope.transaction=(context)=>{
   if($scope.confirmButtonState=="disabled") return;
  $scope.confirmButtonState="disabled";
  $scope.context=context;
   var contexts=["send_money","pay","withdraw","qr_code"];
   if(contexts.indexOf(context)<0){
     $scope.movData.error="ocorreu um error inesperado";
     $scope.confirmButtonState="";
     return;
   }
   var data={recipient:$scope.movData.contact,value:$scope.movData.amount};
  if(data.recipient+"".replace(/\s/g,"")=="" || data.value+"".replace(/\s/g,"")==""){
    $scope.movData.error="os campos nao podem estar vazios";
    
   $scope.confirmButtonState="";
   return;
  }
  if(parseFloat(data.value+"")<1){
    $scope.movData.error="nao pode transferir abaixo de 1 MT"
    $scope.confirmButtonState="";
    return;
  }
  var contact=data.recipient;
  app_urls.request("prepare",{token:sessionStorage.getItem("token"),recipient:data.recipient, value:data.value,_type:context},(data)=>{
    if(data.error){
      $scope.movData.error=data.msg?data.msg:data.error;
      $scope.$apply();
      return;
    }
    
    $scope.goto('confirm');
    
 $scope.movData={
   contact:"",
   amount:"",
   error:""
 };
    $scope.movData.error="";
    $scope.transactionDetailsState="block";
    $scope.confirmPlaceState="none";
    data["recipient"]=contact ;
    $scope.data_to_send=data;
    
    $scope.$apply();
  });
  
  $scope.confirmButtonState="";
 }
 $scope.scanQrCode=()=>{
   if(typeof qrCode==="undefined"){
    swal("erro","essa funcionalidade nao esta disponível","error");
  /* var str=`{"c":"844848527","t":"send_money","v":100}`;*/
     return;
   }
   qrCode.scan("readCode");
 }
 $scope.Reqpayment={
   target:"",
   _value:"",
   _ButtonStat:"on",
   send:()=>{
     if($scope.Reqpayment._ButtonStat=='off'){
       return;
     }
     if($scope.Reqpayment._value=="" || $scope.Reqpayment.target==""){
       swal('Erro',"Os campos estao vazios","error");
       return;
     }
     if (isNaN($scope.Reqpayment._value)){
       swal("Erro","Insira um valor válido","error");
       return;
     }
     if (parseFloat($scope.Reqpayment._value)<1){
       swal('Erro',"Insira um valor acima de 1 MZN");
       return;
     }
     $scope.Reqpayment._ButtonStat="off";
     app_urls.request("request_payment",{token:sessionStorage.getItem("token"),target:$scope.Reqpayment.target, value:$scope.Reqpayment._value},(res)=>{
       console.log(res)
       if(res.ok || !res.error){
         swal("Notificação","Solicitou dinheiro para "+$scope.Reqpayment.target+", com sucesso!","success").then(()=>{
           history.go(-1);
         })
         $scope.Reqpayment.target="";
         $scope.Reqpayment._value="";
         $scope.Reqpayment._ButtonStat="on";
         $scope.$apply();
         return;
       }
       if(res.error){
         
         $scope.Reqpayment.target="";
         $scope.Reqpayment._value="";
         $scope.Reqpayment._ButtonStat="on";
         $scope.$apply();
         swal("erro",res.msg?res.msg:res.error,"error");
         return;
       }
     });
   }
 }
 $scope.payRequests=()=>{
   app_urls.request("payment_request",{token:sessionStorage.getItem('token')},(res)=>{
     console.log(res);
     if(res.error){
       swal("erro",res.msg?res.msg:res.error,"error");
       return;
     }
     $scope.requests=JSON.parse(res.data);
     $scope.goto("paymentRequests")
   });
 }
 $scope.cancelT=(id="")=>{
   if(id!=""){
     $scope.data_to_send={};
     app_urls.request("payment_request_event_cancel",{token:sessionStorage.getItem("token"),id},(res)=>{
       if (res.ok){
         swal("Confirmado","Cancelou a solicitação com sucesso!","success").then(()=>{
           $scope.data_to_send={};
           $scope.goto('')
         });
         return;
       }
       if(res.error){
         swal("ocorreu um erro ao cancelar",res.msg?res.msg:res.error,"error").then(()=>{
           $scope.data_to_send={};
           $scope.goto('')
         });
         return;
       }
     })
     return;
   }
   $scope.data_to_send={};
   $scope.goto('');
   return;
 }
 $scope.processRequest=(objectTransction)=>{
   $scope.data_to_send=objectTransction;
   $scope.goto("processRequest")
    $scope.transactionDetailsState="block";
    $scope.confirmPlaceState="none";
   return;
 }
 $scope.finalize=(id="")=>{
    if(id!=""){
      app_urls.request("payment_request_event_confirm",{token:sessionStorage.getItem("token"),id},(res)=>{
        if(res.error){
          swal("Erro ao concluir transação",res.msg?res.msg:res.error,"error").then(()=>{
              $scope.data_to_send={};
          goto("")
          })
        return;
        }
        swal("A operação ocorreu com sucesso","A transacção foi confirmada com sucesso","success").then(()=>{
          $scope.data_to_send={};
          goto('')
        })
      });
      return;
    }
   if($scope.data_to_send=={}) return;
   app_urls.request("transaction",{token:window.sessionStorage.getItem("token"),value:$scope.data_to_send._value, _to:$scope.data_to_send._to,_from:$scope.data_to_send._from},(data)=>{
     $scope.data_to_send={};
     if(data.error){
       swal("Erro","A transação falhou","error").then(()=>{
         goto("")
       });
       $scope.$apply();
       return;
     }
     swal("Confirmado","A transação ocorreu com sucesso","success").then(()=>{
       goto('')
     })
     $scope.$apply();
     return;
   });
  
 }
 $scope.loginTextState="ENTRAR";
 $scope.mainmenu=mainPageList;
 $scope.toolIsActive="block";
 $scope.activeTool="home";
 $scope.tools={send_money:"none",withdraw:"none",pay:"none",qr_code:"none"};
 $scope.restore=()=>{
   $scope.toolIsActive="block";
   $scope.bodyState="none";
 }
 $scope.user_auth={
   contact:window.localStorage.getItem("last_used_contact")==null?"":window.localStorage.getItem("last_used_contact"),
   password:""
 }
 $scope.login=()=>{
   if($scope.loginTextState=="...") return;
  $scope.errorPlace="";
   $scope.loginTextState="...";
   var contact=$scope.user_auth.contact, password=$scope.user_auth.password;
   if(contact=="" || password==""){
     $scope.errorPlace="os campos estão vazios!";
     $scope.loginTextState="ENTRAR";
     return;
   }
   login(contact, password,(data)=>{
     $scope.loginTextState="ENTRAR";
     $scope.$apply();
    
     if(data.error){
      
       $scope.errorPlace=data.msg?data.msg:data.error;
       $scope.$apply();
       return;
     }
     if(data.token){
      sessionStorage.setItem("token",data.token);
      localStorage.setItem("last_used_contact",$scope.user_auth.contact);
      localStorage.setItem("l_u_p",$scope.user_auth.password);
      $scope.user_auth.password="";
      $scope.initHome();
      $scope.$apply();
      $scope.goto("");
    }else{
      $scope.errorPlace="Falha ao conectar ao servidor, tente novamente";
      $scope.$apply();
    }
   });
 }
 $scope.setToolState=(tool,auto=false)=>{
   $scope.confirmButtonState="";
  if(!auto){
  $scope.movData.contact="";
  $scope.movData.amount="";
  }
  $scope.movData.error="";
 $scope.movData.error="";
 let keys=Object.keys($scope.tools);
 if(keys.indexOf(tool)<0){
   return;
 }
 keys.forEach((i)=>{
   $scope.tools[i]="none";
 })
 $scope.tools[tool]="block"
 $scope.toolIsActive="none";
 $scope.bodyState="block"
 $scope.toolTitle=_mainPageTools[tool].title;
 $scope.toolDescription=_mainPageTools[tool].description ;
  
qrcode(JSON.stringify({
  t:($scope.userData._type=="individual")?"send_money":"pay",
  c:($scope.userData._type=="individual")?$scope.userData.phone:$scope.userData.short_code
}));


 }
 
 $scope.bodyState=$scope.toolIsActive=='none'?'block':'none';
$scope.menuItemClicked=(context)=>{
  try{
    $scope[context]();
  }
  catch (e){
    console.error(e)
  }
}

$scope.qr_code_data={
  value:0
}
$scope.setQrCode=()=>{  
  if(parseFloat($scope.qr_code_data.value)>0){
    
    qrcode(JSON.stringify({
  t: ($scope.userData._type == "individual") ? "send_money" : "pay",
  c: ($scope.userData._type == "individual") ? $scope.userData.phone : $scope.userData.short_code,
  v:$scope.qr_code_data.value
}),true);

  }
}

$scope.viewHistory=()=>{
  app_urls.request('history_url',{token: window.sessionStorage.getItem("token")},(data)=>{
    if(data.error){
      ons.notification.alert("um erro ocorreu no servidor");
      return;
    }
    try{
      const transactions=JSON.parse(data["data"]);
      
      if(transactions.length<1){
        $scope.transactions="O seu histórico esta vazio!";
        $scope.$apply();
       swal($scope.transactions)
       return;
      }
      
      console.log(transactions)
      var lists=[];
      for(i in transactions){
        var init_str="";
        switch(transactions[i]._type){
          case "i2i" :
            case "b2i":
            init_str=`ID transação: ${transactions[i].id} ,enviou, ${transactions[i]._value} MT, data: ${transactions[i]._date}`;break;
          case "i2a" :
            case "b2a":
            init_str=`levantou, ${transactions[i]._value} MT`;break;
          default:
          init_str="Não ha nada Aqui!";
          break;
        }
        lists.push(init_str);
      }
      $scope.transactions=lists;
      $scope.$apply();
      goto("history");
     
      //console.log(transactions);
    } catch (err){
      
    }
  })
}
$scope.requestPayment=()=>{
  if($scope.userData._type=="business"){
    app_urls.request("requestPayment_list",{token:sessionStorage.getItem("token")
    },(res)=>{
      console.log(res);
      
    goto('requestPayment');
    })
  }
}
$scope.changePasswordPage=()=>{
  goto('change-password');
}
$scope.passwordManager={
    oldPassword:"",
    newPassword:"",
    error:""
  };
$scope.changePassword=()=>{
  if ($scope.passwordManager.oldPassword=="" || $scope.passwordManager.newPassword==""){
    $scope.passwordManager.error="Preencha os campos para continuar."
    return;
  }
  if($scope.passwordManager.oldPassword!=$scope.userData.password){
    $scope.passwordManager.error="a palavra passe antiga nao corresponde";
    $scope.$apply()
    return;
  }
  app_urls.request("change_password",{token: window.sessionStorage.getItem("token"),oldPassword:$scope.passwordManager.oldPassword,newPassword:$scope.passwordManager.newPassword},(data)=>{
    if(data.error){
      $scope.passwordManager.error=data.msg?data.msg:data.error
      $scope.$apply();
      return;
    }
    else{
     
      ons.notification.alert("a palavra passe foi alterada com sucesso").then(()=>{
        window.history.go(-1);
      });
    }
  })
  
}
$scope.logout=()=>{
  
swal({
    title: "Tem certeza?",
    text: "Deseja mesmo terminar a sessão?",
    icon: "success",
    buttons: {
        cancel: "Cancelar",
        confirm: "terminar",
    },
    dangerMode: true,  // Para mostrar que é uma ação perigosa
}).then((willDelete) => {
    if (willDelete) {
      
      $scope.userData="";
  window.sessionStorage.clear();
  $scope.goto('login');
  
    } else {
       
    }
});
  
}
});

app.config(["$routeProvider",($route)=>{
  $route.when("/",{
    templateUrl:"./views/home.htm"
  }).when("/login",{
    templateUrl:"./views/login.htm"
  }).when("/confirm",{
    templateUrl:"./views/confirm.htm"
  }).when("/history",{
    templateUrl:"./views/h.htm"
  }).when("/change-password",{
    templateUrl:"./views/ch.htm"
  }).when("/paymentRequests",{
    templateUrl:"./views/moneyRequests.htm"
  }).when("/requestPayment",{
    templateUrl:'./views/requestMoney.htm'
  }).when("/processRequest",{
    templateUrl:"./views/processPayment.htm"
  })
  .otherwise ({
    redirectTo:'/'
  })
}]);
app.directive("withdrawView",()=>{
  return {
    template:_mainPageTools["withdraw"].template
  };
});
app.directive("sendmoneyView",()=>{
  return {
    template:_mainPageTools.send_money.template
  };
});
app.directive("alertSuccess",()=>{
  return{
    templateUrl:"./views/alertSucess.htm"
  };
});
app.directive("payView",()=>{
  return {
    template:_mainPageTools.pay.template
  };
});
app.directive("qrcodeView",()=>{
  return {
    template:_mainPageTools.qr_code.template
  };
});
function login (usercontact,password, callback){
  
  app_urls.request("login_url",{usercontact,password},callback);
}