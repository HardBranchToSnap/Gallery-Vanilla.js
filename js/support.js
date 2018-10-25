// Support functions module
(function(){
  window.KeyCode = {
    ESC: 27,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    SPACE: 32
  };

  window.toggleSlider = function(step, flag, line, progress, callback){
    var lineWidth = line.offsetWidth;

    var flagCoordsPixel = flag.offsetLeft - step;

    var flagCoordsPercent = (flagCoordsPixel / lineWidth) * 100;

    // Устанавливаем рамки передвижения
    if(flagCoordsPercent >= 0 && flagCoordsPercent<= 100){
      flag.style.left = flagCoordsPercent + '%';
      progress.style.width = flagCoordsPercent + '%';

      callback(flagCoordsPercent);
    }
  };

  window.Support = {
    togglePopup: function(element){
      var thisElement = typeof element == 'string' ? document.querySelector(element) : element;
      thisElement.classList.toggle('hidden');
    },

    getRandomValueFromTo: function(min, max){
      var randomValue = Math.floor(Math.random() * (max - min) + min);
      return randomValue;
    },

    getRandomSentences: function(sentencesArray, maxSentences){
      var suffledComments = shuffle(sentencesArray);
      var comments = [];
      for(i=0; i<maxSentences; i++){
        comments.push(suffledComments[i]);
      }
      return comments;
    },

    getRandomFrom: function(array){
      var shuffled = this.shuffle(array);
      var newArr = [];
      newArr.push(shuffled[0]);
      return newArr;
    },

    shuffle: function(array){
      var compareRandom = function(a, b) {
        return Math.random() - 0.5;
      };
      return array.sort(compareRandom);
    },

    removeAllChilds: function(element){
      while (element.firstChild) {
            element.removeChild(element.firstChild);
      }
    }
  };
}());