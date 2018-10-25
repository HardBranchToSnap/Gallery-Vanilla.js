(function(){
  var URL = 'http://httpbin.org/post';
  
  window.upload = function(data){
    return new Promise(function(succeed, fail){
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function(){
        succeed('Success');
      });

      xhr.addEventListener('error', function(){
        fail('Ошибка соединения с сервером, попробуйте повторить запрос позже');
      });

      xhr.open('POST', URL);
      xhr.send(data);
    });
  };

}());