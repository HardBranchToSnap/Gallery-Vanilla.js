(function(){
  var URL = 'https://api.myjson.com/bins/6x864';
  var SERVER_WAITING_TIME = 15000;

  var MESSAGE = {
    defaultError: 'Что-то пошло не так',
    timeout: 'Слишком долгое ожидание отклика сервера'
  };

  window.loaddata = function(){
    return new Promise(function(succeed, fail){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', URL);
      xhr.responseType = 'json';
      xhr.timeout = SERVER_WAITING_TIME;

      xhr.addEventListener('load', function(){
        if (xhr.status < 400)
          succeed(xhr.response);
        else
          fail(MESSAGE.defaultError);
      });

      xhr.addEventListener('error', function(){
          fail(MESSAGE.defaultError);
      });

      xhr.addEventListener('timeout', function(){
          fail (MESSAGE.timeout);
      });

      xhr.send();
    });
  };

}());
