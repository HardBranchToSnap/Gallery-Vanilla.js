(function(){
  var TOTAL_PREV_PICS = 26; 

  var DESCRIPTIONS = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами, и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var COMMENT_SENTENCES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Если б моя бабушка случайно чихнула с фотоаппаратом в руках, она бы сфоткала лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают.',
    'Как можно было поймать такой неудачный момент?!'
  ];

  // moaking functions
  window.photos = function(){
    var photos = [];
    for(i=0; i<TOTAL_PREV_PICS; i++){
      var obj = {
        url: 'photos/' + (i+1) + '.jpg',
        likes: window.Support.getRandomValueFromTo(15, 200),
        comments: window.Support.getRandomFrom(COMMENT_SENTENCES),
        description: window.Support.getRandomFrom(DESCRIPTIONS)
      };
    photos.push(obj);
    }
    window.Support.shuffle(photos);
    console.log(photos);
    return photos;
  }();

}());